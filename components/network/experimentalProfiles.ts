export type ExperimentalProfile = {
  id: string;
  name: string;
  title: string;
  city: string;
  fitScore: number;
  value: string;
  summary: string;
  tags: string[];
  people: string[];
  contacts: Array<{
    name: string;
    avatar: string;
  }>;
  image: string;
  letter: string;
  href: string;
};

export const experimentalProfiles: ExperimentalProfile[] = [
  {
    id: "henry-small-business-owner",
    name: "Henry Brown",
    title: "Small Business Owner",
    city: "Miami, FL",
    fitScore: 91,
    value: "$1.8M",
    summary:
      "Owns a growing local services business with strong referral momentum and several overlapping operator relationships.",
    tags: ["Local Reach", "Founder Network", "Service Expansion"],
    people: ["Henry Brown", "Mia Alvarez"],
    contacts: [
      { name: "Henry Brown", avatar: "/henry_small_business_owner.png" },
      { name: "Mia Alvarez", avatar: "/photographer_jesse.png" },
    ],
    image: "/henry_small_business_owner.png",
    letter: "H",
    href: "/dashboard/experimental/henry-small-business-owner",
  },
  {
    id: "liza-product-manager",
    name: "Liza Chen",
    title: "Product Manager",
    city: "New York, NY",
    fitScore: 88,
    value: "$1.2M",
    summary:
      "Leads a product team exploring partnerships around workflow automation, customer success, and launch support.",
    tags: ["Product Strategy", "Platform Partnerships", "Workflow"],
    people: ["Liza Chen", "Jordan Lee"],
    contacts: [
      { name: "Liza Chen", avatar: "/product_manager_liza.png" },
      { name: "Jordan Lee", avatar: "/juan_company_owner.png" },
    ],
    image: "/product_manager_liza.png",
    letter: "L",
    href: "/dashboard/experimental/liza-product-manager",
  },
  {
    id: "ux-team",
    name: "UX Team Studio",
    title: "Design & Research",
    city: "Austin, TX",
    fitScore: 85,
    value: "$920K",
    summary:
      "Collaborative UX team that often partners with operations and growth leads on customer experience improvements.",
    tags: ["Design Systems", "Research", "User Experience"],
    people: ["Anika Shah", "Noah Evans"],
    contacts: [
      { name: "Anika Shah", avatar: "/ux_team.png" },
      { name: "Noah Evans", avatar: "/photographer_jesse.png" },
    ],
    image: "/ux_team.png",
    letter: "U",
    href: "/dashboard/experimental/ux-team",
  },
];
