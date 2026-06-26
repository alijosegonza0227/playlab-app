import Link from "next/link";

export function AdminNav() {
  return (
    <nav className="mb-8 flex gap-2 border-b pb-3">
      <Link
        href="/admin"
        className="font-display rounded-full px-4 py-1.5 text-sm font-bold hover:bg-muted"
      >
        Pedidos
      </Link>
      <Link
        href="/admin/reservas"
        className="font-display rounded-full px-4 py-1.5 text-sm font-bold hover:bg-muted"
      >
        Reservas
      </Link>
    </nav>
  );
}
