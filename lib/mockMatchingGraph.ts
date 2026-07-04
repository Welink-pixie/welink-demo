import type { BudgetRange, OnboardingProfile } from "@/lib/onboarding";

export type GraphNodeRole = "seeker" | "provider" | "hybrid";

export type MockBusinessNode = {
  id: string;
  name: string;
  role: GraphNodeRole;
  industries: string[];
  services: string[];
  location: string;
  budgetRange: BudgetRange;
  annualRevenueBand: "under-1m" | "1m-10m" | "10m-plus";
  opportunitySignal: number;
};

export type RelationshipEdge = {
  from: string;
  to: string;
  strength: number;
};

export const mockBusinessNodes: MockBusinessNode[] = [
  {
    id: "demacco",
    name: "Demacco Consulting",
    role: "provider",
    industries: ["business strategy", "private equity"],
    services: ["growth advisory", "m&a support", "partnership strategy"],
    location: "miami",
    budgetRange: "50k-250k",
    annualRevenueBand: "10m-plus",
    opportunitySignal: 90,
  },
  {
    id: "northline",
    name: "Northline Solutions",
    role: "provider",
    industries: ["it", "business strategy"],
    services: ["ai operations", "cloud migration", "managed services"],
    location: "new york",
    budgetRange: "50k-250k",
    annualRevenueBand: "10m-plus",
    opportunitySignal: 88,
  },
  {
    id: "healthfirst",
    name: "HealthFirst Clinics",
    role: "seeker",
    industries: ["healthcare"],
    services: ["referral network", "patient growth"],
    location: "chicago",
    budgetRange: "10k-50k",
    annualRevenueBand: "1m-10m",
    opportunitySignal: 78,
  },
  {
    id: "futureflow",
    name: "FutureFlow Logistics",
    role: "seeker",
    industries: ["logistics"],
    services: ["distribution", "operations"],
    location: "atlanta",
    budgetRange: "10k-50k",
    annualRevenueBand: "1m-10m",
    opportunitySignal: 74,
  },
  {
    id: "vertex",
    name: "Vertex Capital",
    role: "hybrid",
    industries: ["private equity", "business strategy"],
    services: ["capital access", "portfolio growth"],
    location: "dallas",
    budgetRange: "250k-plus",
    annualRevenueBand: "10m-plus",
    opportunitySignal: 86,
  },
  {
    id: "sunridge",
    name: "Sunridge Manufacturing",
    role: "seeker",
    industries: ["manufacturing"],
    services: ["procurement", "channel expansion"],
    location: "charlotte",
    budgetRange: "50k-250k",
    annualRevenueBand: "10m-plus",
    opportunitySignal: 82,
  },
  {
    id: "beacon",
    name: "Beacon Growth Partners",
    role: "provider",
    industries: ["business strategy", "healthcare"],
    services: ["go-to-market", "lead generation"],
    location: "boston",
    budgetRange: "10k-50k",
    annualRevenueBand: "1m-10m",
    opportunitySignal: 84,
  },
  {
    id: "oakbridge",
    name: "Oakbridge Advisors",
    role: "provider",
    industries: ["private equity", "finance"],
    services: ["deal sourcing", "m&a support"],
    location: "miami",
    budgetRange: "250k-plus",
    annualRevenueBand: "10m-plus",
    opportunitySignal: 92,
  },
  {
    id: "kinetic",
    name: "Kinetic SaaS Group",
    role: "hybrid",
    industries: ["it", "saas"],
    services: ["automation", "data integration"],
    location: "austin",
    budgetRange: "50k-250k",
    annualRevenueBand: "1m-10m",
    opportunitySignal: 80,
  },
  {
    id: "harbor",
    name: "Harbor Hospitality",
    role: "seeker",
    industries: ["hospitality"],
    services: ["guest growth", "regional expansion"],
    location: "miami",
    budgetRange: "10k-50k",
    annualRevenueBand: "under-1m",
    opportunitySignal: 70,
  },
  {
    id: "zenith",
    name: "Zenith Legal Ops",
    role: "provider",
    industries: ["legal", "finance"],
    services: ["compliance advisory", "contract operations"],
    location: "new york",
    budgetRange: "50k-250k",
    annualRevenueBand: "1m-10m",
    opportunitySignal: 76,
  },
  {
    id: "lattice",
    name: "Lattice Talent Network",
    role: "provider",
    industries: ["staffing", "business strategy"],
    services: ["executive search", "talent mapping"],
    location: "chicago",
    budgetRange: "10k-50k",
    annualRevenueBand: "1m-10m",
    opportunitySignal: 73,
  },
];

