"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ThemeLogo from "@/components/ui/ThemeLogo";
import { recommendMatches, type GraphRecommendation } from "@/lib/mockMatchingGraph";
import {
  calculateProfileScores,
  onboardingScoresStorageKey,
  onboardingStorageKey,
  type OnboardingProfile,
} from "@/lib/onboarding";

const initialProfile: OnboardingProfile = {
  fullName: "",
  workEmail: "",
  companyName: "",
  role: "seeker",
  industry: "",
  employeeRange: "11-50",
  revenueRange: "under-1m",
  budgetRange: "10k-50k",
  services: "",
  location: "",
  goals: "",
  timeline: "quarter",
};

const stepDefinitions = [
  {
    id: "role",
    label: "Role",
    title: "Choose a role",
    fields: ["role"] as const,
  },
  {
    id: "identity",
    label: "Identity",
    title: "Start with the operator behind the profile.",
    fields: ["fullName", "workEmail", "companyName"] as const,
  },
  {
    id: "profile",
    label: "Profile",
    title: "Now define your market and capabilities.",
    fields: ["industry", "services"] as const,
  },
  {
    id: "economics",
    label: "Economics",
    title: "Calibrate company scale and budget.",
    fields: ["employeeRange", "revenueRange", "budgetRange"] as const,
  },
  {
    id: "intent",
    label: "Intent",
    title: "Define the relationship opportunity you want WeLink to surface.",
    fields: ["location", "goals", "timeline"] as const,
  },
  {
    id: "review",
    label: "Review",
    title: "Review your matching profile before entering the network.",
    fields: [] as const,
  },
] as const;

const roleOptions = [
  {
    value: "seeker",
    title: "Seeker",
    tooltip: "Looking for trusted partners, providers, or opportunities.",
  },
  {
    value: "provider",
    title: "Provider",
    tooltip: "Offering services, expertise, or solutions to seekers.",
  },
] as const;

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.06)] outline-none transition duration-200 placeholder:text-slate-500 focus:border-slate-900 focus:shadow-[0_10px_24px_-16px_rgba(15,23,42,0.45)] focus:ring-4 focus:ring-slate-900/5";

const textareaClass =
  "mt-2 min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.06)] outline-none transition duration-200 placeholder:text-slate-500 focus:border-slate-900 focus:shadow-[0_10px_24px_-16px_rgba(15,23,42,0.45)] focus:ring-4 focus:ring-slate-900/5";

function getFieldLabel(field: keyof OnboardingProfile) {
  switch (field) {
    case "fullName":
      return "Full name";
    case "workEmail":
      return "Work email";
    case "companyName":
      return "Company name";
    case "role":
      return "Role";
    case "industry":
      return "Industry";
    case "employeeRange":
      return "Employees";
    case "revenueRange":
      return "Revenue";
    case "budgetRange":
      return "Budget";
    case "services":
      return "Services or capabilities";
    case "location":
      return "Location";
    case "goals":
      return "Primary goals";
    case "timeline":
      return "Timeline";
    default:
      return field;
  }
}

