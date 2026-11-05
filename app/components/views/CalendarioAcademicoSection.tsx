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
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  FileText,
  CalendarDays,
  Flame,
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
      "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800",
  },
  evaluacion: {
    label: "Evaluación",
    className:
      "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800",
  },
  clases: {
    label: "Clases",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800",
  },
  actas: {
    label: "Notas y Actas",
    className:
      "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800",
  },
  tramite: {
    label: "Trámite SUM",
    className:
      "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
};

export function CalendarioAcademicoSection({ config }: CalendarioAcademicoSectionProps) {
  const [desplegadoI, setDesplegadoI] = useState<boolean>(true);
  const [desplegadoII, setDesplegadoII] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");

  const actividadesFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return config.actividades.filter((item) => {
      if (filtroCategoria !== "todas" && item.categoria !== filtroCategoria) return false;
      if (!q) return true;
      return (
        item.actividad.toLowerCase().includes(q) ||
        item.fecha.toLowerCase().includes(q) ||
        item.semestre.toLowerCase().includes(q)
      );
    });
  }, [config.actividades, filtroCategoria, busqueda]);

  const act2026I = useMemo(
    () => actividadesFiltradas.filter((a) => a.semestre === "2026-I"),
    [actividadesFiltradas]
  );
  const act2026II = useMemo(
    () => actividadesFiltradas.filter((a) => a.semestre === "2026-II"),
    [actividadesFiltradas]
  );

  const handleImprimirCronograma = (semestre?: "2026-I" | "2026-II") => {
    if (typeof window === "undefined") return;
    const ventana = window.open("", "_blank", "width=1050,height=800");
    if (!ventana) {
      window.print();
      return;
    }

    const itemsI = config.actividades.filter((a) => a.semestre === "2026-I");
    const itemsII = config.actividades.filter((a) => a.semestre === "2026-II");

    const renderTablaHtml = (titulo: string, items: ActividadCalendario[], color: string) => `
      <div style="margin-bottom:24px;border:1px solid #CBD5E1;border-radius:12px;overflow:hidden">
        <div style="background:${color};color:#ffffff;padding:10px 16px;display:flex;justify-content:space-between;align-items:center">
          <strong style="font-size:14px;letter-spacing:0.5px">${titulo}</strong>
          <span style="font-size:12px;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:6px">${items.length} Actividades</span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead>
            <tr style="background:#F1F5F9;border-bottom:1px solid #CBD5E1">
              <th style="padding:8px 12px;text-align:left;width:60%">ACTIVIDAD ACADÉMICA / ADMINISTRATIVA</th>
              <th style="padding:8px 12px;text-align:left;width:40%">FECHA OFICIAL</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (act) => `
              <tr style="border-bottom:1px solid #E2E8F0;background:${act.destacado ? "#FEF3C7" : "transparent"}">
                <td style="padding:8px 12px;font-weight:${act.destacado ? "700" : "500"}">${act.actividad}</td>
                <td style="padding:8px 12px;color:#1E293B;font-family:sans-serif">${act.fecha}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    ventana.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8"/>
        <title>Cronograma Académico Oficial 2026 — FCM UNMSM</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #0F172A; margin: 28px; line-height: 1.4; }
          .no-print { display: none; }
          @media print { .no-print { display: none !important; } }
        </style>
      </head>
      <body>
        <div style="border-bottom:3px solid #B91C1C;padding-bottom:10px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:flex-end">
          <div>
            <div style="font-size:11px;font-weight:700;color:#B91C1C;text-transform:uppercase">Universidad Nacional Mayor de San Marcos • Decana de América</div>
            <h1 style="margin:4px 0 2px 0;font-size:20px;color:#002855">FACULTAD DE CIENCIAS MATEMÁTICAS</h1>
            <h2 style="margin:0;font-size:14px;color:#334155">${config.titulo || "RÉGIMEN SEMESTRAL — CRONOGRAMA ACADÉMICO 2026"}</h2>
          </div>
          <div style="text-align:right;font-size:11px;color:#64748B">
            <div>Sistema Único de Matrícula (SUM)</div>
            <div>Oficina de Matrícula y Archivo</div>
          </div>
        </div>
        ${!semestre || semestre === "2026-I" ? renderTablaHtml("SEMESTRE ACADÉMICO 2026-I", itemsI, "#002855") : ""}
        ${!semestre || semestre === "2026-II" ? renderTablaHtml("SEMESTRE ACADÉMICO 2026-II", itemsII, "#991B1B") : ""}
        <div style="margin-top:16px;padding:12px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:8px;font-size:11px;color:#92400E">
          <div><strong>(*)</strong> ${config.nota_pie_1 || ""}</div>
          <div style="margin-top:4px"><strong>(**)</strong> ${config.nota_pie_2 || ""}</div>
          <div style="margin-top:4px"><strong>(***)</strong> ${config.nota_pie_3 || ""}</div>
        </div>
        <script>
          window.onload = function() { setTimeout(function() { window.print(); }, 250); }
        </script>
      </body>
      </html>
    `);
    ventana.document.close();
  };

  return (
    <section id="calendario-academico" className="pt-4 space-y-6 reveal-on-scroll">
      {/* Cabecera Principal de la Sección */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b-2 border-blue-900 dark:border-blue-800 pb-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900/60 text-[#002855] dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-red-700 dark:text-red-400" />
            <span>RÉGIMEN SEMESTRAL • SUM UNMSM 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#002855] dark:text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-red-700 dark:text-red-400" />
            <span>{config.titulo || "Cronograma Académico Oficial 2026"}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {config.subtitulo ||
              "Programación oficial aprobada de actividades de matrícula, evaluaciones y cierre de actas para los Semestres 2026-I y 2026-II de la Facultad de Ciencias Matemáticas."}
          </p>
        </div>

        {/* Acciones Rápidas Globales */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end">
          <button
            type="button"
            onClick={() => {
              const abrir = !(desplegadoI && desplegadoII);
              setDesplegadoI(abrir);
              setDesplegadoII(abrir);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer transition-colors"
          >
            {desplegadoI && desplegadoII ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Colapsar Ambos</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expandir Ambos</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleImprimirCronograma()}
            className="gpu-btn px-4 py-2 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            title="Imprimir o exportar PDF oficial del Régimen 2026"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Imprimir Régimen Completo (PDF)</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtro Rápido y Búsqueda de Trámites */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar trámite o fecha en ambos semestres (ej. matrícula regular, convalidación, evaluación final, aplazados)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#002855]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
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
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                filtroCategoria === cat.id
                  ? "bg-[#002855] text-white shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DE 2 OPCIONES MODULARES EN PARALELO (IZQUIERDA: 2026-I | DERECHA: 2026-II) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ========================================================================= */}
        {/* TARJETA 1 (IZQUIERDA): SEMESTRE 2026-I (AZUL INSTITUCIONAL UNMSM)         */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border-2 border-blue-900/40 dark:border-blue-950 bg-gradient-to-b from-[#001738] via-[#001229] to-[#000a17] text-white shadow-xl overflow-hidden flex flex-col justify-between transition-all">
          {/* Header Superior Azul tipo Bento (como en la imagen de referencia) */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#002855] via-[#03346e] to-[#0b4b98] border-b border-blue-400/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-black tracking-wider bg-black/40 text-cyan-300 border border-cyan-400/30">
                SEMESTRE 2026-I
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-100">
                PREGRADO UNMSM
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white backdrop-blur-xs border border-white/10 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-300" />
                <span>16 semanas</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
                {act2026I.length} actividades
              </span>
            </div>
          </div>

          {/* Cuerpo Principal de la Tarjeta 2026-I */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-md shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 block">
                  CICLO ACADÉMICO DE OTOÑO
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Semestre Académico 2026-I
                </h3>
              </div>
            </div>

            {/* Píldoras de Hitos Clave (como en la imagen de referencia) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-900/60 text-cyan-200 border border-blue-700/60 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Clases: 30 Mar - 18 Jul</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-900/60 text-cyan-200 border border-blue-700/60 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Matrícula: 16 - 20 Mar</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-900/60 text-cyan-200 border border-blue-700/60 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Parciales: 18 - 22 May</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-900/60 text-cyan-200 border border-blue-700/60 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Finales: 13 - 17 Jul</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Programación oficial del primer semestre académico. Contempla el proceso regular y extemporáneo de matrícula por el SUM, 16 semanas lectivas continuas y el periodo de exámenes de aplazados.
            </p>

            {/* 2 Cajas Métricas Inferiores (como en la imagen) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  PERIODO DE CLASES
                </span>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>30 Marzo – 18 Julio 2026</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  CIERRE DE ACTAS SUM
                </span>
                <p className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lunes 27 de julio de 2026</span>
                </p>
              </div>
            </div>

            {/* Botones de Acción (Desplegar / Imprimir) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => setDesplegadoI(!desplegadoI)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                {desplegadoI ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>Ocultar Cronograma 2026-I</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>Desplegar Cronograma 2026-I ({act2026I.length} fechas)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleImprimirCronograma("2026-I")}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/15 cursor-pointer transition-colors"
                title="Descargar o imprimir solo el Semestre 2026-I en PDF"
              >
                <Printer className="w-4 h-4 text-cyan-300" />
                <span>PDF 2026-I</span>
              </button>
            </div>
          </div>

          {/* TABLA DESPLEGABLE CON LAS 18 ACTIVIDADES DEL 2026-I */}
          {desplegadoI && (
            <div className="border-t border-blue-900/60 bg-slate-950/80 p-4 sm:p-5 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <span className="font-bold text-cyan-300">
                  Actividades Oficiales ({act2026I.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  Semestre 2026-I
                </span>
              </div>

              <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                {act2026I.map((item, idx) => {
                  const catMeta = item.categoria ? BADGE_CATEGORIA[item.categoria] : null;
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        item.destacado
                          ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-100"
                          : "bg-white/5 border-white/5 text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold leading-snug">
                            {item.actividad}
                          </span>
                          {catMeta && (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${catMeta.className}`}
                            >
                              {catMeta.label}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[11px] font-medium shrink-0 pl-7 sm:pl-0">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{item.fecha}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* TARJETA 2 (DERECHA): SEMESTRE 2026-II (ROJO GRANATE SAN MARCOS)           */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border-2 border-red-900/40 dark:border-red-950 bg-gradient-to-b from-[#2b050d] via-[#1a0308] to-[#0a0104] text-white shadow-xl overflow-hidden flex flex-col justify-between transition-all">
          {/* Header Superior Rojo tipo Bento (como en la imagen de referencia) */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#b91c1c] border-b border-red-400/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-black tracking-wider bg-black/40 text-amber-300 border border-amber-400/30">
                SEMESTRE 2026-II
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-100">
                PREGRADO UNMSM
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white backdrop-blur-xs border border-white/10 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-300" />
                <span>16 semanas</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                {act2026II.length} actividades
              </span>
            </div>
          </div>

          {/* Cuerpo Principal de la Tarjeta 2026-II */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-md shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-400 block">
                  CICLO ACADÉMICO DE PRIMAVERA
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Semestre Académico 2026-II
                </h3>
              </div>
            </div>

            {/* Píldoras de Hitos Clave (como en la imagen de referencia) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950/80 text-amber-200 border border-red-800/80 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Clases: 24 Ago - 12 Dic</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950/80 text-amber-200 border border-red-800/80 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Matrícula: 10 - 14 Ago</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950/80 text-amber-200 border border-red-800/80 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Parciales: 12 - 17 Oct</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950/80 text-amber-200 border border-red-800/80 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Finales: 07 - 12 Dic</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Programación oficial del segundo semestre académico. Incluye pre-matrícula, matrícula regular, rectificación de asignaturas, evaluaciones parciales/finales y exámenes de aplazados previos a fin de año.
            </p>

            {/* 2 Cajas Métricas Inferiores (como en la imagen) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  PERIODO DE CLASES
                </span>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>24 Agosto – 12 Diciembre 2026</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  CIERRE DE ACTAS SUM
                </span>
                <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lunes 21 de diciembre de 2026</span>
                </p>
              </div>
            </div>

            {/* Botones de Acción (Desplegar / Imprimir) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => setDesplegadoII(!desplegadoII)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                {desplegadoII ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>Ocultar Cronograma 2026-II</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>Desplegar Cronograma 2026-II ({act2026II.length} fechas)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleImprimirCronograma("2026-II")}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/15 cursor-pointer transition-colors"
                title="Descargar o imprimir solo el Semestre 2026-II en PDF"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>PDF 2026-II</span>
              </button>
            </div>
          </div>

          {/* TABLA DESPLEGABLE CON LAS 17 ACTIVIDADES DEL 2026-II */}
          {desplegadoII && (
            <div className="border-t border-red-900/60 bg-slate-950/80 p-4 sm:p-5 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <span className="font-bold text-amber-300">
                  Actividades Oficiales ({act2026II.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  Semestre 2026-II
                </span>
              </div>

              <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                {act2026II.map((item, idx) => {
                  const catMeta = item.categoria ? BADGE_CATEGORIA[item.categoria] : null;
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        item.destacado
                          ? "bg-red-950/40 border-red-500/40 text-amber-100"
                          : "bg-white/5 border-white/5 text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-red-900/60 border border-red-400/30 text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold leading-snug">
                            {item.actividad}
                          </span>
                          {catMeta && (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${catMeta.className}`}
                            >
                              {catMeta.label}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-amber-300 font-mono text-[11px] font-medium shrink-0 pl-7 sm:pl-0">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{item.fecha}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DISPOSICIONES Y NOTAS AL PIE OFICIALES (*), (**), (***) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-slate-900/80 border border-amber-200/80 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-amber-200/60 dark:border-slate-800">
          <span className="font-bold text-[#002855] dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Disposiciones y Notas Oficiales del Régimen Semestral</span>
          </span>
          <a
            href="https://sum.unmsm.edu.pe/alumnoWebSum/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#002855] dark:text-blue-400 hover:underline"
          >
            <span>Portal SUM Alumnos UNMSM</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {config.nota_pie_1 && (
          <p className="leading-relaxed bg-amber-100/60 dark:bg-slate-950 px-3 py-2 rounded-xl border border-amber-200/70 dark:border-slate-800">
            {config.nota_pie_1}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {config.nota_pie_2 && (
            <p className="leading-relaxed bg-amber-100/60 dark:bg-slate-950 px-3 py-2 rounded-xl border border-amber-200/70 dark:border-slate-800">
              {config.nota_pie_2}
            </p>
          )}
          {config.nota_pie_3 && (
            <p className="leading-relaxed bg-amber-100/60 dark:bg-slate-950 px-3 py-2 rounded-xl border border-amber-200/70 dark:border-slate-800">
              {config.nota_pie_3}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
