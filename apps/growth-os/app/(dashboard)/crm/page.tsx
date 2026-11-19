import { Suspense } from "react";
import Link from "next/link";
import { findLeads } from "@/repositories/leads/lead.repository";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadTableFilters } from "@/features/crm/components/LeadTableFilters";
import { LeadTable } from "@/features/crm/components/LeadTable";
import { LeadTablePaginationWrapper } from "@/features/crm/components/LeadTablePaginationWrapper";
import { Plus, Download } from "lucide-react";
import type { LeadFiltersInput } from "@/schemas/lead.schema";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function LeadTableContent({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const pageSize = 25;

  const filters: Partial<LeadFiltersInput> = {
    search: searchParams.search as string | undefined,
    status: searchParams.status as LeadFiltersInput["status"] | undefined,
    creator_type: searchParams.creator_type as LeadFiltersInput["creator_type"] | undefined,
    lead_source: searchParams.lead_source as LeadFiltersInput["lead_source"] | undefined,
    city: searchParams.city as string | undefined,
  };

  const sort = (searchParams.sort as string) || "created_at";
  const order = ((searchParams.order as string) || "desc") as "asc" | "desc";

  let data;
  try {
    data = await findLeads(filters, { page, pageSize });
  } catch {
    data = { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  return (
    <LeadTablePaginationWrapper
      data={data}
      currentSort={sort}
      currentOrder={order}
    />
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-md" />
      ))}
    </div>
  );
}

export default async function CRMPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-5">
      <PageHeader
        title="CRM"
        description="Manage all leads in your growth pipeline"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/crm/export">
                <Download className="mr-1.5 h-4 w-4" />
                Export
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/crm/new">
                <Plus className="mr-1.5 h-4 w-4" />
                Add Lead
              </Link>
            </Button>
          </div>
        }
      />

      <LeadTableFilters />

      <Suspense key={JSON.stringify(params)} fallback={<TableSkeleton />}>
        <LeadTableContent searchParams={params} />
      </Suspense>
    </div>
  );
}
