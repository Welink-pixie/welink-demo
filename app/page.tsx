import LoginHero from "@/components/marketing/LoginHero";
import LoginForm from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <LoginHero />
      <LoginForm />
    </main>
  );
}