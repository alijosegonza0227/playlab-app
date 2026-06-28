import "server-only";
import { getSetting, setSetting } from "@/lib/settings";
import { DEFAULT_LOYALTY_VISITS_GOAL, LOYALTY_VISITS_GOAL_MIN, LOYALTY_VISITS_GOAL_MAX } from "@/lib/loyalty";

const LOYALTY_VISITS_GOAL_KEY = "loyalty_visits_goal";

export async function getLoyaltyVisitsGoal(): Promise<number> {
  const value = await getSetting(LOYALTY_VISITS_GOAL_KEY);
  const parsed = value ? Number.parseInt(value, 10) : NaN;
  if (Number.isNaN(parsed) || parsed < LOYALTY_VISITS_GOAL_MIN || parsed > LOYALTY_VISITS_GOAL_MAX) {
    return DEFAULT_LOYALTY_VISITS_GOAL;
  }
  return parsed;
}

export async function setLoyaltyVisitsGoal(goal: number) {
  await setSetting(LOYALTY_VISITS_GOAL_KEY, String(goal));
}
