const formatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** `cents` aquí sigue la convención de Wompi: pesos COP * 100 (sin centavos reales en circulación). */
export function formatCop(cents: number) {
  return formatter.format(cents / 100);
}
