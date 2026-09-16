import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  AUTH_COOKIE_NAME,
  AUTH_DEFAULT_SUBSCRIBED,
  AUTH_SUBSCRIPTION_COOKIE_NAME,
  AUTH_USERNAME_COOKIE_NAME,
} from "@/lib/auth";
import type { OnboardingProfile } from "@/lib/onboarding";

type SignupRequestBody = Partial<OnboardingProfile>;

function mapRole(role: OnboardingProfile["role"]) {
  switch (role) {
    case "provider":
      return "provider";
    case "hybrid":
      return "hybrid";
    case "seeker":
    default:
      return "seeker";
  }
}

function mapEmployeeRange(value: OnboardingProfile["employeeRange"]) {
  switch (value) {
    case "1-10":
      return "range_1_10";
    case "51-200":
      return "range_51_200";
    case "201-plus":
      return "range_201_plus";
    case "11-50":
    default:
      return "range_11_50";
  }
}

function mapRevenueRange(value: OnboardingProfile["revenueRange"]) {
  switch (value) {
    case "pre-revenue":
      return "pre_revenue";
    case "1m-10m":
      return "range_1m_10m";
    case "10m-plus":
      return "range_10m_plus";
    case "under-1m":
    default:
      return "under_1m";
  }
}

function mapBudgetRange(value: OnboardingProfile["budgetRange"]) {
  switch (value) {
    case "under-10k":
      return "under_10k";
    case "50k-250k":
      return "range_50k_250k";
    case "250k-plus":
      return "range_250k_plus";
    case "10k-50k":
    default:
      return "range_10k_50k";
  }
}

function mapTimeline(value: OnboardingProfile["timeline"]) {
  switch (value) {
    case "immediate":
      return "immediate";
    case "half-year":
      return "half_year";
    case "exploring":
      return "exploring";
    case "quarter":
    default:
      return "quarter";
  }
}

function isMissing(value: string | undefined) {
  return !value || value.trim().length === 0;
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const body = (await request.json()) as SignupRequestBody;
    const profile: OnboardingProfile = {
      fullName: body.fullName?.trim() ?? "",
      workEmail: body.workEmail?.trim().toLowerCase() ?? "",
      companyName: body.companyName?.trim() ?? "",
      role: body.role ?? "seeker",
      industry: body.industry?.trim() ?? "",
      employeeRange: body.employeeRange ?? "11-50",
      revenueRange: body.revenueRange ?? "under-1m",
      budgetRange: body.budgetRange ?? "10k-50k",
      services: body.services?.trim() ?? "",
      location: body.location?.trim() ?? "",
      goals: body.goals?.trim() ?? "",
      timeline: body.timeline ?? "quarter",
    };

    if (isMissing(profile.fullName)) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }

    if (isMissing(profile.workEmail) || !profile.workEmail.includes("@")) {
      return NextResponse.json({ error: "A valid work email is required." }, { status: 400 });
    }

    if (isMissing(profile.companyName) || isMissing(profile.industry) || isMissing(profile.services) || isMissing(profile.location) || isMissing(profile.goals)) {
      return NextResponse.json({ error: "Complete all required onboarding fields." }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email: profile.workEmail },
      update: {
        fullName: profile.fullName,
        companyName: profile.companyName,
      },
      create: {
        email: profile.workEmail,
        fullName: profile.fullName,
        companyName: profile.companyName,
      },
    });

    await prisma.businessProfile.upsert({
      where: { userId: user.id },
      update: {
        role: mapRole(profile.role),
        industry: profile.industry,
        services: profile.services,
        location: profile.location,
        goals: profile.goals,
        employeeRange: mapEmployeeRange(profile.employeeRange),
        revenueRange: mapRevenueRange(profile.revenueRange),
        budgetRange: mapBudgetRange(profile.budgetRange),
        timeline: mapTimeline(profile.timeline),
      },
      create: {
        userId: user.id,
        role: mapRole(profile.role),
        industry: profile.industry,
        services: profile.services,
        location: profile.location,
        goals: profile.goals,
        employeeRange: mapEmployeeRange(profile.employeeRange),
        revenueRange: mapRevenueRange(profile.revenueRange),
        budgetRange: mapBudgetRange(profile.budgetRange),
        timeline: mapTimeline(profile.timeline),
      },
    });

    const responses = Object.entries(profile).map(([questionKey, answerText]) => ({
      userId: user.id,
      questionKey,
      answerText,
    }));

    await prisma.onboardingResponse.deleteMany({ where: { userId: user.id } });
    await prisma.onboardingResponse.createMany({ data: responses });

    await prisma.onboardingState.upsert({
      where: { userId: user.id },
      update: {
        currentStep: 6,
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        currentStep: 6,
        completedAt: new Date(),
      },
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(AUTH_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set(AUTH_USERNAME_COOKIE_NAME, profile.fullName, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set(AUTH_SUBSCRIPTION_COOKIE_NAME, AUTH_DEFAULT_SUBSCRIBED ? "active" : "inactive", {
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
