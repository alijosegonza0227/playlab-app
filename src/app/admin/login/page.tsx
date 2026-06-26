"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlayLabLogo } from "@/components/playlab-logo";

const initialState: LoginFormState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <div className="playlab-sky-bg flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white/95 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-6 flex flex-col items-center gap-1">
          <PlayLabLogo size="md" />
          <p className="font-display text-sm font-bold text-muted-foreground">Panel administrador</p>
        </div>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" disabled={pending} size="lg" className="bg-rainbow-coral hover:bg-rainbow-coral/90">
            {pending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
