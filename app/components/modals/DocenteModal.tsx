"use client";

import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  Star,
} from "lucide-react";
import type { Carrera, Docente, ResenaDocente } from "@/app/types/portal";
import { TEMA_CARRERA } from "@/app/data/portalInitialData";
import {
  formatearFechaEspanol,
  obtenerInicialesDocente,
  sanitizarTextoEnriquecido,
} from "@/app/utils/portalFormatters";

interface FormResenaDocenteState {
  puntuacion: number;
  curso: string;
  autor_alias: string;
  esAnonimo: boolean;
  comentario: string;
  bot_trap: string;
}

interface EstadisticasDocenteResult {
  promedio: number;
  total: number;
  aprobadas: ResenaDocente[];
  distribucion: { estrellas: number; cantidad: number; porcentaje: number }[];
}

interface DocenteModalProps {
  docenteModalActivo: Docente | null;
  onCerrar: () => void;
  carreras: Carrera[];
  obtenerEstadisticasDocente: (docenteId: string) => EstadisticasDocenteResult;
  hoverEstrellaDocente: number;
  setHoverEstrellaDocente: (v: number) => void;
  formResenaDocente: FormResenaDocenteState;
  setFormResenaDocente: React.Dispatch<React.SetStateAction<FormResenaDocenteState>>;
  errorResenaDocente: string;
  exitoResenaDocente: boolean;
  handleEnviarResenaDocente: (e: React.FormEvent) => void;
}

const ETIQUETAS_ESTRELLAS: Record<number, string> = {
  1: "1★ • Necesita mejorar metodología",
  2: "2★ • Regular / Poco claro",
  3: "3★ • Buen docente / Cumple el sílabo",
  4: "4★ • Muy buen docente / Recomendado",
  5: "5★ • Excelente cátedra y dominio académico",
};

