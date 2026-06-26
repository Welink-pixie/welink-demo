"use client";

// components/network/NetworkMap.tsx

import { companies } from "./networkData";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const connections = [
  ["demacco", "northline"],
  ["demacco", "healthfirst"],
  ["demacco", "futureflow"],
  ["demacco", "vertex"],
];

type NetworkMapProps = {
  selectedCompanyId?: string;
  onSelectCompany?: (companyId: string) => void;
  mapHref?: string;
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

const nodeStyles: Record<
  string,
  {
    shell: string;
    core: string;
    ring: string;
  }
> = {
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
  onNodeClick,
  onNodeDoubleClick,
  onNodePointerDown,
  isDragging,
}: {
  company: (typeof companies)[number];
  selected?: boolean;
  position: ProjectedPoint;
  onNodeClick?: (companyId: string) => void;
  onNodeDoubleClick?: (companyId: string) => void;
  onNodePointerDown?: (companyId: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  isDragging?: boolean;
}) {
  const nodeStyle = nodeStyles[company.id] ?? {
    shell: "border-slate-200 bg-white shadow-slate-100",
    core: "bg-slate-900",
    ring: "bg-slate-200/30",
  };
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
        ${
          company.featured
            ? `h-28 w-28 lg:h-36 lg:w-36 ${nodeStyle.shell}`
            : `h-20 w-20 lg:h-28 lg:w-28 ${nodeStyle.shell}`
        }
        ${selected ? "ring-2 ring-indigo-500 ring-offset-2 shadow-2xl" : ""}
      `}
      style={{
        left: `${position.left}%`,
        top: `${position.top}%`,
        transform: `translate(-50%, -50%) scale(${position.scale})`,
        opacity: position.opacity,
        zIndex: Math.round(position.depth * 40) + (company.featured ? 10 : 0),
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
            ${selected && !company.featured ? "bg-indigo-600" : nodeStyle.core}
            ${company.featured ? "h-12 w-12 lg:h-14 lg:w-14" : "h-9 w-9 lg:h-11 lg:w-11"}
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

export default function NetworkMap({ selectedCompanyId, onSelectCompany, mapHref }: NetworkMapProps) {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffsets, setDragOffsets] = useState<Record<string, DragOffset>>({});
  const [showHint, setShowHint] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
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

  const positions = useMemo(() => {
    const map: Record<string, ProjectedPoint> = {};

    for (const company of companies) {
      const coords = companyCoordinates[company.id] ?? { lat: 0, lon: 0 };
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

    return map;
  }, [dragOffsets, isMobile, rotationDeg]);

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

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#f8fafc_0%,#eef2ff_48%,#ffffff_100%)]" />
      <div className="absolute left-1/2 top-1/2 h-[68%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/70" />
      <div className="absolute left-1/2 top-1/2 h-[68%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/40" style={{ transform: "translate(-50%, -50%) rotate(28deg)" }} />
      <div className="absolute left-1/2 top-1/2 h-[68%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/40" style={{ transform: "translate(-50%, -50%) rotate(-28deg)" }} />

      <div className="absolute inset-0">
        {isClientReady &&
          projectedAmbientDots.map((dot, index) => (
            <span
              key={`dot-${index}`}
              className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-indigo-300"
              style={{
                left: `${dot.left}%`,
                top: `${dot.top}%`,
                opacity: dot.opacity * 0.42,
                transform: `translate(-50%, -50%) scale(${0.55 + dot.depth * 0.65})`,
              }}
            />
          ))}

        <svg className="absolute inset-0 h-full w-full pointer-events-none">
          {connections.map(([from, to]) => {
            const a = positions[from];
            const b = positions[to];

            if (!a || !b) {
              return null;
            }

            return (
              <line
                key={`${from}-${to}`}
                x1={`${a.left}%`}
                y1={`${a.top}%`}
                x2={`${b.left}%`}
                y2={`${b.top}%`}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="5 8"
                opacity={0.25 + ((a.depth + b.depth) / 2) * 0.55}
              />
            );
          })}
        </svg>

        {companies.map((company) => (
          <CompanyNode
            key={company.id}
            company={company}
            selected={selectedCompanyId === company.id}
            position={positions[company.id]}
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