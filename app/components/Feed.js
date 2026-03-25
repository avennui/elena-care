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
      <div className={`flex items-center gap-3 py-3 ${isNew ? "animate-slideUp" : ""}`}>
        <div className="flex-1 h-px bg-line" />
        <span className="text-xs text-accent px-2" style={{ fontWeight: 500, letterSpacing: "0.02em" }}>{msg.content}</span>
        <span className="text-xs text-t3">{formatTime(msg.created_at)}</span>
        <div className="flex-1 h-px bg-line" />
      </div>
    );
  }
  if (msg.type === "system") {
    return <div className={`py-2 text-center ${isNew ? "animate-slideUp" : ""}`}><span className="text-xs text-t3">{msg.content}</span></div>;
  }

  return (
    <div className={`py-3 ${isNew ? "animate-slideUp" : ""}`}>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-xs text-t1" style={{ fontWeight: 500 }}>{msg.sender}</span>
        <span className="text-xs text-t3">{formatTime(msg.created_at)}</span>
      </div>
      {msg.content && <p className="text-sm text-t2 whitespace-pre-wrap" style={{ lineHeight: "1.6" }}>{msg.content}</p>}
      {msg.type === "voice" && msg.file_url && (
        <div className="mt-2">
          <audio controls preload="none" className="w-full max-w-xs h-8"><source src={msg.file_url} /></audio>
          {msg.transcript && <p className="mt-1 text-xs text-t3 italic">{msg.transcript}</p>}
        </div>
      )}
      {msg.type === "file" && msg.file_url && (
        <div className="mt-2">
          {msg.file_url.match(/\.(jpg|jpeg|png|gif|webp|heic)(\?|$)/i) ? (
            <img src={msg.file_url} alt="" className="max-w-xs border border-line cursor-pointer" style={{ borderRadius: 0 }} onClick={() => window.open(msg.file_url, "_blank")} loading="lazy" />
          ) : (
            <a href={msg.file_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-xs text-accent border border-line px-3 py-2 hover:border-accent transition-colors" style={{ fontWeight: 500, borderRadius: "2px" }}>
              View file ↗
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
    <div className="flex-1 overflow-y-auto px-5 pb-2">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <p className="text-xl text-t3">No updates yet</p>
          <p className="text-sm text-t3 mt-1 opacity-60">Post the first one</p>
        </div>
      )}
      {grouped.map((item, i) => {
        if (item.type === "date") {
          return (
            <div key={`d-${i}`} className="flex items-center gap-3 py-3">
              <div className="flex-1 h-px bg-line" />
              <span className="text-xs text-t3" style={{ fontWeight: 500, letterSpacing: "0.04em" }}>{item.date}</span>
              <div className="flex-1 h-px bg-line" />
            </div>
          );
        }
        return <Message key={item.msg.id} msg={item.msg} isNew={i === grouped.length - 1 && messages.length > 1} />;
      })}
      <div ref={bottomRef} />
    </div>
  );
}
