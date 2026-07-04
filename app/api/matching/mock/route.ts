import { NextResponse } from "next/server";
import { getMockGraphDataset, recommendMatches } from "@/lib/mockMatchingGraph";
import type { OnboardingProfile } from "@/lib/onboarding";

const sampleProfile: OnboardingProfile = {
  fullName: "Alex Morgan",
  workEmail: "alex@welink.io",
  companyName: "Orbit Advisory Group",
  role: "seeker",
  industry: "Business Strategy",
  employeeRange: "51-200",
  revenueRange: "1m-10m",
  budgetRange: "50k-250k",
  services: "growth advisory, partnership strategy",
  location: "Miami, FL",
  goals: "Warm introductions to strategic partners and high-fit provider relationships.",
  timeline: "quarter",
};

export async function GET() {
  const dataset = getMockGraphDataset();
  const recommendations = recommendMatches(sampleProfile, 5);

  return NextResponse.json({
    dataset,
    sampleProfile,
    recommendations,
  });
}
