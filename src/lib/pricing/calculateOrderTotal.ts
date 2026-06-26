import type { OrderLineItem } from "@/generated/prisma/client";

/**
 * Punto único de cálculo de totales. Suma líneas heterogéneas de la orden;
 * cada fase posterior (reservas, cumpleaños, promociones) le añade tipos de línea
 * aquí en vez de crear un cálculo de precio paralelo.
 */
export function calculateOrderTotal(lineItems: Pick<OrderLineItem, "quantity" | "unitPriceCents">[]) {
  const subtotalCents = lineItems.reduce((sum, line) => sum + line.quantity * line.unitPriceCents, 0);
  const discountCents = 0; // TODO Fase 4: aplicar PromotionRule activas para el día actual.
  const totalCents = subtotalCents - discountCents;

  return { subtotalCents, discountCents, totalCents };
}
