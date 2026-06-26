import { TIME_RATE_LABELS } from "@/lib/timerate";
import type { TimeRateDuration } from "@/generated/prisma/client";

type DisplayLineItem = {
  lineType: string;
  product?: { name: string } | null;
  timeRate?: { duration: TimeRateDuration } | null;
  reservation?: { startsAt: Date } | null;
  childrenCount?: number | null;
  extraAdultsCount?: number | null;
};

export function lineItemLabel(line: DisplayLineItem): string {
  if (line.lineType === "PRODUCT") {
    return line.product?.name ?? "Producto";
  }

  if (line.lineType === "PARK_VISIT_SLOT") {
    const durationLabel = line.timeRate ? TIME_RATE_LABELS[line.timeRate.duration] : "Visita";
    const dateLabel = line.reservation
      ? line.reservation.startsAt.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })
      : "";
    const kids = line.childrenCount ?? 0;
    const adults = line.extraAdultsCount ?? 0;
    return `Visita al parque · ${durationLabel} · ${kids} niño(s)${adults > 0 ? ` + ${adults} adulto(s) extra` : ""}${dateLabel ? ` · ${dateLabel}` : ""}`;
  }

  return "Ítem de fiesta de cumpleaños";
}
