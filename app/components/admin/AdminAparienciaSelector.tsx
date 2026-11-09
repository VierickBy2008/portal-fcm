"use client";

import React from "react";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  GraduationCap,
  LayoutGrid,
  RotateCcw,
  Sliders,
  Sparkles,
  Type,
} from "lucide-react";
import type { DisenoPortadaId, TipografiaPortalId } from "@/app/types/portal";

interface AdminAparienciaSelectorProps {
  disenoPortadaActivo: DisenoPortadaId;
  tipografiaActiva: TipografiaPortalId;
  onCambiarDiseno: (nuevoDiseno: DisenoPortadaId) => void;
  onCambiarTipografia: (nuevaTipografia: TipografiaPortalId) => void;
  onRestaurarOriginal: () => void;
  onIrAPortada?: () => void;
  onAbrirEditorHero?: () => void;
}

const CATALOGO_DISENOS: Array<{
  id: DisenoPortadaId;
  titulo: string;
  subtitulo: string;
  etiqueta: string;
  descripcion: string;
  coloresMuestra: string[];
}> = [
  {
    id: "bento_moderno",
    titulo: "Diseño Moderno Bento Grid FCM 2026",
    subtitulo: "Arquitectura Interactiva & Dinámica (Original)",
    etiqueta: "Original Por Defecto",
    descripcion:
      "Carrusel Full-Width inmersivo con controles ghost sutiles, tarjetas Bento con fotografía referencial por escuela, píldoras de especialización y micro-interacciones GPU.",
    coloresMuestra: ["#002855", "#0284c7", "#8B1515", "#d97706"],
  },
  {
    id: "harvard_editorial",
    titulo: "Diseño Harvard / Ivy League Editorial",
    subtitulo: "Estándar Académico Solemne & Clásico",
    etiqueta: "Estilo Ivy League",
    descripcion:
      "Portada editorial inspirada en Harvard University: cabezal solemne en Granate Crimson (#8B1515), buscador estilo catálogo HOLLIS, departamentos simétricos y sección de prensa estilo 'The Harvard Gazette'.",
    coloresMuestra: ["#8B1515", "#002855", "#d97706", "#1e293b"],
  },
  {
    id: "academico_moderno",
    titulo: "Diseño Campus Académico Moderno",
    subtitulo: "Fusión Educativa + Paleta Institucional San Marcos",
    etiqueta: "Híbrido Oficial UNMSM",
    descripcion:
      "Combina el prestigio académico universitario con la paleta oficial de San Marcos (Azul Marino, Granate, Dorado y los 4 colores de Escuela): Hero split con 4 métricas editables, fichas curriculares fotográficas y boletín en 100% de las secciones.",
    coloresMuestra: ["#002855", "#8B1515", "#d97706", "#059669"],
  },
];

