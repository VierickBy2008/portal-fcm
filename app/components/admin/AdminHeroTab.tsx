"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, LayoutGrid, RotateCcw, Sparkles, X } from "lucide-react";
import { HERO_BG_DEFAULT } from "../../data/portalInitialData";
import {
  HERO_CONFIG_BENTO_INICIAL,
  HERO_CONFIG_HARVARD_INICIAL,
} from "../../data/portalExtrasData";
import type {
  DisenoPortadaId,
  HeroBentoConfig,
  HeroHarvardConfig,
} from "../../types/portal";

interface AdminHeroTabProps {
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
  onGuardarHeroBento?: (cfg: HeroBentoConfig) => Promise<void> | void;
  onGuardarHeroHarvard?: (cfg: HeroHarvardConfig) => Promise<void> | void;
  isModal?: boolean;
  modalHeroFondoAbierto?: boolean;
  setModalHeroFondoAbierto?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AdminHeroTab({
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
  disenoPortadaActivo = "bento_moderno",
  heroConfigBento,
  heroConfigHarvard,
  onGuardarHeroBento,
  onGuardarHeroHarvard,
  isModal = false,
  modalHeroFondoAbierto = false,
  setModalHeroFondoAbierto,
}: AdminHeroTabProps) {
  const [modoEditor, setModoEditor] = useState<DisenoPortadaId>(disenoPortadaActivo);

  useEffect(() => {
    setModoEditor(disenoPortadaActivo);
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

  const renderControls = (onSaveDone?: () => void) => (
    <div className="space-y-4">
      {/* Conmutador de Edición Independiente por Diseño */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setModoEditor("bento_moderno")}
          className={`gpu-btn py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            modoEditor === "bento_moderno"
              ? "bg-[#002855] text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <LayoutGrid className="w-4 h-4 text-sky-300 shrink-0" />
          <span className="truncate">Hero Bento Moderno</span>
        </button>
        <button
          type="button"
          onClick={() => setModoEditor("harvard_editorial")}
          className={`gpu-btn py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            modoEditor === "harvard_editorial"
              ? "bg-[#8B1515] text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="truncate">Banner Editorial Harvard</span>
        </button>
      </div>

      {modoEditor === "bento_moderno" ? (
        <div className="space-y-4 layout-switch-gpu">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px]">
            <span className="font-bold text-[#002855] dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Editando configuración exclusiva de: <strong>Diseño Bento Grid FCM 2026</strong>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Independiente de Harvard</span>
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
      ) : (
        <div className="space-y-4 layout-switch-gpu">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-[11px]">
            <span className="font-bold text-[#8B1515] dark:text-rose-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#8B1515] dark:text-amber-400" />
              Editando configuración exclusiva de:{" "}
              <strong>Banner Editorial Harvard / Ivy League</strong>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Independiente de Bento</span>
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
                🖼️ Editor Independiente de Portada y Carrusel (Bento vs. Harvard)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cada diseño conserva su propio fondo, desenfoque, opacidad y textos sin afectar al otro.
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
          🖼️ Editor Independiente de Portada y Carrusel (Bento vs. Harvard)
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Personaliza por separado el Hero de Bento Grid o el Banner Editorial de Harvard.
        </p>
      </div>
      {renderControls()}
    </div>
  );
}
