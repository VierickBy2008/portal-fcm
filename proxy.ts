import { NextRequest, NextResponse } from "next/server";
import {
  recordBlockedEvent,
  generateWafBlockHtml,
  getWafStats,
  WafBlockedEvent,
} from "./app/utils/wafEngine";

// Lista negra de User-Agents correspondientes a escáneres de vulnerabilidades y herramientas de ataque
const BOT_ATTACK_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /dirbuster/i,
  /nmap/i,
  /masscan/i,
  /acunetix/i,
  /havij/i,
  /zgrab/i,
  /gobuster/i,
  /wpscan/i,
  /nessus/i,
  /nuclei/i,
  /hydra/i,
  /metasploit/i,
  /burpcollaborator/i,
  /arachni/i,
];

// Rutas de sondeo malicioso comunes (archivos sensibles o paneles externos)
const BLOCKED_PATH_PATTERNS = [
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/wp-admin/i,
  /^\/wp-login\.php/i,
  /^\/xmlrpc\.php/i,
  /^\/phpmyadmin/i,
  /^\/actuator/i,
  /^\/\.aws/i,
  /^\/config\.json/i,
  /^\/web\.config/i,
];

// Patrones de inyección en Query String (Path traversal, SQLi básica, XSS reflejado, LFI)
const SQLI_PATTERN = /(union\s+select|select\s+.*\s+from|insert\s+into|drop\s+table|delete\s+from|update\s+.*\s+set|waitfor\s+delay|;\s*--|'\s*or\s*'1'\s*=\s*'1)/i;
const XSS_PATTERN = /(<script|javascript:|onerror\s*=|onload\s*=|onclick\s*=|document\.cookie|<iframe|<img\s+src=x)/i;
const PATH_TRAVERSAL_PATTERN = /(\.\.\/|\.\.\\|etc\/passwd|\/windows\/win\.ini|%2e%2e%2f)/i;

// Rate Limiter en memoria para Edge Runtime / Node.js Runtime
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(
  ip: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetSeconds: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    rateLimitMap.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetSeconds: Math.ceil(windowMs / 1000) };
  }

  const resetSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetSeconds };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetSeconds };
}

// Limpieza periódica de memoria para no acumular IPs inactivas
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now > data.resetAt) rateLimitMap.delete(ip);
    }
  }, 60000);
}

