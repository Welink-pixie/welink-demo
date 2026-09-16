"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type SurveyData = {
  companyName: string;
  website: string;
  workEmail: string;
  hqCity: string;
  regionsServed: string;
  industry: string;
  subIndustry: string;
  employeeBand: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
  revenueBand: "<1M" | "1M-10M" | "10M-50M" | "50M+";
  role: "buyer" | "provider" | "hybrid";
  topGoal: string;
  urgency: "low" | "medium" | "high";
  budgetBand: "<10k" | "10k-50k" | "50k-250k" | "250k+";
  decisionTimeline: "exploring" | "quarter" | "half-year" | "immediate";
  dealSize: "<10k" | "10k-50k" | "50k-250k" | "250k+";
  deliveryModel: "remote" | "hybrid" | "onsite";
  capacity: "low" | "medium" | "high";
  mustHave: string;
  hardNo: string;
  preferredCounterpartySize: "startup" | "smb" | "mid-market" | "enterprise";
  complianceNeeds: string;
  knownPartners: string;
  introQualityPriority: "speed" | "fit" | "warmth";
};

const initialData: SurveyData = {
  companyName: "",
  website: "",
  workEmail: "",
  hqCity: "",
  regionsServed: "",
  industry: "",
  subIndustry: "",
  employeeBand: "11-50",
  revenueBand: "1M-10M",
  role: "buyer",
  topGoal: "",
  urgency: "medium",
  budgetBand: "10k-50k",
  decisionTimeline: "quarter",
  dealSize: "10k-50k",
  deliveryModel: "hybrid",
  capacity: "medium",
  mustHave: "",
  hardNo: "",
  preferredCounterpartySize: "smb",
  complianceNeeds: "",
  knownPartners: "",
  introQualityPriority: "fit",
};

const sectionIds = ["Identity", "Intent", "Supply", "Constraints", "Graph"] as const;

const baselineBusiness: SurveyData = {
  companyName: "Northstar Growth Partners",
  website: "https://northstargrowth.example",
  workEmail: "ops@northstargrowth.example",
  hqCity: "Toronto, ON",
  regionsServed: "Canada, US Northeast",
  industry: "Healthcare Services",
  subIndustry: "Post-acute operations",
  employeeBand: "51-200",
  revenueBand: "10M-50M",
  role: "buyer",
  topGoal: "Find operating partners and strategic providers for multi-site healthcare expansion",
  urgency: "high",
  budgetBand: "50k-250k",
  decisionTimeline: "quarter",
  dealSize: "50k-250k",
  deliveryModel: "hybrid",
  capacity: "medium",
  mustHave: "Healthcare operating experience, measurable outcomes, North America coverage",
  hardNo: "No unverified vendors, no pure offshore handoff model",
  preferredCounterpartySize: "mid-market",
  complianceNeeds: "HIPAA, SOC2",
  knownPartners: "Athenahealth, HubSpot",
  introQualityPriority: "fit",
};

const completionFields: Array<keyof SurveyData> = [
  "companyName",
  "website",
  "workEmail",
  "hqCity",
  "regionsServed",
  "industry",
  "subIndustry",
  "topGoal",
  "mustHave",
  "hardNo",
  "complianceNeeds",
];

function normalizeBand(value: SurveyData["employeeBand"] | SurveyData["revenueBand"] | SurveyData["budgetBand"] | SurveyData["dealSize"]) {
  switch (value) {
    case "1-10":
    case "<1M":
    case "<10k":
      return 0.2;
    case "11-50":
    case "1M-10M":
    case "10k-50k":
      return 0.45;
    case "51-200":
    case "10M-50M":
    case "50k-250k":
      return 0.7;
    case "201-500":
      return 0.85;
    case "500+":
    case "50M+":
    case "250k+":
      return 1;
    default:
      return 0.5;
  }
}

function normalizeUrgency(value: SurveyData["urgency"] | SurveyData["capacity"]) {
  switch (value) {
    case "high":
      return 1;
    case "medium":
      return 0.6;
    default:
      return 0.25;
  }
}

function normalizeTimeline(value: SurveyData["decisionTimeline"]) {
  switch (value) {
    case "immediate":
      return 1;
    case "quarter":
      return 0.75;
    case "half-year":
      return 0.45;
    default:
      return 0.2;
  }
}

function tokenize(value: string) {
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 1),
  );
}

