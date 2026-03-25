"use client";

export default function NavBar({ tab, onTab }) {
  return (
    <div className="border-t border-line bg-bg px-4 py-2 flex items-center justify-center gap-8">
      <button
        onClick={() => onTab("feed")}
        className={`flex items-center gap-2 py-2 px-3 text-sm font-medium transition-colors ${
          tab === "feed" ? "text-accent" : "text-t3 hover:text-t2"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${tab === "feed" ? "bg-accent" : "bg-t3/40"}`} />
        Feed
      </button>
      <button
        onClick={() => onTab("tasks")}
        className={`flex items-center gap-2 py-2 px-3 text-sm font-medium transition-colors ${
          tab === "tasks" ? "text-accent" : "text-t3 hover:text-t2"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${tab === "tasks" ? "bg-accent" : "bg-t3/40"}`} />
        Tasks
      </button>
    </div>
  );
}
