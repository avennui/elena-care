"use client";

export default function NavBar({ tab, onTab, isElena }) {
  const tabs = isElena
    ? [
        { id: "feed", label: "UPDATES" },
        { id: "recovery", label: "RECOVERY" },
        { id: "advisor", label: "ASK" },
      ]
    : [
        { id: "feed", label: "FEED" },
        { id: "tasks", label: "TASKS" },
        { id: "advisor", label: "ADVISOR" },
      ];

  return (
    <div className="border-t border-black/8 bg-bg safe-bottom flex items-center" style={{ height: "44px" }}>
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onTab(t.id)}
          className={`flex-1 h-full flex items-center justify-center text-[12px] tracking-[0.08em] transition-colors ${
            tab === t.id ? "text-accent font-medium" : "text-t3 font-light hover:text-t2"
          }`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