export default function OnboardingFlow() {
  const router = useRouter();
  const [profile, setProfile] = useState<OnboardingProfile>(initialProfile);
  const [stepIndex, setStepIndex] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = stepDefinitions[stepIndex];
  const scores = calculateProfileScores(profile);
  const recommendations = useMemo(() => recommendMatches(profile, 4), [profile]);
  const isLastStep = stepIndex === stepDefinitions.length - 1;

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }

    // Handle form submission logic here if needed
  }, [isSubmitting]);

  const validateCurrentStep = () => {
    const requiredFields = currentStep.fields;

    for (const field of requiredFields) {
      const value = profile[field];
      if (typeof value === "string" && value.trim().length === 0) {
        setError(`${getFieldLabel(field)} is required.`);
        return false;
      }
    }

    if (currentStep.id === "identity" && !profile.workEmail.includes("@")) {
      setError("Enter a valid work email.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    setStepIndex((current) => {
      const next = Math.min(current + 1, stepDefinitions.length - 1);
      setMaxVisitedStep((visited) => Math.max(visited, next));
      return next;
    });
  };

  const handleBack = () => {
    setError(null);
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const handleRoleSelect = (role: OnboardingProfile["role"]) => {
    setProfile((current) => ({ ...current, role }));
    setError(null);
    if (stepIndex === 0) {
      setStepIndex(1);
      setMaxVisitedStep((visited) => Math.max(visited, 1));
    }
  };

  const handleStepJump = (targetStep: number) => {
    if (targetStep > maxVisitedStep) {
      return;
    }

    setError(null);
    setStepIndex(targetStep);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName: profile.fullName }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to create account.");
      }

      localStorage.setItem(onboardingStorageKey, JSON.stringify(profile));
      localStorage.setItem(onboardingScoresStorageKey, JSON.stringify(scores));
      
      // Redirect to dashboard after successful signup
      router.replace("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="onboarding-flow-panel mx-auto flex w-full max-w-2xl items-center justify-center py-4 lg:py-8">
      <div className="w-full rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.28)] lg:p-8">
        <div className="flex flex-col gap-6">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <ThemeLogo
                className="h-12 w-auto shrink-0 object-contain"
                sageClassName="h-16 w-auto shrink-0 object-contain lg:h-20"
              />
              <div>
                <h1 className="text-2xl font-bold leading-none text-slate-900">WeLink</h1>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Onboarding</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {currentStep.label}
              </p>
              <h2 className="text-3xl font-bold text-slate-900">{currentStep.title}</h2>
            </div>
          </div>

          {stepIndex === stepDefinitions.length - 1 ? (
            <div className="grid w-full max-w-lg grid-cols-2 gap-3">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Fit score</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{scores.fitScore}</p>
                <p className="mt-1 text-sm text-slate-500">Compatibility with the right counterparties.</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Opportunity</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{scores.opportunityScore}</p>
                <p className="mt-1 text-sm text-slate-500">Commercial readiness based on budget and timing.</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {stepDefinitions.map((step, index) => (
            <button
              type="button"
              key={step.id}
              onClick={() => handleStepJump(index)}
              disabled={index > maxVisitedStep || isSubmitting}
              className={[
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition duration-200",
                index === stepIndex
                  ? "border-slate-900 bg-slate-900 text-white shadow-[0_8px_18px_-14px_rgba(15,23,42,0.9)]"
                  : index < stepIndex
                    ? "border-slate-200 bg-slate-50 text-slate-700"
                    : "border-slate-200 bg-white text-slate-400",
                index <= maxVisitedStep && !isSubmitting ? "cursor-pointer" : "cursor-not-allowed opacity-70",
              ].join(" ")}
            >
              {index + 1}. {step.label}
            </button>
          ))}
        </div>

        <div className="mt-8 mx-auto max-w-lg rounded-[28px] border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
          {currentStep.id === "identity" ? (
            <div className="mx-auto grid w-full max-w-md gap-5">
              <label className="block sm:col-span-2">
                <span className="text-[15px] font-semibold text-slate-900">Full name</span>
                <input
                  value={profile.fullName}
                  onChange={(event) => setProfile((current) => ({ ...current, fullName: event.target.value }))}
                  className={inputClass}
                  placeholder="Devon Demacco"
                />
              </label>
              <label className="block">
                <span className="text-[15px] font-semibold text-slate-900">Work email</span>
                <input
                  value={profile.workEmail}
                  onChange={(event) => setProfile((current) => ({ ...current, workEmail: event.target.value }))}
                  className={inputClass}
                  placeholder="you@company.com"
                />
              </label>
              <label className="block">
                <span className="text-[15px] font-semibold text-slate-900">Company name</span>
                <input
                  value={profile.companyName}
                  onChange={(event) => setProfile((current) => ({ ...current, companyName: event.target.value }))}
                  className={inputClass}
                  placeholder="WeLink Partners"
                />
              </label>
            </div>
          ) : null}

          {currentStep.id === "role" ? (
            <div className="space-y-5">
              <div className="mx-auto grid w-full max-w-sm gap-3">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleRoleSelect(option.value)}
                    title={option.tooltip}
                    aria-label={`${option.title}: ${option.tooltip}`}
                    className={[
                      "rounded-[24px] border p-5 text-left transition duration-200 hover:-translate-y-0.5",
                      profile.role === option.value
                        ? "border-slate-900 bg-slate-900 text-white shadow-[0_18px_30px_-20px_rgba(15,23,42,0.72)]"
                        : "border-slate-200 bg-white text-slate-900 shadow-[0_1px_1px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:shadow-[0_10px_20px_-18px_rgba(15,23,42,0.45)]",
                    ].join(" ")}
                  >
                    <p className="text-lg font-semibold">{option.title}</p>
                  </button>
                ))}
              </div>
              <p className="text-center text-base font-semibold text-slate-700">
                Already have an account?{" "}
                <Link href="/" className="text-slate-900 underline decoration-slate-500 underline-offset-4 transition hover:decoration-slate-900">
                  Sign in
                </Link>
              </p>
            </div>
          ) : null}

          {currentStep.id === "profile" ? (
            <div className="mx-auto grid w-full max-w-md gap-5">
              <label className="block">
                <span className="text-[15px] font-semibold text-slate-900">Industry</span>
                <input
                  value={profile.industry}
                  onChange={(event) => setProfile((current) => ({ ...current, industry: event.target.value }))}
                  className={inputClass}
                  placeholder="Business Strategy"
                />
              </label>
              <label className="block">
                <span className="text-[15px] font-semibold text-slate-900">Services or capabilities</span>
                <input
                  value={profile.services}
                  onChange={(event) => setProfile((current) => ({ ...current, services: event.target.value }))}
                  className={inputClass}
                  placeholder="Growth advisory, strategic partnerships"
                />
              </label>
            </div>
          ) : null}

          {currentStep.id === "economics" ? (
            <div className="mx-auto grid w-full max-w-md gap-5">
              <label className="block">
                <span className="text-[15px] font-semibold text-slate-900">Employees</span>
                <select
                  value={profile.employeeRange}
                  onChange={(event) => setProfile((current) => ({ ...current, employeeRange: event.target.value as OnboardingProfile["employeeRange"] }))}
                  className={inputClass}
                >
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-plus">201+</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[15px] font-semibold text-slate-900">Revenue</span>
                <select
                  value={profile.revenueRange}
                  onChange={(event) => setProfile((current) => ({ ...current, revenueRange: event.target.value as OnboardingProfile["revenueRange"] }))}
                  className={inputClass}
                >
                  <option value="pre-revenue">Pre-revenue</option>
                  <option value="under-1m">Under $1M</option>
                  <option value="1m-10m">$1M-$10M</option>
                  <option value="10m-plus">$10M+</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[15px] font-semibold text-slate-900">Budget</span>
                <select
                  value={profile.budgetRange}
                  onChange={(event) => setProfile((current) => ({ ...current, budgetRange: event.target.value as OnboardingProfile["budgetRange"] }))}
                  className={inputClass}
                >
                  <option value="under-10k">Under $10K</option>
                  <option value="10k-50k">$10K-$50K</option>
                  <option value="50k-250k">$50K-$250K</option>
                  <option value="250k-plus">$250K+</option>
                </select>
              </label>
            </div>
          ) : null}

          {currentStep.id === "intent" ? (
            <div className="mx-auto grid w-full max-w-md gap-5">
              <label className="block">
                <span className="text-[15px] font-semibold text-slate-900">Location</span>
                <input
                  value={profile.location}
                  onChange={(event) => setProfile((current) => ({ ...current, location: event.target.value }))}
                  className={inputClass}
                  placeholder="Miami, FL"
                />
              </label>
              <label className="block">
                <span className="text-[15px] font-semibold text-slate-900">Timeline</span>
                <select
                  value={profile.timeline}
                  onChange={(event) => setProfile((current) => ({ ...current, timeline: event.target.value as OnboardingProfile["timeline"] }))}
                  className={inputClass}
                >
                  <option value="immediate">Immediate</option>
                  <option value="quarter">This quarter</option>
                  <option value="half-year">Within 6 months</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[15px] font-semibold text-slate-900">Primary goals</span>
                <textarea
                  value={profile.goals}
                  onChange={(event) => setProfile((current) => ({ ...current, goals: event.target.value }))}
                  className={textareaClass}
                  placeholder="Warm introductions to strategic partners, regional operators, and growth-minded clients."
                />
              </label>
            </div>
          ) : null}

          {currentStep.id === "review" ? (
            <div className="space-y-5">
              <div className="grid gap-3">
                <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Matching mode</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{scores.matchingMode}</p>
                  <p className="mt-2 text-sm text-slate-500">{scores.summary}</p>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Profile summary</p>
                  <p className="mt-2 text-sm text-slate-700">{profile.fullName} at {profile.companyName}</p>
                  <p className="mt-1 text-sm text-slate-500">{profile.industry} • {profile.location} • {profile.timeline}</p>
                </div>
              </div>

              <div className="grid gap-3">
                {[
                  ["Role", profile.role],
                  ["Employees", profile.employeeRange],
                  ["Revenue", profile.revenueRange],
                  ["Budget", profile.budgetRange],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[22px] border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Mock graph output</p>
                    <p className="mt-1 text-sm text-slate-500">Top recommendations from shortest-path + profile compatibility scoring.</p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                    {recommendations.length} matches
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {recommendations.map((match) => (
                    <div key={match.nodeId} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">{match.name}</p>
                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                          <span>Fit {match.fitScore}</span>
                          <span>Opportunity {match.opportunityScore}</span>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Path: {match.shortestPath.join(" -> ")}</p>
                      <p className="mt-1 text-xs text-slate-500">{match.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

          {error ? <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-rose-600">{error}</p> : null}

          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {currentStep.id === "role" ? null : (
            <button
              type="button"
              onClick={isLastStep ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className="rounded-2xl bg-slate-950 px-6 py-3 font-semibold text-white shadow-[0_14px_24px_-16px_rgba(15,23,42,0.75)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_20px_28px_-18px_rgba(15,23,42,0.85)] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:order-2"
            >
              {isSubmitting ? "Creating Account..." : isLastStep ? "Create Account" : "Continue"}
            </button>
          )}

          <div className="flex items-center gap-3 sm:order-1">
            <button
              type="button"
              onClick={handleBack}
              disabled={stepIndex === 0 || isSubmitting}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