export const relationshipEdges: RelationshipEdge[] = [
  { from: "demacco", to: "northline", strength: 88 },
  { from: "demacco", to: "vertex", strength: 82 },
  { from: "demacco", to: "oakbridge", strength: 91 },
  { from: "demacco", to: "beacon", strength: 76 },
  { from: "northline", to: "kinetic", strength: 79 },
  { from: "northline", to: "zenith", strength: 72 },
  { from: "vertex", to: "oakbridge", strength: 86 },
  { from: "vertex", to: "sunridge", strength: 68 },
  { from: "beacon", to: "healthfirst", strength: 77 },
  { from: "beacon", to: "lattice", strength: 74 },
  { from: "healthfirst", to: "lattice", strength: 81 },
  { from: "sunridge", to: "futureflow", strength: 73 },
  { from: "futureflow", to: "harbor", strength: 66 },
  { from: "harbor", to: "demacco", strength: 63 },
  { from: "kinetic", to: "futureflow", strength: 71 },
  { from: "oakbridge", to: "zenith", strength: 75 },
  { from: "zenith", to: "lattice", strength: 69 },
  { from: "lattice", to: "sunridge", strength: 64 },
];

export type GraphRecommendation = {
  nodeId: string;
  name: string;
  fitScore: number;
  opportunityScore: number;
  shortestPath: string[];
  pathStrength: number;
  rationale: string;
  diagnostics: {
    directCompatibility: number;
    cosineSimilarity: number;
    roleScore: number;
    industryScore: number;
    serviceScore: number;
    budgetScore: number;
    locationScore: number;
  };
};

export const betaTestProfiles: OnboardingProfile[] = [
  {
    fullName: "Avery Quinn",
    workEmail: "avery@suncoasthealth.io",
    companyName: "SunCoast Health Collective",
    role: "seeker",
    industry: "Healthcare",
    employeeRange: "51-200",
    revenueRange: "1m-10m",
    budgetRange: "10k-50k",
    services: "referral network, patient growth",
    location: "Chicago, IL",
    goals: "Find healthcare marketing and referral partners for regional expansion.",
    timeline: "quarter",
  },
  {
    fullName: "Nadia Patel",
    workEmail: "nadia@northline.tech",
    companyName: "Northline Technology Partners",
    role: "provider",
    industry: "IT",
    employeeRange: "201-plus",
    revenueRange: "10m-plus",
    budgetRange: "50k-250k",
    services: "cloud migration, ai operations, managed services",
    location: "New York, NY",
    goals: "Acquire enterprise clients needing AI-enabled ops modernization.",
    timeline: "immediate",
  },
  {
    fullName: "Miguel Rivera",
    workEmail: "mrivera@harborstay.com",
    companyName: "HarborStay Group",
    role: "seeker",
    industry: "Hospitality",
    employeeRange: "11-50",
    revenueRange: "under-1m",
    budgetRange: "10k-50k",
    services: "guest growth, event partnerships",
    location: "Miami, FL",
    goals: "Source local partners to increase occupancy and group bookings.",
    timeline: "half-year",
  },
  {
    fullName: "Priya Menon",
    workEmail: "priya@kineticapps.ai",
    companyName: "Kinetic Apps",
    role: "hybrid",
    industry: "SaaS",
    employeeRange: "51-200",
    revenueRange: "1m-10m",
    budgetRange: "50k-250k",
    services: "automation, data integration, platform partnerships",
    location: "Austin, TX",
    goals: "Find channel partners while sourcing implementation specialists.",
    timeline: "quarter",
  },
  {
    fullName: "Daniel Okafor",
    workEmail: "dokafor@oakbridge.vc",
    companyName: "Oakbridge Ventures",
    role: "provider",
    industry: "Private Equity",
    employeeRange: "51-200",
    revenueRange: "10m-plus",
    budgetRange: "250k-plus",
    services: "deal sourcing, portfolio support, m&a advisory",
    location: "Miami, FL",
    goals: "Identify high-growth operators and strategic co-investment partners.",
    timeline: "immediate",
  },
];

function normalize(text: string) {
  return text.trim().toLowerCase();
}

