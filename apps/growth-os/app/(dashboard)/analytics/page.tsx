import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Deep insights into your growth and campaign performance"
      />
      <ComingSoon
        module="Analytics Module"
        milestone="Milestone 5"
        features={[
          "Conversion funnel visualization",
          "Campaign performance comparisons",
          "Lead source attribution",
          "City and geography breakdown",
          "Growth rate trending",
          "Email statistics dashboard",
        ]}
      />
    </div>
  );
}
