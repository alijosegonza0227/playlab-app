"use client";

import { useActionState } from "react";
import { rescheduleReservation, type RescheduleFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: RescheduleFormState = {};

export function RescheduleForm({
  reservationId,
  defaultDate,
  defaultTime,
}: {
  reservationId: string;
  defaultDate: string;
  defaultTime: string;
}) {
  const action = rescheduleReservation.bind(null, reservationId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <Input type="date" name="date" defaultValue={defaultDate} className="h-8 w-auto" required />
      <Input type="time" name="time" defaultValue={defaultTime} className="h-8 w-auto" required />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? "Guardando..." : "Reprogramar"}
      </Button>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
    </form>
  );
}
