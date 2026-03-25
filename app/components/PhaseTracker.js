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
    <div className="px-5 py-3 border-b border-line bg-bg flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {PHASES.map((p, i) => {
        const active = i === idx;
        const past = i < idx;
        return (
          <button key={p.key} onClick={isElena ? undefined : () => onUpdate(p.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium font-body transition-all ${
              active ? "bg-accent/10 text-accent" : past ? "text-t3" : "text-t3/40"
            } ${isElena ? "cursor-default" : "cursor-pointer"}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
              active ? "bg-accent" : past ? "bg-t3" : "bg-t3/25"
            }`} />
            {p.label}
            {i < PHASES.length - 1 && <span className="ml-1 text-line">\u203A</span>}
          </button>
        );
      })}
    </div>
  );
}
