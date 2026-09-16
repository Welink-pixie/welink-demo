"use client";

// components/network/NetworkMap.tsx

import type { Company } from "./networkData";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type NetworkMapProps = {
  selectedCompanyId?: string;
  onSelectCompany?: (companyId: string) => void;
  mapHref?: string;
  extraCompanies?: Company[];
};

type AppTheme = "classic" | "sage" | "forest" | "graham" | "graham-signature";

type NodeStyle = {
  shell: string;
  core: string;
  ring: string;
};

type ProjectedPoint = {
  left: number;
  top: number;
  depth: number;
  scale: number;
  opacity: number;
};

type Vec3 = {
  x: number;
  y: number;
  z: number;
};

type DragOffset = {
  x: number;
  y: number;
};

type DragState = {
  id: string;
  startClientX: number;
  startClientY: number;
  startOffsetX: number;
  startOffsetY: number;
  moved: boolean;
};

const companyCoordinates: Record<string, { lat: number; lon: number }> = {
  demacco: { lat: 8, lon: 8 },
  northline: { lat: 42, lon: -80 },
  healthfirst: { lat: 38, lon: 65 },
  futureflow: { lat: -30, lon: -130 },
  vertex: { lat: -25, lon: 120 },
};

const nodeStylesByTheme: Record<AppTheme, Record<string, NodeStyle>> = {
  classic: {
    demacco: {
      shell:
        "border-sky-300/90 bg-[linear-gradient(140deg,#eff6ff_0%,#dbeafe_28%,#ffffff_55%,#bfdbfe_78%,#eff6ff_100%)] bg-[length:220%_220%] shadow-sky-200/80 animate-superconnector-shimmer",
      core: "bg-[linear-gradient(120deg,#0ea5e9_0%,#2563eb_42%,#60a5fa_72%,#0ea5e9_100%)] bg-[length:220%_220%] animate-superconnector-shimmer",
      ring: "bg-sky-300/30",
    },
    northline: {
      shell: "border-cyan-200/90 bg-[linear-gradient(150deg,#ecfeff_0%,#cffafe_45%,#f8fafc_100%)] shadow-cyan-100/80",
      core: "bg-[linear-gradient(135deg,#06b6d4_0%,#0891b2_100%)]",
      ring: "bg-cyan-200/40",
    },
    healthfirst: {
      shell: "border-emerald-200/90 bg-[linear-gradient(150deg,#ecfdf5_0%,#d1fae5_45%,#f8fafc_100%)] shadow-emerald-100/80",
      core: "bg-[linear-gradient(135deg,#10b981_0%,#059669_100%)]",
      ring: "bg-emerald-200/40",
    },
    futureflow: {
      shell: "border-violet-200/90 bg-[linear-gradient(150deg,#f5f3ff_0%,#ede9fe_45%,#f8fafc_100%)] shadow-violet-100/80",
      core: "bg-[linear-gradient(135deg,#8b5cf6_0%,#7c3aed_100%)]",
      ring: "bg-violet-200/40",
    },
    vertex: {
      shell: "border-amber-200/90 bg-[linear-gradient(150deg,#fffbeb_0%,#fef3c7_45%,#f8fafc_100%)] shadow-amber-100/80",
      core: "bg-[linear-gradient(135deg,#f59e0b_0%,#d97706_100%)]",
      ring: "bg-amber-200/40",
    },
  },
  sage: {
    demacco: {
      shell:
        "border-[#c8a25a]/80 bg-[linear-gradient(145deg,#f7efe0_0%,#efdfc1_32%,#fffaf0_62%,#e7d3aa_100%)] bg-[length:220%_220%] shadow-[#c8a25a]/40 animate-superconnector-shimmer",
      core: "bg-[linear-gradient(120deg,#c8a25a_0%,#b88d45_44%,#d5b877_78%,#c8a25a_100%)] bg-[length:220%_220%] animate-superconnector-shimmer",
      ring: "bg-[#c8a25a]/30",
    },
    northline: {
      shell: "border-[#d9d4c7] bg-[linear-gradient(150deg,#f9f4e9_0%,#efe5d1_45%,#faf7f0_100%)] shadow-[#d9d4c7]/60",
      core: "bg-[linear-gradient(135deg,#487a67_0%,#2f5f4c_100%)]",
      ring: "bg-[#5c8a79]/30",
    },
    healthfirst: {
      shell: "border-[#c8e0c9] bg-[linear-gradient(150deg,#f0f8f1_0%,#deecdf_44%,#f9fbf8_100%)] shadow-[#bfd9c0]/60",
      core: "bg-[linear-gradient(135deg,#2e7d32_0%,#256b2a_100%)]",
      ring: "bg-[#2e7d32]/30",
    },
    futureflow: {
      shell: "border-[#d6ccbb] bg-[linear-gradient(150deg,#f4eee3_0%,#e8decd_45%,#fbf8f2_100%)] shadow-[#d9d4c7]/60",
      core: "bg-[linear-gradient(135deg,#8a7a57_0%,#6f6246_100%)]",
      ring: "bg-[#8a7a57]/28",
    },
    vertex: {
      shell: "border-[#e3d2a6] bg-[linear-gradient(150deg,#fcf6ea_0%,#f2e4c6_45%,#fbf8f0_100%)] shadow-[#e3d2a6]/55",
      core: "bg-[linear-gradient(135deg,#c8a25a_0%,#a97f35_100%)]",
      ring: "bg-[#c8a25a]/35",
    },
  },
  forest: {
    demacco: {
      shell:
        "border-[#6c9a79]/80 bg-[linear-gradient(145deg,#edf7ef_0%,#d5ebda_34%,#f7fcf8_66%,#c4dfcb_100%)] bg-[length:220%_220%] shadow-[#7da989]/40 animate-superconnector-shimmer",
      core: "bg-[linear-gradient(120deg,#2f6f55_0%,#275e49_42%,#4f8f73_74%,#2f6f55_100%)] bg-[length:220%_220%] animate-superconnector-shimmer",
      ring: "bg-[#5f9278]/30",
    },
    northline: {
      shell: "border-[#c7ddcd] bg-[linear-gradient(150deg,#f2faf3_0%,#dbeee0_45%,#f9fdf9_100%)] shadow-[#c7ddcd]/60",
      core: "bg-[linear-gradient(135deg,#2f6f55_0%,#23533f_100%)]",
      ring: "bg-[#4d8168]/30",
    },
    healthfirst: {
      shell: "border-[#b8d7bf] bg-[linear-gradient(150deg,#eff8f1_0%,#d7ebdc_45%,#f9fcf9_100%)] shadow-[#b8d7bf]/60",
      core: "bg-[linear-gradient(135deg,#1f7a4e_0%,#19633f_100%)]",
      ring: "bg-[#1f7a4e]/30",
    },
    futureflow: {
      shell: "border-[#cedbd1] bg-[linear-gradient(150deg,#f1f7f3_0%,#e0ece3_45%,#fafcfb_100%)] shadow-[#c9dccf]/60",
      core: "bg-[linear-gradient(135deg,#527966_0%,#3f6252_100%)]",
      ring: "bg-[#527966]/28",
    },
    vertex: {
      shell: "border-[#8fb39b] bg-[linear-gradient(150deg,#f1f8f3_0%,#dcece1_45%,#f9fcfa_100%)] shadow-[#9fc4af]/55",
      core: "bg-[linear-gradient(135deg,#3f7f62_0%,#2f6f55_100%)]",
      ring: "bg-[#3f7f62]/35",
    },
  },
  graham: {
    demacco: {
      shell:
        "border-[#7b9d7e]/80 bg-[linear-gradient(145deg,#f0f4ed_0%,#e0ecd9_32%,#faf9f6_62%,#d9e5ce_100%)] bg-[length:220%_220%] shadow-[#8fa88f]/40 animate-superconnector-shimmer",
      core: "bg-[linear-gradient(120deg,#6b8f71_0%,#5a7f67_44%,#7ba589_78%,#6b8f71_100%)] bg-[length:220%_220%] animate-superconnector-shimmer",
      ring: "bg-[#6b8f71]/30",
    },
    northline: {
      shell: "border-[#d5cec2] bg-[linear-gradient(150deg,#f8f5f0_0%,#f0e8de_45%,#faf7f4_100%)] shadow-[#d5cec2]/60",
      core: "bg-[linear-gradient(135deg,#5a7f67_0%,#447154_100%)]",
      ring: "bg-[#6b8f71]/30",
    },
    healthfirst: {
      shell: "border-[#d0dcd2] bg-[linear-gradient(150deg,#f2f8f4_0%,#e5f0e6_45%,#fafcfb_100%)] shadow-[#d0dcd2]/60",
      core: "bg-[linear-gradient(135deg,#4a7557_0%,#3d6248_100%)]",
      ring: "bg-[#5a7f67]/30",
    },
    futureflow: {
      shell: "border-[#d9d2c7] bg-[linear-gradient(150deg,#f4f1ed_0%,#eae3d6_45%,#fbfbf8_100%)] shadow-[#d9d2c7]/60",
      core: "bg-[linear-gradient(135deg,#7a8f79_0%,#68796a_100%)]",
      ring: "bg-[#7a8f79]/28",
    },
    vertex: {
      shell: "border-[#dcd5cb] bg-[linear-gradient(150deg,#f6f3f0_0%,#ede8de_45%,#fbfaf8_100%)] shadow-[#dcd5cb]/55",
      core: "bg-[linear-gradient(135deg,#6b8f71_0%,#5a7f67_100%)]",
      ring: "bg-[#6b8f71]/35",
    },
  },
  "graham-signature": {
    demacco: {
      shell:
        "border-[#7b9d7e]/80 bg-[linear-gradient(145deg,#f0f4ed_0%,#e0ecd9_32%,#faf9f6_62%,#d9e5ce_100%)] bg-[length:220%_220%] shadow-[#8fa88f]/40 animate-superconnector-shimmer",
      core: "bg-[linear-gradient(120deg,#6b8f71_0%,#5a7f67_44%,#7ba589_78%,#6b8f71_100%)] bg-[length:220%_220%] animate-superconnector-shimmer",
      ring: "bg-[#6b8f71]/30",
    },
    northline: {
      shell: "border-[#d5cec2] bg-[linear-gradient(150deg,#f8f5f0_0%,#f0e8de_45%,#faf7f4_100%)] shadow-[#d5cec2]/60",
      core: "bg-[linear-gradient(135deg,#5a7f67_0%,#447154_100%)]",
      ring: "bg-[#6b8f71]/30",
    },
    healthfirst: {
      shell: "border-[#d0dcd2] bg-[linear-gradient(150deg,#f2f8f4_0%,#e5f0e6_45%,#fafcfb_100%)] shadow-[#d0dcd2]/60",
      core: "bg-[linear-gradient(135deg,#4a7557_0%,#3d6248_100%)]",
      ring: "bg-[#5a7f67]/30",
    },
    futureflow: {
      shell: "border-[#d9d2c7] bg-[linear-gradient(150deg,#f4f1ed_0%,#eae3d6_45%,#fbfbf8_100%)] shadow-[#d9d2c7]/60",
      core: "bg-[linear-gradient(135deg,#7a8f79_0%,#68796a_100%)]",
      ring: "bg-[#7a8f79]/28",
    },
    vertex: {
      shell: "border-[#dcd5cb] bg-[linear-gradient(150deg,#f6f3f0_0%,#ede8de_45%,#fbfaf8_100%)] shadow-[#dcd5cb]/55",
      core: "bg-[linear-gradient(135deg,#6b8f71_0%,#5a7f67_100%)]",
      ring: "bg-[#6b8f71]/35",
    },
  },
};

