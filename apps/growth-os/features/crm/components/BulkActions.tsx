"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bulkUpdateStatusAction, bulkArchiveLeadsAction } from "../services/actions";
import { ALL_LEAD_STATUSES, getStatusLabel } from "./LeadStatusBadge";
import { Archive, RefreshCw, X } from "lucide-react";

interface BulkActionsProps {
  selectedIds: string[];
  onClear: () => void;
}

export function BulkActions({ selectedIds, onClear }: BulkActionsProps) {
  const [targetStatus, setTargetStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!selectedIds.length) return null;

  const handleStatusChange = () => {
    if (!targetStatus) return;
    startTransition(async () => {
      const result = await bulkUpdateStatusAction(selectedIds, targetStatus);
      if (result.success) {
        toast.success(result.message ?? "Status updated.");
        onClear();
      } else {
        toast.error(result.error ?? "Failed to update status.");
      }
    });
  };

  const handleArchive = () => {
    startTransition(async () => {
      const result = await bulkArchiveLeadsAction(selectedIds);
      if (result.success) {
        toast.success(result.message ?? "Leads archived.");
        onClear();
      } else {
        toast.error(result.error ?? "Failed to archive.");
      }
    });
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5">
      <span className="text-sm font-medium text-indigo-700">
        {selectedIds.length} selected
      </span>
      <div className="h-4 w-px bg-indigo-200" />
      <div className="flex items-center gap-2">
        <Select value={targetStatus} onValueChange={setTargetStatus}>
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="Change status…" />
          </SelectTrigger>
          <SelectContent>
            {ALL_LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">
                {getStatusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          className="h-8 text-xs"
          onClick={handleStatusChange}
          disabled={!targetStatus || isPending}
        >
          <RefreshCw className="mr-1.5 h-3 w-3" />
          Apply
        </Button>
      </div>
      <div className="h-4 w-px bg-indigo-200" />
      <Button
        size="sm"
        variant="outline"
        className="h-8 border-red-200 text-xs text-red-600 hover:bg-red-50"
        onClick={handleArchive}
        disabled={isPending}
      >
        <Archive className="mr-1.5 h-3 w-3" />
        Archive
      </Button>
      <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={onClear}>
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
