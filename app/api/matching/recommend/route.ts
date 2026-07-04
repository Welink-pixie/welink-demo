import { NextResponse } from "next/server";
import { recommendMatches } from "@/lib/mockMatchingGraph";
import type { OnboardingProfile } from "@/lib/onboarding";

function isValidProfile(value: unknown): value is OnboardingProfile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.fullName === "string" &&
    typeof candidate.workEmail === "string" &&
    typeof candidate.companyName === "string" &&
    typeof candidate.role === "string" &&
    typeof candidate.industry === "string" &&
    typeof candidate.employeeRange === "string" &&
    typeof candidate.revenueRange === "string" &&
    typeof candidate.budgetRange === "string" &&
    typeof candidate.services === "string" &&
    typeof candidate.location === "string" &&
    typeof candidate.goals === "string" &&
    typeof candidate.timeline === "string"
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { profile?: unknown; limit?: number };

    if (!isValidProfile(body.profile)) {
      return NextResponse.json({ error: "Invalid profile payload." }, { status: 400 });
    }

    const limit = typeof body.limit === "number" ? Math.max(1, Math.min(15, body.limit)) : 5;
    const recommendations = recommendMatches(body.profile, limit);

    return NextResponse.json({
      profile: body.profile,
      recommendations,
      meta: {
        algorithm: "Dijkstra shortest path + weighted compatibility (includes cosine similarity)",
        limit,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to generate recommendations." }, { status: 500 });
  }
}
