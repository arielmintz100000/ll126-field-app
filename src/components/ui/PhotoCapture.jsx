"use client";

import { useRef, useState } from "react";

export default function PhotoCapture({ label, photos, onPhotosChange, accept = "image/*" }) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);

  const handleCapture = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPhotos = [...(photos || []), ...files];
    onPhotosChange(newPhotos);

    // Generate previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => [...prev, { name: file.name, src: ev.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
    setPreviews((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center
                   hover:border-capitol-blue hover:bg-blue-50 transition-colors active:bg-blue-100"
      >
        <span className="text-3xl block mb-1">📷</span>
        <span className="text-sm text-gray-600">Tap to capture photo</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture="environment"
        multiple
        onChange={handleCapture}
        className="hidden"
      />

      {previews.length > 0 && (
        <div className="photo-grid mt-3">
          {previews.map((p, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden border border-gray-200">
              <img src={p.src} alt={p.name} className="w-full h-24 object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full
                           text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
