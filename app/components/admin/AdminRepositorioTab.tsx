"use client";

import React from "react";
import { Star, CheckCircle2 } from "lucide-react";
import {
  Carrera,
  CursoMalla,
  Docente,
  MaterialRepositorio,
  ResenaDocente,
} from "../../types/portal";

interface AdminRepositorioTabProps {
  resenasDocentes: ResenaDocente[];
  docentes: Docente[];
  materialesPendientes: MaterialRepositorio[];
  materialesAprobados: MaterialRepositorio[];
  malla: CursoMalla[];
  carreras: Carrera[];
  handleCambiarEstadoResenaAdmin: (
    resenaId: string,
    nuevoEstado: "aprobado" | "pendiente"
  ) => Promise<void> | void;
  handleEliminarResenaDocenteAdmin: (resenaId: string) => Promise<void> | void;
  handleAprobarMaterialAdmin: (id: string) => Promise<void> | void;
  handleEliminarMaterialAdmin: (id: string) => Promise<void> | void;
}

export function AdminRepositorioTab({
  resenasDocentes,
  docentes,
  materialesPendientes,
  materialesAprobados,
  malla,
  carreras,
  handleCambiarEstadoResenaAdmin,
  handleEliminarResenaDocenteAdmin,
  handleAprobarMaterialAdmin,
  handleEliminarMaterialAdmin,
}: AdminRepositorioTabProps) {
  return (
    <div className="space-y-8 view-transition-gpu">
      {/* SECCIÓN 1: MODERACIÓN DE RESEÑAS Y CALIFICACIONES DE DOCENTES */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="bg-[#002855] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-2 border-b-2 border-red-700">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h3 className="text-sm font-bold">
              Moderación de Calificaciones y Reseñas de Docentes ({resenasDocentes.length})
            </h3>
          </div>
          <span className="text-[11px] text-blue-200">
            Sincronizado en <code className="text-amber-300 font-bold">portal_config.resenas_docentes</code>
          </span>
        </div>

        {resenasDocentes.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Star className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Aún no se han registrado reseñas de docentes.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4">Docente Evaluado</th>
                  <th className="py-3 px-4">Calificación</th>
                  <th className="py-3 px-4">Curso / Autor</th>
                  <th className="py-3 px-4">Comentario de la Reseña</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {resenasDocentes.map((resena) => {
                  const docInfo = docentes.find((d) => d.id === resena.docente_id);
                  return (
                    <tr key={resena.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-[#002855] dark:text-blue-300">
                        {docInfo
                          ? `${docInfo.grado_academico} ${docInfo.nombre_completo}`
                          : resena.docente_id}
                        <div className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                          {resena.fecha}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 font-bold text-amber-800 dark:text-amber-300">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>{resena.puntuacion}.0</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 dark:text-white">{resena.curso}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Por: {resena.autor_alias}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed line-clamp-3">
                          {resena.comentario}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        {resena.estado === "aprobado" ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold uppercase">
                            Pública
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold uppercase">
                            Oculta / Pendiente
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        {resena.estado === "pendiente" ? (
                          <button
                            type="button"
                            onClick={() => handleCambiarEstadoResenaAdmin(resena.id, "aprobado")}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold cursor-pointer"
                          >
                            ✅ Aprobar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCambiarEstadoResenaAdmin(resena.id, "pendiente")}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold cursor-pointer"
                          >
                            ⏸️ Ocultar
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEliminarResenaDocenteAdmin(resena.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-700 text-red-700 dark:text-red-400 hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: MODERACIÓN DE ARCHIVOS DEL REPOSITORIO PENDIENTES */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="bg-slate-100 dark:bg-slate-950 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#002855] dark:text-white">
            Archivos del Repositorio Pendientes de Aprobación ({materialesPendientes.length})
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Sincronizado en{" "}
            <code className="font-bold text-[#002855] dark:text-blue-300">
              portal_config.materiales_data
            </code>
          </span>
        </div>
        {materialesPendientes.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No hay archivos pendientes de moderación
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#002855] dark:bg-slate-950 text-white uppercase text-[11px] border-b dark:border-slate-800">
                  <th className="py-3.5 px-4">Material</th>
                  <th className="py-3.5 px-4">Carrera / Curso</th>
                  <th className="py-3.5 px-4">Docente / Autor</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {materialesPendientes.map((m) => {
                  const curso = malla.find((c) => c.id === m.curso_id);
                  const carrera = carreras.find((ca) => ca.id === m.carrera_id);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-4">
                        <p className="font-bold text-[#002855] dark:text-blue-300">{m.titulo}</p>
                        <a
                          href={m.url_archivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-red-700 dark:text-red-400 hover:underline font-mono"
                        >
                          Ver enlace del archivo ↗
                        </a>
                      </td>
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                        {carrera?.nombre} • [{curso?.codigo || m.curso_id}]{" "}
                        {curso?.nombre_curso || `Ciclo ${m.ciclo}`}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800 dark:text-white">{m.docente}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Por: {m.autor_alias} ({m.fecha_subida})
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={() => handleAprobarMaterialAdmin(m.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#002855] hover:bg-blue-900 text-white font-bold cursor-pointer"
                        >
                          ✅ Aprobar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEliminarMaterialAdmin(m.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold cursor-pointer"
                        >
                          ❌ Rechazar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECCIÓN 3: ARCHIVOS APROBADOS PUBLICADOS EN EL REPOSITORIO */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="bg-slate-100 dark:bg-slate-950 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#002855] dark:text-white">
            Materiales Publicados en el Repositorio ({materialesAprobados.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Título del Material</th>
                <th className="py-3 px-4">Escuela / Asignatura</th>
                <th className="py-3 px-4">Docente</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {materialesAprobados.map((m) => {
                const curso = malla.find((c) => c.id === m.curso_id);
                const carrera = carreras.find((ca) => ca.id === m.carrera_id);
                return (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200"
                  >
                    <td className="py-3 px-4 font-bold text-[#002855] dark:text-blue-300">
                      {m.titulo}
                    </td>
                    <td className="py-3 px-4">
                      {carrera?.nombre} • [{curso?.codigo || m.curso_id}]{" "}
                      {curso?.nombre_curso || `Ciclo ${m.ciclo}`}
                    </td>
                    <td className="py-3 px-4">{m.docente}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleEliminarMaterialAdmin(m.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-700 text-red-700 dark:text-red-400 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
