"use client";

import { useState, useEffect } from "react";

const TARGETS = [
  { id: "move", label: "Get up and move", sublabel: "Even if it is just to a chair" },
  { id: "drink", label: "Drink enough water", sublabel: "Aim for at least 7 cups of fluid" },
  { id: "eat", label: "Eat well with protein", sublabel: "Finish meals and have a protein shake" },
  { id: "glasses", label: "Wear glasses and hearing aids", sublabel: "Keep them on during the day" },
  { id: "breathe", label: "Take deep breaths", sublabel: "Slow deep breaths several times" },
  { id: "sleep", label: "Protect sleep", sublabel: "Ask for lights off by 9 PM" },
  { id: "speak", label: "Speak up if anything changes", sublabel: "Tell someone right away" },
];

const SPEAK_UP = [
  "Sudden confusion or mental fog",
  "Pain getting worse instead of better",
  "Too sleepy or hard to stay awake",
  "Trouble breathing or chest discomfort",
  "One leg more swollen than the other",
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
    <div className="flex-1 overflow-y-auto pb-8">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-2xl font-light text-t1 tracking-tight" style={{ letterSpacing: "-0.02em", lineHeight: "1.15" }}>Today's recovery</h2>
        <p className="text-xs text-t3 mt-1" style={{ letterSpacing: "0.02em" }}>Your daily recovery targets</p>
      </div>

      <div className="px-6 mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-t3" style={{ letterSpacing: "0.02em" }}>{doneCount} of {TARGETS.length}</span>
        </div>
        <div className="w-full h-px bg-line overflow-hidden">
          <div className="h-full bg-t1 transition-all duration-500" style={{ width: `${(doneCount / TARGETS.length) * 100}%` }} />
        </div>
      </div>

      <div className="px-6 mt-4">
        {TARGETS.map((t) => {
          const done = checks[t.id];
          return (
            <button key={t.id} onClick={() => toggle(t.id)}
              className="w-full flex items-center gap-4 py-4 border-b border-line text-left transition-opacity duration-150 hover:opacity-70">
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${done ? "text-t3 line-through" : "text-t1"}`} style={{ fontWeight: done ? 400 : 500 }}>{t.label}</p>
                <p className="text-xs text-t3 mt-0.5" style={{ letterSpacing: "0.02em" }}>{t.sublabel}</p>
              </div>
              <div className={`w-4 h-4 flex items-center justify-center flex-shrink-0 border transition-all ${
                done ? "bg-t1 border-t1" : "border-[#CCCCCC]"
              }`} style={{ borderRadius: "1px" }}>
                {done && (
                  <svg width="9" height="9" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-6 mt-10">
        <h3 className="text-xs text-t3 uppercase mb-4" style={{ letterSpacing: "0.08em" }}>When to speak up</h3>
        <p className="text-xs text-t3 mb-4">You are not being a bother</p>

        <div className="space-y-3">
          {SPEAK_UP.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-t3 text-xs mt-0.5 flex-shrink-0">—</span>
              <p className="text-sm text-t2 leading-snug">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-line">
          <p className="text-xs text-t3 leading-relaxed" style={{ lineHeight: "1.6" }}>
            It is completely normal to feel scared, frustrated, or sad. This is a major event, and your feelings are part of the recovery process. Ask for help from your family, your nurses, or a social worker.
          </p>
        </div>
      </div>

      <div className="px-6 mt-10 mb-4 text-center">
        <div className="w-8 h-px bg-line mx-auto mb-6" />
        <p className="text-sm text-t2 leading-relaxed px-4" style={{ lineHeight: "1.6" }}>
          People who move early, eat well, and ask for help tend to recover best.
        </p>
        <p className="text-xs text-t3 mt-2">That is exactly what you are doing.</p>
      </div>

      {doneCount === TARGETS.length && (
        <div className="mx-6 mb-4 px-5 py-6 text-center border-t border-b border-line animate-fadeIn">
          <p className="text-lg text-t1" style={{ fontWeight: 400 }}>Well done today.</p>
          <p className="text-xs text-t3 mt-1">Every target complete.</p>
        </div>
      )}
    </div>
  );
}
