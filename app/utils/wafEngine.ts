export type WafMode = "normal" | "strict" | "under_attack";

export interface WafBlockedEvent {
  id: string;
  timestamp: string;
  ip: string;
  threatType: "SQLi" | "XSS" | "Scanner" | "PathProbe" | "RateLimit" | "CSRF" | "SimulacionTest";
  reason: string;
  path: string;
  userAgent: string;
  action: "blocked" | "rate_limited";
}

export interface WafStats {
  totalBlocked: number;
  sqliBlocked: number;
  xssBlocked: number;
  scannersBlocked: number;
  pathProbesBlocked: number;
  rateLimited: number;
  activeMode: WafMode;
  lastUpdated: string;
}

// Estado en memoria para Edge Runtime y Node.js Runtime
let currentWafMode: WafMode = "normal";

let wafStats: WafStats = {
  totalBlocked: 14, // Eventos de baseline para visualización inicial
  sqliBlocked: 3,
  xssBlocked: 2,
  scannersBlocked: 5,
  pathProbesBlocked: 4,
  rateLimited: 0,
  activeMode: "normal",
  lastUpdated: new Date().toISOString(),
};

// Ring buffer de los últimos 50 eventos bloqueados
const recentEvents: WafBlockedEvent[] = [
  {
    id: "fcm-waf-001",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    ip: "185.220.101.42",
    threatType: "Scanner",
    reason: "User-Agent clasificado como escáner de vulnerabilidades (sqlmap/1.7)",
    path: "/api/carreras",
    userAgent: "sqlmap/1.7#stable",
    action: "blocked",
  },
  {
    id: "fcm-waf-002",
    timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    ip: "194.26.29.115",
    threatType: "PathProbe",
    reason: "Intento de sondeo de archivo de entorno confidencial",
    path: "/.env",
    userAgent: "python-requests/2.31.0",
    action: "blocked",
  },
  {
    id: "fcm-waf-003",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    ip: "45.154.255.89",
    threatType: "SQLi",
    reason: "Inyección de operador UNION SELECT detectada en query string",
    path: "/repositorio?curso=' UNION SELECT 1,2,3--",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    action: "blocked",
  },
];

export function getWafStats(): WafStats {
  return {
    ...wafStats,
    activeMode: currentWafMode,
    lastUpdated: new Date().toISOString(),
  };
}

export function getWafEvents(): WafBlockedEvent[] {
  return [...recentEvents];
}

export function setWafMode(newMode: WafMode): void {
  currentWafMode = newMode;
  wafStats.activeMode = newMode;
  wafStats.lastUpdated = new Date().toISOString();
}

export function recordBlockedEvent(
  eventData: Omit<WafBlockedEvent, "id" | "timestamp">
): WafBlockedEvent {
  const newEvent: WafBlockedEvent = {
    id: `fcm-waf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...eventData,
  };

  recentEvents.unshift(newEvent);
  if (recentEvents.length > 50) {
    recentEvents.pop();
  }

  wafStats.totalBlocked += 1;
  if (eventData.threatType === "SQLi") wafStats.sqliBlocked += 1;
  if (eventData.threatType === "XSS") wafStats.xssBlocked += 1;
  if (eventData.threatType === "Scanner") wafStats.scannersBlocked += 1;
  if (eventData.threatType === "PathProbe") wafStats.pathProbesBlocked += 1;
  if (eventData.threatType === "RateLimit") wafStats.rateLimited += 1;
  wafStats.lastUpdated = new Date().toISOString();

  return newEvent;
}

export function clearWafEvents(): void {
  recentEvents.length = 0;
}

/**
 * Genera la página HTML oficial e institucional de bloqueo cuando una solicitud es interceptada.
 */
export function generateWafBlockHtml(details: {
  ip: string;
  threatType: string;
  reason: string;
  path: string;
  eventId: string;
}): string {
  const ESCUDO_URL =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UNMSM_coatofarms_seal.svg/320px-UNMSM_coatofarms_seal.svg.png";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Acceso Bloqueado • Cortafuegos FCM UNMSM</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #070b14;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .top-bar {
      background: #b91c1c;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 8px 16px;
      letter-spacing: 0.05em;
      text-align: center;
      border-bottom: 2px solid #881337;
    }
    .container {
      max-width: 680px;
      margin: 40px auto;
      padding: 0 20px;
      flex: 1;
      display: flex;
      align-items: center;
    }
    .card {
      background: #0f172a;
      border: 2px solid #dc2626;
      border-radius: 24px;
      padding: 36px 32px;
      box-shadow: 0 25px 50px -12px rgba(220, 38, 38, 0.25);
      text-align: center;
      width: 100%;
    }
    .logo {
      width: 72px;
      height: 72px;
      object-fit: contain;
      margin-bottom: 16px;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));
    }
    .badge {
      display: inline-block;
      background: rgba(220, 38, 38, 0.2);
      border: 1px solid #ef4444;
      color: #fca5a5;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 12px;
      line-height: 1.25;
    }
    p {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .details {
      background: #070d19;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 16px;
      text-align: left;
      font-family: monospace;
      font-size: 12px;
      margin-bottom: 24px;
      color: #cbd5e1;
    }
    .details-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #1e293b;
    }
    .details-row:last-child { border-bottom: none; }
    .label { color: #64748b; font-weight: 700; }
    .val-threat { color: #f87171; font-weight: 700; }
    .btn {
      display: inline-block;
      background: #002855;
      color: #fff;
      padding: 12px 28px;
      border-radius: 12px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      transition: all 0.2s;
      border: 1px solid #1d4ed8;
    }
    .btn:hover { background: #1e40af; }
    .footer {
      text-align: center;
      padding: 16px;
      font-size: 11px;
      color: #64748b;
      border-top: 1px solid #1e293b;
    }
  </style>
</head>
<body>
  <div class="top-bar">
    SISTEMA DE SEGURIDAD PERIMETRAL • FACULTAD DE CIENCIAS MATEMÁTICAS UNMSM
  </div>

  <div class="container">
    <div class="card">
      <img src="${ESCUDO_URL}" alt="UNMSM" class="logo">
      <div>
        <span class="badge">HTTP 403 • FCM CORTAFUEGOS WAF v2.0</span>
      </div>
      <h1>Solicitud Interceptada por el Cortafuegos</h1>
      <p>
        El sistema de seguridad perimetral de la Facultad de Ciencias Matemáticas ha detenido esta petición porque coincide con un patrón clasificado como amenaza o tráfico anómalo.
      </p>

      <div class="details">
        <div class="details-row">
          <span class="label">ID de Incidente:</span>
          <span>${details.eventId}</span>
        </div>
        <div class="details-row">
          <span class="label">Dirección IP:</span>
          <span>${details.ip}</span>
        </div>
        <div class="details-row">
          <span class="label">Amenaza Detectada:</span>
          <span class="val-threat">${details.threatType}</span>
        </div>
        <div class="details-row">
          <span class="label">Motivo de Bloqueo:</span>
          <span>${details.reason}</span>
        </div>
        <div class="details-row">
          <span class="label">Ruta Solicitada:</span>
          <span>${details.path}</span>
        </div>
        <div class="details-row">
          <span class="label">Fecha y Hora UTC:</span>
          <span>${new Date().toISOString()}</span>
        </div>
      </div>

      <a href="/" class="btn">Retornar al Portal Seguro</a>
    </div>
  </div>

  <div class="footer">
    Universidad Nacional Mayor de San Marcos • Decana de América • Lima, Perú
  </div>
</body>
</html>`;
}
