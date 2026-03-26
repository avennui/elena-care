"use client";

import { useState, useEffect } from "react";

const TARGETS = [
  { id: "move", label: "Get up and move — even just to a chair", sublabel: "Stand, sit, or walk with help" },
  { id: "drink", label: "Drink at least 7 cups of fluid", sublabel: "Sip throughout the day, don't wait" },
  { id: "eat", label: "Eat meals and have a protein shake", sublabel: "Protein heals bone — 80g per day" },
  { id: "glasses", label: "Wear glasses and hearing aids", sublabel: "Keep them on during the day" },
  { id: "breathe", label: "Take deep breaths", sublabel: "Slow breaths, several times a day" },
  { id: "sleep", label: "Protect your sleep", sublabel: "Ask for lights off by 9 PM" },
  { id: "speak", label: "Speak up if anything changes", sublabel: "Tell someone right away" },
];

const SPEAK_UP = [
  "New confusion or fogginess",
  "Pain getting worse, not better",
  "Feeling too drowsy to stay awake",
  "Trouble breathing",
  "A leg that looks more swollen",
  "No bowel movement in 2 days",
  "The surgery area looks different",
  "Feeling scared, sad, or overwhelmed",
];

export default function ElenaView() {
  const [checks, setChecks] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("elena-recovery-checks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed._date !== new Date().toDateString()) {
          setChecks({});
        } else {
          setChecks(parsed);
        }
      }
    } catch {}
  }, []);

  const toggle = (id) => {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id], _date: new Date().toDateString() };
      localStorage.setItem("elena-recovery-checks", JSON.stringify(next));
      return next;
    });
  };

  const doneCount = TARGETS.filter((t) => checks[t.id]).length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 py-5 border-b border-black/8">
        <h2 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-t1">Your Recovery</h2>
      </div>

      <div className="px-5 py-5 border-b border-black/8">
        <div className="h-0.5 w-full bg-black/8 mb-2">
          <div
            className="h-full bg-t1"
            style={{ width: `${(doneCount / TARGETS.length) * 100}%`, transition: "width 400ms ease-out" }} />
        </div>
        <p className="text-[11px] tracking-[0.08em] uppercase text-t3">{doneCount} of {TARGETS.length}</p>
      </div>

      {TARGETS.map((t) => {
        const done = checks[t.id];
        return (
          <button key={t.id} onClick={() => toggle(t.id)}
            className="w-full flex items-start gap-4 px-5 py-5 border-b border-black/8 text-left hover:bg-black/[0.02] transition-colors">
            <div
              className={`mt-0.5 w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-all ${
                done ? "bg-t1 border-t1" : "border-t1"
              }`}
              style={{ borderRadius: 0 }}>
              {done && (
                <svg width="8" height="8" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-[15px] font-light ${done ? "text-t3 line-through" : "text-t1"}`} style={{ lineHeight: "1.5" }}>
                {t.label}
              </p>
              <p className="text-[11px] tracking-[0.06em] uppercase text-t3 mt-1">{t.sublabel}</p>
            </div>
          </button>
        );
      })}

      <div className="px-5 pt-12 pb-4 border-b border-black/8">
        <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-t1 mb-4">When to speak up</h3>
        <p className="text-[15px] font-light text-t1 mb-1" style={{ lineHeight: "1.5" }}>You are not being a bother.</p>
        <p className="text-[15px] font-light text-t2 mb-5" style={{ lineHeight: "1.5" }}>Press the call button if you notice:</p>
        <div className="space-y-3">
          {SPEAK_UP.map((item, i) => (
            <p key={i} className="text-[15px] font-light text-t2 flex items-baseline gap-2" style={{ lineHeight: "1.5" }}>
              <span className="text-t3 flex-shrink-0">·</span>
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="px-5 py-8 border-b border-black/8">
        <p className="text-[13px] text-t3 italic" style={{ lineHeight: "1.6" }}>
          It's completely normal to feel scared, frustrated, or sad. Ask for help — from family, nurses, or a social worker.
        </p>
      </div>

      {doneCount === TARGETS.length && (
        <div className="px-5 py-12 text-center animate-fadeIn">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-t1">Every target complete.</p>
          <p className="text-[11px] tracking-[0.06em] uppercase text-t3 mt-2">Well done today.</p>
        </div>
      )}
    </div>
  );
}
