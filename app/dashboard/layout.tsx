import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { AUTH_COOKIE_NAME, AUTH_USERNAME_COOKIE_NAME } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  const usernameCookie = cookieStore.get(AUTH_USERNAME_COOKIE_NAME);

  if (!sessionCookie?.value) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#f3f5fb] p-3 lg:p-4">
      <div className="mx-auto max-w-[1500px] rounded-3xl border border-slate-200/70 bg-white shadow-sm">
        <div className="grid min-h-[92vh] grid-cols-1 lg:grid-cols-[80px_1fr]">
          <DashboardSidebar username={usernameCookie?.value ?? "User"} />
          <div className="animate-fade-in-scale">{children}</div>
        </div>
      </div>
    </main>
  );
}
