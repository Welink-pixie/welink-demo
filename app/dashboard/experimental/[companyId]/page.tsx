import Link from "next/link";
import { notFound } from "next/navigation";
import { companies } from "@/components/network/networkData";
import ThemeLogo from "@/components/ui/ThemeLogo";

type CompanyProfilePageProps = {
  params: Promise<{ companyId: string }>;
};

const relatedOpportunities = [
  {
    title: "Northline Solutions",
    note: "Shared contacts and complementary services",
    value: "$2.4M",
  },
  {
    title: "HealthFirst Clinics",
    note: "Referral network expansion",
    value: "$850K",
  },
  {
    title: "Vertex Capital",
    note: "Founder introductions and growth support",
    value: "$520K",
  },
];

const activity = [
  "Intro request sent to Devon Demacco",
  "Two warm referrals identified in the network",
  "Opportunity updated with growth advisory tags",
  "Revenue potential estimate adjusted",
];

export default async function CompanyProfilePage({ params }: CompanyProfilePageProps) {
  const { companyId } = await params;
  const company = companies.find((item) => item.id === companyId);

  if (!company) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f3f5fb] p-4 lg:p-6">
      <div className="mx-auto max-w-[1400px] rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ThemeLogo
              className="h-10 w-auto object-contain"
              sageClassName="h-16 w-auto object-contain"
            />
            <div>
              <p className="text-sm font-medium text-slate-500">Company Profile</p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                {company.name}
              </h1>
            </div>
          </div>

          <Link
            href="/dashboard/experimental"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Experimental
          </Link>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
          <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 lg:p-6">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">{company.type}</p>
                    <h2 className="mt-1 text-3xl font-semibold text-slate-950">{company.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{company.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-emerald-600">{company.fitScore}%</p>
                    <p className="text-xs font-semibold text-emerald-600">Strong Fit</p>
                  </div>
                </div>

                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600">
                  {company.summary} This profile gives you a quick view of the company’s network
                  relevance, the people attached to the account, and the kinds of opportunities
                  already showing up around it.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {company.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {company.people.map((person) => (
                    <div
                      key={person}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                          {person.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{person}</p>
                          <p className="text-xs text-slate-500">Primary contact</p>
                        </div>
                      </div>
                      <button className="rounded-full border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-600">
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Network Snapshot</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Potential Value</p>
                    <p className="text-2xl font-semibold text-slate-950">{company.value}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Shared Contacts</p>
                    <p className="text-2xl font-semibold text-slate-950">+5</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-medium text-emerald-700">Why this matters</p>
                  <p className="mt-1 text-sm leading-relaxed text-emerald-900/80">
                    This account is active in the network and has enough signal density to justify a warm introduction.
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Recent Activity</p>
                  {activity.map((item) => (
                    <div key={item} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Suggested Opportunities</h3>
                <p className="text-sm text-slate-500">Relevant companies nearby in the network</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {relatedOpportunities.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.note}</p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                Save
              </button>
              <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                Connect
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
