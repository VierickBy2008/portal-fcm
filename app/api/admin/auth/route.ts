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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = (body?.password || "").trim();
    const adminSecret = getAdminSecret();

    if (!password || password !== adminSecret) {
      return NextResponse.json(
        { ok: false, error: "Contraseña incorrecta. Acceso restringido a administración FCM." },
        { status: 401 }
      );
    }

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
