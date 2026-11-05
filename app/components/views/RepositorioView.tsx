"use client";

import React from "react";
import { Download, Filter, FolderGit2, Search, Upload, UserCheck } from "lucide-react";
import type { Carrera, CarreraId, CursoMalla, MaterialRepositorio, TipoArchivo } from "@/app/types/portal";
import { TEMA_CARRERA } from "@/app/data/portalInitialData";

interface RepositorioViewProps {
  carreras: Carrera[];
  malla: CursoMalla[];
  repoFiltroCarrera: "TODAS" | CarreraId;
  setRepoFiltroCarrera: (v: "TODAS" | CarreraId) => void;
  repoFiltroCiclo: "TODOS" | number;
  setRepoFiltroCiclo: (v: "TODOS" | number) => void;
  repoFiltroCurso: string;
  setRepoFiltroCurso: (v: string) => void;
  repoFiltroTipo: "TODOS" | TipoArchivo;
  setRepoFiltroTipo: (v: "TODOS" | TipoArchivo) => void;
  repoBusquedaTexto: string;
  setRepoBusquedaTexto: (v: string) => void;
  cursosDisponiblesFiltroRepo: CursoMalla[];
  materialesFiltradosRepo: MaterialRepositorio[];
  materialesPaginadosRepo: MaterialRepositorio[];
  inicioIndiceRepo: number;
  finIndiceRepo: number;
  totalPaginasRepo: number;
  repoPaginaActual: number;
  cambiarPaginaRepo: (p: number) => void;
  obtenerNumerosPaginaRepo: () => (number | "...")[];
  renderIconoArchivo: (tipo: TipoArchivo) => React.ReactNode;
  onAbrirModalSubir: () => void;
}

