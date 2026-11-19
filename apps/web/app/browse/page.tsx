import { Suspense } from "react";
import { BrowseContent } from "@/features/browse/browse-content";
import { FadeIn } from "@/components/shared/fade-in";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Browse Equipment",
  description: "Browse professional camera equipment from verified creators near you.",
  path: "/browse",
});

export default function BrowsePage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse Equipment
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Discover professional cameras, lenses, drones, and production gear
            from trusted creators in your city.
          </p>
        </FadeIn>

        <div className="mt-10">
          <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
            <BrowseContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
