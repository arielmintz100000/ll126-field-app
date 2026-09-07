"use client";

import { useState } from "react";
import PhotoCapture from "@/components/ui/PhotoCapture";

const CONDITIONS = ["Good Condition", "Some Defects Present", "Catastrophic Failure"];

const DEFECTS = [
  "Displacement",
  "Horizontal cracks",
  "Diagonal cracks",
  "Missing bricks",
  "Loose bricks",
  "Missing coping stones",
  "Loose coping stones",
  "Potential wiring issues",
];

const CONDITION_STYLES = {
  "Good Condition":       "badge-good",
  "Some Defects Present": "badge-defects",
  "Catastrophic Failure": "badge-catastrophic",
};

const COMPASS_EMOJI = { North: "⬆️", East: "➡️", South: "⬇️", West: "⬅️" };

export default function ElevationInspection({
  direction,
  data,
  onChange,
  onNext,
  onBack,
}) {
  const update = (key, val) => onChange({ ...data, [key]: val });

  const toggleDefect = (defect) => {
    const current = data.defects || [];
    const next = current.includes(defect)
      ? current.filter((d) => d !== defect)
      : [...current, defect];
    update("defects", next);
  };

  const isCatastrophic = data.condition === "Catastrophic Failure";
  const hasDefects = data.condition === "Some Defects Present";

  return (
    <div className="step-enter p-4 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-capitol-navy">
          {COMPASS_EMOJI[direction]} {direction} Elevation
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Walk to the {direction.toLowerCase()} parapet wall and assess its condition.
        </p>
      </div>

      {/* Condition selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
        <div className="space-y-2">
          {CONDITIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => update("condition", c)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all
                ${data.condition === c
                  ? `${CONDITION_STYLES[c]} border-2 font-semibold`
                  : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
                }`}
            >
              {c === "Good Condition" && "🟢 "}
              {c === "Some Defects Present" && "🟡 "}
              {c === "Catastrophic Failure" && "🔴 "}
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Catastrophic alert */}
      {isCatastrophic && (
        <div className="alert-catastrophic">
          🚨 DOB must be notified immediately. Document thoroughly.
          <br />
          <span className="text-sm font-normal">
            LL126 requires unsafe conditions reported within 24 hours.
          </span>
        </div>
      )}

      {/* Defect checklist (only if Some Defects) */}
      {hasDefects && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select all defects observed
          </label>
          <div className="space-y-2">
            {DEFECTS.map((d) => {
              const checked = (data.defects || []).includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDefect(d)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm flex items-center gap-3
                    ${checked
                      ? "border-yellow-400 bg-yellow-50 font-medium"
                      : "border-gray-200 bg-white"
                    }`}
                >
                  <span className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs
                    ${checked ? "border-yellow-500 bg-yellow-500 text-white" : "border-gray-300"}`}>
                    {checked && "✓"}
                  </span>
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <textarea
          value={data.notes || ""}
          onChange={(e) => update("notes", e.target.value)}
          placeholder={`Additional observations for the ${direction.toLowerCase()} elevation...`}
          rows={3}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none
                     focus:ring-2 focus:ring-capitol-blue focus:border-transparent outline-none"
        />
      </div>

      {/* Photos */}
      <PhotoCapture
        label={`${direction} Elevation Photos`}
        photos={data.photos || []}
        onPhotosChange={(p) => update("photos", p)}
      />

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.condition}
          className="flex-1 btn-submit"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
