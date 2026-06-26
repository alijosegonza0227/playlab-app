import { prisma } from "@/lib/prisma";
import { formatCop } from "@/lib/money";
import { lineItemLabel } from "@/lib/line-item-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNav } from "@/components/admin-nav";
import { markOrderCompleted, cancelOrder, reopenOrder } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  CART: "Carrito (sin finalizar)",
  PENDING_PAYMENT: "Esperando pago",
  CONFIRMED: "Confirmado",
  COMPLETED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  PENDING_PAYMENT: "bg-rainbow-yellow text-foreground",
  CONFIRMED: "bg-rainbow-green text-white",
  COMPLETED: "bg-rainbow-purple text-white",
  CANCELLED: "bg-rainbow-coral text-white",
};

const STATUS_BORDER_CLASS: Record<string, string> = {
  PENDING_PAYMENT: "border-l-rainbow-yellow",
  CONFIRMED: "border-l-rainbow-green",
  COMPLETED: "border-l-rainbow-purple",
  CANCELLED: "border-l-rainbow-coral",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    where: { status: { not: "CART" } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { customer: true, lineItems: { include: { product: true, timeRate: true, reservation: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display mb-1 text-3xl font-extrabold tracking-tight">Panel admin</h1>
      <AdminNav />

      <h2 className="font-display mb-4 text-xl font-bold">Pedidos</h2>

      {orders.length === 0 && <p className="text-muted-foreground">Todavía no hay pedidos.</p>}

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Card key={order.id} className={`border-l-4 ${STATUS_BORDER_CLASS[order.status] ?? "border-l-border"}`}>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle className="font-display text-base">
                  {order.customer?.name ?? "Cliente sin nombre"} · {order.customer?.phone}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                <p className="text-xs text-muted-foreground">{order.createdAt.toLocaleString("es-CO")}</p>
              </div>
              <Badge className={STATUS_BADGE_CLASS[order.status] ?? ""}>
                {STATUS_LABELS[order.status] ?? order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <ul className="mb-2 flex flex-col gap-0.5 text-sm">
                {order.lineItems.map((line) => (
                  <li key={line.id} className="flex justify-between gap-3">
                    <span>
                      {line.lineType === "PRODUCT" ? `${line.quantity}x ` : ""}
                      {lineItemLabel(line)}
                    </span>
                    <span className="whitespace-nowrap">{formatCop(line.unitPriceCents * line.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-3 flex justify-between border-t pt-2 text-sm font-bold">
                <span>Total</span>
                <span>{formatCop(order.totalCents)}</span>
              </div>

              <div className="flex justify-end gap-2">
                {order.status === "CONFIRMED" && (
                  <>
                    <form action={markOrderCompleted.bind(null, order.id)}>
                      <Button type="submit" size="sm" className="bg-rainbow-green hover:bg-rainbow-green/90">
                        Marcar como entregado
                      </Button>
                    </form>
                    <form action={cancelOrder.bind(null, order.id)}>
                      <Button type="submit" size="sm" variant="outline" className="text-destructive">
                        Cancelar
                      </Button>
                    </form>
                  </>
                )}
                {order.status === "CANCELLED" && (
                  <form action={reopenOrder.bind(null, order.id)}>
                    <Button type="submit" size="sm" variant="outline">
                      Reabrir como confirmado
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
