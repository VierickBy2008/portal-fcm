"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, GraduationCap, LayoutGrid, RotateCcw, Sparkles, X } from "lucide-react";
import { HERO_BG_DEFAULT } from "../../data/portalInitialData";
import {
  HERO_CONFIG_ACADEMICO_INICIAL,
  HERO_CONFIG_BENTO_INICIAL,
  HERO_CONFIG_HARVARD_INICIAL,
} from "../../data/portalExtrasData";
import type {
  DisenoPortadaId,
  HeroAcademicoConfig,
  HeroBentoConfig,
  HeroHarvardConfig,
  Noticia,
} from "../../types/portal";

interface AdminHeroTabProps {
  noticias?: Noticia[];
  heroBgInputUrl: string;
  setHeroBgInputUrl: React.Dispatch<React.SetStateAction<string>>;
  heroBgUrl: string;
  heroBlur: number;
  setHeroBlur: React.Dispatch<React.SetStateAction<number>>;
  heroOverlayOpacity: number;
  setHeroOverlayOpacity: React.Dispatch<React.SetStateAction<number>>;
  heroOverlayColor: string;
  setHeroOverlayColor: React.Dispatch<React.SetStateAction<string>>;
  handleUsarComoFondoHero: (
    url: string,
    nuevoBlur?: number,
    nuevaOpacity?: number,
    nuevoColor?: string
  ) => Promise<void> | void;
  disenoPortadaActivo?: DisenoPortadaId;
  heroConfigBento?: HeroBentoConfig;
  heroConfigHarvard?: HeroHarvardConfig;
  heroConfigAcademico?: HeroAcademicoConfig;
  onGuardarHeroBento?: (cfg: HeroBentoConfig) => Promise<void> | void;
  onGuardarHeroHarvard?: (cfg: HeroHarvardConfig) => Promise<void> | void;
  onGuardarHeroAcademico?: (cfg: HeroAcademicoConfig) => Promise<void> | void;
  isModal?: boolean;
  modalHeroFondoAbierto?: boolean;
  setModalHeroFondoAbierto?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AdminHeroTab({
  noticias = [],
  heroBgInputUrl,
  setHeroBgInputUrl,
  heroBgUrl,
  heroBlur,
  setHeroBlur,
  heroOverlayOpacity,
  setHeroOverlayOpacity,
  heroOverlayColor,
  setHeroOverlayColor,
  handleUsarComoFondoHero,
  disenoPortadaActivo = "academico_moderno",
  heroConfigBento,
  heroConfigHarvard,
  heroConfigAcademico,
  onGuardarHeroBento,
  onGuardarHeroHarvard,
  onGuardarHeroAcademico,
  isModal = false,
  modalHeroFondoAbierto = false,
  setModalHeroFondoAbierto,
}: AdminHeroTabProps) {
  const [modoEditor, setModoEditor] = useState<DisenoPortadaId>("academico_moderno");

  useEffect(() => {
    setModoEditor("academico_moderno");
  }, [disenoPortadaActivo]);

  const [formBento, setFormBento] = useState<HeroBentoConfig>(() => ({
    hero_bg_url: heroConfigBento?.hero_bg_url || heroBgUrl || HERO_BG_DEFAULT,
    hero_blur: heroConfigBento?.hero_blur ?? heroBlur,
    hero_overlay_opacity: heroConfigBento?.hero_overlay_opacity ?? heroOverlayOpacity,
    hero_overlay_color: heroConfigBento?.hero_overlay_color || heroOverlayColor || "#0f172a",
    subtitulo_superior:
      heroConfigBento?.subtitulo_superior || HERO_CONFIG_BENTO_INICIAL.subtitulo_superior,
    titulo_principal:
      heroConfigBento?.titulo_principal || HERO_CONFIG_BENTO_INICIAL.titulo_principal,
  }));

  const [formHarvard, setFormHarvard] = useState<HeroHarvardConfig>(() => ({
    hero_bg_url:
      heroConfigHarvard?.hero_bg_url || HERO_CONFIG_HARVARD_INICIAL.hero_bg_url,
    hero_blur: heroConfigHarvard?.hero_blur ?? HERO_CONFIG_HARVARD_INICIAL.hero_blur,
    hero_overlay_opacity:
      heroConfigHarvard?.hero_overlay_opacity ??
      HERO_CONFIG_HARVARD_INICIAL.hero_overlay_opacity,
    hero_overlay_color:
      heroConfigHarvard?.hero_overlay_color ||
      HERO_CONFIG_HARVARD_INICIAL.hero_overlay_color,
    lema_institucional:
      heroConfigHarvard?.lema_institucional ||
      HERO_CONFIG_HARVARD_INICIAL.lema_institucional,
    subtitulo_escuela:
      heroConfigHarvard?.subtitulo_escuela ||
      HERO_CONFIG_HARVARD_INICIAL.subtitulo_escuela,
    titulo_editorial:
      heroConfigHarvard?.titulo_editorial ||
      HERO_CONFIG_HARVARD_INICIAL.titulo_editorial,
    cita_decanato:
      heroConfigHarvard?.cita_decanato || HERO_CONFIG_HARVARD_INICIAL.cita_decanato,
  }));

  const [formAcademico, setFormAcademico] = useState<HeroAcademicoConfig>(() => ({
    hero_bg_url:
      heroConfigAcademico?.hero_bg_url || HERO_CONFIG_ACADEMICO_INICIAL.hero_bg_url,
    hero_blur: heroConfigAcademico?.hero_blur ?? HERO_CONFIG_ACADEMICO_INICIAL.hero_blur,
    hero_overlay_opacity:
      heroConfigAcademico?.hero_overlay_opacity ??
      HERO_CONFIG_ACADEMICO_INICIAL.hero_overlay_opacity,
    hero_overlay_color:
      heroConfigAcademico?.hero_overlay_color ||
      HERO_CONFIG_ACADEMICO_INICIAL.hero_overlay_color,
    color_acento_principal:
      heroConfigAcademico?.color_acento_principal ||
      HERO_CONFIG_ACADEMICO_INICIAL.color_acento_principal ||
      "#8B1515",
    etiqueta_campus:
      heroConfigAcademico?.etiqueta_campus ||
      HERO_CONFIG_ACADEMICO_INICIAL.etiqueta_campus,
    titulo_principal:
      heroConfigAcademico?.titulo_principal ||
      HERO_CONFIG_ACADEMICO_INICIAL.titulo_principal,
    descripcion_campus:
      heroConfigAcademico?.descripcion_campus ||
      HERO_CONFIG_ACADEMICO_INICIAL.descripcion_campus,
    titulo_tablero:
      heroConfigAcademico?.titulo_tablero ||
      HERO_CONFIG_ACADEMICO_INICIAL.titulo_tablero ||
      "Indicadores Académicos FCM",
    estado_tablero:
      heroConfigAcademico?.estado_tablero ||
      HERO_CONFIG_ACADEMICO_INICIAL.estado_tablero ||
      "EN VIVO • 2026",
    metricas_personalizadas:
      heroConfigAcademico?.metricas_personalizadas ||
      HERO_CONFIG_ACADEMICO_INICIAL.metricas_personalizadas,
    metrica_1_valor:
      heroConfigAcademico?.metrica_1_valor ||
      heroConfigAcademico?.metricas_personalizadas?.[0]?.valor ||
      HERO_CONFIG_ACADEMICO_INICIAL.metrica_1_valor ||
      "04",
    metrica_1_label:
      heroConfigAcademico?.metrica_1_label ||
      heroConfigAcademico?.metricas_personalizadas?.[0]?.label ||
      HERO_CONFIG_ACADEMICO_INICIAL.metrica_1_label ||
      "Escuelas de Pregrado",
    metrica_2_valor:
      heroConfigAcademico?.metrica_2_valor ||
      heroConfigAcademico?.metricas_personalizadas?.[1]?.valor ||
      HERO_CONFIG_ACADEMICO_INICIAL.metrica_2_valor ||
      "10",
    metrica_2_label:
      heroConfigAcademico?.metrica_2_label ||
      heroConfigAcademico?.metricas_personalizadas?.[1]?.label ||
      HERO_CONFIG_ACADEMICO_INICIAL.metrica_2_label ||
      "Ciclos por Carrera",
    metrica_3_valor:
      heroConfigAcademico?.metrica_3_valor ||
      heroConfigAcademico?.metricas_personalizadas?.[2]?.valor ||
      HERO_CONFIG_ACADEMICO_INICIAL.metrica_3_valor ||
      "65+",
    metrica_3_label:
      heroConfigAcademico?.metrica_3_label ||
      heroConfigAcademico?.metricas_personalizadas?.[2]?.label ||
      HERO_CONFIG_ACADEMICO_INICIAL.metrica_3_label ||
      "Catedráticos & RENACYT",
    metrica_4_valor:
      heroConfigAcademico?.metrica_4_valor ||
      heroConfigAcademico?.metricas_personalizadas?.[3]?.valor ||
      HERO_CONFIG_ACADEMICO_INICIAL.metrica_4_valor ||
      "120+",
    metrica_4_label:
      heroConfigAcademico?.metrica_4_label ||
      heroConfigAcademico?.metricas_personalizadas?.[3]?.label ||
      HERO_CONFIG_ACADEMICO_INICIAL.metrica_4_label ||
      "Sílabos y Libros PDF",
    noticia_principal_id: heroConfigAcademico?.noticia_principal_id || "",
    noticia_secundaria_1_id: heroConfigAcademico?.noticia_secundaria_1_id || "",
    noticia_secundaria_2_id: heroConfigAcademico?.noticia_secundaria_2_id || "",
  }));

  useEffect(() => {
    if (heroConfigBento) {
      setFormBento(heroConfigBento);
    }
  }, [heroConfigBento]);

  useEffect(() => {
    if (heroConfigHarvard) {
      setFormHarvard(heroConfigHarvard);
    }
  }, [heroConfigHarvard]);

  useEffect(() => {
    if (heroConfigAcademico) {
      setFormAcademico(heroConfigAcademico);
    }
  }, [heroConfigAcademico]);

  const renderControls = (onSaveDone?: () => void) => (
    <div className="space-y-4">
      {/* Cabecera de Edición Oficial: Campus Académico Moderno (Definitivo) */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-[#002855] via-[#001833] to-[#8B1515] text-white border border-amber-400/30 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="w-5 h-5 text-amber-300 shrink-0" />
          <div>
            <span className="text-xs font-extrabold tracking-wide block">
              Arquitectura Definitiva Activa: Campus Académico Moderno FCM
            </span>
            <span className="text-[10px] text-blue-100/90 block">
              Edita el Hero, las 4 métricas oficiales y la jerarquía de Noticias en Portada
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-[10px] font-extrabold uppercase tracking-wider shrink-0">
          Diseño Único Oficial
        </span>
      </div>

      {modoEditor === "bento_moderno" ? (
        <div className="space-y-4 layout-switch-gpu">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px]">
            <span className="font-bold text-[#002855] dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Editando configuración exclusiva de: <strong>Diseño Bento Grid FCM 2026</strong>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Independiente</span>
          </div>

          {/* Vista Previa en Tiempo Real - BENTO */}
          <div
            className="relative h-40 rounded-2xl overflow-hidden border-2 border-[#002855] dark:border-blue-700 transition-colors"
            style={{ backgroundColor: formBento.hero_overlay_color || "#0f172a" }}
          >
            <img
              src={formBento.hero_bg_url || heroBgInputUrl || HERO_BG_DEFAULT}
              alt="Vista previa Hero Bento"
              className="w-full h-full object-cover transition-all duration-300"
              style={{ filter: `blur(${formBento.hero_blur}px)` }}
            />
            <div
              className="absolute inset-0 transition-all duration-200"
              style={{
                backgroundColor: formBento.hero_overlay_color || "#0f172a",
                opacity: Math.min(0.95, Math.max(0, formBento.hero_overlay_opacity / 100)),
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 flex flex-col items-center justify-center p-4 text-center">
              <span className="px-2.5 py-0.5 rounded-full bg-red-700/90 text-[9px] font-bold uppercase tracking-wider text-white mb-1">
                {formBento.subtitulo_superior}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white drop-shadow line-clamp-2 max-w-md">
                {formBento.titulo_principal}
              </span>
              <span className="mt-1.5 px-3 py-0.5 rounded-full bg-black/60 text-[10px] font-mono font-bold text-sky-200 border border-white/20">
                Bento • Blur: {formBento.hero_blur}px • Opacidad: {formBento.hero_overlay_opacity}%
              </span>
            </div>
          </div>

          {/* Textos exclusivos del Hero Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Insignia Superior (Bento):
              </label>
              <input
                type="text"
                value={formBento.subtitulo_superior}
                onChange={(e) =>
                  setFormBento((p) => ({ ...p, subtitulo_superior: e.target.value }))
                }
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#002855]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                URL de Imagen de Fondo (Bento):
              </label>
              <input
                type="url"
                value={formBento.hero_bg_url}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormBento((p) => ({ ...p, hero_bg_url: val }));
                  setHeroBgInputUrl(val);
                }}
                placeholder="https://..."
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#002855]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Título Principal del Carrusel Bento:
            </label>
            <input
              type="text"
              value={formBento.titulo_principal}
              onChange={(e) =>
                setFormBento((p) => ({ ...p, titulo_principal: e.target.value }))
              }
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#002855]"
            />
          </div>

          {/* Sliders de Blur y Opacidad Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#002855] dark:text-blue-300">
                  1. Difuminado (Blur):
                </span>
                <span className="px-2 py-0.5 rounded bg-[#002855] text-white font-mono text-[11px] font-bold">
                  {formBento.hero_blur} px
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={8}
                step={0.5}
                value={formBento.hero_blur}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setFormBento((p) => ({ ...p, hero_blur: v }));
                  setHeroBlur(v);
                }}
                className="w-full accent-[#002855] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#002855] dark:text-blue-300">
                  2. Opacidad Capa:
                </span>
                <span className="px-2 py-0.5 rounded bg-red-700 text-white font-mono text-[11px] font-bold">
                  {formBento.hero_overlay_opacity}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={formBento.hero_overlay_opacity}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setFormBento((p) => ({ ...p, hero_overlay_opacity: v }));
                  setHeroOverlayOpacity(v);
                }}
                className="w-full accent-red-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Color de Capa Bento */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#002855] dark:text-blue-300">
                3. Color de Capa (Bento Moderno):
              </span>
              <input
                type="color"
                value={formBento.hero_overlay_color}
                onChange={(e) => {
                  const c = e.target.value;
                  setFormBento((p) => ({ ...p, hero_overlay_color: c }));
                  setHeroOverlayColor(c);
                }}
                className="w-8 h-6 rounded cursor-pointer border border-slate-300"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { label: "Pizarra (#0f172a)", hex: "#0f172a" },
                { label: "Azul FCM (#002855)", hex: "#002855" },
                { label: "Negro (#000000)", hex: "#000000" },
                { label: "Grafito (#27272a)", hex: "#27272a" },
              ].map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => {
                    setFormBento((p) => ({ ...p, hero_overlay_color: preset.hex }));
                    setHeroOverlayColor(preset.hex);
                  }}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border cursor-pointer ${
                    formBento.hero_overlay_color.toLowerCase() === preset.hex.toLowerCase()
                      ? "border-[#002855] bg-blue-50 dark:bg-blue-950 text-[#002855] dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span className="truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={async () => {
                if (onGuardarHeroBento) {
                  await onGuardarHeroBento(formBento);
                } else {
                  await handleUsarComoFondoHero(
                    formBento.hero_bg_url,
                    formBento.hero_blur,
                    formBento.hero_overlay_opacity,
                    formBento.hero_overlay_color
                  );
                }
                if (onSaveDone) onSaveDone();
              }}
              className="gpu-btn flex-1 py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
            >
              💾 Guardar Carrusel Bento Moderno
            </button>
            <button
              type="button"
              onClick={async () => {
                setFormBento(HERO_CONFIG_BENTO_INICIAL);
                if (onGuardarHeroBento) {
                  await onGuardarHeroBento(HERO_CONFIG_BENTO_INICIAL);
                } else {
                  await handleUsarComoFondoHero(HERO_BG_DEFAULT, 1, 45, "#0f172a");
                }
              }}
              className="gpu-btn px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar Bento
            </button>
          </div>
        </div>
      ) : modoEditor === "harvard_editorial" ? (
        <div className="space-y-4 layout-switch-gpu">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-[11px]">
            <span className="font-bold text-[#8B1515] dark:text-rose-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#8B1515] dark:text-amber-400" />
              Editando configuración exclusiva de:{" "}
              <strong>Banner Editorial Harvard / Ivy League</strong>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Independiente</span>
          </div>

          {/* Vista Previa en Tiempo Real - HARVARD */}
          <div
            className="relative h-44 rounded-none border-t-4 border-t-[#8B1515] border-x border-b border-slate-300 dark:border-slate-800 overflow-hidden transition-colors"
            style={{ backgroundColor: formHarvard.hero_overlay_color || "#1a0508" }}
          >
            <img
              src={formHarvard.hero_bg_url || HERO_CONFIG_HARVARD_INICIAL.hero_bg_url}
              alt="Vista previa Banner Harvard"
              className="w-full h-full object-cover transition-all duration-300"
              style={{ filter: `blur(${formHarvard.hero_blur}px) grayscale(20%)` }}
            />
            <div
              className="absolute inset-0 transition-all duration-200"
              style={{
                backgroundColor: formHarvard.hero_overlay_color || "#1a0508",
                opacity: Math.min(0.95, Math.max(0.4, formHarvard.hero_overlay_opacity / 100)),
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2b070c]/90 via-[#001733]/80 to-black/70 flex flex-col justify-center p-4 text-left text-white">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-amber-300 mb-1 truncate">
                {formHarvard.lema_institucional}
              </span>
              <span className="font-harvard-serif text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
                {formHarvard.titulo_editorial}
              </span>
              <span className="text-[10px] italic text-slate-200 line-clamp-1 mt-1 border-l-2 border-red-400 pl-2">
                &ldquo;{formHarvard.cita_decanato}&rdquo;
              </span>
              <span className="mt-2 self-start px-2.5 py-0.5 bg-black/60 text-[9px] font-mono text-amber-200 border border-amber-400/30">
                Harvard Crimson • Blur: {formHarvard.hero_blur}px • Opacidad:{" "}
                {formHarvard.hero_overlay_opacity}%
              </span>
            </div>
          </div>

          {/* Campos exclusivos del Banner Editorial Harvard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Lema Institucional Superior (Latín / Castellano):
              </label>
              <input
                type="text"
                value={formHarvard.lema_institucional}
                onChange={(e) =>
                  setFormHarvard((p) => ({ ...p, lema_institucional: e.target.value }))
                }
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#8B1515]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                URL de Fotografía Arquitectónica (Harvard):
              </label>
              <input
                type="url"
                value={formHarvard.hero_bg_url}
                onChange={(e) =>
                  setFormHarvard((p) => ({ ...p, hero_bg_url: e.target.value }))
                }
                placeholder="https://..."
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#8B1515]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Titular Editorial Solemne (Serif):
            </label>
            <input
              type="text"
              value={formHarvard.titulo_editorial}
              onChange={(e) =>
                setFormHarvard((p) => ({ ...p, titulo_editorial: e.target.value }))
              }
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#8B1515]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Cita / Misión de Decanato:
            </label>
            <textarea
              rows={2}
              value={formHarvard.cita_decanato}
              onChange={(e) =>
                setFormHarvard((p) => ({ ...p, cita_decanato: e.target.value }))
              }
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#8B1515]"
            />
          </div>

          {/* Sliders de Blur y Opacidad Harvard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8B1515] dark:text-rose-300">
                  1. Difuminado (Blur Harvard):
                </span>
                <span className="px-2 py-0.5 rounded bg-[#8B1515] text-white font-mono text-[11px] font-bold">
                  {formHarvard.hero_blur} px
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={8}
                step={0.5}
                value={formHarvard.hero_blur}
                onChange={(e) =>
                  setFormHarvard((p) => ({ ...p, hero_blur: Number(e.target.value) }))
                }
                className="w-full accent-[#8B1515] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8B1515] dark:text-rose-300">
                  2. Opacidad Velo Crimson:
                </span>
                <span className="px-2 py-0.5 rounded bg-[#002855] text-white font-mono text-[11px] font-bold">
                  {formHarvard.hero_overlay_opacity}%
                </span>
              </div>
              <input
                type="range"
                min={45}
                max={94}
                step={2}
                value={formHarvard.hero_overlay_opacity}
                onChange={(e) =>
                  setFormHarvard((p) => ({
                    ...p,
                    hero_overlay_opacity: Number(e.target.value),
                  }))
                }
                className="w-full accent-[#002855] cursor-pointer"
              />
            </div>
          </div>

          {/* Color de Capa Harvard */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#8B1515] dark:text-rose-300">
                3. Color del Velo Editorial (Harvard):
              </span>
              <input
                type="color"
                value={formHarvard.hero_overlay_color}
                onChange={(e) =>
                  setFormHarvard((p) => ({ ...p, hero_overlay_color: e.target.value }))
                }
                className="w-8 h-6 rounded cursor-pointer border border-slate-300"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { label: "Crimson Oscuro (#1a0508)", hex: "#1a0508" },
                { label: "Granate Harvard (#4a0810)", hex: "#4a0810" },
                { label: "Claustro Azul (#0d1526)", hex: "#0d1526" },
                { label: "Ébano Clásico (#111111)", hex: "#111111" },
              ].map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() =>
                    setFormHarvard((p) => ({ ...p, hero_overlay_color: preset.hex }))
                  }
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border cursor-pointer ${
                    formHarvard.hero_overlay_color.toLowerCase() === preset.hex.toLowerCase()
                      ? "border-[#8B1515] bg-rose-50 dark:bg-rose-950 text-[#8B1515] dark:text-rose-300"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span className="truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={async () => {
                if (onGuardarHeroHarvard) {
                  await onGuardarHeroHarvard(formHarvard);
                }
                if (onSaveDone) onSaveDone();
              }}
              className="gpu-btn flex-1 py-2.5 rounded-xl bg-[#8B1515] hover:bg-red-900 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
            >
              🏛️ Guardar Banner Editorial Harvard
            </button>
            <button
              type="button"
              onClick={async () => {
                setFormHarvard(HERO_CONFIG_HARVARD_INICIAL);
                if (onGuardarHeroHarvard) {
                  await onGuardarHeroHarvard(HERO_CONFIG_HARVARD_INICIAL);
                }
              }}
              className="gpu-btn px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar Harvard
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 layout-switch-gpu">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px]">
            <span className="font-bold text-[#002855] dark:text-blue-200 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#8B1515] dark:text-amber-400" />
              Editando configuración exclusiva de:{" "}
              <strong>Campus Académico Moderno (Paleta Oficial San Marcos)</strong>
            </span>
            <span className="text-[10px] font-mono text-slate-500">100% Editable</span>
          </div>

          {/* Vista Previa en Tiempo Real - CAMPUS ACADÉMICO MODERNO */}
          <div
            className="relative h-48 rounded-2xl border-2 border-[#002855] dark:border-blue-800 border-t-4 border-t-[#8B1515] overflow-hidden transition-colors"
            style={{ backgroundColor: formAcademico.hero_overlay_color || "#001833" }}
          >
            <img
              src={formAcademico.hero_bg_url || HERO_CONFIG_ACADEMICO_INICIAL.hero_bg_url}
              alt="Vista previa Campus Académico"
              className="w-full h-full object-cover transition-all duration-300"
              style={{ filter: `blur(${formAcademico.hero_blur}px)` }}
            />
            <div
              className="absolute inset-0 transition-all duration-200"
              style={{
                backgroundColor: formAcademico.hero_overlay_color || "#001833",
                opacity: Math.min(0.95, Math.max(0.2, formAcademico.hero_overlay_opacity / 100)),
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#001833]/92 via-[#002855]/75 to-slate-950/85 grid grid-cols-1 sm:grid-cols-12 items-center gap-3 p-4 text-left text-white">
              <div className="sm:col-span-7 flex flex-col justify-center">
                <span
                  className="inline-block self-start px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-white mb-1 truncate"
                  style={{
                    backgroundColor: formAcademico.color_acento_principal || "#8B1515",
                  }}
                >
                  {formAcademico.etiqueta_campus}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-white leading-snug line-clamp-2">
                  {formAcademico.titulo_principal}
                </span>
                <span className="text-[10px] text-slate-200 line-clamp-1 mt-1">
                  {formAcademico.descripcion_campus}
                </span>
                <span className="mt-2 self-start px-2.5 py-0.5 bg-black/60 text-[9px] font-mono text-amber-300 border border-amber-400/30 rounded">
                  San Marcos • Blur: {formAcademico.hero_blur}px • Opacidad:{" "}
                  {formAcademico.hero_overlay_opacity}%
                </span>
              </div>

              {/* Mini preview de las 4 métricas editables */}
              <div className="hidden sm:grid sm:col-span-5 grid-cols-2 gap-1.5 bg-slate-950/75 p-2 rounded-xl border border-white/15">
                <div className="p-1.5 rounded bg-blue-950/60 border border-blue-500/30">
                  <span className="block text-xs font-black text-white">
                    {formAcademico.metrica_1_valor || "04"}
                  </span>
                  <span className="block text-[8px] text-blue-200 truncate">
                    {formAcademico.metrica_1_label || "Escuelas"}
                  </span>
                </div>
                <div className="p-1.5 rounded bg-rose-950/60 border border-red-500/30">
                  <span className="block text-xs font-black text-white">
                    {formAcademico.metrica_2_valor || "10"}
                  </span>
                  <span className="block text-[8px] text-rose-200 truncate">
                    {formAcademico.metrica_2_label || "Ciclos"}
                  </span>
                </div>
                <div className="p-1.5 rounded bg-amber-950/60 border border-amber-500/30">
                  <span className="block text-xs font-black text-white">
                    {formAcademico.metrica_3_valor || "65+"}
                  </span>
                  <span className="block text-[8px] text-amber-200 truncate">
                    {formAcademico.metrica_3_label || "Catedráticos"}
                  </span>
                </div>
                <div className="p-1.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                  <span className="block text-xs font-black text-white">
                    {formAcademico.metrica_4_valor || "120+"}
                  </span>
                  <span className="block text-[8px] text-emerald-200 truncate">
                    {formAcademico.metrica_4_label || "Sílabos PDF"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Etiqueta Superior del Campus:
              </label>
              <input
                type="text"
                value={formAcademico.etiqueta_campus}
                onChange={(e) =>
                  setFormAcademico((p) => ({ ...p, etiqueta_campus: e.target.value }))
                }
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#002855]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                URL de Imagen de Fondo (Campus):
              </label>
              <input
                type="url"
                value={formAcademico.hero_bg_url}
                onChange={(e) =>
                  setFormAcademico((p) => ({ ...p, hero_bg_url: e.target.value }))
                }
                placeholder="https://..."
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#002855]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Título Principal (Campus Académico Moderno):
            </label>
            <input
              type="text"
              value={formAcademico.titulo_principal}
              onChange={(e) =>
                setFormAcademico((p) => ({ ...p, titulo_principal: e.target.value }))
              }
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#002855]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Descripción Académica Inferior:
            </label>
            <textarea
              rows={2}
              value={formAcademico.descripcion_campus}
              onChange={(e) =>
                setFormAcademico((p) => ({ ...p, descripcion_campus: e.target.value }))
              }
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#002855]"
            />
          </div>

          {/* Editor de las 4 Métricas del Tablero Lateral en Vivo */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-extrabold text-[#002855] dark:text-amber-300">
                📊 Tablero Lateral de Indicadores (4 Métricas Editables):
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Colores de las 4 Escuelas FCM
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  Título del Tablero:
                </label>
                <input
                  type="text"
                  value={formAcademico.titulo_tablero || ""}
                  onChange={(e) =>
                    setFormAcademico((p) => ({ ...p, titulo_tablero: e.target.value }))
                  }
                  placeholder="Indicadores Académicos FCM"
                  className="w-full mt-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  Insignia Estado en Vivo:
                </label>
                <input
                  type="text"
                  value={formAcademico.estado_tablero || ""}
                  onChange={(e) =>
                    setFormAcademico((p) => ({ ...p, estado_tablero: e.target.value }))
                  }
                  placeholder="EN VIVO • 2026"
                  className="w-full mt-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Métrica 1 - Azul Computación */}
              <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
                  Métrica 1 (Azul Computación)
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="text"
                    value={formAcademico.metrica_1_valor || ""}
                    onChange={(e) =>
                      setFormAcademico((p) => ({ ...p, metrica_1_valor: e.target.value }))
                    }
                    placeholder="04"
                    className="col-span-1 rounded-lg bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 px-2 py-1 text-xs font-extrabold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={formAcademico.metrica_1_label || ""}
                    onChange={(e) =>
                      setFormAcademico((p) => ({ ...p, metrica_1_label: e.target.value }))
                    }
                    placeholder="Escuelas de Pregrado"
                    className="col-span-2 rounded-lg bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 px-2 py-1 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Métrica 2 - Granate Matemática */}
              <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8B1515] dark:text-rose-300 block">
                  Métrica 2 (Granate Matemática)
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="text"
                    value={formAcademico.metrica_2_valor || ""}
                    onChange={(e) =>
                      setFormAcademico((p) => ({ ...p, metrica_2_valor: e.target.value }))
                    }
                    placeholder="10"
                    className="col-span-1 rounded-lg bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 px-2 py-1 text-xs font-extrabold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={formAcademico.metrica_2_label || ""}
                    onChange={(e) =>
                      setFormAcademico((p) => ({ ...p, metrica_2_label: e.target.value }))
                    }
                    placeholder="Ciclos por Carrera"
                    className="col-span-2 rounded-lg bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 px-2 py-1 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Métrica 3 - Dorado / Ámbar Estadística */}
              <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                  Métrica 3 (Dorado / Ámbar)
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="text"
                    value={formAcademico.metrica_3_valor || ""}
                    onChange={(e) =>
                      setFormAcademico((p) => ({ ...p, metrica_3_valor: e.target.value }))
                    }
                    placeholder="65+"
                    className="col-span-1 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 px-2 py-1 text-xs font-extrabold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={formAcademico.metrica_3_label || ""}
                    onChange={(e) =>
                      setFormAcademico((p) => ({ ...p, metrica_3_label: e.target.value }))
                    }
                    placeholder="Catedráticos & RENACYT"
                    className="col-span-2 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 px-2 py-1 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Métrica 4 - Esmeralda Investigación Operativa */}
              <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                  Métrica 4 (Esmeralda I.O.)
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="text"
                    value={formAcademico.metrica_4_valor || ""}
                    onChange={(e) =>
                      setFormAcademico((p) => ({ ...p, metrica_4_valor: e.target.value }))
                    }
                    placeholder="120+"
                    className="col-span-1 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 px-2 py-1 text-xs font-extrabold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={formAcademico.metrica_4_label || ""}
                    onChange={(e) =>
                      setFormAcademico((p) => ({ ...p, metrica_4_label: e.target.value }))
                    }
                    placeholder="Sílabos y Libros PDF"
                    className="col-span-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 px-2 py-1 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Selector de las 3 Noticias en Portada (1 Principal + 2 Laterales) */}
          {noticias.length > 0 && (
            <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-extrabold text-[#002855] dark:text-amber-300">
                  📰 Selección de Noticias en Portada (1 Principal + 2 Laterales):
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Grilla Editorial Asimétrica
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8B1515] dark:text-rose-300 block mb-0.5">
                    1. Noticia Principal Heroica (Izquierda Grande - Ocupa 2 espacios):
                  </label>
                  <select
                    value={formAcademico.noticia_principal_id || ""}
                    onChange={(e) =>
                      setFormAcademico((p) => ({ ...p, noticia_principal_id: e.target.value }))
                    }
                    className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-2.5 py-1.5 text-xs font-semibold"
                  >
                    <option value="">✨ Automático (Noticia Destacada Más Reciente)</option>
                    {noticias.map((n) => (
                      <option key={n.id} value={n.id}>
                        [{n.categoria}] {n.titulo} ({n.fecha_publicacion})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#002855] dark:text-blue-300 block mb-0.5">
                      2. Noticia Secundaria 1 (Derecha Superior):
                    </label>
                    <select
                      value={formAcademico.noticia_secundaria_1_id || ""}
                      onChange={(e) =>
                        setFormAcademico((p) => ({
                          ...p,
                          noticia_secundaria_1_id: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-2.5 py-1.5 text-xs"
                    >
                      <option value="">✨ Automático (2da Destacada Reciente)</option>
                      {noticias.map((n) => (
                        <option key={n.id} value={n.id}>
                          [{n.categoria}] {n.titulo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#002855] dark:text-blue-300 block mb-0.5">
                      3. Noticia Secundaria 2 (Derecha Inferior):
                    </label>
                    <select
                      value={formAcademico.noticia_secundaria_2_id || ""}
                      onChange={(e) =>
                        setFormAcademico((p) => ({
                          ...p,
                          noticia_secundaria_2_id: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-2.5 py-1.5 text-xs"
                    >
                      <option value="">✨ Automático (3ra Destacada Reciente)</option>
                      {noticias.map((n) => (
                        <option key={n.id} value={n.id}>
                          [{n.categoria}] {n.titulo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#002855] dark:text-blue-300">
                  1. Difuminado (Blur Campus):
                </span>
                <span className="px-2 py-0.5 rounded bg-[#002855] text-white font-mono text-[11px] font-bold">
                  {formAcademico.hero_blur} px
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={8}
                step={0.5}
                value={formAcademico.hero_blur}
                onChange={(e) =>
                  setFormAcademico((p) => ({ ...p, hero_blur: Number(e.target.value) }))
                }
                className="w-full accent-[#002855] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8B1515] dark:text-rose-300">
                  2. Opacidad Capa Campus:
                </span>
                <span className="px-2 py-0.5 rounded bg-[#8B1515] text-white font-mono text-[11px] font-bold">
                  {formAcademico.hero_overlay_opacity}%
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={94}
                step={2}
                value={formAcademico.hero_overlay_opacity}
                onChange={(e) =>
                  setFormAcademico((p) => ({
                    ...p,
                    hero_overlay_opacity: Number(e.target.value),
                  }))
                }
                className="w-full accent-[#8B1515] cursor-pointer"
              />
            </div>
          </div>

          {/* Color de Capa y Color de Acento Institucional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#002855] dark:text-blue-300">
                  3. Color de Capa (Overlay):
                </span>
                <input
                  type="color"
                  value={formAcademico.hero_overlay_color}
                  onChange={(e) =>
                    setFormAcademico((p) => ({ ...p, hero_overlay_color: e.target.value }))
                  }
                  className="w-8 h-6 rounded cursor-pointer border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Ébano Marino (#001833)", hex: "#001833" },
                  { label: "Azul FCM (#002855)", hex: "#002855" },
                  { label: "Granate (#8B1515)", hex: "#8B1515" },
                  { label: "Pizarra (#0f172a)", hex: "#0f172a" },
                ].map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() =>
                      setFormAcademico((p) => ({ ...p, hero_overlay_color: preset.hex }))
                    }
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border cursor-pointer ${
                      formAcademico.hero_overlay_color.toLowerCase() ===
                      preset.hex.toLowerCase()
                        ? "border-[#002855] bg-blue-50 dark:bg-blue-950 text-[#002855] dark:text-blue-300"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8B1515] dark:text-amber-300">
                  4. Color de Acento Principal:
                </span>
                <span
                  className="w-5 h-5 rounded-full border border-white shadow-xs"
                  style={{
                    backgroundColor: formAcademico.color_acento_principal || "#8B1515",
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: "Granate Crimson Sanmarquino (#8B1515)", hex: "#8B1515" },
                  { label: "Azul Marino Institucional (#002855)", hex: "#002855" },
                  { label: "Dorado / Ámbar Decanal (#D97706)", hex: "#D97706" },
                ].map((acento) => (
                  <button
                    key={acento.hex}
                    type="button"
                    onClick={() =>
                      setFormAcademico((p) => ({
                        ...p,
                        color_acento_principal: acento.hex,
                      }))
                    }
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 border cursor-pointer ${
                      (formAcademico.color_acento_principal || "#8B1515").toLowerCase() ===
                      acento.hex.toLowerCase()
                        ? "border-[#8B1515] bg-rose-50 dark:bg-rose-950 text-[#8B1515] dark:text-amber-300"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: acento.hex }}
                    />
                    <span className="truncate">{acento.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={async () => {
                const payload: HeroAcademicoConfig = {
                  ...formAcademico,
                  metricas_personalizadas: [
                    {
                      valor: formAcademico.metrica_1_valor || "04",
                      label: formAcademico.metrica_1_label || "Escuelas de Pregrado",
                    },
                    {
                      valor: formAcademico.metrica_2_valor || "10",
                      label: formAcademico.metrica_2_label || "Ciclos por Carrera",
                    },
                    {
                      valor: formAcademico.metrica_3_valor || "65+",
                      label: formAcademico.metrica_3_label || "Catedráticos & RENACYT",
                    },
                    {
                      valor: formAcademico.metrica_4_valor || "120+",
                      label: formAcademico.metrica_4_label || "Sílabos y Libros PDF",
                    },
                  ],
                };
                setFormAcademico(payload);
                if (onGuardarHeroAcademico) {
                  await onGuardarHeroAcademico(payload);
                }
                if (onSaveDone) onSaveDone();
              }}
              className="gpu-btn flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#002855] to-[#8B1515] hover:opacity-95 text-white text-xs font-bold cursor-pointer shadow-xs transition-all"
            >
              🎓 Guardar Hero Campus Académico Moderno
            </button>
            <button
              type="button"
              onClick={async () => {
                setFormAcademico(HERO_CONFIG_ACADEMICO_INICIAL);
                if (onGuardarHeroAcademico) {
                  await onGuardarHeroAcademico(HERO_CONFIG_ACADEMICO_INICIAL);
                }
              }}
              className="gpu-btn px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar Campus
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    if (!modalHeroFondoAbierto || !setModalHeroFondoAbierto) return null;
    return (
      <div
        onClick={() => setModalHeroFondoAbierto(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm modal-backdrop-gpu"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="modal-panel-gpu bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border-2 border-[#002855] dark:border-blue-800 max-h-[92vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-[#002855] dark:text-white">
                🖼️ Editor Independiente de Portada y Carrusel (3 Diseños)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cada diseño conserva su propio fondo, desenfoque, opacidad, métricas y textos sin afectar a los demás.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalHeroFondoAbierto(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {renderControls(() => setModalHeroFondoAbierto(false))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <h3 className="font-bold text-sm text-[#002855] dark:text-white">
          🖼️ Editor Independiente de Portada y Carrusel (Bento / Harvard / Campus Académico)
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Personaliza por separado el Hero de Bento Grid, el Banner Editorial de Harvard o el Campus Académico Moderno.
        </p>
      </div>
      {renderControls()}
    </div>
  );
}
