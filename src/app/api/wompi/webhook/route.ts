import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWompiWebhookSignature, type WompiWebhookEvent } from "@/lib/wompi/client";
import { approvePayment, failPayment } from "@/lib/orders";

export async function POST(req: Request) {
  const event = (await req.json()) as WompiWebhookEvent;

  if (!verifyWompiWebhookSignature(event)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const transaction = event.data.transaction as
    | { id: string; reference: string; status: string; amount_in_cents: number }
    | undefined;
  if (!transaction) {
    return NextResponse.json({ error: "missing_transaction" }, { status: 400 });
  }

  const eventId = `${transaction.id}:${transaction.status}:${event.timestamp}`;

  const alreadyProcessed = await prisma.wompiWebhookEvent.findUnique({ where: { wompiEventId: eventId } });
  if (alreadyProcessed?.processed) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  await prisma.wompiWebhookEvent.upsert({
    where: { wompiEventId: eventId },
    update: {},
    create: { wompiEventId: eventId, payload: event as object, processed: false },
  });

  const payment = await prisma.payment.findUnique({ where: { wompiReference: transaction.reference } });
  if (!payment) {
    return NextResponse.json({ error: "payment_not_found" }, { status: 404 });
  }

  if (transaction.status === "APPROVED") {
    await approvePayment(payment.id, transaction.id);
  } else if (transaction.status === "DECLINED" || transaction.status === "ERROR" || transaction.status === "VOIDED") {
    await failPayment(payment.id, transaction.status, transaction.id);
  }

  await prisma.wompiWebhookEvent.update({ where: { wompiEventId: eventId }, data: { processed: true } });

  return NextResponse.json({ ok: true });
}
