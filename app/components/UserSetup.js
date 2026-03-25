"use client";

import { useState } from "react";

const FAMILY = ["Elena", "Anthony", "Catalina", "Michelle", "Raul", "Alejandra"];

export default function UserSetup({ onSet }) {
  const [custom, setCustom] = useState("");

  return (
    <div className="flex flex-col items-center justify-center h-screen px-8 bg-bg">
      <div className="w-full max-w-sm">
        {/* Mark */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl font-light text-t1 tracking-tight">Elena Valdez</h1>
          <div className="mt-2 w-8 h-px bg-warm mx-auto" />
          <p className="mt-4 text-sm text-t3 font-body">Care Coordination</p>
        </div>

        {/* Name selection */}
        <p className="text-xs text-t3 uppercase tracking-widest mb-4 text-center font-body">Who are you?</p>

        <div className="grid grid-cols-2 gap-2.5">
          {FAMILY.map((name) => (
            <button
              key={name}
              onClick={() => onSet(name)}
              className={`py-3.5 px-4 rounded-xl text-sm font-medium font-body transition-all duration-200 ${
                name === "Elena"
                  ? "bg-accent text-white col-span-2"
                  : "bg-surface border border-line text-t1 hover:border-accent hover:text-accent active:bg-dim"
              }`}
            >
              {name === "Elena" ? "I\u2019m Elena" : name}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Other name"
            className="flex-1 bg-surface border border-line rounded-xl px-4 py-3 text-sm text-t1 font-body focus:outline-none focus:border-accent transition-colors"
            onKeyDown={(e) => e.key === "Enter" && custom.trim() && onSet(custom.trim())}
          />
          <button
            onClick={() => custom.trim() && onSet(custom.trim())}
            className="px-5 py-3 bg-t1 text-white text-sm font-medium font-body rounded-xl"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
