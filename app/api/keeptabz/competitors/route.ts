import { NextResponse } from "next/server";
import { KeeptabzAuthRequiredError, listCompetitors } from "@/lib/keeptabz";

export async function GET(request: Request) {
  const { searchParams, origin: baseUrl } = new URL(request.url);
  const workspaceSlug = searchParams.get("workspaceSlug") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  try {
    const data = await listCompetitors(baseUrl, { workspaceSlug, search });
    return NextResponse.json({ authorized: true, competitors: data.competitors });
  } catch (error) {
    if (error instanceof KeeptabzAuthRequiredError) {
      return NextResponse.json({
        authorized: false,
        competitors: [],
        authorizeUrl: "/api/keeptabz/oauth/login",
      });
    }

    return NextResponse.json(
      {
        authorized: true,
        competitors: [],
        error: error instanceof Error ? error.message : "Unable to reach the data provider.",
      },
      { status: 502 }
    );
  }
}
