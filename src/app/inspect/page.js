"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import InspectionWizard from "@/components/InspectionWizard";

function InspectInner() {
  const params = useSearchParams();
  const taskId = params.get("taskId");

  if (!taskId) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-xl font-bold text-red-600 mb-2">Missing Task ID</h1>
          <p className="text-gray-600">
            This link is missing the <code>taskId</code> parameter.
            Open the dispatch link from your email.
          </p>
        </div>
      </main>
    );
  }

  return <InspectionWizard taskId={taskId} />;
}

export default function InspectPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-capitol-blue border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading inspection...</p>
        </div>
      </main>
    }>
      <InspectInner />
    </Suspense>
  );
}
