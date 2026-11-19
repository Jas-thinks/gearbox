import { notFound } from "next/navigation";
import Link from "next/link";
import { findLeadById } from "@/repositories/leads/lead.repository";
import { LeadForm } from "@/features/crm/components/LeadForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLeadPage({ params }: Props) {
  const { id } = await params;

  let lead;
  try {
    lead = await findLeadById(id);
  } catch {
    lead = null;
  }

  if (!lead) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/crm/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={`Edit — ${lead.name}`}
          description="Update lead information"
        />
      </div>
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <LeadForm lead={lead} />
      </div>
    </div>
  );
}
