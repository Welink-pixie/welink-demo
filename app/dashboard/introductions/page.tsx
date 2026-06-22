export default function IntroductionsPage() {
  return (
    <section className="p-4 lg:p-5">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Introductions
        </h1>
        <p className="text-sm text-slate-500">Manage your introduction requests</p>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Intro Request {i}</h3>
                <p className="mt-1 text-sm text-slate-500">Person A → Person B • Pending</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Decline
                </button>
                <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
