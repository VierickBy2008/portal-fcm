"use client";

import React from "react";
import { X } from "lucide-react";
import { HERO_BG_DEFAULT } from "../../data/portalInitialData";

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
  isModal = false,
  modalHeroFondoAbierto = false,
  setModalHeroFondoAbierto,
}: AdminHeroTabProps) {
  const renderControls = (onSaveDone?: () => void) => (
    <>
      {/* Vista Previa en Tiempo Real */}
      <div
        className="relative h-36 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors"
        style={{ backgroundColor: heroOverlayColor || "#0f172a" }}
      >
        <img
          src={heroBgInputUrl || heroBgUrl || HERO_BG_DEFAULT}
          alt="Vista previa Hero"
          className="w-full h-full object-cover transition-all duration-300"
          style={{ filter: `blur(${heroBlur}px)` }}
        />
        <div
          className="absolute inset-0 transition-all duration-200"
          style={{
            backgroundColor: heroOverlayColor || "#0f172a",
            opacity: Math.min(0.95, Math.max(0, heroOverlayOpacity / 100)),
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 flex flex-col items-center justify-center p-3 text-center">
          <span className="text-xs font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            Vista Previa en Vivo • Portal Académico FCM
          </span>
          <span className="mt-1 px-3 py-0.5 rounded-full bg-black/60 text-[10px] font-bold text-white border border-white/20">
            Difuminado: {heroBlur}px • Capa: {heroOverlayOpacity}% ({heroOverlayColor})
          </span>
        </div>
      </div>

      {/* URL de la imagen */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
          URL de la Imagen de Fondo:
        </label>
        <input
          type="url"
          value={heroBgInputUrl}
          onChange={(e) => setHeroBgInputUrl(e.target.value)}
          placeholder="Pega aquí la URL de la imagen de fondo para el Hero..."
          className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
        />
      </div>

      {/* Control Deslizante 1: Nivel de Difuminado (Blur en px) */}
      <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#002855] dark:text-blue-300">
            1. Nivel de Difuminado (Desenfoque):
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-[#002855] text-white font-mono text-[11px] font-bold">
            {heroBlur} px {heroBlur === 0 ? "(Sin blur)" : heroBlur <= 1.5 ? "(Sutil)" : "(Intenso)"}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={8}
          step={0.5}
          value={heroBlur}
          onChange={(e) => setHeroBlur(Number(e.target.value))}
          className="w-full accent-[#002855] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
          <span>0px (Sin blur)</span>
          <span>1px (Recomendado)</span>
          <span>4px (Medio)</span>
          <span>8px (Máximo)</span>
        </div>
      </div>

      {/* Control Deslizante 2: Porcentaje de Opacidad de la Capa */}
      <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#002855] dark:text-blue-300">
            2. Opacidad / Oscuridad del Fondo:
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-red-700 text-white font-mono text-[11px] font-bold">
            {heroOverlayOpacity}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={90}
          step={5}
          value={heroOverlayOpacity}
          onChange={(e) => setHeroOverlayOpacity(Number(e.target.value))}
          className="w-full accent-red-700 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
          <span>0% (Imagen 100% libre)</span>
          <span>45% (Equilibrado)</span>
          <span>90% (Muy oscuro)</span>
        </div>
      </div>

      {/* Selector 3: Color de la Capa */}
      <div className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#002855] dark:text-blue-300">
            3. Color del Filtro / Capa:
          </span>
          <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400">
            {heroOverlayColor}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: "Neutro Carbón (Normal)", hex: "#0f172a" },
            { label: "Negro Cinematográfico", hex: "#000000" },
            { label: "Gris Grafito Suave", hex: "#27272a" },
            { label: "Azul Institucional", hex: "#002855" },
          ].map((preset) => (
            <button
              key={preset.hex}
              type="button"
              onClick={() => setHeroOverlayColor(preset.hex)}
              className={`px-2.5 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                heroOverlayColor.toLowerCase() === preset.hex.toLowerCase()
                  ? "border-[#002855] dark:border-blue-400 bg-blue-50 dark:bg-blue-950/60 text-[#002855] dark:text-blue-300 ring-2 ring-[#002855]/20 dark:ring-blue-400/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs shrink-0"
                style={{ backgroundColor: preset.hex }}
              />
              <span className="truncate">{preset.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            O elige un color personalizado:
          </span>
          <input
            type="color"
            value={heroOverlayColor}
            onChange={(e) => setHeroOverlayColor(e.target.value)}
            className="w-9 h-7 rounded cursor-pointer border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={async () => {
            await handleUsarComoFondoHero(heroBgInputUrl, heroBlur, heroOverlayOpacity, heroOverlayColor);
            if (onSaveDone) onSaveDone();
          }}
          className="gpu-btn flex-1 py-2.5 rounded-xl bg-[#002855] dark:bg-red-700 hover:bg-blue-900 dark:hover:bg-red-800 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
        >
          Guardar Personalización del Banner
        </button>
        <button
          type="button"
          onClick={() => handleUsarComoFondoHero(HERO_BG_DEFAULT, 1, 45, "#0f172a")}
          className="gpu-btn px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer transition-colors"
        >
          Restaurar
        </button>
      </div>
    </>
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
          className="modal-panel-gpu bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border-2 border-[#002855] dark:border-blue-800 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-[#002855] dark:text-white">
                🖼️ Personalización del Fondo Hero (Difuminado, Opacidad y Color)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ajusta el nivel de desenfoque, el porcentaje de transparencia y el color de la capa superpuesta.
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
          🖼️ Personalización del Fondo Hero (Difuminado, Opacidad y Color)
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Ajusta el nivel de desenfoque, el porcentaje de transparencia y el color de la capa superpuesta.
        </p>
      </div>
      {renderControls()}
    </div>
  );
}
