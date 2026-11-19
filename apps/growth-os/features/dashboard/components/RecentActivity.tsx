import type { LeadActivity } from "@/types/lead";
import { formatRelativeTime } from "@/utils/format";
import { snakeToTitle } from "@/utils/format";
import {
  UserPlus,
  Mail,
  MailOpen,
  MessageSquare,
  Tag,
  FileText,
  Calendar,
  Zap,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { ActivityType } from "@/types/lead";

const ACTIVITY_ICONS: Record<ActivityType, React.ElementType> = {
  lead_created: UserPlus,
  status_changed: RefreshCw,
  email_sent: Mail,
  email_opened: MailOpen,
  email_replied: MessageSquare,
  note_added: FileText,
  tag_added: Tag,
  tag_removed: Tag,
  campaign_assigned: Zap,
  ai_generated: Zap,
  meeting_scheduled: Calendar,
  field_updated: FileText,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  lead_created: "bg-emerald-100 text-emerald-700",
  status_changed: "bg-blue-100 text-blue-700",
  email_sent: "bg-indigo-100 text-indigo-700",
  email_opened: "bg-purple-100 text-purple-700",
  email_replied: "bg-green-100 text-green-700",
  note_added: "bg-slate-100 text-slate-700",
  tag_added: "bg-amber-100 text-amber-700",
  tag_removed: "bg-orange-100 text-orange-700",
  campaign_assigned: "bg-violet-100 text-violet-700",
  ai_generated: "bg-pink-100 text-pink-700",
  meeting_scheduled: "bg-teal-100 text-teal-700",
  field_updated: "bg-slate-100 text-slate-700",
};

interface RecentActivityProps {
  activities: LeadActivity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities.length) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No recent activity. Activity will appear here as you manage leads.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const Icon = ACTIVITY_ICONS[activity.activity_type] ?? FileText;
        const colorClass =
          ACTIVITY_COLORS[activity.activity_type] ?? "bg-slate-100 text-slate-700";

        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                colorClass
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground">
                {snakeToTitle(activity.activity_type)} ·{" "}
                {formatRelativeTime(activity.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
