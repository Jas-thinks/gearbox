import { ShieldCheck, BadgeCheck, Star, Wallet, FileCheck2, Headphones } from "lucide-react";
import { Card3D } from "@/components/ui/card-3d";
import { SectionHeader } from "@/components/shared/section-header";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/fade-in";

const items = [
  { icon: BadgeCheck, title: "KYC-verified owners", description: "Government ID and selfie checks before anyone can list gear." },
  { icon: Wallet, title: "Escrow payments", description: "Rent is held securely and released to the owner after handover." },
  { icon: ShieldCheck, title: "Damage protection", description: "Deposits and protection plans keep both sides covered." },
  { icon: FileCheck2, title: "Digital handover", description: "Photo-based condition reports at pickup and return." },
  { icon: Star, title: "Two-way reviews", description: "Owners and renters both build a reputation that travels with them." },
  { icon: Headphones, title: "Human support", description: "Real people to resolve disputes fast." },
];

export function TrustSafety() {
  return (
    <section className="bg-muted/20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="Trust & safety"
            title="Rent with confidence"
            description="Everything you need to hand over expensive gear to a stranger — and sleep well."
          />
        </FadeIn>
        <StaggerContainer className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, description }) => (
            <StaggerItem key={title}>
              <Card3D className="p-6">
                <Icon className="depth-2 size-7 text-primary" />
                <h3 className="depth-1 mt-4 text-lg font-semibold">{title}</h3>
                <p className="depth-1 mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </Card3D>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
