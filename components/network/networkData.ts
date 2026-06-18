export type Company = {
  id: string;
  name: string;
  type: string;
  city: string;
  fitScore: number;
  value: string;
  tags: string[];
  people: string[];
  summary: string;
  x: string;
  y: string;
  featured?: boolean;
};

export const companies: Company[] = [
  {
    id: "demacco",
    name: "Demacco Consulting",
    type: "Business Strategy",
    city: "Miami, FL",
    fitScore: 87,
    value: "$2.4M",
    tags: ["Strategic Partnerships", "Growth Advisory", "M&A Support"],
    people: ["Devon Demacco", "Selena Gutierrez"],
    summary:
      "Mid-market advisor focused on growth strategy, operational clarity, and strategic partnerships.",
    x: "52%",
    y: "46%",
    featured: true,
  },
  {
    id: "northline",
    name: "Northline Solutions",
    type: "IT Consulting",
    city: "New York, NY",
    fitScore: 92,
    value: "$2.4M",
    tags: ["Cloud Migration", "AI Operations", "Managed Services"],
    people: ["Nina Patel", "Jordan Chen"],
    summary:
      "Technology consulting team with a strong services motion and active strategic partner program.",
    x: "24%",
    y: "18%",
  },
  {
    id: "healthfirst",
    name: "HealthFirst Clinics",
    type: "Healthcare",
    city: "Chicago, IL",
    fitScore: 89,
    value: "$850K",
    tags: ["Practice Growth", "Referral Network", "Patient Experience"],
    people: ["Avery Brooks", "Mia Torres"],
    summary:
      "Healthcare group expanding its referral network and looking for trusted operator introductions.",
    x: "78%",
    y: "18%",
  },
  {
    id: "futureflow",
    name: "FutureFlow Logistics",
    type: "Logistics",
    city: "Atlanta, GA",
    fitScore: 81,
    value: "$520K",
    tags: ["Supply Chain", "Distribution", "Operations"],
    people: ["Marcus Hill", "Ella Nguyen"],
    summary:
      "Logistics platform with a growing network of enterprise partners and regional operators.",
    x: "22%",
    y: "84%",
  },
  {
    id: "vertex",
    name: "Vertex Capital",
    type: "Private Equity",
    city: "Dallas, TX",
    fitScore: 76,
    value: "$520K",
    tags: ["Portfolio Growth", "Capital Access", "Founder Network"],
    people: ["Ryan Cole", "Sofia Martin"],
    summary:
      "Investment firm looking for higher-quality operator relationships and founder introductions.",
    x: "79%",
    y: "84%",
  },
];