const ambientDots = Array.from({ length: 28 }, (_, index) => {
  const lat = -65 + ((index * 23) % 130);
  const lon = -180 + ((index * 47) % 360);

  return { lat, lon };
});

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Browsers round inline style numbers when parsing them back out; pre-rounding keeps SSR and client markup byte-identical.
function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

// Fixed range for sizing/coloring nodes by fit score, independent of any particular dataset.
const fitScoreBounds = { min: 50, max: 99 };

function fitScaleForScore(fitScore: number): number {
  const span = Math.max(fitScoreBounds.max - fitScoreBounds.min, 1);
  return clamp((fitScore - fitScoreBounds.min) / span, 0, 1);
}

// Deterministic placement for companies without a hardcoded lat/lon (e.g. live KeepTabz search results).
function fallbackCoordinatesForId(id: string): { lat: number; lon: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return {
    lat: (hash % 120) - 60,
    lon: ((hash >> 8) % 340) - 170,
  };
}

function latLonToVec3(lat: number, lon: number): Vec3 {
  const latRad = toRadians(lat);
  const lonRad = toRadians(lon);

  return {
    x: Math.cos(latRad) * Math.cos(lonRad),
    y: Math.sin(latRad),
    z: Math.cos(latRad) * Math.sin(lonRad),
  };
}

