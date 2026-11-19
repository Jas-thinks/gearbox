import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import type { LeadStatus } from "@/types/lead";

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  created:          { label: "New",              className: "bg-slate-100 text-slate-700 border-slate-200" },
  research:         { label: "Research",         className: "bg-blue-50 text-blue-700 border-blue-200" },
  qualified:        { label: "Qualified",        className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  campaign_assigned:{ label: "In Campaign",      className: "bg-violet-50 text-violet-700 border-violet-200" },
  ai_personalized:  { label: "AI Ready",         className: "bg-purple-50 text-purple-700 border-purple-200" },
  approval_queue:   { label: "Approval",         className: "bg-amber-50 text-amber-700 border-amber-200" },
  email_sent:       { label: "Emailed",          className: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  follow_up:        { label: "Follow-up",        className: "bg-sky-50 text-sky-700 border-sky-200" },
  interested:       { label: "Interested",       className: "bg-teal-50 text-teal-700 border-teal-200" },
  meeting:          { label: "Meeting",          className: "bg-green-50 text-green-700 border-green-200" },
  waitlist:         { label: "Waitlisted",       className: "bg-lime-50 text-lime-700 border-lime-200" },
  marketplace_user: { label: "Marketplace",      className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  customer:         { label: "Customer",         className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  disqualified:     { label: "Disqualified",     className: "bg-red-50 text-red-700 border-red-200" },
  unsubscribed:     { label: "Unsubscribed",     className: "bg-gray-100 text-gray-500 border-gray-200" },
};

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: "bg-slate-100 text-slate-700" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function getStatusLabel(status: LeadStatus): string {
  return STATUS_CONFIG[status]?.label ?? status;
}

export const ALL_LEAD_STATUSES: LeadStatus[] = Object.keys(STATUS_CONFIG) as LeadStatus[];
