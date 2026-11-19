-- =============================================================================
-- Gearbox Growth OS — Initial Schema
-- Migration: 001_initial_schema.sql
-- =============================================================================
-- Design principles:
--   • UUIDs for all primary keys (portable, no auto-increment collisions)
--   • Soft deletes with deleted_at
--   • created_at / updated_at on every table
--   • Proper foreign keys with appropriate ON DELETE actions
--   • GIN indexes for array columns (tags, equipment)
--   • BTREE indexes for all commonly filtered columns
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy text search

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE lead_status AS ENUM (
  'created',
  'research',
  'qualified',
  'campaign_assigned',
  'ai_personalized',
  'approval_queue',
  'email_sent',
  'follow_up',
  'interested',
  'meeting',
  'waitlist',
  'marketplace_user',
  'customer',
  'disqualified',
  'unsubscribed'
);

CREATE TYPE creator_type AS ENUM (
  'photographer',
  'wedding_studio',
  'drone_operator',
  'rental_shop',
  'agency',
  'production_house',
  'influencer',
  'college_club',
  'videographer',
  'filmmaker',
  'content_creator',
  'other'
);

CREATE TYPE lead_source AS ENUM (
  'manual',
  'csv_import',
  'waitlist',
  'referral',
  'instagram',
  'linkedin',
  'google',
  'cold_outreach',
  'partner',
  'other'
);

CREATE TYPE rental_frequency AS ENUM (
  'daily',
  'weekly',
  'monthly',
  'occasionally',
  'unknown'
);

CREATE TYPE campaign_status AS ENUM (
  'draft',
  'active',
  'paused',
  'completed',
  'archived'
);

CREATE TYPE campaign_goal AS ENUM (
  'owner_acquisition',
  'rental_shop_onboarding',
  'college_outreach',
  'creator_onboarding',
  'investor_outreach',
  'partner_acquisition',
  'custom'
);

CREATE TYPE audience_type AS ENUM (
  'photographers',
  'wedding_studios',
  'drone_operators',
  'rental_shops',
  'agencies',
  'production_houses',
  'influencers',
  'college_clubs',
  'all_creators',
  'custom'
);

CREATE TYPE email_status AS ENUM (
  'draft',
  'queued',
  'approved',
  'sent',
  'delivered',
  'opened',
  'clicked',
  'replied',
  'bounced',
  'failed',
  'unsubscribed'
);

CREATE TYPE email_provider AS ENUM (
  'smtp',
  'resend',
  'ses',
  'postmark',
  'mailgun'
);

CREATE TYPE activity_type AS ENUM (
  'lead_created',
  'status_changed',
  'email_sent',
  'email_opened',
  'email_replied',
  'note_added',
  'tag_added',
  'tag_removed',
  'campaign_assigned',
  'ai_generated',
  'meeting_scheduled',
  'field_updated'
);

CREATE TYPE waitlist_status AS ENUM (
  'pending',
  'synced_to_crm',
  'disqualified'
);

-- =============================================================================
-- LEADS
-- =============================================================================

CREATE TABLE leads (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Personal
  name                    TEXT NOT NULL,
  email                   TEXT NOT NULL,
  phone                   TEXT,
  website                 TEXT,

  -- Social
  instagram_handle        TEXT,
  linkedin_url            TEXT,

  -- Location
  city                    TEXT,
  state                   TEXT,
  country                 TEXT DEFAULT 'India',

  -- Business
  creator_type            creator_type,
  business_name           TEXT,

  -- Equipment (arrays for flexibility)
  owned_equipment         TEXT[] NOT NULL DEFAULT '{}',
  interested_equipment    TEXT[] NOT NULL DEFAULT '{}',
  rental_frequency        rental_frequency,

  -- Pipeline
  status                  lead_status NOT NULL DEFAULT 'created',
  lead_score              SMALLINT NOT NULL DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
  lead_source             lead_source NOT NULL DEFAULT 'manual',

  -- Meta
  notes                   TEXT,
  tags                    TEXT[] NOT NULL DEFAULT '{}',
  assigned_campaign_id    UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  assigned_to             UUID, -- future: references team_members(id)

  -- AI fields
  ai_summary              TEXT,
  ai_pitch                TEXT,
  ai_personalized_email   TEXT,
  ai_follow_up            TEXT,

  -- Tracking
  last_contacted_at       TIMESTAMPTZ,
  last_replied_at         TIMESTAMPTZ,
  emails_sent_count       INT NOT NULL DEFAULT 0,

  -- Audit
  deleted_at              TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT leads_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT leads_score_range CHECK (lead_score BETWEEN 0 AND 100)
);

