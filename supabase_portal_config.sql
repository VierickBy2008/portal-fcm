-- ============================================================================
-- SQL DE ACTUALIZACIÓN PARA SUPABASE:
-- Columnas `docentes_data`, `resenas_docentes`, `materiales_data` y `hero_bg_url`
-- Ejecuta este comando en el SQL Editor de Supabase para habilitar la
-- persistencia completa del Repositorio, Fondo Hero, Docentes y Reseñas:
-- ============================================================================

ALTER TABLE public.portal_config
ADD COLUMN IF NOT EXISTS hero_bg_url text,
ADD COLUMN IF NOT EXISTS docentes_data jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS resenas_docentes jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS materiales_data jsonb DEFAULT '[]'::jsonb;

-- ============================================================================
-- (Opcional) Esquema completo de `portal_config` por si instalas desde cero:
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.portal_config (
  id integer PRIMARY KEY DEFAULT 1,
  logo_url text,
  hero_bg_url text,
  carreras_data jsonb DEFAULT '[]'::jsonb,
  noticias_data jsonb DEFAULT '[]'::jsonb,
  storage_data jsonb DEFAULT '[]'::jsonb,
  docentes_data jsonb DEFAULT '[]'::jsonb,
  resenas_docentes jsonb DEFAULT '[]'::jsonb,
  materiales_data jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.portal_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura publica portal_config" ON public.portal_config;
CREATE POLICY "Lectura publica portal_config"
ON public.portal_config FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Upsert publico portal_config" ON public.portal_config;
CREATE POLICY "Upsert publico portal_config"
ON public.portal_config FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Update publico portal_config" ON public.portal_config;
CREATE POLICY "Update publico portal_config"
ON public.portal_config FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
