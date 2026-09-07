/**
 * Client-side helpers that call OUR API routes (which proxy to ClickUp).
 * The ClickUp API token never leaves the server.
 */

const BASE = "/api/task";

/** Fetch task data including custom fields */
export async function fetchTask(taskId) {
  const res = await fetch(`${BASE}/${taskId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to load task (${res.status})`);
  }
  return res.json();
}

/** Set a custom field value (text, dropdown, number, emoji) */
export async function setField(taskId, fieldId, value) {
  const res = await fetch(`${BASE}/${taskId}/field`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fieldId, value }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to set field (${res.status})`);
  }
  return res.json();
}

/** Upload a file attachment to a task */
export async function uploadAttachment(taskId, file, customFieldId) {
  const formData = new FormData();
  formData.append("attachment", file);
  if (customFieldId) {
    formData.append("custom_field_id", customFieldId);
  }
  const res = await fetch(`${BASE}/${taskId}/attachment`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to upload (${res.status})`);
  }
  return res.json();
}
