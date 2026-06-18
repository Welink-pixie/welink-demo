"use client";

import NetworkMap from "@/components/network/NetworkMap";
import { companies } from "@/components/network/networkData";
import { useMemo, useState } from "react";

const navItems = [
  "Home",
  "Network",
  "Matches",
  "Opportunities",
  "Introductions",
  "Messages",
  "Activity",
  "Reports",
  "Saved",
];

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
  "Intro Requested",
  "Introduction Made",
  "Meeting Completed",
  "Proposal Sent",
  "Partnership Signed",
];

export default function DashboardPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState("demacco");

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === selectedCompanyId) ?? companies[0],
    [selectedCompanyId],
  );

  return (
    <main className="min-h-screen bg-[#f3f5fb] p-3 lg:p-4">
      <div className="mx-auto max-w-[1500px] rounded-3xl border border-slate-200/70 bg-white shadow-sm">
        <div className="grid min-h-[92vh] grid-cols-1 lg:grid-cols-[120px_1fr]">
          <aside className="border-b border-slate-200 p-4 lg:border-b-0 lg:border-r lg:p-3">
            <div className="mb-5 flex items-center justify-center lg:mb-8">
              <img
                src="/we_link_logo.png"
                alt="WeLink"
                className="h-10 w-auto object-contain"
              />
            </div>

            <nav className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-1">
              {navItems.map((item, index) => (
                <button
                  key={item}
                  className={`rounded-xl px-3 py-2 text-left text-xs font-medium transition ${
                    index === 0
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3 lg:mt-8">
              <p className="text-xs font-semibold text-slate-900">Selena Gutierrez</p>
              <p className="text-[11px] text-slate-500">Business Development</p>
            </div>
          </aside>

          <section className="p-4 lg:p-5">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Good morning, Selena
                </h1>
                <p className="text-sm text-slate-500">Here is your network overview</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search companies, people, industries..."
                  className="w-full min-w-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-indigo-300 lg:w-80"
                />
                <button className="h-10 w-10 rounded-full border border-slate-200 text-slate-500">i</button>
                <button className="h-10 w-10 rounded-full border border-slate-200 text-slate-500">+</button>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-2">
                <NetworkMap
                  selectedCompanyId={selectedCompany.id}
                  onSelectCompany={setSelectedCompanyId}
                />
              </div>

              <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950">{selectedCompany.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedCompany.type} • {selectedCompany.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-emerald-600">{selectedCompany.fitScore}%</p>
                    <p className="text-xs font-semibold text-emerald-600">Strong Fit</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-600">
                  {selectedCompany.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedCompany.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  {selectedCompany.people.map((person) => (
                    <div key={person} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                          {person.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{person}</p>
                          <p className="text-xs text-slate-500">Key stakeholder</p>
                        </div>
                      </div>
                      <button className="rounded-full border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-600">
                        Message
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                    Save
                  </button>
                  <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                    Connect
                  </button>
                </div>
              </aside>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Top Opportunities</h3>
                  <button className="text-xs font-semibold text-indigo-600">View all</button>
                </div>

                <div className="space-y-3">
                  {topOpportunities.map((item) => (
                    <article
                      key={item.target}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-3"
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
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
                  <button className="text-xs font-semibold text-indigo-600">View all</button>
                </div>

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
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Relationship Timeline</h3>
                  <button className="text-xs font-semibold text-indigo-600">View all</button>
                </div>

                <div className="space-y-3">
                  {timelineItems.map((item) => (
                    <article key={item} className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <p className="text-sm text-slate-700">{item}</p>
                    </article>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-xs text-emerald-800">Revenue Generated</p>
                  <p className="text-2xl font-semibold text-emerald-700">$250,000</p>
                  <p className="text-xs text-emerald-700/80">July 15, 2024</p>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}