const CATALOGO_TIPOGRAFIAS: Array<{
  id: TipografiaPortalId;
  nombre: string;
  categoria: string;
  descripcion: string;
  muestraTitulo: string;
  muestraParrafo: string;
  fontFamilyPreview: string;
  headingFamilyPreview: string;
}> = [
  {
    id: "inter",
    nombre: "Inter / Geist Sans",
    categoria: "Moderna & Geométrica (Original)",
    descripcion:
      "Tipografía tecnológica sin serifa de claridad quirúrgica en pantallas de alta densidad.",
    muestraTitulo: "Ciencias Matemáticas UNMSM",
    muestraParrafo:
      "Formando científicos líderes en modelamiento matemático, estadística e inteligencia artificial.",
    fontFamilyPreview: "var(--font-geist-sans), system-ui, sans-serif",
    headingFamilyPreview: "var(--font-geist-sans), system-ui, sans-serif",
  },
  {
    id: "merriweather",
    nombre: "Merriweather & Playfair Serif",
    categoria: "Editorial Ivy League / Harvard",
    descripcion:
      "Combinación académica clásica con serifa solemne para titulares editoriales y lectura formal.",
    muestraTitulo: "Facultad de Ciencias Matemáticas",
    muestraParrafo:
      "Excelencia en investigación científica y rigor demostrativo en la Decana de América.",
    fontFamilyPreview: "var(--font-merriweather), Georgia, serif",
    headingFamilyPreview: "var(--font-playfair), var(--font-merriweather), Georgia, serif",
  },
  {
    id: "outfit",
    nombre: "Outfit Corporate",
    categoria: "Corporativa Contemporánea",
    descripcion:
      "Geometría humanista moderna con trazos equilibrados para portales ejecutivos e innovación.",
    muestraTitulo: "Innovación & Cómputo Científico",
    muestraParrafo:
      "Optimización de sistemas complejos, ciencia de datos y analítica predictiva de alto impacto.",
    fontFamilyPreview: "var(--font-outfit), system-ui, sans-serif",
    headingFamilyPreview: "var(--font-outfit), system-ui, sans-serif",
  },
  {
    id: "atkinson",
    nombre: "Atkinson Hyperlegible",
    categoria: "Alta Legibilidad & Accesibilidad",
    descripcion:
      "Diseñada por el Braille Institute para maximizar la distinción de caracteres y reducir fatiga visual.",
    muestraTitulo: "Educación Pública Inclusiva 2026",
    muestraParrafo:
      "Lectura ergonómica optimizada para estudiantes, docentes e investigadores con baja visión.",
    fontFamilyPreview: "var(--font-atkinson), system-ui, sans-serif",
    headingFamilyPreview: "var(--font-atkinson), system-ui, sans-serif",
  },
];

