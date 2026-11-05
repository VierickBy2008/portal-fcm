"use client";

import React from "react";
import { ExternalLink, Globe, Trophy, X } from "lucide-react";
import type { OrgulloItem } from "@/app/types/portal";

interface ServicioModalInfo {
  titulo: string;
  sigla: string;
  descripcion: string;
  correo: string;
  anexo: string;
  horario: string;
}

interface OrgulloModalProps {
  modalDetalleOrgullo: OrgulloItem | null;
  onCerrarOrgullo: () => void;
  servicioModalInfo: ServicioModalInfo | null;
  onCerrarServicio: () => void;
}

export function OrgulloModal({
  modalDetalleOrgullo,
  onCerrarOrgullo,
  servicioModalInfo,
  onCerrarServicio,
}: OrgulloModalProps) {
  return (
    <>
      {/* MODAL DE UNIDADES DE SERVICIO AL ESTUDIANTE */}
      {servicioModalInfo && (
        <div
          onClick={onCerrarServicio}
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 modal-backdrop-gpu"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full rounded-3xl border-2 border-[#002855] dark:border-blue-700 bg-white dark:bg-slate-900 overflow-hidden shadow-2xl modal-panel-gpu"
          >
            <div className="bg-[#002855] text-white px-6 py-4 border-b-4 border-red-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-red-300 font-bold">
                  {servicioModalInfo.sigla}
                </span>
                <h3 className="text-base font-bold text-white">{servicioModalInfo.titulo}</h3>
              </div>
              <button
                type="button"
                onClick={onCerrarServicio}
                className="text-xs font-bold text-blue-200 hover:text-white cursor-pointer gpu-btn"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {servicioModalInfo.descripcion}
              </p>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 space-y-1.5 text-slate-700 dark:text-slate-300">
                <p>
                  <strong className="text-[#002855] dark:text-blue-300">Correo:</strong>{" "}
                  <span className="font-mono text-red-700 dark:text-red-400">
                    {servicioModalInfo.correo}
                  </span>
                </p>
                <p>
                  <strong className="text-[#002855] dark:text-blue-300">Teléfono:</strong> (01)
                  619-7000 — {servicioModalInfo.anexo}
                </p>
                <p>
                  <strong className="text-[#002855] dark:text-blue-300">Horario:</strong>{" "}
                  {servicioModalInfo.horario}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onCerrarServicio}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold cursor-pointer gpu-btn"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DETALLE AMPLIADO: ORGULLO SAN MARQUINO */}
      {modalDetalleOrgullo && (
        <div
          onClick={onCerrarOrgullo}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md modal-backdrop-gpu"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl lg:max-w-5xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#002855] dark:border-blue-700 max-h-[92vh] overflow-y-auto modal-panel-gpu"
          >
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-500">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-700 dark:text-red-400 block">
                    Excelencia Estudiantil FCM • UNMSM
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Detalle de Reconocimiento Oficial
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onCerrarOrgullo}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer gpu-btn"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuadrícula de 2 Columnas Espaciosa */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-950 shadow-xl border-2 border-slate-200 dark:border-slate-800">
                <img
                  src={modalDetalleOrgullo.foto_url}
                  alt={modalDetalleOrgullo.titulo}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-black/75 text-white backdrop-blur-md border border-white/20">
                    {modalDetalleOrgullo.tipo_tarjeta === "afiche"
                      ? "📜 Afiche Oficial"
                      : modalDetalleOrgullo.tipo_tarjeta === "estudiante"
                      ? "⭐ Reconocimiento"
                      : "🏆 Delegación FCM"}
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 space-y-4 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-[#002855] dark:bg-blue-950 text-white dark:text-blue-200 border border-blue-800 shadow-sm">
                    {modalDetalleOrgullo.subtitulo_categoria}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500 text-slate-950 shadow-sm">
                    Año {modalDetalleOrgullo.anio}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#002855] dark:text-white leading-tight">
                  {modalDetalleOrgullo.titulo}
                </h3>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#002855] dark:text-white">
                    <span>👤</span>
                    <span>{modalDetalleOrgullo.estudiante}</span>
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-400 font-semibold flex items-center gap-1.5">
                    <span>🏛️</span>
                    <span>
                      {modalDetalleOrgullo.carrera_nombre || "Facultad de Ciencias Matemáticas"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Impacto y Trayectoria
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    {modalDetalleOrgullo.descripcion}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  {modalDetalleOrgullo.enlace_nota ? (
                    <a
                      href={modalDetalleOrgullo.enlace_nota}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-lg group cursor-pointer gpu-btn"
                    >
                      <Globe className="w-4 h-4 text-red-200" />
                      <span>Ver Nota de Prensa / Enlace Oficial</span>
                      <ExternalLink className="w-3.5 h-3.5 text-red-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                      Reconocimiento verificado por la Facultad de Ciencias Matemáticas
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={onCerrarOrgullo}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer gpu-btn"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
