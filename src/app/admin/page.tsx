import { prisma } from "@/lib/prisma";
import { formatCop } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  CART: "Carrito (sin finalizar)",
  PENDING_PAYMENT: "Esperando pago",
  CONFIRMED: "Confirmado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING_PAYMENT: "secondary",
  CONFIRMED: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    where: { status: { not: "CART" } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { customer: true, lineItems: { include: { product: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Pedidos</h1>

      {orders.length === 0 && <p className="text-muted-foreground">Todavía no hay pedidos.</p>}

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base">
                  {order.customer?.name ?? "Cliente sin nombre"} · {order.customer?.phone}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                <p className="text-xs text-muted-foreground">{order.createdAt.toLocaleString("es-CO")}</p>
              </div>
              <Badge variant={STATUS_VARIANTS[order.status] ?? "outline"}>
                {STATUS_LABELS[order.status] ?? order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <ul className="mb-2 flex flex-col gap-0.5 text-sm">
                {order.lineItems.map((line) => (
                  <li key={line.id} className="flex justify-between">
                    <span>
                      {line.quantity}x {line.product?.name}
                    </span>
                    <span>{formatCop(line.unitPriceCents * line.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t pt-2 text-sm font-bold">
                <span>Total</span>
                <span>{formatCop(order.totalCents)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
