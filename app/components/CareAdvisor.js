"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function CareAdvisor({ info }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi. I can help you navigate Elena's care, what to ask the doctors, how to push for inpatient rehab, what Medicare questions to raise, and what to do when something feels off.\n\nI'm not a doctor, so I won't diagnose or interpret medical results. I will help you with the exact questions to ask and who to ask them to.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async (nextInput = input) => {
    const trimmed = nextInput.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = nextMessages.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const response = await fetch("/api/care-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, info }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Sorry, I couldn't process that. Try again.");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content || "Sorry, I couldn't process that. Try again." },
      ]);
    } catch (error) {
      console.error("Care Advisor error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: error.message || "Something went wrong. Check your connection and try again." },
      ]);
    }

    setLoading(false);
  }, [info, input, loading, messages]);

  const suggestions = [
    "What should I ask the PT today?",
    "How do we get into Casa Colina?",
    "What does Medicare cover?",
    "She seems confused. What do I do?",
    "PT didn't come today",
    "What should she be eating?",
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5 border-b border-black/8">
        <h2 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-t1">Care Advisor</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-8 ${message.role === "user" ? "flex justify-end" : ""}`}>
            {message.role === "assistant" && (
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-accent mb-2">Advisor</p>
            )}
            <div
              className={`text-[15px] font-light whitespace-pre-wrap ${
                message.role === "user"
                  ? "inline-block max-w-[85%] bg-accent/5 px-4 py-3 text-t1"
                  : "text-t2"
              }`}
              style={{ lineHeight: "1.6", borderRadius: message.role === "user" ? "2px" : 0 }}>
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="mb-8">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-accent mb-2">Advisor</p>
            <div className="flex gap-1.5">
              <span className="h-1 w-1 animate-pulse bg-t3" style={{ animationDelay: "0ms", borderRadius: 0 }} />
              <span className="h-1 w-1 animate-pulse bg-t3" style={{ animationDelay: "150ms", borderRadius: 0 }} />
              <span className="h-1 w-1 animate-pulse bg-t3" style={{ animationDelay: "300ms", borderRadius: 0 }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-5 pb-4">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((question) => (
              <button
                key={question}
                onClick={() => { void send(question); }}
                className="border border-black/8 px-3 py-1.5 text-[11px] font-semibold tracking-[0.06em] uppercase text-t2 hover:border-t1 hover:text-t1 transition-colors"
                style={{ borderRadius: 0 }}>
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-black/8 bg-bg px-5 py-3 safe-bottom">
        <div className="flex gap-4 items-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { void send(); } }}
            placeholder="Ask about her care…"
            disabled={loading}
            className="flex-1 bg-transparent border-0 border-b border-black/8 px-0 py-2 text-[16px] text-t1 focus:outline-none focus:border-t1 placeholder:text-t3 transition-colors duration-150 disabled:opacity-50"
            style={{ borderRadius: 0 }} />
          <button
            onClick={() => { void send(); }}
            disabled={!input.trim() || loading}
            className="text-[11px] font-semibold tracking-[0.1em] uppercase text-accent pb-2 border-b border-accent disabled:opacity-20 transition-opacity">
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
