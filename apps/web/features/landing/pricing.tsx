import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card3D } from "@/components/ui/card-3d";
import { SectionHeader } from "@/components/shared/section-header";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/fade-in";

const plans = [
  {
    name: "Creators",
    price: "Free",
    sub: "to join and browse",
    highlight: false,
    cta: "Join as Creator",
    features: ["Browse verified gear", "Pay only for what you rent", "8% service fee per booking", "Protected payments"],
  },
  {
    name: "Owners",
    price: "0%",
    sub: "commission for early owners",
    highlight: true,
    cta: "List Your Gear",
    features: ["Unlimited listings", "Calendar & availability sync", "Escrow payouts", "Priority support & featured placement"],
  },
  {
    name: "Studios",
    price: "Custom",
    sub: "for rental houses & teams",
    highlight: false,
    cta: "Talk to us",
    features: ["Multi-location inventory", "Team accounts & roles", "API & bulk import", "Dedicated account manager"],
  },
];

export function Pricing() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="Pricing"
            title="Simple, transparent fees"
            description="No subscriptions, no surprises. We earn when you earn."
          />
        </FadeIn>
        <StaggerContainer className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <StaggerItem key={p.name}>
              <Card3D
                className={`flex flex-col p-8 ${p.highlight ? "border-primary/60 ring-1 ring-primary/30" : ""}`}
              >
                {p.highlight && (
                  <span className="depth-2 absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                    Early-access offer
                  </span>
                )}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="depth-3 mt-4 text-5xl font-bold tracking-tight">{p.price}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.sub}</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={p.highlight ? "default" : "outline"} className="mt-8">
                  <Link href={p.name === "Studios" ? "/contact" : p.name === "Owners" ? "/owners" : "/waitlist"}>{p.cta}</Link>
                </Button>
              </Card3D>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
