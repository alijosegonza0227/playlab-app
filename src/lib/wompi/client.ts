import { createHash } from "crypto";

const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY ?? "";
const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET ?? "";
const WOMPI_EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET ?? "";
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY ?? "";
const WOMPI_API_BASE = process.env.WOMPI_API_BASE ?? "https://sandbox.wompi.co/v1";

export function getWompiPublicKey() {
  return WOMPI_PUBLIC_KEY;
}

export function isWompiConfigured() {
  return Boolean(WOMPI_PUBLIC_KEY && WOMPI_INTEGRITY_SECRET);
}

/**
 * Firma de integridad para abrir el Widget (`WidgetCheckout`). Wompi exige
 * SHA256(reference + amountInCents + currency + integritySecret); debe calcularse
 * server-side porque WOMPI_INTEGRITY_SECRET nunca puede llegar al navegador.
 */
export function signWidgetIntegrity(reference: string, amountInCents: number, currency = "COP") {
  const raw = `${reference}${amountInCents}${currency}${WOMPI_INTEGRITY_SECRET}`;
  return createHash("sha256").update(raw).digest("hex");
}

export type WompiWebhookEvent = {
  event: string;
  data: Record<string, unknown>;
  sent_at: string;
  timestamp: number;
  signature: {
    properties: string[];
    checksum: string;
  };
};

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Valida la firma del webhook de Wompi. NUNCA confiar en el callback del navegador
 * para confirmar un pago — solo este webhook (verificado) es fuente de verdad.
 */
export function verifyWompiWebhookSignature(event: WompiWebhookEvent): boolean {
  const concatenatedValues = event.signature.properties
    .map((path) => String(getNestedValue(event.data, path) ?? ""))
    .join("");
  const raw = `${concatenatedValues}${event.timestamp}${WOMPI_EVENTS_SECRET}`;
  const expectedChecksum = createHash("sha256").update(raw).digest("hex").toUpperCase();
  return expectedChecksum === event.signature.checksum.toUpperCase();
}

export async function fetchWompiTransaction(transactionId: string) {
  const res = await fetch(`${WOMPI_API_BASE}/transactions/${transactionId}`);
  if (!res.ok) {
    throw new Error(`Wompi transaction lookup failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function createWompiPaymentSource(params: {
  customerEmail: string;
  acceptanceToken: string;
  paymentToken: string;
}) {
  const res = await fetch(`${WOMPI_API_BASE}/payment_sources`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
    },
    body: JSON.stringify({
      type: "CARD",
      token: params.paymentToken,
      customer_email: params.customerEmail,
      acceptance_token: params.acceptanceToken,
    }),
  });
  if (!res.ok) {
    throw new Error(`Wompi payment source creation failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}
