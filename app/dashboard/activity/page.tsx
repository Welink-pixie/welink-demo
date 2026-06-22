export default function ActivityPage() {
  return (
    <section className="p-4 lg:p-5">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Activity
        </h1>
        <p className="text-sm text-slate-500">Track your recent activity and updates</p>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-indigo-500" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900">Activity Event {i}</p>
              <p className="mt-1 text-sm text-slate-500">Something interesting happened</p>
              <p className="mt-2 text-xs text-slate-400">{i}h ago</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
