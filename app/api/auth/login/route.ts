import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_PASSWORD,
  AUTH_USERNAME,
  AUTH_USERNAME_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };

    if (body.username !== AUTH_USERNAME || body.password !== AUTH_PASSWORD) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(AUTH_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set(AUTH_USERNAME_COOKIE_NAME, body.username, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
