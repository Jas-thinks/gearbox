import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Create and manage multi-step outreach campaigns"
      />
      <ComingSoon
        module="Campaign Engine"
        milestone="Milestone 3"
        features={[
          "Unlimited campaigns with custom goals",
          "Multi-step email sequences",
          "Audience targeting and segmentation",
          "Campaign analytics and performance",
          "Schedule and throttle sends",
          "Stop on reply automation",
        ]}
      />
    </div>
  );
}
