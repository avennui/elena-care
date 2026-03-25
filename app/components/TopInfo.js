"use client";

import { useState } from "react";

function InfoRow({ label, value, field, onUpdate, phone }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || "");
  const save = () => { onUpdate({ [field]: val }); setEditing(false); };

  if (editing) {
    return (
      <div className="flex items-center gap-3 py-2">
        <span className="text-xs text-t3 w-24 flex-shrink-0" style={{ letterSpacing: "0.02em" }}>{label}</span>
        <input autoFocus type="text" value={val} onChange={(e) => setVal(e.target.value)} onBlur={save}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="flex-1 bg-transparent border-0 border-b border-t1 text-sm text-t1 py-0.5 focus:outline-none transition-colors duration-150"
          style={{ borderRadius: 0 }} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-xs text-t3 w-24 flex-shrink-0" style={{ letterSpacing: "0.02em" }}>{label}</span>
      <span className="text-sm text-t2 flex-1 cursor-pointer hover:text-t1 transition-colors" onClick={() => setEditing(true)}>
        {value || "tap to set"}
      </span>
      {phone && value && (
        <a href={`tel:${value}`} className="text-accent text-xs px-2.5 py-1 border border-line hover:border-accent transition-colors" style={{ fontWeight: 500, borderRadius: "2px" }}>Call</a>
      )}
    </div>
  );
}

export default function TopInfo({ info, onUpdate, user, onHandoff }) {
  const [expanded, setExpanded] = useState(false);
  const [handoffTo, setHandoffTo] = useState("");
  if (!info) return null;

  return (
    <div className="border-b border-line bg-surface">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-5 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl text-t1" style={{ fontWeight: 500, letterSpacing: "-0.01em", lineHeight: "1.2" }}>{info.name}</h1>
          <p className="text-xs text-t3 mt-0.5" style={{ letterSpacing: "0.02em" }}>DOB: {info.dob}</p>
        </div>
        <div className="flex items-center gap-3">
          {info.current_shift && <span className="text-xs text-accent" style={{ fontWeight: 500 }}>{info.current_shift} on shift</span>}
          <span className="text-t3 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-4 border-t border-line pt-3 animate-fadeIn">
          <InfoRow label="Hospital" value={info.hospital} field="hospital" onUpdate={onUpdate} />
          <InfoRow label="Nurse station" value={info.nurse_station} field="nurse_station" onUpdate={onUpdate} />
          <InfoRow label="Case manager" value={info.case_manager} field="case_manager" onUpdate={onUpdate} />
          <InfoRow label="CM phone" value={info.case_manager_phone} field="case_manager_phone" onUpdate={onUpdate} phone />
          <InfoRow label="Insurance" value={info.insurance} field="insurance" onUpdate={onUpdate} />

          <div className="mt-4 pt-4 border-t border-line">
            <p className="text-xs text-t3 uppercase mb-3" style={{ letterSpacing: "0.08em" }}>Shift handoff</p>
            <div className="flex gap-3 items-end">
              <input type="text" placeholder="Hand off to…" value={handoffTo} onChange={(e) => setHandoffTo(e.target.value)}
                className="flex-1 bg-transparent border-0 border-b border-line px-0 py-2 text-sm text-t1 focus:outline-none focus:border-t1 placeholder:text-t3 transition-colors duration-150"
                style={{ borderRadius: 0 }} />
              <button onClick={() => { if (handoffTo.trim()) { onHandoff(handoffTo.trim()); setHandoffTo(""); } }}
                className="px-3 py-1.5 bg-t1 text-white text-xs"
                style={{ fontWeight: 600, borderRadius: "2px" }}>Hand off</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
