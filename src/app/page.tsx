import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayLabLogo } from "@/components/playlab-logo";
import { PlaylabDecor } from "@/components/playlab-decor";

export default function Home() {
  return (
    <div>
      <section className="playlab-sky-bg relative overflow-hidden">
        <PlaylabDecor className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-20 text-center">
          <div className="rounded-3xl bg-white/90 px-8 py-6 shadow-lg backdrop-blur-sm">
            <PlayLabLogo size="lg" />
            <p className="font-display mt-1 text-lg font-bold text-muted-foreground">Learn &amp; Fun</p>
          </div>
          <p className="max-w-xl text-lg font-medium text-white drop-shadow-sm">
            Pide domicilio, mira nuestra lista de precios, reserva tu visita al parque y muy pronto arma la fiesta de
            cumpleaños perfecta, todo desde aquí.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button render={<Link href="/reservas">Reservar visita al parque</Link>} size="lg" className="bg-rainbow-coral text-white hover:bg-rainbow-coral/90" />
            <Button render={<Link href="/menu">Ver menú y pedir domicilio</Link>} size="lg" className="bg-white text-primary hover:bg-white/90" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-12 sm:grid-cols-3">
        {[
          { href: "/reservas", title: "Reservar visita", desc: "Elige fecha, hora y tiempo de juego para tu familia.", color: "border-rainbow-purple" },
          { href: "/menu", title: "Domicilio y precios", desc: "Mira el menú completo y pide para que te lo lleven.", color: "border-rainbow-green" },
          { href: "/cart", title: "Tu carrito", desc: "Revisa lo que llevas y continúa al pago.", color: "border-rainbow-orange" },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`rounded-2xl border-2 ${card.color} bg-card p-5 transition-transform hover:-translate-y-0.5 hover:shadow-md`}
          >
            <h3 className="font-display text-lg font-bold">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
