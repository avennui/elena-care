"use client";

import { useState } from "react";

function InfoRow({ label, value, field, onUpdate, phone }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || "");
  const save = () => { onUpdate({ [field]: val }); setEditing(false); };

  return (
    <div className="flex items-center py-3 border-b border-black/8">
      <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-t3 w-28 flex-shrink-0">{label}</span>
      {editing ? (
        <input autoFocus type="text" value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="flex-1 bg-transparent border-0 border-b border-t1 text-[16px] text-t1 py-0.5 focus:outline-none"
          style={{ borderRadius: 0 }} />
      ) : (
        <span className="text-[15px] font-light text-t2 flex-1 cursor-pointer hover:text-t1 transition-colors" onClick={() => setEditing(true)}>
          {value || <span className="text-t3">—</span>}
        </span>
      )}
      {phone && value && !editing && (
        <a href={`tel:${value}`} className="text-[11px] font-semibold tracking-[0.1em] uppercase text-accent ml-3">Call</a>
      )}
    </div>
  );
}

export default function TopInfo({ info, onUpdate, user, onHandoff }) {
  const [expanded, setExpanded] = useState(false);
  const [handoffTo, setHandoffTo] = useState("");
  if (!info) return null;

  return (
    <div className="bg-bg border-b border-black/8">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-5 pt-8 pb-5 text-left">
        <h1 className="font-light text-t1 uppercase leading-none" style={{ fontSize: "clamp(48px, 13.5vw, 72px)", letterSpacing: "-0.05em" }}>
          {info.name}
        </h1>
        <p className="text-[11px] tracking-[0.08em] uppercase text-t3 mt-3">
          {info.dob}
          {info.current_shift && (
            <span className="ml-4 text-accent">↳ {info.current_shift.toUpperCase()}</span>
          )}
        </p>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-black/8 pt-4 animate-fadeIn">
          <InfoRow label="Hospital" value={info.hospital} field="hospital" onUpdate={onUpdate} />
          <InfoRow label="Nurse stn." value={info.nurse_station} field="nurse_station" onUpdate={onUpdate} />
          <InfoRow label="Case mgr." value={info.case_manager} field="case_manager" onUpdate={onUpdate} />
          <InfoRow label="CM phone" value={info.case_manager_phone} field="case_manager_phone" onUpdate={onUpdate} phone />
          <InfoRow label="Insurance" value={info.insurance} field="insurance" onUpdate={onUpdate} />

          <div className="mt-5 pt-3">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-t3 mb-3">Shift Handoff</p>
            <div className="flex gap-4 items-end">
              <input
                type="text"
                placeholder="Hand off to…"
                value={handoffTo}
                onChange={(e) => setHandoffTo(e.target.value)}
                className="flex-1 bg-transparent border-0 border-b border-black/8 px-0 py-2 text-[16px] text-t1 focus:outline-none focus:border-t1 placeholder:text-t3 transition-colors duration-150"
                style={{ borderRadius: 0 }} />
              <button
                onClick={() => { if (handoffTo.trim()) { onHandoff(handoffTo.trim()); setHandoffTo(""); } }}
                className="text-[11px] font-semibold tracking-[0.1em] uppercase text-accent pb-2 border-b border-accent">
                Hand Off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
