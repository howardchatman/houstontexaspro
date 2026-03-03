-- Migration 005: Add 'seeker' role + update handle_new_user trigger
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)

-- ─────────────────────────────────────────────────────────────
-- 1. Extend the user_role enum with 'seeker'
-- ─────────────────────────────────────────────────────────────
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'seeker';

-- Commit the enum change before using it in a function
-- (Postgres requires enum changes to be visible before function compilation)


-- ─────────────────────────────────────────────────────────────
-- 2. Replace handle_new_user() so it reads role from metadata
--    and defaults to 'seeker' instead of leaving it NULL.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role user_role := 'seeker';
BEGIN
  -- Attempt to cast the metadata role string to our enum.
  -- Falls back to 'seeker' if the value is absent or invalid.
  BEGIN
    IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
      _role := (NEW.raw_user_meta_data->>'role')::user_role;
    END IF;
  EXCEPTION
    WHEN invalid_text_representation THEN
      _role := 'seeker';
  END;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    _role
  )
  ON CONFLICT (id) DO NOTHING;   -- idempotent: skip if profile already exists

  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- 3. RLS policies for public.profiles
--    (idempotent — DROP IF EXISTS then recreate)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"   ON public.profiles;

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- The trigger function (SECURITY DEFINER) handles INSERT;
-- this policy covers any direct client inserts.
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
