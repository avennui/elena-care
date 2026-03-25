"use client";

import { useState } from "react";

export default function Tasks({ tasks, user, onAdd, onComplete }) {
  const [text, setText] = useState("");
  const handleAdd = () => { if (!text.trim()) return; onAdd(text.trim()); setText(""); };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl text-t1" style={{ fontWeight: 500, letterSpacing: "-0.01em" }}>Tasks</h2>
          <span className="text-xs text-t3" style={{ letterSpacing: "0.02em" }}>{tasks.length}/5</span>
        </div>

        {tasks.length === 0 && <p className="text-sm text-t3 py-8 text-center">No active tasks</p>}

        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 py-3.5 border-b border-line">
            <button onClick={() => onComplete(task.id)}
              className="mt-0.5 w-4 h-4 border border-[#CCCCCC] flex items-center justify-center flex-shrink-0 hover:border-t1 transition-colors"
              style={{ borderRadius: "1px" }}>
            </button>
            <div className="flex-1">
              <p className="text-sm text-t1">{task.text}</p>
              {task.owner && <p className="text-xs text-t3 mt-0.5" style={{ letterSpacing: "0.02em" }}>{task.owner}</p>}
            </div>
          </div>
        ))}
      </div>

      {tasks.length < 5 && (
        <div className="border-t border-line px-5 py-3 bg-surface">
          <div className="flex gap-3 items-end">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add task…"
              className="flex-1 bg-transparent border-0 border-b border-line px-0 py-2 text-sm text-t1 focus:outline-none focus:border-t1 placeholder:text-t3 transition-colors duration-150"
              style={{ borderRadius: 0 }} />
            <button onClick={handleAdd} disabled={!text.trim() || tasks.length >= 5}
              className="px-3 py-1.5 bg-t1 text-white text-sm disabled:opacity-30"
              style={{ fontWeight: 600, borderRadius: "2px" }}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}
