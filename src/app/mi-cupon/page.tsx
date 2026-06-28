import { PlaylabDecor } from "@/components/playlab-decor";
import { PlayLabLogo } from "@/components/playlab-logo";
import { LoyaltyForm } from "./loyalty-form";
import { getLoyaltyVisitsGoal } from "@/lib/loyalty-server";

export const dynamic = "force-dynamic";

export default async function MiCuponPage() {
  const loyaltyGoal = await getLoyaltyVisitsGoal();

  return (
    <div>
      <section className="playlab-sky-bg relative overflow-hidden">
        <PlaylabDecor className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="relative mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-14 text-center">
          <PlayLabLogo size="md" />
          <h1 className="font-display text-2xl font-extrabold text-white drop-shadow-sm">Mi cuponera</h1>
          <p className="text-sm font-medium text-white/90">
            Cada {loyaltyGoal} visitas al parque, la siguiente es gratis. Escribe tu teléfono para ver cuánto te
            falta.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-md px-4 py-10">
        <LoyaltyForm />
      </div>
    </div>
  );
}
