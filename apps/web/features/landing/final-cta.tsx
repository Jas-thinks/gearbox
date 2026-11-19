import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-700 px-8 py-16 text-center sm:px-16 sm:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to create more?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                Join thousands of creators on the waitlist. Be the first to access
                professional gear in your city.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="mt-8 bg-white text-primary hover:bg-white/90"
              >
                <Link href="/waitlist">
                  Join Waitlist
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
