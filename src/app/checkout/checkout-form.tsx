"use client";

import { useActionState } from "react";
import { submitCheckoutInfo, type CheckoutFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CheckoutFormState = {};

export function CheckoutForm() {
  const [state, formAction, pending] = useActionState(submitCheckoutInfo, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre completo</Label>
        <Input id="name" name="name" required placeholder="Ej. Ana Pérez" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Teléfono / WhatsApp</Label>
        <Input id="phone" name="phone" required placeholder="Ej. 3001234567" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="Ej. ana@email.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="deliveryAddress">Dirección de entrega</Label>
        <Input id="deliveryAddress" name="deliveryAddress" required placeholder="Calle, número, barrio, ciudad" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Guardando..." : "Continuar al pago"}
      </Button>
    </form>
  );
}
