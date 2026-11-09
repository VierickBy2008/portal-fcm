"use client";

import React from "react";
import { ArrowLeft, Calendar, Download, FileText, Search } from "lucide-react";
import type { DisenoPortadaId, DocumentoTransparencia } from "@/app/types/portal";

interface TransparenciaViewProps {
  disenoActivo?: DisenoPortadaId;
  documentosTransparencia: DocumentoTransparencia[];
  filtroTransparenciaCategoria: string;
  setFiltroTransparenciaCategoria: (v: string) => void;
  filtroTransparenciaAnio: string;
  setFiltroTransparenciaAnio: (v: string) => void;
  busquedaTransparencia: string;
  setBusquedaTransparencia: (v: string) => void;
  paginaTransparencia: number;
  setPaginaTransparencia: React.Dispatch<React.SetStateAction<number>>;
  onVolverInicio: () => void;
}

export function TransparenciaView({
  disenoActivo = "bento_moderno",
  documentosTransparencia,
  filtroTransparenciaCategoria,
  setFiltroTransparenciaCategoria,
  filtroTransparenciaAnio,
  setFiltroTransparenciaAnio,
  busquedaTransparencia,
  setBusquedaTransparencia,
  paginaTransparencia,
  setPaginaTransparencia,
  onVolverInicio,
}: TransparenciaViewProps) {
  const esHarvard = disenoActivo === "harvard_editorial";
  const esAcademico = disenoActivo === "academico_moderno";
  const documentosFiltrados = documentosTransparencia.filter((doc) => {
    if (filtroTransparenciaCategoria !== "TODAS" && doc.categoria !== filtroTransparenciaCategoria) {
      return false;
    }
    if (filtroTransparenciaAnio !== "TODOS" && String(doc.anio) !== filtroTransparenciaAnio) {
      return false;
    }
    if (busquedaTransparencia.trim()) {
      const q = busquedaTransparencia.toLowerCase().trim();
      const matchCod = doc.codigo.toLowerCase().includes(q);
      const matchTit = doc.titulo.toLowerCase().includes(q);
      const matchSum = (doc.sumilla || "").toLowerCase().includes(q);
      const matchDep = doc.dependencia.toLowerCase().includes(q);
      if (!matchCod && !matchTit && !matchSum && !matchDep) return false;
    }
    return true;
  });

  const porPagina = 6;
  const totalPags = Math.ceil(documentosFiltrados.length / porPagina) || 1;
  const docsPaginados = documentosFiltrados.slice(
    (paginaTransparencia - 1) * porPagina,
    paginaTransparencia * porPagina
  );

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 view-transition-gpu">
      {/* Breadcrumbs y Barra Superior de Retorno */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onVolverInicio}
            className="font-bold text-[#002855] dark:text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portal FCM</span>
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-300 font-semibold">Transparencia Institucional</span>
          <span className="text-slate-400">/</span>
          <span className="text-red-700 dark:text-red-400 font-bold">Resoluciones y Documentos Oficiales</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <FileText className="w-4 h-4 text-red-700 dark:text-red-400" />
          <span>{documentosTransparencia.length} Documentos Normativos Registrados</span>
        </div>
      </div>

      {/* Banner Institucional de Transparencia */}
      <div
        className={`text-white p-6 sm:p-8 shadow-xl relative overflow-hidden ${
          esHarvard
            ? "rounded-none bg-gradient-to-r from-[#8B1515] via-[#2b070c] to-[#002855] border-t-4 border-amber-400 border-b-4 border-b-[#8B1515]"
            : esAcademico
            ? "rounded-2xl bg-gradient-to-r from-[#041024] via-[#002855] to-cyan-950 border-l-4 border-l-cyan-400 border-b-4 border-b-cyan-500"
            : "rounded-3xl bg-gradient-to-r from-[#002855] via-[#001c3d] to-[#4d0713] border-b-4 border-red-700"
        }`}
      >
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold uppercase tracking-wider text-red-300 ${
                esHarvard ? "rounded-none text-amber-300" : "rounded-full"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Órgano Oficial de Transparencia y Acceso a la Información • FCM UNMSM</span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
                esHarvard ? "font-harvard-serif" : ""
              }`}
            >
              Portal de Transparencia Institucional
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Acceso libre y oportuno a las Resoluciones Decanales, Resoluciones Rectorales, Planes Operativos Institucionales (POI), Memorias Anuales de Gestión, Actas de Consejo de Facultad y balances presupuestarios de la Facultad de Ciencias Matemáticas de la Universidad Nacional Mayor de San Marcos.
            </p>
          </div>

          {/* Tarjeta de Estadísticas y Resumen Oficial */}
          <div
            className={`bg-white/10 backdrop-blur-md border border-white/20 p-5 shrink-0 grid grid-cols-2 gap-4 text-center min-w-[280px] ${
              esHarvard ? "rounded-none border-t-2 border-t-amber-400" : "rounded-2xl"
            }`}
          >
            <div className="border-r border-white/15 pr-3">
              <span
                className={`text-3xl font-extrabold text-white block ${
                  esHarvard ? "font-harvard-serif" : ""
                }`}
              >
                {documentosTransparencia.length}
              </span>
              <span className="text-[11px] font-bold text-red-300 uppercase tracking-wider block mt-0.5">
                Docs Oficiales
              </span>
              <span className="text-[10px] text-blue-200 block mt-1">Digitalizados PDF</span>
            </div>
            <div className="pl-3">
              <span
                className={`text-3xl font-extrabold text-amber-400 block ${
                  esHarvard ? "font-harvard-serif" : ""
                }`}
              >
                {new Set(documentosTransparencia.map((d) => d.categoria)).size || 1}
              </span>
              <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block mt-0.5">
                Categorías
              </span>
              <span className="text-[10px] text-emerald-300 block mt-1">Actualizado 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros Acumulativos: Categorías + Selector de Año + Buscador */}
      <div
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 ${
          esHarvard ? "rounded-none border-t-4 border-t-[#8B1515]" : "rounded-2xl"
        }`}
      >
        {/* Pestañas de Categoría Normativa */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          {[
            "TODAS",
            "Resoluciones Decanales",
            "Resoluciones Rectorales",
            "Plan Operativo Institucional (POI)",
            "Memorias de Gestión",
            "Balances y Presupuesto",
            "Actas de Consejo de Facultad",
            "Convenios y Alianzas",
          ].map((cat) => {
            const activo = filtroTransparenciaCategoria === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setFiltroTransparenciaCategoria(cat);
                  setPaginaTransparencia(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activo
                    ? "bg-[#002855] dark:bg-blue-600 text-white shadow-md border-b-2 border-red-500"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat === "TODAS" ? "Todos los Documentos" : cat}
              </button>
            );
          })}
        </div>

        {/* Fila: Buscador por sumilla/código + Selector de Año */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-9 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={busquedaTransparencia}
              onChange={(e) => {
                setBusquedaTransparencia(e.target.value);
                setPaginaTransparencia(1);
              }}
              placeholder="Buscar por número de resolución (ej. 0488), palabra clave o sumilla..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
            {busquedaTransparencia && (
              <button
                type="button"
                onClick={() => setBusquedaTransparencia("")}
                className="absolute right-2.5 top-2 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-[11px] font-bold text-slate-700 dark:text-slate-200"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="md:col-span-3">
            <select
              value={filtroTransparenciaAnio}
              onChange={(e) => {
                setFiltroTransparenciaAnio(e.target.value);
                setPaginaTransparencia(1);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-red-500"
            >
              <option value="TODOS">Todos los Años</option>
              <option value="2026">Año 2026 (Vigente)</option>
              <option value="2025">Año 2025</option>
              <option value="2024">Año 2024</option>
              <option value="2023">Año 2023</option>
              <option value="2022">Año 2022</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Documentos de Transparencia */}
      {documentosFiltrados.length === 0 ? (
        <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No se encontraron documentos oficiales
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Intenta seleccionando otra categoría, borrando el término de búsqueda o cambiando el año.
          </p>
          <button
            type="button"
            onClick={() => {
              setFiltroTransparenciaCategoria("TODAS");
              setFiltroTransparenciaAnio("TODOS");
              setBusquedaTransparencia("");
              setPaginaTransparencia(1);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {docsPaginados.map((doc) => (
              <div
                key={doc.id}
                className={`border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between gap-4 shadow-sm ${
                  esHarvard
                    ? "rounded-none border-t-4 border-t-[#8B1515] harvard-card-gpu"
                    : "rounded-2xl hover:border-[#002855] dark:hover:border-blue-600 transition-all gpu-card"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`font-mono font-bold text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 border border-red-200 dark:border-red-900/60 ${
                        esHarvard ? "rounded-none" : "rounded-lg"
                      }`}
                    >
                      {doc.codigo}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-[#002855] dark:text-blue-300 border border-blue-200 dark:border-blue-800 ${
                        esHarvard ? "rounded-none uppercase tracking-wider" : "rounded-full"
                      }`}
                    >
                      {doc.categoria}
                    </span>
                  </div>

                  <h3
                    className={`text-base font-bold text-[#002855] dark:text-white leading-snug ${
                      esHarvard ? "font-harvard-serif text-lg" : ""
                    }`}
                  >
                    {doc.titulo}
                  </h3>

                  {doc.sumilla && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {doc.sumilla}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-red-700 dark:text-red-400" />
                      {doc.fecha}
                    </span>
                    <span>•</span>
                    <span>{doc.dependencia}</span>
                    <span>•</span>
                    <span className="font-mono font-bold">{doc.tamano_archivo}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">Formato Oficial Digital</span>
                  <a
                    href={doc.url_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#002855] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación de Transparencia */}
          {totalPags > 1 && (
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPaginaTransparencia((p) => Math.max(1, p - 1))}
                disabled={paginaTransparencia <= 1}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                ← Anterior
              </button>
              {Array.from({ length: totalPags }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPaginaTransparencia(num)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    paginaTransparencia === num
                      ? "bg-[#002855] dark:bg-blue-600 text-white"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPaginaTransparencia((p) => Math.min(totalPags, p + 1))}
                disabled={paginaTransparencia >= totalPags}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
