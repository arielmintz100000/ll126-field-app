/**
 * Offline storage: saves inspection state to localStorage so nothing
 * is lost if the phone drops signal on a rooftop.
 */

const DRAFT_KEY = "ll126_draft";
const PENDING_KEY = "ll126_pending_submit";

/** Save in-progress inspection data */
export function saveDraft(taskId, data) {
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ taskId, data, savedAt: Date.now() })
    );
  } catch {
    // Storage full or unavailable — fail silently
  }
}

/** Load draft for a given task */
export function loadDraft(taskId) {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.taskId !== taskId) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

/** Clear draft after successful submit */
export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

/** Queue a submission for retry when offline */
export function queuePendingSubmit(taskId, payload) {
  try {
    localStorage.setItem(
      PENDING_KEY,
      JSON.stringify({ taskId, payload, queuedAt: Date.now() })
    );
  } catch {
    // Fail silently
  }
}

/** Check for pending submissions */
export function getPendingSubmit() {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Clear pending after successful retry */
export function clearPending() {
  localStorage.removeItem(PENDING_KEY);
}
