"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

export type LoginFormState = { error?: string };

export async function loginAdmin(_prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const password = formData.get("password");

  if (typeof password !== "string" || !password || password !== process.env.ADMIN_PASSWORD) {
    return { error: "Contraseña incorrecta." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect("/admin");
}
