import { NextRequest, NextResponse } from "next/server";

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
];

// Patrones de inyección en Query String (Path traversal, SQLi básica, XSS reflejado)
const MALICIOUS_QUERY_PATTERNS = [
  /(\.\.\/|\.\.\\)/, // Path Traversal
  /(union\s+select|select\s+.*\s+from|insert\s+into|drop\s+table)/i, // SQLi
  /(<script|javascript:|onerror\s*=|onload\s*=)/i, // XSS
  /(etc\/passwd|\/windows\/win\.ini)/i, // LFI
];

// Rate Limiter en memoria para Edge Runtime (Protección anti-fuerza bruta en /api/admin/*)
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

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const userAgent = req.headers.get("user-agent") || "";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 1. REGLA WAF: Bloqueo de herramientas automatizadas de escaneo / hacking
  if (userAgent && BOT_ATTACK_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return new NextResponse(
      JSON.stringify({
        ok: false,
        error: "Acceso denegado por el cortafuegos de seguridad de la Facultad de Ciencias Matemáticas (WAF).",
        reason: "User-Agent no permitido o herramienta de escaneo no autorizada.",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Firewall-Status": "Blocked-By-FCM-WAF",
          "X-Firewall-Reason": "Malicious-User-Agent",
        },
      }
    );
  }

  // 2. REGLA WAF: Bloqueo de escaneo de rutas sensibles (.env, .git, wp-admin, etc.)
  if (BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return new NextResponse(
      JSON.stringify({
        ok: false,
        error: "Ruta restringida por directiva de seguridad institucional (WAF).",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Firewall-Status": "Blocked-By-FCM-WAF",
          "X-Firewall-Reason": "Restricted-Path-Probe",
        },
      }
    );
  }

  // 3. REGLA WAF: Detección y bloqueo de inyecciones en Query String (SQLi, XSS, Path Traversal)
  if (search && MALICIOUS_QUERY_PATTERNS.some((pattern) => pattern.test(search))) {
    return new NextResponse(
      JSON.stringify({
        ok: false,
        error: "Petición bloqueada por reglas de integridad e inspección de contenido (WAF).",
        reason: "Patrón de entrada potencialmente malicioso detectado en la URL.",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Firewall-Status": "Blocked-By-FCM-WAF",
          "X-Firewall-Reason": "Malicious-Query-Payload",
        },
      }
    );
  }

  // 4. REGLA CSRF: Validación de origen en peticiones mutadoras hacia /api/admin/*
  if (pathname.startsWith("/api/admin") && (req.method === "POST" || req.method === "DELETE")) {
    const secFetchSite = req.headers.get("sec-fetch-site");
    if (secFetchSite && secFetchSite === "cross-site") {
      return new NextResponse(
        JSON.stringify({
          ok: false,
          error: "Petición cross-site bloqueada por protección anti-CSRF del CMS.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-Firewall-Status": "Blocked-By-FCM-CSRF-Shield",
          },
        }
      );
    }
  }

  // 5. REGLA RATE-LIMITING: Protección Anti-Fuerza Bruta en Autenticación Administrativa
  if (pathname === "/api/admin/auth" && req.method === "POST") {
    // Máximo 6 intentos de login por minuto por IP en el borde
    const { allowed, remaining, resetSeconds } = checkRateLimit(`auth_${ip}`, 6, 60000);
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({
          ok: false,
          error: "Demasiados intentos de acceso fallidos. Por seguridad institucional, tu IP ha sido restringida temporalmente.",
          retryAfterSeconds: resetSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(resetSeconds),
            "X-RateLimit-Limit": "6",
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(resetSeconds),
            "X-Firewall-Status": "Rate-Limited-Brute-Force-Protection",
          },
        }
      );
    }
  }

  // 6. REGLA RATE-LIMITING: Protección en Endpoints de Sincronización y Modificación
  if (pathname === "/api/admin/sync") {
    // Máximo 30 peticiones de sincronización por minuto por IP
    const { allowed, remaining, resetSeconds } = checkRateLimit(`sync_${ip}`, 30, 60000);
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({
          ok: false,
          error: "Límite de tasa de sincronización excedido. Espera unos segundos.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(resetSeconds),
            "X-RateLimit-Limit": "30",
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(resetSeconds),
            "X-Firewall-Status": "Rate-Limited-Sync",
          },
        }
      );
    }
  }

  // 7. Continuar flujo legítimo agregando cabecera de auditoría de firewall activa
  const response = NextResponse.next();
  response.headers.set("X-Firewall-Status", "Active-FCM-Edge-Armor");
  return response;
}

export default proxy;

// El proxy/middleware se ejecuta en todas las rutas excepto archivos estáticos pesados, imágenes y favicon
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-touch-icon.png).*)",
  ],
};
