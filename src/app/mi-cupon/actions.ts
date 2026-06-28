"use server";

import { prisma } from "@/lib/prisma";
import { getLoyaltyVisitsGoal } from "@/lib/loyalty-server";

export type LoyaltyLookupState = {
  result?: { name: string; visitCount: number; goal: number } | null;
  error?: string;
};

export async function lookupLoyalty(
  _prevState: LoyaltyLookupState,
  formData: FormData
): Promise<LoyaltyLookupState> {
  const phone = formData.get("phone");

  if (typeof phone !== "string" || phone.trim().length < 7) {
    return { error: "Ingresa un número de teléfono válido." };
  }

  const customer = await prisma.customer.findUnique({ where: { phone: phone.trim() } });

  if (!customer) {
    return { error: "No encontramos ese número. Visita el parque o pide un domicilio para empezar a acumular visitas." };
  }

  const goal = await getLoyaltyVisitsGoal();
  return { result: { name: customer.name, visitCount: customer.loyaltyVisitCount, goal } };
}
