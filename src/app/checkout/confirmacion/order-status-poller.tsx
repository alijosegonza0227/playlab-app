"use client";

import { useEffect, useState } from "react";

type OrderStatus = "CART" | "PENDING_PAYMENT" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export function OrderStatusPoller({ orderId, initialStatus }: { orderId: string; initialStatus: OrderStatus }) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);

  useEffect(() => {
    if (status !== "PENDING_PAYMENT") return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/orders/${orderId}/status`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.status !== status) {
        setStatus(data.status);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, status]);

  if (status === "CONFIRMED" || status === "COMPLETED") {
    return (
      <div className="rounded-md bg-green-50 p-4 text-green-800">
        <p className="font-bold">¡Pago confirmado!</p>
        <p className="text-sm">Tu pedido fue recibido y ya lo estamos preparando.</p>
      </div>
    );
  }

  if (status === "CANCELLED") {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-800">
        <p className="font-bold">El pago no se completó.</p>
        <p className="text-sm">Si crees que esto es un error, contáctanos por WhatsApp.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md bg-amber-50 p-4 text-amber-800">
      <p className="font-bold">Estamos confirmando tu pago...</p>
      <p className="text-sm">Esto puede tardar unos segundos, no cierres esta página.</p>
    </div>
  );
}
