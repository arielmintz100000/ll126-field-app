import { NextResponse } from "next/server";

const CU = "https://api.clickup.com/api/v2";

export async function POST(request, { params }) {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "CLICKUP_API_TOKEN not configured" },
      { status: 500 }
    );
  }

  const { taskId } = params;

  try {
    // Read the incoming multipart form
    const incoming = await request.formData();
    const file = incoming.get("attachment");
    const customFieldId = incoming.get("custom_field_id");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Build the outgoing form for ClickUp
    const outgoing = new FormData();
    outgoing.append("attachment", file, file.name);

    // Determine endpoint: custom field attachment or general task attachment
    let url;
    if (customFieldId) {
      // Upload directly to the custom field
      url = `${CU}/task/${taskId}/field/${customFieldId}`;
    } else {
      // General task attachment
      url = `${CU}/task/${taskId}/attachment`;
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: token },
      body: outgoing,
    });

    if (!res.ok) {
      const body = await res.text();
      // If custom-field upload fails, fall back to general attachment
      if (customFieldId && res.status >= 400) {
        const fallback = await fetch(`${CU}/task/${taskId}/attachment`, {
          method: "POST",
          headers: { Authorization: token },
          body: outgoing,
        });
        if (fallback.ok) {
          const data = await fallback.json();
          return NextResponse.json(data);
        }
      }
      return NextResponse.json(
        { error: `Upload failed: ${res.status}`, detail: body },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Upload failed", detail: err.message },
      { status: 502 }
    );
  }
}

// Allow large file uploads (videos up to 100 MB)
export const config = {
  api: { bodyParser: false },
};
