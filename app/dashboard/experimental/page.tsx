"use client";

import Link from "next/link";
import { useState } from "react";
import { experimentalProfiles } from "@/components/network/experimentalProfiles";

const PARA_L = "polygon(14% 0%, 100% 0%, 86% 100%, 0% 100%)";
const PARA_R = "polygon(0% 0%, 86% 0%, 100% 100%, 14% 100%)";

type TilePlacement = {
  profileIndex: number;
  clipPath: string;
  left: string;
  top: string;
  width: string;
  height: string;
  backInset?: string;
  imageClassName?: string;
};

const tiles: TilePlacement[] = [
  {
    profileIndex: 0,
    clipPath: PARA_L,
    left: "1%",
    top: "3%",
    width: "30%",
    height: "36%",
    backInset: "-18px",
  },
  {
    profileIndex: 1,
    clipPath: PARA_R,
    left: "66%",
    top: "3%",
    width: "31%",
    height: "37%",
    backInset: "-22px -30px -72px -30px",
  },
  {
    profileIndex: 2,
    clipPath: PARA_L,
    left: "12%",
    top: "61%",
    width: "35%",
    height: "35%",
    backInset: "-22px",
    imageClassName: "object-top",
  },
];

function FlipProfileTile({
  placement,
  isSelected,
  onSelect,
}: {
  placement: TilePlacement;
  isSelected: boolean;
  onSelect: (profileId: string) => void;
}) {
  const profile = experimentalProfiles[placement.profileIndex];

  return (
    <Link
      href={profile.href}
      aria-label={`Open ${profile.name} profile`}
      className={`flip-card absolute block cursor-pointer transition ${
        isSelected ? "ring-2 ring-emerald-300" : ""
      }`}
      onFocus={() => onSelect(profile.id)}
      onClick={(event) => {
        // First click selects the node and reveals its details card.
        if (!isSelected) {
          event.preventDefault();
          onSelect(profile.id);
        }
      }}
      style={{
        left: placement.left,
        top: placement.top,
        width: placement.width,
        height: placement.height,
        zIndex: 5,
      }}
    >
      <div className="flip-card-inner">
        <div
          className="flip-card-face shadow-xl"
          style={{ clipPath: placement.clipPath }}
        >
          <img
            src={profile.image}
            alt={profile.name}
            className={`h-full w-full object-cover ${placement.imageClassName ?? ""}`}
          />
        </div>

        <div
          className="flip-card-face flip-card-back overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 text-slate-900 shadow-xl"
          style={{ inset: placement.backInset ?? "-18px" }}
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="min-h-0 flex-1 overflow-hidden">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                {profile.letter}
              </div>
              <p className="text-2xl font-semibold leading-tight">{profile.name}</p>
              <p className="mt-1 text-sm text-slate-500">{profile.title}</p>
              <p className="text-sm text-slate-500">{profile.city}</p>

              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{profile.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {profile.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 shrink-0 border-t border-slate-200 pt-4">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-xs text-slate-500">Fit Score</p>
                  <p className="text-2xl font-bold text-emerald-600">{profile.fitScore}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Potential Value</p>
                  <p className="text-lg font-semibold text-slate-900">{profile.value}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {profile.contacts.map((contact) => (
                      <img
                        key={contact.name}
                        src={contact.avatar}
                        alt={contact.name}
                        className="inline-block h-6 w-6 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">
                    {profile.contacts.length} contacts
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Open profile
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ExperimentalDashboardPage() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const selectedProfile =
    experimentalProfiles.find((profile) => profile.id === selectedProfileId) ?? null;

  const overlayPositionsByProfileIndex: Record<number, {
    mutual: { left: string; top: string };
    strong: { left: string; top: string };
  }> = {
    0: {
      mutual: { left: "36%", top: "15%" },
      strong: { left: "72%", top: "9%" },
    },
    1: {
      mutual: { left: "33%", top: "18%" },
      strong: { left: "76%", top: "49%" },
    },
    2: {
      mutual: { left: "42%", top: "34%" },
      strong: { left: "72%", top: "24%" },
    },
  };

  const selectedProfileIndex = selectedProfile
    ? experimentalProfiles.findIndex((profile) => profile.id === selectedProfile.id)
    : -1;

  const selectedOverlayPositions =
    selectedProfileIndex >= 0
      ? overlayPositionsByProfileIndex[selectedProfileIndex]
      : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="relative w-full max-w-[1060px] pt-20">
        <img
          src="/we_link_logo.png"
          alt="WeLink"
          className="absolute left-0 top-0 h-10 w-auto object-contain"
        />
        <Link
          href="/dashboard"
          className="absolute right-0 top-0 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          ← Back to Dashboard
        </Link>

        <div className="relative h-[760px] w-full">
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            <line x1="47%" y1="40%" x2="31%" y2="21%" stroke="#d1d5db" strokeWidth="1" />
            <line x1="47%" y1="40%" x2="66%" y2="22%" stroke="#d1d5db" strokeWidth="1" />
            <line x1="47%" y1="40%" x2="30%" y2="61%" stroke="#d1d5db" strokeWidth="1" />
            <circle cx="47%" cy="40%" r="9" fill="white" stroke="#d1d5db" strokeWidth="1.5" />
            <line x1="calc(47% - 5px)" y1="40%" x2="calc(47% + 5px)" y2="40%" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="47%" y1="calc(40% - 5px)" x2="47%" y2="calc(40% + 5px)" stroke="#cbd5e1" strokeWidth="1" />
          </svg>

          {tiles.map((placement) => (
            <FlipProfileTile
              key={placement.profileIndex}
              placement={placement}
              isSelected={selectedProfileId === experimentalProfiles[placement.profileIndex].id}
              onSelect={setSelectedProfileId}
            />
          ))}

          <div
            className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm text-white shadow-lg"
            style={{ left: "45%", top: "0%", zIndex: 30 }}
          >
            ✦
          </div>

          {selectedProfile && selectedOverlayPositions ? (
            <>
              <div
                className="animate-fade-in-scale absolute flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg"
                style={{
                  left: selectedOverlayPositions.mutual.left,
                  top: selectedOverlayPositions.mutual.top,
                  zIndex: 30,
                }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-6 w-6 rounded-full border-2 border-white bg-stone-300"
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">+{selectedProfile.people.length + 2}</span>
                <span className="text-xs font-semibold text-slate-700">Mutual Connections</span>
              </div>

              <div
                className="animate-fade-in-scale absolute flex flex-col gap-2"
                style={{
                  left: selectedOverlayPositions.strong.left,
                  top: selectedOverlayPositions.strong.top,
                  zIndex: 30,
                }}
              >
                <div className="rounded-full border border-emerald-300 bg-emerald-50 px-5 py-1.5 text-sm font-bold text-emerald-600 shadow-sm">
                  Strong Fit {selectedProfile.fitScore}%
                </div>
                <div className="flex h-9 w-20 items-center rounded-full bg-emerald-100 px-1 shadow-inner">
                  <div className="h-7 w-7 rounded-full bg-slate-900 shadow" />
                </div>
              </div>
            </>
          ) : null}

          {selectedProfile ? (
            <div
              className="animate-fade-in-scale absolute flex flex-col rounded-[22px] border border-slate-200 bg-white shadow-xl overflow-y-auto"
              style={{ right: "0%", bottom: "2%", width: "35%", maxHeight: "420px", zIndex: 20, padding: "16px" }}
            >
              <p className="text-sm font-semibold leading-tight text-slate-700">
                Collaboration
                <br />
                Potential
              </p>

              <p className="mt-1.5 text-[11px] text-slate-500">
                {selectedProfile.name} • {selectedProfile.city}
              </p>

              <div className="my-2 flex h-8 items-end gap-0.5">
                {[30, 55, 25, 75, 40, 90, 50, 65, 35].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${
                      i === 5 ? "bg-emerald-500" : i === 7 ? "bg-slate-900" : "bg-slate-300"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-bold text-slate-900">{selectedProfile.fitScore}%</p>
                <span className="text-sm text-emerald-500">▲</span>
              </div>

              <p className="mt-1 text-[10px] text-slate-500">Potential: {selectedProfile.value}</p>

              <p className="mt-1 text-[10px] text-slate-600">{selectedProfile.people.length}+ mutual connections</p>

              <div className="mt-2 space-y-1.5">
                {[
                  {
                    label: `Strategic Alignment`,
                    checked: true,
                  },
                  { label: "Verified", checked: false },
                  { label: "Active", checked: false },
                ].map(({ label, checked }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[8px] ${
                        checked
                          ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                          : "border-slate-200"
                      }`}
                    >
                      {checked ? "✓" : ""}
                    </div>
                    <p className="text-[10px] text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
