export default function SavedPage() {
  return (
    <section className="p-4 lg:p-5">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Saved Items
        </h1>
        <p className="text-sm text-slate-500">Your bookmarked companies and opportunities</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-lg font-semibold text-indigo-700">
              {String.fromCharCode(64 + i)}
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900">Saved Company {i}</h3>
            <p className="mt-1 text-xs text-slate-500">Industry • Location</p>
            <button className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
              ⭐ Remove from Saved
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
