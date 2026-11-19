import { Suspense } from "react";
import { findWaitlistEntries } from "@/repositories/waitlist/waitlist.repository";
import { PageHeader } from "@/components/shared/PageHeader";
import { WaitlistTable } from "@/features/waitlist/components/WaitlistTable";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/shared/StatCard";
import { Clock, CheckCircle2, Users } from "lucide-react";

async function WaitlistContent() {
  let data;
  try {
    data = await findWaitlistEntries({}, { page: 1, pageSize: 50 });
  } catch {
    data = { data: [], total: 0, page: 1, pageSize: 50, totalPages: 0 };
  }

  const pending = data.data.filter((e) => e.status === "pending").length;
  const synced = data.data.filter((e) => e.status === "synced_to_crm").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Signups" value={data.total} icon={Users} format="number" />
        <StatCard title="Pending Sync" value={pending} icon={Clock} iconClassName="bg-amber-100" format="number" />
        <StatCard title="Synced to CRM" value={synced} icon={CheckCircle2} iconClassName="bg-emerald-100" format="number" />
      </div>
      <WaitlistTable data={data} />
    </div>
  );
}

export default function WaitlistPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Waitlist"
        description="Manage website waitlist signups and convert them to CRM leads"
      />
      <Suspense fallback={<Skeleton className="h-96" />}>
        <WaitlistContent />
      </Suspense>
    </div>
  );
}
