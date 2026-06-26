import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNav } from "@/components/admin-nav";
import { TIME_RATE_LABELS } from "@/lib/timerate";
import { updateReservationStatus } from "./actions";
import { RescheduleForm } from "./reschedule-form";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CHECKED_IN: "En el parque",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No llegó",
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  PENDING: "bg-rainbow-yellow text-foreground",
  CONFIRMED: "bg-rainbow-green text-white",
  CHECKED_IN: "bg-rainbow-sky text-white",
  COMPLETED: "bg-rainbow-purple text-white",
  CANCELLED: "bg-rainbow-coral text-white",
  NO_SHOW: "bg-muted text-foreground",
};

const STATUS_BORDER_CLASS: Record<string, string> = {
  PENDING: "border-l-rainbow-yellow",
  CONFIRMED: "border-l-rainbow-green",
  CHECKED_IN: "border-l-rainbow-sky",
  COMPLETED: "border-l-rainbow-purple",
  CANCELLED: "border-l-rainbow-coral",
  NO_SHOW: "border-l-muted-foreground",
};

export default async function AdminReservasPage() {
  const reservations = await prisma.reservation.findMany({
    where: { order: { status: { not: "CART" } } },
    orderBy: { startsAt: "asc" },
    take: 50,
    include: {
      order: { include: { customer: true } },
      orderLineItem: { include: { timeRate: true } },
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display mb-1 text-3xl font-extrabold tracking-tight">Panel admin</h1>
      <AdminNav />

      <h2 className="font-display mb-4 text-xl font-bold">Reservas de visita al parque</h2>

      {reservations.length === 0 && <p className="text-muted-foreground">Todavía no hay reservas.</p>}

      <div className="flex flex-col gap-4">
        {reservations.map((reservation) => {
          const startsAt = reservation.startsAt;
          const dateValue = startsAt.toISOString().slice(0, 10);
          const timeValue = startsAt.toISOString().slice(11, 16);
          const durationLabel = reservation.orderLineItem?.timeRate
            ? TIME_RATE_LABELS[reservation.orderLineItem.timeRate.duration]
            : "";

          return (
            <Card
              key={reservation.id}
              className={`border-l-4 ${STATUS_BORDER_CLASS[reservation.status] ?? "border-l-border"}`}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle className="font-display text-base">
                    {reservation.order.customer?.name ?? "Cliente sin nombre"} ·{" "}
                    {reservation.order.customer?.phone ?? "sin teléfono"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {startsAt.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })} · {durationLabel}{" "}
                    · {reservation.orderLineItem?.childrenCount ?? 0} niño(s)
                    {(reservation.orderLineItem?.extraAdultsCount ?? 0) > 0
                      ? ` + ${reservation.orderLineItem?.extraAdultsCount} adulto(s) extra`
                      : ""}
                  </p>
                </div>
                <Badge className={STATUS_BADGE_CLASS[reservation.status] ?? ""}>
                  {STATUS_LABELS[reservation.status] ?? reservation.status}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <RescheduleForm reservationId={reservation.id} defaultDate={dateValue} defaultTime={timeValue} />

                <div className="flex flex-wrap justify-end gap-2">
                  {reservation.status === "PENDING" && (
                    <form action={updateReservationStatus.bind(null, reservation.id, "CONFIRMED")}>
                      <Button type="submit" size="sm" className="bg-rainbow-green hover:bg-rainbow-green/90">
                        Confirmar
                      </Button>
                    </form>
                  )}
                  {reservation.status === "CONFIRMED" && (
                    <form action={updateReservationStatus.bind(null, reservation.id, "CHECKED_IN")}>
                      <Button type="submit" size="sm" className="bg-rainbow-sky hover:bg-rainbow-sky/90">
                        Marcar llegada
                      </Button>
                    </form>
                  )}
                  {reservation.status === "CHECKED_IN" && (
                    <form action={updateReservationStatus.bind(null, reservation.id, "COMPLETED")}>
                      <Button type="submit" size="sm" className="bg-rainbow-purple hover:bg-rainbow-purple/90">
                        Completar visita
                      </Button>
                    </form>
                  )}
                  {(reservation.status === "PENDING" || reservation.status === "CONFIRMED") && (
                    <>
                      <form action={updateReservationStatus.bind(null, reservation.id, "NO_SHOW")}>
                        <ConfirmSubmitButton
                          size="sm"
                          variant="outline"
                          confirmMessage="¿Seguro que quieres marcar esta reserva como 'no llegó'?"
                        >
                          No llegó
                        </ConfirmSubmitButton>
                      </form>
                      <form action={updateReservationStatus.bind(null, reservation.id, "CANCELLED")}>
                        <ConfirmSubmitButton
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          confirmMessage="¿Seguro que quieres cancelar esta reserva?"
                        >
                          Cancelar
                        </ConfirmSubmitButton>
                      </form>
                    </>
                  )}
                  {(reservation.status === "CANCELLED" || reservation.status === "NO_SHOW") && (
                    <form action={updateReservationStatus.bind(null, reservation.id, "CONFIRMED")}>
                      <ConfirmSubmitButton
                        size="sm"
                        variant="outline"
                        confirmMessage="¿Seguro que quieres reabrir esta reserva como confirmada?"
                      >
                        Reabrir como confirmada
                      </ConfirmSubmitButton>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
