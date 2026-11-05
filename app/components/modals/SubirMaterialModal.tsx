"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import type { Carrera, CarreraId, CursoMalla, Docente, TipoArchivo } from "@/app/types/portal";

interface FormSubidaAnonState {
  carrera_id: CarreraId;
  ciclo: number;
  curso_id: string;
  modoDocente: "lista" | "manual";
  docenteSeleccionado: string;
  docenteManual: string;
  titulo: string;
  tipo_archivo: TipoArchivo;
  url_archivo: string;
  autor_alias: string;
  bot_trap: string;
}

interface SubirMaterialModalProps {
  abierto: boolean;
  onCerrar: () => void;
  exitoSubidaModal: boolean;
  formSubidaAnon: FormSubidaAnonState;
  setFormSubidaAnon: React.Dispatch<React.SetStateAction<FormSubidaAnonState>>;
  carreras: Carrera[];
  docentes: Docente[];
  cursosDependientesSubida: CursoMalla[];
  handleCambiarCarreraSubida: (carreraId: CarreraId) => void;
  handleCambiarCicloSubida: (ciclo: number) => void;
  handleSubidaRepositorioAnonima: (e: React.FormEvent) => void;
}

export function SubirMaterialModal({
  abierto,
  onCerrar,
  exitoSubidaModal,
  formSubidaAnon,
  setFormSubidaAnon,
  carreras,
  docentes,
  cursosDependientesSubida,
  handleCambiarCarreraSubida,
  handleCambiarCicloSubida,
  handleSubidaRepositorioAnonima,
}: SubirMaterialModalProps) {
  if (!abierto) return null;

  return (
    <div
      onClick={onCerrar}
      className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto modal-backdrop-gpu"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-xl w-full rounded-3xl border-2 border-[#002855] dark:border-blue-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl modal-panel-gpu"
      >
        <div className="flex items-center justify-between border-b-2 border-red-600 pb-3">
          <h3 className="text-lg font-bold text-[#002855] dark:text-white">
            ➕ Aportar Material al Repositorio FCM
          </h3>
          <button
            type="button"
            onClick={onCerrar}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-400 cursor-pointer gpu-btn"
          >
            ✕ Cerrar
          </button>
        </div>

        {exitoSubidaModal ? (
          <div className="p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-[#002855] dark:text-white">
              ¡Gracias! Tu material será revisado antes de publicarse
            </h4>
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 rounded-xl bg-[#002855] text-xs font-bold text-white cursor-pointer gpu-btn"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubidaRepositorioAnonima} className="space-y-3.5">
            {/* Campo Honeypot Anti-Bot */}
            <input
              type="text"
              name="bot_trap_upload"
              value={formSubidaAnon.bot_trap}
              onChange={(e) => setFormSubidaAnon({ ...formSubidaAnon, bot_trap: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              style={{ display: "none" }}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                required
                value={formSubidaAnon.carrera_id}
                onChange={(e) => handleCambiarCarreraSubida(e.target.value as CarreraId)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {carreras.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              <select
                required
                value={formSubidaAnon.ciclo}
                onChange={(e) => handleCambiarCicloSubida(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Ciclo {num}
                  </option>
                ))}
              </select>
            </div>

            <select
              required
              value={formSubidaAnon.curso_id}
              onChange={(e) => setFormSubidaAnon({ ...formSubidaAnon, curso_id: e.target.value })}
              className="w-full rounded-xl bg-blue-50/60 dark:bg-slate-800 border border-blue-300 dark:border-slate-700 px-3 py-2.5 text-xs font-bold text-[#002855] dark:text-blue-300"
            >
              {cursosDependientesSubida.map((cur) => (
                <option key={cur.id} value={cur.id}>
                  [{cur.codigo}] {cur.nombre_curso}
                </option>
              ))}
            </select>

            {/* SELECTOR DE MODO DOCENTE */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                Docente de la Cátedra *
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setFormSubidaAnon({ ...formSubidaAnon, modoDocente: "lista" })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer gpu-btn ${
                    formSubidaAnon.modoDocente === "lista"
                      ? "bg-[#002855] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#002855] dark:hover:text-white"
                  }`}
                >
                  <span>👨‍🏫</span> Docente Registrado
                </button>
                <button
                  type="button"
                  onClick={() => setFormSubidaAnon({ ...formSubidaAnon, modoDocente: "manual" })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer gpu-btn ${
                    formSubidaAnon.modoDocente === "manual"
                      ? "bg-[#002855] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#002855] dark:hover:text-white"
                  }`}
                >
                  <span>✍️</span> Docente Contratado / Invitado
                </button>
              </div>

              {formSubidaAnon.modoDocente === "lista" ? (
                <select
                  required
                  value={formSubidaAnon.docenteSeleccionado}
                  onChange={(e) =>
                    setFormSubidaAnon({ ...formSubidaAnon, docenteSeleccionado: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-white"
                >
                  {docentes.map((doc) => {
                    const etiqueta = `${doc.grado_academico} ${doc.nombre_completo}`;
                    return (
                      <option key={doc.id} value={etiqueta}>
                        {etiqueta} ({carreras.find((c) => c.id === doc.carrera_id)?.nombre})
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={formSubidaAnon.docenteManual}
                  onChange={(e) =>
                    setFormSubidaAnon({ ...formSubidaAnon, docenteManual: e.target.value })
                  }
                  placeholder="Ej. Mg. Carlos Ramírez Flores (Docente contratado / invitado)"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400"
                />
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <select
                value={formSubidaAnon.tipo_archivo}
                onChange={(e) =>
                  setFormSubidaAnon({ ...formSubidaAnon, tipo_archivo: e.target.value as TipoArchivo })
                }
                className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Examen">Examen</option>
                <option value="Apunte">Apunte</option>
                <option value="Codigo">Código</option>
                <option value="PDF">PDF</option>
                <option value="Silabo">Sílabo</option>
              </select>
              <input
                type="text"
                required
                value={formSubidaAnon.titulo}
                onChange={(e) => setFormSubidaAnon({ ...formSubidaAnon, titulo: e.target.value })}
                placeholder="Título del Material *"
                className="col-span-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input
                type="url"
                required
                value={formSubidaAnon.url_archivo}
                onChange={(e) => setFormSubidaAnon({ ...formSubidaAnon, url_archivo: e.target.value })}
                placeholder="URL (Google Drive / GitHub) *"
                className="col-span-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={formSubidaAnon.autor_alias}
                onChange={(e) => setFormSubidaAnon({ ...formSubidaAnon, autor_alias: e.target.value })}
                placeholder="Alias (Opcional)"
                className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold cursor-pointer gpu-btn"
            >
              Enviar Material a Revisión
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
