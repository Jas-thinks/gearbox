import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  BadgeCheck,
  Calendar,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card3D } from "@/components/ui/card-3d";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/shared/fade-in";
import { formatPrice } from "@/lib/utils";
import type { Equipment } from "@/types/equipment";

interface EquipmentDetailsProps {
  equipment: Equipment;
}

export function EquipmentDetails({ equipment }: EquipmentDetailsProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <FadeIn>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
            <Image
              src={equipment.image}
              alt={equipment.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div className="absolute left-4 top-4">
              <Badge variant="warning">Coming Soon</Badge>
            </div>
          </div>
        </FadeIn>

        {equipment.images.length > 1 && (
          <FadeIn delay={0.1} className="mt-4 grid grid-cols-3 gap-3">
            {equipment.images.slice(0, 3).map((img, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted"
              >
                <Image
                  src={img}
                  alt={`${equipment.name} view ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 33vw, 20vw"
                />
              </div>
            ))}
          </FadeIn>
        )}

        <FadeIn delay={0.15} className="mt-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {equipment.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {equipment.city}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {equipment.rating} ({equipment.reviewCount} reviews)
            </span>
          </div>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            {equipment.description}
          </p>

          <Separator className="my-8" />

          <h2 className="text-xl font-semibold">Specifications</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(equipment.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
              >
                <span className="text-sm text-muted-foreground">{key}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          <h2 className="text-xl font-semibold">Reviews</h2>
          <div className="mt-4 space-y-4">
            {[1, 2].map((i) => (
              <Card3D key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                    U{i}
                  </div>
                  <div>
                    <p className="font-medium">Verified Creator</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="size-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Excellent equipment, well maintained. Would rent again when Gearbox launches.
                </p>
              </Card3D>
            ))}
          </div>
        </FadeIn>
      </div>

      <div className="space-y-6">
        <FadeIn delay={0.1}>
          <Card className="sticky top-24 p-6 shadow-xl">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(equipment.pricePerDay)}
                </p>
                <p className="text-sm text-muted-foreground">per day</p>
              </div>
              <Badge variant="warning">Coming Soon</Badge>
            </div>

            <div className="mt-6 space-y-3">
              <Button size="lg" className="w-full" disabled>
                Coming Soon
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/waitlist">Join Waitlist</Link>
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
              <Shield className="size-4 shrink-0 text-primary" />
              Fully insured rentals when we launch
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card3D>
            <CardHeader>
              <CardTitle className="text-lg">Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="relative size-12 overflow-hidden rounded-full">
                  <Image
                    src={equipment.owner.avatar}
                    alt={equipment.owner.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold">{equipment.owner.name}</p>
                    {equipment.owner.verified && (
                      <BadgeCheck className="size-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Member since {equipment.owner.memberSince}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {equipment.owner.rating}
                </span>
                <span className="text-muted-foreground">
                  {equipment.owner.reviewCount} reviews
                </span>
              </div>
            </CardContent>
          </Card3D>
        </FadeIn>

        <FadeIn delay={0.25}>
          <Card3D className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              <h3 className="font-semibold">Availability</h3>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-md text-center text-xs leading-[2rem] ${
                    i % 7 === 0 || i % 7 === 6
                      ? "bg-muted/50 text-muted-foreground"
                      : i > 7 && i < 21
                        ? "bg-primary/10 text-primary font-medium"
                        : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground text-center">
              Calendar preview — booking available at launch
            </p>
          </Card3D>
        </FadeIn>
      </div>
    </div>
  );
}
