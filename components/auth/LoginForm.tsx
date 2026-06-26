"use client";

// components/auth/LoginForm.tsx

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeLogo from "@/components/ui/ThemeLogo";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("classic");

  useEffect(() => {
    const stored = localStorage.getItem("app-theme") || "classic";
    setCurrentTheme(stored);
  }, []);

  const switchTheme = (theme: "classic" | "aurora" | "sage") => {
    localStorage.setItem("app-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    setCurrentTheme(theme);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to sign in.");
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">

        {/* Logo */}

        <div className="mb-8 flex items-center gap-4">
          <ThemeLogo
            className="h-14 w-auto shrink-0 object-contain"
            sageClassName="h-20 w-auto shrink-0 object-contain lg:h-24"
          />

          <h1 className="text-3xl font-bold leading-none text-slate-900">
            WeLink
          </h1>
        </div>

        {/* Heading */}

        <h2 className="text-3xl font-bold text-slate-900">
          Welcome Back
        </h2>

        <p className="mt-2 text-slate-500">
          Sign in to access your network.
        </p>

        {/* Form */}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="
                mt-2
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-slate-900
                placeholder:text-slate-500
                caret-slate-900
                outline-none
                transition
                focus:border-violet-500
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="
                mt-2
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-slate-900
                placeholder:text-slate-500
                caret-slate-900
                outline-none
                transition
                focus:border-violet-500
              "
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full
              rounded-2xl
              bg-slate-950
              py-3
              font-semibold
              text-white
              transition
              hover:bg-slate-800
              disabled:cursor-not-allowed
              disabled:bg-slate-400
            "
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

          {error ? (
            <p className="text-sm font-medium text-rose-600">{error}</p>
          ) : null}

        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-500">
            New to WeLink?
          </p>

          <button className="mt-2 font-semibold text-violet-600 hover:text-violet-700">
            Request Access
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center mb-4">
            Demo Theme
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => switchTheme("classic")}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                currentTheme === "classic"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Classic
            </button>
            <button
              onClick={() => switchTheme("aurora")}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                currentTheme === "aurora"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Aurora
            </button>
            <button
              onClick={() => switchTheme("sage")}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                currentTheme === "sage"
                  ? "bg-amber-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Sage
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}