-- Unique email per non-deleted lead
CREATE UNIQUE INDEX leads_email_unique ON leads(email) WHERE deleted_at IS NULL;

-- Performance indexes
CREATE INDEX leads_status_idx          ON leads(status) WHERE deleted_at IS NULL;
CREATE INDEX leads_creator_type_idx    ON leads(creator_type) WHERE deleted_at IS NULL;
CREATE INDEX leads_lead_source_idx     ON leads(lead_source) WHERE deleted_at IS NULL;
CREATE INDEX leads_campaign_idx        ON leads(assigned_campaign_id) WHERE deleted_at IS NULL;
CREATE INDEX leads_city_idx            ON leads(city) WHERE deleted_at IS NULL;
CREATE INDEX leads_country_idx         ON leads(country) WHERE deleted_at IS NULL;
CREATE INDEX leads_created_at_idx      ON leads(created_at DESC);
CREATE INDEX leads_lead_score_idx      ON leads(lead_score DESC) WHERE deleted_at IS NULL;

-- Full-text search
CREATE INDEX leads_name_trgm_idx       ON leads USING GIN(name gin_trgm_ops);
CREATE INDEX leads_email_trgm_idx      ON leads USING GIN(email gin_trgm_ops);

-- Array indexes
CREATE INDEX leads_tags_gin_idx        ON leads USING GIN(tags);
CREATE INDEX leads_owned_equipment_gin ON leads USING GIN(owned_equipment);
CREATE INDEX leads_interested_equipment_gin ON leads USING GIN(interested_equipment);

-- =============================================================================
-- CAMPAIGNS
-- =============================================================================

