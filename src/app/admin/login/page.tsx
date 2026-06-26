"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginFormState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-20">
      <h1 className="text-2xl font-extrabold">Panel admin Play Lab</h1>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
