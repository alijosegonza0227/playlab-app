import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getCartOrder } from "@/lib/cart";
import { Badge } from "@/components/ui/badge";

export async function SiteHeader() {
  const cart = await getCartOrder();
  const itemCount = cart?.lineItems.reduce((sum, line) => sum + line.quantity, 0) ?? 0;

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-primary">
          Play Lab
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/menu" className="hover:text-primary">
            Menú
          </Link>
          <Link href="/cart" className="relative flex items-center gap-1 hover:text-primary">
            <ShoppingCart className="size-5" />
            Carrito
            {itemCount > 0 && (
              <Badge className="absolute -right-3 -top-2 size-5 justify-center rounded-full p-0 text-xs">
                {itemCount}
              </Badge>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
