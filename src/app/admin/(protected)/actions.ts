"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function markOrderCompleted(orderId: string) {
  await prisma.order.update({
    where: { id: orderId, status: "CONFIRMED" },
    data: { status: "COMPLETED" },
  });
  revalidatePath("/admin");
}

export async function cancelOrder(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/admin");
}

export async function reopenOrder(orderId: string) {
  await prisma.order.update({
    where: { id: orderId, status: "CANCELLED" },
    data: { status: "CONFIRMED" },
  });
  revalidatePath("/admin");
}