function responderBloqueoWaf(
  req: NextRequest,
  details: {
    ip: string;
    threatType: WafBlockedEvent["threatType"];
    reason: string;
    path: string;
    userAgent: string;
    action?: "blocked" | "rate_limited";
    status?: number;
  }
) {
  const recorded = recordBlockedEvent({
    ip: details.ip,
    threatType: details.threatType,
    reason: details.reason,
    path: details.path,
    userAgent: details.userAgent,
    action: details.action || "blocked",
  });

  const statusCode = details.status || (details.action === "rate_limited" ? 429 : 403);
  const acceptHeader = req.headers.get("accept") || "";

  if (acceptHeader.includes("text/html")) {
    const html = generateWafBlockHtml({
      ip: details.ip,
      threatType: details.threatType,
      reason: details.reason,
      path: details.path,
      eventId: recorded.id,
    });
    return new NextResponse(html, {
      status: statusCode,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Firewall-Status": "Blocked-By-FCM-WAF",
        "X-Firewall-Threat": details.threatType,
        "X-Firewall-Event-ID": recorded.id,
      },
    });
  }

  return new NextResponse(
    JSON.stringify({
      ok: false,
      error: "Acceso denegado por el Cortafuegos Institucional FCM UNMSM (WAF v2.0).",
      threatType: details.threatType,
      reason: details.reason,
      eventId: recorded.id,
      timestamp: recorded.timestamp,
    }),
    {
      status: statusCode,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-Firewall-Status": "Blocked-By-FCM-WAF",
        "X-Firewall-Threat": details.threatType,
        "X-Firewall-Event-ID": recorded.id,
      },
    }
  );
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const userAgent = req.headers.get("user-agent") || "";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const { activeMode } = getWafStats();

  // 1. REGLA WAF: Bloqueo de herramientas automatizadas de escaneo / hacking
  if (userAgent && BOT_ATTACK_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return responderBloqueoWaf(req, {
      ip,
      threatType: "Scanner",
      reason: "User-Agent identificado como herramienta de escaneo de vulnerabilidades.",
      path: pathname,
      userAgent,
    });
  }

  // 2. REGLA WAF: Bloqueo de sondeo de archivos sensibles (.env, .git, wp-admin, etc.)
  if (BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return responderBloqueoWaf(req, {
      ip,
      threatType: "PathProbe",
      reason: "Intento de sondeo de directorio sensible o archivo de configuración.",
      path: pathname,
      userAgent,
    });
  }

  // 3. REGLA WAF: Detección y bloqueo de inyecciones en Query String
  if (search) {
    if (SQLI_PATTERN.test(search)) {
      return responderBloqueoWaf(req, {
        ip,
        threatType: "SQLi",
        reason: "Patrón de inyección SQL (SQLi) detectado en los parámetros de la URL.",
        path: `${pathname}${search}`,
        userAgent,
      });
    }

    if (XSS_PATTERN.test(search)) {
      return responderBloqueoWaf(req, {
        ip,
        threatType: "XSS",
        reason: "Patrón de script malicioso o XSS reflejado detectado en la URL.",
        path: `${pathname}${search}`,
        userAgent,
      });
    }

    if (PATH_TRAVERSAL_PATTERN.test(search)) {
      return responderBloqueoWaf(req, {
        ip,
        threatType: "PathProbe",
        reason: "Patrón de salto de directorio (Path Traversal / LFI) detectado.",
        path: `${pathname}${search}`,
        userAgent,
      });
    }
  }

  // 4. REGLA CSRF: Validación de origen en peticiones mutadoras hacia /api/admin/*
  if (pathname.startsWith("/api/admin") && (req.method === "POST" || req.method === "DELETE")) {
    const secFetchSite = req.headers.get("sec-fetch-site");
    if (secFetchSite && secFetchSite === "cross-site") {
      return responderBloqueoWaf(req, {
        ip,
        threatType: "CSRF",
        reason: "Petición mutadora cross-site bloqueada por protección anti-CSRF.",
        path: pathname,
        userAgent,
      });
    }
  }

  // 5. REGLA RATE-LIMITING: Adaptativo según el Modo de Seguridad del WAF
  const authLimit = activeMode === "under_attack" ? 3 : activeMode === "strict" ? 5 : 8;
  const syncLimit = activeMode === "under_attack" ? 15 : activeMode === "strict" ? 25 : 40;
  const chatLimit = activeMode === "under_attack" ? 6 : activeMode === "strict" ? 12 : 25;

  if (pathname === "/api/admin/auth" && req.method === "POST") {
    const { allowed, remaining, resetSeconds } = checkRateLimit(`auth_${ip}`, authLimit, 60000);
    if (!allowed) {
      return responderBloqueoWaf(req, {
        ip,
        threatType: "RateLimit",
        reason: `Exceso de intentos de autenticación (${authLimit}/min). Modo WAF: ${activeMode}.`,
        path: pathname,
        userAgent,
        action: "rate_limited",
        status: 429,
      });
    }
    void remaining;
    void resetSeconds;
  }

  if (pathname === "/api/admin/sync") {
    const { allowed, remaining, resetSeconds } = checkRateLimit(`sync_${ip}`, syncLimit, 60000);
    if (!allowed) {
      return responderBloqueoWaf(req, {
        ip,
        threatType: "RateLimit",
        reason: `Límite de sincronización excedido (${syncLimit}/min). Modo WAF: ${activeMode}.`,
        path: pathname,
        userAgent,
        action: "rate_limited",
        status: 429,
      });
    }
    void remaining;
    void resetSeconds;
  }

  if (pathname === "/api/chat" && req.method === "POST") {
    const { allowed, remaining, resetSeconds } = checkRateLimit(`chat_${ip}`, chatLimit, 60000);
    if (!allowed) {
      return responderBloqueoWaf(req, {
        ip,
        threatType: "RateLimit",
        reason: `Límite de consultas al Asistente IA excedido (${chatLimit}/min). Modo WAF: ${activeMode}.`,
        path: pathname,
        userAgent,
        action: "rate_limited",
        status: 429,
      });
    }
    void remaining;
    void resetSeconds;
  }

  // 6. Continuar flujo legítimo inyectando cabeceras de auditoría perimetral
  const response = NextResponse.next();
  response.headers.set("X-Firewall-Status", "Active-FCM-WAF-v2");
  response.headers.set("X-Firewall-Mode", activeMode);
  return response;
}

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-touch-icon.png).*)",
  ],
};
