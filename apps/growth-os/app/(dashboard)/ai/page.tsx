import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function AIPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Engine"
        description="Generate personalized pitches and emails using AI"
      />
      <ComingSoon
        module="AI Personalization Engine"
        milestone="Milestone 4"
        features={[
          "Gemini integration for lead analysis",
          "Personalized email generation",
          "Lead summary and pitch suggestions",
          "Missing information detection",
          "Follow-up message drafting",
          "OpenAI provider support",
        ]}
      />
    </div>
  );
}
