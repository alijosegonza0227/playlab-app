import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-20 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">Play Lab</h1>
      <p className="text-lg text-muted-foreground">Learn &amp; Fun</p>
      <p className="max-w-xl text-muted-foreground">
        Pide domicilio, mira nuestra lista de precios y muy pronto reserva tu visita al parque o arma la fiesta de
        cumpleaños perfecta, todo desde aquí.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/menu">Ver menú y pedir domicilio</Link>} size="lg" />
        <Button render={<Link href="/cart">Ir al carrito</Link>} size="lg" variant="outline" />
      </div>
    </div>
  );
}
