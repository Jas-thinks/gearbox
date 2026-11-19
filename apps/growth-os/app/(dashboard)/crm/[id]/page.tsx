import { notFound } from "next/navigation";
import Link from "next/link";
import { findLeadById } from "@/repositories/leads/lead.repository";
import { findActivitiesByLead } from "@/repositories/activity/activity.repository";
import { findNotesByLead } from "@/repositories/notes/notes.repository";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LeadStatusBadge } from "@/features/crm/components/LeadStatusBadge";
import { LeadScoreBadge } from "@/features/crm/components/LeadScoreBadge";
import { NotesList } from "@/features/crm/components/NotesList";
import { StatusChanger } from "@/features/crm/components/StatusChanger";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import { formatDate, formatRelativeTime, snakeToTitle } from "@/utils/format";
import {
  ArrowLeft, Edit, Globe, Camera, Link2,
  Phone, MapPin, Building2, Tag, Calendar,
  Mail, MessageSquare, Star, Clock, Briefcase,
} from "lucide-react";
import type { LeadActivity } from "@/types/lead";

interface Props {
  params: Promise<{ id: string }>;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  );
}

function ExternalLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-sm text-primary hover:underline"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}

export default async function LeadProfilePage({ params }: Props) {
  const { id } = await params;

  const [lead, activities, notes] = await Promise.allSettled([
    findLeadById(id),
    findActivitiesByLead(id, 30),
    findNotesByLead(id),
  ]);

  const leadData = lead.status === "fulfilled" ? lead.value : null;
  if (!leadData) notFound();

  const activityData = (activities.status === "fulfilled" ? activities.value : []) as LeadActivity[];
  const notesData = notes.status === "fulfilled" ? notes.value : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" className="shrink-0 mt-0.5" asChild>
            <Link href="/crm"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{leadData.name}</h1>
              <LeadScoreBadge score={leadData.lead_score} size="md" />
            </div>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              {leadData.business_name && (
                <span className="text-sm text-muted-foreground">{leadData.business_name}</span>
              )}
              {leadData.city && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {leadData.city}
                  {leadData.state ? `, ${leadData.state}` : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusChanger leadId={leadData.id} currentStatus={leadData.status} />
          <Button size="sm" asChild>
            <Link href={`/crm/${id}/edit`}>
              <Edit className="mr-1.5 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column — Info Cards */}
        <div className="space-y-4 lg:col-span-1">

          {/* Contact Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <InfoRow label="Email" value={
                <a href={`mailto:${leadData.email}`} className="text-primary hover:underline">
                  {leadData.email}
                </a>
              } />
              <InfoRow label="Phone" value={leadData.phone} />
              {leadData.website && (
                <div className="py-2 border-b border-border last:border-0">
                  <ExternalLink href={leadData.website} icon={Globe} label={leadData.website.replace(/^https?:\/\//, "")} />
                </div>
              )}
              {leadData.instagram_handle && (
                <div className="py-2 border-b border-border last:border-0">
                  <ExternalLink
                    href={`https://instagram.com/${leadData.instagram_handle}`}
                    icon={Camera}
                    label={`@${leadData.instagram_handle}`}
                  />
                </div>
              )}
              {leadData.linkedin_url && (
                <div className="py-2 last:border-0">
                  <ExternalLink href={leadData.linkedin_url} icon={Link2} label="LinkedIn Profile" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Business
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <InfoRow label="Type" value={leadData.creator_type ? snakeToTitle(leadData.creator_type) : null} />
              <InfoRow label="Studio" value={leadData.business_name} />
              <InfoRow label="Location" value={[leadData.city, leadData.state, leadData.country].filter(Boolean).join(", ")} />
              <InfoRow label="Source" value={leadData.lead_source ? snakeToTitle(leadData.lead_source) : null} />
              <InfoRow label="Added" value={formatDate(leadData.created_at)} />
            </CardContent>
          </Card>

          {/* Pipeline Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <LeadStatusBadge status={leadData.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Score</span>
                <LeadScoreBadge score={leadData.lead_score} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Emails sent</span>
                <span className="text-sm font-medium">{leadData.emails_sent_count}</span>
              </div>
              {leadData.last_contacted_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last contacted</span>
                  <span className="text-sm">{formatRelativeTime(leadData.last_contacted_at)}</span>
                </div>
              )}
              {leadData.last_replied_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last replied</span>
                  <span className="text-sm">{formatRelativeTime(leadData.last_replied_at)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {leadData.tags.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {leadData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column — Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="notes">
            <TabsList>
              <TabsTrigger value="notes">Notes ({notesData.length})</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="activity">Activity ({activityData.length})</TabsTrigger>
              <TabsTrigger value="email">Email History</TabsTrigger>
            </TabsList>

            {/* Notes */}
            <TabsContent value="notes">
              <Card>
                <CardContent className="p-4">
                  <NotesList leadId={id} initialNotes={notesData} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Equipment */}
            <TabsContent value="equipment">
              <div className="space-y-4">
                {leadData.owned_equipment.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        Owned Equipment
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {leadData.owned_equipment.length} items
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {leadData.owned_equipment.map((eq) => (
                          <Badge key={eq} variant="outline" className="text-xs">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {leadData.interested_equipment.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Camera className="h-4 w-4 text-indigo-500" />
                        Interested in Renting
                        <Badge className="ml-auto text-xs bg-indigo-100 text-indigo-700">
                          {leadData.interested_equipment.length} items
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {leadData.interested_equipment.map((eq) => (
                          <Badge key={eq} className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {leadData.rental_frequency && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Rental Frequency</span>
                        <Badge variant="outline">{snakeToTitle(leadData.rental_frequency)}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {leadData.owned_equipment.length === 0 && leadData.interested_equipment.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center text-sm text-muted-foreground">
                      No equipment information added yet.
                    </CardContent>
                  </Card>
                )}

                {/* Future placeholders */}
                <Card className="border-dashed">
                  <CardContent className="py-6 text-center">
                    <p className="text-xs text-muted-foreground">
                      Rental history and marketplace status will appear here after integration.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Timeline */}
            <TabsContent value="activity">
              <Card>
                <CardContent className="p-4">
                  <RecentActivity activities={activityData} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email History placeholder */}
            <TabsContent value="email">
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Email history will appear here once the Email Engine is active.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Coming in Milestone 3.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Internal Notes (quick view) */}
          {leadData.notes && (
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Quick Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground whitespace-pre-wrap">{leadData.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* AI Placeholder */}
          <Card className="mt-4 border-dashed border-indigo-200 bg-indigo-50/30">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-indigo-700">AI Personalization</p>
              <p className="mt-1 text-xs text-indigo-600/70">
                {leadData.ai_summary
                  ? leadData.ai_summary
                  : "AI summary, personalized pitch, and email draft will appear here after AI Engine is activated (Milestone 4)."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
