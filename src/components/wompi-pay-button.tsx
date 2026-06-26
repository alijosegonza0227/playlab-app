"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";

type WompiWidgetCheckoutResult = {
  transaction?: { id: string; status: string };
};

declare global {
  interface Window {
    WidgetCheckout: new (config: {
      currency: string;
      amountInCents: number;
      reference: string;
      publicKey: string;
      signature: { integrity: string };
      redirectUrl?: string;
      customerData?: {
        email?: string;
        fullName?: string;
        phoneNumber?: string;
      };
    }) => { open: (callback: (result: WompiWidgetCheckoutResult) => void) => void };
  }
}

export function WompiPayButton(props: {
  publicKey: string;
  reference: string;
  amountInCents: number;
  signature: string;
  orderId: string;
  customerEmail?: string;
  customerFullName?: string;
  customerPhone?: string;
}) {
  const router = useRouter();
  const [scriptReady, setScriptReady] = useState(false);
  const [opening, setOpening] = useState(false);

  function handlePay() {
    if (!window.WidgetCheckout) return;
    setOpening(true);

    const checkout = new window.WidgetCheckout({
      currency: "COP",
      amountInCents: props.amountInCents,
      reference: props.reference,
      publicKey: props.publicKey,
      signature: { integrity: props.signature },
      customerData: {
        email: props.customerEmail,
        fullName: props.customerFullName,
        phoneNumber: props.customerPhone,
      },
    });

    checkout.open(() => {
      // El resultado del navegador es solo informativo: la confirmación real
      // llega por webhook server-side. Aquí solo redirigimos a la pantalla de espera.
      router.push(`/checkout/confirmacion?orderId=${props.orderId}`);
    });
  }

  return (
    <>
      <Script src="https://checkout.wompi.co/widget.js" onReady={() => setScriptReady(true)} />
      <Button size="lg" className="w-full" disabled={!scriptReady || opening} onClick={handlePay}>
        {opening ? "Abriendo pasarela de pago..." : "Pagar con Wompi"}
      </Button>
    </>
  );
}
