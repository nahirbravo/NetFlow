-- ============================================================
-- SCHEMA: Registro de Gastos Personales — MVP
-- Branch: 001-registro-gastos-personales
-- Date: 2026-03-10
-- Run in: Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- TABLE: profiles
-- Auto-created on auth.users insert via trigger.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  full_name   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-insert profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- TABLE: categories
-- system categories: user_id IS NULL, is_system = true
-- user categories:   user_id = auth.uid(), is_system = false
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 50),
  color       TEXT        NOT NULL DEFAULT '#6366f1'
                          CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  icon        TEXT        NOT NULL DEFAULT '📂',
  is_system   BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: transactions
-- category_id is nullable (SET NULL on category delete)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  type         TEXT          NOT NULL CHECK (type IN ('income', 'expense')),
  category_id  UUID          REFERENCES public.categories(id) ON DELETE SET NULL,
  date         DATE          NOT NULL,
  description  TEXT          CHECK (description IS NULL OR char_length(description) <= 255),
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_transactions_updated ON public.transactions;
CREATE TRIGGER on_transactions_updated
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_transactions_user_id
  ON public.transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_date
  ON public.transactions(user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_category
  ON public.transactions(category_id);

CREATE INDEX IF NOT EXISTS idx_categories_user_id
  ON public.categories(user_id);

-- ─────────────────────────────────────────────────────────────
-- SEED: 10 system categories
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.categories (user_id, name, color, icon, is_system)
VALUES
  (NULL, 'Alimentación',    '#f97316', '🍽️', true),
  (NULL, 'Transporte',      '#3b82f6', '🚗', true),
  (NULL, 'Vivienda',        '#8b5cf6', '🏠', true),
  (NULL, 'Salud',           '#ef4444', '💊', true),
  (NULL, 'Entretenimiento', '#ec4899', '🎬', true),
  (NULL, 'Educación',       '#06b6d4', '📚', true),
  (NULL, 'Ropa',            '#84cc16', '👕', true),
  (NULL, 'Tecnología',      '#6366f1', '💻', true),
  (NULL, 'Viajes',          '#f59e0b', '✈️', true),
  (NULL, 'Otros',           '#9ca3af', '📦', true)
ON CONFLICT DO NOTHING;
