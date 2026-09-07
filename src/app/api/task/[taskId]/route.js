import { NextResponse } from "next/server";

const CU = "https://api.clickup.com/api/v2";

export async function GET(request, { params }) {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "CLICKUP_API_TOKEN not configured" },
      { status: 500 }
    );
  }

  const { taskId } = params;

  try {
    const res = await fetch(
      `${CU}/task/${taskId}/?custom_fields=true&include_subtasks=false`,
      {
        headers: { Authorization: token },
        // Don't cache — always fetch live data
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: `ClickUp API error: ${res.status}`, detail: body },
        { status: res.status }
      );
    }

    const task = await res.json();

    // Extract custom fields into a flat map for the frontend
    const fields = {};
    if (task.custom_fields) {
      for (const cf of task.custom_fields) {
        fields[cf.id] = {
          id: cf.id,
          name: cf.name,
          type: cf.type,
          value: cf.value,
          type_config: cf.type_config,
        };
      }
    }

    return NextResponse.json({
      id: task.id,
      name: task.name,
      status: task.status?.status,
      fields,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reach ClickUp API", detail: err.message },
      { status: 502 }
    );
  }
}
