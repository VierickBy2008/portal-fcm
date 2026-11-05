"use client";

import React from "react";
import { Lock } from "lucide-react";

export type AdminTabId =
  | "dashboard"
  | "firewall"
  | "carreras_cms"
  | "calendario_cms"
  | "asistente_ia_cms"
  | "arquitectura_3a_cms"
  | "noticias"
  | "docentes_cms"
  | "moderacion"
  | "storage"
  | "orgullo"
  | "malla"
  | "transparencia"
  | "soporte";

interface AdminNavbarProps {
  tabAdmin: AdminTabId;
  setTabAdmin: React.Dispatch<React.SetStateAction<AdminTabId>>;
  noticiasCount: number;
  docentesCount: number;
  moderacionCount: number;
  storageCount: number;
  orgulloCount: number;
  mallaCount: number;
  transparenciaCount: number;
  ticketsCount: number;
  materialesPendientesCount: number;
  calendarioCount?: number;
  asistenteFaqsCount?: number;
  handleCerrarSesionAdmin: () => void;
}

export function AdminNavbar({
  tabAdmin,
  setTabAdmin,
  noticiasCount,
  docentesCount,
  moderacionCount,
  storageCount,
  orgulloCount,
  mallaCount,
  transparenciaCount,
  ticketsCount,
  materialesPendientesCount,
  calendarioCount = 35,
  asistenteFaqsCount = 5,
  handleCerrarSesionAdmin,
}: AdminNavbarProps) {
  const tabs: { id: AdminTabId; label: string }[] = [
    { id: "dashboard", label: "📊 Resumen" },
    { id: "firewall", label: "🛡️ Cortafuegos WAF" },
    { id: "carreras_cms", label: "🏛️ Carreras & Bento" },
    { id: "calendario_cms", label: `📅 Calendario 2026 (${calendarioCount})` },
    { id: "asistente_ia_cms", label: `🤖 Asistente IA (${asistenteFaqsCount})` },
    { id: "arquitectura_3a_cms", label: "♿ Accesibilidad & DB 3A" },
    { id: "noticias", label: `📰 Noticias (${noticiasCount})` },
    { id: "docentes_cms", label: `👨‍🏫 Docentes (${docentesCount})` },
    { id: "moderacion", label: `🛡️ Moderación (${moderacionCount})` },
    { id: "storage", label: `🖼️ Storage (${storageCount})` },
    { id: "orgullo", label: `🏆 Orgullo FCM (${orgulloCount})` },
    { id: "malla", label: `🎓 Mallas (${mallaCount})` },
    { id: "transparencia", label: `📜 Transparencia (${transparenciaCount})` },
    { id: "soporte", label: `📬 Soporte (${ticketsCount})` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#002855] text-white rounded-2xl p-5 border-b-4 border-red-700 shadow-lg">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Panel de Administración CMS • FCM UNMSM</h1>
          <p className="text-xs text-blue-200">
            Sincronizado con la tabla <code className="text-red-300">portal_config</code> de Supabase.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTabAdmin(t.id)}
              className={`gpu-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tabAdmin === t.id
                  ? "bg-red-700 text-white shadow"
                  : "bg-blue-900 text-blue-100 hover:bg-blue-800"
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleCerrarSesionAdmin}
            className="gpu-btn px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-red-300 border border-red-500/40 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </div>

      {tabAdmin === "dashboard" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 view-transition-gpu">
          <div
            onClick={() => setTabAdmin("carreras_cms")}
            className="gpu-card rounded-2xl border-2 border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-900 p-5 cursor-pointer hover:border-[#002855] dark:hover:border-blue-400 transition-all"
          >
            <p className="text-xs text-[#002855] dark:text-blue-300 font-bold uppercase">
              Carreras, Píldoras & Bento
            </p>
            <p className="text-2xl font-bold text-[#002855] dark:text-white mt-2">4 Escuelas</p>
          </div>
          <div
            onClick={() => setTabAdmin("calendario_cms")}
            className="gpu-card rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900 p-5 cursor-pointer hover:border-emerald-700 dark:hover:border-emerald-400 transition-all"
          >
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase">
              Régimen Semestral 2026-I/II
            </p>
            <p className="text-2xl font-bold text-[#002855] dark:text-white mt-2">
              {calendarioCount} Fechas
            </p>
          </div>
          <div
            onClick={() => setTabAdmin("asistente_ia_cms")}
            className="gpu-card rounded-2xl border-2 border-amber-200 dark:border-amber-900/60 bg-white dark:bg-slate-900 p-5 cursor-pointer hover:border-amber-600 dark:hover:border-amber-400 transition-all"
          >
            <p className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase">
              Asistente Virtual IA
            </p>
            <p className="text-2xl font-bold text-[#002855] dark:text-white mt-2">
              {asistenteFaqsCount} FAQs Entrenadas
            </p>
          </div>
          <div
            onClick={() => setTabAdmin("arquitectura_3a_cms")}
            className="gpu-card rounded-2xl border-2 border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-5 cursor-pointer hover:border-purple-700 dark:hover:border-purple-400 transition-all"
          >
            <p className="text-xs text-purple-700 dark:text-purple-400 font-bold uppercase">
              Accesibilidad WCAG & DB 3A
            </p>
            <p className="text-2xl font-bold text-[#002855] dark:text-white mt-2">SQL + RLS</p>
          </div>
          <div
            onClick={() => setTabAdmin("noticias")}
            className="gpu-card rounded-2xl border-2 border-red-200 dark:border-red-900/60 bg-white dark:bg-slate-900 p-5 cursor-pointer hover:border-red-600 dark:hover:border-red-400 transition-all"
          >
            <p className="text-xs text-red-700 dark:text-red-400 font-bold uppercase">
              Noticias Activas
            </p>
            <p className="text-2xl font-bold text-[#002855] dark:text-white mt-2">{noticiasCount}</p>
          </div>
          <div
            onClick={() => setTabAdmin("docentes_cms")}
            className="gpu-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 cursor-pointer hover:border-[#002855] dark:hover:border-blue-400 transition-all"
          >
            <p className="text-xs text-[#002855] dark:text-blue-300 font-bold uppercase">
              Plana Docente
            </p>
            <p className="text-2xl font-bold text-[#002855] dark:text-white mt-2">{docentesCount}</p>
          </div>
          <div
            onClick={() => setTabAdmin("moderacion")}
            className="gpu-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 cursor-pointer hover:border-[#002855] dark:hover:border-blue-400 transition-all"
          >
            <p className="text-xs text-[#002855] dark:text-blue-300 font-bold uppercase">
              Archivos Pendientes
            </p>
            <p className="text-2xl font-bold text-[#002855] dark:text-white mt-2">
              {materialesPendientesCount}
            </p>
          </div>
          <div
            onClick={() => setTabAdmin("storage")}
            className="gpu-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 cursor-pointer hover:border-[#002855] dark:hover:border-blue-400 transition-all"
          >
            <p className="text-xs text-[#002855] dark:text-blue-300 font-bold uppercase">
              Supabase Storage & Logo
            </p>
            <p className="text-2xl font-bold text-[#002855] dark:text-white mt-2">{storageCount}</p>
          </div>
        </div>
      )}
    </div>
  );
}
