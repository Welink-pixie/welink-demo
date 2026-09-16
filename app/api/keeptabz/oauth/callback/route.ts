import { NextResponse } from "next/server";
import { completeKeeptabzAuthorization } from "@/lib/keeptabz";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  const redirectWithStatus = (status: string) =>
    NextResponse.redirect(new URL(`/dashboard/market-intel?keeptabz=${status}`, request.url));

  if (oauthError || !code) {
    return redirectWithStatus("error");
  }

  try {
    await completeKeeptabzAuthorization(code, state);
    return redirectWithStatus("connected");
  } catch {
    return redirectWithStatus("error");
  }
}
