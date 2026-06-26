"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateCartOrder, ensureFulfillmentType, recalculateOrderTotals } from "@/lib/cart";
import { TIME_RATE_ORDER } from "@/lib/timerate";
import type { TimeRateDuration } from "@/generated/prisma/client";

const reservationSchema = z.object({
  date: z.string().min(1, "Selecciona una fecha"),
  time: z.string().min(1, "Selecciona una hora"),
  duration: z.enum(TIME_RATE_ORDER as [string, ...string[]]),
  children: z.coerce.number().int().min(1, "Debe ser al menos 1 niño"),
  extraAdults: z.coerce.number().int().min(0),
});

export type ReservationFormState = { error?: string };

export async function addParkVisitToCart(
  _prevState: ReservationFormState,
  formData: FormData
): Promise<ReservationFormState> {
  const parsed = reservationSchema.safeParse({
    date: formData.get("date"),
    time: formData.get("time"),
    duration: formData.get("duration"),
    children: formData.get("children"),
    extraAdults: formData.get("extraAdults"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { date, time, children, extraAdults } = parsed.data;
  const duration = parsed.data.duration as TimeRateDuration;

  const timeRate = await prisma.timeRate.findUnique({ where: { duration } });
  if (!timeRate || !timeRate.active) {
    return { error: "Esa tarifa no está disponible." };
  }

  const startsAt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(startsAt.getTime())) {
    return { error: "Fecha u hora inválida." };
  }
  if (startsAt.getTime() < Date.now()) {
    return { error: "Elige una fecha y hora futuras." };
  }

  const durationMinutes = { MIN_30: 30, HOUR_1: 60, HOUR_2: 120, UNLIMITED: 240 }[duration];
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);

  const unitPriceCents = children * timeRate.priceCents + extraAdults * timeRate.extraAdultCents;

  const order = await getOrCreateCartOrder();
  await ensureFulfillmentType(order, "PARK_VISIT");

  await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.create({
      data: {
        orderId: order.id,
        reservationType: "STANDARD",
        status: "PENDING",
        startsAt,
        endsAt,
        partySize: children + extraAdults + 2,
      },
    });

    await tx.orderLineItem.create({
      data: {
        orderId: order.id,
        lineType: "PARK_VISIT_SLOT",
        timeRateId: timeRate.id,
        reservationId: reservation.id,
        quantity: 1,
        unitPriceCents,
        childrenCount: children,
        extraAdultsCount: extraAdults,
      },
    });
  });

  await recalculateOrderTotals(order.id);
  revalidatePath("/cart");
  redirect("/cart");
}
