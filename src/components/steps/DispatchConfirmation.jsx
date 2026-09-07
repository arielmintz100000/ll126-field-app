"use client";

export default function DispatchConfirmation({ taskData, onNext }) {
  const f = taskData.fields;

  const info = [
    { label: "Address",          value: f.address },
    { label: "BIN",              value: f.bin },
    { label: "BBL",              value: f.bbl },
    { label: "Date of Inspection", value: f.dateOfInspection },
    { label: "Entity",           value: f.entity },
    { label: "Client Contact",   value: f.clientContact },
    { label: "Billing Address",  value: f.billingAddress },
  ];

  return (
    <div className="step-enter p-4 space-y-4">
      <div className="bg-capitol-navy text-white rounded-xl p-4">
        <h2 className="text-lg font-bold mb-1">Dispatch Confirmation</h2>
        <p className="text-sm text-blue-200">
          Verify this building info matches what you see on-site.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {info.map((item, i) => (
          <div key={i} className="px-4 py-3 flex justify-between items-start">
            <span className="text-sm text-gray-500 shrink-0">{item.label}</span>
            <span className="text-sm font-medium text-right ml-4">
              {item.value || <span className="text-gray-300">—</span>}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Safety check:</strong> Confirm PPE is on and roof access is secured before proceeding.
        </p>
      </div>

      <button onClick={onNext} className="btn-submit bg-capitol-blue text-white">
        Confirm &amp; Start Inspection →
      </button>
    </div>
  );
}
