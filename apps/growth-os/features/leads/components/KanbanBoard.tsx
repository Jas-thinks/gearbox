"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { updateLeadStatusAction } from "@/features/crm/services/actions";
import type { Lead, LeadStatus } from "@/types/lead";

const PIPELINE_STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: "created",           label: "New",           color: "bg-slate-400" },
  { id: "research",          label: "Research",      color: "bg-blue-400" },
  { id: "qualified",         label: "Qualified",     color: "bg-indigo-400" },
  { id: "campaign_assigned", label: "In Campaign",   color: "bg-violet-400" },
  { id: "ai_personalized",   label: "AI Ready",      color: "bg-purple-400" },
  { id: "approval_queue",    label: "Approval",      color: "bg-amber-400" },
  { id: "email_sent",        label: "Emailed",       color: "bg-cyan-400" },
  { id: "follow_up",         label: "Follow-up",     color: "bg-sky-400" },
  { id: "interested",        label: "Interested",    color: "bg-teal-400" },
  { id: "meeting",           label: "Meeting",       color: "bg-green-400" },
  { id: "waitlist",          label: "Waitlisted",    color: "bg-lime-400" },
  { id: "customer",          label: "Customer",      color: "bg-emerald-500" },
];

interface KanbanBoardProps {
  initialLeads: Lead[];
}

export function KanbanBoard({ initialLeads }: KanbanBoardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeLead = leads.find((l) => l.id === activeId) ?? null;

  const groupedLeads = PIPELINE_STAGES.reduce<Record<string, Lead[]>>((acc, stage) => {
    acc[stage.id] = leads.filter((l) => l.status === stage.id);
    return acc;
  }, {});

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;

    // Over could be a column id (stage id) or a card id
    const targetStatus = PIPELINE_STAGES.find((s) => s.id === newStatus)
      ? newStatus
      : leads.find((l) => l.id === newStatus)?.status;

    if (!targetStatus) return;

    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead || currentLead.status === targetStatus) return;

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: targetStatus } : l))
    );

    startTransition(async () => {
      const result = await updateLeadStatusAction(leadId, targetStatus);
      if (!result.success) {
        toast.error("Failed to update status.");
        // Revert
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: currentLead.status } : l))
        );
      } else {
        toast.success(`Moved to ${PIPELINE_STAGES.find((s) => s.id === targetStatus)?.label}`);
      }
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
          <KanbanColumn
            key={stage.id}
            id={stage.id}
            label={stage.label}
            leads={groupedLeads[stage.id] ?? []}
            color={stage.color}
            activeId={activeId}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead && (
          <div className="rotate-2 shadow-2xl">
            <KanbanCard lead={activeLead} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
