"use client";

import { useLeadFilters } from "../hooks/useLeadFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { ALL_LEAD_STATUSES, getStatusLabel } from "./LeadStatusBadge";
import { snakeToTitle } from "@/utils/format";

const CREATOR_TYPES = [
  "photographer", "wedding_studio", "drone_operator", "rental_shop",
  "agency", "production_house", "influencer", "college_club",
  "videographer", "filmmaker", "content_creator", "other",
];

const LEAD_SOURCES = [
  "manual", "csv_import", "waitlist", "referral",
  "instagram", "linkedin", "google", "cold_outreach", "partner", "other",
];

export function LeadTableFilters() {
  const { filters, setFilter, setSearch, resetFilters } = useLeadFilters();

  const hasActiveFilters =
    filters.search || filters.status || filters.creator_type ||
    filters.lead_source || filters.city;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, city, equipment…"
            defaultValue={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status */}
        <Select
          value={filters.status || "all"}
          onValueChange={(v) => setFilter("status", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ALL_LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Creator Type */}
        <Select
          value={filters.creator_type || "all"}
          onValueChange={(v) => setFilter("creator_type", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {CREATOR_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{snakeToTitle(t)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Lead Source */}
        <Select
          value={filters.lead_source || "all"}
          onValueChange={(v) => setFilter("lead_source", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {LEAD_SOURCES.map((s) => (
              <SelectItem key={s} value={s}>{snakeToTitle(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5">
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
