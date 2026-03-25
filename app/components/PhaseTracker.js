"use client";

const PHASES = [
  { key: "hospital", label: "Hospital" },
  { key: "surgery", label: "Surgery" },
  { key: "mobility", label: "Mobility" },
  { key: "discharge", label: "Discharge" },
  { key: "rehab", label: "Rehab" },
];

export default function PhaseTracker({ phase, onUpdate, isElena }) {
  const idx = PHASES.findIndex((p) => p.key === phase);

  return (
    <div className="px-5 py-3 border-b border-line bg-bg flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {PHASES.map((p, i) => {
        const active = i === idx;
        const past = i < idx;
        return (
          <button key={p.key} onClick={isElena ? undefined : () => onUpdate(p.key)}
            className={`flex items-center gap-1.5 px-2 py-1 text-xs transition-all ${
              active ? "text-accent" : past ? "text-t3" : "text-t3 opacity-40"
            } ${isElena ? "cursor-default" : "cursor-pointer"}`}
            style={{ fontWeight: active ? 500 : 400, letterSpacing: "0.02em" }}>
            <span className={`w-1 h-1 rounded-full flex-shrink-0 transition-colors ${
              active ? "bg-accent" : past ? "bg-t3" : "bg-line"
            }`} />
            {p.label}
            {i < PHASES.length - 1 && <span className="ml-1 text-line">›</span>}
          </button>
        );
      })}
    </div>
  );
}
