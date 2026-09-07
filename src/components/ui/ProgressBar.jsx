"use client";

const STEP_LABELS = [
  "Dispatch",
  "Materials",
  "North",
  "East",
  "South",
  "West",
  "Summary",
  "Sign Off",
];

export default function ProgressBar({ current, total = 8 }) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-capitol-navy">
          Step {current + 1} of {total}
        </span>
        <span className="text-xs text-gray-500">
          {STEP_LABELS[current]}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-capitol-blue rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
