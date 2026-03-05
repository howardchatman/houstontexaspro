-- Billing Schema Migration
-- Run this in Supabase Dashboard → SQL Editor

-- Fix tier column: drop old check constraint and update to new tier names
ALTER TABLE contractors DROP CONSTRAINT IF EXISTS contractors_tier_check;

-- Update any existing 'free' → 'starter', 'premium' → 'pro'
UPDATE contractors SET tier = 'starter' WHERE tier = 'free';
UPDATE contractors SET tier = 'pro' WHERE tier = 'premium';

-- Set new default and constraint
ALTER TABLE contractors ALTER COLUMN tier SET DEFAULT 'starter';
ALTER TABLE contractors ADD CONSTRAINT contractors_tier_check
  CHECK (tier IN ('starter', 'pro', 'elite'));

-- Add Stripe billing columns
ALTER TABLE contractors
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none'
    CHECK (subscription_status IN ('none', 'active', 'past_due', 'canceled', 'trialing')),
  ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS monthly_lead_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lead_count_reset_at TIMESTAMPTZ;

-- Indexes for Stripe lookups
CREATE INDEX IF NOT EXISTS idx_contractors_stripe_customer_id ON contractors(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_contractors_stripe_subscription_id ON contractors(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_contractors_tier ON contractors(tier);
