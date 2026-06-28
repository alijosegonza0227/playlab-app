"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ReservationStatus } from "@/generated/prisma/client";

export async function updateReservationStatus(reservationId: string, status: ReservationStatus) {
  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status },
  });
  revalidatePath("/admin/reservas");
}

/**
 * Solo se permite la transición CONFIRMED -> CHECKED_IN desde aquí (no el setter genérico)
 * porque además suma 1 a la cuponera de fidelización del cliente; el `where` con status
 * evita que un doble clic vuelva a sumar el contador.
 */
export async function checkInReservation(reservationId: string) {
  await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.update({
      where: { id: reservationId, status: "CONFIRMED" },
      data: { status: "CHECKED_IN" },
    });
    if (reservation.customerId) {
      await tx.customer.update({
        where: { id: reservation.customerId },
        data: { loyaltyVisitCount: { increment: 1 } },
      });
    }
  });
  revalidatePath("/admin/reservas");
}

export async function redeemLoyaltyCoupon(customerId: string) {
  await prisma.customer.update({
    where: { id: customerId },
    data: { loyaltyVisitCount: 0 },
  });
  revalidatePath("/admin/reservas");
}

const rescheduleSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
});

export type RescheduleFormState = { error?: string };

export async function rescheduleReservation(
  reservationId: string,
  _prevState: RescheduleFormState,
  formData: FormData
): Promise<RescheduleFormState> {
  const parsed = rescheduleSchema.safeParse({
    date: formData.get("date"),
    time: formData.get("time"),
  });
  if (!parsed.success) {
    return { error: "Fecha u hora inválida." };
  }

  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) {
    return { error: "No se encontró la reserva." };
  }

  const newStartsAt = new Date(`${parsed.data.date}T${parsed.data.time}:00`);
  if (Number.isNaN(newStartsAt.getTime())) {
    return { error: "Fecha u hora inválida." };
  }

  const durationMs = reservation.endsAt.getTime() - reservation.startsAt.getTime();
  const newEndsAt = new Date(newStartsAt.getTime() + durationMs);

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { startsAt: newStartsAt, endsAt: newEndsAt },
  });

  revalidatePath("/admin/reservas");
  return {};
}
