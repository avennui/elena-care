"use client";

import { useState } from "react";

const FAMILY = ["Elena", "Anthony", "Catalina", "Michelle", "Raul", "Alejandra"];

export default function UserSetup({ onSet }) {
  const [custom, setCustom] = useState("");

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Top spacer — name appears ~40% down */}
      <div style={{ height: "38vh" }} />

      <div className="px-5">
        <h1 className="text-[48px] font-light text-t1 uppercase leading-none" style={{ letterSpacing: "-0.04em" }}>
          ELENA<br />VALDEZ
        </h1>
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-t3 mt-4">Care Coordination</p>
        <div className="w-8 h-px bg-black/8 mx-auto mt-6" />
      </div>

      <div className="px-5 mt-12">
        <p className="text-[11px] tracking-[0.1em] uppercase text-t3 mb-6">Who are you?</p>

        <div className="flex flex-col gap-0">
          {FAMILY.map((name) => (
            <button
              key={name}
              onClick={() => onSet(name)}
              className={`w-full text-left px-4 py-3.5 text-[11px] font-semibold tracking-[0.1em] uppercase border-b border-black/8 transition-colors ${
                name === "Elena"
                  ? "bg-t1 text-bg border-t1"
                  : "bg-bg text-t1 hover:text-accent"
              }`}
              style={{ borderRadius: 0 }}>
              {name === "Elena" ? "I'M ELENA" : name}
            </button>
          ))}
        </div>

        <div className="flex gap-4 items-end mt-8">
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && custom.trim() && onSet(custom.trim())}
            placeholder="Other name"
            className="flex-1 bg-transparent border-0 border-b border-black/8 px-0 py-2 text-[16px] text-t1 focus:outline-none focus:border-t1 placeholder:text-t3 transition-colors duration-150"
            style={{ borderRadius: 0 }} />
          <button
            onClick={() => custom.trim() && onSet(custom.trim())}
            className="text-[11px] font-semibold tracking-[0.1em] uppercase text-accent pb-2 border-b border-accent">
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
