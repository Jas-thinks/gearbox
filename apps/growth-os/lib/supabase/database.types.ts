/**
 * Auto-generated Supabase database types.
 * In production, generate this with: npx supabase gen types typescript
 *
 * Manually maintained until the Supabase project is created.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          website: string | null;
          instagram_handle: string | null;
          linkedin_url: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          creator_type: string | null;
          business_name: string | null;
          owned_equipment: string[];
          interested_equipment: string[];
          rental_frequency: string | null;
          status: string;
          lead_score: number;
          lead_source: string;
          notes: string | null;
          tags: string[];
          assigned_campaign_id: string | null;
          assigned_to: string | null;
          ai_summary: string | null;
          ai_pitch: string | null;
          ai_personalized_email: string | null;
          ai_follow_up: string | null;
          last_contacted_at: string | null;
          last_replied_at: string | null;
          emails_sent_count: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          website?: string | null;
          instagram_handle?: string | null;
          linkedin_url?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          creator_type?: string | null;
          business_name?: string | null;
          owned_equipment?: string[];
          interested_equipment?: string[];
          rental_frequency?: string | null;
          status?: string;
          lead_score?: number;
          lead_source?: string;
          notes?: string | null;
          tags?: string[];
          assigned_campaign_id?: string | null;
          assigned_to?: string | null;
          ai_summary?: string | null;
          ai_pitch?: string | null;
          ai_personalized_email?: string | null;
          ai_follow_up?: string | null;
          last_contacted_at?: string | null;
          last_replied_at?: string | null;
          emails_sent_count?: number;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          website?: string | null;
          instagram_handle?: string | null;
          linkedin_url?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          creator_type?: string | null;
          business_name?: string | null;
          owned_equipment?: string[];
          interested_equipment?: string[];
          rental_frequency?: string | null;
          status?: string;
          lead_score?: number;
          lead_source?: string;
          notes?: string | null;
          tags?: string[];
          assigned_campaign_id?: string | null;
          assigned_to?: string | null;
          ai_summary?: string | null;
          ai_pitch?: string | null;
          ai_personalized_email?: string | null;
          ai_follow_up?: string | null;
          last_contacted_at?: string | null;
          last_replied_at?: string | null;
          emails_sent_count?: number;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          goal: string;
          audience_type: string;
          status: string;
          max_emails_per_day: number;
          follow_up_days: number[];
          stop_on_reply: boolean;
          target_lead_statuses: string[];
          target_creator_types: string[];
          target_cities: string[];
          target_countries: string[];
          total_leads: number;
          emails_sent: number;
          emails_opened: number;
          emails_replied: number;
          meetings_booked: number;
          converted: number;
          created_by: string | null;
          started_at: string | null;
          completed_at: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          goal: string;
          audience_type: string;
          status?: string;
          max_emails_per_day?: number;
          follow_up_days?: number[];
          stop_on_reply?: boolean;
          target_lead_statuses?: string[];
          target_creator_types?: string[];
          target_cities?: string[];
          target_countries?: string[];
          total_leads?: number;
          emails_sent?: number;
          emails_opened?: number;
          emails_replied?: number;
          meetings_booked?: number;
          converted?: number;
          created_by?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          goal?: string;
          audience_type?: string;
          status?: string;
          max_emails_per_day?: number;
          follow_up_days?: number[];
          stop_on_reply?: boolean;
          target_lead_statuses?: string[];
          target_creator_types?: string[];
          target_cities?: string[];
          target_countries?: string[];
          total_leads?: number;
          emails_sent?: number;
          emails_opened?: number;
          emails_replied?: number;
          meetings_booked?: number;
          converted?: number;
          created_by?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      email_templates: {
        Row: {
          id: string;
          campaign_id: string;
          name: string;
          subject: string;
          body_html: string;
          body_text: string;
          sequence_order: number;
          delay_days: number;
          variables: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          name: string;
          subject: string;
          body_html: string;
          body_text?: string;
          sequence_order?: number;
          delay_days?: number;
          variables?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          name?: string;
          subject?: string;
          body_html?: string;
          body_text?: string;
          sequence_order?: number;
          delay_days?: number;
          variables?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      email_logs: {
        Row: {
          id: string;
          lead_id: string;
          campaign_id: string | null;
          template_id: string | null;
          to_email: string;
          to_name: string | null;
          from_email: string;
          from_name: string | null;
          subject: string;
          body_html: string;
          body_text: string | null;
          status: string;
          provider: string;
          provider_message_id: string | null;
          opened_at: string | null;
          clicked_at: string | null;
          replied_at: string | null;
          bounced_at: string | null;
          sequence_order: number;
          scheduled_at: string | null;
          sent_at: string | null;
          error_message: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          campaign_id?: string | null;
          template_id?: string | null;
          to_email: string;
          to_name?: string | null;
          from_email: string;
          from_name?: string | null;
          subject: string;
          body_html: string;
          body_text?: string | null;
          status?: string;
          provider?: string;
          provider_message_id?: string | null;
          opened_at?: string | null;
          clicked_at?: string | null;
          replied_at?: string | null;
          bounced_at?: string | null;
          sequence_order?: number;
          scheduled_at?: string | null;
          sent_at?: string | null;
          error_message?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          campaign_id?: string | null;
          template_id?: string | null;
          to_email?: string;
          to_name?: string | null;
          from_email?: string;
          from_name?: string | null;
          subject?: string;
          body_html?: string;
          body_text?: string | null;
          status?: string;
          provider?: string;
          provider_message_id?: string | null;
          opened_at?: string | null;
          clicked_at?: string | null;
          replied_at?: string | null;
          bounced_at?: string | null;
          sequence_order?: number;
          scheduled_at?: string | null;
          sent_at?: string | null;
          error_message?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lead_activities: {
        Row: {
          id: string;
          lead_id: string;
          activity_type: string;
          description: string;
          metadata: Json | null;
          performed_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          activity_type: string;
          description: string;
          metadata?: Json | null;
          performed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          activity_type?: string;
          description?: string;
          metadata?: Json | null;
          performed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      waitlist: {
        Row: {
          id: string;
          name: string;
          email: string;
          city: string | null;
          creator_type: string | null;
          interested_equipment: string[];
          status: string;
          synced_lead_id: string | null;
          ip_address: string | null;
          referrer: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          city?: string | null;
          creator_type?: string | null;
          interested_equipment?: string[];
          status?: string;
          synced_lead_id?: string | null;
          ip_address?: string | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          city?: string | null;
          creator_type?: string | null;
          interested_equipment?: string[];
          status?: string;
          synced_lead_id?: string | null;
          ip_address?: string | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
