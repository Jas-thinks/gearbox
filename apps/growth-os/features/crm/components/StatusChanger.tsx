"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { updateLeadStatusAction } from "../services/actions";
import { snakeToTitle } from "@/utils/format";
import { Loader2 } from "lucide-react";

const LEAD_STATUSES = [
  "created", "research", "qualified", "campaign_assigned",
  "ai_personalized", "approval_queue", "email_sent", "follow_up",
  "interested", "meeting", "waitlist", "marketplace_user", "customer",
  "disqualified", "unsubscribed",
];

interface StatusChangerProps {
  leadId: string;
  currentStatus: string;
}

export function StatusChanger({ leadId, currentStatus }: StatusChangerProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus: string) => {
    if (newStatus === currentStatus) return;
    startTransition(async () => {
      const result = await updateLeadStatusAction(leadId, newStatus);
      if (result.success) toast.success(`Status → ${snakeToTitle(newStatus)}`);
      else toast.error(result.error ?? "Failed to update status.");
    });
  };

  return (
    <div className="flex items-center gap-2">
      {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      <Select value={currentStatus} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger className="h-8 w-[180px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LEAD_STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="text-xs">
              {snakeToTitle(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
