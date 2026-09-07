"use client";

const MATERIALS = [
  "Brick",
  "CMU (Concrete Masonry Unit)",
  "Stone",
  "Cast-in-Place Concrete",
  "Metal",
  "Stucco/EIFS",
  "Other",
];

export default function ParapetConstruction({ data, onChange, onNext, onBack }) {
  const update = (key, val) => onChange({ ...data, [key]: val });

  return (
    <div className="step-enter p-4 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-capitol-navy">Parapet Construction</h2>
        <p className="text-sm text-gray-500 mt-1">
          Identify the material type and note any visible past repairs.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parapet Material
        </label>
        <div className="grid grid-cols-1 gap-2">
          {MATERIALS.map((mat) => (
            <button
              key={mat}
              type="button"
              onClick={() => update("material", mat)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all
                ${data.material === mat
                  ? "border-capitol-blue bg-blue-50 font-semibold text-capitol-blue"
                  : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
                }`}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Past Repairs Observed
        </label>
        <textarea
          value={data.pastRepairs || ""}
          onChange={(e) => update("pastRepairs", e.target.value)}
          placeholder="Note any visible repairs (repointing, patches, replaced sections, etc.)"
          rows={3}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none
                     focus:ring-2 focus:ring-capitol-blue focus:border-transparent outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.material}
          className="flex-1 btn-submit"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
