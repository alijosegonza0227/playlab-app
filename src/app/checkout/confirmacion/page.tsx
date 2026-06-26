import { prisma } from "@/lib/prisma";
import { formatCop } from "@/lib/money";
import { lineItemLabel } from "@/lib/line-item-display";
import { OrderStatusPoller } from "./order-status-poller";

export const dynamic = "force-dynamic";

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: { lineItems: { include: { product: true, timeRate: true, reservation: true } } },
      })
    : null;

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold">No encontramos ese pedido</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Tu pedido</h1>

      <OrderStatusPoller orderId={order.id} initialStatus={order.status} />

      <div className="mt-6 flex flex-col gap-1">
        {order.lineItems.map((line) => (
          <div key={line.id} className="flex justify-between gap-3 text-sm">
            <span>
              {line.lineType === "PRODUCT" ? `${line.quantity}x ` : ""}
              {lineItemLabel(line)}
            </span>
            <span className="whitespace-nowrap">{formatCop(line.unitPriceCents * line.quantity)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t pt-2 font-bold">
          <span>Total</span>
          <span>{formatCop(order.totalCents)}</span>
        </div>
      </div>
    </div>
  );
}
