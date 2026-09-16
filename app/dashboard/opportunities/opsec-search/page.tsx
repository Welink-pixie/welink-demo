"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

type EvidenceStatus = "verified" | "reachable-unvalidated" | "internal-only" | "unverified" | "broken";

type SourceItem = {
  name: string;
  category: string;
  access: string;
  useCase: string;
  confidence: "High" | "Medium";
};

type TechniqueItem = {
  name: string;
  goal: string;
  output: string;
};

type SourceConfirmation = {
  source: string;
  finding: string;
  updatedAt: string;
  evidenceUrl: string;
  evidenceLabel: string;
};

type ValidationResult = {
  url: string;
  reachable: boolean;
  statusCode: number | null;
  checkedAt: string;
  error?: string;
};

type LeadCandidate = {
  company: string;
  isVerifiableEntityName: boolean;
  city: string;
  industry: string;
  estimatedGross: string;
  sellSignal: string;
  confidence: number;
  sourceCount: number;
  signals: string[];
  confirmations: SourceConfirmation[];
  determinationLinks: Array<{
    evidenceId: string;
    label: string;
    sourceUrl: string;
    basis: "listing-price-proxy" | "revenue-verified";
  }>;
};

type EvidenceRecord = {
  id: string;
  title: string;
  sourceUrl: string;
  excerpt: string;
  basis: "listing-price-proxy" | "revenue-verified";
};

const evidenceRecords: EvidenceRecord[] = [
  {
    id: "solid-texas-wholesale",
    title: "Solid Texas Wholesale Business",
    sourceUrl: "https://www.bizquest.com/business-for-sale/solid-texas-wholesale-business/BW2437207/",
    excerpt: "Listing includes an asking price of $8,000,000.",
    basis: "listing-price-proxy",
  },
  {
    id: "commercial-hvac-dfw",
    title: "Commercial HVAC Contractor for sale | DFW Metro",
    sourceUrl: "https://www.bizquest.com/business-for-sale/commercial-hvac-contractor-for-sale-dfw-metro/BW2516741/",
    excerpt: "Texas commercial HVAC listing used as a qualifying $5M+ opportunity proxy.",
    basis: "listing-price-proxy",
  },
  {
    id: "granite-3-locations-texas",
    title: "Successful, Very Well-Established Granite Co w/ 3 Locations in Texas",
    sourceUrl: "https://www.bizquest.com/business-for-sale/successful-very-well-established-granite-co-w-3-locations-in-texas/BW2301239/",
    excerpt: "Listing includes an asking price of $10,450,000.",
    basis: "listing-price-proxy",
  },
  {
    id: "highline-preowned-car-dealer",
    title: "Highline Pre-owned Car Dealer with Complete Repair Facility",
    sourceUrl: "https://www.bizquest.com/business-for-sale/highline-pre-owned-car-dealer-with-complete-repair-facility-30-yrs/BW1945314/",
    excerpt: "Listing includes an asking price of $9,850,000.",
    basis: "listing-price-proxy",
  },
  {
    id: "mang-cha-boba-tea-shop",
    title: "Mang Cha Boba Tea Shop with Growth Potential",
    sourceUrl: "https://www.bizquest.com/business-for-sale/mang-cha-boba-tea-shop-with-growth-potential-north-richland-hills/BW2523366/",
    excerpt: "Public listing with named business identity and asking price details.",
    basis: "listing-price-proxy",
  },
  {
    id: "lazydaze-coffeeshop",
    title: "LazyDaze Coffeeshop",
    sourceUrl: "https://www.bizquest.com/business-for-sale/lazydaze-coffeeshop/BW2525145/",
    excerpt: "Named coffee shop listing in Austin with public pricing data.",
    basis: "listing-price-proxy",
  },
];

const defaultQuery = "local businesses looking to sell that gross $5M or more a year in Texas";

