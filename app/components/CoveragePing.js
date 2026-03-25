"use client";

import { useState, useEffect } from "react";

const TWO_HOURS = 2 * 60 * 60 * 1000;

export default function CoveragePing({ messages }) {
  const [stale, setStale] = useState(false);

  useEffect(() => {
    const check = () => {
      if (messages.length === 0) { setStale(true); return; }
      const last = new Date(messages[messages.length - 1].created_at).getTime();
      setStale(Date.now() - last > TWO_HOURS);
    };
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [messages]);

  if (!stale) return null;

  return (
    <div className="px-5 py-2.5 border-b border-black/8 bg-danger/5">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-danger rec-pulse flex-shrink-0" />
        <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-danger">
          No update in 2+ hours — is someone with Elena?
        </span>
      </div>
    </div>
  );
}
