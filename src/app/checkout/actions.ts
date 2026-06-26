"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCartOrder, getActiveOrderForCheckout } from "@/lib/cart";
import { signWidgetIntegrity, isWompiConfigured } from "@/lib/wompi/client";
import { approvePayment } from "@/lib/orders";

const checkoutSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo"),
  phone: z.string().min(7, "Ingresa un número de teléfono válido"),
  email: z.string().email("Ingresa un email válido"),
  deliveryAddress: z.string().min(5, "Ingresa la dirección de entrega"),
});

export type CheckoutFormState = {
  error?: string;
};

export async function submitCheckoutInfo(_prevState: CheckoutFormState, formData: FormData): Promise<CheckoutFormState> {
  const parsed = checkoutSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    deliveryAddress: formData.get("deliveryAddress"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const order = await getCartOrder();
  if (!order || order.lineItems.length === 0) {
    return { error: "Tu carrito está vacío." };
  }

  const { name, phone, email, deliveryAddress } = parsed.data;

  const customer = await prisma.customer.upsert({
    where: { phone },
    update: { name, email },
    create: { name, phone, email },
  });

  const reference = `order_${order.id}_${Date.now()}`;

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { customerId: customer.id, deliveryAddress, status: "PENDING_PAYMENT" },
    }),
    prisma.payment.create({
      data: {
        orderId: order.id,
        kind: "FULL",
        amountCents: order.totalCents,
        status: "PENDING",
        wompiReference: reference,
      },
    }),
  ]);

  revalidatePath("/checkout");
  return {};
}

export async function getWidgetParamsForCart() {
  const order = await getActiveOrderForCheckout();
  if (!order) return null;

  const payment = await prisma.payment.findFirst({
    where: { orderId: order.id, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
  if (!payment) return null;

  return {
    reference: payment.wompiReference,
    amountInCents: payment.amountCents,
    signature: signWidgetIntegrity(payment.wompiReference, payment.amountCents),
  };
}

/**
 * Modo de prueba mientras no tenemos llaves reales de Wompi: simula exactamente lo que
 * haría el webhook real (aprobar el pago y confirmar la orden), para poder probar todo
 * el flujo de punta a punta antes de conectar la pasarela de verdad.
 */
export async function simulateWompiPayment(orderId: string) {
  if (isWompiConfigured()) {
    throw new Error("Wompi ya está configurado; usa el pago real en vez del simulado.");
  }

  const payment = await prisma.payment.findFirst({
    where: { orderId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
  if (!payment) {
    throw new Error("No hay un pago pendiente para esta orden.");
  }

  await approvePayment(payment.id, `fake_${Date.now()}`);

  redirect(`/checkout/confirmacion?orderId=${orderId}`);
}
