"use client";

import { useState } from "react";

export default function Tasks({ tasks, user, onAdd, onComplete }) {
  const [text, setText] = useState("");
  const handleAdd = () => { if (!text.trim()) return; onAdd(text.trim()); setText(""); };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-xl font-semibold text-t1">Tasks</h2>
          <span className="text-xs text-t3 font-body bg-dim px-2.5 py-1 rounded-full">{tasks.length}/5</span>
        </div>

        {tasks.length === 0 && <p className="text-sm text-t3 font-body py-8 text-center">No active tasks</p>}

        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 py-3.5 border-b border-soft">
            <button onClick={() => onComplete(task.id)}
              className="mt-0.5 w-5 h-5 border-2 border-line rounded-md flex items-center justify-center flex-shrink-0 hover:border-accent transition-colors">
            </button>
            <div className="flex-1">
              <p className="text-sm text-t1 font-body">{task.text}</p>
              {task.owner && <p className="text-xs text-t3 font-body mt-0.5">{task.owner}</p>}
            </div>
          </div>
        ))}
      </div>

      {tasks.length < 5 && (
        <div className="border-t border-line px-5 py-3 bg-surface">
          <div className="flex gap-2">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add task\u2026"
              className="flex-1 bg-dim border border-line rounded-xl px-4 py-2.5 text-sm text-t1 font-body focus:outline-none focus:border-accent" />
            <button onClick={handleAdd} disabled={!text.trim() || tasks.length >= 5}
              className="px-5 py-2.5 bg-accent text-white text-sm font-semibold font-body rounded-xl disabled:opacity-30">Add</button>
          </div>
        </div>
      )}
    </div>
  );
}
