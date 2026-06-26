"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getOrCreateCartOrder, recalculateOrderTotals, ensureFulfillmentType } from "@/lib/cart";
import { DELIVERABLE_CATEGORIES } from "@/lib/catalog";

export async function addProductToCart(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active || !DELIVERABLE_CATEGORIES.includes(product.category)) {
    throw new Error("Producto no disponible para domicilio.");
  }

  const order = await getOrCreateCartOrder();
  await ensureFulfillmentType(order, "DELIVERY");

  const existingLine = order.lineItems.find((line) => line.productId === productId && line.lineType === "PRODUCT");

  if (existingLine) {
    await prisma.orderLineItem.update({
      where: { id: existingLine.id },
      data: { quantity: existingLine.quantity + 1 },
    });
  } else {
    await prisma.orderLineItem.create({
      data: {
        orderId: order.id,
        lineType: "PRODUCT",
        productId: product.id,
        quantity: 1,
        unitPriceCents: product.priceCents,
      },
    });
  }

  await recalculateOrderTotals(order.id);
  revalidatePath("/menu");
  revalidatePath("/cart");
}
