import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EquipmentCard } from "@/components/shared/equipment-card";
import { SectionHeader } from "@/components/shared/section-header";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/fade-in";
import { getFeaturedEquipment } from "@/lib/data";

export function FeaturedEquipment() {
  const featured = getFeaturedEquipment();

  return (
    <section className="bg-muted/20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeader
              align="left"
              eyebrow="Featured"
              title="Premium equipment"
              description="Hand-picked gear from verified creators in your city."
            />
            <Button asChild variant="outline">
              <Link href="/browse">
                View all
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((item) => (
            <StaggerItem key={item.id}>
              <EquipmentCard equipment={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