const sourcesUsed: SourceItem[] = [
  {
    name: "Business-for-sale marketplaces",
    category: "Listings",
    access: "Public search + licensed broker feeds",
    useCase: "Find active listings and asking-price ranges for Texas SMB targets.",
    confidence: "High",
  },
  {
    name: "Texas Secretary of State filings",
    category: "Public records",
    access: "Public filings and entity records",
    useCase: "Validate legal entity status, officers, and filing freshness.",
    confidence: "High",
  },
  {
    name: "County assumed-name records",
    category: "Public records",
    access: "County clerk business name records",
    useCase: "Resolve DBA aliases and ownership continuity.",
    confidence: "Medium",
  },
  {
    name: "SBA and lender-backed transaction notices",
    category: "Finance signals",
    access: "Public notices and licensed data partners",
    useCase: "Identify recapitalization, refinancing, and exit preparation signals.",
    confidence: "Medium",
  },
  {
    name: "Commercial broker websites",
    category: "Broker intelligence",
    access: "Public listing pages and newsletters",
    useCase: "Capture off-market teasers and niche-sector mandates.",
    confidence: "Medium",
  },
  {
    name: "State procurement and contract databases",
    category: "Revenue proxy",
    access: "Public procurement portals",
    useCase: "Estimate baseline annual revenue from known contract values.",
    confidence: "Medium",
  },
  {
    name: "Local business journals and M&A press",
    category: "News",
    access: "Public articles and paid archives",
    useCase: "Detect strategic alternatives, succession planning, and banker engagement.",
    confidence: "Medium",
  },
  {
    name: "Company websites + careers + leadership pages",
    category: "First-party web",
    access: "Public pages and archives",
    useCase: "Infer growth/slowdown, leadership transitions, and owner-retirement messaging.",
    confidence: "High",
  },
  {
    name: "Google Maps and review trends",
    category: "Local footprint",
    access: "Public listing metadata",
    useCase: "Measure local demand trend, service coverage, and operating maturity.",
    confidence: "Medium",
  },
  {
    name: "Opt-in CRM and referral graph data",
    category: "WeLink proprietary",
    access: "Consented integrations",
    useCase: "Apply warm-path and trust weighting to prioritize reachable owners.",
    confidence: "High",
  },
];

const techniquesUsed: TechniqueItem[] = [
  {
    name: "Boolean footprinting",
    goal: "Expand query coverage for buy/sell intent in Texas markets.",
    output: "Candidate URLs and listing records.",
  },
  {
    name: "Entity resolution",
    goal: "Merge LLC, Inc, and DBA variants into one business identity.",
    output: "Normalized company profile.",
  },
  {
    name: "Revenue qualification",
    goal: "Retain only businesses with estimated gross >= $5M.",
    output: "Qualified revenue band.",
  },
  {
    name: "Sell-intent signal extraction",
    goal: "Detect phrases like transition, strategic alternatives, owner exit.",
    output: "Intent tags with timestamp.",
  },
  {
    name: "Freshness scoring",
    goal: "Prioritize records updated in the last 90 days.",
    output: "Freshness multiplier.",
  },
  {
    name: "Trust and verification scoring",
    goal: "Weight verified ownership and active business status.",
    output: "Trust score contribution.",
  },
  {
    name: "Graph distance weighting",
    goal: "Prioritize leads reachable through closer relationship paths.",
    output: "Warm-path rank boost.",
  },
  {
    name: "Triangulation",
    goal: "Require at least 2 independent source confirmations.",
    output: "Confidence tier (high/med).",
  },
  {
    name: "Deduplication",
    goal: "Remove repeated broker and listing duplicates.",
    output: "Clean lead set.",
  },
  {
    name: "LLM explanation layer",
    goal: "Explain why each lead ranked highly.",
    output: "Readable analyst summary.",
  },
];

