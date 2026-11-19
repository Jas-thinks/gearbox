import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card3D } from "@/components/ui/card-3d";
import { FadeIn } from "@/components/shared/fade-in";

const tiles = [
  { src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=800&fit=crop", alt: "Professional camera", cls: "row-span-2", z: "depth-1" },
  { src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop", alt: "Drone", cls: "aspect-square", z: "depth-2" },
  { src: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop", alt: "Camera lens", cls: "aspect-square", z: "depth-1" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-36">
      <div className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-40 right-0 size-[560px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-40 left-0 size-[460px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <FadeIn direction="right">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                Early access open · India
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                Own Less.
                <br />
                <span className="text-gradient">Create More.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                The peer-to-peer marketplace for cameras, lenses, drones and production gear —
                rented from verified creators near you, with protected payments.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link href="/waitlist">
                    Join Waitlist <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/browse">Browse Equipment</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><BadgeCheck className="size-4 text-primary" /> Verified owners</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" /> Protected payments</span>
                <span className="inline-flex items-center gap-1.5"><TrendingUp className="size-4 text-primary" /> Earn from idle gear</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <div className="relative mx-auto max-w-lg [perspective:1400px]">
              <div
                className="float-slow grid grid-cols-2 gap-4 [transform-style:preserve-3d] lg:[transform:rotateY(-14deg)_rotateX(6deg)]"
              >
                {tiles.map((t, i) => (
                  <Card3D key={t.alt} intensity={6} wrapperClassName={t.cls} className="overflow-hidden p-0">
                    <Image
                      src={t.src}
                      alt={t.alt}
                      fill
                      priority={i === 0}
                      className={`object-cover ${t.z}`}
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </Card3D>
                ))}
              </div>

              <div className="float-slower absolute -left-6 bottom-6 w-48 [transform:translateZ(80px)]">
                <Card3D className="p-4 backdrop-blur">
                  <p className="text-xs text-muted-foreground">Avg. owner earnings</p>
                  <p className="text-2xl font-bold text-primary">₹18,400<span className="text-xs font-medium text-muted-foreground">/mo</span></p>
                </Card3D>
              </div>
              <div className="float-slow absolute -right-4 top-6 w-44 [transform:translateZ(80px)]">
                <Card3D className="p-4 backdrop-blur">
                  <p className="text-xs text-muted-foreground">Gear items</p>
                  <p className="text-2xl font-bold">500+<span className="ml-1 text-xs font-medium text-emerald-500">launching</span></p>
                </Card3D>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
