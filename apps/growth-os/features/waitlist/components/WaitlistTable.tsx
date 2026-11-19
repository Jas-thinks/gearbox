"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { convertWaitlistToLeadAction } from "@/features/crm/services/actions";
import { formatDate, snakeToTitle } from "@/utils/format";
import type { WaitlistEntry } from "@/types/waitlist";
import type { PaginatedResponse } from "@/types/common";
import { ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, className: "text-amber-600" },
  synced_to_crm: { label: "Synced to CRM", icon: CheckCircle2, className: "text-emerald-600" },
  disqualified: { label: "Disqualified", icon: XCircle, className: "text-red-500" },
};

interface WaitlistTableProps {
  data: PaginatedResponse<WaitlistEntry>;
}

export function WaitlistTable({ data }: WaitlistTableProps) {
  const [isPending, startTransition] = useTransition();
  const [convertingId, setConvertingId] = useState<string | null>(null);

  const handleConvert = (entry: WaitlistEntry) => {
    setConvertingId(entry.id);
    startTransition(async () => {
      const result = await convertWaitlistToLeadAction(entry.id, {
        name: entry.name,
        email: entry.email,
        city: entry.city,
        creator_type: entry.creator_type,
        interested_equipment: entry.interested_equipment,
      });

      if (result.success) {
        toast.success("Converted to CRM lead!", {
          action: {
            label: "View Lead",
            onClick: () => window.open(`/crm/${result.data?.leadId}`, "_blank"),
          },
        });
      } else {
        toast.error(result.error ?? "Conversion failed.");
      }
      setConvertingId(null);
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead>Contact</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden lg:table-cell">Equipment Interest</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden xl:table-cell">Source</TableHead>
            <TableHead className="hidden xl:table-cell">Signed Up</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                No waitlist entries yet.
              </TableCell>
            </TableRow>
          ) : (
            data.data.map((entry) => {
              const statusConfig = STATUS_CONFIG[entry.status] ?? STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;

              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">{entry.email}</p>
                      {entry.city && (
                        <p className="text-xs text-muted-foreground">{entry.city}</p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {entry.creator_type ? (
                      <span className="text-sm text-muted-foreground">
                        {snakeToTitle(entry.creator_type)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {entry.interested_equipment.slice(0, 2).map((eq) => (
                        <Badge key={eq} variant="outline" className="text-xs">
                          {eq}
                        </Badge>
                      ))}
                      {entry.interested_equipment.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{entry.interested_equipment.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className={`flex items-center gap-1.5 ${statusConfig.className}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">{statusConfig.label}</span>
                    </div>
                    {entry.synced_lead_id && (
                      <Link
                        href={`/crm/${entry.synced_lead_id}`}
                        className="mt-0.5 text-xs text-primary hover:underline"
                      >
                        View Lead →
                      </Link>
                    )}
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {entry.utm_source ? snakeToTitle(entry.utm_source) : "—"}
                    </span>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(entry.created_at)}
                    </span>
                  </TableCell>

                  <TableCell>
                    {entry.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => handleConvert(entry)}
                        disabled={isPending && convertingId === entry.id}
                      >
                        <ArrowRight className="mr-1 h-3 w-3" />
                        To CRM
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
