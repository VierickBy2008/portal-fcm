"use client";

import React from "react";
import { Upload, Edit3, Trash2 } from "lucide-react";
import { Carrera, CarreraId, Docente } from "../../types/portal";
import { TEMA_CARRERA } from "../../data/portalInitialData";
import { obtenerInicialesDocente } from "../../utils/portalFormatters";

export interface FormDocenteState {
  id: string;
  nombre_completo: string;
  grado_academico: Docente["grado_academico"];
  categoria_docente: Docente["categoria_docente"];
  condicion: Docente["condicion"];
  carrera_id: CarreraId;
  especialidad: string;
  lineas_investigacion: string;
  cursos_dictados_texto: string;
  correo: string;
  horario_asesoria: string;
  foto_url: string;
  cti_vitae_url: string;
  orcid_url: string;
  google_scholar_url: string;
  linkedin_url: string;
}

interface AdminDocentesTabProps {
  carreras: Carrera[];
  docentes: Docente[];
  formDocente: FormDocenteState;
  setFormDocente: React.Dispatch<React.SetStateAction<FormDocenteState>>;
  handleGuardarDocente: (e: React.FormEvent) => Promise<void> | void;
  inputFotoDocenteRef: React.RefObject<HTMLInputElement | null>;
  subiendoFotoDocente: boolean;
  handleSubirFotoDocenteStorage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  adminFiltroCarreraDocentes: "TODAS" | CarreraId;
  setAdminFiltroCarreraDocentes: React.Dispatch<React.SetStateAction<"TODAS" | CarreraId>>;
  handleEditarDocenteEnAdmin: (doc: Docente) => void;
  handleEliminarDocenteEnAdmin: (id: string) => Promise<void> | void;
}

