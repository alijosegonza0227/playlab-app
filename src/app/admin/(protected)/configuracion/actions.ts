"use server";

import { revalidatePath } from "next/cache";
import { setLoyaltyVisitsGoal } from "@/lib/loyalty-server";
import { LOYALTY_VISITS_GOAL_MIN, LOYALTY_VISITS_GOAL_MAX } from "@/lib/loyalty";

export type ConfigFormState = { error?: string; success?: boolean };

export async function updateLoyaltyGoal(
  _prevState: ConfigFormState,
  formData: FormData
): Promise<ConfigFormState> {
  const raw = formData.get("loyaltyGoal");
  const goal = typeof raw === "string" ? Number.parseInt(raw, 10) : NaN;

  if (Number.isNaN(goal) || goal < LOYALTY_VISITS_GOAL_MIN || goal > LOYALTY_VISITS_GOAL_MAX) {
    return { error: `Elige un número entre ${LOYALTY_VISITS_GOAL_MIN} y ${LOYALTY_VISITS_GOAL_MAX}.` };
  }

  await setLoyaltyVisitsGoal(goal);
  revalidatePath("/admin/configuracion");
  revalidatePath("/admin/reservas");
  revalidatePath("/mi-cupon");
  return { success: true };
}
