import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS, CATEGORY_ORDER, DELIVERABLE_CATEGORIES } from "@/lib/catalog";
import { formatCop } from "@/lib/money";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addProductToCart } from "./actions";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const productsByCategory = CATEGORY_ORDER.map((category) => ({
    category,
    products: products.filter((p) => p.category === category),
  })).filter((group) => group.products.length > 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-1 text-3xl font-extrabold tracking-tight">Lista de precios</h1>
      <p className="mb-8 text-muted-foreground">
        Agrega lo que quieras pedir a domicilio. La decoración se reserva al armar tu fiesta de cumpleaños.
      </p>

      <div className="flex flex-col gap-10">
        {productsByCategory.map(({ category, products: items }) => (
          <section key={category}>
            <h2 className="mb-4 text-xl font-bold text-primary">{CATEGORY_LABELS[category]}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((product) => {
                const canOrderDelivery = DELIVERABLE_CATEGORIES.includes(product.category);
                return (
                  <Card key={product.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-start justify-between gap-2 text-base">
                        <span>{product.name}</span>
                        <span className="whitespace-nowrap font-bold text-primary">
                          {formatCop(product.priceCents)}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-end justify-between gap-2">
                      {product.description ? (
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      ) : (
                        <span />
                      )}
                      {canOrderDelivery ? (
                        <form action={addProductToCart.bind(null, product.id)}>
                          <Button type="submit" size="sm">
                            Agregar
                          </Button>
                        </form>
                      ) : (
                        <span className="text-xs text-muted-foreground">Disponible en cumpleaños (pronto)</span>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
