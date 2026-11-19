import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, IndianRupee, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card3D } from "@/components/ui/card-3d";
import { FadeIn } from "@/components/shared/fade-in";

const benefits = [
  { icon: IndianRupee, title: "Passive income", description: "Earn from gear sitting idle between shoots." },
  { icon: Shield, title: "Insurance", description: "Every rental is fully insured. Your gear is protected." },
  { icon: Users, title: "Verified renters", description: "Only approved creators can rent your equipment." },
  { icon: CreditCard, title: "Secure payments", description: "Get paid directly after each completed rental." },
];

export function ForOwners() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn direction="right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop"
                alt="Camera equipment"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-sm text-white/80">Average owner earnings</p>
                <p className="text-2xl font-bold text-white">₹25,000 / month</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.15}>
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
                For Owners
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Earn money from idle gear
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Your camera gear shouldn&apos;t collect dust. List it on Gearbox and
                earn passive income while helping fellow creators.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <Card3D key={benefit.title} className="p-4">
                    <benefit.icon className="size-5 text-primary" />
                    <h3 className="mt-2 font-semibold">{benefit.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{benefit.description}</p>
                  </Card3D>
                ))}
              </div>

              <Button asChild size="lg" className="mt-8">
                <Link href="/owners">
                  Become an Owner
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
