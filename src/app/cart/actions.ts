"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCartOrder, recalculateOrderTotals } from "@/lib/cart";

async function assertOwnsLine(lineItemId: string) {
  const order = await getCartOrder();
  if (!order) throw new Error("No hay un carrito activo.");
  const line = order.lineItems.find((l) => l.id === lineItemId);
  if (!line) throw new Error("Esa línea no pertenece a tu carrito.");
  return { order, line };
}

export async function updateLineQuantity(lineItemId: string, quantity: number) {
  const { order } = await assertOwnsLine(lineItemId);

  if (quantity <= 0) {
    await prisma.orderLineItem.delete({ where: { id: lineItemId } });
  } else {
    await prisma.orderLineItem.update({ where: { id: lineItemId }, data: { quantity } });
  }

  await recalculateOrderTotals(order.id);
  revalidatePath("/cart");
}

export async function removeLineItem(lineItemId: string) {
  const { order } = await assertOwnsLine(lineItemId);
  await prisma.orderLineItem.delete({ where: { id: lineItemId } });
  await recalculateOrderTotals(order.id);
  revalidatePath("/cart");
}
