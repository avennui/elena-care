"use client";

import { useState } from "react";

function getCallContext(info) {
  const details = [info?.name, info?.dob ? `DOB ${info.dob}` : null].filter(Boolean);
  return details.length ? `Calling about ${details.join(", ")}` : "Calling about the patient";
}

function InfoRow({ label, value, field, onUpdate, phone, title }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || "");

  const save = () => {
    onUpdate({ [field]: val });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 py-1.5">
        <span className="text-t3 text-xs w-24 flex-shrink-0">{label}</span>
        <input
          autoFocus
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="flex-1 bg-transparent border-b border-accent text-sm text-t1 py-0.5 focus:outline-none"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="text-t3 text-xs w-24 flex-shrink-0">{label}</span>
      <span
        className="text-sm text-t2 flex-1 cursor-pointer hover:text-t1 transition-colors"
        onClick={() => setEditing(true)}
      >
        {value || "tap to set"}
      </span>
      {phone && value && (
        <a
          href={`tel:${value}`}
          className="text-accent text-xs font-semibold px-2 py-1 border border-accent/30 rounded"
          title={title}
        >
          Call
        </a>
      )}
    </div>
  );
}

export default function TopInfo({ info, onUpdate, user, onHandoff }) {
  const [expanded, setExpanded] = useState(false);
  const [handoffTo, setHandoffTo] = useState("");
  const callContext = getCallContext(info);

  if (!info) return null;

  return (
    <div className="border-b border-line">
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div>
          <div className="text-sm font-semibold text-t1">{info.name || "Patient name"}</div>
          <div className="text-xs text-t3">{info.dob ? `DOB: ${info.dob}` : "DOB: tap to set"}</div>
        </div>
        <div className="flex items-center gap-3">
          {info.current_shift && (
            <span className="text-xs text-accent">
              On shift: {info.current_shift}
            </span>
          )}
          <span className="text-t3 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-3 border-t border-line/50 pt-2">
          <InfoRow label="Patient" value={info.name} field="name" onUpdate={onUpdate} />
          <InfoRow label="DOB" value={info.dob} field="dob" onUpdate={onUpdate} />
          <InfoRow label="Hospital" value={info.hospital} field="hospital" onUpdate={onUpdate} />
          <InfoRow label="Nurse station" value={info.nurse_station} field="nurse_station" onUpdate={onUpdate} />
          <InfoRow label="Case manager" value={info.case_manager} field="case_manager" onUpdate={onUpdate} />
          <InfoRow
            label="CM phone"
            value={info.case_manager_phone}
            field="case_manager_phone"
            onUpdate={onUpdate}
            phone
            title={callContext}
          />
          <InfoRow label="Insurance" value={info.insurance} field="insurance" onUpdate={onUpdate} />

          {/* Shift handoff */}
          <div className="mt-3 pt-3 border-t border-line/50">
            <div className="text-xs text-t3 mb-2">Shift handoff</div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Hand off to..."
                value={handoffTo}
                onChange={(e) => setHandoffTo(e.target.value)}
                className="flex-1 bg-surface border border-line rounded px-3 py-2 text-sm text-t1 focus:outline-none focus:border-accent"
              />
              <button
                onClick={() => {
                  if (handoffTo.trim()) {
                    onHandoff(handoffTo.trim());
                    setHandoffTo("");
                  }
                }}
                className="px-4 py-2 bg-accent text-white text-xs font-semibold rounded"
              >
                Hand off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
