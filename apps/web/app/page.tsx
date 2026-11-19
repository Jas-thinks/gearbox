import { Hero } from "@/features/landing/hero";
import { TrustedBy } from "@/features/landing/trusted-by";
import { Categories } from "@/features/landing/categories";
import { FeaturedEquipment } from "@/features/landing/featured-equipment";
import { HowItWorks } from "@/features/landing/how-it-works";
import { ForOwners } from "@/features/landing/for-owners";
import { Testimonials } from "@/features/landing/testimonials";
import { PlatformStats } from "@/features/landing/platform-stats";
import { TrustSafety } from "@/features/landing/trust-safety";
import { Pricing } from "@/features/landing/pricing";
import { FAQ } from "@/features/landing/faq";
import { FinalCTA } from "@/features/landing/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Categories />
      <FeaturedEquipment />
      <HowItWorks />
      <ForOwners />
      <PlatformStats />
      <TrustSafety />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}
