"use client";

import { useRouter } from "next/navigation";

export default function MobileLogoutCard({ username }: { username: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="dashboard-logout-card rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="truncate text-sm font-semibold text-slate-900">{username}</p>
      <p className="text-sm text-slate-500">Business Development</p>
      <div className="mt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
