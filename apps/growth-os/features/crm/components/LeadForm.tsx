"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createLeadAction, updateLeadAction } from "../services/actions";
import { AlertCircle, Loader2 } from "lucide-react";
import { snakeToTitle } from "@/utils/format";
import type { Lead } from "@/types/lead";
import type { ApiResponse } from "@/types/common";

const CREATOR_TYPES = [
  "photographer", "wedding_studio", "drone_operator", "rental_shop",
  "agency", "production_house", "influencer", "college_club",
  "videographer", "filmmaker", "content_creator", "other",
];

const LEAD_SOURCES = [
  "manual", "csv_import", "waitlist", "referral",
  "instagram", "linkedin", "google", "cold_outreach", "partner", "other",
];

const LEAD_STATUSES = [
  "created", "research", "qualified", "campaign_assigned",
  "ai_personalized", "approval_queue", "email_sent", "follow_up",
  "interested", "meeting", "waitlist", "marketplace_user", "customer",
  "disqualified", "unsubscribed",
];

const RENTAL_FREQUENCIES = ["daily", "weekly", "monthly", "occasionally", "unknown"];

interface LeadFormProps {
  lead?: Lead;
  onSuccess?: (id: string) => void;
}

function TagInput({
  name, label, defaultValue, placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string[];
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue?.join(", ")}
        placeholder={placeholder ?? "Comma-separated…"}
      />
      <p className="text-xs text-muted-foreground">Separate multiple values with commas</p>
    </div>
  );
}

export function LeadForm({ lead, onSuccess }: LeadFormProps) {
  const router = useRouter();
  const isEdit = Boolean(lead);

  const action = isEdit
    ? updateLeadAction.bind(null, lead!.id, null)
    : createLeadAction;

  const [state, formAction, isPending] = useActionState(
    action as (prev: ApiResponse | null, form: FormData) => Promise<ApiResponse>,
    null
  );

  // Handle success
  if (state?.success && state.data) {
    const id = (state.data as { id?: string })?.id ?? lead?.id ?? "";
    toast.success(state.message ?? "Saved.");
    if (onSuccess) onSuccess(id);
    else router.push(`/crm/${id}`);
  }

  return (
    <form action={formAction} className="space-y-6">
      {state && !state.success && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <Tabs defaultValue="personal">
        <TabsList className="w-full">
          <TabsTrigger value="personal" className="flex-1">Personal</TabsTrigger>
          <TabsTrigger value="business" className="flex-1">Business</TabsTrigger>
          <TabsTrigger value="equipment" className="flex-1">Equipment</TabsTrigger>
          <TabsTrigger value="pipeline" className="flex-1">Pipeline</TabsTrigger>
        </TabsList>

        {/* Personal Tab */}
        <TabsContent value="personal" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" defaultValue={lead?.name} required placeholder="Arjun Sharma" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" defaultValue={lead?.email} required placeholder="arjun@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={lead?.phone ?? ""} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" defaultValue={lead?.website ?? ""} placeholder="https://arjunphoto.in" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="instagram_handle">Instagram Handle</Label>
              <Input id="instagram_handle" name="instagram_handle" defaultValue={lead?.instagram_handle ?? ""} placeholder="arjun.captures" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input id="linkedin_url" name="linkedin_url" defaultValue={lead?.linkedin_url ?? ""} placeholder="https://linkedin.com/in/arjun" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={lead?.city ?? ""} placeholder="Mumbai" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" defaultValue={lead?.state ?? ""} placeholder="Maharashtra" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" defaultValue={lead?.country ?? "India"} placeholder="India" />
            </div>
          </div>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="business_name">Business / Studio Name</Label>
              <Input id="business_name" name="business_name" defaultValue={lead?.business_name ?? ""} placeholder="Arjun Sharma Photography" />
            </div>
            <div className="space-y-1.5">
              <Label>Creator Type</Label>
              <Select name="creator_type" defaultValue={lead?.creator_type ?? undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type…" />
                </SelectTrigger>
                <SelectContent>
                  {CREATOR_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{snakeToTitle(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={lead?.notes ?? ""} placeholder="Any additional context about this lead…" rows={3} />
          </div>
          <TagInput name="tags" label="Tags" defaultValue={lead?.tags} placeholder="wedding, mumbai, high-value" />
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="mt-4 space-y-4">
          <TagInput
            name="owned_equipment"
            label="Owned Equipment"
            defaultValue={lead?.owned_equipment}
            placeholder="Sony A7III, DJI Mavic 3, Profoto B10"
          />
          <TagInput
            name="interested_equipment"
            label="Interested in Renting"
            defaultValue={lead?.interested_equipment}
            placeholder="Arri Alexa, Ronin 4D, Aputure 600D"
          />
          <div className="space-y-1.5">
            <Label>Rental Frequency</Label>
            <Select name="rental_frequency" defaultValue={lead?.rental_frequency ?? undefined}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select frequency…" />
              </SelectTrigger>
              <SelectContent>
                {RENTAL_FREQUENCIES.map((f) => (
                  <SelectItem key={f} value={f}>{snakeToTitle(f)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select name="status" defaultValue={lead?.status ?? "created"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{snakeToTitle(s)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Lead Source</Label>
              <Select name="lead_source" defaultValue={lead?.lead_source ?? "manual"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>{snakeToTitle(s)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5 max-w-[200px]">
            <Label htmlFor="lead_score">Lead Score Override (0–100)</Label>
            <Input
              id="lead_score"
              name="lead_score"
              type="number"
              min={0}
              max={100}
              defaultValue={lead?.lead_score}
              placeholder="Auto-calculated"
            />
            <p className="text-xs text-muted-foreground">Leave blank to auto-calculate from profile.</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Saving…" : "Creating…"}
            </>
          ) : (
            isEdit ? "Save Changes" : "Create Lead"
          )}
        </Button>
      </div>
    </form>
  );
}
