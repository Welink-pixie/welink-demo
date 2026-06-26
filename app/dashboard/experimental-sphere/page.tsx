"use client";

import { useMemo, useState } from "react";

type NodeKind = "relationship" | "capability" | "opportunity" | "resource";
type NodeState = "unlocked" | "inProgress" | "locked";

type SphereNode = {
  id: string;
  label: string;
  kind: NodeKind;
  state: NodeState;
  x: number;
  y: number;
  significance: number;
  detail: string;
  reward: string;
};

type SphereEdge = {
  a: string;
  b: string;
};

const nodes: SphereNode[] = [
  {
    id: "you",
    label: "YOU",
    kind: "relationship",
    state: "unlocked",
    x: 50,
    y: 50,
    significance: 1,
    detail: "Business Developer",
    reward: "Your network anchor.",
  },
  {
    id: "strategic-partnerships",
    label: "Strategic Partnerships",
    kind: "relationship",
    state: "inProgress",
    x: 50,
    y: 34,
    significance: 0.98,
    detail: "Unlocks access to co-marketing and expansion paths.",
    reward: "+24 Opportunity Score",
  },
  {
    id: "client-referrals",
    label: "Client Referrals",
    kind: "relationship",
    state: "unlocked",
    x: 31,
    y: 50,
    significance: 0.78,
    detail: "Strengthens lead quality from warm connections.",
    reward: "+12 Trust",
  },
  {
    id: "key-introductions",
    label: "Key Introductions",
    kind: "capability",
    state: "unlocked",
    x: 69,
    y: 50,
    significance: 0.9,
    detail: "Unlocks direct pathways to strategic partners.",
    reward: "Intro conversion +19%",
  },
  {
    id: "revenue-growth",
    label: "Revenue Growth",
    kind: "opportunity",
    state: "unlocked",
    x: 50,
    y: 66,
    significance: 0.85,
    detail: "Compounds value when partnership loops are active.",
    reward: "$1M milestone track",
  },
  {
    id: "industry-events",
    label: "Industry Events",
    kind: "capability",
    state: "unlocked",
    x: 24,
    y: 23,
    significance: 0.62,
    detail: "Improves visibility and discovery opportunities.",
    reward: "+8 reach",
  },
  {
    id: "investor-access",
    label: "Investor Access",
    kind: "resource",
    state: "inProgress",
    x: 50,
    y: 12,
    significance: 0.8,
    detail: "Opens event fund support and premium intros.",
    reward: "2 Event Access Passes",
  },
  {
    id: "branding-positioning",
    label: "Branding & Positioning",
    kind: "capability",
    state: "unlocked",
    x: 76,
    y: 23,
    significance: 0.7,
    detail: "Improves conversion on top-funnel opportunities.",
    reward: "+11 quality score",
  },
  {
    id: "sales-excellence",
    label: "Sales Excellence",
    kind: "capability",
    state: "unlocked",
    x: 88,
    y: 45,
    significance: 0.76,
    detail: "Raises closing quality for high-fit paths.",
    reward: "+15 close efficiency",
  },
  {
    id: "operational-excellence",
    label: "Operational Excellence",
    kind: "capability",
    state: "locked",
    x: 84,
    y: 63,
    significance: 0.6,
    detail: "Requires progress in partnerships and pricing.",
    reward: "Scale readiness",
  },
  {
    id: "technology-leverage",
    label: "Technology Leverage",
    kind: "resource",
    state: "locked",
    x: 68,
    y: 77,
    significance: 0.66,
    detail: "Automation unlock for multi-thread opportunities.",
    reward: "Workflow multiplier",
  },
  {
    id: "scalable-systems",
    label: "Scalable Systems",
    kind: "resource",
    state: "locked",
    x: 50,
    y: 82,
    significance: 0.63,
    detail: "Stabilizes growth loops for larger deal sizes.",
    reward: "Capacity unlock",
  },
  {
    id: "market-research",
    label: "Market Research",
    kind: "opportunity",
    state: "locked",
    x: 33,
    y: 77,
    significance: 0.58,
    detail: "Requires stronger upstream relationship signals.",
    reward: "Trend clarity",
  },
  {
    id: "niche-expertise",
    label: "Niche Expertise",
    kind: "capability",
    state: "locked",
    x: 19,
    y: 63,
    significance: 0.61,
    detail: "Unlocks high-margin targeted opportunities.",
    reward: "+9 specialization",
  },
  {
    id: "thought-leadership",
    label: "Thought Leadership",
    kind: "relationship",
    state: "locked",
    x: 16,
    y: 37,
    significance: 0.64,
    detail: "Amplifies authority and trust in key circles.",
    reward: "Reputation boost",
  },
];

