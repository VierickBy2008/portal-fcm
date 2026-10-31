import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function getAdminSecret(): string {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    "FCM_Unmsm$2026#Admin!94xK"
  ).trim();
}

function generateAdminToken(secret: string): string {
  return crypto.createHmac("sha256", secret).update("fcm_admin_session_unmsm_2026").digest("hex");
}

// ============================================================================
// ESCUDO DE SEGURIDAD 1: RATE LIMITER CONTRA FUERZA BRUTA (BRUTE-FORCE SHIELD)
// ============================================================================
interface IntentoAuth {
  conteo: number;
  bloqueadoHasta: number;
}

const intentosPorIp = new Map<string, IntentoAuth>();
const MAX_INTENTOS_FALLIDOS = 5;
const TIEMPO_BLOQUEO_MS = 15 * 60 * 1000; // 15 minutos

function obtenerIpCliente(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

function limpiarIntentosAntiguos() {
  const ahora = Date.now();
  for (const [ip, data] of intentosPorIp.entries()) {
    if (data.bloqueadoHasta > 0 && ahora > data.bloqueadoHasta) {
      intentosPorIp.delete(ip);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = obtenerIpCliente(req);
    const ahora = Date.now();
    limpiarIntentosAntiguos();

    // 1. Verificar si la IP está en periodo de penalización / bloqueo
    const infoIp = intentosPorIp.get(ip);
    if (infoIp && infoIp.bloqueadoHasta > ahora) {
      const minutosRestantes = Math.ceil((infoIp.bloqueadoHasta - ahora) / 60000);
      return NextResponse.json(
        {
          ok: false,
          error: `⚠️ Acceso temporalmente bloqueado por seguridad institucional tras múltiples intentos fallidos. Intente nuevamente en ${minutosRestantes} minuto(s).`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const password = (body?.password || "").trim();
    const adminSecret = getAdminSecret();

    // 2. Si la contraseña no coincide, registrar fallo y aplicar penalización
    if (!password || password !== adminSecret) {
      const nuevosIntentos = (infoIp?.conteo || 0) + 1;
      const bloqueo = nuevosIntentos >= MAX_INTENTOS_FALLIDOS ? ahora + TIEMPO_BLOQUEO_MS : 0;
      intentosPorIp.set(ip, { conteo: nuevosIntentos, bloqueadoHasta: bloqueo });

      const restantes = Math.max(0, MAX_INTENTOS_FALLIDOS - nuevosIntentos);
      const aviso =
        restantes > 0
          ? ` Le quedan ${restantes} intento(s) antes del bloqueo temporal.`
          : " Se ha alcanzado el límite de intentos; acceso bloqueado por 15 minutos.";

      return NextResponse.json(
        { ok: false, error: `Contraseña incorrecta.${aviso}` },
        { status: 401 }
      );
    }

    // 3. Login exitoso: restablecer registro de fallos para esta IP
    intentosPorIp.delete(ip);

    const token = generateAdminToken(adminSecret);
    const response = NextResponse.json({ ok: true, message: "Sesión autorizada correctamente.", token });

    response.cookies.set("fcm_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 horas
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Error procesando solicitud de autenticación." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const adminSecret = getAdminSecret();
  const validToken = generateAdminToken(adminSecret);

  const cookieToken = req.cookies.get("fcm_admin_token")?.value;
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.replace(/^Bearer\s+/i, "").trim();

  const authenticated = (cookieToken === validToken) || (bearerToken === validToken);
  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true, message: "Sesión cerrada correctamente." });
  response.cookies.delete("fcm_admin_token");
  return response;
}
