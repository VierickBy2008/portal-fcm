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
  modoAvance1?: boolean;
  onToggleModoAvance1?: (activo: boolean) => void;
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
  disenoPortadaActivo,
  tipografiaActiva,
  onCambiarDiseno,
  onCambiarTipografia,
  onRestaurarOriginal,
  onIrAPortada,
  onAbrirEditorHero,
  modoAvance1 = false,
  onToggleModoAvance1,
}: AdminAparienciaSelectorProps) {
  const esOriginal = tipografiaActiva === "inter" && disenoPortadaActivo === "academico_moderno" && !modoAvance1;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
      {/* Cabecera del Módulo */}
      <div className="bg-gradient-to-r from-[#002855] via-[#001d3d] to-[#8B1515] p-6 sm:p-7 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Control de Presentación y Diseño • MATHUB FCM 2026
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Modo de Presentación (1er. Avance vs. Proyecto Completo) y Diseño
          </h3>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-3xl">
            Alterna con un clic entre el <strong>Modo 1er. Avance</strong> (muestra únicamente la versión de la primera imagen con portada, buscador de cursos, 4 escuelas, mallas y cronograma) y el <strong>Proyecto Completo</strong>.
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
              Editar Hero y Portada
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
            title="Restaura el diseño completo y fuente Inter por defecto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Todo
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* SECCIÓN 0: INTERRUPTOR MODO 1ER AVANCE VS PROYECTO COMPLETO */}
        {onToggleModoAvance1 && (
          <div className="rounded-2xl p-5 sm:p-6 border-2 border-amber-400/60 dark:border-amber-500/50 bg-gradient-to-br from-amber-50/70 via-white to-blue-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Modo de Exposición Pública del Proyecto (1er. Avance vs. Completo)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Controla qué avances y versión visual ven los visitantes y evaluadores en el portal público.
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-1.5 rounded-full border ${
                  modoAvance1
                    ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                    : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {modoAvance1 ? "Activo: Modo Presentación 1er. Avance" : "Activo: Proyecto Completo (100%)"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opción A: Modo 1er Avance */}
              <button
                type="button"
                onClick={() => onToggleModoAvance1(true)}
                className={`text-left rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  modoAvance1
                    ? "border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-400/30"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      Presentación 1er. Avance (2.5 Meses)
                    </span>
                    {modoAvance1 && (
                      <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300">
                        ● Seleccionado
                      </span>
                    )}
                  </div>
                  <h5 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Mostrar Solo 1er. Avance (Versión de la Primera Imagen)
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Activa el diseño original <strong>Bento Grid (1.ª Imagen)</strong> y muestra únicamente: Portada con Buscador de Cursos, las 4 Escuelas Profesionales, Mallas Curriculares de 10 Ciclos y Cronograma 2026. Oculta Repositorio, Docentes, Noticias, Transparencia, Contacto, Chatbot IA y Accesibilidad.
                  </p>
                </div>
                <span className="text-xs font-extrabold text-[#002855] dark:text-amber-400">
                  {modoAvance1 ? "✓ Modo 1er. Avance activado en vivo" : "Activar fachada de 1er. Avance →"}
                </span>
              </button>

              {/* Opción B: Proyecto Completo */}
              <button
                type="button"
                onClick={() => onToggleModoAvance1(false)}
                className={`text-left rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  !modoAvance1
                    ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/25 shadow-md ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                      Proyecto Terminado (Avances 1, 2 y 3)
                    </span>
                    {!modoAvance1 && (
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                        ● Seleccionado
                      </span>
                    )}
                  </div>
                  <h5 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Mostrar Proyecto Completo (Todos los Módulos)
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Habilita el 100% de la plataforma: Repositorio Colaborativo (PPTs, guías, exámenes), Plana Docente y Reseñas, Hemeroteca de Noticias, Orgullo FCM, Transparencia, Mesa de Ayuda, Asistente Virtual con IA y Accesibilidad WCAG 2.1.
                  </p>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                  {!modoAvance1 ? "✓ Todos los módulos activos en vivo" : "Restaurar Proyecto Completo →"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* SECCIÓN 1: SELECTOR DE VERSIÓN VISUAL DE PORTADA */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#002855]/10 dark:bg-blue-500/20 text-[#002855] dark:text-blue-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  1. Selector de Versión de Diseño de la Portada
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Elige entre la versión inicial de la primera imagen (Bento Grid) o el diseño Campus Académico Moderno.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-4 h-4" />
              Diseño Activo: {CATALOGO_DISENOS.find((d) => d.id === disenoPortadaActivo)?.titulo || disenoPortadaActivo}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {CATALOGO_DISENOS.map((diseno) => {
              const activo = disenoPortadaActivo === diseno.id;
              return (
                <div
                  key={diseno.id}
                  onClick={() => onCambiarDiseno(diseno.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onCambiarDiseno(diseno.id);
                    }
                  }}
                  className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                    activo
                      ? "border-[#002855] dark:border-amber-400 bg-blue-50/40 dark:bg-slate-800/90 shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-500/30">
                        {diseno.etiqueta}
                      </span>
                      <div className="flex items-center gap-1">
                        {diseno.coloresMuestra.map((hex) => (
                          <span
                            key={hex}
                            className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                    <h5 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {diseno.titulo}
                    </h5>
                    <p className="text-[11px] font-semibold text-[#8B1515] dark:text-amber-300">
                      {diseno.subtitulo}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {diseno.descripcion}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold ${
                        activo ? "text-[#002855] dark:text-amber-400" : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {activo ? "● Versión Activa en Portada" : "Activar esta versión →"}
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
