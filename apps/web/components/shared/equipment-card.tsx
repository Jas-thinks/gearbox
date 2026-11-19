import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card3D } from "@/components/ui/card-3d";
import { formatPrice, cn } from "@/lib/utils";
import { categoryLabels } from "@/lib/data";
import type { Equipment } from "@/types/equipment";

interface EquipmentCardProps {
  equipment: Equipment;
  className?: string;
}

export function EquipmentCard({ equipment, className }: EquipmentCardProps) {
  return (
    <Link href={`/equipment/${equipment.slug}`} className={cn("group block", className)}>
      <Card3D className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={equipment.image}
            alt={equipment.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant="warning">Coming Soon</Badge>
          </div>
          <div className="absolute right-3 top-3">
            <Badge variant="secondary">{categoryLabels[equipment.category]}</Badge>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
                {equipment.name}
              </h3>
              <div className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {equipment.city}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold text-primary">{formatPrice(equipment.pricePerDay)}</p>
              <p className="text-xs text-muted-foreground">/ day</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-1.5 text-sm">
              {equipment.owner.verified && (
                <BadgeCheck className="size-4 text-primary" />
              )}
              <span className="text-muted-foreground">{equipment.owner.name}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium">{equipment.rating}</span>
            </div>
          </div>
        </div>
      </Card3D>
    </Link>
  );
}
