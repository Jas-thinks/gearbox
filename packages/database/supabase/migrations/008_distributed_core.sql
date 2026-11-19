-- Gearbox — Distributed-systems core
-- Migration: 008_distributed_core.sql
--
-- 1. Double-booking prevention enforced by the DATABASE (exclusion constraint),
--    so correctness holds no matter how many API replicas race.
-- 2. Transactional outbox: domain events are written in the SAME transaction as
--    the state change, then relayed to SQS by the worker (at-least-once).
-- 3. create_booking(): atomic, idempotent booking creation.

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ---------------------------------------------------------------------------
-- Bookings hardening
-- ---------------------------------------------------------------------------
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS service_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_date_order;
ALTER TABLE bookings ADD CONSTRAINT bookings_date_order CHECK (end_date >= start_date);

-- One logical request == one booking, even if the client retries.
CREATE UNIQUE INDEX IF NOT EXISTS uq_bookings_renter_idempotency
  ON bookings (renter_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- No two live bookings may overlap for the same equipment.
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_no_overlap;
ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (
    equipment_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  ) WHERE (status IN ('pending', 'confirmed', 'active'));

CREATE INDEX IF NOT EXISTS idx_bookings_equipment_dates
  ON bookings (equipment_id, start_date, end_date)
  WHERE status IN ('pending', 'confirmed', 'active');

-- ---------------------------------------------------------------------------
-- Transactional outbox
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS outbox_events (
  id BIGSERIAL PRIMARY KEY,
  aggregate_type TEXT NOT NULL,
  aggregate_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'dead')),
  attempts INTEGER NOT NULL DEFAULT 0,
  available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending
  ON outbox_events (available_at, id) WHERE status = 'pending';

ALTER TABLE outbox_events ENABLE ROW LEVEL SECURITY; -- service role only

-- Claim a batch for relaying. SKIP LOCKED lets N relay workers run concurrently
-- without double-processing; the 30s lease is the crash-recovery mechanism.
CREATE OR REPLACE FUNCTION claim_outbox_events(batch_size INTEGER DEFAULT 25)
RETURNS SETOF outbox_events
LANGUAGE sql
AS $$
  UPDATE outbox_events e
     SET attempts = e.attempts + 1,
         available_at = NOW() + INTERVAL '30 seconds',
         status = CASE WHEN e.attempts + 1 >= 10 THEN 'dead' ELSE 'pending' END
   WHERE e.id IN (
     SELECT id FROM outbox_events
      WHERE status = 'pending' AND available_at <= NOW()
      ORDER BY id
      LIMIT batch_size
      FOR UPDATE SKIP LOCKED
   )
  RETURNING e.*;
$$;

-- ---------------------------------------------------------------------------
-- Atomic + idempotent booking creation
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION create_booking(
  p_equipment_id UUID,
  p_renter_id UUID,
  p_start DATE,
  p_end DATE,
  p_notes TEXT,
  p_idempotency_key TEXT
) RETURNS bookings
LANGUAGE plpgsql
AS $$
DECLARE
  v_equipment equipment%ROWTYPE;
  v_booking bookings%ROWTYPE;
  v_days INTEGER;
  v_subtotal NUMERIC(10, 2);
  v_fee NUMERIC(10, 2);
BEGIN
  -- Replay: same key from same renter returns the original booking.
  IF p_idempotency_key IS NOT NULL THEN
    SELECT * INTO v_booking FROM bookings
     WHERE renter_id = p_renter_id AND idempotency_key = p_idempotency_key;
    IF FOUND THEN RETURN v_booking; END IF;
  END IF;

  SELECT * INTO v_equipment FROM equipment
   WHERE id = p_equipment_id AND status = 'published';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'equipment_not_found' USING ERRCODE = 'P0002';
  END IF;

  v_days := (p_end - p_start) + 1;
  v_subtotal := v_equipment.daily_price * v_days;
  v_fee := ROUND(v_subtotal * 0.08, 2); -- 8% marketplace take-rate

  -- Raises exclusion_violation (23P01) if the dates overlap a live booking.
  INSERT INTO bookings (
    equipment_id, renter_id, owner_id, start_date, end_date,
    daily_rate, service_fee, total_amount, notes, idempotency_key
  ) VALUES (
    p_equipment_id, p_renter_id, v_equipment.owner_id, p_start, p_end,
    v_equipment.daily_price, v_fee, v_subtotal + v_fee, p_notes, p_idempotency_key
  ) RETURNING * INTO v_booking;

  INSERT INTO outbox_events (aggregate_type, aggregate_id, event_type, payload)
  VALUES ('booking', v_booking.id, 'booking.created', jsonb_build_object(
    'bookingId', v_booking.id,
    'equipmentId', v_booking.equipment_id,
    'renterId', v_booking.renter_id,
    'ownerId', v_booking.owner_id,
    'startDate', v_booking.start_date,
    'endDate', v_booking.end_date,
    'totalAmount', v_booking.total_amount
  ));

  RETURN v_booking;
END;
$$;