function rotateY(point: Vec3, degrees: number): Vec3 {
  const angle = toRadians(degrees);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: point.x * cos - point.z * sin,
    y: point.y,
    z: point.x * sin + point.z * cos,
  };
}

function rotateX(point: Vec3, degrees: number): Vec3 {
  const angle = toRadians(degrees);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos,
  };
}

function projectToSurface(point: Vec3, isMobile: boolean): ProjectedPoint {
  const radiusX = isMobile ? 31 : 35;
  const radiusY = isMobile ? 24 : 28;
  const centerX = 50;
  const centerY = 50;
  const depth = (point.z + 1) / 2;

  return {
    left: centerX + point.x * radiusX,
    top: centerY + point.y * radiusY,
    depth,
    scale: 0.94 + depth * 0.12,
    opacity: 0.72 + depth * 0.28,
  };
}

function CompanyNode({
  company,
  selected,
  position,
  theme,
  nodeStyles,
  onNodeClick,
  onNodeDoubleClick,
  onNodePointerDown,
  isDragging,
}: {
  company: Company;
  selected?: boolean;
  position: ProjectedPoint;
  theme: AppTheme;
  nodeStyles: Record<string, NodeStyle>;
  onNodeClick?: (companyId: string) => void;
  onNodeDoubleClick?: (companyId: string) => void;
  onNodePointerDown?: (companyId: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  isDragging?: boolean;
}) {
  const fitScale = fitScaleForScore(company.fitScore);
  const isTopFitScore = company.fitScore >= fitScoreBounds.max;
  const topFitBoost = isTopFitScore ? 1.1 : 1;
  const nodeSize = (80 + fitScale * 32) * topFitBoost;
  const nodeSizeLg = (112 + fitScale * 32) * topFitBoost;
  const coreSize = (36 + fitScale * 12) * topFitBoost;
  const coreSizeLg = (44 + fitScale * 12) * topFitBoost;
  const nodeSizeStyle = {
    "--node-size": `${nodeSize}px`,
    "--node-size-lg": `${nodeSizeLg}px`,
    "--node-core-size": `${coreSize}px`,
    "--node-core-size-lg": `${coreSizeLg}px`,
  } as React.CSSProperties;
  const nodeStyle = nodeStyles[company.id] ?? {
    shell: "border-slate-200 bg-white shadow-slate-100",
    core: "bg-slate-900",
    ring: "bg-slate-200/30",
  };
  const selectedRingClass = theme === "sage" ? "ring-[#c8a25a]" : theme === "graham" || theme === "graham-signature" ? "ring-[#6b8f71]" : "ring-indigo-500";
  const initials = company.name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const shortName = company.name.split(" ")[0];

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onNodeClick?.(company.id);
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        onNodeDoubleClick?.(company.id);
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        onNodePointerDown?.(company.id, event);
      }}
      className={`
        absolute
        -translate-x-1/2
        -translate-y-1/2
        border
        rounded-full
        shadow-lg
        transition
        duration-200
        hover:scale-[1.04]
        hover:shadow-2xl
        touch-none
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
        h-[var(--node-size)]
        w-[var(--node-size)]
        lg:h-[var(--node-size-lg)]
        lg:w-[var(--node-size-lg)]
        ${nodeStyle.shell}
        ${selected ? `ring-2 ${selectedRingClass} ring-offset-2 shadow-2xl` : ""}
      `}
      style={{
        ...nodeSizeStyle,
        left: `${round4(position.left)}%`,
        top: `${round4(position.top)}%`,
        transform: `translate(-50%, -50%) scale(${round4(position.scale)})`,
        opacity: round4(position.opacity),
        zIndex: Math.round(position.depth * 40) + Math.round(fitScale * 10),
      }}
      aria-label={company.name}
    >
      <span
        className={`pointer-events-none absolute inset-[8%] rounded-full blur-sm ${nodeStyle.ring}`}
        aria-hidden="true"
      />

      <div className="flex flex-col items-center justify-center">
        <div
          className={`
            flex items-center justify-center rounded-full text-sm font-bold text-white
            ${selected && !isTopFitScore ? "bg-indigo-600" : nodeStyle.core}
            h-[var(--node-core-size)]
            w-[var(--node-core-size)]
            lg:h-[var(--node-core-size-lg)]
            lg:w-[var(--node-core-size-lg)]
          `}
        >
          {initials}
        </div>

        <p className="mt-1.5 max-w-[90%] truncate text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-600 lg:text-[10px]">
          {shortName}
        </p>
        <p className="text-[10px] font-semibold text-slate-700/90 lg:text-[11px]">{company.fitScore}%</p>
      </div>
    </button>
  );
}

