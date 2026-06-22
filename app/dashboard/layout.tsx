import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f3f5fb] p-3 lg:p-4">
      <div className="mx-auto max-w-[1500px] rounded-3xl border border-slate-200/70 bg-white shadow-sm">
        <div className="grid min-h-[92vh] grid-cols-1 lg:grid-cols-[80px_1fr]">
          <DashboardSidebar />
          <div className="animate-fade-in-scale">{children}</div>
        </div>
      </div>
    </main>
  );
}
