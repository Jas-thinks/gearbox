"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadScoreBadge } from "./LeadScoreBadge";
import { BulkActions } from "./BulkActions";
import {
  archiveLeadAction, duplicateLeadAction, updateLeadStatusAction,
} from "../services/actions";
import { formatRelativeTime, snakeToTitle } from "@/utils/format";
import type { Lead } from "@/types/lead";
import type { PaginatedResponse } from "@/types/common";
import {
  MoreHorizontal, ExternalLink, Copy, Archive,
  ChevronUp, ChevronDown, User, Camera, Globe,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface LeadTableProps {
  data: PaginatedResponse<Lead>;
  currentSort: string;
  currentOrder: "asc" | "desc";
  onSortChange: (field: string) => void;
}

function SortableHead({
  field, label, currentSort, currentOrder, onSortChange
}: { field: string; label: string; currentSort: string; currentOrder: string; onSortChange: (f: string) => void }) {
  const active = currentSort === field;
  return (
    <button
      onClick={() => onSortChange(field)}
      className={cn(
        "flex items-center gap-1 text-xs font-medium uppercase tracking-wider transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      {active ? (
        currentOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
      ) : (
        <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-50" />
      )}
    </button>
  );
}

export function LeadTable({ data, currentSort, currentOrder, onSortChange }: LeadTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const allSelected = data.data.length > 0 && selectedIds.length === data.data.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : data.data.map((l) => l.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleArchive = (id: string) => {
    startTransition(async () => {
      const result = await archiveLeadAction(id);
      if (result.success) toast.success("Lead archived.");
      else toast.error(result.error ?? "Failed to archive.");
    });
  };

  const handleDuplicate = (id: string) => {
    startTransition(async () => {
      const result = await duplicateLeadAction(id);
      if (result.success) {
        toast.success("Lead duplicated.");
        if (result.data?.id) router.push(`/crm/${result.data.id}`);
      } else {
        toast.error(result.error ?? "Failed to duplicate.");
      }
    });
  };

  return (
    <div className="space-y-3">
      <BulkActions selectedIds={selectedIds} onClear={() => setSelectedIds([])} />

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  data-state={someSelected ? "indeterminate" : undefined}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>
                <SortableHead field="name" label="Lead" currentSort={currentSort} currentOrder={currentOrder} onSortChange={onSortChange} />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <SortableHead field="creator_type" label="Type" currentSort={currentSort} currentOrder={currentOrder} onSortChange={onSortChange} />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">
                <SortableHead field="lead_score" label="Score" currentSort={currentSort} currentOrder={currentOrder} onSortChange={onSortChange} />
              </TableHead>
              <TableHead className="hidden xl:table-cell">Source</TableHead>
              <TableHead className="hidden xl:table-cell">
                <SortableHead field="created_at" label="Added" currentSort={currentSort} currentOrder={currentOrder} onSortChange={onSortChange} />
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-16 text-center text-sm text-muted-foreground">
                  No leads found. Adjust your filters or add a new lead.
                </TableCell>
              </TableRow>
            ) : (
              data.data.map((lead) => (
                <TableRow
                  key={lead.id}
                  data-state={selectedIds.includes(lead.id) ? "selected" : undefined}
                  className="cursor-pointer"
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(lead.id)}
                      onCheckedChange={() => toggleOne(lead.id)}
                    />
                  </TableCell>

                  <TableCell onClick={() => router.push(`/crm/${lead.id}`)}>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{lead.name}</span>
                        {lead.instagram_handle && (
                          <Camera className="h-3 w-3 text-pink-400 shrink-0" />
                        )}
                        {lead.website && (
                          <Globe className="h-3 w-3 text-blue-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{lead.email}</span>
                      {lead.city && (
                        <span className="text-xs text-muted-foreground">{lead.city}</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell" onClick={() => router.push(`/crm/${lead.id}`)}>
                    {lead.creator_type ? (
                      <span className="text-sm text-muted-foreground">
                        {snakeToTitle(lead.creator_type)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </TableCell>

                  <TableCell onClick={() => router.push(`/crm/${lead.id}`)}>
                    <LeadStatusBadge status={lead.status} />
                  </TableCell>

                  <TableCell className="hidden lg:table-cell" onClick={() => router.push(`/crm/${lead.id}`)}>
                    <LeadScoreBadge score={lead.lead_score} />
                  </TableCell>

                  <TableCell className="hidden xl:table-cell" onClick={() => router.push(`/crm/${lead.id}`)}>
                    <span className="text-xs text-muted-foreground">
                      {snakeToTitle(lead.lead_source)}
                    </span>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell" onClick={() => router.push(`/crm/${lead.id}`)}>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(lead.created_at)}
                    </span>
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/crm/${lead.id}`} className="flex items-center gap-2">
                            <ExternalLink className="h-3.5 w-3.5" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicate(lead.id)}
                          className="gap-2"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleArchive(lead.id)}
                          className="gap-2 text-destructive focus:text-destructive"
                        >
                          <Archive className="h-3.5 w-3.5" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">
            Showing {(data.page - 1) * data.pageSize + 1}–
            {Math.min(data.page * data.pageSize, data.total)} of{" "}
            <span className="font-medium">{data.total}</span> leads
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={data.page <= 1}
              onClick={() => onSortChange("page")}
            >
              Previous
            </Button>
            <span className="px-3 text-sm text-muted-foreground">
              {data.page} / {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={data.page >= data.totalPages}
              onClick={() => onSortChange("next-page")}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
