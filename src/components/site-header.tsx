import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getCartOrder } from "@/lib/cart";
import { Badge } from "@/components/ui/badge";
import { PlayLabLogo } from "@/components/playlab-logo";

export async function SiteHeader() {
  const cart = await getCartOrder();
  const itemCount = cart?.lineItems.reduce((sum, line) => sum + line.quantity, 0) ?? 0;

  return (
    <header className="playlab-sky-bg sticky top-0 z-10 shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/">
          <PlayLabLogo size="sm" className="drop-shadow-sm" />
        </Link>
        <nav className="flex items-center gap-5 text-sm font-bold text-white">
          <Link href="/menu" className="transition-opacity hover:opacity-80">
            Menú
          </Link>
          <Link href="/reservas" className="transition-opacity hover:opacity-80">
            Reservas
          </Link>
          <Link href="/cart" className="relative flex items-center gap-1.5 transition-opacity hover:opacity-80">
            <ShoppingCart className="size-5" />
            Carrito
            {itemCount > 0 && (
              <Badge className="absolute -right-3 -top-2 size-5 justify-center rounded-full bg-rainbow-coral p-0 text-xs text-white">
                {itemCount}
              </Badge>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