export function RepositorioView({
  carreras,
  malla,
  repoFiltroCarrera,
  setRepoFiltroCarrera,
  repoFiltroCiclo,
  setRepoFiltroCiclo,
  repoFiltroCurso,
  setRepoFiltroCurso,
  repoFiltroTipo,
  setRepoFiltroTipo,
  repoBusquedaTexto,
  setRepoBusquedaTexto,
  cursosDisponiblesFiltroRepo,
  materialesFiltradosRepo,
  materialesPaginadosRepo,
  inicioIndiceRepo,
  finIndiceRepo,
  totalPaginasRepo,
  repoPaginaActual,
  cambiarPaginaRepo,
  obtenerNumerosPaginaRepo,
  renderIconoArchivo,
  onAbrirModalSubir,
}: RepositorioViewProps) {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8 view-transition-gpu">
      <div className="rounded-3xl bg-[#002855] text-white p-6 sm:p-8 border-b-4 border-red-700 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-xs font-mono uppercase text-red-300 font-bold">
            Comunidad Académica FCM • /repositorio
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Repositorio Académico de la Facultad
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
            Filtra exámenes resueltos, apuntes en LaTeX, libros y código por{" "}
            <strong>Carrera ➔ Ciclo ➔ Curso ➔ Formato</strong>.
          </p>
        </div>
        <button
          onClick={onAbrirModalSubir}
          className="px-5 py-3.5 rounded-xl bg-red-700 hover:bg-red-600 text-xs sm:text-sm font-bold text-white shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4" /> ➕ Aportar Material Académico
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5 h-fit shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-[#002855] dark:text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-700" /> Filtros Acumulativos
            </h3>
            <button
              onClick={() => {
                setRepoFiltroCarrera("TODAS");
                setRepoFiltroCiclo("TODOS");
                setRepoFiltroCurso("TODOS");
                setRepoFiltroTipo("TODOS");
                setRepoBusquedaTexto("");
              }}
              className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
            >
              Reiniciar
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              1. Carrera Profesional
            </label>
            <select
              value={repoFiltroCarrera}
              onChange={(e) => {
                setRepoFiltroCarrera(e.target.value as "TODAS" | CarreraId);
                setRepoFiltroCurso("TODOS");
              }}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
            >
              <option value="TODAS">Todas las Carreras (4)</option>
              {carreras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              2. Ciclo Académico (1 - 10)
            </label>
            <select
              value={repoFiltroCiclo}
              onChange={(e) => {
                setRepoFiltroCiclo(e.target.value === "TODOS" ? "TODOS" : Number(e.target.value));
                setRepoFiltroCurso("TODOS");
              }}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
            >
              <option value="TODOS">Todos los Ciclos</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                <option key={c} value={c}>
                  Ciclo {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              3. Curso ({cursosDisponiblesFiltroRepo.length})
            </label>
            <select
              value={repoFiltroCurso}
              onChange={(e) => setRepoFiltroCurso(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
            >
              <option value="TODOS">Todos los cursos</option>
              {cursosDisponiblesFiltroRepo.map((cur) => (
                <option key={cur.id} value={cur.id}>
                  [{cur.codigo}] {cur.nombre_curso}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              4. Formato de Archivo
            </label>
            <select
              value={repoFiltroTipo}
              onChange={(e) => setRepoFiltroTipo(e.target.value as "TODOS" | TipoArchivo)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
            >
              <option value="TODOS">Todos los formatos</option>
              <option value="Examen">Examen Resuelto</option>
              <option value="Apunte">Apuntes LaTeX / Clase</option>
              <option value="Codigo">Código Fuente / Lab</option>
              <option value="PDF">Libro / Guía PDF</option>
              <option value="Silabo">Sílabo Oficial</option>
            </select>
          </div>
        </aside>

        <section id="seccion-recursos-repo" className="lg:col-span-9 space-y-4 scroll-mt-28">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={repoBusquedaTexto}
              onChange={(e) => setRepoBusquedaTexto(e.target.value)}
              placeholder="Filtrar recursos por título, código de curso, nombre del curso o docente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 shadow-xs"
            />
          </div>

          {materialesFiltradosRepo.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
              <FolderGit2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No hay materiales aprobados para esta selección
              </h3>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materialesPaginadosRepo.map((mat) => {
                  const curso = malla.find((c) => c.id === mat.curso_id);
                  const carrera = carreras.find((ca) => ca.id === mat.carrera_id);
                  return (
                    <article
                      key={mat.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#002855] dark:hover:border-blue-600 p-5 flex flex-col justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                            [{curso?.codigo || "CURSO"}] • Ciclo {mat.ciclo || curso?.ciclo || 1}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${TEMA_CARRERA[mat.carrera_id].badgeSoft}`}
                          >
                            {carrera?.nombre}
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5">
                            {renderIconoArchivo(mat.tipo_archivo)}
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-sm text-[#002855] dark:text-white leading-snug">
                              {mat.titulo}
                            </h3>
                            <p className="text-xs text-red-700 font-bold">
                              Curso: {curso?.nombre_curso}
                            </p>
                            <p className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5 pt-0.5">
                              <UserCheck className="w-3.5 h-3.5 text-[#002855]" />
                              <span>
                                Docente: <strong>{mat.docente}</strong>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          Subido por:{" "}
                          <strong className="text-slate-800 dark:text-slate-200">
                            {mat.autor_alias}
                          </strong>
                        </span>
                        <a
                          href={mat.url_archivo}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white font-bold flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" /> Descargar
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* BARRA DE PAGINACIÓN INSTITUCIONAL FCM */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Mostrando{" "}
                  <strong className="text-[#002855] dark:text-blue-400">
                    {materialesFiltradosRepo.length === 0 ? 0 : inicioIndiceRepo + 1}
                  </strong>{" "}
                  -{" "}
                  <strong className="text-[#002855] dark:text-blue-400">{finIndiceRepo}</strong> de{" "}
                  <strong className="text-[#002855] dark:text-blue-400">
                    {materialesFiltradosRepo.length}
                  </strong>{" "}
                  materiales académicos
                </p>

                {totalPaginasRepo > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => cambiarPaginaRepo(repoPaginaActual - 1)}
                      disabled={repoPaginaActual <= 1}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#002855] dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                    >
                      ← Anterior
                    </button>

                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {obtenerNumerosPaginaRepo().map((p, idx) => {
                        if (p === "...") {
                          return (
                            <span
                              key={`p-dots-${idx}`}
                              className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-400"
                            >
                              ...
                            </span>
                          );
                        }
                        const esActiva = p === repoPaginaActual;
                        return (
                          <button
                            key={`p-num-${p}`}
                            type="button"
                            onClick={() => cambiarPaginaRepo(p)}
                            className={`min-w-[34px] sm:min-w-[38px] h-[34px] sm:h-[38px] px-2 rounded-xl text-xs sm:text-sm transition-all duration-150 flex items-center justify-center cursor-pointer ${
                              esActiva
                                ? "bg-[#002855] dark:bg-blue-600 text-white font-bold shadow-md scale-105 border border-[#002855] dark:border-blue-500"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#002855] font-bold border border-slate-200 dark:border-slate-700 shadow-xs"
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => cambiarPaginaRepo(repoPaginaActual + 1)}
                      disabled={repoPaginaActual >= totalPaginasRepo}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#002855] dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                    >
                      Siguiente →
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
