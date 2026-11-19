import { WaitlistForm } from "@/features/waitlist/waitlist-form";
import { FadeIn } from "@/components/shared/fade-in";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Join Waitlist",
  description: "Join the Gearbox waitlist and be the first to rent professional camera equipment in your city.",
  path: "/waitlist",
});

export default function WaitlistPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
              Early Access
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Join the Waitlist
            </h1>
            <p className="mt-3 text-muted-foreground">
              Be among the first to access professional gear from trusted creators
              when Gearbox launches in your city.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <WaitlistForm />
        </FadeIn>
      </div>
    </div>
  );
}
