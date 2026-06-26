import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const IMAGE_BY_PRODUCT_NAME: Record<string, string> = {
  "Coca Cola original": "/products/coca-cola-original.jpg",
  "Cerveza Corona": "/products/cerveza-corona.jpg",
  "Cerveza Heineken": "/products/cerveza-heineken.jpg",
  "Pizza pepperoni": "/products/pizza-pepperoni.jpg",
  "Pizza hawaiana": "/products/pizza-hawaiana.jpg",
  "Perro caliente sencillo": "/products/perro-caliente.jpg",
  "Papas a la francesa": "/products/papas-francesa.jpg",
  "Nuggets con papitas": "/products/nuggets-papitas.jpg",
  "Helado fiestero": "/products/helado-fiestero.jpg",
  Crispeta: "/products/crispeta.jpg",
};

async function main() {
  for (const [name, imageUrl] of Object.entries(IMAGE_BY_PRODUCT_NAME)) {
    const result = await prisma.product.updateMany({ where: { name }, data: { imageUrl } });
    console.log(`${name}: ${result.count} actualizado(s)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
