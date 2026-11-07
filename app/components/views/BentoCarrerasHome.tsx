"use client";

import React from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Clock,
  Cpu,
  Download,
  GraduationCap,
  Layers,
  Network,
  Sigma,
  Sparkles,
} from "lucide-react";
import type { Carrera, CarreraId, CursoMalla } from "@/app/types/portal";
import { TEMA_CARRERA } from "@/app/data/portalInitialData";
import { BENTO_ESPECIALIZACIONES_DEFAULT } from "@/app/data/portalExtrasData";

interface BentoCarrerasHomeProps {
  carreras: Carrera[];
  malla: CursoMalla[];
  onExplorarCarrera: (id: CarreraId) => void;
  onDescargarTripticoCarrera: (carrera: Carrera, e: React.MouseEvent) => void;
}

const BENTO_META: Record<
  CarreraId,
  {
    subtitulo: string;
    pilares: string[];
    glowClass: string;
    accentRing: string;
    accentText: string;
    badgePill: string;
    bentoSpan: string;
    creditosReferencia: number;
  }
> = {
  "computacion-cientifica": {
    subtitulo: BENTO_ESPECIALIZACIONES_DEFAULT["computacion-cientifica"].subtitulo,
    pilares: BENTO_ESPECIALIZACIONES_DEFAULT["computacion-cientifica"].pilares,
    glowClass: "from-blue-600/25 via-cyan-500/15 to-transparent",
    accentRing: "hover:border-blue-500 dark:hover:border-cyan-400 hover:shadow-blue-900/20",
    accentText: "text-blue-700 dark:text-cyan-400",
    badgePill: "bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-cyan-300 border-blue-200 dark:border-blue-800",
    bentoSpan: "lg:col-span-6",
    creditosReferencia: BENTO_ESPECIALIZACIONES_DEFAULT["computacion-cientifica"].creditos,
  },
  matematica: {
    subtitulo: BENTO_ESPECIALIZACIONES_DEFAULT["matematica"].subtitulo,
    pilares: BENTO_ESPECIALIZACIONES_DEFAULT["matematica"].pilares,
    glowClass: "from-red-600/25 via-rose-500/15 to-transparent",
    accentRing: "hover:border-red-600 dark:hover:border-red-400 hover:shadow-red-900/20",
    accentText: "text-red-700 dark:text-red-400",
    badgePill: "bg-red-50 dark:bg-red-950/70 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",
    bentoSpan: "lg:col-span-6",
    creditosReferencia: BENTO_ESPECIALIZACIONES_DEFAULT["matematica"].creditos,
  },
  estadistica: {
    subtitulo: BENTO_ESPECIALIZACIONES_DEFAULT["estadistica"].subtitulo,
    pilares: BENTO_ESPECIALIZACIONES_DEFAULT["estadistica"].pilares,
    glowClass: "from-orange-500/25 via-amber-500/15 to-transparent",
    accentRing: "hover:border-orange-500 dark:hover:border-amber-400 hover:shadow-orange-900/20",
    accentText: "text-orange-600 dark:text-amber-400",
    badgePill: "bg-orange-50 dark:bg-orange-950/70 text-orange-800 dark:text-amber-300 border-orange-200 dark:border-orange-800",
    bentoSpan: "lg:col-span-6",
    creditosReferencia: BENTO_ESPECIALIZACIONES_DEFAULT["estadistica"].creditos,
  },
  "investigacion-operativa": {
    subtitulo: BENTO_ESPECIALIZACIONES_DEFAULT["investigacion-operativa"].subtitulo,
    pilares: BENTO_ESPECIALIZACIONES_DEFAULT["investigacion-operativa"].pilares,
    glowClass: "from-emerald-600/25 via-teal-500/15 to-transparent",
    accentRing: "hover:border-emerald-600 dark:hover:border-emerald-400 hover:shadow-emerald-900/20",
    accentText: "text-emerald-700 dark:text-emerald-400",
    badgePill: "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    bentoSpan: "lg:col-span-6",
    creditosReferencia: BENTO_ESPECIALIZACIONES_DEFAULT["investigacion-operativa"].creditos,
  },
};

function renderIconoBento(id: CarreraId) {
  switch (id) {
    case "computacion-cientifica":
      return <Cpu className="w-6 h-6 text-blue-700 dark:text-cyan-400" />;
    case "matematica":
      return <Sigma className="w-6 h-6 text-red-700 dark:text-red-400" />;
    case "estadistica":
      return <BarChart3 className="w-6 h-6 text-orange-600 dark:text-amber-400" />;
    case "investigacion-operativa":
      return <Network className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />;
  }
}

