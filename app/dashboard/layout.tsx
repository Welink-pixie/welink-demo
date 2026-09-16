import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileLogoutCard from "@/components/dashboard/MobileLogoutCard";
import { AUTH_COOKIE_NAME, AUTH_SUBSCRIPTION_COOKIE_NAME, AUTH_USERNAME_COOKIE_NAME } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  const usernameCookie = cookieStore.get(AUTH_USERNAME_COOKIE_NAME);
  const subscriptionCookie = cookieStore.get(AUTH_SUBSCRIPTION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    redirect("/");
  }

  const username = usernameCookie?.value ?? "User";
  const isSubscribed = subscriptionCookie?.value === "active";

  return (
    <main className="dashboard-main-shell morphic-shell min-h-screen p-3 lg:p-4">
      <div className="dashboard-frame morphic-card mx-auto max-w-[1500px] rounded-3xl">
        <div className="grid min-h-[92vh] grid-cols-1 sm:grid-cols-[252px_1fr]">
          <div className="dashboard-left-encase">
            <DashboardSidebar username={username} isSubscribed={isSubscribed} />
          </div>
          <div className="animate-fade-in-scale">{children}</div>
          <div className="px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
            <MobileLogoutCard username={username} />
          </div>
        </div>
      </div>
    </main>
  );
}
