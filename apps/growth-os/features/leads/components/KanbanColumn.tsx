"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Lead } from "@/types/lead";
import { KanbanCard } from "./KanbanCard";
import { cn } from "@/utils/cn";

interface KanbanColumnProps {
  id: string;
  label: string;
  leads: Lead[];
  color: string;
  activeId?: string | null;
}

export function KanbanColumn({ id, label, leads, color, activeId }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={cn(
        "flex min-w-[220px] flex-col rounded-xl border border-border bg-muted/30 transition-colors",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", color)} />
          <span className="text-xs font-semibold text-foreground">{label}</span>
        </div>
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
          {leads.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto p-2"
        style={{ minHeight: "100px", maxHeight: "calc(100vh - 280px)" }}
      >
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <KanbanCard
              key={lead.id}
              lead={lead}
              isDragging={activeId === lead.id}
            />
          ))}
        </SortableContext>

        {leads.length === 0 && (
          <div className="flex items-center justify-center py-8 text-xs text-muted-foreground/50">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
