import { Zap, Lock, CalendarCheck, Globe2 } from "lucide-react";
import { Card3D } from "@/components/ui/card-3d";
import { SectionHeader } from "@/components/shared/section-header";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/fade-in";

const stats = [
  { icon: Zap, value: "<150ms", label: "Median API response", note: "Edge-cached catalog" },
  { icon: CalendarCheck, value: "0", label: "Double-bookings", note: "Enforced by the database" },
  { icon: Lock, value: "100%", label: "Payments protected", note: "Held until handover" },
  { icon: Globe2, value: "24/7", label: "Always on", note: "Multi-AZ infrastructure" },
];

export function PlatformStats() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="Built to scale"
            title="Marketplace-grade from day one"
            description="Reliable availability, protected payments and fast search — engineered so trust never breaks as we grow."
          />
        </FadeIn>
        <StaggerContainer className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label, note }) => (
            <StaggerItem key={label}>
              <Card3D className="p-6">
                <div className="depth-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                  <Icon className="size-5" />
                </div>
                <p className="depth-3 mt-5 text-4xl font-bold tracking-tight text-gradient">{value}</p>
                <p className="depth-1 mt-1 font-medium">{label}</p>
                <p className="depth-1 mt-1 text-sm text-muted-foreground">{note}</p>
              </Card3D>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
