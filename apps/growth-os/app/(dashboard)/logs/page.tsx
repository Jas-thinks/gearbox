import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Logs"
        description="Complete audit trail of all system events"
      />
      <ComingSoon
        module="Activity Log Viewer"
        milestone="Milestone 5"
        features={[
          "Filterable activity timeline",
          "Lead-specific audit history",
          "Email send logs",
          "Campaign events",
          "System errors and warnings",
          "Exportable log records",
        ]}
      />
    </div>
  );
}