function splitTerms(value: string) {
  return value
    .toLowerCase()
    .split(/[;,|]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function budgetIndex(range: BudgetRange) {
  switch (range) {
    case "under-10k":
      return 0;
    case "10k-50k":
      return 1;
    case "50k-250k":
      return 2;
    case "250k-plus":
      return 3;
    default:
      return 1;
  }
}

function roleCompatibility(profileRole: OnboardingProfile["role"], nodeRole: GraphNodeRole) {
  if (profileRole === "hybrid" || nodeRole === "hybrid") {
    return 1;
  }

  if (profileRole === nodeRole) {
    return 0.72;
  }

  return 1;
}

function jaccardScore(a: string[], b: string[]) {
  const setA = new Set(a.map(normalize));
  const setB = new Set(b.map(normalize));

  const union = new Set([...setA, ...setB]);
  if (union.size === 0) {
    return 0;
  }

  let intersectionSize = 0;
  for (const value of setA) {
    if (setB.has(value)) {
      intersectionSize += 1;
    }
  }

  return intersectionSize / union.size;
}

function revenueIndex(band: MockBusinessNode["annualRevenueBand"]) {
  switch (band) {
    case "under-1m":
      return 0;
    case "1m-10m":
      return 1;
    case "10m-plus":
      return 2;
    default:
      return 1;
  }
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let index = 0; index < a.length; index += 1) {
    const valueA = a[index] ?? 0;
    const valueB = b[index] ?? 0;
    dot += valueA * valueB;
    magA += valueA * valueA;
    magB += valueB * valueB;
  }

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function nodeFeatureVector(node: MockBusinessNode) {
  return [
    node.role === "seeker" ? 1 : 0,
    node.role === "provider" ? 1 : 0,
    node.role === "hybrid" ? 1 : 0,
    budgetIndex(node.budgetRange) / 3,
    revenueIndex(node.annualRevenueBand) / 2,
    Math.min(node.services.length / 6, 1),
    Math.min(node.industries.length / 4, 1),
    node.opportunitySignal / 100,
  ];
}

function profileToPseudoNode(profile: OnboardingProfile): MockBusinessNode {
  return {
    id: "you",
    name: profile.companyName || profile.fullName || "You",
    role: profile.role,
    industries: splitTerms(profile.industry),
    services: splitTerms(profile.services),
    location: normalize(profile.location || ""),
    budgetRange: profile.budgetRange,
    annualRevenueBand:
      profile.revenueRange === "under-1m" || profile.revenueRange === "pre-revenue"
        ? "under-1m"
        : profile.revenueRange === "1m-10m"
          ? "1m-10m"
          : "10m-plus",
    opportunitySignal: 70,
  };
}

function computeDirectCompatibility(profileNode: MockBusinessNode, targetNode: MockBusinessNode) {
  const roleScore = roleCompatibility(profileNode.role, targetNode.role);
  const industryScore = jaccardScore(profileNode.industries, targetNode.industries);
  const serviceScore = jaccardScore(profileNode.services, targetNode.services);
  const budgetGap = Math.abs(budgetIndex(profileNode.budgetRange) - budgetIndex(targetNode.budgetRange));
  const budgetScore = 1 - budgetGap / 3;
  const locationScore = profileNode.location && targetNode.location.includes(profileNode.location) ? 1 : 0.45;
  const cosineScore = cosineSimilarity(nodeFeatureVector(profileNode), nodeFeatureVector(targetNode));

  const score =
    roleScore * 0.2 +
    industryScore * 0.18 +
    serviceScore * 0.18 +
    budgetScore * 0.14 +
    locationScore * 0.1 +
    cosineScore * 0.2;

  return {
    score: Math.max(0, Math.min(1, score)),
    breakdown: {
      roleScore,
      industryScore,
      serviceScore,
      budgetScore,
      locationScore,
      cosineScore,
    },
  };
}

function buildAdjacency(edges: RelationshipEdge[]) {
  const adjacency = new Map<string, Array<{ to: string; cost: number; strength: number }>>();

  for (const edge of edges) {
    const cost = 1 + (100 - edge.strength) / 20;

    if (!adjacency.has(edge.from)) {
      adjacency.set(edge.from, []);
    }
    if (!adjacency.has(edge.to)) {
      adjacency.set(edge.to, []);
    }

    adjacency.get(edge.from)?.push({ to: edge.to, cost, strength: edge.strength });
    adjacency.get(edge.to)?.push({ to: edge.from, cost, strength: edge.strength });
  }

  return adjacency;
}

function shortestPath(adjacency: Map<string, Array<{ to: string; cost: number; strength: number }>>, start: string, target: string) {
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const visited = new Set<string>();

  for (const node of adjacency.keys()) {
    distances.set(node, Number.POSITIVE_INFINITY);
    previous.set(node, null);
  }
  distances.set(start, 0);

  while (visited.size < adjacency.size) {
    let current: string | null = null;
    let currentDistance = Number.POSITIVE_INFINITY;

    for (const [node, distance] of distances.entries()) {
      if (!visited.has(node) && distance < currentDistance) {
        currentDistance = distance;
        current = node;
      }
    }

    if (!current || currentDistance === Number.POSITIVE_INFINITY) {
      break;
    }

    if (current === target) {
      break;
    }

    visited.add(current);

    const neighbors = adjacency.get(current) ?? [];
    for (const neighbor of neighbors) {
      if (visited.has(neighbor.to)) {
        continue;
      }

      const candidateDistance = currentDistance + neighbor.cost;
      if (candidateDistance < (distances.get(neighbor.to) ?? Number.POSITIVE_INFINITY)) {
        distances.set(neighbor.to, candidateDistance);
        previous.set(neighbor.to, current);
      }
    }
  }

  const path: string[] = [];
  let walk: string | null = target;

  if ((distances.get(target) ?? Number.POSITIVE_INFINITY) === Number.POSITIVE_INFINITY) {
    return {
      path,
      distance: Number.POSITIVE_INFINITY,
    };
  }

  while (walk) {
    path.unshift(walk);
    walk = previous.get(walk) ?? null;
  }

  return {
    path,
    distance: distances.get(target) ?? Number.POSITIVE_INFINITY,
  };
}

export function recommendMatches(profile: OnboardingProfile, limit = 5): GraphRecommendation[] {
  const profileNode = profileToPseudoNode(profile);
  const allNodes = [profileNode, ...mockBusinessNodes];

  const profileSeedEdges: RelationshipEdge[] = mockBusinessNodes.map((node) => {
    const directCompatibility = computeDirectCompatibility(profileNode, node).score;
    const strength = Math.round(52 + directCompatibility * 42);
    return {
      from: profileNode.id,
      to: node.id,
      strength,
    };
  });

  const adjacency = buildAdjacency([...relationshipEdges, ...profileSeedEdges]);

  return mockBusinessNodes
    .map((node) => {
      const pathResult = shortestPath(adjacency, profileNode.id, node.id);
      const distancePenalty = Number.isFinite(pathResult.distance) ? Math.min(pathResult.distance * 7.5, 32) : 40;
      const compatibility = computeDirectCompatibility(profileNode, node);
      const directCompatibility = compatibility.score;
      const pathStrength = Math.max(40, Math.round(100 - distancePenalty));

      const fitScore = Math.max(50, Math.min(99, Math.round(100 * (directCompatibility * 0.64 + (pathStrength / 100) * 0.36))));
      const opportunityScore = Math.max(
        48,
        Math.min(
          99,
          Math.round(node.opportunitySignal * 0.68 + fitScore * 0.24 + (profileNode.role === "hybrid" ? 7 : 0)),
        ),
      );

      const pathNames = pathResult.path.map((id) => allNodes.find((entry) => entry.id === id)?.name ?? id);
      const rationale =
        directCompatibility > 0.74
          ? "Strong direct alignment on role, industry, and service intent."
          : pathStrength > 78
            ? "Warm network path compensates for moderate direct overlap."
            : "Worth exploring due to upside potential and network adjacency.";

      return {
        nodeId: node.id,
        name: node.name,
        fitScore,
        opportunityScore,
        shortestPath: pathNames,
        pathStrength,
        rationale,
        diagnostics: {
          directCompatibility: Number(directCompatibility.toFixed(3)),
          cosineSimilarity: Number(compatibility.breakdown.cosineScore.toFixed(3)),
          roleScore: Number(compatibility.breakdown.roleScore.toFixed(3)),
          industryScore: Number(compatibility.breakdown.industryScore.toFixed(3)),
          serviceScore: Number(compatibility.breakdown.serviceScore.toFixed(3)),
          budgetScore: Number(compatibility.breakdown.budgetScore.toFixed(3)),
          locationScore: Number(compatibility.breakdown.locationScore.toFixed(3)),
        },
      };
    })
    .sort((a, b) => b.opportunityScore - a.opportunityScore || b.fitScore - a.fitScore)
    .slice(0, limit);
}

export function getMockGraphDataset() {
  return {
    nodes: mockBusinessNodes,
    edges: relationshipEdges,
    betaProfiles: betaTestProfiles,
    meta: {
      nodeCount: mockBusinessNodes.length,
      edgeCount: relationshipEdges.length,
      algorithm: "Dijkstra shortest path on weighted relationship graph + weighted compatibility with cosine similarity",
    },
  };
}
