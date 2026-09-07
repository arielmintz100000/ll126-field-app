"use client";

import SignaturePad from "@/components/ui/SignaturePad";

export default function InspectorSignOff({ data, onChange, onSubmit, onBack, isSubmitting }) {
  const update = (key, val) => onChange({ ...data, [key]: val });

  const canSubmit =
    data.name?.trim() &&
    data.firm?.trim() &&
    data.signature &&
    !isSubmitting;

  return (
    <div className="step-enter p-4 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-capitol-navy">✍️ Inspector Sign-Off</h2>
        <p className="text-sm text-gray-500 mt-1">
          Complete your details and sign to submit the report.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inspector Name</label>
          <input
            type="text"
            value={data.name || ""}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Patrick Corcoran"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                       focus:ring-2 focus:ring-capitol-blue focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Firm</label>
          <input
            type="text"
            value={data.firm || "Capitol Compliance"}
            onChange={(e) => update("firm", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                       focus:ring-2 focus:ring-capitol-blue focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                       focus:ring-2 focus:ring-capitol-blue focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={data.email || ""}
            onChange={(e) => update("email", e.target.value)}
            placeholder="inspector@capitolcompliance.co"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                       focus:ring-2 focus:ring-capitol-blue focus:border-transparent outline-none"
          />
        </div>

        <SignaturePad onSignatureChange={(sig) => update("signature", sig)} />
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pb-8">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className={`flex-1 btn-submit ${canSubmit ? "bg-green-600 text-white" : ""}`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Submitting...
            </span>
          ) : (
            "Submit Report ✓"
          )}
        </button>
      </div>
    </div>
  );
}
