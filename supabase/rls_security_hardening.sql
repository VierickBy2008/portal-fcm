-- ==============================================================================
-- FACULTAD DE CIENCIAS MATEMÁTICAS - UNMSM (PORTAL OFICIAL 2026)
-- SCRIPT DE ENDURECIMIENTO DE SEGURIDAD: ROW LEVEL SECURITY (RLS) EN SUPABASE
-- ==============================================================================
-- Instrucciones de ejecución:
-- 1. Abre el panel de tu proyecto en Supabase (https://supabase.com/dashboard)
-- 2. Dirígete a "SQL Editor" en el menú lateral izquierdo.
-- 3. Crea una nueva consulta ("New Query"), pega este script completo y haz clic en "Run".
-- ==============================================================================

-- 1. HABILITAR ROW LEVEL SECURITY (RLS) EN LA TABLA PRINCIPAL DE CONFIGURACIÓN
ALTER TABLE IF EXISTS public.portal_config ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICA DE LECTURA (SELECT):
-- Permite que cualquier visitante (rol anon y authenticated) pueda leer los datos
-- institucionales públicos (carreras, noticias, docentes, calendario, etc.)
DROP POLICY IF EXISTS "Lectura publica institucional de portal_config" ON public.portal_config;
CREATE POLICY "Lectura publica institucional de portal_config"
ON public.portal_config
FOR SELECT
TO anon, authenticated
USING (true);

-- 3. POLÍTICA DE ESCRITURA EXCLUSIVA PARA EL SERVIDOR (SERVICE ROLE):
-- Solo las peticiones que cuenten con la SUPABASE_SERVICE_ROLE_KEY (utilizada por
-- Next.js en el Route Handler /api/admin/sync tras validar la cookie de administrador)
-- pueden insertar o actualizar datos en portal_config.
DROP POLICY IF EXISTS "Escritura administrativa exclusiva de portal_config" ON public.portal_config;
CREATE POLICY "Escritura administrativa exclusiva de portal_config"
ON public.portal_config
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 4. REVOCAR PERMISOS DE ESCRITURA AL ROL PÚBLICO (ANON)
-- Asegura que nadie pueda hacer peticiones directas supabase.from("portal_config").upsert()
-- o .update() o .delete() usando la clave pública (NEXT_PUBLIC_SUPABASE_ANON_KEY).
REVOKE INSERT, UPDATE, DELETE ON public.portal_config FROM anon;
GRANT SELECT ON public.portal_config TO anon;
GRANT ALL ON public.portal_config TO service_role;

-- ==============================================================================
-- 5. POLÍTICAS DE SEGURIDAD PARA EL BUCKET DE ALMACENAMIENTO (STORAGE: fcm-assets)
-- ==============================================================================

-- Lectura pública de imágenes, afiches y documentos PDF alojados en fcm-assets
DROP POLICY IF EXISTS "Lectura publica de fcm-assets" ON storage.objects;
CREATE POLICY "Lectura publica de fcm-assets"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'fcm-assets');

-- Subida de archivos restringida a service_role o usuarios autenticados
DROP POLICY IF EXISTS "Subida protegida en fcm-assets" ON storage.objects;
CREATE POLICY "Subida protegida en fcm-assets"
ON storage.objects
FOR INSERT
TO service_role, authenticated
WITH CHECK (bucket_id = 'fcm-assets');

-- Modificación y eliminación restringida
DROP POLICY IF EXISTS "Modificacion protegida en fcm-assets" ON storage.objects;
CREATE POLICY "Modificacion protegida en fcm-assets"
ON storage.objects
FOR UPDATE
TO service_role
USING (bucket_id = 'fcm-assets');

DROP POLICY IF EXISTS "Eliminacion protegida en fcm-assets" ON storage.objects;
CREATE POLICY "Eliminacion protegida en fcm-assets"
ON storage.objects
FOR DELETE
TO service_role
USING (bucket_id = 'fcm-assets');

-- ==============================================================================
-- Fin del script de endurecimiento de seguridad RLS.
-- ==============================================================================
