import { Suspense } from "react";
import { findLeads } from "@/repositories/leads/lead.repository";
import { PageHeader } from "@/components/shared/PageHeader";
import { KanbanBoard } from "@/features/leads/components/KanbanBoard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lead } from "@/types/lead";

async function PipelineContent() {
  let leads: Lead[] = [];
  try {
    const result = await findLeads({}, { page: 1, pageSize: 200 });
    leads = result.data;
  } catch {
    leads = [];
  }

  return <KanbanBoard initialLeads={leads} />;
}

function PipelineSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-96 w-56 shrink-0 rounded-xl" />
      ))}
    </div>
  );
}

export default function LeadPipelinePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Lead Pipeline"
        description="Drag and drop leads between stages to update their status"
      />
      <Suspense fallback={<PipelineSkeleton />}>
        <PipelineContent />
      </Suspense>
    </div>
  );
}
