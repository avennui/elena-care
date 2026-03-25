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
        body: JSON.stringify({
          messages: apiMessages,
          info,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Sorry, I couldn't process that. Try again.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content || "Sorry, I couldn't process that. Try again.",
        },
      ]);
    } catch (error) {
      console.error("Care Advisor error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error.message || "Something went wrong. Check your connection and try again.",
        },
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
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "user" ? "flex justify-end" : ""}`}>
            {message.role === "assistant" && (
              <div className="mb-1 flex items-start gap-2">
                <span className="text-xs text-accent" style={{ fontWeight: 500 }}>Care Advisor</span>
              </div>
            )}
            <div
              className={`whitespace-pre-wrap text-sm ${
                message.role === "user"
                  ? "inline-block max-w-[85%] bg-[#F0F4FF] px-4 py-3 text-t1"
                  : "max-w-[95%] text-t2"
              }`}
              style={{ lineHeight: "1.6", borderRadius: message.role === "user" ? "2px" : 0 }}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-accent" style={{ fontWeight: 500 }}>Care Advisor</span>
              <span className="text-xs text-t3">thinking…</span>
            </div>
            <div className="mt-2 flex gap-1 px-1">
              <span className="h-1 w-1 animate-pulse rounded-full bg-t3" style={{ animationDelay: "0ms" }} />
              <span className="h-1 w-1 animate-pulse rounded-full bg-t3" style={{ animationDelay: "150ms" }} />
              <span className="h-1 w-1 animate-pulse rounded-full bg-t3" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-5 pb-3">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((question) => (
              <button
                key={question}
                onClick={() => { void send(question); }}
                className="border border-line px-3 py-1.5 text-xs text-accent hover:border-accent transition-colors"
                style={{ borderRadius: "2px", fontWeight: 500 }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="safe-bottom border-t border-line bg-surface px-4 py-3">
        <div className="flex gap-3 items-end">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) { void send(); }
            }}
            placeholder="Ask about her care…"
            disabled={loading}
            className="flex-1 bg-transparent border-0 border-b border-line px-0 py-2 text-sm text-t1 focus:outline-none focus:border-t1 placeholder:text-t3 transition-colors duration-150 disabled:opacity-50"
            style={{ borderRadius: 0 }}
          />
          <button
            onClick={() => { void send(); }}
            disabled={!input.trim() || loading}
            className="px-3 py-1.5 bg-t1 text-white text-sm disabled:opacity-20 transition-opacity"
            style={{ fontWeight: 600, borderRadius: "2px" }}
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