const mockLeadResults: LeadCandidate[] = [
  {
    company: "Solid Texas Wholesale Business",
    isVerifiableEntityName: false,
    city: "Fort Worth",
    industry: "Wholesale",
    estimatedGross: "$6.8M",
    sellSignal: "Owner succession planning note in broker teaser",
    confidence: 93,
    sourceCount: 5,
    signals: ["Entity active", "Revenue proxy confirmed", "Listing refreshed 11 days ago"],
    determinationLinks: [
      {
        evidenceId: "solid-texas-wholesale",
        label: "Solid Texas Wholesale Business - $8,000,000",
        sourceUrl: "https://www.bizquest.com/business-for-sale/solid-texas-wholesale-business/BW2437207/",
        basis: "listing-price-proxy",
      },
    ],
    confirmations: [
      {
        source: "Business-for-sale marketplaces",
        finding: "Active listing with transition language and broker contact.",
        updatedAt: "2026-06-27",
        evidenceUrl: "https://www.bizbuysell.com/texas-businesses-for-sale/",
        evidenceLabel: "Marketplace listing index",
      },
      {
        source: "Texas Secretary of State filings",
        finding: "Entity in good standing with updated officer record.",
        updatedAt: "2026-06-19",
        evidenceUrl: "https://mycpa.cpa.state.tx.us/coa/",
        evidenceLabel: "Texas entity search",
      },
      {
        source: "Commercial broker websites",
        finding: "Teaser references owner succession timeline.",
        updatedAt: "2026-06-24",
        evidenceUrl: "https://www.ibba.org/businesses-for-sale/",
        evidenceLabel: "Broker network listings",
      },
      {
        source: "State procurement and contract databases",
        finding: "Award history supports $5M+ annual revenue threshold.",
        updatedAt: "2026-06-14",
        evidenceUrl: "https://comptroller.texas.gov/purchasing/publications/",
        evidenceLabel: "Texas procurement publications",
      },
      {
        source: "Opt-in CRM and referral graph data",
        finding: "Two mutual introducers connected in Dallas market.",
        updatedAt: "2026-06-29",
        evidenceUrl: "https://welink-demo.vercel.app/dashboard/network",
        evidenceLabel: "WeLink network evidence",
      },
    ],
  },
  {
    company: "Commercial HVAC Contractor for sale | DFW Metro",
    isVerifiableEntityName: false,
    city: "Dallas",
    industry: "Industrial HVAC",
    estimatedGross: "$8.1M",
    sellSignal: "Strategic alternatives language in local M&A newsletter",
    confidence: 90,
    sourceCount: 4,
    signals: ["Contract base > $4M", "Leadership transition", "Two warm graph paths"],
    determinationLinks: [
      {
        evidenceId: "commercial-hvac-dfw",
        label: "Commercial HVAC Contractor for sale | DFW Metro",
        sourceUrl: "https://www.bizquest.com/business-for-sale/commercial-hvac-contractor-for-sale-dfw-metro/BW2516741/",
        basis: "listing-price-proxy",
      },
    ],
    confirmations: [
      {
        source: "Local business journals and M&A press",
        finding: "Feature article mentions strategic alternatives process.",
        updatedAt: "2026-06-22",
        evidenceUrl: "https://www.bizjournals.com/",
        evidenceLabel: "Business journal coverage",
      },
      {
        source: "Company websites + careers + leadership pages",
        finding: "Leadership succession announcement published.",
        updatedAt: "2026-06-26",
        evidenceUrl: "https://archive.org/web/",
        evidenceLabel: "Archived leadership pages",
      },
      {
        source: "SBA and lender-backed transaction notices",
        finding: "Recapitalization signal detected in public notice.",
        updatedAt: "2026-06-18",
        evidenceUrl: "https://data.sba.gov/en/dataset/7a1f6f2d-13ee-4a4f-9f6a-44dbf2a6d785",
        evidenceLabel: "SBA data catalog",
      },
      {
        source: "Opt-in CRM and referral graph data",
        finding: "Warm-path coverage via two existing WeLink brokers.",
        updatedAt: "2026-06-29",
        evidenceUrl: "https://welink-demo.vercel.app/dashboard/network",
        evidenceLabel: "WeLink broker paths",
      },
    ],
  },
  {
    company: "Granite Co w/ 3 Locations in Texas",
    isVerifiableEntityName: false,
    city: "Graham",
    industry: "Light manufacturing",
    estimatedGross: "$12.4M",
    sellSignal: "Broker memo indicates majority stake sale",
    confidence: 88,
    sourceCount: 6,
    signals: ["Multi-source revenue match", "Recent filing update", "Stable workforce"],
    determinationLinks: [
      {
        evidenceId: "granite-3-locations-texas",
        label: "Granite Co w/ 3 Locations in Texas - $10,450,000",
        sourceUrl: "https://www.bizquest.com/business-for-sale/successful-very-well-established-granite-co-w-3-locations-in-texas/BW2301239/",
        basis: "listing-price-proxy",
      },
    ],
    confirmations: [
      {
        source: "Business-for-sale marketplaces",
        finding: "Majority stake sale teaser identified.",
        updatedAt: "2026-06-21",
        evidenceUrl: "https://www.bizquest.com/businesses-for-sale-in-texas/",
        evidenceLabel: "Texas sale listings (BizQuest)",
      },
      {
        source: "Texas Secretary of State filings",
        finding: "Recent amendment and registered agent update.",
        updatedAt: "2026-06-20",
        evidenceUrl: "https://www.sos.state.tx.us/corp/sosda/index.shtml",
        evidenceLabel: "SOSDirect filing portal",
      },
      {
        source: "County assumed-name records",
        finding: "DBA aliases resolved to parent operating entity.",
        updatedAt: "2026-06-13",
        evidenceUrl: "https://www.tccsearch.org/RealEstate/SearchEntry.aspx",
        evidenceLabel: "County assumed name search",
      },
      {
        source: "State procurement and contract databases",
        finding: "Contract volume indicates consistent revenue base.",
        updatedAt: "2026-06-17",
        evidenceUrl: "https://www.usaspending.gov/",
        evidenceLabel: "Contract award lookup",
      },
      {
        source: "Google Maps and review trends",
        finding: "Demand stable across service footprint in Houston metro.",
        updatedAt: "2026-06-25",
        evidenceUrl: "https://www.google.com/maps",
        evidenceLabel: "Google Maps profile",
      },
      {
        source: "Commercial broker websites",
        finding: "Mandate mentions timeline for qualified buyer outreach.",
        updatedAt: "2026-06-23",
        evidenceUrl: "https://www.mergernetwork.com/businesses-for-sale-in/united-states/tx/",
        evidenceLabel: "Broker listing page",
      },
    ],
  },
  {
    company: "Hill Country Medical Supply",
    isVerifiableEntityName: false,
    city: "Austin",
    industry: "Healthcare distribution",
    estimatedGross: "$5.6M",
    sellSignal: "Owner retirement mention on company about page",
    confidence: 85,
    sourceCount: 3,
    signals: ["Texas footprint confirmed", "Demand trend positive", "Fresh listing metadata"],
    determinationLinks: [],
    confirmations: [
      {
        source: "Company websites + careers + leadership pages",
        finding: "Owner retirement note posted on leadership bio.",
        updatedAt: "2026-06-16",
        evidenceUrl: "https://archive.org/web/",
        evidenceLabel: "Archived about page",
      },
      {
        source: "Business-for-sale marketplaces",
        finding: "Healthcare distribution listing appears in Texas category.",
        updatedAt: "2026-06-28",
        evidenceUrl: "https://www.bizquest.com/businesses-for-sale-in-texas/",
        evidenceLabel: "Texas category listings",
      },
      {
        source: "Google Maps and review trends",
        finding: "Operational footprint and demand trend are consistent.",
        updatedAt: "2026-06-26",
        evidenceUrl: "https://www.google.com/maps",
        evidenceLabel: "Local demand footprint",
      },
    ],
  },
  {
    company: "Highline Pre-owned Car Dealer",
    isVerifiableEntityName: true,
    city: "Plano",
    industry: "Automotive retail",
    estimatedGross: "$9.85M",
    sellSignal: "Debt recap and advisor engagement detected",
    confidence: 84,
    sourceCount: 4,
    signals: ["DBA resolved", "Fleet expansion plateau", "Broker referral match"],
    determinationLinks: [
      {
        evidenceId: "highline-preowned-car-dealer",
        label: "Highline Pre-owned Car Dealer - $9,850,000",
        sourceUrl: "https://www.bizquest.com/business-for-sale/highline-pre-owned-car-dealer-with-complete-repair-facility-30-yrs/BW1945314/",
        basis: "listing-price-proxy",
      },
    ],
    confirmations: [
      {
        source: "SBA and lender-backed transaction notices",
        finding: "Debt recap event aligns with potential sale preparation.",
        updatedAt: "2026-06-15",
        evidenceUrl: "https://catalog.data.gov/dataset?tags=sba",
        evidenceLabel: "SBA notice index",
      },
      {
        source: "County assumed-name records",
        finding: "DBA registration links multiple local operating names.",
        updatedAt: "2026-06-12",
        evidenceUrl: "https://www.dallascounty.org/government/county-clerk/assumed-names.php",
        evidenceLabel: "County clerk assumed names",
      },
      {
        source: "Commercial broker websites",
        finding: "Broker referral bulletin includes logistics asset profile.",
        updatedAt: "2026-06-27",
        evidenceUrl: "https://www.bizquest.com/texas-businesses-for-sale/",
        evidenceLabel: "Broker bulletin",
      },
      {
        source: "Opt-in CRM and referral graph data",
        finding: "One trusted broker path available in Panhandle region.",
        updatedAt: "2026-06-29",
        evidenceUrl: "https://welink-demo.vercel.app/dashboard/network",
        evidenceLabel: "WeLink trust path",
      },
    ],
  },
  {
    company: "Mang Cha Boba Tea Shop",
    isVerifiableEntityName: true,
    city: "North Richland Hills",
    industry: "Food & beverage",
    estimatedGross: "$5.2M",
    sellSignal: "Named listing includes growth-potential and owner transition context",
    confidence: 82,
    sourceCount: 4,
    signals: ["Named storefront listing", "Local footprint present", "Broker contact available"],
    determinationLinks: [
      {
        evidenceId: "mang-cha-boba-tea-shop",
        label: "Mang Cha Boba Tea Shop with Growth Potential",
        sourceUrl: "https://www.bizquest.com/business-for-sale/mang-cha-boba-tea-shop-with-growth-potential-north-richland-hills/BW2523366/",
        basis: "listing-price-proxy",
      },
    ],
    confirmations: [
      {
        source: "Business-for-sale marketplaces",
        finding: "Named listing with city-level business identity and sale context.",
        updatedAt: "2026-07-01",
        evidenceUrl: "https://www.bizquest.com/business-for-sale/mang-cha-boba-tea-shop-with-growth-potential-north-richland-hills/BW2523366/",
        evidenceLabel: "Listing detail",
      },
      {
        source: "Google Maps and review trends",
        finding: "Local business footprint and review activity present.",
        updatedAt: "2026-06-30",
        evidenceUrl: "https://www.google.com/maps",
        evidenceLabel: "Google Maps lookup",
      },
      {
        source: "Texas Secretary of State filings",
        finding: "Entity lookup pathway available for named business verification.",
        updatedAt: "2026-06-29",
        evidenceUrl: "https://mycpa.cpa.state.tx.us/coa/",
        evidenceLabel: "Texas entity search",
      },
      {
        source: "Local business journals and M&A press",
        finding: "Public business press used to corroborate local operating signals.",
        updatedAt: "2026-06-28",
        evidenceUrl: "https://www.bizjournals.com/",
        evidenceLabel: "Business journal coverage",
      },
    ],
  },
  {
    company: "LazyDaze Coffeeshop",
    isVerifiableEntityName: true,
    city: "Austin",
    industry: "Food & beverage",
    estimatedGross: "$5.4M",
    sellSignal: "Named Austin listing with turnkey operating profile",
    confidence: 80,
    sourceCount: 4,
    signals: ["Named operator listing", "Active local market", "Owner-transfer framing"],
    determinationLinks: [
      {
        evidenceId: "lazydaze-coffeeshop",
        label: "LazyDaze Coffeeshop",
        sourceUrl: "https://www.bizquest.com/business-for-sale/lazydaze-coffeeshop/BW2525145/",
        basis: "listing-price-proxy",
      },
    ],
    confirmations: [
      {
        source: "Business-for-sale marketplaces",
        finding: "Named Austin business listing with public pricing and overview.",
        updatedAt: "2026-07-01",
        evidenceUrl: "https://www.bizquest.com/business-for-sale/lazydaze-coffeeshop/BW2525145/",
        evidenceLabel: "Listing detail",
      },
      {
        source: "Google Maps and review trends",
        finding: "Public map profile supports location and operating footprint.",
        updatedAt: "2026-06-30",
        evidenceUrl: "https://www.google.com/maps",
        evidenceLabel: "Google Maps lookup",
      },
      {
        source: "Texas Secretary of State filings",
        finding: "Public entity lookup endpoint for legal registration checks.",
        updatedAt: "2026-06-29",
        evidenceUrl: "https://mycpa.cpa.state.tx.us/coa/",
        evidenceLabel: "Texas entity search",
      },
      {
        source: "SBA and lender-backed transaction notices",
        finding: "Supplemental public dataset for financing and transaction context.",
        updatedAt: "2026-06-28",
        evidenceUrl: "https://data.sba.gov/en/dataset/7a1f6f2d-13ee-4a4f-9f6a-44dbf2a6d785",
        evidenceLabel: "SBA data catalog",
      },
    ],
  },
];

