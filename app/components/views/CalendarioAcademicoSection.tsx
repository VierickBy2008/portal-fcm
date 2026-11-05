"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Search,
  Printer,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { CalendarioSemestralConfig, ActividadCalendario } from "@/app/types/portal";

interface CalendarioAcademicoSectionProps {
  config: CalendarioSemestralConfig;
}

const BADGE_CATEGORIA: Record<
  NonNullable<ActividadCalendario["categoria"]>,
  { label: string; className: string }
> = {
  matricula: {
    label: "Matrícula",
    className:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800",
  },
  evaluacion: {
    label: "Evaluación",
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800",
  },
  clases: {
    label: "Clases",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800",
  },
  actas: {
    label: "Notas y Actas",
    className:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800",
  },
  tramite: {
    label: "Trámite SUM",
    className:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
};

export function CalendarioAcademicoSection({ config }: CalendarioAcademicoSectionProps) {
  const [filtroSemestre, setFiltroSemestre] = useState<"ambos" | "2026-I" | "2026-II">(
    config.semestre_activo_default || "ambos"
  );
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");

  const actividadesFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return config.actividades.filter((item) => {
      if (filtroSemestre !== "ambos" && item.semestre !== filtroSemestre) return false;
      if (filtroCategoria !== "todas" && item.categoria !== filtroCategoria) return false;
      if (!q) return true;
      return (
        item.actividad.toLowerCase().includes(q) ||
        item.fecha.toLowerCase().includes(q) ||
        item.semestre.toLowerCase().includes(q)
      );
    });
  }, [config.actividades, filtroSemestre, filtroCategoria, busqueda]);

  const act2026I = useMemo(
    () => actividadesFiltradas.filter((a) => a.semestre === "2026-I"),
    [actividadesFiltradas]
  );
  const act2026II = useMemo(
    () => actividadesFiltradas.filter((a) => a.semestre === "2026-II"),
    [actividadesFiltradas]
  );

  const handleImprimirCronograma = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  return (
    <section id="calendario-academico" className="space-y-6 reveal-on-scroll">
      {/* Cabecera Institucional */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b-2 border-blue-900 dark:border-blue-800 pb-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Cronograma Oficial SUM • UNMSM 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#002855] dark:text-white tracking-tight">
            {config.titulo || "RÉGIMEN SEMESTRAL — CRONOGRAMA ACADÉMICO 2026"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            {config.subtitulo}
          </p>
        </div>

        {/* Selector de Semestre y Botón de Impresión */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setFiltroSemestre("ambos")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filtroSemestre === "ambos"
                  ? "bg-[#002855] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Régimen Completo (I y II)
            </button>
            <button
              type="button"
              onClick={() => setFiltroSemestre("2026-I")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filtroSemestre === "2026-I"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Semestre 2026-I
            </button>
            <button
              type="button"
              onClick={() => setFiltroSemestre("2026-II")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filtroSemestre === "2026-II"
                  ? "bg-red-700 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Semestre 2026-II
            </button>
          </div>

          <button
            type="button"
            onClick={handleImprimirCronograma}
            className="gpu-btn px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Imprimir o guardar como PDF el Régimen Semestral"
          >
            <Printer className="w-3.5 h-3.5 text-[#002855] dark:text-blue-400" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda Rápida y Filtros por Tipo de Actividad */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar actividad o fecha (ej. matrícula regular, evaluación parcial, aplazados, cierre de actas)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#002855] dark:focus:border-blue-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "todas", label: "Todas" },
            { id: "matricula", label: "Matrícula" },
            { id: "clases", label: "Clases" },
            { id: "evaluacion", label: "Evaluaciones" },
            { id: "actas", label: "Notas / Actas" },
            { id: "tramite", label: "Trámites" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFiltroCategoria(cat.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                filtroCategoria === cat.id
                  ? "bg-[#002855] dark:bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLA OFICIAL DEL RÉGIMEN SEMESTRAL (2026-I Y 2026-II) */}
      <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#002855] dark:bg-slate-950 text-white text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6 font-bold border-r border-white/15 w-36 text-center">
                  RÉGIMEN
                </th>
                <th className="py-3.5 px-4 sm:px-6 font-bold border-r border-white/15">
                  ACTIVIDAD ACADÉMICA / ADMINISTRATIVA
                </th>
                <th className="py-3.5 px-4 sm:px-6 font-bold w-72 sm:w-96">
                  FECHA OFICIAL
                </th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {/* BLOQUE SEMESTRE 2026-I */}
              {act2026I.map((item, idx) => {
                const catMeta = item.categoria ? BADGE_CATEGORIA[item.categoria] : null;
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-emerald-200/70 dark:border-slate-800 transition-colors ${
                      item.destacado
                        ? "bg-emerald-100/70 dark:bg-emerald-950/40 font-semibold"
                        : "bg-emerald-50/45 dark:bg-slate-900/90 hover:bg-emerald-100/50 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    {idx === 0 && (
                      <td
                        rowSpan={act2026I.length}
                        className="bg-emerald-100/90 dark:bg-emerald-950/60 border-r border-emerald-300/80 dark:border-slate-800 px-3 py-4 text-center align-middle font-bold text-[#002855] dark:text-emerald-300"
                      >
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-lg bg-[#002855] dark:bg-emerald-800 text-white text-xs font-extrabold tracking-wide shadow-2xs">
                            SEMESTRE
                          </span>
                          <span className="text-base sm:text-lg font-extrabold text-emerald-900 dark:text-emerald-300 font-mono">
                            2026-I
                          </span>
                          <span className="text-[10px] font-medium text-emerald-800 dark:text-emerald-400">
                            ({act2026I.length} actividades)
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-4 sm:px-6 border-r border-emerald-200/70 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          {item.destacado && (
                            <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          )}
                          <span>{item.actividad}</span>
                        </span>
                        {catMeta && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${catMeta.className}`}
                          >
                            {catMeta.label}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                        <span>{item.fecha}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* BLOQUE SEMESTRE 2026-II */}
              {act2026II.map((item, idx) => {
                const catMeta = item.categoria ? BADGE_CATEGORIA[item.categoria] : null;
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-rose-200/70 dark:border-slate-800 transition-colors ${
                      item.destacado
                        ? "bg-rose-100/70 dark:bg-rose-950/40 font-semibold"
                        : "bg-rose-50/45 dark:bg-slate-900/60 hover:bg-rose-100/50 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    {idx === 0 && (
                      <td
                        rowSpan={act2026II.length}
                        className="bg-rose-100/90 dark:bg-rose-950/60 border-r border-rose-300/80 dark:border-slate-800 px-3 py-4 text-center align-middle font-bold text-[#002855] dark:text-rose-300"
                      >
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-lg bg-red-800 dark:bg-rose-800 text-white text-xs font-extrabold tracking-wide shadow-2xs">
                            SEMESTRE
                          </span>
                          <span className="text-base sm:text-lg font-extrabold text-red-900 dark:text-rose-300 font-mono">
                            2026-II
                          </span>
                          <span className="text-[10px] font-medium text-rose-800 dark:text-rose-400">
                            ({act2026II.length} actividades)
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-4 sm:px-6 border-r border-rose-200/70 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          {item.destacado && (
                            <Sparkles className="w-3.5 h-3.5 text-red-700 dark:text-rose-400 shrink-0" />
                          )}
                          <span>{item.actividad}</span>
                        </span>
                        {catMeta && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${catMeta.className}`}
                          >
                            {catMeta.label}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-red-700 dark:text-rose-400 shrink-0" />
                        <span>{item.fecha}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {actividadesFiltradas.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-slate-500 dark:text-slate-400">
                    No se encontraron actividades que coincidan con el filtro aplicado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* NOTAS AL PIE OFICIALES (*), (**), (***) */}
        <div className="p-4 sm:p-6 bg-amber-50/70 dark:bg-slate-950/90 border-t border-amber-200/80 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
            <span className="font-bold text-[#002855] dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Disposiciones y Notas Oficiales del Régimen Semestral
            </span>
            <a
              href="https://sum.unmsm.edu.pe/alumnoWebSum/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#002855] dark:text-blue-400 hover:underline"
            >
              <span>Portal Sistema Único de Matrícula (SUM)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          {config.nota_pie_1 && (
            <p className="leading-relaxed bg-amber-100/60 dark:bg-slate-900 px-3 py-2 rounded-xl border border-amber-200/70 dark:border-slate-800">
              {config.nota_pie_1}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {config.nota_pie_2 && (
              <p className="leading-relaxed bg-amber-100/60 dark:bg-slate-900 px-3 py-2 rounded-xl border border-amber-200/70 dark:border-slate-800">
                {config.nota_pie_2}
              </p>
            )}
            {config.nota_pie_3 && (
              <p className="leading-relaxed bg-amber-100/60 dark:bg-slate-900 px-3 py-2 rounded-xl border border-amber-200/70 dark:border-slate-800">
                {config.nota_pie_3}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