export function BentoCarrerasHome({
  carreras,
  malla,
  onExplorarCarrera,
  onDescargarTripticoCarrera,
}: BentoCarrerasHomeProps) {
  return (
    <section className="space-y-6 reveal-on-scroll">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b-2 border-blue-900 dark:border-blue-800 pb-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-[#002855] dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-red-700 dark:text-red-400" />
            <span>Plan de Estudios 2026 • Ciclos 1 al 10</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#002855] dark:text-white tracking-tight">
            Escuelas Profesionales de la Facultad
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 max-w-md">
          Explora las 4 carreras oficiales de pregrado, sus especializaciones de póster, mapa interactivo de prerrequisitos y descarga directa de trípticos en PDF.
        </p>
      </div>

      {/* BENTO GRID INTERACTIVO DE LAS 4 ESCUELAS PROFESIONALES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {carreras.map((car, idx) => {
          const cursosCar = malla.filter((c) => c.carrera_id === car.id);
          const totalCreditosMalla = cursosCar.reduce((acc, c) => acc + c.creditos, 0);
          const temaCar = TEMA_CARRERA[car.id];
          const meta = BENTO_META[car.id];
          const staggerClass = `stagger-fade-up stagger-delay-${(idx % 4) + 1}`;

          const subtituloMostrar =
            car.subtitulo_bento && car.subtitulo_bento.trim().length > 0
              ? car.subtitulo_bento
              : meta.subtitulo;

          const pilaresMostrar =
            Array.isArray(car.pilares_bento) && car.pilares_bento.filter((p) => p.trim().length > 0).length > 0
              ? car.pilares_bento.filter((p) => p.trim().length > 0)
              : meta.pilares;

          const duracionMostrar =
            car.duracion_bento && car.duracion_bento.trim().length > 0
              ? car.duracion_bento
              : "5 años • 10 ciclos";

          const creditosMostrar =
            typeof car.creditos_bento === "number" && car.creditos_bento > 0
              ? String(car.creditos_bento)
              : totalCreditosMalla >= 180
              ? totalCreditosMalla.toFixed(0)
              : String(meta.creditosReferencia);

          return (
            <div
              key={car.id}
              onClick={() => onExplorarCarrera(car.id)}
              className={`${meta.bentoSpan} ${staggerClass} group relative rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 ${meta.accentRing} shadow-sm hover:shadow-2xl overflow-hidden cursor-pointer flex flex-col justify-between gpu-card`}
            >
              {/* Resplandor perimetral por GPU al hacer hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${meta.glowClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform-gpu`}
              />

              {/* Franja superior temática con código oficial y métricas rápidas */}
              <div>
                <div
                  className={`${temaCar.headerBg} text-white px-6 py-4 flex flex-wrap items-center justify-between gap-2 border-b-2 ${temaCar.borderAccent} relative z-10`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-xs text-xs font-mono font-bold text-white border border-white/20">
                      {car.codigo_escuela}
                    </span>
                    <span className="text-xs font-bold tracking-wide text-white/95 uppercase">
                      Pregrado UNMSM
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold bg-white/15 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {duracionMostrar}
                    </span>
                    <span className="text-[11px] font-mono font-bold bg-black/30 px-2.5 py-1 rounded-lg border border-white/15">
                      {creditosMostrar} cr.
                    </span>
                  </div>
                </div>

                {/* Cuerpo de la Celda Bento */}
                <div className="p-6 space-y-4 relative z-10">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3.5 rounded-2xl border ${temaCar.iconWrap} dark:bg-slate-800 dark:border-slate-700 shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300 transform-gpu`}
                    >
                      {renderIconoBento(car.id)}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className={`text-[11px] font-bold uppercase tracking-wider block ${meta.accentText}`}>
                        {subtituloMostrar}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#002855] dark:text-white group-hover:text-red-700 dark:group-hover:text-white transition-colors leading-tight">
                        E.P. de {car.nombre}
                      </h3>
                    </div>
                  </div>

                  {/* Pilares académicos / Especializaciones del Póster en micro-badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {pilaresMostrar.map((pilar) => (
                      <span
                        key={pilar}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border bento-pill-gpu ${meta.badgePill}`}
                      >
                        ✦ {pilar}
                      </span>
                    ))}
                  </div>

                  {/* Resumen del perfil de egreso en 2 líneas */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {car.perfil_egreso || car.descripcion}
                  </p>

                  {/* Micro-métricas de Grado, Título y Asignaturas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 px-3.5 py-2.5 flex items-center gap-2.5">
                      <GraduationCap className={`w-4 h-4 shrink-0 ${meta.accentText}`} />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
                          Grado Académico
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                          {car.grado_academico}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 px-3.5 py-2.5 flex items-center gap-2.5">
                      <Layers className={`w-4 h-4 shrink-0 ${meta.accentText}`} />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
                          Plan Curricular 2026
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                          {cursosCar.length} asignaturas registradas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pie de celda Bento con doble acción rápida */}
              <div className="px-6 py-4 bg-slate-50/90 dark:bg-slate-950/70 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 relative z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExplorarCarrera(car.id);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#002855] dark:bg-blue-700 hover:bg-blue-900 dark:hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer gpu-btn"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Explorar Carrera y Malla</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>

                <button
                  type="button"
                  onClick={(e) => onDescargarTripticoCarrera(car, e)}
                  className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-red-700 dark:hover:bg-red-700 text-slate-800 dark:text-slate-200 hover:text-white border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer gpu-btn"
                  title={`Descargar Tríptico Oficial de ${car.nombre} en PDF`}
                >
                  <Download className="w-3.5 h-3.5 text-red-700 dark:text-red-400 group-hover:text-white" />
                  <span>Descargar Tríptico Oficial (PDF)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
