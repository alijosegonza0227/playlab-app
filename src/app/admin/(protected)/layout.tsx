import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

/**
 * Reemplaza al middleware/proxy de Edge (que tenía un bug de compatibilidad
 * Next 16 + Turbopack + Netlify) con un chequeo server-side normal. Solo protege
 * lo que vive dentro de este route group; /admin/login queda fuera, sin chequeo.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!session || session !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
