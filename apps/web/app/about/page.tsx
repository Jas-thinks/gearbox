import { Target, Eye, Map, Heart } from "lucide-react";
import { Card3D } from "@/components/ui/card-3d";
import { SectionHeader } from "@/components/shared/section-header";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/fade-in";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "About",
  description: "Learn about Gearbox — our mission to make professional camera equipment accessible to every creator.",
  path: "/about",
});

const values = [
  {
    icon: Heart,
    title: "Creator-first",
    description: "Every decision starts with what's best for creators — renters and owners alike.",
  },
  {
    icon: Target,
    title: "Trust & safety",
    description: "Verified users, insured rentals, and secure payments build the foundation of our community.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear pricing, honest reviews, and no hidden fees. What you see is what you get.",
  },
  {
    icon: Map,
    title: "Local community",
    description: "Gearbox connects creators in the same city — building real relationships, not just transactions.",
  },
];

const roadmap = [
  { phase: "Phase 1", title: "Waitlist & validation", status: "In progress", description: "Building community and validating demand across Indian cities." },
  { phase: "Phase 2", title: "Mumbai & Bangalore launch", status: "Coming soon", description: "First marketplace launch with verified owners and insured rentals." },
  { phase: "Phase 3", title: "Pan-India expansion", status: "Planned", description: "Rolling out to Delhi, Hyderabad, Chennai, Pune, and Goa." },
  { phase: "Phase 4", title: "Studio & production services", status: "Future", description: "Expand beyond gear to studios, crew, and post-production services." },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-24 pb-16 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
                About Gearbox
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Making pro gear accessible to every creator
              </h1>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeIn direction="right">
              <Card3D className="h-full p-8">
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Professional camera equipment shouldn&apos;t be a barrier to creative
                  expression. Gearbox exists to democratize access to cinema cameras,
                  lenses, drones, and production gear by connecting creators who need
                  equipment with owners who have gear sitting idle.
                </p>
              </Card3D>
            </FadeIn>
            <FadeIn direction="left" delay={0.1}>
              <Card3D className="h-full p-8">
                <h2 className="text-2xl font-bold">Our Vision</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We envision a world where every creator — from indie filmmakers to
                  wedding photographers — can access the exact gear they need for any
                  project, without the burden of ownership. A peer-to-peer ecosystem
                  built on trust, powered by community.
                </p>
              </Card3D>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeader eyebrow="Values" title="What we stand for" />
          </FadeIn>
          <StaggerContainer className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <Card3D className="h-full p-6 text-center">
                  <value.icon className="mx-auto size-8 text-primary" />
                  <h3 className="mt-4 font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </Card3D>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeader eyebrow="Roadmap" title="Where we're headed" />
          </FadeIn>
          <FadeIn delay={0.1} className="mt-12 space-y-6">
            {roadmap.map((item) => (
              <div
                key={item.phase}
                className="relative border-l-2 border-primary/30 pl-8 pb-2"
              >
                <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-primary" />
                <p className="text-sm font-medium text-primary">{item.phase}</p>
                <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                <span className="mt-2 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {item.status}
                </span>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>
    </>
  );
}
