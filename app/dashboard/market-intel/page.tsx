"use client";

import { useEffect, useState } from "react";

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

export default function MarketIntelPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [authorized, setAuthorized] = useState(true);
  const [authorizeUrl, setAuthorizeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/keeptabz/competitors");
        const data = (await response.json()) as {
          authorized?: boolean;
          authorizeUrl?: string;
          competitors?: Competitor[];
          error?: string;
        };
        if (cancelled) return;
        setAuthorized(Boolean(data.authorized));
        setAuthorizeUrl(data.authorizeUrl ?? null);
        setCompetitors(data.competitors ?? []);
        setError(data.error ?? null);
      } catch {
        if (!cancelled) setError("Unable to reach KeepTabz.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="morphic-shell min-h-full p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Market Intel</h1>
        <p className="mt-1 text-sm text-slate-500">
          Live competitor signals from KeepTabz — reviews, social growth, and market movement to inform your next move.
        </p>
      </div>

      {!authorized && (
        <div className="morphic-card-inset flex flex-col items-start gap-3 rounded-3xl p-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>KeepTabz isn&apos;t connected yet. Sign in to pull live competitor data here.</span>
          <a
            href={authorizeUrl ?? "/api/keeptabz/oauth/login"}
            className="morphic-pill shrink-0 px-4 py-2 text-sm font-semibold text-indigo-700"
          >
            Connect KeepTabz
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {competitors.map((company) => {
            const followers = totalFollowers(company.socialProfiles);
            const reviewLinks = [company.g2ReviewsUrl, company.capterraReviewsUrl, company.trustpilotReviewsUrl].filter(
              Boolean
            ).length;

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
              No competitors tracked in this workspace yet.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
