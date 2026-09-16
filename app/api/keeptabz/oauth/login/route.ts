import { NextResponse } from "next/server";
import { startKeeptabzAuthorization } from "@/lib/keeptabz";

export async function GET(request: Request) {
  try {
    const result = await startKeeptabzAuthorization();

    if (result.alreadyAuthorized) {
      return NextResponse.redirect(new URL("/dashboard/market-intel?keeptabz=connected", request.url));
    }

    return NextResponse.redirect(result.authorizationUrl);
  } catch {
    return NextResponse.redirect(new URL("/dashboard/market-intel?keeptabz=error", request.url));
  }
}
