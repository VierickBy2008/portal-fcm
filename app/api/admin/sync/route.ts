import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "../auth/route";
import { portalConfigSyncSchema } from "@/app/utils/portalValidationSchema";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
// En el servidor priorizamos la SUPABASE_SERVICE_ROLE_KEY para escrituras administrativas seguras
const SUPABASE_ADMIN_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-anon-key";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY);

// Lista blanca estricta de columnas permitidas en portal_config
const ALLOWED_COLUMNS = [
  "logo_url",
  "hero_bg_url",
  "hero_blur",
  "hero_overlay_opacity",
  "hero_overlay_color",
  "carreras_data",
  "noticias_data",
  "docentes_data",
  "resenas_docentes",
  "resenas_data",
  "malla_data",
  "materiales_data",
  "tickets_data",
  "storage_data",
  "orgullo_data",
  "transparencia_data",
  "calendario_data",
  "asistente_ia_data",
  "accesibilidad_data",
] as const;

export async function POST(req: NextRequest) {
  try {
    // 1. Verificar sesión administrativa mediante cookie HttpOnly firmada con HMAC
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!verifyAdminToken(token)) {
      return NextResponse.json(
        { ok: false, error: "No autorizado. Inicia sesión como Administrador." },
        { status: 401 }
      );
    }

    const rawCambios = await req.json();
    if (!rawCambios || typeof rawCambios !== "object") {
      return NextResponse.json(
        { ok: false, error: "Payload inválido." },
        { status: 400 }
      );
    }

    // 2. Validación estricta de esquemas en tiempo de ejecución con Zod (Pilar 2)
    const validacion = portalConfigSyncSchema.safeParse(rawCambios);
    if (!validacion.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Datos de configuración inválidos",
          detalles: validacion.error.flatten(),
        },
        { status: 400 }
      );
    }

    // 3. Filtrar estrictamente solo columnas permitidas de portal_config
    const payloadLimpio: Record<string, unknown> = {
      id: 1,
      updated_at: new Date().toISOString(),
    };

    for (const col of ALLOWED_COLUMNS) {
      if (col in rawCambios && rawCambios[col] !== undefined) {
        payloadLimpio[col] = rawCambios[col];
      }
    }

    // 4. Upsert en Supabase desde el servidor
    const { error } = await supabaseAdmin
      .from("portal_config")
      .upsert(payloadLimpio, { onConflict: "id" });

    if (error) {
      // Fallback seguro si alguna columna nueva aún no fue migrada en el esquema SQL
      const {
        hero_blur,
        hero_overlay_opacity,
        hero_overlay_color,
        orgullo_data,
        transparencia_data,
        calendario_data,
        asistente_ia_data,
        accesibilidad_data,
        ...restoSeguro
      } = payloadLimpio;
      void hero_blur;
      void hero_overlay_opacity;
      void hero_overlay_color;
      void orgullo_data;
      void transparencia_data;
      void calendario_data;
      void asistente_ia_data;
      void accesibilidad_data;

      if (Object.keys(restoSeguro).length > 2) {
        const { error: retryErr } = await supabaseAdmin
          .from("portal_config")
          .upsert(restoSeguro, { onConflict: "id" });

        if (!retryErr) {
          return NextResponse.json({ ok: true, mode: "fallback_columns" });
        }
      }

      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, mode: "full_sync" });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error interno" },
      { status: 500 }
    );
  }
}
