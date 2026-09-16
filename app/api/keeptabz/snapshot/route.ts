import { NextResponse } from "next/server";
import {
  KeeptabzAuthRequiredError,
  getDefaultWorkspace,
  workspaceSnapshot,
} from "@/lib/keeptabz";

export async function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;

  try {
    const workspace = await getDefaultWorkspace(baseUrl);
    if (!workspace) {
      return NextResponse.json({ authorized: true, competitors: [], reviews: [], news: [], ads: [] });
    }

    const snapshot = await workspaceSnapshot(baseUrl, { workspaceId: workspace.id, limitPerSection: 8 });

    return NextResponse.json({
      authorized: true,
      competitors: snapshot.competitors.competitors,
      reviews: snapshot.reviews.reviews,
      news: snapshot.news.news,
      ads: snapshot.ads.ads,
    });
  } catch (error) {
    if (error instanceof KeeptabzAuthRequiredError) {
      return NextResponse.json({
        authorized: false,
        competitors: [],
        reviews: [],
        news: [],
        ads: [],
        authorizeUrl: "/api/keeptabz/oauth/login",
      });
    }

    return NextResponse.json(
      {
        authorized: true,
        competitors: [],
        reviews: [],
        news: [],
        ads: [],
        error: error instanceof Error ? error.message : "Unable to reach the data provider.",
      },
      { status: 502 }
    );
  }
}
