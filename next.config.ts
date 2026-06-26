import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que Next.js intente reempaquetar/renombrar estos paquetes para funciones
  // serverless (rompía la resolución del runtime de Prisma 7 en Netlify).
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
  // El tracer de Next no detecta los imports dinámicos del runtime/wasm de Prisma,
  // así que el bundle serverless quedaba incompleto. Se incluyen explícitamente.
  outputFileTracingIncludes: {
    "/**": ["./node_modules/@prisma/client/runtime/**"],
  },
};

export default nextConfig;
