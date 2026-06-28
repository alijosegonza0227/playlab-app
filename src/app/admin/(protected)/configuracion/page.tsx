import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNav } from "@/components/admin-nav";
import { getLoyaltyVisitsGoal } from "@/lib/loyalty-server";
import { LoyaltyGoalForm } from "./loyalty-goal-form";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracionPage() {
  const loyaltyGoal = await getLoyaltyVisitsGoal();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display mb-1 text-3xl font-extrabold tracking-tight">Panel admin</h1>
      <AdminNav />

      <h2 className="font-display mb-4 text-xl font-bold">Configuración</h2>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">🎟️ Cuponera de fidelización</CardTitle>
          <p className="text-sm text-muted-foreground">
            Define cuántas visitas al parque necesita una familia para que la siguiente sea gratis. Puedes
            cambiarlo cuando quieras, por ejemplo para una promoción del mes.
          </p>
        </CardHeader>
        <CardContent>
          <LoyaltyGoalForm currentGoal={loyaltyGoal} />
        </CardContent>
      </Card>
    </div>
  );
}