export function AdminDocentesTab({
  carreras,
  docentes,
  formDocente,
  setFormDocente,
  handleGuardarDocente,
  inputFotoDocenteRef,
  subiendoFotoDocente,
  handleSubirFotoDocenteStorage,
  adminFiltroCarreraDocentes,
  setAdminFiltroCarreraDocentes,
  handleEditarDocenteEnAdmin,
  handleEliminarDocenteEnAdmin,
}: AdminDocentesTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start view-transition-gpu">
      <form
        onSubmit={handleGuardarDocente}
        className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3.5"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base text-[#002855] dark:text-white">
            {formDocente.id ? "✏️ Editar Ficha de Docente" : "👨‍🏫 Registrar Docente en la Facultad"}
          </h3>
          {formDocente.id && (
            <button
              type="button"
              onClick={() =>
                setFormDocente({
                  id: "",
                  nombre_completo: "",
                  grado_academico: "Dr.",
                  categoria_docente: "Principal",
                  condicion: "Nombrado",
                  carrera_id: "computacion-cientifica",
                  especialidad: "",
                  lineas_investigacion: "",
                  cursos_dictados_texto: "",
                  correo: "",
                  horario_asesoria: "",
                  foto_url: "",
                  cti_vitae_url: "",
                  orcid_url: "",
                  google_scholar_url: "",
                  linkedin_url: "",
                })
              }
              className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <select
            value={formDocente.grado_academico}
            onChange={(e) =>
              setFormDocente({
                ...formDocente,
                grado_academico: e.target.value as Docente["grado_academico"],
              })
            }
            className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs font-bold focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          >
            <option value="Dr.">Dr.</option>
            <option value="Dra.">Dra.</option>
            <option value="Mg.">Mg.</option>
            <option value="Lic.">Lic.</option>
          </select>
          <input
            type="text"
            required
            value={formDocente.nombre_completo}
            onChange={(e) => setFormDocente({ ...formDocente, nombre_completo: e.target.value })}
            placeholder="Apellidos y Nombres *"
            className="col-span-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs font-bold focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <select
            value={formDocente.carrera_id}
            onChange={(e) =>
              setFormDocente({ ...formDocente, carrera_id: e.target.value as CarreraId })
            }
            className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-2.5 py-2 text-xs font-semibold focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          >
            {carreras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          <select
            value={formDocente.categoria_docente}
            onChange={(e) =>
              setFormDocente({
                ...formDocente,
                categoria_docente: e.target.value as Docente["categoria_docente"],
              })
            }
            className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-2.5 py-2 text-xs font-semibold focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          >
            <option value="Principal">Principal</option>
            <option value="Asociado">Asociado</option>
            <option value="Auxiliar">Auxiliar</option>
          </select>
          <select
            value={formDocente.condicion}
            onChange={(e) =>
              setFormDocente({
                ...formDocente,
                condicion: e.target.value as Docente["condicion"],
              })
            }
            className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-2.5 py-2 text-xs font-semibold focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          >
            <option value="Nombrado">Nombrado</option>
            <option value="Contratado">Contratado</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Fotografía del Docente (o dejar vacío para Avatar)
            </label>
            <button
              type="button"
              onClick={() => inputFotoDocenteRef.current?.click()}
              className="text-[11px] font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3 h-3" /> {subiendoFotoDocente ? "Subiendo..." : "Subir Foto"}
            </button>
            <input
              ref={inputFotoDocenteRef}
              type="file"
              accept="image/*"
              onChange={handleSubirFotoDocenteStorage}
              className="hidden"
            />
          </div>
          <input
            type="url"
            value={formDocente.foto_url}
            onChange={(e) => setFormDocente({ ...formDocente, foto_url: e.target.value })}
            placeholder="URL de la foto (Supabase Storage o externa)..."
            className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          />
        </div>

        <input
          type="text"
          required
          value={formDocente.especialidad}
          onChange={(e) => setFormDocente({ ...formDocente, especialidad: e.target.value })}
          placeholder="Especialidad principal (ej. Optimización Convexa, Deep Learning) *"
          className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
        />

        <textarea
          rows={2}
          value={formDocente.lineas_investigacion}
          onChange={(e) => setFormDocente({ ...formDocente, lineas_investigacion: e.target.value })}
          placeholder="Líneas de investigación activas..."
          className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
        />

        <input
          type="text"
          value={formDocente.cursos_dictados_texto}
          onChange={(e) =>
            setFormDocente({ ...formDocente, cursos_dictados_texto: e.target.value })
          }
          placeholder="Cursos que dicta separados por coma (ej. CS113 - POO II, AI264 - Deep Learning)"
          className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <input
            type="email"
            value={formDocente.correo}
            onChange={(e) => setFormDocente({ ...formDocente, correo: e.target.value })}
            placeholder="Correo (@unmsm.edu.pe)"
            className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          />
          <input
            type="text"
            value={formDocente.horario_asesoria}
            onChange={(e) => setFormDocente({ ...formDocente, horario_asesoria: e.target.value })}
            placeholder="Horario de asesoría"
            className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="url"
            value={formDocente.cti_vitae_url}
            onChange={(e) => setFormDocente({ ...formDocente, cti_vitae_url: e.target.value })}
            placeholder="URL CTI Vitae (CONCYTEC)"
            className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          />
          <input
            type="url"
            value={formDocente.orcid_url}
            onChange={(e) => setFormDocente({ ...formDocente, orcid_url: e.target.value })}
            placeholder="URL ORCID"
            className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          />
          <input
            type="url"
            value={formDocente.google_scholar_url}
            onChange={(e) =>
              setFormDocente({ ...formDocente, google_scholar_url: e.target.value })
            }
            placeholder="URL Google Scholar"
            className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          />
          <input
            type="url"
            value={formDocente.linkedin_url}
            onChange={(e) => setFormDocente({ ...formDocente, linkedin_url: e.target.value })}
            placeholder="URL LinkedIn"
            className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          />
        </div>

        <button
          type="submit"
          className="gpu-btn w-full py-3 rounded-xl bg-[#002855] dark:bg-red-700 hover:bg-blue-900 dark:hover:bg-red-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
        >
          {formDocente.id ? "Guardar Cambios del Docente" : "Registrar Docente en Supabase"}
        </button>
      </form>

      <div className="lg:col-span-7 space-y-4">
        <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl">
          <button
            type="button"
            onClick={() => setAdminFiltroCarreraDocentes("TODAS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
              adminFiltroCarreraDocentes === "TODAS"
                ? "bg-[#002855] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            Todas ({docentes.length})
          </button>
          {carreras.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setAdminFiltroCarreraDocentes(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                adminFiltroCarreraDocentes === c.id
                  ? TEMA_CARRERA[c.id].badgeSolid
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              {c.nombre} ({docentes.filter((d) => d.carrera_id === c.id).length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {docentes
            .filter(
              (d) =>
                adminFiltroCarreraDocentes === "TODAS" ||
                d.carrera_id === adminFiltroCarreraDocentes
            )
            .map((doc) => {
              const temaD = TEMA_CARRERA[doc.carrera_id];
              return (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {doc.foto_url ? (
                      <img
                        src={doc.foto_url}
                        alt={doc.nombre_completo}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-14 h-14 rounded-xl ${temaD.headerBg} text-white font-bold text-sm flex items-center justify-center shrink-0`}
                      >
                        {obtenerInicialesDocente(doc.nombre_completo)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${temaD.badgeSoft}`}
                      >
                        {carreras.find((c) => c.id === doc.carrera_id)?.nombre}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-[#002855] dark:text-white truncate mt-0.5">
                        {doc.grado_academico} {doc.nombre_completo}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {doc.especialidad}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditarDocenteEnAdmin(doc)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-[#002855] dark:text-blue-300 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEliminarDocenteEnAdmin(doc.id)}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-700 hover:text-white cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
