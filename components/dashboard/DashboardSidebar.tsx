"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import ThemeLogo from "@/components/ui/ThemeLogo";

type NavIconName =
  | "home"
  | "network"
  | "matches"
  | "opportunities"
  | "introductions"
  | "messages"
  | "activity"
  | "reports"
  | "saved";

const navItems = [
  { label: "Home", icon: "home" as NavIconName, href: "/dashboard" },
  { label: "Network", icon: "network" as NavIconName, href: "/dashboard/network" },
  { label: "Matches", icon: "matches" as NavIconName, href: "/dashboard/matches" },
  {
    label: "Opportunities",
    icon: "opportunities" as NavIconName,
    href: "/dashboard/opportunities",
  },
  {
    label: "Introductions",
    icon: "introductions" as NavIconName,
    href: "/dashboard/introductions",
  },
  { label: "Messages", icon: "messages" as NavIconName, href: "/dashboard/messages" },
  { label: "Activity", icon: "activity" as NavIconName, href: "/dashboard/activity" },
  { label: "Reports", icon: "reports" as NavIconName, href: "/dashboard/reports" },
  { label: "Saved", icon: "saved" as NavIconName, href: "/dashboard/saved" },
];

function SidebarIcon({ name }: { name: NavIconName }) {
  const baseClass = "h-4 w-4";

  switch (name) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M3 10.5L12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 9.5V20h11V9.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "network":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <circle cx="6" cy="6" r="2.25" />
          <circle cx="18" cy="7" r="2.25" />
          <circle cx="12" cy="18" r="2.25" />
          <path d="M8 7.2l7.7-.9M7.4 8.1l3.8 7.8M16.9 9.1l-3.4 6.8" strokeLinecap="round" />
        </svg>
      );
    case "matches":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M13 3L5 13h5l-1 8 8-10h-5l1-8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "opportunities":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "introductions":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <circle cx="8" cy="9" r="2.5" />
          <circle cx="16" cy="9" r="2.5" />
          <path d="M4.5 18c.9-2.2 2.5-3.3 5-3.3s4.1 1.1 5 3.3" strokeLinecap="round" />
          <path d="M14.5 18h5" strokeLinecap="round" />
        </svg>
      );
    case "messages":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M5 5h14v10H9l-4 4V5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "activity":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M4 19h16" strokeLinecap="round" />
          <rect x="6" y="11" width="2.8" height="6" rx="0.8" />
          <rect x="10.6" y="8" width="2.8" height="9" rx="0.8" />
          <rect x="15.2" y="6" width="2.8" height="11" rx="0.8" />
        </svg>
      );
    case "reports":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M4 19h16" strokeLinecap="round" />
          <path d="M6 15l3.8-4 3.5 2.5L18 8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="15" r="1" fill="currentColor" stroke="none" />
          <circle cx="9.8" cy="11" r="1" fill="currentColor" stroke="none" />
          <circle cx="13.3" cy="13.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="18" cy="8" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "saved":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M7 4h10v16l-5-3-5 3V4z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

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
    <aside className="border-b border-slate-200 p-4 lg:border-b-0 lg:border-r lg:bg-white lg:p-5">
      <div className="mb-8 flex items-center justify-center">
        <ThemeLogo
          className="h-10 w-auto object-contain"
          sageClassName="h-16 w-auto object-contain"
        />
      </div>

      <nav className="mb-auto grid grid-cols-3 gap-1.5 sm:grid-cols-5 lg:flex lg:flex-col lg:gap-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`group flex items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium transition duration-200 sm:px-3 lg:justify-start lg:gap-3 lg:px-3 lg:text-sm ${
              isActive(item.href)
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title={item.label}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${
                isActive(item.href)
                  ? "border-indigo-200 bg-white text-indigo-700"
                  : "border-slate-200 bg-white text-slate-500 group-hover:text-slate-700"
              }`}
            >
              <SidebarIcon name={item.icon} />
            </span>
            <span className="hidden text-left lg:block">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
    </aside>
  );
}
