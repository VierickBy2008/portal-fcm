"use client";

import React from "react";
import {
  ArrowLeft,
  Calendar,
  Edit3,
  ExternalLink,
  Globe,
  MapPin,
  Share2,
  Star,
  Users,
} from "lucide-react";
import type { Noticia } from "@/app/types/portal";
import { formatearFechaEspanol, renderizarContenidoNoticia } from "@/app/utils/portalFormatters";

interface DetalleNoticiaModalProps {
  noticiaActiva: Noticia;
  noticias: Noticia[];
  adminAutenticado: boolean;
  onVolverPortal: () => void;
  onEditarEnCms: (noticia: Noticia) => void;
  onCompartirNoticia: (noticia: Noticia) => void;
  abrirNoticiaDetalle: (id: string) => void;
}

export function DetalleNoticiaModal({
  noticiaActiva,
  noticias,
  adminAutenticado,
  onVolverPortal,
  onEditarEnCms,
  onCompartirNoticia,
  abrirNoticiaDetalle,
}: DetalleNoticiaModalProps) {
  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10 view-transition-gpu">
      {/* Barra superior de navegación y compartir */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl shadow-xs print:hidden">
        <button
          type="button"
          onClick={onVolverPortal}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#002855] dark:hover:bg-blue-600 hover:text-white text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer gpu-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Volver al Portal</span>
        </button>

        <div className="flex items-center gap-2">
          {adminAutenticado && (
            <button
              type="button"
              onClick={() => onEditarEnCms(noticiaActiva)}
              className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-[#002855] dark:text-blue-300 border border-blue-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer gpu-btn"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar en CMS</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onCompartirNoticia(noticiaActiva)}
            className="px-4 py-2 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer gpu-btn"
          >
            <Share2 className="w-3.5 h-3.5 text-red-400" />
            <span>Compartir Noticia</span>
          </button>
        </div>
      </div>

      {/* Contenedor Principal del Artículo */}
      <article className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden min-h-[260px] max-h-[540px]">
          <img
            src={noticiaActiva.imagen_url}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-25 blur-xl scale-110 pointer-events-none"
          />
          <img
            src={noticiaActiva.imagen_url}
            alt={noticiaActiva.titulo}
            className="relative z-10 w-full max-h-[520px] object-contain"
          />
        </div>

        <div className="p-6 sm:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#002855] text-white">
                  {noticiaActiva.categoria}
                </span>
                {noticiaActiva.destacado && (
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-red-700 text-white flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-white" /> Destacado FCM
                  </span>
                )}
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5 ml-auto">
                  <Calendar className="w-4 h-4 text-red-700" />
                  {formatearFechaEspanol(noticiaActiva.fecha_publicacion)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold text-[#002855] dark:text-white leading-tight">
                {noticiaActiva.titulo}
              </h1>

              {noticiaActiva.resumen && (
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {noticiaActiva.resumen}
                </p>
              )}
            </div>

            {/* Layout con Ficha Rápida de Evento + Cuerpo del Artículo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div
                className={
                  noticiaActiva.fecha_evento ||
                  noticiaActiva.lugar ||
                  noticiaActiva.modalidad ||
                  noticiaActiva.dirigido_a ||
                  noticiaActiva.enlace_inscripcion
                    ? "lg:col-span-8"
                    : "lg:col-span-12 max-w-3xl mx-auto w-full"
                }
              >
                {renderizarContenidoNoticia(noticiaActiva.contenido)}
              </div>

              {(noticiaActiva.fecha_evento ||
                noticiaActiva.lugar ||
                noticiaActiva.modalidad ||
                noticiaActiva.dirigido_a ||
                noticiaActiva.enlace_inscripcion) && (
                <aside className="lg:col-span-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border-2 border-[#002855]/15 dark:border-slate-800 p-5 space-y-4">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                      Ficha Oficial del Evento / Comunicado
                    </span>
                    <h3 className="text-sm font-bold text-[#002855] dark:text-white">Datos Clave</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    {noticiaActiva.fecha_evento && (
                      <div className="flex items-start gap-2.5">
                        <Calendar className="w-4 h-4 text-red-700 dark:text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                            Fecha / Cronograma
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {noticiaActiva.fecha_evento}
                          </p>
                        </div>
                      </div>
                    )}
                    {noticiaActiva.lugar && (
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-red-700 dark:text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                            Lugar / Sede
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {noticiaActiva.lugar}
                          </p>
                        </div>
                      </div>
                    )}
                    {noticiaActiva.modalidad && (
                      <div className="flex items-start gap-2.5">
                        <Globe className="w-4 h-4 text-red-700 dark:text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                            Modalidad
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {noticiaActiva.modalidad}
                          </p>
                        </div>
                      </div>
                    )}
                    {noticiaActiva.dirigido_a && (
                      <div className="flex items-start gap-2.5">
                        <Users className="w-4 h-4 text-red-700 dark:text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                            Dirigido a
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {noticiaActiva.dirigido_a}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {noticiaActiva.enlace_inscripcion && (
                    <a
                      href={noticiaActiva.enlace_inscripcion}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors gpu-btn"
                    >
                      <span>🚀 Inscribirse / Ver Bases Oficiales</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </aside>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Otras noticias relacionadas */}
      {noticias.filter((n) => n.id !== noticiaActiva.id).length > 0 && (
        <section className="space-y-4 print:hidden">
          <div className="flex items-center justify-between border-b-2 border-blue-900 pb-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-[#002855] dark:text-white">
              Otras Noticias de la Facultad
            </h2>
            <button
              type="button"
              onClick={onVolverPortal}
              className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline cursor-pointer"
            >
              Ver todas en el Inicio →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {noticias
              .filter((n) => n.id !== noticiaActiva.id)
              .slice(0, 3)
              .map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => abrirNoticiaDetalle(rel.id)}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-600 dark:hover:border-red-500 overflow-hidden shadow-xs hover:shadow-xl cursor-pointer flex flex-col justify-between gpu-card"
                >
                  <div>
                    <div className="h-36 bg-slate-900 overflow-hidden">
                      <img
                        src={rel.imagen_url}
                        alt={rel.titulo}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-red-700 dark:text-red-400">
                        {rel.categoria}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-[#002855] dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2">
                        {rel.titulo}
                      </h3>
                    </div>
                  </div>
                  <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-[#002855] dark:text-blue-300">
                    <span className="text-slate-500 dark:text-slate-400">
                      {rel.fecha_publicacion}
                    </span>
                    <span>Leer →</span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
    </main>
  );
}
