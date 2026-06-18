"use client";

// components/network/NetworkMap.tsx

import { companies } from "./networkData";

const connections = [
  ["demacco", "northline"],
  ["demacco", "healthfirst"],
  ["demacco", "futureflow"],
  ["demacco", "vertex"],
];

type NetworkMapProps = {
  selectedCompanyId?: string;
  onSelectCompany?: (companyId: string) => void;
};

function CompanyNode({
  company,
  selected,
  onSelect,
}: {
  company: (typeof companies)[number];
  selected?: boolean;
  onSelect?: (companyId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(company.id)}
      className={`
        absolute
        -translate-x-1/2
        -translate-y-1/2
        bg-white
        border
        shadow-lg
        transition
        hover:-translate-y-[55%]
        hover:shadow-2xl
        cursor-pointer
        ${
          company.featured
            ? "w-60 border-violet-300 p-5"
            : "w-44 border-slate-200 p-4"
        }
        ${selected ? "ring-2 ring-indigo-500 ring-offset-2 shadow-2xl" : ""}
      `}
      style={{
        left: company.x,
        top: company.y,
        clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
      }}
    >
      <div className="text-left">
        <div
          className={`
            mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white
            ${selected ? "bg-indigo-600" : company.featured ? "bg-violet-600" : "bg-slate-900"}
          `}
        >
          {company.name.charAt(0)}
        </div>

        <h3 className="text-sm font-semibold text-slate-950">{company.name}</h3>

        <p className="mt-1 text-xs text-slate-500">{company.type}</p>

        <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {company.fitScore}% Fit
        </div>
      </div>
    </button>
  );
}

export default function NetworkMap({ selectedCompanyId, onSelectCompany }: NetworkMapProps) {
  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm">
      <div className="absolute left-10 top-8 z-10">
        <p className="text-sm font-medium text-slate-400">Network Map</p>
        <h2 className="text-2xl font-semibold text-slate-950">
          Strategic Opportunities
        </h2>
      </div>

      <div className="absolute inset-x-0 bottom-0 top-28">
        <svg className="absolute inset-0 h-full w-full pointer-events-none">
          {connections.map(([from, to]) => {
            const a = companies.find((c) => c.id === from)!;
            const b = companies.find((c) => c.id === to)!;

            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="6 8"
              />
            );
          })}
        </svg>

        {companies.map((company) => (
          <CompanyNode
            key={company.id}
            company={company}
            selected={selectedCompanyId === company.id}
            onSelect={onSelectCompany}
          />
        ))}
      </div>
    </div>
  );
}