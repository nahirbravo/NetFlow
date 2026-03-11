-- ============================================================
-- RLS POLICIES: Registro de Gastos Personales — MVP
-- Branch: 001-registro-gastos-personales
-- Date: 2026-03-10
-- Run AFTER supabase-schema.sql
-- Constitution: Principio I — Privacidad de Datos
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- TABLE: profiles
-- Users can only read and update their own profile.
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT own profile only
CREATE POLICY "profiles: select own"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- UPDATE own profile only
CREATE POLICY "profiles: update own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- INSERT is handled by the trigger (SECURITY DEFINER), not by the user directly.
-- No INSERT policy needed for the client.

-- ─────────────────────────────────────────────────────────────
-- TABLE: categories
-- Read: system categories (user_id IS NULL) OR own categories
-- Write: own non-system categories only
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- SELECT: system categories + own categories
CREATE POLICY "categories: select system and own"
  ON public.categories FOR SELECT
  USING (user_id IS NULL OR user_id = auth.uid());

-- INSERT: own non-system categories only
CREATE POLICY "categories: insert own"
  ON public.categories FOR INSERT
  WITH CHECK (user_id = auth.uid() AND is_system = false);

-- UPDATE: own non-system categories only
CREATE POLICY "categories: update own"
  ON public.categories FOR UPDATE
  USING (user_id = auth.uid() AND is_system = false)
  WITH CHECK (user_id = auth.uid() AND is_system = false);

-- DELETE: own non-system categories only
CREATE POLICY "categories: delete own"
  ON public.categories FOR DELETE
  USING (user_id = auth.uid() AND is_system = false);

-- ─────────────────────────────────────────────────────────────
-- TABLE: transactions
-- Full isolation: every operation scoped to auth.uid()
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- SELECT: own transactions only
CREATE POLICY "transactions: select own"
  ON public.transactions FOR SELECT
  USING (user_id = auth.uid());

-- INSERT: own transactions only
CREATE POLICY "transactions: insert own"
  ON public.transactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- UPDATE: own transactions only
CREATE POLICY "transactions: update own"
  ON public.transactions FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: own transactions only
CREATE POLICY "transactions: delete own"
  ON public.transactions FOR DELETE
  USING (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- VERIFICATION (run in SQL Editor to test isolation)
-- Replace 'other-user-uuid' with a real secondary user UUID.
-- ─────────────────────────────────────────────────────────────
-- SET request.jwt.claims = '{"sub": "other-user-uuid"}';
-- SELECT * FROM public.transactions; -- must return 0 rows
-- SELECT * FROM public.profiles;     -- must return 0 rows
-- SELECT * FROM public.categories;   -- must return only system categories