CREATE TABLE campaigns (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                    TEXT NOT NULL,
  description             TEXT,
  goal                    campaign_goal NOT NULL,
  audience_type           audience_type NOT NULL,
  status                  campaign_status NOT NULL DEFAULT 'draft',

  -- Configuration
  max_emails_per_day      INT NOT NULL DEFAULT 50,
  follow_up_days          INT[] NOT NULL DEFAULT '{0,3,7}',
  stop_on_reply           BOOLEAN NOT NULL DEFAULT TRUE,

  -- Targeting
  target_lead_statuses    TEXT[] NOT NULL DEFAULT '{}',
  target_creator_types    TEXT[] NOT NULL DEFAULT '{}',
  target_cities           TEXT[] NOT NULL DEFAULT '{}',
  target_countries        TEXT[] NOT NULL DEFAULT '{}',

  -- Denormalized stats (updated by triggers or background jobs)
  total_leads             INT NOT NULL DEFAULT 0,
  emails_sent             INT NOT NULL DEFAULT 0,
  emails_opened           INT NOT NULL DEFAULT 0,
  emails_replied          INT NOT NULL DEFAULT 0,
  meetings_booked         INT NOT NULL DEFAULT 0,
  converted               INT NOT NULL DEFAULT 0,

  -- Meta
  created_by              UUID, -- future: references team_members(id)
  started_at              TIMESTAMPTZ,
  completed_at            TIMESTAMPTZ,

  -- Audit
  deleted_at              TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX campaigns_status_idx   ON campaigns(status) WHERE deleted_at IS NULL;
CREATE INDEX campaigns_goal_idx     ON campaigns(goal) WHERE deleted_at IS NULL;
CREATE INDEX campaigns_created_idx  ON campaigns(created_at DESC);

-- Add FK now that campaigns table exists
ALTER TABLE leads ADD CONSTRAINT leads_campaign_fk
  FOREIGN KEY (assigned_campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL;

-- =============================================================================
-- EMAIL TEMPLATES
-- =============================================================================

CREATE TABLE email_templates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id     UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  subject         TEXT NOT NULL,
  body_html       TEXT NOT NULL,
  body_text       TEXT NOT NULL DEFAULT '',
  sequence_order  SMALLINT NOT NULL DEFAULT 0,
  delay_days      SMALLINT NOT NULL DEFAULT 0,
  variables       TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX email_templates_campaign_idx ON email_templates(campaign_id);
CREATE INDEX email_templates_order_idx    ON email_templates(campaign_id, sequence_order);

-- =============================================================================
-- EMAIL LOGS
-- =============================================================================

CREATE TABLE email_logs (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id             UUID NOT NULL REFERENCES leads(id) ON DELETE RESTRICT,
  campaign_id         UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  template_id         UUID REFERENCES email_templates(id) ON DELETE SET NULL,

  to_email            TEXT NOT NULL,
  to_name             TEXT,
  from_email          TEXT NOT NULL,
  from_name           TEXT,
  subject             TEXT NOT NULL,
  body_html           TEXT NOT NULL,
  body_text           TEXT,

  status              email_status NOT NULL DEFAULT 'draft',
  provider            email_provider NOT NULL DEFAULT 'smtp',
  provider_message_id TEXT,

  -- Tracking
  opened_at           TIMESTAMPTZ,
  clicked_at          TIMESTAMPTZ,
  replied_at          TIMESTAMPTZ,
  bounced_at          TIMESTAMPTZ,

  -- Scheduling
  sequence_order      SMALLINT NOT NULL DEFAULT 0,
  scheduled_at        TIMESTAMPTZ,
  sent_at             TIMESTAMPTZ,

  -- Error
  error_message       TEXT,
  metadata            JSONB,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX email_logs_lead_idx      ON email_logs(lead_id);
CREATE INDEX email_logs_campaign_idx  ON email_logs(campaign_id);
CREATE INDEX email_logs_status_idx    ON email_logs(status);
CREATE INDEX email_logs_sent_at_idx   ON email_logs(sent_at DESC);
CREATE INDEX email_logs_created_idx   ON email_logs(created_at DESC);

-- =============================================================================
-- LEAD ACTIVITIES (AUDIT TRAIL)
-- =============================================================================

CREATE TABLE lead_activities (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type   activity_type NOT NULL,
  description     TEXT NOT NULL,
  metadata        JSONB,
  performed_by    UUID, -- future: references team_members(id)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX lead_activities_lead_idx    ON lead_activities(lead_id);
CREATE INDEX lead_activities_type_idx    ON lead_activities(activity_type);
CREATE INDEX lead_activities_created_idx ON lead_activities(created_at DESC);

-- =============================================================================
-- WAITLIST
-- =============================================================================

CREATE TABLE waitlist (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT NOT NULL,
  email                 TEXT NOT NULL,
  city                  TEXT,
  creator_type          creator_type,
  interested_equipment  TEXT[] NOT NULL DEFAULT '{}',
  status                waitlist_status NOT NULL DEFAULT 'pending',
  synced_lead_id        UUID REFERENCES leads(id) ON DELETE SET NULL,
  ip_address            TEXT,
  referrer              TEXT,
  utm_source            TEXT,
  utm_medium            TEXT,
  utm_campaign          TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX waitlist_email_unique ON waitlist(email);
CREATE INDEX waitlist_status_idx          ON waitlist(status);
CREATE INDEX waitlist_created_idx         ON waitlist(created_at DESC);
CREATE INDEX waitlist_creator_type_idx    ON waitlist(creator_type);

-- =============================================================================
-- UPDATED_AT TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER email_logs_updated_at
  BEFORE UPDATE ON email_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER lead_activities_updated_at
  BEFORE UPDATE ON lead_activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER waitlist_updated_at
  BEFORE UPDATE ON waitlist
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables (access controlled by service role in server-side calls)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (server-side calls use service key)
CREATE POLICY "Service role full access on leads"
  ON leads FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on campaigns"
  ON campaigns FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on email_templates"
  ON email_templates FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on email_logs"
  ON email_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on lead_activities"
  ON lead_activities FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on waitlist"
  ON waitlist FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Public waitlist insert (for website form — anon key)
CREATE POLICY "Public can insert to waitlist"
  ON waitlist FOR INSERT TO anon WITH CHECK (true);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE leads           IS 'Core CRM table. Tracks every person in the growth pipeline.';
COMMENT ON TABLE campaigns       IS 'Outreach campaigns. Each campaign targets a segment with email sequences.';
COMMENT ON TABLE email_templates IS 'Email templates belonging to a campaign sequence.';
COMMENT ON TABLE email_logs      IS 'Every email ever sent or attempted. Full audit trail.';
COMMENT ON TABLE lead_activities IS 'Immutable activity log for every lead. Used for timeline views.';
COMMENT ON TABLE waitlist        IS 'Website waitlist entries. Auto-synced into leads table.';
