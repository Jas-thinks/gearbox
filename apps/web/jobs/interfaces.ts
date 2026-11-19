/**
 * Background job interfaces — workers not implemented yet.
 * Future: BullMQ, Inngest, or Supabase Edge Functions.
 */

export interface JobPayload {
  type: string;
  data: Record<string, unknown>;
  scheduledAt?: string;
}

export interface JobHandler {
  readonly name: string;
  handle(payload: JobPayload): Promise<void>;
}

export interface EmailJob extends JobPayload {
  type: "email.send";
  data: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  };
}

export interface NotificationJob extends JobPayload {
  type: "notification.send";
  data: {
    profileId?: string;
    title: string;
    body?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface AnalyticsJob extends JobPayload {
  type: "analytics.track";
  data: {
    event: string;
    properties?: Record<string, unknown>;
  };
}

export interface CleanupJob extends JobPayload {
  type: "cleanup.run";
  data: {
    target: "sessions" | "refresh_tokens" | "activity_logs";
    olderThanDays: number;
  };
}

export interface JobQueue {
  enqueue(job: JobPayload): Promise<{ id: string }>;
}

/** No-op queue — jobs logged but not processed until workers ship */
export class DisabledJobQueue implements JobQueue {
  async enqueue(job: JobPayload): Promise<{ id: string }> {
    console.log(JSON.stringify({
      level: "info",
      message: "Job queued (disabled)",
      jobType: job.type,
      timestamp: new Date().toISOString(),
    }));
    return { id: "disabled" };
  }
}

export const jobQueue: JobQueue = new DisabledJobQueue();
