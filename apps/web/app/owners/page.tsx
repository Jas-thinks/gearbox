import Link from "next/link";
import { ArrowRight, IndianRupee, Shield, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card3D } from "@/components/ui/card-3d";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/shared/section-header";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/fade-in";
import { WaitlistForm } from "@/features/waitlist/waitlist-form";
import { ownerFaqItems } from "@/lib/data";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Become an Owner",
  description: "Earn passive income by renting out your professional camera equipment on Gearbox.",
  path: "/owners",
});

const benefits = [
  {
    icon: IndianRupee,
    title: "Passive income",
    description:
      "Turn idle gear into steady earnings. Owners typically earn ₹15,000–₹50,000 per month.",
  },
  {
    icon: Shield,
    title: "Full insurance",
    description:
      "Every rental is covered. Your equipment is protected from damage, theft, and loss.",
  },
  {
    icon: Users,
    title: "Verified renters",
    description:
      "Only identity-verified creators with good standing can request your gear.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    description:
      "Payments are processed securely and deposited directly to your bank account.",
  },
];

export default function OwnersPage() {
  return (
    <>
      <section className="pt-24 pb-16 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
                For Owners
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Your gear deserves to work as hard as you do
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                List your professional camera equipment on Gearbox and earn passive
                income while helping fellow creators access the gear they need.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <StaggerItem key={benefit.title}>
                <Card3D className="h-full p-8">
                  <benefit.icon className="size-8 text-primary" />
                  <h3 className="mt-4 text-xl font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </Card3D>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-muted/20 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeader
              eyebrow="FAQ"
              title="Owner questions"
              description="Everything you need to know about listing your gear."
            />
          </FadeIn>
          <FadeIn delay={0.1} className="mt-10">
            <Accordion type="single" collapsible>
              {ownerFaqItems.map((item, index) => (
                <AccordionItem key={index} value={`owner-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <WaitlistForm
              defaultRole="owner"
              title="Join Owner Waitlist"
              description="Get early access to list your gear when we launch."
            />
          </FadeIn>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-muted-foreground">Looking to rent instead?</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/browse">
                Browse equipment
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
