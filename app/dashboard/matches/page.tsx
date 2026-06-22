export default function MatchesPage() {
  return (
    <section className="p-4 lg:p-5">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Matches
        </h1>
        <p className="text-sm text-slate-500">Discover companies that match your criteria</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-lg font-semibold text-indigo-700">
              {String.fromCharCode(64 + i)}
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900">Company {i}</h3>
            <p className="mt-1 text-xs text-slate-500">Industry • Location</p>
            <div className="mt-3 text-right">
              <p className="text-2xl font-bold text-emerald-600">{85 + i}%</p>
              <p className="text-xs text-emerald-600">Match</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
