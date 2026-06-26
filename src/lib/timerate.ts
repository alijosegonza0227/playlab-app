import type { TimeRateDuration } from "@/generated/prisma/client";

export const TIME_RATE_LABELS: Record<TimeRateDuration, string> = {
  MIN_30: "30 minutos",
  HOUR_1: "1 hora",
  HOUR_2: "2 horas",
  UNLIMITED: "Ilimitado",
};

export const TIME_RATE_ORDER: TimeRateDuration[] = ["MIN_30", "HOUR_1", "HOUR_2", "UNLIMITED"];
