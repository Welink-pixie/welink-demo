import { NextResponse } from "next/server";
import { betaTestProfiles, recommendMatches } from "@/lib/mockMatchingGraph";

export async function GET() {
  const examples = betaTestProfiles.map((profile) => ({
    profile,
    recommendations: recommendMatches(profile, 4),
  }));

  return NextResponse.json({
    examples,
    meta: {
      count: examples.length,
      description: "Diverse beta user profiles with live graph-based recommendation outputs.",
    },
  });
}
