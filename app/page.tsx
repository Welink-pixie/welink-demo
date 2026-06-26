import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginHero from "@/components/marketing/LoginHero";
import LoginForm from "@/components/auth/LoginForm";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export default async function Home() {
  const sessionCookie = (await cookies()).get(AUTH_COOKIE_NAME);

  if (sessionCookie?.value) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <LoginHero />
      <LoginForm />
    </main>
  );
}