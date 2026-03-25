"use client";

const PHASES = [
  { key: "hospital", label: "Hospital" },
  { key: "surgery", label: "Surgery" },
  { key: "mobility", label: "Mobility" },
  { key: "discharge", label: "Discharge" },
  { key: "rehab", label: "Rehab" },
];

export default function PhaseTracker({ phase, onUpdate }) {
  const idx = PHASES.findIndex((p) => p.key === phase);

  return (
    <div className="px-4 py-2.5 border-b border-line flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {PHASES.map((p, i) => {
        const active = i === idx;
        const past = i < idx;
        return (
          <button
            key={p.key}
            onClick={() => onUpdate(p.key)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
              active
                ? "bg-accent/15 text-accent"
                : past
                ? "text-t3"
                : "text-t3/50"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              active ? "bg-accent" : past ? "bg-t3" : "bg-t3/30"
            }`} />
            {p.label}
            {i < PHASES.length - 1 && (
              <span className={`ml-1 ${past ? "text-t3" : "text-t3/30"}`}>→</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
