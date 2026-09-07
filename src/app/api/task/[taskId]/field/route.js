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
  const { fieldId, value } = await request.json();

  if (!fieldId) {
    return NextResponse.json({ error: "fieldId is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${CU}/task/${taskId}/field/${fieldId}`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: `ClickUp API error: ${res.status}`, detail: body },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reach ClickUp API", detail: err.message },
      { status: 502 }
    );
  }
}
