"use client";

export default function NavBar({ tab, onTab, isElena }) {
  const tabs = isElena
    ? [
        { id: "feed", label: "Updates" },
        { id: "recovery", label: "My Recovery" },
        { id: "advisor", label: "Ask" },
      ]
    : [
        { id: "feed", label: "Feed" },
        { id: "tasks", label: "Tasks" },
        { id: "advisor", label: "Care Advisor" },
      ];

  return (
    <div className="border-t border-line bg-surface px-6 py-2.5 flex items-center justify-center gap-10 safe-bottom">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onTab(t.id)}
          className={`flex items-center gap-2 py-2 text-sm transition-colors ${
            tab === t.id ? "text-accent" : "text-t3 hover:text-t2"
          }`}
          style={{ fontWeight: tab === t.id ? 500 : 400 }}>
          <span className={`w-1 h-1 rounded-full transition-colors flex-shrink-0 ${tab === t.id ? "bg-accent" : "bg-line"}`} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
