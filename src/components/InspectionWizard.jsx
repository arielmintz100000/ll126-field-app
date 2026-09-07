"use client";

import { useState, useEffect, useCallback } from "react";
import ProgressBar from "@/components/ui/ProgressBar";
import DispatchConfirmation from "@/components/steps/DispatchConfirmation";
import ParapetConstruction from "@/components/steps/ParapetConstruction";
import ElevationInspection from "@/components/steps/ElevationInspection";
import ObservationSummary from "@/components/steps/ObservationSummary";
import InspectorSignOff from "@/components/steps/InspectorSignOff";
import { fetchTask, setField, uploadAttachment } from "@/lib/api";
import {
  READ_FIELDS,
  WRITE_FIELDS,
  PARAPET_MATERIALS_OPTIONS,
  CONDITION_OPTIONS,
  PROJECT_PHASE_OPTIONS,
  PARAPET_SCORE_MAP,
  ELEVATIONS,
} from "@/lib/fieldConfig";
import { saveDraft, loadDraft, clearDraft, queuePendingSubmit, getPendingSubmit, clearPending } from "@/lib/offlineStore";

const TOTAL_STEPS = 8;

/** Extract a readable value from a ClickUp custom field */
function readFieldValue(field) {
  if (!field || field.value === undefined || field.value === null) return null;

  switch (field.type) {
    case "location":
      return field.value?.formatted_address || field.value?.location?.formatted_address || null;
    case "date":
      return field.value
        ? new Date(Number(field.value)).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          })
        : null;
    case "drop_down":
      // field.value is the selected option index or object
      if (field.type_config?.options) {
        const opt = field.type_config.options[field.value];
        return opt?.name || String(field.value);
      }
      return String(field.value);
    case "number":
      return String(field.value);
    case "email":
      return field.value;
    case "short_text":
    case "text":
      return field.value;
    default:
      return typeof field.value === "object" ? JSON.stringify(field.value) : String(field.value);
  }
}

