"use client";

import { useState } from "react";

function InfoRow({ label, value, field, onUpdate, phone }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || "");
  const save = () => { onUpdate({ [field]: val }); setEditing(false); };

  if (editing) {
    return (
      <div className="flex items-center gap-3 py-2">
        <span className="text-xs text-t3 w-24 flex-shrink-0 font-body">{label}</span>
        <input autoFocus type="text" value={val} onChange={(e) => setVal(e.target.value)} onBlur={save}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="flex-1 bg-transparent border-b border-accent text-sm text-t1 py-0.5 font-body focus:outline-none" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-xs text-t3 w-24 flex-shrink-0 font-body">{label}</span>
      <span className="text-sm text-t2 flex-1 font-body cursor-pointer hover:text-t1 transition-colors" onClick={() => setEditing(true)}>
        {value || "tap to set"}
      </span>
      {phone && value && (
        <a href={`tel:${value}`} className="text-accent text-xs font-medium font-body px-2.5 py-1 border border-accent/30 rounded-lg">Call</a>
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
          <h1 className="font-display text-xl font-semibold text-t1 tracking-tight">{info.name}</h1>
          <p className="text-xs text-t3 font-body mt-0.5">DOB: {info.dob}</p>
        </div>
        <div className="flex items-center gap-3">
          {info.current_shift && <span className="text-xs text-accent font-medium font-body">{info.current_shift} on shift</span>}
          <span className="text-t3 text-xs">{expanded ? "\u25B2" : "\u25BC"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-4 border-t border-soft pt-3 animate-fadeIn">
          <InfoRow label="Hospital" value={info.hospital} field="hospital" onUpdate={onUpdate} />
          <InfoRow label="Nurse station" value={info.nurse_station} field="nurse_station" onUpdate={onUpdate} />
          <InfoRow label="Case manager" value={info.case_manager} field="case_manager" onUpdate={onUpdate} />
          <InfoRow label="CM phone" value={info.case_manager_phone} field="case_manager_phone" onUpdate={onUpdate} phone />
          <InfoRow label="Insurance" value={info.insurance} field="insurance" onUpdate={onUpdate} />

          <div className="mt-4 pt-4 border-t border-soft">
            <p className="text-xs text-t3 uppercase tracking-widest mb-2 font-body">Shift handoff</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Hand off to..." value={handoffTo} onChange={(e) => setHandoffTo(e.target.value)}
                className="flex-1 bg-dim border border-line rounded-xl px-3 py-2.5 text-sm text-t1 font-body focus:outline-none focus:border-accent" />
              <button onClick={() => { if (handoffTo.trim()) { onHandoff(handoffTo.trim()); setHandoffTo(""); } }}
                className="px-4 py-2.5 bg-accent text-white text-xs font-semibold font-body rounded-xl">Hand off</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
