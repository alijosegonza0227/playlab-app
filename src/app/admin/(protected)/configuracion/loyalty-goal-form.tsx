"use client";

import { useActionState } from "react";
import { updateLoyaltyGoal, type ConfigFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LOYALTY_VISITS_GOAL_MIN, LOYALTY_VISITS_GOAL_MAX } from "@/lib/loyalty";

const initialState: ConfigFormState = {};

export function LoyaltyGoalForm({ currentGoal }: { currentGoal: number }) {
  const [state, formAction, pending] = useActionState(updateLoyaltyGoal, initialState);

  const options = Array.from(
    { length: LOYALTY_VISITS_GOAL_MAX - LOYALTY_VISITS_GOAL_MIN + 1 },
    (_, i) => LOYALTY_VISITS_GOAL_MIN + i
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Label htmlFor="loyaltyGoal">Visitas necesarias para la entrada gratis</Label>
      <div className="flex items-center gap-3">
        <select
          id="loyaltyGoal"
          name="loyaltyGoal"
          defaultValue={currentGoal}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {options.map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "visita" : "visitas"}
            </option>
          ))}
        </select>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Guardando..." : "Guardar"}
        </Button>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-rainbow-green">Guardado ✓</p>}
    </form>
  );
}
