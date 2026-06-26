import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, AUTH_USERNAME_COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  const usernameCookie = cookieStore.get(AUTH_USERNAME_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return NextResponse.json({ username: null }, { status: 401 });
  }

  return NextResponse.json({ username: usernameCookie?.value ?? null });
}