const edges: SphereEdge[] = [
  { a: "you", b: "strategic-partnerships" },
  { a: "you", b: "client-referrals" },
  { a: "you", b: "key-introductions" },
  { a: "you", b: "revenue-growth" },
  { a: "strategic-partnerships", b: "investor-access" },
  { a: "strategic-partnerships", b: "branding-positioning" },
  { a: "client-referrals", b: "industry-events" },
  { a: "client-referrals", b: "thought-leadership" },
  { a: "key-introductions", b: "sales-excellence" },
  { a: "key-introductions", b: "operational-excellence" },
  { a: "revenue-growth", b: "technology-leverage" },
  { a: "revenue-growth", b: "scalable-systems" },
  { a: "scalable-systems", b: "market-research" },
  { a: "market-research", b: "niche-expertise" },
  { a: "industry-events", b: "investor-access" },
  { a: "investor-access", b: "branding-positioning" },
  { a: "branding-positioning", b: "sales-excellence" },
  { a: "sales-excellence", b: "operational-excellence" },
  { a: "operational-excellence", b: "technology-leverage" },
  { a: "technology-leverage", b: "scalable-systems" },
  { a: "market-research", b: "niche-expertise" },
  { a: "niche-expertise", b: "thought-leadership" },
  { a: "thought-leadership", b: "industry-events" },
];

const nodeTypeColor: Record<NodeKind, string> = {
  relationship: "#6d28d9",
  capability: "#16a34a",
  opportunity: "#2563eb",
  resource: "#a855f7",
};

const statusLabel: Record<NodeState, string> = {
  unlocked: "Unlocked",
  inProgress: "In Progress",
  locked: "Locked",
};

const statusDotColor: Record<NodeState, string> = {
  unlocked: "bg-emerald-500",
  inProgress: "bg-indigo-500",
  locked: "bg-slate-300",
};

