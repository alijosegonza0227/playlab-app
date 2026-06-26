import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { FulfillmentType, Prisma } from "@/generated/prisma/client";
import { calculateOrderTotal } from "@/lib/pricing/calculateOrderTotal";

const CART_COOKIE = "playlab_cart_order_id";

const lineItemsInclude = {
  lineItems: {
    include: { product: true, timeRate: true, reservation: true },
    orderBy: { createdAt: "asc" },
  },
} satisfies Prisma.OrderInclude;

type CartOrder = Prisma.OrderGetPayload<{ include: typeof lineItemsInclude }>;
type CheckoutOrder = Prisma.OrderGetPayload<{
  include: typeof lineItemsInclude & { customer: true };
}>;

/** Solo carritos en estado CART: usado para mutaciones (agregar/editar/quitar líneas). */
export async function getCartOrder(): Promise<CartOrder | null> {
  const cookieStore = await cookies();
  const orderId = cookieStore.get(CART_COOKIE)?.value;
  if (!orderId) return null;

  return prisma.order.findFirst({
    where: { id: orderId, status: "CART" },
    include: lineItemsInclude,
  });
}

/**
 * CART o PENDING_PAYMENT: usado en checkout, que sigue siendo "la orden activa" del
 * cookie aunque ya haya pasado de carrito a esperando pago.
 */
export async function getActiveOrderForCheckout(): Promise<CheckoutOrder | null> {
  const cookieStore = await cookies();
  const orderId = cookieStore.get(CART_COOKIE)?.value;
  if (!orderId) return null;

  return prisma.order.findFirst({
    where: { id: orderId, status: { in: ["CART", "PENDING_PAYMENT"] } },
    include: { ...lineItemsInclude, customer: true },
  });
}

export async function getOrCreateCartOrder(): Promise<CartOrder> {
  const existing = await getCartOrder();
  if (existing) return existing;

  const order = await prisma.order.create({
    data: { status: "CART", fulfillmentTypes: [] },
    include: lineItemsInclude,
  });

  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, order.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return order;
}

export async function ensureFulfillmentType(order: { id: string; fulfillmentTypes: FulfillmentType[] }, type: FulfillmentType) {
  if (order.fulfillmentTypes.includes(type)) return;
  await prisma.order.update({
    where: { id: order.id },
    data: { fulfillmentTypes: { push: type } },
  });
}

export async function clearCartCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}

export async function recalculateOrderTotals(orderId: string) {
  const lineItems = await prisma.orderLineItem.findMany({
    where: { orderId },
    select: { quantity: true, unitPriceCents: true },
  });
  const { subtotalCents, discountCents, totalCents } = calculateOrderTotal(lineItems);

  return prisma.order.update({
    where: { id: orderId },
    data: { subtotalCents, discountCents, totalCents, amountDueCents: totalCents },
  });
}
