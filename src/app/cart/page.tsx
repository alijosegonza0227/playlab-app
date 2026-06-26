import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getCartOrder } from "@/lib/cart";
import { formatCop } from "@/lib/money";
import { lineItemLabel } from "@/lib/line-item-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updateLineQuantity, removeLineItem } from "./actions";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const order = await getCartOrder();
  const lineItems = order?.lineItems ?? [];

  if (lineItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-2 text-2xl font-extrabold">Tu carrito está vacío</h1>
        <p className="mb-6 text-muted-foreground">Agrega productos desde el menú o reserva tu visita al parque.</p>
        <div className="flex justify-center gap-3">
          <Button render={<Link href="/menu">Ver menú</Link>} />
          <Button render={<Link href="/reservas">Reservar visita</Link>} variant="outline" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Tu carrito</h1>

      <div className="flex flex-col gap-3">
        {lineItems.map((line) => (
          <Card key={line.id}>
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div className="flex-1">
                <p className="font-semibold">{lineItemLabel(line)}</p>
                {line.lineType === "PRODUCT" && (
                  <p className="text-sm text-muted-foreground">{formatCop(line.unitPriceCents)} c/u</p>
                )}
              </div>

              {line.lineType === "PRODUCT" && (
                <div className="flex items-center gap-2">
                  <form action={updateLineQuantity.bind(null, line.id, line.quantity - 1)}>
                    <Button type="submit" size="icon" variant="outline" className="size-8">
                      <Minus className="size-4" />
                    </Button>
                  </form>
                  <span className="w-6 text-center font-medium">{line.quantity}</span>
                  <form action={updateLineQuantity.bind(null, line.id, line.quantity + 1)}>
                    <Button type="submit" size="icon" variant="outline" className="size-8">
                      <Plus className="size-4" />
                    </Button>
                  </form>
                </div>
              )}

              <p className="w-24 text-right font-bold">{formatCop(line.unitPriceCents * line.quantity)}</p>

              <form action={removeLineItem.bind(null, line.id)}>
                <Button type="submit" size="icon" variant="ghost" className="text-destructive">
                  <Trash2 className="size-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatCop(order?.subtotalCents ?? 0)}</span>
        </div>
        <div className="flex justify-between text-xl font-extrabold">
          <span>Total</span>
          <span>{formatCop(order?.totalCents ?? 0)}</span>
        </div>
      </div>

      <Button render={<Link href="/checkout">Continuar al pago</Link>} size="lg" className="mt-6 w-full" />
    </div>
  );
}
