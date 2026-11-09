import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "fcm_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 horas

// ==========================================================================
// PILAR 6: RATE LIMITING EN SERVIDOR CONTRA FUERZA BRUTA (IP LOCKOUT)
// ==========================================================================
const MAX_INTENTOS_FALLIDOS = 5;
const TIEMPO_BLOQUEO_SEGUNDOS = 900; // 15 minutos = 900 segundos
const TIEMPO_BLOQUEO_MS = TIEMPO_BLOQUEO_SEGUNDOS * 1000;

interface EstadoIpAuth {
  intentos: number;
  bloqueadoHasta: number;
}

const intentosPorIp = new Map<string, EstadoIpAuth>();

function obtenerIpCliente(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

function getAdminPassword(): string {
  const secret = process.env.ADMIN_MASTER_PASSWORD?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") {
    return "fcm_admin_local_dev_2026";
  }
  return "";
}

function getSigningSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (secret) return secret;
  const adminPass = getAdminPassword();
  if (adminPass) {
    return `fcm-unmsm-hmac-secret-2026-${adminPass}`;
  }
  if (process.env.NODE_ENV !== "production") {
    return "fcm_dev_hmac_secret_2026";
  }
  return "";
}

export function createAdminToken(): string {
  const secret = getSigningSecret();
  if (!secret) return "";
  const exp = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `admin:${exp}`;
  const sig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = getSigningSecret();
  if (!secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const [, expStr] = payload.split(":");
  const exp = Number(expStr);
  if (!exp || Number.isNaN(exp) || Date.now() > exp) return false;

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expectedSig, "hex")
    );
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const ip = obtenerIpCliente(req);
  const ahora = Date.now();
  const infoIp = intentosPorIp.get(ip);

  if (infoIp && infoIp.bloqueadoHasta > ahora) {
    const segundosRestantes = Math.max(1, Math.ceil((infoIp.bloqueadoHasta - ahora) / 1000));
    return NextResponse.json({
      authenticated: false,
      locked: true,
      retryAfterSeconds: segundosRestantes,
    });
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = verifyAdminToken(token);
  return NextResponse.json({
    authenticated,
    locked: false,
    retryAfterSeconds: 0,
  });
}

export async function POST(req: NextRequest) {
  try {
    const ip = obtenerIpCliente(req);
    const ahora = Date.now();
    const infoIp = intentosPorIp.get(ip) || { intentos: 0, bloqueadoHasta: 0 };

    // 1. Verificar si la IP se encuentra temporalmente bloqueada por intentos fallidos
    if (infoIp.bloqueadoHasta > ahora) {
      const segundosRestantes = Math.max(1, Math.ceil((infoIp.bloqueadoHasta - ahora) / 1000));
      const minutosRestantes = Math.ceil(segundosRestantes / 60);
      return NextResponse.json(
        {
          ok: false,
          locked: true,
          retryAfterSeconds: segundosRestantes,
          remainingAttempts: 0,
          error: `Demasiados intentos fallidos desde esta dirección IP. Acceso bloqueado temporalmente por seguridad (${minutosRestantes} min restantes).`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(segundosRestantes),
          },
        }
      );
    }

    const body = await req.json();
    const entered = typeof body?.password === "string" ? body.password.trim() : "";
    const expected = getAdminPassword();

    if (!expected) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "El servidor requiere configurar la variable de entorno ADMIN_MASTER_PASSWORD en el proveedor de despliegue (Vercel).",
        },
        { status: 500 }
      );
    }

    const enteredHash = crypto.createHash("sha256").update(entered).digest();
    const expectedHash = crypto.createHash("sha256").update(expected).digest();
    const match =
      entered.length > 0 && crypto.timingSafeEqual(enteredHash, expectedHash);

    if (!match) {
      const nuevosIntentos = infoIp.intentos + 1;
      if (nuevosIntentos >= MAX_INTENTOS_FALLIDOS) {
        const bloqueadoHasta = ahora + TIEMPO_BLOQUEO_MS;
        intentosPorIp.set(ip, {
          intentos: nuevosIntentos,
          bloqueadoHasta,
        });
        return NextResponse.json(
          {
            ok: false,
            locked: true,
            retryAfterSeconds: TIEMPO_BLOQUEO_SEGUNDOS,
            remainingAttempts: 0,
            error:
              "Se alcanzaron 5 intentos fallidos consecutivos. Tu dirección IP ha sido bloqueada durante 15 minutos (900 s).",
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(TIEMPO_BLOQUEO_SEGUNDOS),
            },
          }
        );
      } else {
        const restantes = MAX_INTENTOS_FALLIDOS - nuevosIntentos;
        intentosPorIp.set(ip, { intentos: nuevosIntentos, bloqueadoHasta: 0 });
        return NextResponse.json(
          {
            ok: false,
            locked: false,
            retryAfterSeconds: 0,
            remainingAttempts: restantes,
            error: `Contraseña maestra incorrecta. Te quedan ${restantes} ${
              restantes === 1 ? "intento" : "intentos"
            } antes del bloqueo temporal de 15 minutos.`,
          },
          { status: 401 }
        );
      }
    }

    // 2. Éxito: limpiar historial de intentos fallidos de esta IP
    intentosPorIp.delete(ip);

    const token = createAdminToken();
    const res = NextResponse.json({
      ok: true,
      authenticated: true,
      locked: false,
      retryAfterSeconds: 0,
    });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Solicitud de autenticación inválida." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true, authenticated: false });
  res.cookies.delete(ADMIN_COOKIE_NAME);
  return res;
}

export { ADMIN_COOKIE_NAME };
