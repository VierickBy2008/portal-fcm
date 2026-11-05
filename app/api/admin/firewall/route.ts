import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "../auth/route";
import {
  getWafStats,
  getWafEvents,
  setWafMode,
  clearWafEvents,
  recordBlockedEvent,
  WafMode,
} from "@/app/utils/wafEngine";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifyAdminToken(token)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado. Inicia sesión como administrador." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    stats: getWafStats(),
    events: getWafEvents(),
  });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifyAdminToken(token)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado. Inicia sesión como administrador." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const action = body?.action;

    if (action === "set_mode") {
      const mode = body?.mode as WafMode;
      if (mode === "normal" || mode === "strict" || mode === "under_attack") {
        setWafMode(mode);
        return NextResponse.json({
          ok: true,
          mensaje: `Modo del cortafuegos cambiado a: ${mode.toUpperCase()}`,
          stats: getWafStats(),
        });
      }
      return NextResponse.json({ ok: false, error: "Modo no válido" }, { status: 400 });
    }

    if (action === "clear_events") {
      clearWafEvents();
      return NextResponse.json({
        ok: true,
        mensaje: "Historial de eventos de seguridad y contadores vaciados a 0.",
        stats: getWafStats(),
        events: getWafEvents(),
      });
    }

    if (action === "simulate_test") {
      const simulated = recordBlockedEvent({
        ip: "127.0.0.1 (Prueba Admin)",
        threatType: "SimulacionTest",
        reason: "Simulación de auditoría de penetración ejecutada por el Administrador FCM",
        path: "/repositorio?test=' UNION SELECT 1,2,3--",
        userAgent: "FCM-Admin-Security-Auditor/2.0",
        action: "blocked",
      });
      return NextResponse.json({
        ok: true,
        mensaje: "Prueba de intercepción ejecutada exitosamente en 0 ms.",
        simulated,
        stats: getWafStats(),
        events: getWafEvents(),
      });
    }

    return NextResponse.json({ ok: false, error: "Acción no reconocida" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error interno" },
      { status: 500 }
    );
  }
}
