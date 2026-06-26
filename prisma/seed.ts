import "dotenv/config";
import type {
  ProductCategory,
  TimeRateDuration,
  PromotionDay,
  PromotionRuleType,
  Prisma,
} from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";

const products: { name: string; category: ProductCategory; priceCents: number; description?: string }[] = [
  // Comidas
  { name: "Perro caliente sencillo", category: "FOOD", priceCents: 1050000 },
  { name: "Papas a la francesa", category: "FOOD", priceCents: 800000 },
  { name: "Papas con cheddar y tocineta", category: "FOOD", priceCents: 1700000 },
  { name: "Nuggets con papitas", category: "FOOD", priceCents: 2200000 },

  // Pasabocas
  { name: "Empanaditas x8 unidades", category: "SNACK", priceCents: 1550000 },
  { name: "Pastelito horneado de carne", category: "SNACK", priceCents: 330000 },
  { name: "Pastelito horneado de pollo", category: "SNACK", priceCents: 330000 },
  { name: "Dedito horneado", category: "SNACK", priceCents: 330000 },
  { name: "Kibbe", category: "SNACK", priceCents: 330000 },
  { name: "Dedito del origen yuca", category: "SNACK", priceCents: 800000 },
  { name: "Dedito del origen original", category: "SNACK", priceCents: 800000 },
  { name: "Dedito Olaya frito", category: "SNACK", priceCents: 350000 },
  { name: "Dedito frito queso y bocadillo", category: "SNACK", priceCents: 350000 },
  { name: "Porción de torta", category: "SNACK", priceCents: 800000 },

  // Pizzas
  { name: "Pizza pepperoni", category: "PIZZA", priceCents: 3200000 },
  { name: "Pizza jamón y queso", category: "PIZZA", priceCents: 3000000 },
  { name: "Pizza hawaiana", category: "PIZZA", priceCents: 3000000 },
  { name: "Pizza 4 carnes", category: "PIZZA", priceCents: 3500000 },
  { name: "Pizza queso", category: "PIZZA", priceCents: 2800000 },
  { name: "Pizza pollo", category: "PIZZA", priceCents: 3000000 },

  // Otros (se agrupan en FOOD por simplicidad)
  { name: "Crispeta", category: "FOOD", priceCents: 300000 },
  { name: "Mini pancakes", category: "FOOD", priceCents: 1300000 },
  { name: "Mini hamburguesas", category: "FOOD", priceCents: 3500000 },

  // Menú infantil
  { name: "Menú infantil: pizza + bebida", category: "KIDS_MENU", priceCents: 2200000 },
  { name: "Menú infantil: nuggets + bebida", category: "KIDS_MENU", priceCents: 2200000 },
  { name: "Menú infantil: perro + bebida", category: "KIDS_MENU", priceCents: 2200000 },

  // Picadas para grupos
  { name: "50 picadas", category: "GROUP_PLATTER", priceCents: 13500000 },
  { name: "100 picadas", category: "GROUP_PLATTER", priceCents: 27000000 },
  { name: "30 mini hamburguesas", category: "GROUP_PLATTER", priceCents: 23000000 },

  // Adiciones
  { name: "Adición tocineta", category: "ADDITION", priceCents: 300000 },
  { name: "Adición queso cheddar", category: "ADDITION", priceCents: 300000 },
  { name: "Adición piña", category: "ADDITION", priceCents: 200000 },
  { name: "Adición de nutella", category: "ADDITION", priceCents: 300000 },

  // Postres
  { name: "Helado fiestero", category: "DESSERT", priceCents: 400000 },

  // Bebidas
  { name: "Cerveza Sol", category: "DRINK", priceCents: 950000 },
  { name: "Cerveza Miller Lite", category: "DRINK", priceCents: 950000 },
  { name: "Cerveza Stella Artois", category: "DRINK", priceCents: 950000 },
  { name: "Cerveza Corona", category: "DRINK", priceCents: 950000 },
  { name: "Cerveza Heineken", category: "DRINK", priceCents: 1050000 },
  { name: "Champaña JP Chanet", category: "DRINK", priceCents: 1500000 },
  { name: "Café", category: "DRINK", priceCents: 600000 },
  { name: "Agua cristal PET 300", category: "DRINK", priceCents: 220000 },
  { name: "Acqua manzana", category: "DRINK", priceCents: 380000 },
  { name: "Acqua frutos verdes", category: "DRINK", priceCents: 380000 },
  { name: "Te Hatsu", category: "DRINK", priceCents: 380000 },
  { name: "Jugo Hit 200ml", category: "DRINK", priceCents: 380000 },
  { name: "Coca Cola original", category: "DRINK", priceCents: 600000 },
  { name: "Coca Cola Zero", category: "DRINK", priceCents: 600000 },
  { name: "Soda Bretaña", category: "DRINK", priceCents: 700000 },
  { name: "Soda Hatsu rosa", category: "DRINK", priceCents: 700000 },
  { name: "Soda Hatsu sandía", category: "DRINK", priceCents: 700000 },
  { name: "Agua cristal PET 300 con gas", category: "DRINK", priceCents: 350000 },
  { name: "Pony Malta", category: "DRINK", priceCents: 380000 },
  { name: "Michelada (adición)", category: "ADDITION", priceCents: 200000 },
  { name: "Ginger Ale", category: "DRINK", priceCents: 1150000 },
  { name: "H2OH", category: "DRINK", priceCents: 250000 },
  { name: "Colombiana Postobón lata", category: "DRINK", priceCents: 600000 },
  { name: "Manzana Postobón lata", category: "DRINK", priceCents: 600000 },

  // Cócteles
  { name: "Margarita", category: "COCKTAIL", priceCents: 2160000 },
  { name: "Gin and Tonic", category: "COCKTAIL", priceCents: 2160000 },
  { name: "Moscow Mule", category: "COCKTAIL", priceCents: 2700000 },
  { name: "Margaritas x 25 unidades", category: "COCKTAIL", priceCents: 35100000 },

  // Decoración para fiestas
  {
    name: "Panel de lentejuelas",
    category: "DECORATION",
    priceCents: 10000000,
    description: "Colores disponibles: tornasol, azul, dorado, negro, plateado.",
  },
  { name: "Tarima con tela del color", category: "DECORATION", priceCents: 3000000 },
  { name: "Cubo acrílico 60cm", category: "DECORATION", priceCents: 3500000 },
  { name: "Cubo acrílico 80cm", category: "DECORATION", priceCents: 4000000 },
  { name: "Aviso led", category: "DECORATION", priceCents: 5000000 },
  { name: "Forro silla", category: "DECORATION", priceCents: 300000 },
  { name: "Forro mesa", category: "DECORATION", priceCents: 800000 },
  { name: "Tropezones mdf/cartón 80cm", category: "DECORATION", priceCents: 4000000 },
  { name: "Tropezones 1mt", category: "DECORATION", priceCents: 5000000 },
  { name: "Número de madera con luces", category: "DECORATION", priceCents: 6000000 },

  // Nota: "Pankylabs bebé" (menú bebé) no se incluye porque su precio no fue informado todavía.
];

