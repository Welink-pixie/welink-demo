export type EngagementRole = "seeker" | "provider" | "hybrid";
export type BudgetRange = "under-10k" | "10k-50k" | "50k-250k" | "250k-plus";
export type EmployeeRange = "1-10" | "11-50" | "51-200" | "201-plus";
export type RevenueRange = "pre-revenue" | "under-1m" | "1m-10m" | "10m-plus";
export type TimelineRange = "immediate" | "quarter" | "half-year" | "exploring";

export type OnboardingProfile = {
  fullName: string;
  workEmail: string;
  companyName: string;
  role: EngagementRole;
  industry: string;
  employeeRange: EmployeeRange;
  revenueRange: RevenueRange;
  budgetRange: BudgetRange;
  services: string;
  location: string;
  goals: string;
  timeline: TimelineRange;
};

const budgetWeights: Record<BudgetRange, number> = {
  "under-10k": 6,
  "10k-50k": 12,
  "50k-250k": 19,
  "250k-plus": 24,
};

const employeeWeights: Record<EmployeeRange, number> = {
  "1-10": 6,
  "11-50": 10,
  "51-200": 15,
  "201-plus": 18,
};

const revenueWeights: Record<RevenueRange, number> = {
  "pre-revenue": 4,
  "under-1m": 9,
  "1m-10m": 15,
  "10m-plus": 20,
};

const timelineWeights: Record<TimelineRange, number> = {
  immediate: 24,
  quarter: 18,
  "half-year": 11,
  exploring: 6,
};

const roleWeights: Record<EngagementRole, { fit: number; opportunity: number; label: string }> = {
  seeker: { fit: 14, opportunity: 12, label: "Demand-side matching" },
  provider: { fit: 12, opportunity: 14, label: "Supply-side matching" },
  hybrid: { fit: 16, opportunity: 16, label: "Two-sided matching" },
};

function clampScore(value: number) {
  return Math.max(48, Math.min(98, Math.round(value)));
}

export function buildMatchSummary(profile: OnboardingProfile) {
  if (profile.role === "seeker") {
    return "We will bias introductions toward proven providers, operators, and firms aligned to your budget and timeline.";
  }

  if (profile.role === "provider") {
    return "We will bias introductions toward buyers, channel partners, and companies showing active demand in your service lane.";
  }

  return "We will look for two-way opportunities where you can both buy and provide value across the same network.";
}

export function calculateProfileScores(profile: OnboardingProfile) {
  const budgetWeight = budgetWeights[profile.budgetRange];
  const employeeWeight = employeeWeights[profile.employeeRange];
  const revenueWeight = revenueWeights[profile.revenueRange];
  const timelineWeight = timelineWeights[profile.timeline];
  const roleWeight = roleWeights[profile.role];
  const serviceDepth = Math.min(profile.services.split(",").filter(Boolean).length * 2, 10);
  const goalDepth = Math.min(profile.goals.split(" ").filter(Boolean).length / 2, 8);

  const fitScore = clampScore(44 + roleWeight.fit + employeeWeight * 0.55 + serviceDepth + goalDepth);
  const opportunityScore = clampScore(38 + roleWeight.opportunity + budgetWeight + revenueWeight * 0.4 + timelineWeight);

  return {
    fitScore,
    opportunityScore,
    matchingMode: roleWeight.label,
    summary: buildMatchSummary(profile),
  };
}

export const onboardingStorageKey = "welink_onboarding_profile";
export const onboardingScoresStorageKey = "welink_onboarding_scores";
