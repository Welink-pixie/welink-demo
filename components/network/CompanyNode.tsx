"use client";

// components/network/CompanyNode.tsx

import type { Company } from "./networkData";

type CompanyNodeProps = {
  company: Company;
  selected?: boolean;
  onSelect?: (companyId: string) => void;
};

export default function CompanyNode({ company, selected, onSelect }: CompanyNodeProps) {
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
        clipPath:
          "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
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

        <h3 className="text-sm font-semibold text-slate-950">
          {company.name}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {company.type}
        </p>

        <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {company.fitScore}% Fit
        </div>
      </div>
    </button>
  );
}