"use client";

import React from "react";
import { ArrowLeft, Calendar, ChevronRight, Filter, Newspaper, Search, Star } from "lucide-react";
import type { DisenoPortadaId, Noticia } from "@/app/types/portal";
import { formatearFechaEspanol } from "@/app/utils/portalFormatters";
import { OptimizedImage } from "@/app/components/ui/OptimizedImage";

interface HemerotecaViewProps {
  disenoActivo?: DisenoPortadaId;
  noticias: Noticia[];
  noticiasFiltradasHemeroteca: Noticia[];
  busquedaHemeroteca: string;
  setBusquedaHemeroteca: (v: string) => void;
  filtroCategoriaHemeroteca: string;
  setFiltroCategoriaHemeroteca: (v: string) => void;
  abrirNoticiaDetalle: (id: string) => void;
  onVolverInicio: () => void;
}

export function HemerotecaView({
  disenoActivo = "bento_moderno",
  noticias,
  noticiasFiltradasHemeroteca,
  busquedaHemeroteca,
  setBusquedaHemeroteca,
  filtroCategoriaHemeroteca,
  setFiltroCategoriaHemeroteca,
  abrirNoticiaDetalle,
  onVolverInicio,
}: HemerotecaViewProps) {
  const esHarvard = disenoActivo === "harvard_editorial";

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 view-transition-gpu">
      {/* Barra superior de retorno */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 shadow-xs ${
          esHarvard ? "rounded-none border-l-4 border-l-[#8B1515]" : "rounded-2xl"
        }`}
      >
        <button
          type="button"
          onClick={onVolverInicio}
          className={`px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-[#002855] dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            esHarvard ? "rounded-none uppercase tracking-wider" : "rounded-xl"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Volver al Portal Principal</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Newspaper className="w-4 h-4 text-red-700" />
          <span>{noticiasFiltradasHemeroteca.length} comunicados encontrados</span>
        </div>
      </div>

      {/* Banner Institucional */}
      <div
        className={`p-6 sm:p-8 text-white shadow-md space-y-2 ${
          esHarvard
            ? "rounded-none bg-gradient-to-r from-[#8B1515] via-[#2b070c] to-[#002855] border-t-4 border-amber-400 border-b-4 border-b-[#8B1515]"
            : "rounded-3xl bg-gradient-to-r from-[#002855] via-[#001c3d] to-[#4d0713]"
        }`}
      >
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-xs border border-white/20 text-xs font-bold uppercase tracking-wider ${
            esHarvard ? "rounded-none text-amber-300" : "rounded-full"
          }`}
        >
          <Newspaper className="w-3.5 h-3.5 text-red-300" />
          <span>
            {esHarvard
              ? "THE FCM GAZETTE • HEMEROTECA Y COMUNICADOS OFICIALES"
              : "Hemeroteca y Comunicados Oficiales FCM"}
          </span>
        </div>
        <h1
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
            esHarvard ? "font-harvard-serif" : ""
          }`}
        >
          {esHarvard ? "Gaceta Universitaria y Archivo de Prensa" : "Archivo General de Noticias"}
        </h1>
        <p className="text-xs sm:text-sm text-white/85 max-w-2xl leading-relaxed">
          Consulta convocatorias de pasantías, becas PRONABEC, congresos internacionales, resoluciones decanales y actividades académicas de la Facultad de Ciencias Matemáticas.
        </p>
      </div>

      {/* Buscador y Filtro por Categoría */}
      <div
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 ${
          esHarvard ? "rounded-none border-t-4 border-t-[#8B1515]" : "rounded-2xl"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={busquedaHemeroteca}
              onChange={(e) => setBusquedaHemeroteca(e.target.value)}
              placeholder="Buscar comunicado por título, palabras clave o contenido..."
              className={`w-full pl-10 pr-20 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#002855] dark:focus:border-blue-500 ${
                esHarvard ? "rounded-none" : "rounded-xl"
              }`}
            />
            {busquedaHemeroteca && (
              <button
                type="button"
                onClick={() => setBusquedaHemeroteca("")}
                className="absolute right-2.5 top-2 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-[11px] font-bold text-slate-700 dark:text-slate-200"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filtroCategoriaHemeroteca}
              onChange={(e) => setFiltroCategoriaHemeroteca(e.target.value)}
              className={`w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#002855] dark:focus:border-blue-500 ${
                esHarvard ? "rounded-none" : "rounded-xl"
              }`}
            >
              <option value="TODAS">Todas las Categorías ({noticias.length})</option>
              {Array.from(new Set(noticias.map((n) => n.categoria))).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cuadrícula de Noticias */}
      {noticiasFiltradasHemeroteca.length === 0 ? (
        <div
          className={`max-w-xl mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-sm ${
            esHarvard ? "rounded-none border-t-4 border-t-[#8B1515]" : "rounded-3xl"
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Newspaper className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#002855] dark:text-white">No se encontraron comunicados</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No hay noticias que coincidan con los filtros aplicados.
          </p>
          <button
            type="button"
            onClick={() => {
              setBusquedaHemeroteca("");
              setFiltroCategoriaHemeroteca("TODAS");
            }}
            className="px-5 py-2.5 rounded-xl bg-[#002855] text-white text-xs font-bold cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticiasFiltradasHemeroteca.map((not) => {
            const resumenLimpio =
              (not.resumen && not.resumen.trim()) ||
              not.contenido
                .replace(/^[#>*-\d.]+\s*/gm, "")
                .replace(/\*\*/g, "")
                .replace(/\n+/g, " ")
                .trim();
            return (
              <article
                key={not.id}
                onClick={() => abrirNoticiaDetalle(not.id)}
                className={`group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col justify-between cursor-pointer ${
                  esHarvard
                    ? "rounded-none border-t-4 border-t-[#8B1515] harvard-card-gpu"
                    : "rounded-2xl hover:border-red-600 dark:hover:border-red-500 hover:shadow-xl transition-all gpu-card"
                }`}
              >
                <div>
                  <div className="relative h-52 bg-slate-900 overflow-hidden">
                    <OptimizedImage
                      src={not.imagen_url}
                      alt={not.titulo}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-10">
                      <span
                        className={`px-3 py-1 text-[11px] font-bold bg-[#002855] text-white shadow ${
                          esHarvard ? "rounded-none uppercase tracking-wider" : "rounded-md"
                        }`}
                      >
                        {not.categoria}
                      </span>
                      {not.destacado && (
                        <span
                          className={`px-3 py-1 text-[11px] font-bold bg-[#8B1515] text-white shadow flex items-center gap-1 ${
                            esHarvard ? "rounded-none uppercase tracking-wider" : "rounded-md"
                          }`}
                        >
                          <Star className="w-3 h-3 fill-white" /> Importante
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-red-700" />
                      <span>{formatearFechaEspanol(not.fecha_publicacion)}</span>
                    </div>
                    <h3
                      className={`text-lg font-bold text-[#002855] dark:text-white group-hover:text-[#8B1515] dark:group-hover:text-red-400 transition-colors leading-snug ${
                        esHarvard ? "font-harvard-serif text-xl" : ""
                      }`}
                    >
                      {not.titulo}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {resumenLimpio}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002855] dark:text-blue-300 group-hover:text-[#8B1515] dark:group-hover:text-red-400 flex items-center gap-1.5">
                    <span className={esHarvard ? "uppercase tracking-wider" : ""}>
                      Leer noticia completa
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {not.modalidad && (
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-[#002855] dark:text-blue-300 border border-blue-200 dark:border-blue-800 ${
                        esHarvard ? "rounded-none" : "rounded-full"
                      }`}
                    >
                      {not.modalidad}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
