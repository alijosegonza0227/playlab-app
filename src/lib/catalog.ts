import type { ProductCategory } from "@/generated/prisma/client";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  FOOD: "Comidas",
  SNACK: "Pasabocas",
  PIZZA: "Pizzas",
  KIDS_MENU: "Menú infantil",
  GROUP_PLATTER: "Picadas para grupos",
  DESSERT: "Postres",
  DRINK: "Bebidas",
  COCKTAIL: "Cócteles",
  BABY_MENU: "Menú bebé",
  DECORATION: "Decoración para fiestas",
  ADDITION: "Adiciones",
};

export const CATEGORY_ORDER: ProductCategory[] = [
  "FOOD",
  "SNACK",
  "PIZZA",
  "KIDS_MENU",
  "GROUP_PLATTER",
  "ADDITION",
  "DESSERT",
  "DRINK",
  "COCKTAIL",
  "BABY_MENU",
  "DECORATION",
];

/** La decoración solo aplica al armado de fiesta de cumpleaños (Fase 3), no a domicilio. */
export const DELIVERABLE_CATEGORIES: ProductCategory[] = CATEGORY_ORDER.filter(
  (category) => category !== "DECORATION"
);
