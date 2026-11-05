import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

function getAdminSecret(): string {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    "FCM_Unmsm$2026#Admin!94xK"
  ).trim();
}

function safeCompareStrings(a: string, b: string): boolean {
  if (!a || !b) return false;
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function verifyAdminSession(req: NextRequest): boolean {
  const secret = getAdminSecret();
  const validToken = crypto
    .createHmac("sha256", secret)
    .update("fcm_admin_session_unmsm_2026")
    .digest("hex");

  const cookieToken = req.cookies.get("fcm_admin_token")?.value || "";
  const authHeader = req.headers.get("authorization") || "";
  const bearerToken = authHeader.replace(/^Bearer\s+/i, "").trim();

  return (
    safeCompareStrings(cookieToken, validToken) ||
    safeCompareStrings(bearerToken, validToken)
  );
}

// Lista blanca estricta de columnas permitidas en `portal_config`
const ALLOWED_SYNC_KEYS = new Set([
  "logo_url",
  "hero_bg_url",
  "hero_blur",
  "hero_overlay_opacity",
  "hero_overlay_color",
  "carreras_data",
  "noticias_data",
  "docentes_data",
  "resenas_data",
  "malla_data",
  "materiales_data",
  "tickets_data",
  "storage_data",
  "orgullo_data",
  "transparencia_data",
]);

const MAX_PAYLOAD_BYTES = 4 * 1024 * 1024; // 4 MB límite de seguridad

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado. Sesión de administrador inválida o expirada." },
      { status: 401 }
    );
  }

  try {
    const rawBody = await req.text();
    if (rawBody.length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { ok: false, error: "El tamaño de los datos excede el límite de seguridad permitido (4 MB)." },
        { status: 413 }
      );
    }

    const rawCambios = JSON.parse(rawBody);
    if (!rawCambios || typeof rawCambios !== "object" || Array.isArray(rawCambios)) {
      return NextResponse.json(
        { ok: false, error: "Formato de payload inválido." },
        { status: 400 }
      );
    }

    // Filtrar únicamente campos autorizados por lista blanca
    const cambios: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rawCambios)) {
      if (ALLOWED_SYNC_KEYS.has(key)) {
        cambios[key] = value;
      }
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbtwoflmrbkxtpxzdsvu.supabase.co";
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { ok: false, error: "Faltan credenciales del servidor para conectar a Supabase." },
        { status: 500 }
      );
    }

    const supabaseServer = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const payload = {
      id: 1,
      ...cambios,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer
      .from("portal_config")
      .upsert(payload, { onConflict: "id" })
      .select();

    if (error) {
      // Intento de respaldo robusto si las columnas orgullo_data o transparencia_data aún no existen como columnas directas en SQL:
      const existingStorage = Array.isArray(cambios.storage_data)
        ? [...(cambios.storage_data as Record<string, unknown>[])]
        : [];

      if (Array.isArray(cambios.orgullo_data)) {
        const idx = existingStorage.findIndex((x) => x && x.id === "__fcm_orgullo_config__");
        const metaOrg = { id: "__fcm_orgullo_config__", orgullo_items: cambios.orgullo_data };
        if (idx !== -1) existingStorage[idx] = metaOrg;
        else existingStorage.push(metaOrg);
      }

      if (Array.isArray(cambios.transparencia_data)) {
        const idx = existingStorage.findIndex((x) => x && x.id === "__fcm_transparencia_config__");
        const metaTrans = {
          id: "__fcm_transparencia_config__",
          transparencia_items: cambios.transparencia_data,
        };
        if (idx !== -1) existingStorage[idx] = metaTrans;
        else existingStorage.push(metaTrans);
      }

      const {
        hero_blur,
        hero_overlay_opacity,
        hero_overlay_color,
        orgullo_data,
        transparencia_data,
        ...resto
      } = cambios;
      void hero_blur;
      void hero_overlay_opacity;
      void hero_overlay_color;
      void orgullo_data;
      void transparencia_data;

      const retryPayload = {
        id: 1,
        ...resto,
        ...(existingStorage.length > 0 ? { storage_data: existingStorage } : {}),
        updated_at: new Date().toISOString(),
      };

      const { data: retryData, error: retryError } = await supabaseServer
        .from("portal_config")
        .upsert(retryPayload, { onConflict: "id" })
        .select();

      if (retryError) {
        return NextResponse.json({ ok: false, error: retryError.message }, { status: 400 });
      }
      return NextResponse.json({ ok: true, data: retryData, fallback: true });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inesperado al sincronizar";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
