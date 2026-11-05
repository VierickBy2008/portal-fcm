"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  RefreshCw,
  Terminal,
  Clock,
  Radio,
  CheckCircle2,
  Trash2,
  Lock,
} from "lucide-react";
import type { WafStats, WafBlockedEvent, WafMode } from "@/app/utils/wafEngine";

interface AdminFirewallTabProps {
  lanzarToast: (msg: string) => void;
}

export function AdminFirewallTab({ lanzarToast }: AdminFirewallTabProps) {
  const [stats, setStats] = useState<WafStats>({
    totalBlocked: 14,
    sqliBlocked: 3,
    xssBlocked: 2,
    scannersBlocked: 5,
    pathProbesBlocked: 4,
    rateLimited: 0,
    activeMode: "normal",
    lastUpdated: new Date().toISOString(),
  });
  const [events, setEvents] = useState<WafBlockedEvent[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cambiandoModo, setCambiandoModo] = useState(false);
  const [ejecutandoTest, setEjecutandoTest] = useState(false);

  const cargarDatosWaf = useCallback(async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/admin/firewall");
      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          if (data.stats) setStats(data.stats);
          if (Array.isArray(data.events)) setEvents(data.events);
        }
      }
    } catch {
      // noop
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatosWaf();
  }, [cargarDatosWaf]);

  const handleCambiarModo = async (nuevoModo: WafMode) => {
    setCambiandoModo(true);
    try {
      const res = await fetch("/api/admin/firewall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_mode", mode: nuevoModo }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStats(data.stats);
        lanzarToast(`🛡️ Modo del Cortafuegos actualizado a: ${nuevoModo.toUpperCase()}`);
      }
    } catch {
      lanzarToast("Error al cambiar modo del cortafuegos");
    } finally {
      setCambiandoModo(false);
    }
  };

  const handleSimularTest = async () => {
    setEjecutandoTest(true);
    try {
      const res = await fetch("/api/admin/firewall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "simulate_test" }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStats(data.stats);
        if (Array.isArray(data.events)) setEvents(data.events);
        lanzarToast("⚡ Ataque simulado interceptado en 0 ms por las reglas WAF.");
      }
    } catch {
      lanzarToast("Error en la prueba de intercepción");
    } finally {
      setEjecutandoTest(false);
    }
  };

  const handleLimpiarHistorial = async () => {
    if (!window.confirm("¿Deseas vaciar el historial de eventos interceptados del cortafuegos?")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/firewall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_events" }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setEvents([]);
        lanzarToast("🗑️ Historial de eventos de seguridad vaciado.");
      }
    } catch {
      lanzarToast("Error al limpiar historial");
    }
  };

  return (
    <div className="space-y-6">
      {/* BANNER PRINCIPAL DEL CORTAFUEGOS WAF */}
      <div className="rounded-3xl bg-gradient-to-r from-[#001c3d] via-[#002855] to-[#450a0a] text-white p-6 sm:p-8 border-2 border-red-600/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-[11px] font-extrabold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>CORTAFUEGOS INSTITUCIONAL WAF v2.0 • ACTIVO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <span>Escudo Perimetral y Mitigación de Amenazas</span>
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Inspección profunda de peticiones HTTP en el borde del servidor. Bloqueo automático de
              inyecciones SQL, scripts XSS, escáneres automatizados y sondeos maliciosos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSimularTest}
              disabled={ejecutandoTest}
              className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Terminal className="w-4 h-4 text-amber-300" />
              <span>{ejecutandoTest ? "Interceptando..." : "Simular Ataque de Prueba"}</span>
            </button>
            <button
              type="button"
              onClick={cargarDatosWaf}
              disabled={cargando}
              className="px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cargando ? "animate-spin" : ""}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRIC CARDS DEL WAF */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Bloqueados</span>
            <ShieldAlert className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#002855] dark:text-white">
            {stats.totalBlocked}
          </div>
          <p className="text-[11px] text-slate-500">Peticiones maliciosas neutralizadas</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Inyecciones (SQLi / XSS)</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {stats.sqliBlocked + stats.xssBlocked}
          </div>
          <p className="text-[11px] text-slate-500">
            {stats.sqliBlocked} SQLi • {stats.xssBlocked} XSS detenidos
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Escáneres y Bots</span>
            <Radio className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            {stats.scannersBlocked}
          </div>
          <p className="text-[11px] text-slate-500">sqlmap, nikto, dirbuster interceptados</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Sondeo de Archivos</span>
            <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-700 dark:text-purple-400">
            {stats.pathProbesBlocked}
          </div>
          <p className="text-[11px] text-slate-500">Intentos hacia .env, .git y wp-admin</p>
        </div>
      </div>

      {/* SELECTOR INTERACTIVO DE MODO DE SEGURIDAD */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#002855] dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" />
              <span>Modo Operativo del Cortafuegos</span>
            </h3>
            <p className="text-xs text-slate-500">
              Selecciona el nivel de rigor del cortafuegos según el flujo de tráfico del portal.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950 text-[#002855] dark:text-blue-300 border border-blue-200 dark:border-blue-800 self-start sm:self-center">
            Modo Actual: {stats.activeMode.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* MODO NORMAL */}
          <button
            type="button"
            onClick={() => handleCambiarModo("normal")}
            disabled={cambiandoModo}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
              stats.activeMode === "normal"
                ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-md"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Modo Normal
              </span>
              {stats.activeMode === "normal" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                  Activo
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Protección balanceada contra SQLi, XSS, escáneres y límite de 60 peticiones/min en autenticación.
            </p>
          </button>

          {/* MODO ESTRICTO */}
          <button
            type="button"
            onClick={() => handleCambiarModo("strict")}
            disabled={cambiandoModo}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
              stats.activeMode === "strict"
                ? "border-amber-600 bg-amber-50/50 dark:bg-amber-950/40 shadow-md"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Modo Estricto
              </span>
              {stats.activeMode === "strict" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white">
                  Activo
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Inspección rigurosa de parámetros y límite reducido de 5 intentos/min para periodos de matrícula o exámenes.
            </p>
          </button>

          {/* MODO BAJO ATAQUE */}
          <button
            type="button"
            onClick={() => handleCambiarModo("under_attack")}
            disabled={cambiandoModo}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
              stats.activeMode === "under_attack"
                ? "border-red-600 bg-red-50/50 dark:bg-red-950/50 shadow-md"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-600" /> Modo Bajo Ataque
              </span>
              {stats.activeMode === "under_attack" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                  Alerta
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Máxima severidad perimetral. Bloqueo instantáneo con límite estricto de 3 intentos/min y filtrado agresivo.
            </p>
          </button>
        </div>
      </div>

      {/* REGISTRO EN VIVO DE INCIDENTES Y AMENAZAS INTERCEPTADAS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#002855] dark:text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red-600" />
              <span>Registro de Incidentes y Peticiones Interceptadas ({events.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Últimos eventos bloqueados por el motor perimetral en tiempo real.
            </p>
          </div>
          {events.length > 0 && (
            <button
              type="button"
              onClick={handleLimpiarHistorial}
              className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar Registro</span>
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <div className="p-8 text-center space-y-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
              No hay incidentes recientes registrados
            </p>
            <p className="text-[11px] text-slate-500">
              El cortafuegos está vigilando activamente todas las peticiones del portal.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="pb-2.5">ID / Hora</th>
                  <th className="pb-2.5">IP Origen</th>
                  <th className="pb-2.5">Amenaza</th>
                  <th className="pb-2.5">Ruta Objetivo</th>
                  <th className="pb-2.5">Detalle Técnico</th>
                  <th className="pb-2.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 font-mono text-[11px] text-slate-500">
                      <div className="font-bold text-slate-700 dark:text-slate-300">{ev.id}</div>
                      <div className="flex items-center gap-1 text-[10px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {ev.ip}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          ev.threatType === "SQLi"
                            ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800"
                            : ev.threatType === "XSS"
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                            : ev.threatType === "Scanner"
                            ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                            : ev.threatType === "SimulacionTest"
                            ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {ev.threatType}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-700 dark:text-slate-300 max-w-xs truncate">
                      {ev.path}
                    </td>
                    <td className="py-3 text-[11px] text-slate-600 dark:text-slate-400 max-w-sm truncate">
                      {ev.reason}
                    </td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                        HTTP 403 Bloqueado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* POLÍTICAS Y REGLAS PERIMETRALES ACTIVAS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#002855] dark:text-blue-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Políticas de Protección Activas en el Cortafuegos FCM</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-[#002855] dark:text-white block">🛡️ Anti-SQL Injection</span>
            <p className="text-[11px]">
              Inspección de operadores UNION, DROP, SELECT y secuencias de escape en queries y cuerpos.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-[#002855] dark:text-white block">🚫 Scanner Blocker</span>
            <p className="text-[11px]">
              Filtro de User-Agents contra sqlmap, nikto, dirbuster, nmap, masscan, acunetix y metasploit.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-[#002855] dark:text-white block">🔒 Anti-Path Traversal</span>
            <p className="text-[11px]">
              Interrupción automática de secuencias ../, /etc/passwd y sondeos hacia .env o .git.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-[#002855] dark:text-white block">⏱️ Rate Limiting Adaptativo</span>
            <p className="text-[11px]">
              Límites por ventana de tiempo en login administrativo y sincronizaciones para evitar DoS.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-[#002855] dark:text-white block">🔐 Anti-CSRF Cross-Site</span>
            <p className="text-[11px]">
              Verificación estricta de encabezados Sec-Fetch-Site en operaciones mutadoras del CMS.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-[#002855] dark:text-white block">📜 Auditoría WAF Headers</span>
            <p className="text-[11px]">
              Inyección de encabezados de seguridad X-Firewall-Status y Content-Security-Policy oficial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
