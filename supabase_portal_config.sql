-- ============================================================================
-- SCRIPT SQL PARA SUPABASE: TABLA GLOBAL `portal_config` + POLÍTICAS RLS
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.portal_config (
  id INT PRIMARY KEY DEFAULT 1,
  logo_url TEXT NOT NULL DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UNMSM_coatofarms_seal.svg/240px-UNMSM_coatofarms_seal.svg.png',
  carreras_data JSONB DEFAULT '[]'::jsonb,
  noticias_data JSONB DEFAULT '[]'::jsonb,
  storage_data JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT portal_config_single_row CHECK (id = 1)
);

-- Insertar fila inicial (id = 1) si aún no existe
INSERT INTO public.portal_config (id, logo_url)
VALUES (
  1,
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UNMSM_coatofarms_seal.svg/240px-UNMSM_coatofarms_seal.svg.png'
)
ON CONFLICT (id) DO NOTHING;

-- Activar Row Level Security (RLS)
ALTER TABLE public.portal_config ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas previas si existieran para evitar duplicados al re-ejecutar
DROP POLICY IF EXISTS "Lectura publica de portal_config" ON public.portal_config;
DROP POLICY IF EXISTS "Insercion publica de portal_config" ON public.portal_config;
DROP POLICY IF EXISTS "Actualizacion publica de portal_config" ON public.portal_config;

-- Política 1: Lectura pública para todo visitante del portal (SELECT)
CREATE POLICY "Lectura publica de portal_config"
ON public.portal_config
FOR SELECT
TO anon, authenticated
USING (true);

-- Política 2: Inserción pública para el CMS con upsert (INSERT)
CREATE POLICY "Insercion publica de portal_config"
ON public.portal_config
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política 3: Actualización pública para el CMS con upsert (UPDATE)
CREATE POLICY "Actualizacion publica de portal_config"
ON public.portal_config
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
