"use client";

import { useActionState } from "react";
import { addParkVisitToCart, type ReservationFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TIME_RATE_LABELS, TIME_RATE_ORDER } from "@/lib/timerate";
import { formatCop } from "@/lib/money";
import type { TimeRateDuration } from "@/generated/prisma/client";

const initialState: ReservationFormState = {};

type TimeRateOption = { duration: TimeRateDuration; priceCents: number; extraAdultCents: number };

export function ReservaForm({ timeRates }: { timeRates: TimeRateOption[] }) {
  const [state, formAction, pending] = useActionState(addParkVisitToCart, initialState);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date">Fecha</Label>
          <Input id="date" name="date" type="date" min={today} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="time">Hora</Label>
          <Input id="time" name="time" type="time" required />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Tiempo de juego</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TIME_RATE_ORDER.map((duration, i) => {
            const rate = timeRates.find((r) => r.duration === duration);
            if (!rate) return null;
            const colors = ["border-rainbow-purple", "border-rainbow-green", "border-rainbow-orange", "border-rainbow-coral"];
            return (
              <label
                key={duration}
                className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 ${colors[i % colors.length]} p-3 text-center has-[:checked]:bg-muted`}
              >
                <input type="radio" name="duration" value={duration} defaultChecked={i === 1} className="sr-only" required />
                <span className="font-display text-sm font-bold">{TIME_RATE_LABELS[duration]}</span>
                <span className="text-xs text-muted-foreground">{formatCop(rate.priceCents)}/niño</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="children">Número de niños</Label>
          <Input id="children" name="children" type="number" min={1} defaultValue={1} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="extraAdults">Adultos adicionales</Label>
          <Input id="extraAdults" name="extraAdults" type="number" min={0} defaultValue={0} />
          <p className="text-xs text-muted-foreground">Cada niño ya incluye 2 adultos acompañantes.</p>
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Agregando..." : "Agregar reserva al carrito"}
      </Button>
    </form>
  );
}
