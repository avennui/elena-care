"use client";

import { useState } from "react";

export default function Tasks({ tasks, user, onAdd, onComplete }) {
  const [text, setText] = useState("");
  const handleAdd = () => { if (!text.trim()) return; onAdd(text.trim()); setText(""); };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-black/8 flex items-baseline justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-t1">Tasks</h2>
        <span className="text-[11px] tracking-[0.06em] uppercase text-t3">{tasks.length}/5</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-[11px] tracking-[0.08em] uppercase text-t3">No active tasks</p>
          </div>
        )}

        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-4 px-5 py-4 border-b border-black/8">
            <button
              onClick={() => onComplete(task.id)}
              className="mt-0.5 w-3.5 h-3.5 border border-t1 flex items-center justify-center flex-shrink-0 hover:opacity-50 transition-opacity"
              style={{ borderRadius: 0 }}>
            </button>
            <div className="flex-1">
              <p className="text-[15px] text-t1" style={{ lineHeight: "1.4" }}>{task.text}</p>
              {task.owner && (
                <p className="text-[11px] tracking-[0.06em] uppercase text-t3 mt-1">{task.owner}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {tasks.length < 5 && (
        <div className="border-t border-black/8 px-5 py-3 bg-bg safe-bottom">
          <div className="flex gap-4 items-end">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add task…"
              className="flex-1 bg-transparent border-0 border-b border-black/8 px-0 py-2 text-[16px] text-t1 focus:outline-none focus:border-t1 placeholder:text-t3 transition-colors duration-150"
              style={{ borderRadius: 0 }} />
            <button
              onClick={handleAdd}
              disabled={!text.trim() || tasks.length >= 5}
              className="text-[11px] font-semibold tracking-[0.1em] uppercase text-accent pb-2 border-b border-accent disabled:opacity-30">
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
