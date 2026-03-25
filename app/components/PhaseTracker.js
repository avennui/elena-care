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
  const activePhase = idx >= 0 ? PHASES[idx] : null;

  return (
    <div className="px-5 py-4 border-b border-black/8 bg-bg">
      {activePhase && (
        <p className="text-[28px] font-light uppercase leading-none mb-2" style={{ letterSpacing: "-0.02em" }}>
          {activePhase.label}
        </p>
      )}
      <div className="flex items-center flex-wrap gap-x-1.5">
        {PHASES.map((p, i) => {
          const active = i === idx;
          const past = i < idx;
          return (
            <span key={p.key} className="flex items-center gap-x-1.5">
              <button
                onClick={isElena ? undefined : () => onUpdate(p.key)}
                className={`text-[11px] tracking-[0.04em] uppercase transition-colors ${
                  active ? "text-accent" : past ? "text-t2" : "text-t3"
                } ${!isElena ? "cursor-pointer hover:text-accent" : "cursor-default"}`}
                style={{ fontWeight: active ? 600 : 400 }}>
                {p.label}
              </button>
              {i < PHASES.length - 1 && (
                <span className="text-[11px] text-t3 select-none">→</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
