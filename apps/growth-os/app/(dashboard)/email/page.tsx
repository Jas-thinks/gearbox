import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function EmailPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Email Engine"
        description="Draft, approve, and send personalized outreach emails"
      />
      <ComingSoon
        module="Email Engine"
        milestone="Milestone 3"
        features={[
          "SMTP email sending via Nodemailer",
          "Draft → Approve → Send workflow",
          "Template system with variables",
          "Email preview and test send",
          "Open and reply tracking",
          "Provider abstraction (Resend, SES)",
        ]}
      />
    </div>
  );
}