export function DocenteModal({
  docenteModalActivo,
  onCerrar,
  carreras,
  obtenerEstadisticasDocente,
  hoverEstrellaDocente,
  setHoverEstrellaDocente,
  formResenaDocente,
  setFormResenaDocente,
  errorResenaDocente,
  exitoResenaDocente,
  handleEnviarResenaDocente,
}: DocenteModalProps) {
  if (!docenteModalActivo) return null;

  const statsModal = obtenerEstadisticasDocente(docenteModalActivo.id);
  const estrellaActiva = hoverEstrellaDocente || formResenaDocente.puntuacion;
  const temaDoc = TEMA_CARRERA[docenteModalActivo.carrera_id];

  return (
    <div
      onClick={onCerrar}
      className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto modal-backdrop-gpu"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-3xl w-full max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-[#002855] dark:border-blue-800 bg-white dark:bg-slate-900 shadow-2xl modal-panel-gpu"
      >
        <div
          className={`${temaDoc.headerBg} text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 ${temaDoc.borderAccent} sticky top-0 z-10`}
        >
          <div className="flex items-center gap-4">
            {docenteModalActivo.foto_url ? (
              <img
                src={docenteModalActivo.foto_url}
                alt={docenteModalActivo.nombre_completo}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/80 shadow-md shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-black/30 border-2 border-white/60 flex items-center justify-center text-2xl font-bold text-white shrink-0">
                {obtenerInicialesDocente(docenteModalActivo.nombre_completo)}
              </div>
            )}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-black/30 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                  Escuela de {carreras.find((c) => c.id === docenteModalActivo.carrera_id)?.nombre}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-white/20 text-[10px] font-bold text-white">
                  Docente {docenteModalActivo.categoria_docente} • {docenteModalActivo.condicion}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/60 text-[11px] font-bold text-amber-200">
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>
                    {statsModal.total > 0
                      ? `${statsModal.promedio.toFixed(1)} / 5.0 (${statsModal.total})`
                      : "Sin calificaciones aún"}
                  </span>
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {docenteModalActivo.grado_academico} {docenteModalActivo.nombre_completo}
              </h3>
              <p className="text-xs text-white/90 font-mono">{docenteModalActivo.correo}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-black/25 hover:bg-black/40 text-xs font-bold text-white cursor-pointer shrink-0 gpu-btn"
          >
            ✕ Cerrar
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${temaDoc.textAccent} dark:text-blue-400`}>
              Área de Especialidad Académica
            </h4>
            <p className="text-slate-800 dark:text-slate-100 font-semibold leading-relaxed">
              {docenteModalActivo.especialidad}
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${temaDoc.textAccent} dark:text-blue-400`}>
              Líneas de Investigación Activas
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {docenteModalActivo.lineas_investigacion}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${temaDoc.textAccent} dark:text-blue-400`}>
              Asignaturas a su Cargo
            </h4>
            <div className="flex flex-wrap gap-2">
              {docenteModalActivo.cursos_dictados.map((cursoStr, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border ${temaDoc.badgeSoft}`}
                >
                  {cursoStr}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 text-xs">
            <div className="flex items-start gap-2.5">
              <Mail className={`w-4 h-4 shrink-0 mt-0.5 ${temaDoc.textAccent} dark:text-blue-400`} />
              <div>
                <p className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                  Correo Institucional
                </p>
                <p className="font-mono font-bold text-slate-900 dark:text-white break-all">
                  {docenteModalActivo.correo}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className={`w-4 h-4 shrink-0 mt-0.5 ${temaDoc.textAccent} dark:text-blue-400`} />
              <div>
                <p className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                  Horario de Asesoría
                </p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {docenteModalActivo.horario_asesoria}
                </p>
              </div>
            </div>
          </div>

          {(docenteModalActivo.cti_vitae_url ||
            docenteModalActivo.orcid_url ||
            docenteModalActivo.google_scholar_url ||
            docenteModalActivo.linkedin_url) && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Perfiles Científicos e Investigación:
              </span>
              <div className="flex flex-wrap gap-2">
                {docenteModalActivo.cti_vitae_url && (
                  <a
                    href={docenteModalActivo.cti_vitae_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 gpu-btn"
                  >
                    <span>CTI Vitae</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {docenteModalActivo.orcid_url && (
                  <a
                    href={docenteModalActivo.orcid_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 gpu-btn"
                  >
                    <span>ORCID</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {docenteModalActivo.google_scholar_url && (
                  <a
                    href={docenteModalActivo.google_scholar_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 gpu-btn"
                  >
                    <span>Google Scholar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {docenteModalActivo.linkedin_url && (
                  <a
                    href={docenteModalActivo.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-950 text-white text-xs font-bold flex items-center gap-1.5 gpu-btn"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* CALIFICACIONES Y OPINIONES ESTUDIANTILES */}
          <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h4 className="text-base font-bold text-[#002855] dark:text-white">
                  ⭐ Calificaciones y Opiniones Estudiantiles
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Comunidad Estudiantil FCM - UNMSM
              </span>
            </div>

            {/* 1. RESUMEN GENERAL + DISTRIBUCIÓN DE ESTRELLAS */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-5">
              <div className="sm:col-span-5 text-center sm:border-r border-slate-200 dark:border-slate-700 sm:pr-4 space-y-1.5">
                <div className="text-3xl sm:text-4xl font-bold text-[#002855] dark:text-white">
                  {statsModal.total > 0 ? statsModal.promedio.toFixed(1) : "—"}
                  <span className="text-lg font-bold text-slate-400"> / 5.0</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((starIndex) => {
                    const rellena =
                      statsModal.total > 0 && starIndex <= Math.round(statsModal.promedio);
                    return (
                      <Star
                        key={starIndex}
                        className={`w-5 h-5 ${
                          rellena ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  {statsModal.total > 0
                    ? `Basado en ${statsModal.total} ${
                        statsModal.total === 1 ? "reseña" : "reseñas"
                      } de estudiantes`
                    : "Aún sin calificaciones registradas"}
                </p>
              </div>

              <div className="sm:col-span-7 space-y-2">
                {statsModal.distribucion.map((fila) => (
                  <div key={fila.estrellas} className="flex items-center gap-2.5 text-xs">
                    <span className="w-8 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-0.5 shrink-0">
                      {fila.estrellas} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </span>
                    <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${fila.porcentaje}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      {fila.porcentaje}% ({fila.cantidad})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. FORMULARIO DE ENVÍO DE RESEÑA */}
            <form
              onSubmit={handleEnviarResenaDocente}
              className="rounded-2xl border-2 border-blue-900/15 dark:border-slate-700 bg-blue-50/35 dark:bg-slate-800/40 p-5 space-y-4"
            >
              <input
                type="text"
                name="bot_trap_review"
                value={formResenaDocente.bot_trap}
                onChange={(e) =>
                  setFormResenaDocente((prev) => ({ ...prev, bot_trap: e.target.value }))
                }
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                style={{ display: "none" }}
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-xs sm:text-sm font-bold text-[#002855] dark:text-white">
                  Califica al docente y comparte tu experiencia académica
                </h5>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
                  {ETIQUETAS_ESTRELLAS[estrellaActiva]}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Selecciona tu calificación (1 a 5 estrellas) *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((valor) => {
                    const iluminada = valor <= estrellaActiva;
                    return (
                      <button
                        key={valor}
                        type="button"
                        onMouseEnter={() => setHoverEstrellaDocente(valor)}
                        onMouseLeave={() => setHoverEstrellaDocente(0)}
                        onClick={() =>
                          setFormResenaDocente((prev) => ({ ...prev, puntuacion: valor }))
                        }
                        aria-label={`Calificar con ${valor} estrellas`}
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:scale-110 transition-all cursor-pointer shadow-2xs gpu-btn"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            iluminada
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-bold text-[#002855] dark:text-blue-300">
                    {formResenaDocente.puntuacion}.0 / 5.0
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Asignatura cursada con el docente *
                  </label>
                  <select
                    value={formResenaDocente.curso}
                    onChange={(e) =>
                      setFormResenaDocente((prev) => ({ ...prev, curso: e.target.value }))
                    }
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white"
                  >
                    {docenteModalActivo.cursos_dictados.map((c, idx) => (
                      <option key={idx} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Otro curso de la Escuela">Otro curso de la Escuela</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Tu Nombre o Alias
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#002855] dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formResenaDocente.esAnonimo}
                        onChange={(e) =>
                          setFormResenaDocente((prev) => ({
                            ...prev,
                            esAnonimo: e.target.checked,
                          }))
                        }
                        className="rounded border-slate-300"
                      />
                      <span>Publicar como Anónimo</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={formResenaDocente.esAnonimo}
                    value={
                      formResenaDocente.esAnonimo
                        ? "Estudiante Anónimo FCM"
                        : formResenaDocente.autor_alias
                    }
                    onChange={(e) =>
                      setFormResenaDocente((prev) => ({ ...prev, autor_alias: e.target.value }))
                    }
                    placeholder="Ej. Alumno de 5to Ciclo / Estudiante FCM"
                    className="w-full rounded-xl bg-white dark:bg-slate-900 disabled:bg-slate-100 dark:disabled:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  ¿Por qué das esta calificación? (Metodología, exigencia, puntualidad, consejos) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formResenaDocente.comentario}
                  onChange={(e) =>
                    setFormResenaDocente((prev) => ({ ...prev, comentario: e.target.value }))
                  }
                  placeholder="¿Por qué das esta calificación? Describe la metodología, nivel de exigencia, puntualidad o recomendaciones para futuros alumnos..."
                  className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              {errorResenaDocente && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorResenaDocente}</span>
                </div>
              )}

              {exitoResenaDocente && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>
                    ¡Reseña publicada con éxito! Tu valoración ya forma parte del promedio del docente.
                  </span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer gpu-btn"
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Enviar Reseña del Docente</span>
                </button>
              </div>
            </form>

            {/* 3. MURO DE RESEÑAS PÚBLICAS DEL DOCENTE */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Opiniones de Estudiantes ({statsModal.total})
              </h5>

              {statsModal.aprobadas.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-6 text-center space-y-1.5">
                  <Star className="w-7 h-7 text-amber-400 mx-auto" />
                  <p className="text-xs font-bold text-[#002855] dark:text-white">
                    Este docente aún no tiene reseñas registradas
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    ¡Sé el primer estudiante de la FCM en calificar y dejar una recomendación!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {statsModal.aprobadas.map((resena) => (
                    <div
                      key={resena.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 p-4 shadow-2xs space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= resena.puntuacion
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-200 dark:text-slate-700"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-[#002855] dark:text-white">
                            {sanitizarTextoEnriquecido(resena.autor_alias)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${temaDoc.badgeSoft}`}
                          >
                            {sanitizarTextoEnriquecido(resena.curso)}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {formatearFechaEspanol(resena.fecha)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {sanitizarTextoEnriquecido(resena.comentario)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
