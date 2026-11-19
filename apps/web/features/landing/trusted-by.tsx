import { FadeIn } from "@/components/shared/fade-in";
import { trustedLogos } from "@/lib/data";

export function TrustedBy() {
  return (
    <section className="border-y border-border bg-muted/20 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by creators
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {trustedLogos.map((logo) => (
              <span
                key={logo}
                className="text-lg font-semibold text-muted-foreground/60 transition-colors hover:text-muted-foreground"
              >
                {logo}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
