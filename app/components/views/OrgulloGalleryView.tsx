"use client";

import React from "react";
import { ArrowLeft, Award, ChevronRight, Search, Trophy } from "lucide-react";
import type { Carrera, CarreraId, OrgulloItem } from "@/app/types/portal";
import { TEMA_CARRERA } from "@/app/data/portalInitialData";
import { OptimizedImage } from "@/app/components/ui/OptimizedImage";

interface OrgulloGalleryViewProps {
  carreras: Carrera[];
  orgulloItems: OrgulloItem[];
  orgulloFiltrados: OrgulloItem[];
  filtroOrgulloCarrera: "TODAS" | CarreraId | "fcm";
  setFiltroOrgulloCarrera: (v: "TODAS" | CarreraId | "fcm") => void;
  busquedaOrgullo: string;
  setBusquedaOrgullo: (v: string) => void;
  setModalDetalleOrgullo: (item: OrgulloItem) => void;
  onVolverInicio: () => void;
}

export function OrgulloGalleryView({
  carreras,
  orgulloItems,
  orgulloFiltrados,
  filtroOrgulloCarrera,
  setFiltroOrgulloCarrera,
  busquedaOrgullo,
  setBusquedaOrgullo,
  setModalDetalleOrgullo,
  onVolverInicio,
}: OrgulloGalleryViewProps) {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 view-transition-gpu">
      {/* Barra superior de retorno */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl shadow-xs">
        <button
          type="button"
          onClick={onVolverInicio}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#002855] dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Volver al Portal Principal</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{orgulloFiltrados.length} reconocimientos registrados</span>
        </div>
      </div>

      {/* Banner Institucional de la Galería de Orgullo */}
      <div className="rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden bg-gradient-to-r from-[#002855] via-[#001c3d] to-[#4d0713] border-b-4 border-amber-500">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Award className="w-3.5 h-3.5" />
              <span>EXCELENCIA ESTUDIANTIL E IMPACTO INTERNACIONAL • FCM UNMSM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400" />
              <span>Galería de Orgullo San Marquino</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/85 max-w-2xl leading-relaxed">
              Historias de éxito, distinciones internacionales, pasantías y logros destacados de nuestros estudiantes, investigadores y egresados de la Facultad de Ciencias Matemáticas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-4 text-center min-w-[120px]">
              <span className="text-2xl sm:text-3xl font-bold block text-amber-300">
                {orgulloItems.length}
              </span>
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
                Distinciones
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros: Pestañas de Escuela + Buscador */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => setFiltroOrgulloCarrera("TODAS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              filtroOrgulloCarrera === "TODAS"
                ? "bg-[#002855] dark:bg-blue-600 text-white shadow-md border-b-2 border-amber-500"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <span>Todas las Escuelas</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                filtroOrgulloCarrera === "TODAS"
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              }`}
            >
              {orgulloItems.length}
            </span>
          </button>

          {carreras.map((car) => {
            const totalEsc = orgulloItems.filter((i) => i.carrera_id === car.id).length;
            const activo = filtroOrgulloCarrera === car.id;
            const temaCar = TEMA_CARRERA[car.id];
            return (
              <button
                key={car.id}
                type="button"
                onClick={() => setFiltroOrgulloCarrera(car.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activo
                    ? temaCar.tabActive
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{car.nombre}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activo
                      ? temaCar.tabPillActive
                      : "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {totalEsc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Buscador de Logros */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={busquedaOrgullo}
            onChange={(e) => setBusquedaOrgullo(e.target.value)}
            placeholder="Buscar por estudiante, certamen, conferencia o logro..."
            className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#002855] dark:focus:border-blue-500"
          />
          {busquedaOrgullo && (
            <button
              type="button"
              onClick={() => setBusquedaOrgullo("")}
              className="absolute right-2.5 top-2 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-[11px] font-bold text-slate-700 dark:text-slate-200"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Grid de Logros Completo */}
      {orgulloFiltrados.length === 0 ? (
        <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-[#002855] dark:text-white">
            No se encontraron reconocimientos con esos filtros
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Intenta limpiando el texto del buscador o seleccionando otra escuela profesional.
          </p>
          <button
            type="button"
            onClick={() => {
              setBusquedaOrgullo("");
              setFiltroOrgulloCarrera("TODAS");
            }}
            className="px-5 py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer shadow-sm transition-all"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orgulloFiltrados.map((item) => (
            <div
              key={item.id}
              onClick={() => setModalDetalleOrgullo(item)}
              className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-600 dark:hover:border-red-500 shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                <OptimizedImage
                  src={item.foto_url}
                  alt={item.titulo}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none z-10" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-20">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#002855]/90 text-white backdrop-blur-md border border-white/20 shadow-md">
                    {item.subtitulo_categoria}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm">
                    {item.anio}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 space-y-1 text-white pointer-events-none z-20">
                  <span className="text-[11px] font-semibold text-red-300 block uppercase tracking-wider">
                    {item.carrera_nombre || "Facultad de Ciencias Matemáticas"}
                  </span>
                  <h3 className="text-base font-bold leading-tight line-clamp-2 drop-shadow-md">
                    {item.titulo}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium line-clamp-1">
                    👤 {item.estudiante}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {item.descripcion}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] font-bold text-[#002855] dark:text-blue-300">
                    {item.tipo_tarjeta === "afiche"
                      ? "📜 Afiche Oficial"
                      : item.tipo_tarjeta === "estudiante"
                      ? "⭐ Reconocimiento"
                      : "🏆 Delegación FCM"}
                  </span>
                  <span className="text-xs font-bold text-red-700 dark:text-red-400 group-hover:text-red-800 dark:group-hover:text-red-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Ver Detalle</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
