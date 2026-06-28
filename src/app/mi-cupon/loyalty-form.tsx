"use client";

import { useActionState } from "react";
import { lookupLoyalty, type LoyaltyLookupState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoyaltyLookupState = {};

export function LoyaltyForm() {
  const [state, formAction, pending] = useActionState(lookupLoyalty, initialState);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Número de teléfono</Label>
          <Input id="phone" name="phone" placeholder="Ej. 3001234567" required />
        </div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Buscando..." : "Ver mi progreso"}
        </Button>
      </form>

      {state.error && (
        <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{state.error}</p>
      )}

      {state.result && (
        <div className="rounded-3xl bg-white p-6 text-center shadow-lg ring-1 ring-foreground/10">
          <p className="font-display text-lg font-bold">¡Hola {state.result.name.split(" ")[0]}! 👋</p>

          {state.result.visitCount >= state.result.goal ? (
            <>
              <p className="font-display mt-2 text-2xl font-extrabold text-rainbow-coral">
                🎉 ¡Tienes una entrada gratis!
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Muéstrale esto al staff de Play Lab en tu próxima visita.
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-muted-foreground">
                Llevas{" "}
                <span className="font-display font-extrabold text-primary">{state.result.visitCount}</span> de{" "}
                {state.result.goal} visitas
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: state.result.goal }).map((_, i) => (
                  <span
                    key={i}
                    className={`flex size-8 items-center justify-center rounded-full text-sm ${
                      i < state.result!.visitCount
                        ? "bg-rainbow-green text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < state.result!.visitCount ? "✓" : i + 1}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Te faltan {state.result.goal - state.result.visitCount} visita(s) más para tu entrada gratis 🎈
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
