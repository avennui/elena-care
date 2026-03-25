"use client";

import { useState } from "react";

export default function Tasks({ tasks, user, onAdd, onComplete }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-sm font-semibold text-t1">Tasks</span>
          <span className="text-xs text-t3">{tasks.length}/5</span>
        </div>

        {tasks.length === 0 && (
          <div className="text-t3 text-sm py-8 text-center">No active tasks.</div>
        )}

        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 py-3 border-b border-line/50">
            <button
              onClick={() => onComplete(task.id)}
              className="mt-0.5 w-5 h-5 border border-t3/40 rounded flex items-center justify-center flex-shrink-0 hover:border-accent transition-colors"
            >
              {task.done && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <div className="flex-1">
              <div className="text-sm text-t1">{task.text}</div>
              {task.owner && <div className="text-xs text-t3 mt-0.5">{task.owner}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Add task */}
      {tasks.length < 5 && (
        <div className="border-t border-line px-4 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add task..."
              className="flex-1 bg-surface border border-line rounded-lg px-3 py-2 text-sm text-t1 focus:outline-none focus:border-accent"
            />
            <button
              onClick={handleAdd}
              disabled={!text.trim() || tasks.length >= 5}
              className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg disabled:opacity-30"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