export default function ExperimentalSphereGridPage() {
  const [selectedNodeId, setSelectedNodeId] = useState("strategic-partnerships");

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? nodes[0];

  const nodeById = useMemo(
    () => Object.fromEntries(nodes.map((node) => [node.id, node])) as Record<string, SphereNode>,
    [],
  );

  const degreeById = useMemo(() => {
    const degree: Record<string, number> = Object.fromEntries(nodes.map((node) => [node.id, 0]));
    edges.forEach((edge) => {
      degree[edge.a] += 1;
      degree[edge.b] += 1;
    });
    return degree;
  }, []);

  const maxDegree = useMemo(() => Math.max(...Object.values(degreeById)), [degreeById]);

  const centralityById = useMemo(() => {
    return Object.fromEntries(
      nodes.map((node) => [node.id, degreeById[node.id] / maxDegree]),
    ) as Record<string, number>;
  }, [degreeById, maxDegree]);

  const significanceScoreById = useMemo(() => {
    return Object.fromEntries(
      nodes.map((node) => [
        node.id,
        node.significance * 0.65 + centralityById[node.id] * 0.35,
      ]),
    ) as Record<string, number>;
  }, [centralityById]);

  const isActiveNode = (node: SphereNode) => node.state !== "locked";

  return (
    <section className="min-h-[calc(100vh-2rem)] bg-[#f6f7fc] p-4 lg:p-5">
      <div className="mx-auto max-w-[1480px] space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Opportunity Sphere Grid</h1>
            <p className="text-sm text-slate-500">Navigate your network. Unlock opportunity.</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search companies, people, industries..."
              className="w-full min-w-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-indigo-300 lg:w-72"
            />
            <button className="h-10 w-10 rounded-full border border-slate-200 text-slate-500">i</button>
            <button className="h-10 w-10 rounded-full border border-slate-200 text-slate-500">⚙</button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="relative h-[560px] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#fbfcff] to-[#f4f6ff]">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-indigo-200" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-indigo-200" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-100" />

              <svg className="pointer-events-none absolute inset-0 h-full w-full">
                {edges.map((edge) => {
                  const a = nodeById[edge.a];
                  const b = nodeById[edge.b];
                  const score = (significanceScoreById[a.id] + significanceScoreById[b.id]) / 2;
                  const fullyActive = isActiveNode(a) && isActiveNode(b);
                  const partiallyActive = isActiveNode(a) || isActiveNode(b);

                  return (
                    <line
                      key={`${edge.a}-${edge.b}`}
                      x1={`${a.x}%`}
                      y1={`${a.y}%`}
                      x2={`${b.x}%`}
                      y2={`${b.y}%`}
                      stroke={fullyActive ? "#7c3aed" : partiallyActive ? "#a78bfa" : "#cbd5e1"}
                      strokeOpacity={fullyActive ? Math.min(1, 0.4 + score * 0.75) : partiallyActive ? 0.45 : 0.26}
                      strokeWidth={fullyActive ? 1.2 + score * 3 : 0.7 + score * 1.2}
                      strokeDasharray={fullyActive ? "0" : "4 4"}
                    />
                  );
                })}
              </svg>

              {nodes.map((node) => {
                const score = significanceScoreById[node.id];
                const size = node.id === "you" ? 86 : Math.round(42 + score * 16);
                const selected = node.id === selectedNodeId;
                const isActive = isActiveNode(node);

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    className={
                      "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-center transition " +
                      (selected ? "ring-2 ring-indigo-400 " : "") +
                      (node.id === "you"
                        ? "border-indigo-200 bg-white shadow-[0_0_24px_rgba(99,102,241,0.35)]"
                        : isActive
                          ? "border-indigo-200 bg-white shadow-[0_0_18px_rgba(124,58,237,0.28)]"
                          : "border-slate-200 bg-white")
                    }
                    style={{ left: `${node.x}%`, top: `${node.y}%`, width: size, height: size, zIndex: node.id === "you" ? 20 : 10 }}
                  >
                    {node.id === "you" ? (
                      <div className="flex h-full flex-col items-center justify-center gap-1">
                        <div className="h-7 w-7 rounded-lg bg-indigo-600" />
                        <span className="text-[10px] font-semibold text-slate-800">YOU</span>
                      </div>
                    ) : (
                      <span
                        className="mx-auto block h-3 w-3 rounded-full"
                        style={{ backgroundColor: nodeTypeColor[node.kind] }}
                      />
                    )}
                  </button>
                );
              })}

              {nodes.map((node) => (
                node.id !== "you" ? (
                  <div
                    key={`${node.id}-label`}
                    className="pointer-events-none absolute -translate-x-1/2 text-center"
                    style={{ left: `${node.x}%`, top: `calc(${node.y}% + 34px)`, width: 120 }}
                  >
                    <p className="text-[11px] font-semibold text-slate-700">{node.label}</p>
                  </div>
                ) : null
              ))}

              <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                <button className="block h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-50">+</button>
                <button className="block h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-50">−</button>
                <button className="mt-1 block h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-50">⌖</button>
              </div>

              <div className="absolute bottom-4 left-4 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                ↗ View Full Map
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Legend</p>
              <div className="mt-3 space-y-2 text-xs text-slate-600">
                {[
                  { label: "Relationships", color: "#6d28d9" },
                  { label: "Skills / Capabilities", color: "#16a34a" },
                  { label: "Market Opportunities", color: "#2563eb" },
                  { label: "Resources", color: "#a855f7" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <p>○ Unlocked</p>
                <p>◔ In Progress</p>
                <p>◌ Locked</p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected Node</p>
              <div className="mt-3 flex items-start gap-3">
                <span
                  className="mt-1 inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: nodeTypeColor[selectedNode.kind] }}
                />
                <div>
                  <p className="text-xl font-semibold text-slate-900">{selectedNode.label}</p>
                  <span className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white ${statusDotColor[selectedNode.state]}`}>
                    {statusLabel[selectedNode.state]}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-800">Why it matters</p>
              <p className="mt-1 text-sm text-slate-600">{selectedNode.detail}</p>

              <p className="mt-4 text-sm font-semibold text-slate-800">Key Connections (4)</p>
              <div className="mt-2 space-y-2">
                {[
                  "Marco Demacco",
                  "Sarah Chen",
                  "James Lee",
                  "Priya Shah",
                ].map((person, idx) => (
                  <div key={person} className="flex items-center justify-between rounded-xl border border-slate-100 px-2 py-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                        {person.charAt(0)}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{person}</p>
                        <p className="text-[11px] text-slate-500">{idx === 0 ? "Managing Partner" : idx === 1 ? "VP of Strategy" : idx === 2 ? "Partnerships Lead" : "Business Development"}</p>
                      </div>
                    </div>
                    <button className="rounded-full border border-indigo-200 px-2 py-0.5 text-[11px] font-semibold text-indigo-600">Message</button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                  <span>Path Progress</span>
                  <span>50%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-1/2 rounded-full bg-indigo-500" />
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <div>
                  <p className="text-xs text-emerald-800">Opportunity Score</p>
                  <p className="text-3xl font-bold text-emerald-700">87</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-800">Revenue Impact</p>
                  <p className="text-xl font-semibold text-emerald-700">$2.4M</p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Your Top Paths</h3>
              <button className="text-xs font-semibold text-indigo-600">View all</button>
            </div>
            <div className="space-y-2">
              {[
                { name: "Strategic Partner", score: 87, value: "$2.4M" },
                { name: "Sales Excellence", score: 82, value: "$1.8M" },
                { name: "Industry Events", score: 78, value: "$1.2M" },
              ].map((row) => (
                <div key={row.name} className="rounded-xl border border-slate-100 bg-slate-50 p-2">
                  <p className="text-xs font-semibold text-slate-800">{row.name}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{row.score} score</span>
                    <span>{row.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
              <button className="text-xs font-semibold text-indigo-600">View all</button>
            </div>
            <div className="space-y-3">
              {[
                "Sarah Chen accepted your connection request.",
                "Intro request sent to Marco Demacco.",
                "You and Devon have a meeting on May 15.",
              ].map((item) => (
                <article key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p className="text-xs text-slate-600">{item}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Relationship Timeline</h3>
              <button className="text-xs font-semibold text-indigo-600">View all</button>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <p>Intro Requested</p>
              <p>Introduction Made</p>
              <p>Meeting Completed</p>
              <p>Proposal Sent</p>
              <p>Partnership Signed</p>
            </div>
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-2">
              <p className="text-[11px] text-emerald-800">Revenue Generated</p>
              <p className="text-xl font-semibold text-emerald-700">$250,000</p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">Access Points (Key Spheres)</h3>
            <p className="mt-1 text-xs text-slate-500">These unlock new areas of opportunity.</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { v: 3, l: "Industry Intros" },
                { v: 2, l: "Event Pass" },
                { v: 1, l: "Capital Access" },
                { v: 1, l: "Media Exposure" },
                { v: 2, l: "Mentor Alliance" },
                { v: 1, l: "Client Referral" },
              ].map((item) => (
                <div key={item.l} className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-center">
                  <p className="text-lg font-bold text-slate-900">{item.v}</p>
                  <p className="text-[10px] text-slate-500">{item.l}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
