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

function verifyAdminSession(req: NextRequest): boolean {
  const secret = getAdminSecret();
  const validToken = crypto.createHmac("sha256", secret).update("fcm_admin_session_unmsm_2026").digest("hex");

  const cookieToken = req.cookies.get("fcm_admin_token")?.value;
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.replace(/^Bearer\s+/i, "").trim();

  return cookieToken === validToken || bearerToken === validToken;
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado. Sesión de administrador inválida o expirada." },
      { status: 401 }
    );
  }

  try {
    const cambios = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbtwoflmrbkxtpxzdsvu.supabase.co";
    // Si el usuario configuró SUPABASE_SERVICE_ROLE_KEY, la usamos para bypass seguro de RLS en el servidor.
    // De lo contrario, usamos la clave anon como respaldo.
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
      // Intento de respaldo excluyendo campos que pudieran no existir en columnas directas
      const { hero_blur, hero_overlay_opacity, hero_overlay_color, ...resto } = cambios;
      void hero_blur;
      void hero_overlay_opacity;
      void hero_overlay_color;

      const { data: retryData, error: retryError } = await supabaseServer
        .from("portal_config")
        .upsert({ id: 1, ...resto, updated_at: new Date().toISOString() }, { onConflict: "id" })
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
