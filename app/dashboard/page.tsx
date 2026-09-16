"use client";

import NetworkMap from "@/components/network/NetworkMap";
import type { Company } from "@/components/network/networkData";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type KeeptabzSearchCompetitor = {
  id: number;
  name: string;
  websiteUrl: string | null;
  overview: string | null;
  g2ReviewsUrl?: string | null;
  capterraReviewsUrl?: string | null;
  trustpilotReviewsUrl?: string | null;
  socialProfiles?: Array<{ followers: number | null }>;
};

function competitorToCompany(competitor: KeeptabzSearchCompetitor): Company {
  const followers = competitor.socialProfiles?.reduce((sum, profile) => sum + (profile.followers ?? 0), 0) ?? 0;
  const reviewTags = [
    competitor.g2ReviewsUrl ? "G2" : null,
    competitor.capterraReviewsUrl ? "Capterra" : null,
    competitor.trustpilotReviewsUrl ? "Trustpilot" : null,
  ].filter((tag): tag is string => Boolean(tag));

  return {
    id: `kt-${competitor.id}`,
    name: competitor.name,
    type: "Tracked Company",
    city: competitor.websiteUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "") ?? "Unknown source",
    fitScore: followers > 0 ? Math.min(99, 60 + Math.round(Math.log10(followers + 1) * 8)) : 70,
    value: followers > 0 ? `${followers.toLocaleString()} followers` : "\u2014",
    tags: reviewTags.length ? reviewTags : ["Market Intel"],
    people: [],
    summary: competitor.overview ?? "No overview available.",
    x: "50%",
    y: "50%",
    source: "keeptabz",
  };
}

const topOpportunities = [
  {
    account: "Demacco Consulting",
    target: "Northline Solutions",
    city: "New York, NY",
    fit: 92,
    value: "$2.4M",
  },
  {
    account: "Demacco Consulting",
    target: "HealthFirst Clinics",
    city: "Chicago, IL",
    fit: 78,
    value: "$850K",
  },
  {
    account: "Demacco Consulting",
    target: "Apex Systems",
    city: "Austin, TX",
    fit: 75,
    value: "$520K",
  },
];

const activityItems = [
  {
    text: "Sarah Chen accepted your connection request.",
    time: "2h ago",
  },
  {
    text: "Intro request sent to Northline Solutions.",
    time: "5h ago",
  },
  {
    text: "Devon Demacco updated the opportunity details.",
    time: "1d ago",
  },
  {
    text: "Your meeting with Devon is scheduled for May 15.",
    time: "2d ago",
  },
];

const timelineItems = [
  { label: "Intro Requested", completed: true },
  { label: "Introduction Made", completed: true },
  { label: "Meeting Completed", completed: true },
  { label: "Proposal Sent", completed: false },
  { label: "Partnership Signed", completed: false },
];

