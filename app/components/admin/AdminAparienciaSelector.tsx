"use client";

import React from "react";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  LayoutGrid,
  RotateCcw,
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
      "Hero Slider cinemático con difuminado adaptable, Bento Grid interactivo con acentos cromáticos por escuela, píldoras de especialización y tarjetas modernas con micro-interacciones.",
    coloresMuestra: ["#002855", "#0284c7", "#8B1515", "#d97706"],
  },
  {
    id: "harvard_editorial",
    titulo: "Diseño Harvard / Ivy League Editorial",
    subtitulo: "Estándar Académico Solemne & Clásico",
    etiqueta: "Nuevo Estilo Ivy League",
    descripcion:
      "Portada editorial inspirada en Harvard University: cabezal solemne en Granate Crimson (#8B1515), buscador estilo catálogo HOLLIS, departamentos simétricos y sección de prensa estilo 'The Harvard Gazette'.",
    coloresMuestra: ["#8B1515", "#002855", "#d97706", "#1e293b"],
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
  disenoPortadaActivo,
  tipografiaActiva,
  onCambiarDiseno,
  onCambiarTipografia,
  onRestaurarOriginal,
  onIrAPortada,
}: AdminAparienciaSelectorProps) {
  const esOriginal =
    disenoPortadaActivo === "bento_moderno" && tipografiaActiva === "inter";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
      {/* Cabecera del Módulo */}
      <div className="bg-gradient-to-r from-[#002855] via-[#001d3d] to-[#8B1515] p-6 sm:p-7 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Personalización Institucional en Vivo
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Conmutador de Diseño Principal y Tipografía Global
          </h3>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-3xl">
            Alterna en tiempo real entre el <strong>Diseño Moderno Bento Grid FCM</strong> y el{" "}
            <strong>Diseño Académico Editorial estilo Harvard University</strong>, o cambia la
            familia tipográfica de todo el portal. Los cambios se sincronizan automáticamente en Supabase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onIrAPortada && (
            <button
              type="button"
              onClick={onIrAPortada}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              Ver Portada en Vivo
            </button>
          )}
          <button
            type="button"
            onClick={onRestaurarOriginal}
            disabled={esOriginal}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
              esOriginal
                ? "bg-white/10 text-white/50 border border-white/10 cursor-not-allowed"
                : "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md cursor-pointer"
            }`}
            title="Restaura el diseño Bento Grid FCM 2026 y la fuente Inter original"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Original (Bento + Inter)
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* SECCIÓN 1: CONMUTADOR DE DISEÑO ARQUITECTÓNICO DE PORTADA */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#002855]/10 dark:bg-blue-500/20 text-[#002855] dark:text-blue-400 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  1. Arquitectura de Portada Principal (Layout Switcher)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Elige qué diseño verá el público al ingresar a la página de inicio del portal.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Activo:{" "}
              {disenoPortadaActivo === "harvard_editorial"
                ? "Harvard Editorial"
                : "Bento Grid FCM 2026"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {CATALOGO_DISENOS.map((layout) => {
              const activo = disenoPortadaActivo === layout.id;
              return (
                <div
                  key={layout.id}
                  onClick={() => onCambiarDiseno(layout.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onCambiarDiseno(layout.id);
                    }
                  }}
                  className={`group relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    activo
                      ? "border-[#8B1515] dark:border-amber-400 bg-rose-50/30 dark:bg-slate-800/90 shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div>
                    {/* Cabecera de la tarjeta */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span
                          className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5 ${
                            layout.id === "harvard_editorial"
                              ? "bg-[#8B1515]/10 text-[#8B1515] dark:bg-rose-950/80 dark:text-rose-300 border border-[#8B1515]/20"
                              : "bg-[#002855]/10 text-[#002855] dark:bg-blue-950/80 dark:text-blue-300 border border-[#002855]/20"
                          }`}
                        >
                          {layout.etiqueta}
                        </span>
                        <h5 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          {layout.id === "harvard_editorial" ? (
                            <BookOpen className="w-4 h-4 text-[#8B1515] dark:text-amber-400 shrink-0" />
                          ) : (
                            <LayoutGrid className="w-4 h-4 text-[#002855] dark:text-blue-400 shrink-0" />
                          )}
                          {layout.titulo}
                        </h5>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {layout.subtitulo}
                        </p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition ${
                          activo
                            ? "bg-[#8B1515] dark:bg-amber-400 text-white dark:text-slate-950 shadow-sm"
                            : "border-2 border-slate-300 dark:border-slate-700 text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Mini Wireframe Visual */}
                    {layout.id === "bento_moderno" ? (
                      <div className="rounded-xl bg-slate-900 p-3 mb-3.5 border border-slate-800 text-white">
                        <div className="h-7 rounded-lg bg-gradient-to-r from-[#002855] to-sky-700 mb-2 flex items-center justify-between px-2.5">
                          <span className="text-[9px] font-bold tracking-wider uppercase text-sky-200">
                            Hero Slider + Buscador
                          </span>
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          <div className="h-10 rounded bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-[8px] font-bold text-sky-300">
                            EPCC
                          </div>
                          <div className="h-10 rounded bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-[8px] font-bold text-blue-300">
                            EPM
                          </div>
                          <div className="h-10 rounded bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-[8px] font-bold text-amber-300">
                            EPE
                          </div>
                          <div className="h-10 rounded bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-[8px] font-bold text-rose-300">
                            EPIO
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-[#faf8f5] dark:bg-slate-950 p-3 mb-3.5 border border-stone-300 dark:border-slate-800">
                        <div className="h-7 rounded bg-gradient-to-r from-[#8B1515] to-[#002855] mb-2 flex items-center justify-between px-2.5 text-white">
                          <span className="text-[9px] font-serif italic tracking-wider text-amber-200">
                            VERITAS ET SCIENTIA • HARVARD CRIMSON
                          </span>
                          <span className="text-[8px] uppercase px-1.5 py-0.5 bg-white/15 rounded">
                            Gazette
                          </span>
                        </div>
                        <div className="grid grid-cols-12 gap-1.5">
                          <div className="col-span-7 h-10 rounded bg-stone-200/80 dark:bg-slate-900 border border-stone-300 dark:border-slate-800 px-2 flex items-center text-[8px] font-serif font-bold text-slate-700 dark:text-slate-300">
                            Editorial Principal a 2 Columnas
                          </div>
                          <div className="col-span-5 h-10 rounded bg-stone-200/80 dark:bg-slate-900 border border-stone-300 dark:border-slate-800 px-2 flex items-center text-[8px] font-serif text-slate-600 dark:text-slate-400">
                            4 Departamentos Solemnes
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {layout.descripcion}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {layout.coloresMuestra.map((hex) => (
                        <span
                          key={hex}
                          className="w-4 h-4 rounded-full border border-white/50 shadow-xs"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-xs font-extrabold ${
                        activo
                          ? "text-[#8B1515] dark:text-amber-400"
                          : "text-slate-500 group-hover:text-slate-800 dark:group-hover:text-white"
                      }`}
                    >
                      {activo ? "✓ Diseño Seleccionado" : "Aplicar este diseño →"}
                    </span>
                  </div>
                </div>
              );
            })}
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
                    {font.id === "merriweather" &&
                      disenoPortadaActivo === "harvard_editorial" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          Recomendada Harvard
                        </span>
                      )}
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