export function AdminAparienciaSelector({
  tipografiaActiva,
  onCambiarTipografia,
  onRestaurarOriginal,
  onIrAPortada,
  onAbrirEditorHero,
}: AdminAparienciaSelectorProps) {
  const esOriginal = tipografiaActiva === "inter";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
      {/* Cabecera del Módulo */}
      <div className="bg-gradient-to-r from-[#002855] via-[#001d3d] to-[#8B1515] p-6 sm:p-7 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Design System Oficial Unificado FCM 2026
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Arquitectura Oficial &ldquo;Campus Académico Moderno&rdquo; y Tipografía
          </h3>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-3xl">
            El portal se encuentra <strong>consolidado de forma definitiva</strong> bajo el diseño{" "}
            <strong>Campus Académico Moderno</strong>, fusionando el prestigio académico sanmarquino
            con la identidad cromática de sus 4 Escuelas Profesionales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onAbrirEditorHero && (
            <button
              type="button"
              onClick={onAbrirEditorHero}
              className="gpu-btn px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Sliders className="w-4 h-4 text-slate-950" />
              Editar Hero, Métricas y Noticias en Portada
            </button>
          )}
          {onIrAPortada && (
            <button
              type="button"
              onClick={onIrAPortada}
              className="gpu-btn px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              Ver Portal en Vivo
            </button>
          )}
          <button
            type="button"
            onClick={onRestaurarOriginal}
            disabled={esOriginal}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
              esOriginal
                ? "bg-white/10 text-white/50 border border-white/10 cursor-not-allowed"
                : "bg-white/20 hover:bg-white/30 text-white shadow-md cursor-pointer"
            }`}
            title="Restaura la fuente Inter institucional por defecto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Fuente Inter
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* SECCIÓN 1: DISEÑO DEFINITIVO CONSOLIDADO */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#002855]/10 dark:bg-blue-500/20 text-[#002855] dark:text-blue-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  1. Arquitectura Oficial Definitiva del Portal Principal
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Versión única estandarizada para todas las vistas públicas de la Facultad de Ciencias Matemáticas.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-4 h-4" />
              Diseño Definitivo Activo: Campus Académico Moderno
            </span>
          </div>

          <div className="rounded-2xl p-6 border-2 border-[#8B1515]/40 dark:border-amber-400/50 bg-gradient-to-br from-slate-50 via-white to-rose-50/20 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800/80 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-500/30">
                  Estándar Único Oficial UNMSM
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#002855]/10 text-[#002855] dark:bg-blue-950/80 dark:text-blue-300">
                  Hover Cromático por Escuela • Noticias 1+2 • Cuadro de Honor
                </span>
              </div>
              <h5 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#8B1515] dark:text-amber-400 shrink-0" />
                Diseño Campus Académico Moderno (Fusión Educativa & Moderna)
              </h5>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Combina el rigor académico universitario con la paleta oficial de San Marcos (Azul Marino{" "}
                <code>#002855</code>, Granate <code>#8B1515</code>, Dorado <code>#D97706</code> y los 4 colores de
                Escuela Profesional): Hero split con 4 métricas editables, tarjetas de carreras y docentes con borde
                cromático identitario al pasar el cursor, Cuadro de Honor completo y diagramación editorial de Noticias
                (1 Principal + 2 Secundarias).
              </p>
              <div className="flex items-center gap-2 pt-1">
                {["#002855", "#8B1515", "#d97706", "#2563eb", "#059669"].map((hex) => (
                  <span
                    key={hex}
                    className="w-4 h-4 rounded-full border border-white/60 shadow-xs"
                    style={{ backgroundColor: hex }}
                  />
                ))}
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-1">
                  Paleta Institucional & 4 Escuelas FCM
                </span>
              </div>
            </div>

            {onAbrirEditorHero && (
              <button
                type="button"
                onClick={onAbrirEditorHero}
                className="gpu-btn px-5 py-3 rounded-xl bg-gradient-to-r from-[#002855] to-[#8B1515] hover:opacity-95 text-white text-xs font-extrabold flex items-center gap-2 shadow-md cursor-pointer shrink-0"
              >
                <Sliders className="w-4 h-4 text-amber-300" />
                Configurar Portada y Noticias Destacadas
              </button>
            )}
          </div>
        </div>

        {/* SECCIÓN 2: SELECTOR DE TIPOGRAFÍAS INSTITUCIONALES */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#8B1515]/10 dark:bg-rose-500/20 text-[#8B1515] dark:text-rose-400 flex items-center justify-center">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  2. Sistema Dinámico de Tipografías Institucionales
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cambia la familia tipográfica de títulos, subtítulos, tarjetas y párrafos en todo el portal.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#002855] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              Tipografía activa:{" "}
              {CATALOGO_TIPOGRAFIAS.find((t) => t.id === tipografiaActiva)?.nombre || "Inter"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {CATALOGO_TIPOGRAFIAS.map((font) => {
              const activa = tipografiaActiva === font.id;
              return (
                <div
                  key={font.id}
                  onClick={() => onCambiarTipografia(font.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onCambiarTipografia(font.id);
                    }
                  }}
                  className={`rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    activa
                      ? "border-[#002855] dark:border-amber-400 bg-blue-50/40 dark:bg-slate-800/90 shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8B1515] dark:text-amber-400 block">
                          {font.categoria}
                        </span>
                        <h5 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {font.nombre}
                        </h5>
                      </div>
                      <span
                        className="text-xl font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                        style={{ fontFamily: font.headingFamilyPreview }}
                      >
                        Aa
                      </span>
                    </div>

                    {/* Muestra en vivo con la fuente real */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200/80 dark:border-slate-800 my-2.5">
                      <p
                        className="text-sm font-bold text-slate-900 dark:text-white mb-1 truncate"
                        style={{ fontFamily: font.headingFamilyPreview }}
                      >
                        {font.muestraTitulo}
                      </p>
                      <p
                        className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2"
                        style={{ fontFamily: font.fontFamilyPreview }}
                      >
                        {font.muestraParrafo}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {font.descripcion}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-extrabold ${
                        activa
                          ? "text-[#002855] dark:text-amber-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {activa ? "● Fuente Activa" : "Seleccionar fuente"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
