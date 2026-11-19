import { Search, Send, Handshake, Sparkles } from "lucide-react";
import { Card3D } from "@/components/ui/card-3d";
import { SectionHeader } from "@/components/shared/section-header";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/fade-in";

const steps = [
  {
    step: "1",
    icon: Search,
    title: "Browse",
    description: "Explore professional gear listed by verified creators in your city.",
  },
  {
    step: "2",
    icon: Send,
    title: "Request",
    description: "Send a rental request with your dates. Owners review and approve.",
  },
  {
    step: "3",
    icon: Handshake,
    title: "Meet",
    description: "Pick up the gear locally. Inspect together and start creating.",
  },
  {
    step: "4",
    icon: Sparkles,
    title: "Create",
    description: "Shoot your project with pro equipment. Return when done.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="How it works"
            title="Rent gear in four simple steps"
            description="No complicated contracts. No hidden fees. Just great gear, when you need it."
          />
        </FadeIn>

        <StaggerContainer className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <StaggerItem key={item.step} className="relative">
              
              <Card3D className="relative flex flex-col items-center p-6 text-center">
                <div className="depth-2 mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="size-7" />
                </div>
                <span className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                  Step {item.step}
                </span>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </Card3D>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
