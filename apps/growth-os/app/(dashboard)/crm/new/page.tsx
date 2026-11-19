import { PageHeader } from "@/components/shared/PageHeader";
import { LeadForm } from "@/features/crm/components/LeadForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewLeadPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/crm">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title="Add New Lead"
          description="Fill in the details to add a new lead to your CRM"
        />
      </div>
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <LeadForm />
      </div>
    </div>
  );
}
