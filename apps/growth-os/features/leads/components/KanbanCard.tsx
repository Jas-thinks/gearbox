"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import type { Lead } from "@/types/lead";
import { LeadScoreBadge } from "@/features/crm/components/LeadScoreBadge";
import { cn } from "@/utils/cn";
import { GripVertical, MapPin, Camera } from "lucide-react";
import { snakeToTitle } from "@/utils/format";

interface KanbanCardProps {
  lead: Lead;
  isDragging?: boolean;
}

export function KanbanCard({ lead, isDragging }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: lead.id,
    data: { type: "lead", lead },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow",
        isDragging ? "opacity-50 shadow-lg" : "hover:shadow-md"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute right-2 top-2 cursor-grab opacity-0 transition-opacity group-hover:opacity-50 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <Link href={`/crm/${lead.id}`} className="block">
        <div className="flex items-start justify-between gap-2 pr-4">
          <p className="text-sm font-medium text-foreground line-clamp-1">{lead.name}</p>
          <LeadScoreBadge score={lead.lead_score} />
        </div>

        {lead.creator_type && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {snakeToTitle(lead.creator_type)}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {lead.city && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {lead.city}
            </span>
          )}
          {lead.instagram_handle && (
            <span className="flex items-center gap-0.5 text-xs text-pink-400">
              <Camera className="h-3 w-3" />
            </span>
          )}
        </div>

        {lead.owned_equipment.length > 0 && (
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1">
            {lead.owned_equipment.slice(0, 2).join(", ")}
            {lead.owned_equipment.length > 2 && ` +${lead.owned_equipment.length - 2}`}
          </p>
        )}
      </Link>
    </div>
  );
}
