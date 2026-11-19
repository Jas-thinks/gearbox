-- =============================================================================
-- Migration 002: Notes Table + Tag Colors
-- =============================================================================

-- Notes table for internal lead notes
CREATE TABLE IF NOT EXISTS lead_notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  is_pinned   BOOLEAN NOT NULL DEFAULT FALSE,
  created_by  UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX lead_notes_lead_idx    ON lead_notes(lead_id);
CREATE INDEX lead_notes_pinned_idx  ON lead_notes(lead_id, is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX lead_notes_created_idx ON lead_notes(created_at DESC);

ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on lead_notes"
  ON lead_notes FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER lead_notes_updated_at
  BEFORE UPDATE ON lead_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE lead_notes IS 'Internal notes for each lead. Supports pinning.';

-- Add lead_score_breakdown JSONB to leads for scoring transparency
ALTER TABLE leads ADD COLUMN IF NOT EXISTS
  score_breakdown JSONB DEFAULT '{}';
