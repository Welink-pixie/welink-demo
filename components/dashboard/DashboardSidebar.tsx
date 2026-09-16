"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import ThemeLogo from "@/components/ui/ThemeLogo";

type NavIconName =
  | "home"
  | "network"
  | "explore"
  | "intel"
  | "messages"
  | "lock";

type NavItem = {
  label: string;
  icon: NavIconName;
  href: string;
  requiresSubscription?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", icon: "home" as NavIconName, href: "/dashboard" },
  { label: "Network", icon: "network" as NavIconName, href: "/dashboard/network" },
  { label: "Explore", icon: "explore" as NavIconName, href: "/dashboard/matches" },
  { label: "Market Intel", icon: "intel" as NavIconName, href: "/dashboard/market-intel" },
  {
    label: "Messages",
    icon: "messages" as NavIconName,
    href: "/dashboard/messages",
    requiresSubscription: true,
  },
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
    case "explore":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "intel":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M3 13h3.5l2-5 3 10 2.5-7 2 3.5H21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "messages":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M5 5h14v10H9l-4 4V5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function DashboardSidebar({
  username,
  isSubscribed,
}: {
  username: string;
  isSubscribed: boolean;
}) {
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
    <aside className="dashboard-sidebar-shell flex min-h-0 flex-col border-b border-slate-200 p-4 sm:min-h-[calc(100dvh-1.5rem)] sm:border-b-0 sm:border-r sm:bg-white sm:p-5 lg:min-h-full">
      <div className="mb-4 flex items-center justify-center lg:mb-5">
        <ThemeLogo
          className="h-20 w-auto object-contain opacity-90"
          sageClassName="h-24 w-auto object-contain opacity-90"
          disableKnightShadow
        />
      </div>

      <nav className="mb-auto flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch lg:gap-2">
        {navItems.map((item) => {
          const isLocked = item.requiresSubscription && !isSubscribed;
          const active = !isLocked && isActive(item.href);
          const shellClass = `group nav-item flex h-10 w-10 items-center justify-center rounded-xl text-xs font-medium transition duration-200 lg:h-auto lg:w-auto lg:justify-start lg:gap-3 lg:px-3 lg:py-2.5 lg:text-sm ${
            active
              ? "nav-item-active morphic-pill text-indigo-700"
              : isLocked
                ? "cursor-not-allowed text-slate-400"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`;

          const iconClass = `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
            active
              ? "nav-icon-active morphic-avatar text-indigo-700"
              : isLocked
                ? "border border-slate-200 bg-slate-100 text-slate-400"
                : "border border-slate-200 bg-white text-slate-500 group-hover:text-slate-700"
          }`;

          if (isLocked) {
            return (
              <div key={item.label} className={shellClass} title="Subscribe to unlock Messages" aria-disabled="true">
                <span className={iconClass}>
                  <SidebarIcon name="lock" />
                </span>
                <span className="hidden text-left lg:block">{item.label}</span>
              </div>
            );
          }

          return (
            <Link key={item.label} href={item.href} className={shellClass} title={item.label}>
              <span className={iconClass}>
                <SidebarIcon name={item.icon} />
              </span>
              <span className="hidden text-left lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="dashboard-logout-card morphic-card-inset mt-6 hidden rounded-2xl p-4 lg:block">
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
