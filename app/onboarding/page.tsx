import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OnboardingFlow from "@/components/auth/OnboardingFlow";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export default async function OnboardingPage() {
  const sessionCookie = (await cookies()).get(AUTH_COOKIE_NAME);

  if (sessionCookie?.value) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <OnboardingFlow />
    </main>
  );
}
