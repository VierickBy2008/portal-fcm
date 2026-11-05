"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Type,
  Volume2,
  VolumeX,
  RotateCcw,
  X,
  Contrast,
  Sparkles,
  Check,
} from "lucide-react";
import type { AccesibilidadConfig } from "@/app/types/portal";

interface AccesibilidadWidgetProps {
  config: AccesibilidadConfig;
}

export function AccesibilidadWidget({ config }: AccesibilidadWidgetProps) {
  const [abierto, setAbierto] = useState(false);
  const [escalaFuente, setEscalaFuente] = useState<number>(100);
  const [altoContraste, setAltoContraste] = useState(false);
  const [escalaGrises, setEscalaGrises] = useState(false);
  const [reducirAnimaciones, setReducirAnimaciones] = useState(false);
  const [leyendoVoz, setLeyendoVoz] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.style.fontSize = `${escalaFuente}%`;

    const filtros: string[] = [];
    if (altoContraste) filtros.push("contrast(1.22)");
    if (escalaGrises) filtros.push("grayscale(1)");
    html.style.filter = filtros.length > 0 ? filtros.join(" ") : "";

    if (reducirAnimaciones) {
      html.classList.add("reduce-motion-wcag");
    } else {
      html.classList.remove("reduce-motion-wcag");
    }
  }, [escalaFuente, altoContraste, escalaGrises, reducirAnimaciones]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!config.habilitado) return null;

  const toggleLecturaVoz = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (leyendoVoz) {
      window.speechSynthesis.cancel();
      setLeyendoVoz(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(config.texto_lectura_institucional);
    utterance.lang = "es-PE";
    utterance.rate = 1.0;
    utterance.onend = () => setLeyendoVoz(false);
    utterance.onerror = () => setLeyendoVoz(false);
    setLeyendoVoz(true);
    window.speechSynthesis.speak(utterance);
  };

  const restablecerTodo = () => {
    setEscalaFuente(100);
    setAltoContraste(false);
    setEscalaGrises(false);
    setReducirAnimaciones(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setLeyendoVoz(false);
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-start">
      {abierto && (
        <div className="mb-3 w-[310px] sm:w-[340px] rounded-3xl border-2 border-[#002855] dark:border-blue-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden modal-content-gpu">
          <div className="bg-[#002855] text-white px-4 py-3 flex items-center justify-between border-b border-white/15">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-300" />
              <div>
                <h3 className="text-xs font-bold">Accesibilidad Inclusiva WCAG 2.1</h3>
                <p className="text-[10px] text-blue-200">Estándar Universitario SUNEDU / CONADIS</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              className="p-1 rounded-lg hover:bg-white/15 text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3.5 text-xs">
            {/* Tamaño de Texto */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#002855] dark:text-blue-400" /> Tamaño de Texto
                </span>
                <span className="font-mono font-bold text-[#002855] dark:text-blue-300">
                  {escalaFuente}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { val: 92, label: "A-" },
                  { val: 100, label: "Normal" },
                  { val: 108, label: "A+" },
                  { val: 116, label: "A++" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setEscalaFuente(opt.val)}
                    className={`py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                      escalaFuente === opt.val
                        ? "bg-[#002855] text-white border-[#002855] dark:bg-blue-600 dark:border-blue-500"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Opciones de Contraste y Visualización */}
            <div className="space-y-2">
              {config.mostrar_alto_contraste && (
                <button
                  type="button"
                  onClick={() => setAltoContraste((p) => !p)}
                  className={`w-full px-3 py-2 rounded-xl border font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    altoContraste
                      ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-[#002855] dark:text-blue-300"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Contrast className="w-3.5 h-3.5" /> Alto Contraste Nitidez
                  </span>
                  {altoContraste && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              )}

              {config.mostrar_escala_grises && (
                <button
                  type="button"
                  onClick={() => setEscalaGrises((p) => !p)}
                  className={`w-full px-3 py-2 rounded-xl border font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    escalaGrises
                      ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-[#002855] dark:text-blue-300"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" /> Modo Monocromático (Daltónico)
                  </span>
                  {escalaGrises && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              )}

              {config.mostrar_reduccion_animaciones && (
                <button
                  type="button"
                  onClick={() => setReducirAnimaciones((p) => !p)}
                  className={`w-full px-3 py-2 rounded-xl border font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    reducirAnimaciones
                      ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-[#002855] dark:text-blue-300"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Reducir Movimiento / Animaciones
                  </span>
                  {reducirAnimaciones && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              )}

              {config.mostrar_lector_voz && (
                <button
                  type="button"
                  onClick={toggleLecturaVoz}
                  className={`w-full px-3 py-2.5 rounded-xl border font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    leyendoVoz
                      ? "bg-red-700 text-white border-red-800"
                      : "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {leyendoVoz ? (
                      <>
                        <VolumeX className="w-4 h-4" /> Detener Lectura por Voz
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" /> Escuchar Resumen del Portal (TTS)
                      </>
                    )}
                  </span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={restablecerTodo}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restablecer Valores por Defecto
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAbierto((p) => !p)}
        className="gpu-btn flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#002855] hover:bg-blue-900 text-white shadow-lg border-2 border-white/25 cursor-pointer"
        title="Opciones de Accesibilidad WCAG 2.1 y Lector de Voz"
      >
        <Eye className="w-4 h-4 text-amber-300" />
        <span className="text-[11px] font-bold hidden sm:inline">Accesibilidad</span>
      </button>
    </div>
  );
}
