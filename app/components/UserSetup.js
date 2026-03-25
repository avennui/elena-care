"use client";

import { useState } from "react";

const FAMILY = ["Anthony", "Michelle", "David", "Maria"];

export default function UserSetup({ onSet }) {
  const [custom, setCustom] = useState("");

  return (
    <div className="flex flex-col items-center justify-center h-screen px-6">
      <div className="text-t3 text-xs tracking-widest uppercase mb-2">Elena Valdez</div>
      <div className="text-t1 text-lg font-semibold mb-8">Who are you?</div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
        {FAMILY.map((name) => (
          <button
            key={name}
            onClick={() => onSet(name)}
            className="py-3 px-4 border border-line rounded-lg text-sm font-medium text-t1 hover:border-accent hover:text-accent transition-colors active:bg-surface"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="flex gap-2 w-full max-w-xs">
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Other name"
          className="flex-1 bg-surface border border-line rounded-lg px-3 py-2.5 text-sm text-t1 focus:outline-none focus:border-accent"
          onKeyDown={(e) => e.key === "Enter" && custom.trim() && onSet(custom.trim())}
        />
        <button
          onClick={() => custom.trim() && onSet(custom.trim())}
          className="px-4 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg"
        >
          Go
        </button>
      </div>
    </div>
  );
}
