import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!session || session !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
