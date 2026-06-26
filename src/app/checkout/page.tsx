import Link from "next/link";
import { getActiveOrderForCheckout } from "@/lib/cart";
import { getWompiPublicKey, isWompiConfigured } from "@/lib/wompi/client";
import { formatCop } from "@/lib/money";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "./checkout-form";
import { WompiPayButton } from "@/components/wompi-pay-button";
import { getWidgetParamsForCart, simulateWompiPayment } from "./actions";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const order = await getActiveOrderForCheckout();

  if (!order || order.lineItems.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="mb-2 text-2xl font-extrabold">No tienes nada en el carrito</h1>
        <Button render={<Link href="/menu">Ver menú</Link>} className="mt-4" />
      </div>
    );
  }

  const readyToPay = order.status === "PENDING_PAYMENT" && order.customerId;
  const widgetParams = readyToPay ? await getWidgetParamsForCart() : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Checkout</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumen del pedido</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {order.lineItems.map((line) => (
            <div key={line.id} className="flex justify-between text-sm">
              <span>
                {line.quantity}x {line.product?.name}
              </span>
              <span>{formatCop(line.unitPriceCents * line.quantity)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t pt-2 font-bold">
            <span>Total</span>
            <span>{formatCop(order.totalCents)}</span>
          </div>
        </CardContent>
      </Card>

      {!readyToPay && <CheckoutForm />}

      {readyToPay && !isWompiConfigured() && (
        <div className="flex flex-col gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900">
          <p className="text-sm font-bold">Modo de prueba</p>
          <p className="text-sm">
            Wompi todavía no está conectado. Este botón simula un pago aprobado para poder probar el resto del flujo
            (confirmación, panel admin) antes de activar pagos reales.
          </p>
          <form action={simulateWompiPayment.bind(null, order.id)}>
            <Button type="submit" size="lg" className="w-full">
              Simular pago aprobado
            </Button>
          </form>
        </div>
      )}

      {readyToPay && isWompiConfigured() && widgetParams && (
        <WompiPayButton
          publicKey={getWompiPublicKey()}
          reference={widgetParams.reference}
          amountInCents={widgetParams.amountInCents}
          signature={widgetParams.signature}
          orderId={order.id}
          customerEmail={order.customer?.email ?? undefined}
          customerFullName={order.customer?.name}
          customerPhone={order.customer?.phone}
        />
      )}
    </div>
  );
}
