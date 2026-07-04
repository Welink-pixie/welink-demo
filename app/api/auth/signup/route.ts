import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, AUTH_USERNAME_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { fullName?: string };
    const fullName = body.fullName?.trim();

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(AUTH_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set(AUTH_USERNAME_COOKIE_NAME, fullName, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
