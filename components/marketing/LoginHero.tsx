// components/marketing/LoginHero.tsx

import NetworkMap from "@/components/network/NetworkMap";

export default function LoginHero() {
  return (
    <section className="hidden lg:flex flex-col bg-gradient-to-br from-slate-50 to-white p-12">

      <div className="space-y-10">

      {/* Logo */}
      <div className="flex items-center gap-4">
        <img
          src="/we_link_logo.png"
          alt="WeLink"
          className="h-12 w-auto shrink-0 object-contain"
        />

        <div className="pt-0.5">
          <h1 className="text-3xl font-bold leading-none text-slate-900">
            WeLink
          </h1>
        </div>
      </div>

      {/* Hero Copy */}
      <div className="max-w-2xl">
        <h2 className="text-6xl font-bold tracking-tight text-slate-950">
          Discover Hidden
          <br />
          Business Opportunities.
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
          Connect companies through trusted introductions,
          strategic partnerships, and warm referrals.
          WeLink helps organizations uncover opportunities already
          hiding within their network.
        </p>

        <div className="mt-8 flex gap-8">
          <div>
            <div className="text-3xl font-bold text-slate-900">
              12k+
            </div>

            <div className="text-sm text-slate-500">
              Connections
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold text-slate-900">
              $45M
            </div>

            <div className="text-sm text-slate-500">
              Opportunities
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold text-slate-900">
              92%
            </div>

            <div className="text-sm text-slate-500">
              Match Accuracy
            </div>
          </div>
        </div>
      </div>

      </div>

      {/* Network Preview */}
      <div className="mt-12">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
          <NetworkMap />
        </div>
      </div>

    </section>
  );
}