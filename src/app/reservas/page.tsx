import { prisma } from "@/lib/prisma";
import { ReservaForm } from "./reserva-form";
import { TIME_RATE_ORDER } from "@/lib/timerate";

export const dynamic = "force-dynamic";

export default async function ReservasPage() {
  const timeRates = await prisma.timeRate.findMany({
    where: { active: true, duration: { in: TIME_RATE_ORDER } },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display mb-1 text-3xl font-extrabold tracking-tight">Reserva tu visita</h1>
      <p className="mb-2 text-muted-foreground">
        Elige fecha, hora y tiempo de juego. El valor es por niño e incluye 2 adultos acompañantes.
      </p>
      <p className="mb-8 rounded-md bg-muted p-3 text-sm text-muted-foreground">
        Horarios: lunes a jueves 2:00pm–8:00pm · viernes 2:00pm–9:00pm · sábados, domingos y festivos
        11:00am–9:00pm. La disponibilidad final se confirma con el parque.
      </p>

      <ReservaForm timeRates={timeRates} />
    </div>
  );
}