export default function NetworkMap({ selectedCompanyId, onSelectCompany, mapHref, extraCompanies }: NetworkMapProps) {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffsets, setDragOffsets] = useState<Record<string, DragOffset>>({});
  const [showHint, setShowHint] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>("classic");

  useEffect(() => {
    const readTheme = () => {
      const themeValue = document.documentElement.getAttribute("data-theme");
      if (themeValue === "classic" || themeValue === "sage" || themeValue === "forest" || themeValue === "graham" || themeValue === "graham-signature") {
        setCurrentTheme(themeValue);
      } else {
        setCurrentTheme("classic");
      }
    };

    readTheme();

    const observer = new MutationObserver(readTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mediaQuery.matches);
    onChange();
    mediaQuery.addEventListener("change", onChange);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const tick = (time: number) => {
      setRotationDeg((time * 0.012) % 360);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowHint(false);
    }, 3800);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const allCompanies = useMemo(() => extraCompanies ?? [], [extraCompanies]);

  const positions = useMemo(() => {
    const map: Record<string, ProjectedPoint> = {};

    for (const company of allCompanies) {
      const coords = companyCoordinates[company.id] ?? fallbackCoordinatesForId(company.id);
      const basePoint = latLonToVec3(coords.lat, coords.lon);
      const rotatedY = rotateY(basePoint, rotationDeg);
      const tilted = rotateX(rotatedY, -14);
      const projected = projectToSurface(tilted, isMobile);
      const dragOffset = dragOffsets[company.id] ?? { x: 0, y: 0 };

      map[company.id] = {
        ...projected,
        left: clamp(projected.left + dragOffset.x, 8, 92),
        top: clamp(projected.top + dragOffset.y, 8, 92),
      };
    }

    // The globe projection can place two nodes near-identical 2D coordinates (e.g. opposite
    // hemispheres), so nudge any that render too close apart to a guaranteed minimum distance.
    const ids = Object.keys(map);
    const minDistance = 16;
    for (let pass = 0; pass < 4; pass += 1) {
      for (let i = 0; i < ids.length; i += 1) {
        for (let j = i + 1; j < ids.length; j += 1) {
          const a = map[ids[i]];
          const b = map[ids[j]];
          const dx = b.left - a.left;
          const dy = b.top - a.top;
          const distance = Math.hypot(dx, dy) || 0.0001;

          if (distance < minDistance) {
            const push = (minDistance - distance) / 2;
            const nx = dx / distance;
            const ny = dy / distance;
            a.left = clamp(a.left - nx * push, 8, 92);
            a.top = clamp(a.top - ny * push, 8, 92);
            b.left = clamp(b.left + nx * push, 8, 92);
            b.top = clamp(b.top + ny * push, 8, 92);
          }
        }
      }
    }

    return map;
  }, [allCompanies, dragOffsets, isMobile, rotationDeg]);

  const activeNodeStyles = nodeStylesByTheme[currentTheme] ?? nodeStylesByTheme.classic;
  const ambientDotClass =
    currentTheme === "sage" ? "bg-[#c8a25a]" : currentTheme === "forest" ? "bg-[#cba85a]" : currentTheme === "graham" || currentTheme === "graham-signature" ? "bg-[#b9a06a]" : "bg-indigo-300";
  const mapBackgroundClass =
    currentTheme === "sage"
      ? "bg-[radial-gradient(circle_at_50%_50%,#fbf7ef_0%,#f2e8d4_48%,#fffdf8_100%)]"
      : currentTheme === "forest"
        ? "bg-[radial-gradient(circle_at_50%_50%,#1b3d2a_0%,#2a5a42_48%,#0f2818_100%)]"
        : currentTheme === "graham" || currentTheme === "graham-signature"
          ? "bg-[radial-gradient(circle_at_50%_50%,#1f4e37_0%,#2e6d4e_48%,#153825_100%)]"
          : "bg-[radial-gradient(circle_at_50%_50%,#f8fafc_0%,#eef2ff_48%,#ffffff_100%)]";

  const projectedAmbientDots = useMemo(
    () =>
      ambientDots.map((dot) => {
        const basePoint = latLonToVec3(dot.lat, dot.lon);
        const rotatedY = rotateY(basePoint, rotationDeg * 0.9);
        const tilted = rotateX(rotatedY, -14);
        return projectToSurface(tilted, isMobile);
      }),
    [isMobile, rotationDeg],
  );

  const handleOpenNetwork = () => {
    if (!mapHref) return;
    router.push(mapHref);
  };

  const handleNodePointerDown = (
    companyId: string,
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (event.button !== 0) return;

    const existingOffset = dragOffsets[companyId] ?? { x: 0, y: 0 };
    dragRef.current = {
      id: companyId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startOffsetX: existingOffset.x,
      startOffsetY: existingOffset.y,
      moved: false,
    };
    setDraggingId(companyId);
  };

  const handleNodeClick = (companyId: string) => {
    if (suppressClickRef.current) {
      return;
    }

    onSelectCompany?.(companyId);
  };

  const handleNodeDoubleClick = (companyId: string) => {
    onSelectCompany?.(companyId);
    handleOpenNetwork();
  };

  const handleResetLayout = () => {
    setDragOffsets({});
  };

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragRef.current;
      const mapRect = mapRef.current?.getBoundingClientRect();

      if (!dragState || !mapRect) {
        return;
      }

      const deltaX = event.clientX - dragState.startClientX;
      const deltaY = event.clientY - dragState.startClientY;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        dragState.moved = true;
      }

      const deltaPercentX = (deltaX / mapRect.width) * 100;
      const deltaPercentY = (deltaY / mapRect.height) * 100;

      setDragOffsets((previous) => ({
        ...previous,
        [dragState.id]: {
          x: clamp(dragState.startOffsetX + deltaPercentX, -25, 25),
          y: clamp(dragState.startOffsetY + deltaPercentY, -25, 25),
        },
      }));
    };

    const handlePointerUp = () => {
      const dragState = dragRef.current;

      if (!dragState) {
        return;
      }

      if (dragState.moved) {
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 140);
      }

      dragRef.current = null;
      setDraggingId(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className={`relative h-[560px] w-full overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm ${
        draggingId ? "cursor-grabbing" : ""
      }`}
    >
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
        <p
          className={`rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur transition duration-300 ${
            showHint ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          Drag to move, tap to select, double-click to open network
        </p>
      </div>

      <button
        type="button"
        onClick={handleResetLayout}
        className="absolute right-4 top-4 z-20 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur hover:bg-white"
      >
        Reset Layout
      </button>

      <div className={`absolute inset-0 ${mapBackgroundClass}`} />
      <div className="absolute left-1/2 top-1/2 h-[68%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/70" />
      <div className="absolute left-1/2 top-1/2 h-[68%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/40" style={{ transform: "translate(-50%, -50%) rotate(28deg)" }} />
      <div className="absolute left-1/2 top-1/2 h-[68%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/40" style={{ transform: "translate(-50%, -50%) rotate(-28deg)" }} />

      <div className="absolute inset-0">
        {projectedAmbientDots.map((dot, index) => (
          <span
            key={`dot-${index}`}
            className={`pointer-events-none absolute h-1.5 w-1.5 rounded-full ${ambientDotClass}`}
            style={{
              left: `${round4(dot.left)}%`,
              top: `${round4(dot.top)}%`,
              opacity: round4(dot.opacity * 0.42),
              transform: `translate(-50%, -50%) scale(${round4(0.55 + dot.depth * 0.65)})`,
            }}
          />
        ))}

        {allCompanies.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-slate-500">No companies yet</p>
            <p className="mt-1 max-w-[220px] text-xs text-slate-400">
              Search a company above to add it to the map.
            </p>
          </div>
        )}

        {allCompanies.map((company) => (
          <CompanyNode
            key={company.id}
            company={company}
            selected={selectedCompanyId === company.id}
            position={positions[company.id]}
            theme={currentTheme}
            nodeStyles={activeNodeStyles}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
            onNodePointerDown={handleNodePointerDown}
            isDragging={draggingId === company.id}
          />
        ))}
      </div>
    </div>
  );
}