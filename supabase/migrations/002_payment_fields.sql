-- =============================================================
-- VISHVA FOODS — Migration 002: payment + delivery tracking fields
-- Adds columns the server writes during payment finalization and
-- courier dispatch. Safe to run on top of 001 (idempotent).
-- =============================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_provider TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_paid ON orders(paid);