const timeRates: { duration: TimeRateDuration; priceCents: number; extraAdultCents: number }[] = [
  { duration: "MIN_30", priceCents: 2500000, extraAdultCents: 1000000 },
  { duration: "HOUR_1", priceCents: 4000000, extraAdultCents: 1000000 },
  { duration: "HOUR_2", priceCents: 7000000, extraAdultCents: 1000000 },
  { duration: "UNLIMITED", priceCents: 8000000, extraAdultCents: 1000000 },
];

const promotionRules: {
  name: string;
  dayOfWeek: PromotionDay;
  ruleType: PromotionRuleType;
  details: Prisma.InputJsonValue;
}[] = [
  {
    name: "Lunes 2x1",
    dayOfWeek: "MONDAY",
    ruleType: "BUY_X_GET_Y",
    details: { description: "Paga 1 entrada de 1 hora y entran 2 niños", timeRateDuration: "HOUR_1" },
  },
  {
    name: "Martes de Combo",
    dayOfWeek: "TUESDAY",
    ruleType: "FIXED_COMBO_PRICE",
    details: {
      description: "Tiempo ilimitado + pizza small (jamón/queso, pollo o hawaiana)",
      priceCents: 8000000,
    },
  },
  {
    name: "Miércoles de Diversión",
    dayOfWeek: "WEDNESDAY",
    ruleType: "FIXED_COMBO_PRICE",
    details: { description: "1 hora + crispetas + helado", priceCents: 4000000 },
  },
  {
    name: "Jueves de Tiempo Extendido",
    dayOfWeek: "THURSDAY",
    ruleType: "BUY_X_GET_Y",
    details: { description: "Compra 1 hora, Play Lab regala la otra (2 horas en total)", timeRateDuration: "HOUR_1" },
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: product,
      create: product,
    });
  }

  for (const rate of timeRates) {
    await prisma.timeRate.upsert({
      where: { duration: rate.duration },
      update: rate,
      create: rate,
    });
  }

  for (const rule of promotionRules) {
    const existing = await prisma.promotionRule.findFirst({ where: { name: rule.name } });
    if (existing) {
      await prisma.promotionRule.update({ where: { id: existing.id }, data: rule });
    } else {
      await prisma.promotionRule.create({ data: rule });
    }
  }

  console.log(`Seed completo: ${products.length} productos, ${timeRates.length} tarifas, ${promotionRules.length} promociones.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
