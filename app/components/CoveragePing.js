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
    <div className="px-5 py-2.5 bg-amberLight border-b border-amber/10">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber rec-pulse flex-shrink-0" />
        <span className="text-xs text-amber font-medium font-body">No update in 2+ hours. Is someone with Elena?</span>
      </div>
    </div>
  );
}
