export default function ReportsPage() {
  return (
    <section className="p-4 lg:p-5">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Reports
        </h1>
        <p className="text-sm text-slate-500">View analytics and insights about your network</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Total Connections</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">12,458</p>
          <p className="mt-1 text-xs text-emerald-600">↑ 5.2% this month</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Opportunities Found</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">247</p>
          <p className="mt-1 text-xs text-emerald-600">↑ 12.3% this month</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Active Introductions</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">18</p>
          <p className="mt-1 text-xs text-emerald-600">↑ 2.1% this month</p>
        </div>
      </div>
    </section>
  );
}
