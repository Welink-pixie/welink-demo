"use client";

import Link from "next/link";
import { useState } from "react";

type Lane = {
  label: string;
  href: string;
  summary: string;
  locked?: boolean;
};

const personaCompanies = [
  "Prism Analytics",
  "Flux Systems",
  "Helix Data",
  "Nexus Cloud",
  "Momentum Partners",
  "Caliber Consulting",
  "Apex Strategy",
  "Pinnacle Advisory",
  "VitalCare Solutions",
  "Emerge Health Tech",
  "Compass Clinics",
  "Sterling Ventures",
];

const strategyPillars = [
  {
    title: "Hybrid Discovery + Claim",
    detail:
      "Bootstrap a searchable business catalog, then convert listings into claimed and verified business identities.",
  },
  {
    title: "Opportunity Search",
    detail:
      "Rank for likely successful outcomes, not just filter matches. Decision quality beats record completeness.",
  },
  {
    title: "Activity Index",
    detail:
      "Continuously score freshness, trust, responsiveness, and outcomes so rankings adapt in near real time.",
  },
  {
    title: "Graph Data Moat",
    detail:
      "Every introduction, response, and closed deal strengthens a proprietary relationship graph competitors cannot copy.",
  },
];

const hybridGrowthPlan = [
  {
    step: "1",
    title: "Build catalog",
    detail: "Populate from public records, licensed providers, and consented CRM sources.",
  },
  {
    step: "2",
    title: "Claim business",
    detail: "Owners verify identity and activate richer profile controls.",
  },
  {
    step: "3",
    title: "Add exclusive value",
    detail: "Broker score, match fit, success rate, response time, and completed introductions.",
  },
  {
    step: "4",
    title: "Scale confidence",
    detail: "Use outcomes to improve ranking quality and opportunity readiness scoring.",
  },
];

const openSourceStack = [
  { layer: "API", tech: "FastAPI" },
  { layer: "Backend", tech: "Python" },
  { layer: "Primary DB", tech: "PostgreSQL" },
  { layer: "Graph", tech: "Apache AGE (later Neo4j)" },
  { layer: "Vector", tech: "pgvector or Qdrant" },
  { layer: "Search", tech: "OpenSearch" },
  { layer: "Queue", tech: "Celery or Dramatiq" },
  { layer: "Cache", tech: "Redis" },
  { layer: "Embeddings", tech: "BGE / Nomic" },
  { layer: "LLM", tech: "Qwen 3, Llama 3.x, or Mistral-class models" },
  { layer: "UI", tech: "Next.js + React" },
];

const readinessSignals = [
  "Last activity",
  "Response speed",
  "Verified business status",
  "Recent introductions completed",
  "Deal conversion history",
  "Current availability",
  "Relationship distance",
  "Trust and broker scores",
];

const exploreMoments = [
  {
    title: "Discovery",
    detail: "User lands in Explore and sees ranked, rationale-backed matches.",
  },
  {
    title: "Signal Review",
    detail: "Cards explain fit, opportunity score, and mutual path confidence.",
  },
  {
    title: "Action",
    detail: "User requests intro, saves a prospect, or opens profile details.",
  },
  {
    title: "Monetization",
    detail: "Messages unlocks after subscription and keeps deal flow inside WeLink.",
  },
];

export default function ExperimentalPlaybookPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const lanes: Lane[] = [
    {
      label: "Home",
      href: "/dashboard",
      summary: "Personalized snapshot and momentum indicators.",
    },
    {
      label: "Network",
      href: "/dashboard/network",
      summary: "Relationship graph and warm path context.",
    },
    {
      label: "Explore",
      href: "/dashboard/matches",
      summary: "Match + opportunity discovery in one place.",
    },
    {
      label: "Messages",
      href: "/dashboard/messages",
      summary: "Unlocked for subscribed users.",
      locked: !isSubscribed,
    },
  ];

  return (
    <section className="p-4 lg:p-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Experimental</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Investor Demo Playbook</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              July 3 strategy summary translated into a concrete product blueprint: bootstrap discovery, convert to claimed
              profiles, rank by opportunity readiness, and gate messaging with subscription.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/experimental-survey"
              className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              Intake Survey Lab
            </Link>
            <button
              type="button"
              onClick={() => setIsSubscribed((current) => !current)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                isSubscribed
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-300 bg-slate-100 text-slate-700"
              }`}
            >
              {isSubscribed ? "Subscribed: On" : "Subscribed: Off"}
            </button>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {lanes.map((lane) => {
            const cardClass = lane.locked
              ? "border-slate-200 bg-slate-50/80"
              : "border-indigo-200 bg-indigo-50/70";

            if (lane.locked) {
              return (
                <div key={lane.label} className={`rounded-2xl border p-4 ${cardClass}`}>
                  <div className="mb-2 inline-flex rounded-full border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">
                    Locked
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{lane.label}</h2>
                  <p className="mt-2 text-sm text-slate-600">{lane.summary}</p>
                  <p className="mt-3 text-xs font-medium text-slate-500">Requires active subscription</p>
                </div>
              );
            }

            return (
              <Link key={lane.label} href={lane.href} className={`rounded-2xl border p-4 transition hover:shadow-sm ${cardClass}`}>
                <div className="mb-2 inline-flex rounded-full border border-indigo-200 bg-white px-2 py-1 text-[11px] font-semibold text-indigo-600">
                  Active
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{lane.label}</h2>
                <p className="mt-2 text-sm text-slate-600">{lane.summary}</p>
                <p className="mt-3 text-xs font-medium text-indigo-700">Open section</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Strategic Direction</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {strategyPillars.map((pillar) => (
              <div key={pillar.title} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{pillar.title}</p>
                <p className="mt-1 text-sm text-slate-600">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Explore Funnel Moments</h3>
            <div className="mt-4 space-y-3">
              {exploreMoments.map((moment, index) => (
                <div key={moment.title} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step {index + 1}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{moment.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{moment.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Persona Logo Backlog</h3>
            <p className="mt-2 text-sm text-slate-600">
              Assorted company set for image-model logo generation and realistic demo storytelling.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {personaCompanies.map((company) => (
                <div key={company} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Hybrid Growth Plan</h3>
            <div className="mt-4 space-y-3">
              {hybridGrowthPlan.map((item) => (
                <div key={item.step} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phase {item.step}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Opportunity Readiness Signals</h3>
            <p className="mt-2 text-sm text-slate-600">
              Prioritize businesses most likely to close opportunities now, not just those matching static filters.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {readinessSignals.map((signal) => (
                <div key={signal} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                  {signal}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              Final rank = semantic + industry + location + trust + freshness + broker + graph distance + success rate +
              availability
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Open Source Build Path (Capital-Efficient)</h3>
          <p className="mt-2 text-sm text-slate-600">
            Keep model spend low by using open models for explanation while deterministic scoring and your graph drive
            recommendation quality.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {openSourceStack.map((row) => (
              <div key={row.layer} className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{row.layer}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{row.tech}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
