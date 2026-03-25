"use client";

import { useRef, useEffect } from "react";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDate(ts) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const y = new Date(today); y.setDate(y.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function Message({ msg, isNew }) {
  if (msg.type === "handoff") {
    return (
      <div className={`px-5 py-3 border-b border-black/8 ${isNew ? "animate-fadeIn" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-black/8" />
          <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-accent">{msg.content}</span>
          <span className="text-[11px] tracking-[0.06em] uppercase text-t3">{formatTime(msg.created_at)}</span>
          <div className="flex-1 h-px bg-black/8" />
        </div>
      </div>
    );
  }
  if (msg.type === "system") {
    return (
      <div className={`px-5 py-3 border-b border-black/8 text-center ${isNew ? "animate-fadeIn" : ""}`}>
        <span className="text-[11px] tracking-[0.06em] uppercase text-t3">{msg.content}</span>
      </div>
    );
  }

  return (
    <div className={`px-5 py-4 border-b border-black/8 ${isNew ? "animate-fadeIn" : ""}`}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-t1">{msg.sender}</span>
        <span className="text-[11px] tracking-[0.06em] uppercase text-t3">{formatTime(msg.created_at)}</span>
      </div>
      {msg.content && (
        <p className="text-[15px] text-t2 whitespace-pre-wrap" style={{ lineHeight: "1.5" }}>{msg.content}</p>
      )}
      {msg.type === "voice" && msg.file_url && (
        <div className="mt-3">
          <audio controls preload="none" className="w-full max-w-xs h-8"><source src={msg.file_url} /></audio>
          {msg.transcript && <p className="mt-1 text-[11px] tracking-[0.04em] text-t3 italic">{msg.transcript}</p>}
        </div>
      )}
      {msg.type === "file" && msg.file_url && (
        <div className="mt-3">
          {msg.file_url.match(/\.(jpg|jpeg|png|gif|webp|heic)(\?|$)/i) ? (
            <img src={msg.file_url} alt=""
              className="max-w-xs border border-black/8 cursor-pointer"
              style={{ borderRadius: 0 }}
              onClick={() => window.open(msg.file_url, "_blank")}
              loading="lazy" />
          ) : (
            <a href={msg.file_url} target="_blank" rel="noopener"
              className="text-[11px] font-semibold tracking-[0.1em] uppercase text-accent border-b border-accent pb-px">
              View File ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function Feed({ messages, user }) {
  const bottomRef = useRef(null);
  const prevCount = useRef(messages.length);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: prevCount.current === 0 ? "auto" : "smooth" });
    prevCount.current = messages.length;
  }, [messages.length]);

  let lastDate = "";
  const grouped = [];
  messages.forEach((msg) => {
    const date = formatDate(msg.created_at);
    if (date !== lastDate) { grouped.push({ type: "date", date }); lastDate = date; }
    grouped.push({ type: "msg", msg });
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 py-4 border-b border-black/8">
        <h2 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-t1">Feed</h2>
      </div>

      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-center px-5">
          <p className="text-[11px] tracking-[0.1em] uppercase text-t3">No updates yet</p>
        </div>
      )}

      {grouped.map((item, i) => {
        if (item.type === "date") {
          return (
            <div key={`d-${i}`} className="px-5 py-8 text-center">
              <span className="text-[11px] tracking-[0.08em] uppercase text-t3">{item.date}</span>
            </div>
          );
        }
        return <Message key={item.msg.id} msg={item.msg} isNew={i === grouped.length - 1 && messages.length > 1} />;
      })}
      <div ref={bottomRef} />
    </div>
  );
}