export default function DashboardPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [username, setUsername] = useState("User");
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "not-found" | "error" | "needs-auth">(
    "idle",
  );
  const [extraCompanies, setExtraCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const loadUsername = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) return;
        const data = (await response.json()) as { username?: string | null };
        if (data.username) {
          setUsername(data.username);
        }
      } catch {
        // Keep fallback display name when profile lookup fails.
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadUsername();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsDashboardLoading(false);
    }, 450);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const selectedCompany = useMemo(
    () => extraCompanies.find((company) => company.id === selectedCompanyId) ?? null,
    [selectedCompanyId, extraCompanies],
  );

  const handleSearchKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !searchQuery.trim()) return;

    setSearchStatus("loading");

    try {
      const response = await fetch(`/api/keeptabz/competitors?search=${encodeURIComponent(searchQuery.trim())}`);
      const data = (await response.json()) as {
        authorized?: boolean;
        competitors?: KeeptabzSearchCompetitor[];
        authorizeUrl?: string;
      };

      if (!data.authorized) {
        setSearchStatus("needs-auth");
        return;
      }

      const match = data.competitors?.[0];
      if (!match) {
        setSearchStatus("not-found");
        return;
      }

      const company = competitorToCompany(match);
      setExtraCompanies((prev) => [...prev.filter((existing) => existing.id !== company.id), company]);
      setSelectedCompanyId(company.id);
      setSearchStatus("idle");
    } catch {
      setSearchStatus("error");
    }
  };

  return (
        <section className="dashboard-overview-page p-4 lg:p-5">
          <div className="overview-left-hero morphic-card-inset mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-2.5 lg:px-4">
            <p className="text-sm font-medium text-slate-600">
              {isProfileLoading ? "Loading profile..." : `Welcome, ${username}`}
            </p>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <div className="relative flex-1 sm:w-64 sm:flex-none">
                <input
                  type="text"
                  placeholder="Search companies"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-indigo-300"
                />
              </div>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Filter"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
                </svg>
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Notifications"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path d="M15 17H5.5a1 1 0 01-.8-1.6L6 13.7V10a6 6 0 1112 0v3.7l1.3 1.7a1 1 0 01-.8 1.6H18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 19a2 2 0 004 0" strokeLinecap="round" />
                </svg>
              </button>

              <button className="overview-primary-btn rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                Add
              </button>

              <Link
                href="/dashboard/opportunities/opsec-search"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                OPSEC Search
              </Link>

              <Link
                href="/dashboard/experimental-survey"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Experimental Survey
              </Link>
            </div>
          </div>

          {searchStatus !== "idle" && (
            <p className="-mt-2 mb-4 text-xs font-medium text-slate-500">
              {searchStatus === "loading" && "Searching\u2026"}
              {searchStatus === "not-found" && `No match for "${searchQuery}".`}
              {searchStatus === "needs-auth" && (
                <>
                  Company data isn&apos;t connected.{" "}
                  <Link href="/dashboard/market-intel" className="text-indigo-600 hover:underline">
                    Connect it
                  </Link>{" "}
                  to search live companies.
                </>
              )}
              {searchStatus === "error" && "Search failed — please try again."}
            </p>
          )}

            <div className="overview-main-grid grid gap-4 xl:grid-cols-[1.8fr_1fr]">
              <div className="overview-left-map morphic-card-inset overflow-hidden rounded-3xl p-2">
                <NetworkMap
                  selectedCompanyId={selectedCompany?.id}
                  onSelectCompany={setSelectedCompanyId}
                  mapHref="/dashboard/network"
                  extraCompanies={extraCompanies}
                />
              </div>

              <aside className="overview-detail-panel morphic-card rounded-3xl p-5">
                {isDashboardLoading ? (
                  <div className="space-y-4">
                    <div className="h-7 w-56 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                    <div className="space-y-2">
                      <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                      <div className="h-4 w-11/12 animate-pulse rounded bg-slate-100" />
                      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ) : selectedCompany ? (
                  <>
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-950">{selectedCompany.name}</h2>
                        <p className="mt-1 text-sm text-slate-500">
                          {selectedCompany.type} • {selectedCompany.city}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-emerald-600">{selectedCompany.fitScore}%</p>
                        <p className="text-xs font-semibold text-emerald-600">Verified Match</p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600">{selectedCompany.summary}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedCompany.tags.map((tag) => (
                        <span key={tag} className="morphic-pill px-3 py-1 text-xs text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-2">
                      <button className="overview-secondary-btn rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                        Save
                      </button>
                      <button className="overview-primary-btn rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                        Connect
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
                    <p className="text-sm font-semibold text-slate-700">No company selected</p>
                    <p className="mt-1 max-w-[220px] text-sm text-slate-500">
                      Search a company above to add it to your network map.
                    </p>
                  </div>
                )}
              </aside>
            </div>

            <div className="overview-bottom-grid mt-4 grid gap-4 lg:grid-cols-3">
              <section className="morphic-card rounded-3xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Top Opportunities</h3>
                  <button className="text-xs font-medium text-slate-500 hover:text-slate-700">View all</button>
                </div>

                {isDashboardLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={`opp-skeleton-${index}`} className="morphic-card-inset rounded-2xl p-3">
                        <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                        <div className="mt-2 h-4 w-40 animate-pulse rounded bg-slate-200" />
                        <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-100" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topOpportunities.map((item) => (
                      <article
                        key={item.target}
                        className="morphic-card-inset rounded-2xl p-3"
                      >
                        <p className="text-xs text-slate-500">{item.account}</p>
                        <p className="text-sm font-semibold text-slate-900">{item.target}</p>
                        <p className="text-xs text-slate-500">{item.city}</p>
                        <div className="mt-2 flex items-end justify-between">
                          <div>
                            <p className="text-xs text-slate-500">Fit score</p>
                            <p className="text-lg font-semibold text-emerald-600">{item.fit}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Potential value</p>
                            <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className="morphic-card rounded-3xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
                  <button className="text-xs font-medium text-slate-500 hover:text-slate-700">View all</button>
                </div>

                {isDashboardLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={`activity-skeleton-${index}`} className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 animate-pulse rounded-full bg-slate-200" />
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-3.5 w-full animate-pulse rounded bg-slate-100" />
                          <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activityItems.map((item) => (
                      <article key={item.text} className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                        <div className="min-w-0">
                          <p className="text-sm text-slate-700">{item.text}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className="morphic-card rounded-3xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Relationship Timeline</h3>
                  <button className="text-xs font-medium text-slate-500 hover:text-slate-700">View all</button>
                </div>

                {isDashboardLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={`timeline-skeleton-${index}`} className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-200" />
                        <div className="h-3.5 w-40 animate-pulse rounded bg-slate-100" />
                      </div>
                    ))}
                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                      <div className="mt-2 h-7 w-28 animate-pulse rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {timelineItems.map((item) => (
                        <article
                          key={item.label}
                          className={`flex items-center gap-3 transition ${item.completed ? "opacity-100" : "opacity-45"}`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              item.completed ? "bg-emerald-500" : "border border-slate-300 bg-transparent"
                            }`}
                            aria-hidden="true"
                          />
                          <p className={`text-sm ${item.completed ? "text-slate-700" : "text-slate-500"}`}>
                            {item.label}
                          </p>
                        </article>
                      ))}
                    </div>

                    <div className="overview-revenue-card mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                      <p className="text-xs text-emerald-800">Revenue Generated</p>
                      <p className="text-2xl font-semibold text-emerald-700">$250,000</p>
                      <p className="text-xs text-emerald-700/80">July 15, 2024</p>
                    </div>
                  </>
                )}
              </section>
            </div>
    </section>
  );
}