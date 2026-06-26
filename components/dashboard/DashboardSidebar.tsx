"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Home", icon: "🏠", href: "/dashboard" },
  { label: "Network", icon: "🔗", href: "/dashboard/network" },
  { label: "Matches", icon: "⚡", href: "/dashboard/matches" },
  { label: "Opportunities", icon: "🎯", href: "/dashboard/opportunities" },
  { label: "Introductions", icon: "🤝", href: "/dashboard/introductions" },
  { label: "Messages", icon: "💬", href: "/dashboard/messages" },
  { label: "Activity", icon: "📊", href: "/dashboard/activity" },
  { label: "Reports", icon: "📈", href: "/dashboard/reports" },
  { label: "Saved", icon: "⭐", href: "/dashboard/saved" },
];

export default function DashboardSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  };

  return (
    <aside className="border-b border-slate-200 p-4 lg:border-b-0 lg:border-r lg:flex lg:flex-col lg:bg-white">
      <div className="mb-8 flex items-center justify-center">
        <img
          src="/we_link_logo.png"
          alt="WeLink"
          className="h-10 w-auto object-contain"
        />
      </div>

      <nav className="mb-auto flex gap-1 lg:flex-col lg:gap-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition duration-200 ${
              isActive(item.href)
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title={item.label}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="hidden text-center lg:block">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold text-slate-900">{username}</p>
        <p className="text-sm text-slate-500">Business Development</p>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
}
