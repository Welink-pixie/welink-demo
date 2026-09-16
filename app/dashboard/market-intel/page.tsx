"use client";

import { useEffect, useMemo, useState } from "react";

type SocialProfile = { social: string; followers: number | null; url: string };

type Competitor = {
  id: number;
  name: string;
  websiteUrl: string | null;
  overview: string | null;
  g2ReviewsUrl?: string | null;
  capterraReviewsUrl?: string | null;
  trustpilotReviewsUrl?: string | null;
  socialProfiles?: SocialProfile[];
};

type Review = {
  id: number;
  competitorId: number;
  date: string;
  title: string;
  summary: string;
  headline?: string;
  impactScore: number;
  source: string;
};

type NewsItem = {
  id: number;
  competitorId: number;
  title: string;
  summary: string;
  publishedAt: string;
  impactScore: number;
  aiHeadline?: string;
};

type Ad = {
  id: number;
  competitorId: number;
  platform: string;
  aiHeadline: string;
  impactScore: number;
  startedAt: string;
};

type Signal = {
  id: string;
  kind: "review" | "news" | "ad";
  competitorId: number;
  occurredAt: string;
  title: string;
  summary?: string;
  impactScore: number;
  meta?: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function totalFollowers(profiles?: SocialProfile[]) {
  if (!profiles?.length) return null;
  const total = profiles.reduce((sum, profile) => sum + (profile.followers ?? 0), 0);
  return total > 0 ? total : null;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

const SIGNAL_BADGE: Record<Signal["kind"], string> = {
  review: "Review",
  news: "News",
  ad: "Ad",
};

export default function MarketIntelPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [authorized, setAuthorized] = useState(true);
  const [authorizeUrl, setAuthorizeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/keeptabz/snapshot");
        const data = (await response.json()) as {
          authorized?: boolean;
          authorizeUrl?: string;
          competitors?: Competitor[];
          reviews?: Review[];
          news?: NewsItem[];
          ads?: Ad[];
          error?: string;
        };
        if (cancelled) return;
        setAuthorized(Boolean(data.authorized));
        setAuthorizeUrl(data.authorizeUrl ?? null);
        setCompetitors(data.competitors ?? []);
        setReviews(data.reviews ?? []);
        setNews(data.news ?? []);
        setAds(data.ads ?? []);
        setError(data.error ?? null);
      } catch {
        if (!cancelled) setError("Unable to reach the data provider.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const companyNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const company of competitors) map.set(company.id, company.name);
    return map;
  }, [competitors]);

  const signals = useMemo<Signal[]>(() => {
    const combined: Signal[] = [
      ...reviews.map((review) => ({
        id: `review-${review.id}`,
        kind: "review" as const,
        competitorId: review.competitorId,
        occurredAt: review.date,
        title: review.headline ?? review.title,
        summary: review.summary,
        impactScore: review.impactScore,
        meta: review.source,
      })),
      ...news.map((item) => ({
        id: `news-${item.id}`,
        kind: "news" as const,
        competitorId: item.competitorId,
        occurredAt: item.publishedAt,
        title: item.aiHeadline ?? item.title,
        summary: item.summary,
        impactScore: item.impactScore,
      })),
      ...ads.map((ad) => ({
        id: `ad-${ad.id}`,
        kind: "ad" as const,
        competitorId: ad.competitorId,
        occurredAt: ad.startedAt,
        title: ad.aiHeadline,
        impactScore: ad.impactScore,
        meta: ad.platform,
      })),
    ];

    return combined.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()).slice(0, 10);
  }, [reviews, news, ads]);

  return (
    <section className="morphic-shell min-h-full p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Market Intel</h1>
        <p className="mt-1 text-sm text-slate-500">
          Live company signals — reviews, news, ad activity, and social growth to inform your next move.
        </p>
      </div>

      {!authorized && (
        <div className="morphic-card-inset flex flex-col items-start gap-3 rounded-3xl p-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>Company data isn&apos;t connected yet. Sign in to pull live market intel here.</span>
          <a
            href={authorizeUrl ?? "/api/keeptabz/oauth/login"}
            className="morphic-pill shrink-0 px-4 py-2 text-sm font-semibold text-indigo-700"
          >
            Connect
          </a>
        </div>
      )}

      {authorized && error && (
        <div className="morphic-card-inset mb-4 rounded-3xl p-5 text-sm text-rose-600">{error}</div>
      )}

      {authorized && loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="morphic-card h-40 animate-pulse rounded-3xl p-5" />
          ))}
        </div>
      )}

      {authorized && !loading && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {competitors.map((company) => {
              const followers = totalFollowers(company.socialProfiles);
              const reviewLinks = [
                company.g2ReviewsUrl,
                company.capterraReviewsUrl,
                company.trustpilotReviewsUrl,
              ].filter(Boolean).length;

              return (
                <article key={company.id} className="morphic-card flex flex-col gap-3 rounded-3xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="morphic-avatar flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-indigo-700">
                      {initials(company.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-slate-900">{company.name}</h3>
                      {company.websiteUrl && (
                        <a
                          href={company.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate text-xs text-indigo-600 hover:underline"
                        >
                          {company.websiteUrl.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                  </div>

                  {company.overview && <p className="line-clamp-3 text-sm text-slate-600">{company.overview}</p>}

                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {followers !== null && (
                      <span className="morphic-pill px-3 py-1 text-xs font-medium text-slate-700">
                        {followers.toLocaleString()} followers
                      </span>
                    )}
                    {reviewLinks > 0 && (
                      <span className="morphic-pill px-3 py-1 text-xs font-medium text-slate-700">
                        {reviewLinks} review source{reviewLinks > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}

            {competitors.length === 0 && !error && (
              <div className="morphic-card-inset col-span-full rounded-3xl p-6 text-sm text-slate-500">
                No companies tracked yet.
              </div>
            )}
          </div>

          {signals.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 text-sm font-semibold text-slate-900">Recent Market Signals</h2>
              <div className="space-y-2">
                {signals.map((signal) => (
                  <article key={signal.id} className="morphic-card-inset flex items-start gap-3 rounded-2xl p-4">
                    <span className="morphic-pill shrink-0 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      {SIGNAL_BADGE[signal.kind]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {companyNameById.get(signal.competitorId) ?? "Unknown company"}
                        </p>
                        <p className="text-xs text-slate-400">{timeAgo(signal.occurredAt)}</p>
                        {signal.meta && <p className="text-xs text-slate-400">{signal.meta}</p>}
                      </div>
                      <p className="text-sm text-slate-700">{signal.title}</p>
                      {signal.summary && <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{signal.summary}</p>}
                    </div>
                    <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      {signal.impactScore}
                    </span>
                  </article>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
