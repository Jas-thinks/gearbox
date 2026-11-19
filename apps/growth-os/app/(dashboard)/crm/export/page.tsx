"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { snakeToTitle } from "@/utils/format";

const STATUSES = [
  "created", "research", "qualified", "campaign_assigned", "email_sent",
  "follow_up", "interested", "meeting", "waitlist", "customer",
];

const CREATOR_TYPES = [
  "photographer", "wedding_studio", "drone_operator", "rental_shop",
  "agency", "production_house", "influencer", "college_club", "filmmaker",
];

export default function CRMExportPage() {
  const [status, setStatus] = useState("");
  const [creatorType, setCreatorType] = useState("");
  const [city, setCity] = useState("");

  const buildExportUrl = () => {
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    if (creatorType && creatorType !== "all") params.set("creator_type", creatorType);
    if (city) params.set("city", city);
    return `/api/leads/export?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/crm"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <PageHeader title="Export Leads" description="Download your CRM data as a CSV file" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Export Filters</CardTitle>
          <CardDescription>Leave filters empty to export all leads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status || "all"} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{snakeToTitle(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Creator Type</Label>
            <Select value={creatorType || "all"} onValueChange={(v) => setCreatorType(v === "all" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {CREATOR_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{snakeToTitle(t)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>City</Label>
            <Input
              placeholder="e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <a href={buildExportUrl()} download>
              <Button className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Export includes: Name, Email, Phone, Website, Instagram, LinkedIn, City, State, Country,
            Creator Type, Business, Equipment, Status, Score, Source, Tags, Notes, Created At
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
