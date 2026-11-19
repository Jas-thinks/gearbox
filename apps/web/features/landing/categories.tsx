import Link from "next/link";
import {
  Camera,
  Aperture,
  Plane,
  Lightbulb,
  Mic,
  Move3d,
} from "lucide-react";
import { Card3D } from "@/components/ui/card-3d";
import { SectionHeader } from "@/components/shared/section-header";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/fade-in";
import { categoryLabels } from "@/lib/data";
import type { EquipmentCategory } from "@/types/equipment";

const categories: {
  key: EquipmentCategory;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}[] = [
  { key: "camera", icon: Camera, gradient: "from-blue-500/20 to-blue-600/5" },
  { key: "lens", icon: Aperture, gradient: "from-violet-500/20 to-violet-600/5" },
  { key: "drone", icon: Plane, gradient: "from-sky-500/20 to-sky-600/5" },
  { key: "lighting", icon: Lightbulb, gradient: "from-amber-500/20 to-amber-600/5" },
  { key: "audio", icon: Mic, gradient: "from-emerald-500/20 to-emerald-600/5" },
  { key: "gimbal", icon: Move3d, gradient: "from-rose-500/20 to-rose-600/5" },
];

export function Categories() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="Categories"
            title="Find the gear you need"
            description="From cinema cameras to gimbals — browse professional equipment across every category."
          />
        </FadeIn>

        <StaggerContainer className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ key, icon: Icon, gradient }) => (
            <StaggerItem key={key}>
              <Link href={`/browse?category=${key}`}>
                <Card3D className={`group relative overflow-hidden p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${gradient}`}>
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-background/80 shadow-sm">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {categoryLabels[key]}
                      </h3>
                      <p className="text-sm text-muted-foreground">Browse {categoryLabels[key].toLowerCase()}s</p>
                    </div>
                  </div>
                </Card3D>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