export default function InspectionWizard({ taskId }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Task data from ClickUp (read-only)
  const [taskData, setTaskData] = useState(null);

  // Inspector-entered data
  const [formData, setFormData] = useState({
    construction: { material: null, pastRepairs: "" },
    north: { condition: null, defects: [], notes: "", photos: [] },
    east:  { condition: null, defects: [], notes: "", photos: [] },
    south: { condition: null, defects: [], notes: "", photos: [] },
    west:  { condition: null, defects: [], notes: "", photos: [] },
    summary: { fallingHazard: undefined, dobNotified: undefined, score: null, video: null },
    signoff: { name: "", firm: "Capitol Compliance", phone: "", email: "", signature: null },
  });

  // ─── Load task data ───
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const task = await fetchTask(taskId);

        // Map custom field IDs to readable values
        const fields = {};
        for (const [key, fieldId] of Object.entries(READ_FIELDS)) {
          fields[key] = readFieldValue(task.fields[fieldId]);
        }

        if (!cancelled) {
          setTaskData({ ...task, fields });
          setError(null);

          // Restore draft if available
          const draft = loadDraft(taskId);
          if (draft) {
            setFormData(draft);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [taskId]);

  // ─── Auto-save draft on form change ───
  useEffect(() => {
    if (taskData) {
      saveDraft(taskId, formData);
    }
  }, [formData, taskId, taskData]);

  // ─── Retry pending submissions on load ───
  useEffect(() => {
    const pending = getPendingSubmit();
    if (pending && pending.taskId === taskId) {
      // Attempt retry
      handleSubmit(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Navigation ───
  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const updateSection = useCallback((section) => (data) => {
    setFormData((prev) => ({ ...prev, [section]: data }));
  }, []);

  // ─── Build the info text for an elevation ───
  function buildInfoText(elevData) {
    const parts = [];
    if (elevData.condition === "Some Defects Present" && elevData.defects?.length > 0) {
      parts.push("Defects: " + elevData.defects.join(", ") + ".");
    }
    if (elevData.condition === "Catastrophic Failure") {
      parts.push("Catastrophic failure observed. See notes.");
    }
    if (elevData.notes?.trim()) {
      parts.push(elevData.notes.trim());
    }
    if (elevData.condition === "Good Condition" && parts.length === 0) {
      parts.push("No defects observed.");
    }
    return parts.join(" ");
  }

  // ─── Submit to ClickUp ───
  async function handleSubmit(isRetry = false) {
    setSubmitting(true);
    setSubmitError(null);

    try {
      // ── CALL 1: Upload attachments ──
      const uploadResults = {};

      // Upload elevation photos
      for (const elev of ELEVATIONS) {
        const photos = formData[elev.key]?.photos || [];
        for (const photo of photos) {
          if (photo instanceof File) {
            await uploadAttachment(taskId, photo, WRITE_FIELDS[elev.attachmentField]);
          }
        }
      }

      // Upload 360 video
      if (formData.summary.video instanceof File) {
        await uploadAttachment(taskId, formData.summary.video, WRITE_FIELDS.video360);
      }

      // Upload signature as attachment
      if (formData.signoff.signature) {
        const sigBlob = await (await fetch(formData.signoff.signature)).blob();
        const sigFile = new File([sigBlob], "inspector-signature.png", { type: "image/png" });
        await uploadAttachment(taskId, sigFile);
      }

      // ── CALL 2: Update all custom fields ──

      // Parapet Materials (dropdown)
      if (formData.construction.material) {
        const optionId = PARAPET_MATERIALS_OPTIONS[formData.construction.material];
        if (optionId) {
          await setField(taskId, WRITE_FIELDS.parapetMaterials, optionId);
        }
      }

      // Past Repairs (text)
      if (formData.construction.pastRepairs) {
        await setField(taskId, WRITE_FIELDS.pastRepairs, formData.construction.pastRepairs);
      }

      // Per-elevation condition + info
      for (const elev of ELEVATIONS) {
        const elevData = formData[elev.key];
        if (!elevData?.condition) continue;

        // Condition dropdown
        const conditionOptions = CONDITION_OPTIONS[elev.key];
        const condOptionId = conditionOptions[elevData.condition];
        if (condOptionId) {
          await setField(taskId, WRITE_FIELDS[elev.conditionField], condOptionId);
        }

        // Info text (defects + notes combined)
        const infoText = buildInfoText(elevData);
        if (infoText) {
          await setField(taskId, WRITE_FIELDS[elev.infoField], infoText);
        }
      }

      // Parapet Score (emoji field)
      if (formData.summary.score) {
        const scoreVal = PARAPET_SCORE_MAP[formData.summary.score];
        if (scoreVal !== undefined) {
          await setField(taskId, WRITE_FIELDS.parapetScore, scoreVal);
        }
      }

      // ── CALL 3: Flip Project Phase to Inspected ──
      await setField(
        taskId,
        WRITE_FIELDS.projectPhase,
        PROJECT_PHASE_OPTIONS["Inspected"]
      );

      // Success!
      clearDraft();
      clearPending();
      setSubmitted(true);
    } catch (err) {
      console.error("Submit failed:", err);

      if (!navigator.onLine) {
        // Save for retry when back online
        queuePendingSubmit(taskId, formData);
        setSubmitError(
          "No signal. Your data is saved locally and will submit automatically when you're back online."
        );

        // Listen for reconnection
        const retryOnline = () => {
          window.removeEventListener("online", retryOnline);
          handleSubmit(true);
        };
        window.addEventListener("online", retryOnline);
      } else {
        setSubmitError(`Submit failed: ${err.message}. Tap "Submit" to retry.`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Loading state ───
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-capitol-blue border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading building data...</p>
          <p className="text-sm text-gray-400 mt-1">Pulling from ClickUp</p>
        </div>
      </main>
    );
  }

  // ─── Error state ───
  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-lg font-bold text-red-600 mb-2">Failed to Load</h1>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-capitol-blue text-white rounded-xl font-medium"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  // ─── Success state ───
  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">Inspection Submitted</h1>
          <p className="text-gray-600 mb-2">
            All data and photos have been written to the project task.
          </p>
          <p className="text-sm text-gray-500">
            Project Phase has been set to <strong>Inspected</strong>.
          </p>
          <div className="mt-6 p-4 bg-gray-100 rounded-xl">
            <p className="text-xs text-gray-500">
              You can close this page. The report generation pipeline will take it from here.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ─── Wizard steps ───
  return (
    <main className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-capitol-navy text-white px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-blue-300 font-medium">LL126 FIELD INSPECTOR</div>
          <div className="text-sm font-bold truncate max-w-[250px]">
            {taskData?.fields?.address || taskData?.name || "Inspection"}
          </div>
        </div>
        <div className="text-2xl">🏗️</div>
      </div>

      <ProgressBar current={step} total={TOTAL_STEPS} />

      {/* Submit error banner */}
      {submitError && (
        <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      {/* Step content */}
      {step === 0 && (
        <DispatchConfirmation taskData={taskData} onNext={next} />
      )}
      {step === 1 && (
        <ParapetConstruction
          data={formData.construction}
          onChange={updateSection("construction")}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 2 && (
        <ElevationInspection
          direction="North"
          data={formData.north}
          onChange={updateSection("north")}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 3 && (
        <ElevationInspection
          direction="East"
          data={formData.east}
          onChange={updateSection("east")}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 4 && (
        <ElevationInspection
          direction="South"
          data={formData.south}
          onChange={updateSection("south")}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 5 && (
        <ElevationInspection
          direction="West"
          data={formData.west}
          onChange={updateSection("west")}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 6 && (
        <ObservationSummary
          data={formData.summary}
          onChange={updateSection("summary")}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 7 && (
        <InspectorSignOff
          data={formData.signoff}
          onChange={updateSection("signoff")}
          onSubmit={() => handleSubmit(false)}
          onBack={back}
          isSubmitting={submitting}
        />
      )}
    </main>
  );
}
