export default function OpportunitiesPage() {
  return (
    <section className="p-4 lg:p-5">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Opportunities
        </h1>
        <p className="text-sm text-slate-500">Explore potential business opportunities</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Opportunity {i}</h3>
                <p className="mt-1 text-sm text-slate-500">Your Company → Target Company {i}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">{80 + i}%</p>
                <p className="text-xs text-emerald-600">Fit</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">Potential value: ${(i * 500).toLocaleString()}K</p>
            <div className="mt-4 flex gap-2">
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                View Details
              </button>
              <button className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                Request Intro
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