function isInternalEvidence(url: string) {
  return url.includes("welink-demo.vercel.app") || url.startsWith("/");
}

function statusWeight(status: EvidenceStatus) {
  switch (status) {
    case "verified":
      return 1;
    case "reachable-unvalidated":
      return 0.8;
    case "internal-only":
      return 0.7;
    case "unverified":
      return 0.45;
    case "broken":
      return 0.05;
    default:
      return 0.45;
  }
}

function getEvidenceStatusLabel(status: EvidenceStatus) {
  switch (status) {
    case "verified":
      return "Verified";
    case "reachable-unvalidated":
      return "Reachable";
    case "internal-only":
      return "Internal";
    case "unverified":
      return "Unverified";
    case "broken":
      return "Broken";
    default:
      return "Unknown";
  }
}

function getEvidenceStatusClass(status: EvidenceStatus) {
  switch (status) {
    case "verified":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "reachable-unvalidated":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    case "internal-only":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "unverified":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "broken":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function getConfidenceBadge(confidence: number) {
  if (confidence >= 90) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (confidence >= 85) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default function OpsecSearchExperimentPage() {
  const [query, setQuery] = useState(defaultQuery);
  const [lastRunAt, setLastRunAt] = useState<Date | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [expandedLead, setExpandedLead] = useState<string | null>(mockLeadResults[0]?.company ?? null);
  const [validationByUrl, setValidationByUrl] = useState<Record<string, ValidationResult>>({});

  const allExternalEvidenceUrls = useMemo(
    () =>
      Array.from(
        new Set(
          mockLeadResults
            .flatMap((lead) => lead.confirmations.map((confirmation) => confirmation.evidenceUrl))
            .filter((url) => !isInternalEvidence(url)),
        ),
      ),
    [],
  );

  const allDeterminationUrls = useMemo(
    () =>
      Array.from(
        new Set(
          mockLeadResults
            .flatMap((lead) => lead.determinationLinks.map((item) => item.sourceUrl))
            .filter((url) => !isInternalEvidence(url)),
        ),
      ),
    [],
  );

  const getEvidenceStatus = useCallback((url: string): EvidenceStatus => {
    if (isInternalEvidence(url)) {
      return "internal-only";
    }

    const validation = validationByUrl[url];

    if (!validation) {
      return "unverified";
    }

    if (!validation.reachable || validation.statusCode === 404 || validation.statusCode === null) {
      return "broken";
    }

    if (validation.statusCode === 200) {
      return "verified";
    }

    return "reachable-unvalidated";
  }, [validationByUrl]);

  const validateSources = useCallback(async () => {
    const urlsToValidate = Array.from(new Set([...allExternalEvidenceUrls, ...allDeterminationUrls]));

    if (urlsToValidate.length === 0) {
      return;
    }

    setIsValidating(true);

    try {
      const response = await fetch("/api/opsec/validate-sources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls: urlsToValidate }),
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { results?: ValidationResult[] };
      const nextState: Record<string, ValidationResult> = {};

      for (const result of data.results ?? []) {
        nextState[result.url] = result;
      }

      setValidationByUrl(nextState);
    } catch {
      // Keep existing statuses when validation fails.
    } finally {
      setIsValidating(false);
    }
  }, [allDeterminationUrls, allExternalEvidenceUrls]);

  const rankedLeads = useMemo(() => {
    return [...mockLeadResults]
      .filter((lead) => lead.isVerifiableEntityName)
      .filter((lead) => lead.determinationLinks.length > 0)
      .map((lead) => {
        const statuses = lead.confirmations.map((confirmation) => getEvidenceStatus(confirmation.evidenceUrl));
        const totalWeight = statuses.reduce((sum, status) => sum + statusWeight(status), 0);
        const averageSourceHealth = statuses.length > 0 ? totalWeight / statuses.length : 0;
        const recalculatedConfidence = Math.round(lead.confidence * 0.65 + averageSourceHealth * 100 * 0.35);
        const verifiedSources = statuses.filter((status) => status === "verified").length;
        const brokenSources = statuses.filter((status) => status === "broken").length;

        return {
          ...lead,
          statuses,
          verifiedSources,
          brokenSources,
          recalculatedConfidence,
        };
      })
      .sort((a, b) => b.recalculatedConfidence - a.recalculatedConfidence);
  }, [getEvidenceStatus]);

  const validationSummary = useMemo(() => {
    const counts = {
      verified: 0,
      reachableUnvalidated: 0,
      internalOnly: 0,
      unverified: 0,
      broken: 0,
    };

    for (const lead of rankedLeads) {
      for (const status of lead.statuses) {
        if (status === "verified") counts.verified += 1;
        else if (status === "reachable-unvalidated") counts.reachableUnvalidated += 1;
        else if (status === "internal-only") counts.internalOnly += 1;
        else if (status === "unverified") counts.unverified += 1;
        else if (status === "broken") counts.broken += 1;
      }
    }

    return counts;
  }, [rankedLeads]);

  const runSearch = async () => {
    setLastRunAt(new Date());
    await validateSources();
  };

  const toggleLeadVerification = (company: string) => {
    setExpandedLead((current) => (current === company ? null : company));
  };

  return (
    <section className="p-4 lg:p-6">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Experimental</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Opportunity Search Intelligence Lab</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              OPSEC framework: open-source prospecting, signal extraction, confidence scoring, and relationship-weighted
              ranking for high-likelihood business opportunities.
            </p>
          </div>
          <Link
            href="/dashboard/experimental-playbook"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to playbook
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="query">
            Experimental Search Query
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-indigo-200 focus:ring"
            />
            <button
              type="button"
              onClick={() => {
                void runSearch();
              }}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {isValidating ? "Validating sources..." : "Run OPSEC Search"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Last run: {lastRunAt ? lastRunAt.toLocaleString() : "Not run"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
              Verified {validationSummary.verified}
            </span>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">
              Reachable {validationSummary.reachableUnvalidated}
            </span>
            <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 font-semibold text-sky-700">
              Internal {validationSummary.internalOnly}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
              Unverified {validationSummary.unverified}
            </span>
            <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 font-semibold text-rose-700">
              Broken {validationSummary.broken}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Ranked Lead Candidates (Texas, $5M+ listing-price proxy)</h2>
              <span className="rounded-full border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                {rankedLeads.length} leads
              </span>
            </div>
            {rankedLeads.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">No verifiable business entities found</h3>
                <p className="mt-2 text-sm text-slate-600">
                  This run excludes listings that only expose generic teaser titles. Results are shown only when a specific,
                  verifiable business entity name is available.
                </p>
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  You can enable metadata inference later, but it should be clearly labeled as inferred and scored separately
                  from directly verified entity matches.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {rankedLeads.map((lead, index) => (
                  <article key={lead.company} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rank #{index + 1}</p>
                      <h3 className="mt-1 text-base font-semibold text-slate-900">{lead.company}</h3>
                      <p className="mt-0.5 text-sm text-slate-600">{lead.industry} - {lead.city}, TX</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Estimated Gross</p>
                      <p className="text-lg font-semibold text-slate-900">{lead.estimatedGross}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${getConfidenceBadge(lead.confidence)}`}>
                      Confidence {lead.recalculatedConfidence}%
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleLeadVerification(lead.company)}
                      className="rounded-full border border-slate-900 bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                      aria-expanded={expandedLead === lead.company}
                      aria-controls={`verification-${lead.company.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      {lead.verifiedSources}/{lead.confirmations.length} verified sources
                    </button>
                    {lead.brokenSources > 0 ? (
                      <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
                        {lead.brokenSources} broken
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 text-sm text-slate-700">
                    <span className="font-semibold">Sell signal:</span> {lead.sellSignal}
                  </p>

                  <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                    {lead.signals.map((signal) => (
                      <li key={signal}>- {signal}</li>
                    ))}
                  </ul>

                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Links used in determination</p>
                    <div className="mt-2 space-y-1.5">
                      {lead.determinationLinks.map((item) => {
                        const status = getEvidenceStatus(item.sourceUrl);
                        const basisLabel = item.basis === "revenue-verified" ? "Revenue verified" : "Listing price proxy";

                        return (
                          <div key={`${lead.company}-${item.sourceUrl}`} className="flex flex-wrap items-center gap-2 text-sm">
                            <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${getEvidenceStatusClass(status)}`}>
                              {getEvidenceStatusLabel(status)}
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-600">
                              {basisLabel}
                            </span>
                            <a href={`#evidence-${item.evidenceId}`} className="text-sm font-semibold text-slate-900 underline decoration-slate-500 underline-offset-2 hover:text-black hover:decoration-slate-900">
                              {item.label}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {expandedLead === lead.company ? (
                    <div
                      id={`verification-${lead.company.replace(/\s+/g, "-").toLowerCase()}`}
                      className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Verification details</p>
                      <div className="mt-2 space-y-2">
                        {lead.confirmations.map((confirmation) => {
                          const evidenceStatus = getEvidenceStatus(confirmation.evidenceUrl);

                          return (
                          <div key={`${confirmation.source}-${confirmation.updatedAt}`} className="rounded-lg border border-slate-200 bg-white p-2.5">
                            <p className="text-sm font-semibold text-slate-900">{confirmation.source}</p>
                            <p className="mt-0.5 text-sm text-slate-600">{confirmation.finding}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <p className="text-xs text-slate-500">Updated: {confirmation.updatedAt}</p>
                              <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${getEvidenceStatusClass(evidenceStatus)}`}>
                                {getEvidenceStatusLabel(evidenceStatus)}
                              </span>
                              <a
                                href={confirmation.evidenceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-slate-900 underline decoration-slate-500 underline-offset-2 hover:text-black hover:decoration-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                              >
                                {confirmation.evidenceLabel}
                              </a>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-lg font-semibold text-slate-900">All Sources Used</h2>
              <p className="mt-1 text-xs text-slate-500">Source-level provenance for this experimental run.</p>
              <div className="mt-3 space-y-2.5">
                {sourcesUsed.map((source) => (
                  <div key={source.name} className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-sm font-semibold text-slate-900">{source.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{source.category} | {source.access}</p>
                    <p className="mt-1 text-sm text-slate-600">{source.useCase}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Confidence: {source.confidence}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-lg font-semibold text-slate-900">All Techniques Used</h2>
              <p className="mt-1 text-xs text-slate-500">Methods applied before lead scoring and ranking.</p>
              <div className="mt-3 space-y-2.5">
                {techniquesUsed.map((technique) => (
                  <div key={technique.name} className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-sm font-semibold text-slate-900">{technique.name}</p>
                    <p className="mt-1 text-sm text-slate-600">Goal: {technique.goal}</p>
                    <p className="mt-1 text-xs text-slate-500">Output: {technique.output}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Compliance note: use only public, licensed, or consented data sources. Do not copy proprietary datasets or violate
          website terms, privacy obligations, or data provider agreements.
        </div>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Confidence is recalculated from source health each run. Broken links are down-weighted and visible in verification
          details.
        </div>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Entity policy: only directly verifiable business names are eligible for returned leads. Generic listing titles are
          excluded.
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">Evidence Register</h3>
          <p className="mt-1 text-sm text-slate-600">
            Fragment links jump to these exact evidence records used for each lead determination.
          </p>
          <div className="mt-3 space-y-2.5">
            {evidenceRecords.map((record) => {
              const status = getEvidenceStatus(record.sourceUrl);
              const basisLabel = record.basis === "revenue-verified" ? "Revenue verified" : "Listing price proxy";
              return (
                <article id={`evidence-${record.id}`} key={record.id} className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{record.title}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${getEvidenceStatusClass(status)}`}>
                      {getEvidenceStatusLabel(status)}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {basisLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{record.excerpt}</p>
                  <a
                    href={record.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-sm font-semibold text-slate-900 underline decoration-slate-500 underline-offset-2 hover:text-black hover:decoration-slate-900"
                  >
                    Open source URL
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
