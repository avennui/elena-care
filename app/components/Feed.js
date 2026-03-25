"use client";

import { useRef, useEffect } from "react";

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDate(ts) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function MessageItem({ msg, isNew }) {
  const isHandoff = msg.type === "handoff";
  const isSystem = msg.type === "system";
  const isFile = msg.type === "file";
  const isVoice = msg.type === "voice";

  if (isHandoff) {
    return (
      <div className={`flex items-center gap-2 py-2 ${isNew ? "animate-pulse_new" : ""}`}>
        <div className="flex-1 h-px bg-accent/20" />
        <span className="text-xs text-accent font-medium px-2">⇄ {msg.content}</span>
        <span className="text-xs text-t3">{formatTime(msg.created_at)}</span>
        <div className="flex-1 h-px bg-accent/20" />
      </div>
    );
  }

  if (isSystem) {
    return (
      <div className={`py-2 text-center ${isNew ? "animate-pulse_new" : ""}`}>
        <span className="text-xs text-t3">{msg.content}</span>
      </div>
    );
  }

  return (
    <div className={`py-2.5 ${isNew ? "animate-pulse_new" : ""}`}>
      <div className="flex items-baseline gap-2 mb-0.5">
        <span className="text-xs font-semibold text-t2">{msg.sender}</span>
        <span className="text-xs text-t3">{formatTime(msg.created_at)}</span>
      </div>

      {msg.content && (
        <div className="text-sm text-t1 leading-relaxed whitespace-pre-wrap">{msg.content}</div>
      )}

      {isVoice && msg.file_url && (
        <div className="mt-1.5">
          <audio controls preload="none" className="w-full max-w-xs h-8" style={{ filter: "invert(1) hue-rotate(180deg)" }}>
            <source src={msg.file_url} />
          </audio>
          {msg.transcript && (
            <div className="mt-1 text-xs text-t3 italic">{msg.transcript}</div>
          )}
        </div>
      )}

      {isFile && msg.file_url && (
        <div className="mt-1.5">
          {msg.file_url.match(/\.(jpg|jpeg|png|gif|webp|heic)(\?|$)/i) ? (
            <img
              src={msg.file_url}
              alt="uploaded"
              className="max-w-xs rounded border border-line cursor-pointer"
              onClick={() => window.open(msg.file_url, "_blank")}
              loading="lazy"
            />
          ) : (
            <a
              href={msg.file_url}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 text-xs text-accent border border-accent/30 rounded px-3 py-1.5"
            >
              📎 View file
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function Feed({ messages, user }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const prevCount = useRef(messages.length);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: prevCount.current === 0 ? "auto" : "smooth" });
    prevCount.current = messages.length;
  }, [messages.length]);

  // Group messages by date
  let lastDate = "";
  const grouped = [];
  messages.forEach((msg) => {
    const date = formatDate(msg.created_at);
    if (date !== lastDate) {
      grouped.push({ type: "date", date });
      lastDate = date;
    }
    grouped.push({ type: "msg", msg });
  });

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 pb-2">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-t3 text-sm">
          No updates yet. Post the first one.
        </div>
      )}
      {grouped.map((item, i) => {
        if (item.type === "date") {
          return (
            <div key={`date-${i}`} className="flex items-center gap-3 py-3">
              <div className="flex-1 h-px bg-line" />
              <span className="text-xs text-t3 font-medium">{item.date}</span>
              <div className="flex-1 h-px bg-line" />
            </div>
          );
        }
        const isNew = i === grouped.length - 1 && messages.length > 1;
        return <MessageItem key={item.msg.id} msg={item.msg} isNew={isNew} />;
      })}
      <div ref={bottomRef} />
    </div>
  );
}
