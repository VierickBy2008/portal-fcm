"use client";

import React from "react";
import { ArrowLeft, ChevronRight, Filter, Search, Star, Users } from "lucide-react";
import type { Carrera, CarreraId, Docente } from "@/app/types/portal";
import { CARRERAS_INICIALES, TEMA_CARRERA } from "@/app/data/portalInitialData";
import { obtenerInicialesDocente } from "@/app/utils/portalFormatters";
import { OptimizedImage } from "@/app/components/ui/OptimizedImage";

interface DocentesViewProps {
  carreras: Carrera[];
  docentes: Docente[];
  docentesFiltradosHome: Docente[];
  filtroDocenteCarrera: "TODAS" | CarreraId;
  busquedaDocentes: string;
  setBusquedaDocentes: (v: string) => void;
  filtroCategoriaDocente: string;
  setFiltroCategoriaDocente: (v: string) => void;
  obtenerEstadisticasDocente: (docenteId: string) => { promedio: number; total: number };
  abrirModalDocente: (doc: Docente) => void;
  onCambiarCarrera: (carrera: "TODAS" | CarreraId) => void;
  onVolverInicio: () => void;
}

export function DocentesView({
  carreras,
  docentes,
  docentesFiltradosHome,
  filtroDocenteCarrera,
  busquedaDocentes,
  setBusquedaDocentes,
  filtroCategoriaDocente,
  setFiltroCategoriaDocente,
  obtenerEstadisticasDocente,
  abrirModalDocente,
  onCambiarCarrera,
  onVolverInicio,
}: DocentesViewProps) {
  const esTodas = filtroDocenteCarrera === "TODAS";
  const escuelaObj = esTodas
    ? null
    : carreras.find((c) => c.id === filtroDocenteCarrera) || CARRERAS_INICIALES[0];
  const temaEsc = escuelaObj ? TEMA_CARRERA[escuelaObj.id] : null;

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Barra superior de retorno */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl shadow-xs">
        <button
          type="button"
          onClick={onVolverInicio}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#002855] hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Volver al Portal Principal</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Users className="w-4 h-4 text-red-700" />
          <span>{docentesFiltradosHome.length} catedráticos encontrados</span>
        </div>
      </div>

      {/* Banner Institucional Superior de la Escuela o de la Facultad */}
      <div
        className={`rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden ${
          esTodas
            ? "bg-gradient-to-r from-[#002855] via-[#001c3d] to-[#4d0713]"
            : `${temaEsc?.headerBg} border-b-4 ${temaEsc?.borderAccent}`
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-red-300" />
              <span>
                {esTodas
                  ? "4 Escuelas Profesionales • UNMSM"
                  : `${escuelaObj?.codigo_escuela} • Plana Catedrática Oficial`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              {esTodas
                ? "Plana Docente e Investigadores FCM"
                : `Docentes de la Escuela Profesional de ${escuelaObj?.nombre}`}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 max-w-2xl leading-relaxed">
              {esTodas
                ? "Cuerpo docente adscrito a los departamentos académicos de Computación Científica, Matemática, Estadística e Investigación Operativa."
                : `Catedráticos e investigadores dedicados a la formación académica en la Escuela de ${escuelaObj?.nombre}.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-4 text-center min-w-[120px]">
              <span className="text-2xl sm:text-3xl font-bold block">
                {docentesFiltradosHome.length}
              </span>
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
                {docentesFiltradosHome.length === 1 ? "Docente" : "Docentes"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros: Pestañas de Escuela, Buscador y Categoría */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Pestañas de Escuela */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => onCambiarCarrera("TODAS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              filtroDocenteCarrera === "TODAS"
                ? "bg-[#002855] text-white shadow-md border-b-2 border-red-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <span>Todas (FCM)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                filtroDocenteCarrera === "TODAS"
                  ? "bg-red-700 text-white"
                  : "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              }`}
            >
              {docentes.length}
            </span>
          </button>

          {carreras.map((car) => {
            const temaCar = TEMA_CARRERA[car.id];
            const activo = filtroDocenteCarrera === car.id;
            const totalPorEscuela = docentes.filter((d) => d.carrera_id === car.id).length;
            return (
              <button
                key={car.id}
                type="button"
                onClick={() => onCambiarCarrera(car.id)}
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
                  {totalPorEscuela}
                </span>
              </button>
            );
          })}
        </div>

        {/* Buscador + Filtro por Categoría Docente */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={busquedaDocentes}
              onChange={(e) => setBusquedaDocentes(e.target.value)}
              placeholder="Buscar profesor por apellido, especialidad o asignatura que dicta..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#002855] dark:focus:border-blue-500"
            />
            {busquedaDocentes && (
              <button
                type="button"
                onClick={() => setBusquedaDocentes("")}
                className="absolute right-2.5 top-2 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-[11px] font-bold text-slate-700 dark:text-slate-200"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filtroCategoriaDocente}
              onChange={(e) => setFiltroCategoriaDocente(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#002855] dark:focus:border-blue-500"
            >
              <option value="TODAS">Todas las Categorías</option>
              <option value="Principal">Profesor Principal</option>
              <option value="Asociado">Profesor Asociado</option>
              <option value="Auxiliar">Profesor Auxiliar</option>
              <option value="Contratado">Docente Contratado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Profesores */}
      {docentesFiltradosHome.length === 0 ? (
        <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#002855] dark:text-white">
            No se encontraron docentes con esos filtros
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Intenta seleccionando otra categoría académica, limpiando el texto del buscador o cambiando de escuela profesional.
          </p>
          <button
            type="button"
            onClick={() => {
              setBusquedaDocentes("");
              setFiltroCategoriaDocente("TODAS");
              onCambiarCarrera("TODAS");
            }}
            className="px-5 py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer shadow-sm transition-all"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {(filtroDocenteCarrera === "TODAS"
            ? carreras.filter((c) => docentesFiltradosHome.some((d) => d.carrera_id === c.id))
            : carreras.filter((c) => c.id === filtroDocenteCarrera)
          ).map((escuelaGrupo) => {
            const temaGrupo = TEMA_CARRERA[escuelaGrupo.id];
            const listaDocentesGrupo = docentesFiltradosHome.filter(
              (d) => d.carrera_id === escuelaGrupo.id
            );
            return (
              <div key={escuelaGrupo.id} className="space-y-4">
                {filtroDocenteCarrera === "TODAS" && (
                  <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3.5 h-3.5 rounded-full ${temaGrupo.headerBg}`} />
                      <h2 className="text-lg font-bold text-[#002855] dark:text-white">
                        E.P. de {escuelaGrupo.nombre}
                      </h2>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${temaGrupo.badgeSoft}`}
                      >
                        {listaDocentesGrupo.length}{" "}
                        {listaDocentesGrupo.length === 1 ? "docente" : "docentes"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onCambiarCarrera(escuelaGrupo.id)}
                      className="text-xs font-bold text-[#002855] dark:text-blue-300 hover:text-red-700 dark:hover:text-red-400 cursor-pointer"
                    >
                      Ver solo esta escuela →
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {listaDocentesGrupo.map((doc) => {
                    const temaDoc = TEMA_CARRERA[doc.carrera_id];
                    const nombreEscuela =
                      carreras.find((c) => c.id === doc.carrera_id)?.nombre || "FCM";
                    const statsDoc = obtenerEstadisticasDocente(doc.id);
                    return (
                      <div
                        key={doc.id}
                        onClick={() => abrirModalDocente(doc)}
                        className={`group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${temaDoc.cardHoverBorder} shadow-sm hover:shadow-xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between text-center`}
                      >
                        <div>
                          {/* Fotografía Superior Uniforme o Avatar Institucional */}
                          <div className="relative h-52 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-slate-100 dark:border-slate-800">
                            {doc.foto_url ? (
                              <OptimizedImage
                                src={doc.foto_url}
                                alt={`${doc.grado_academico} ${doc.nombre_completo}`}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div
                                className={`w-full h-full ${temaDoc.headerBg} flex items-center justify-center text-white text-3xl font-bold tracking-wider`}
                              >
                                {obtenerInicialesDocente(doc.nombre_completo)}
                              </div>
                            )}
                            <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs z-10">
                              {doc.categoria_docente}
                            </span>
                          </div>

                          {/* Franja de color de su Escuela Profesional */}
                          <div className={`h-1.5 w-full ${temaDoc.headerBg}`} />

                          {/* Información Centrada */}
                          <div className="p-5 space-y-2">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${temaDoc.badgeSoft}`}
                            >
                              {nombreEscuela}
                            </span>
                            <h3
                              className={`text-sm sm:text-base font-bold text-[#002855] dark:text-white ${temaDoc.groupHoverText} transition-colors leading-snug`}
                            >
                              {doc.grado_academico} {doc.nombre_completo}
                            </h3>

                            {/* Calificación y Estrellas */}
                            <div className="flex items-center justify-center">
                              {statsDoc.total > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-800">
                                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                  <span>{statsDoc.promedio.toFixed(1)}</span>
                                  <span className="text-amber-600 font-semibold">
                                    ({statsDoc.total})
                                  </span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600">
                                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                  <span>Nuevo • Calificar</span>
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                              {doc.especialidad}
                            </p>
                          </div>
                        </div>

                        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#002855] dark:text-blue-300 group-hover:text-red-700 dark:group-hover:text-red-400">
                          <span>Ver Ficha y Calificar</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