type IndustryCluster =
  | "healthcare"
  | "finance"
  | "technology"
  | "operations"
  | "logistics"
  | "manufacturing"
  | "other";

const industryAliases: Record<IndustryCluster, string[]> = {
  healthcare: ["health", "healthcare", "medical", "clinic", "hospital", "life", "pharma", "biotech", "patient"],
  finance: ["finance", "financial", "bank", "banking", "fintech", "capital", "insurance", "investment"],
  technology: ["technology", "tech", "software", "saas", "ai", "it", "data", "cloud", "platform"],
  operations: ["operations", "services", "consulting", "advisory", "bpo"],
  logistics: ["logistics", "supply", "freight", "shipping", "transport"],
  manufacturing: ["manufacturing", "industrial", "factory", "production", "hardware"],
  other: [],
};

const relatedIndustryScores: Record<IndustryCluster, Partial<Record<IndustryCluster, number>>> = {
  healthcare: { operations: 0.45, technology: 0.35 },
  finance: { technology: 0.45, operations: 0.3 },
  technology: { finance: 0.45, healthcare: 0.35, operations: 0.35 },
  operations: { healthcare: 0.45, finance: 0.3, technology: 0.35, logistics: 0.4 },
  logistics: { operations: 0.4, manufacturing: 0.4 },
  manufacturing: { logistics: 0.4, operations: 0.3 },
  other: {},
};

function detectIndustryCluster(value: string): IndustryCluster {
  const tokens = tokenize(value);

  for (const [cluster, aliases] of Object.entries(industryAliases) as Array<[IndustryCluster, string[]]>) {
    if (aliases.some((alias) => tokens.has(alias))) {
      return cluster;
    }
  }

  return "other";
}

function industrySimilarity(a: string, b: string) {
  const clusterA = detectIndustryCluster(a);
  const clusterB = detectIndustryCluster(b);

  if (clusterA === "other" || clusterB === "other") {
    return jaccard(a, b);
  }

  if (clusterA === clusterB) {
    return 1;
  }

  return relatedIndustryScores[clusterA][clusterB] ?? relatedIndustryScores[clusterB][clusterA] ?? 0.1;
}

function jaccard(a: string, b: string) {
  const setA = tokenize(a);
  const setB = tokenize(b);

  if (setA.size === 0 && setB.size === 0) {
    return 0.5;
  }
  if (setA.size === 0 || setB.size === 0) {
    return 0;
  }

  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      intersection += 1;
    }
  }

  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0.5 : intersection / union;
}

function roleCompatibility(candidate: SurveyData["role"], baseline: SurveyData["role"]) {
  if (candidate === baseline) {
    return 1;
  }
  if (candidate === "hybrid" || baseline === "hybrid") {
    return 0.8;
  }
  return 0.55;
}

function modelCompatibility(candidate: SurveyData["deliveryModel"], baseline: SurveyData["deliveryModel"]) {
  if (candidate === baseline) {
    return 1;
  }
  if (candidate === "hybrid" || baseline === "hybrid") {
    return 0.75;
  }
  return 0.5;
}

function rangeCloseness(a: number, b: number) {
  return Math.max(0, 1 - Math.abs(a - b));
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0.5 : dot / denom;
}

function hasHardNoConflict(hardNoText: string, baseline: SurveyData) {
  const hardNoTokens = tokenize(hardNoText);
  if (hardNoTokens.size === 0) {
    return false;
  }

  const baselineSignature = tokenize([
    baseline.industry,
    baseline.subIndustry,
    baseline.deliveryModel,
    baseline.preferredCounterpartySize,
    baseline.complianceNeeds,
  ].join(" "));

  for (const token of hardNoTokens) {
    if (baselineSignature.has(token)) {
      return true;
    }
  }

  return false;
}

function buildVector(profile: SurveyData, baseline: SurveyData) {
  const counterpartySizeScale: Record<SurveyData["preferredCounterpartySize"], number> = {
    startup: 0.35,
    smb: 0.6,
    "mid-market": 0.8,
    enterprise: 1,
  };

  const introPriorityScale: Record<SurveyData["introQualityPriority"], number> = {
    speed: 0.45,
    fit: 1,
    warmth: 0.75,
  };

  return [
    roleCompatibility(profile.role, baseline.role),
    normalizeBand(profile.employeeBand),
    normalizeBand(profile.revenueBand),
    normalizeBand(profile.budgetBand),
    normalizeBand(profile.dealSize),
    normalizeTimeline(profile.decisionTimeline),
    normalizeUrgency(profile.urgency),
    normalizeUrgency(profile.capacity),
    modelCompatibility(profile.deliveryModel, baseline.deliveryModel),
    counterpartySizeScale[profile.preferredCounterpartySize],
    introPriorityScale[profile.introQualityPriority],
  ];
}

