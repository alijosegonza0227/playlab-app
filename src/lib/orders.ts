import "server-only";
import { prisma } from "@/lib/prisma";

/** Usado tanto por el webhook real de Wompi como por el modo de pago simulado (pruebas). */
export async function approvePayment(paymentId: string, wompiTransactionId: string) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.update({
      where: { id: paymentId },
      data: { status: "APPROVED", wompiTransactionId },
    });

    const order = await tx.order.findUnique({ where: { id: payment.orderId } });
    if (order) {
      const amountPaidCents = order.amountPaidCents + payment.amountCents;
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "CONFIRMED",
          amountPaidCents,
          amountDueCents: Math.max(order.totalCents - amountPaidCents, 0),
        },
      });
    }

    return payment;
  });
}

export async function failPayment(
  paymentId: string,
  status: "DECLINED" | "VOIDED" | "ERROR",
  wompiTransactionId?: string
) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.update({
      where: { id: paymentId },
      data: { status, ...(wompiTransactionId ? { wompiTransactionId } : {}) },
    });
    await tx.order.update({ where: { id: payment.orderId }, data: { status: "CANCELLED" } });
    return payment;
  });
}
