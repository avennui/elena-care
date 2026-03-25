"use client";

import { useState } from "react";

const FAMILY = ["Elena", "Anthony", "Catalina", "Michelle", "Raul", "Alejandra"];

export default function UserSetup({ onSet }) {
  const [custom, setCustom] = useState("");

  return (
    <div className="flex flex-col items-center justify-center h-screen px-8 bg-bg">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <h1 className="text-4xl text-t1" style={{ fontWeight: 300, letterSpacing: "-0.02em", lineHeight: "1.15" }}>Elena Valdez</h1>
          <div className="mt-3 w-8 h-px bg-line mx-auto" />
          <p className="mt-4 text-sm text-t3">Care Coordination</p>
        </div>

        <p className="text-xs text-t3 uppercase mb-4 text-center" style={{ letterSpacing: "0.08em" }}>Who are you?</p>

        <div className="grid grid-cols-2 gap-2">
          {FAMILY.map((name) => (
            <button
              key={name}
              onClick={() => onSet(name)}
              className={`py-3.5 px-4 text-sm transition-all duration-150 ${
                name === "Elena"
                  ? "bg-t1 text-white col-span-2"
                  : "bg-surface border border-line text-t1 hover:border-t1"
              }`}
              style={{ fontWeight: name === "Elena" ? 600 : 400, borderRadius: "2px" }}
            >
              {name === "Elena" ? "I'm Elena" : name}
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2 items-end">
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Other name"
            className="flex-1 bg-transparent border-0 border-b border-line px-0 py-2 text-sm text-t1 focus:outline-none focus:border-t1 placeholder:text-t3 transition-colors duration-150"
            style={{ borderRadius: 0 }}
            onKeyDown={(e) => e.key === "Enter" && custom.trim() && onSet(custom.trim())}
          />
          <button
            onClick={() => custom.trim() && onSet(custom.trim())}
            className="px-3 py-1.5 bg-t1 text-white text-sm"
            style={{ fontWeight: 600, borderRadius: "2px" }}
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