function clamp(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

const scoreTermTooltips: Record<string, string> = {
  "Fit score (blended)": "Your overall match score. Higher means your profile looks more like a strong fit for this target.",
  "Cosine similarity": "How similar your full profile pattern is to the target profile. Think of it as an overall shape match.",
  "Linear weighted score": "A points total from key answers like industry, goals, requirements, budget, and timeline.",
  Confidence: "How reliable this score is right now. More complete and clearer answers usually increase confidence.",
  "Vector similarity signal": "Bonus points when your overall profile pattern lines up well with the target profile.",
  "Hard-no conflict penalty": "Points removed when your deal-breakers conflict with what this target profile needs.",
};

const driverTooltips: Record<string, string> = {
  "Industry overlap": "How close your industry is to the target company industry.",
  "Sub-industry overlap": "How close your niche or specialty is to the target niche.",
  "Goal alignment": "How closely your main business goal matches the target goal.",
  "Must-have overlap": "How many of your required criteria match what this target values.",
  "Compliance overlap": "How well your compliance needs match the target requirements.",
  "Partner graph overlap": "How similar your tools and partners are to this target's ecosystem.",
  "Role compatibility": "How well your role (buyer, provider, hybrid) fits this target profile.",
  "Delivery model fit": "How close your preferred way of working is (remote, hybrid, onsite).",
  "Budget fit": "How close your budget range is to the target range.",
  "Deal-size fit": "How close your typical deal size is to this target's deal size.",
  "Timeline fit": "How close your decision speed is to the target timeline.",
  "Vector similarity signal": scoreTermTooltips["Vector similarity signal"],
  "Hard-no conflict penalty": scoreTermTooltips["Hard-no conflict penalty"],
  "Fill in survey fields to see fit explainability": "Add a few more answers and we will show what is helping or hurting your score.",
};

function getTooltip(label: string) {
  return scoreTermTooltips[label] ?? driverTooltips[label] ?? "";
}

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 focus:ring";

export default function ExperimentalSurveyPage() {
  const [data, setData] = useState<SurveyData>(initialData);
  const [activeSection, setActiveSection] = useState(0);

  const derived = useMemo(() => {
    const completionCount = completionFields.filter((field) => data[field].trim().length > 0).length;
    const completionRatio = completionCount / completionFields.length;

    const defaultDimension = {
      label: "Not enough input yet",
      score: 0,
      weight: 1,
      weighted: 0,
    };

    if (completionCount === 0) {
      return {
        linearScore: 0,
        cosineScore: 0,
        fitScore: 0,
        confidence: 0,
        hasConflict: false,
        topStrength: defaultDimension,
        topRisk: defaultDimension,
        fitDrivers: [
          {
            label: "Fill in survey fields to see fit explainability",
            points: 0,
          },
        ],
        mode:
          data.role === "buyer"
            ? "Demand-side ranking"
            : data.role === "provider"
              ? "Supply-side ranking"
              : "Two-sided ranking",
      };
    }

    const baselineVector = buildVector(baselineBusiness, baselineBusiness);
    const candidateVector = buildVector(data, baselineBusiness);
    const cosine = cosineSimilarity(candidateVector, baselineVector);

    const weightedDimensions = [
      {
        label: "Industry overlap",
        score: industrySimilarity(data.industry, baselineBusiness.industry),
        weight: 0.12,
      },
      {
        label: "Sub-industry overlap",
        score: industrySimilarity(data.subIndustry, baselineBusiness.subIndustry),
        weight: 0.08,
      },
      {
        label: "Goal alignment",
        score: jaccard(data.topGoal, baselineBusiness.topGoal),
        weight: 0.1,
      },
      {
        label: "Must-have overlap",
        score: jaccard(data.mustHave, baselineBusiness.mustHave),
        weight: 0.13,
      },
      {
        label: "Compliance overlap",
        score: jaccard(data.complianceNeeds, baselineBusiness.complianceNeeds),
        weight: 0.1,
      },
      {
        label: "Partner graph overlap",
        score: jaccard(data.knownPartners, baselineBusiness.knownPartners),
        weight: 0.07,
      },
      {
        label: "Role compatibility",
        score: roleCompatibility(data.role, baselineBusiness.role),
        weight: 0.09,
      },
      {
        label: "Delivery model fit",
        score: modelCompatibility(data.deliveryModel, baselineBusiness.deliveryModel),
        weight: 0.06,
      },
      {
        label: "Budget fit",
        score: rangeCloseness(normalizeBand(data.budgetBand), normalizeBand(baselineBusiness.budgetBand)),
        weight: 0.09,
      },
      {
        label: "Deal-size fit",
        score: rangeCloseness(normalizeBand(data.dealSize), normalizeBand(baselineBusiness.dealSize)),
        weight: 0.08,
      },
      {
        label: "Timeline fit",
        score: rangeCloseness(normalizeTimeline(data.decisionTimeline), normalizeTimeline(baselineBusiness.decisionTimeline)),
        weight: 0.08,
      },
    ];

    const linearScore = weightedDimensions.reduce((total, item) => total + item.score * item.weight, 0);
    const hardNoPenalty = hasHardNoConflict(data.hardNo, baselineBusiness) ? 0.12 : 0;
    const blendedFit = clamp(0, 99, (linearScore * 0.6 + cosine * 0.4 - hardNoPenalty) * 100);

    const textSignal =
      (jaccard(data.topGoal, baselineBusiness.topGoal) +
        jaccard(data.mustHave, baselineBusiness.mustHave) +
        jaccard(data.complianceNeeds, baselineBusiness.complianceNeeds)) /
      3;

    const confidence = clamp(0, 99, (completionRatio * 0.65 + textSignal * 0.25 + cosine * 0.1) * 100);

    const ranked = weightedDimensions
      .map((entry) => ({ ...entry, weighted: entry.score * entry.weight }))
      .sort((a, b) => b.weighted - a.weighted);

    const fitDrivers = [
      ...weightedDimensions.map((entry) => ({
        label: entry.label,
        points: (entry.score - 0.5) * entry.weight * 0.6 * 100 * completionRatio,
      })),
      {
        label: "Vector similarity signal",
        points: (cosine - 0.5) * 0.4 * 100 * completionRatio,
      },
      {
        label: "Hard-no conflict penalty",
        points: hasHardNoConflict(data.hardNo, baselineBusiness) ? -hardNoPenalty * completionRatio * 100 : 0,
      },
    ]
      .sort((a, b) => Math.abs(b.points) - Math.abs(a.points))
      .slice(0, 6);

    return {
      linearScore: clamp(0, 99, linearScore * completionRatio * 100),
      cosineScore: clamp(0, 99, cosine * completionRatio * 100),
      fitScore: clamp(0, 99, blendedFit * completionRatio),
      confidence,
      hasConflict: hasHardNoConflict(data.hardNo, baselineBusiness),
      topStrength: ranked[0],
      topRisk: ranked[ranked.length - 1],
      fitDrivers,
      mode:
        data.role === "buyer"
          ? "Demand-side ranking"
          : data.role === "provider"
            ? "Supply-side ranking"
            : "Two-sided ranking",
    };
  }, [data]);

  const update = <K extends keyof SurveyData>(key: K, value: SurveyData[K]) => {
    setData((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="p-4 lg:p-6">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Experimental</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Intake Survey Lab</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Sandbox page to pressure-test onboarding questions and score logic before wiring into signup.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/opportunities"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to opportunities
            </Link>
          </div>
        </div>

        <div className="experimental-notice-banner mb-4 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs font-semibold text-emerald-900">
          Experimental only: this page does not create users or write records.
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {sectionIds.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveSection(index)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    index === activeSection
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {index + 1}. {label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              {activeSection === 0 ? (
                <>
                  <label className="text-sm font-medium text-slate-700">Company name
                    <input value={data.companyName} onChange={(e) => update("companyName", e.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-medium text-slate-700">Website
                    <input value={data.website} onChange={(e) => update("website", e.target.value)} className={inputClass} placeholder="https://" />
                  </label>
                  <label className="text-sm font-medium text-slate-700">Work email
                    <input value={data.workEmail} onChange={(e) => update("workEmail", e.target.value)} className={inputClass} placeholder="you@company.com" />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-slate-700">HQ city
                      <input value={data.hqCity} onChange={(e) => update("hqCity", e.target.value)} className={inputClass} />
                    </label>
                    <label className="text-sm font-medium text-slate-700">Regions served
                      <input value={data.regionsServed} onChange={(e) => update("regionsServed", e.target.value)} className={inputClass} />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-slate-700">Industry
                      <input value={data.industry} onChange={(e) => update("industry", e.target.value)} className={inputClass} />
                    </label>
                    <label className="text-sm font-medium text-slate-700">Sub-industry
                      <input value={data.subIndustry} onChange={(e) => update("subIndustry", e.target.value)} className={inputClass} />
                    </label>
                  </div>
                </>
              ) : null}

              {activeSection === 1 ? (
                <>
                  <label className="text-sm font-medium text-slate-700">Role in marketplace
                    <select value={data.role} onChange={(e) => update("role", e.target.value as SurveyData["role"])} className={inputClass}>
                      <option value="buyer">Buyer / seeker</option>
                      <option value="provider">Provider</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </label>
                  <label className="text-sm font-medium text-slate-700">Top goal (next 6-12 months)
                    <textarea value={data.topGoal} onChange={(e) => update("topGoal", e.target.value)} className={`${inputClass} min-h-24`} />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="text-sm font-medium text-slate-700">Urgency
                      <select value={data.urgency} onChange={(e) => update("urgency", e.target.value as SurveyData["urgency"])} className={inputClass}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </label>
                    <label className="text-sm font-medium text-slate-700">Budget
                      <select value={data.budgetBand} onChange={(e) => update("budgetBand", e.target.value as SurveyData["budgetBand"])} className={inputClass}>
                        <option value="<10k">&lt;10k</option>
                        <option value="10k-50k">10k-50k</option>
                        <option value="50k-250k">50k-250k</option>
                        <option value="250k+">250k+</option>
                      </select>
                    </label>
                    <label className="text-sm font-medium text-slate-700">Timeline
                      <select value={data.decisionTimeline} onChange={(e) => update("decisionTimeline", e.target.value as SurveyData["decisionTimeline"])} className={inputClass}>
                        <option value="exploring">Exploring</option>
                        <option value="quarter">This quarter</option>
                        <option value="half-year">Within 6 months</option>
                        <option value="immediate">Immediate</option>
                      </select>
                    </label>
                  </div>
                </>
              ) : null}

              {activeSection === 2 ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-slate-700">Employee band
                      <select value={data.employeeBand} onChange={(e) => update("employeeBand", e.target.value as SurveyData["employeeBand"])} className={inputClass}>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="201-500">201-500</option>
                        <option value="500+">500+</option>
                      </select>
                    </label>
                    <label className="text-sm font-medium text-slate-700">Revenue band
                      <select value={data.revenueBand} onChange={(e) => update("revenueBand", e.target.value as SurveyData["revenueBand"])} className={inputClass}>
                        <option value="<1M">&lt;1M</option>
                        <option value="1M-10M">1M-10M</option>
                        <option value="10M-50M">10M-50M</option>
                        <option value="50M+">50M+</option>
                      </select>
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="text-sm font-medium text-slate-700">Average deal size
                      <select value={data.dealSize} onChange={(e) => update("dealSize", e.target.value as SurveyData["dealSize"])} className={inputClass}>
                        <option value="<10k">&lt;10k</option>
                        <option value="10k-50k">10k-50k</option>
                        <option value="50k-250k">50k-250k</option>
                        <option value="250k+">250k+</option>
                      </select>
                    </label>
                    <label className="text-sm font-medium text-slate-700">Delivery model
                      <select value={data.deliveryModel} onChange={(e) => update("deliveryModel", e.target.value as SurveyData["deliveryModel"])} className={inputClass}>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">Onsite</option>
                      </select>
                    </label>
                    <label className="text-sm font-medium text-slate-700">Capacity
                      <select value={data.capacity} onChange={(e) => update("capacity", e.target.value as SurveyData["capacity"])} className={inputClass}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </label>
                  </div>
                </>
              ) : null}

              {activeSection === 3 ? (
                <>
                  <label className="text-sm font-medium text-slate-700">Must-have criteria
                    <textarea value={data.mustHave} onChange={(e) => update("mustHave", e.target.value)} className={`${inputClass} min-h-20`} />
                  </label>
                  <label className="text-sm font-medium text-slate-700">Hard no criteria
                    <textarea value={data.hardNo} onChange={(e) => update("hardNo", e.target.value)} className={`${inputClass} min-h-20`} />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-slate-700">Preferred counterparty size
                      <select value={data.preferredCounterpartySize} onChange={(e) => update("preferredCounterpartySize", e.target.value as SurveyData["preferredCounterpartySize"])} className={inputClass}>
                        <option value="startup">Startup</option>
                        <option value="smb">SMB</option>
                        <option value="mid-market">Mid-market</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </label>
                    <label className="text-sm font-medium text-slate-700">Compliance needs
                      <input value={data.complianceNeeds} onChange={(e) => update("complianceNeeds", e.target.value)} className={inputClass} placeholder="SOC2, HIPAA, GDPR" />
                    </label>
                  </div>
                </>
              ) : null}

              {activeSection === 4 ? (
                <>
                  <label className="text-sm font-medium text-slate-700">Known partners or tools
                    <textarea value={data.knownPartners} onChange={(e) => update("knownPartners", e.target.value)} className={`${inputClass} min-h-24`} />
                  </label>
                  <label className="text-sm font-medium text-slate-700">Intro priority
                    <select value={data.introQualityPriority} onChange={(e) => update("introQualityPriority", e.target.value as SurveyData["introQualityPriority"])} className={inputClass}>
                      <option value="fit">Best fit quality</option>
                      <option value="warmth">Warmest path</option>
                      <option value="speed">Fastest path</option>
                    </select>
                  </label>
                </>
              ) : null}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Experimental scoring</p>
              <div className="mt-3 grid gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fit score (blended)</p>
                    <span
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-500"
                      title={getTooltip("Fit score (blended)")}
                      aria-label="Fit score (blended) explanation"
                    >
                      ?
                    </span>
                  </div>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{derived.fitScore}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-700">Cosine similarity: {derived.cosineScore}</p>
                    <span
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-500"
                      title={getTooltip("Cosine similarity")}
                      aria-label="Cosine similarity explanation"
                    >
                      ?
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-700">Linear weighted score: {derived.linearScore}</p>
                    <span
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-500"
                      title={getTooltip("Linear weighted score")}
                      aria-label="Linear weighted score explanation"
                    >
                      ?
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-700">Confidence: {derived.confidence}</p>
                    <span
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-500"
                      title={getTooltip("Confidence")}
                      aria-label="Confidence explanation"
                    >
                      ?
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Match mode</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{derived.mode}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Top matching dimension</p>
                  <p className="mt-1">{derived.topStrength.label}: {clamp(0, 99, derived.topStrength.score * 100)}</p>
                  <p className="mt-2 font-semibold text-slate-900">Largest mismatch</p>
                  <p className="mt-1">{derived.topRisk.label}: {clamp(0, 99, derived.topRisk.score * 100)}</p>
                  {derived.hasConflict ? (
                    <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
                      Hard-no criteria appears to conflict with baseline profile.
                    </p>
                  ) : null}

                  <p className="mt-3 font-semibold text-slate-900">Why this score moved</p>
                  <div className="mt-2 space-y-1.5">
                    {derived.fitDrivers.map((driver) => {
                      const rounded = clamp(-99, 99, driver.points);
                      const tone = rounded > 0 ? "text-emerald-700" : rounded < 0 ? "text-rose-700" : "text-slate-500";
                      const sign = rounded > 0 ? "+" : "";

                      return (
                        <div key={driver.label} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-slate-700">{driver.label}</span>
                            {getTooltip(driver.label) ? (
                              <span
                                className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-slate-300 text-[9px] font-bold text-slate-500"
                                title={getTooltip(driver.label)}
                                aria-label={`${driver.label} explanation`}
                              >
                                ?
                              </span>
                            ) : null}
                          </div>
                          <span className={`text-xs font-semibold ${tone}`}>{sign}{rounded} pts</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">What this page helps validate</p>
              <ul className="mt-2 space-y-1">
                <li>Question clarity before production onboarding</li>
                <li>Which fields impact fit score quality most</li>
                <li>Where users need defaults vs required inputs</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
