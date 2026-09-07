"use client";

import { useState } from "react";
import PhotoCapture from "@/components/ui/PhotoCapture";

const SCORES = [
  { value: "Safe",    emoji: "🟢", desc: "No hazards identified" },
  { value: "SWARMP",  emoji: "🟡", desc: "Safe with a repair and maintenance program" },
  { value: "Unsafe",  emoji: "🔴", desc: "Immediate hazard present" },
];

export default function ObservationSummary({ data, onChange, onNext, onBack }) {
  const update = (key, val) => onChange({ ...data, [key]: val });

  return (
    <div className="step-enter p-4 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-capitol-navy">📋 Observation Summary</h2>
        <p className="text-sm text-gray-500 mt-1">
          Overall assessment and documentation.
        </p>
      </div>

      {/* Falling hazard toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Immediate falling hazard observed?</span>
          <div className="flex gap-2">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => update("fallingHazard", val)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all
                  ${data.fallingHazard === val
                    ? val
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-green-100 border-green-400 text-green-800"
                    : "bg-white border-gray-200 text-gray-600"
                  }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>

        {data.fallingHazard && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm font-medium">DOB notified?</span>
            <div className="flex gap-2">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => update("dobNotified", val)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all
                    ${data.dobNotified === val
                      ? "bg-blue-100 border-blue-400 text-blue-800"
                      : "bg-white border-gray-200 text-gray-600"
                    }`}
                >
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Parapet Score */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parapet Score (FISP Classification)
        </label>
        <div className="space-y-2">
          {SCORES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => update("score", s.value)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3
                ${data.score === s.value
                  ? "border-capitol-blue bg-blue-50 font-semibold"
                  : "border-gray-200 bg-white active:bg-gray-50"
                }`}
            >
              <span className="text-xl">{s.emoji}</span>
              <div>
                <div className="font-medium">{s.value}</div>
                <div className="text-xs text-gray-500">{s.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 360 Video */}
      <PhotoCapture
        label="360° Roof Video"
        photos={data.video ? [data.video] : []}
        onPhotosChange={(files) => update("video", files[files.length - 1] || null)}
        accept="video/*"
      />

      {/* Nav */}
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={data.fallingHazard === undefined || !data.score}
          className="flex-1 btn-submit"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
