"use client";

import React from "react";
import { Upload } from "lucide-react";
import { Carrera, CarreraId, CursoMalla } from "../../types/portal";

export interface FormCursoMallaState {
  id: string;
  carrera_id: CarreraId;
  ciclo: number;
  codigo: string;
  nombre_curso: string;
  creditos: number;
  tipo_curso: "O" | "E";
  prerequisitosTexto: string;
}

interface AdminMallaTabProps {
  mode: "carreras_cms" | "malla";
  carreras: Carrera[];
  malla: CursoMalla[];
  adminCarreraEditId: CarreraId;
  carreraAdminSeleccionada: Carrera;
  handleSeleccionarCarreraEnAdmin: (cId: CarreraId) => void;
  handleGuardarDatosCarreraAdmin: (e: React.FormEvent) => Promise<void> | void;
  inputImagenCarreraRef: React.RefObject<HTMLInputElement | null>;
  subiendoAssetCarrera: boolean;
  handleSubirImagenCarreraStorage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  urlImagenCarreraInput: string;
  setUrlImagenCarreraInput: React.Dispatch<React.SetStateAction<string>>;
  inputTripticoPdfRef: React.RefObject<HTMLInputElement | null>;
  handleSubirTripticoPdfStorage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  urlTripticoCarreraInput: string;
  setUrlTripticoCarreraInput: React.Dispatch<React.SetStateAction<string>>;
  inputPosterPdfRef: React.RefObject<HTMLInputElement | null>;
  handleSubirPosterPdfStorage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  urlPosterCarreraInput: string;
  setUrlPosterCarreraInput: React.Dispatch<React.SetStateAction<string>>;
  navegarACarrera: (cId: CarreraId) => void;
  formCursoMalla: FormCursoMallaState;
  setFormCursoMalla: React.Dispatch<React.SetStateAction<FormCursoMallaState>>;
  handleGuardarCursoMalla: (e: React.FormEvent) => Promise<void> | void;
  adminFiltroCarreraMalla: CarreraId;
  setAdminFiltroCarreraMalla: React.Dispatch<React.SetStateAction<CarreraId>>;
}

export function AdminMallaTab({
  mode,
  carreras,
  malla,
  adminCarreraEditId,
  carreraAdminSeleccionada,
  handleSeleccionarCarreraEnAdmin,
  handleGuardarDatosCarreraAdmin,
  inputImagenCarreraRef,
  subiendoAssetCarrera,
  handleSubirImagenCarreraStorage,
  urlImagenCarreraInput,
  setUrlImagenCarreraInput,
  inputTripticoPdfRef,
  handleSubirTripticoPdfStorage,
  urlTripticoCarreraInput,
  setUrlTripticoCarreraInput,
  inputPosterPdfRef,
  handleSubirPosterPdfStorage,
  urlPosterCarreraInput,
  setUrlPosterCarreraInput,
  navegarACarrera,
  formCursoMalla,
  setFormCursoMalla,
  handleGuardarCursoMalla,
  adminFiltroCarreraMalla,
  setAdminFiltroCarreraMalla,
}: AdminMallaTabProps) {
  if (mode === "carreras_cms") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 view-transition-gpu">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          <h3 className="text-lg font-bold text-[#002855] dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            Actualizar Imagen Referencial, Tríptico y Póster de Estudios por Carrera
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {carreras.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSeleccionarCarreraEnAdmin(c.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  adminCarreraEditId === c.id
                    ? "bg-[#002855] text-white border-[#002855] dark:bg-blue-600 dark:border-blue-600"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>

          <form onSubmit={handleGuardarDatosCarreraAdmin} className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#002855] dark:text-slate-200">
                  Imagen Referencial de {carreraAdminSeleccionada.nombre}
                </label>
                <button
                  type="button"
                  onClick={() => inputImagenCarreraRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#002855] hover:bg-blue-900 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />{" "}
                  {subiendoAssetCarrera ? "Subiendo..." : "Subir Imagen (Storage)"}
                </button>
                <input
                  ref={inputImagenCarreraRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSubirImagenCarreraStorage}
                  className="hidden"
                />
              </div>
              <input
                type="url"
                value={urlImagenCarreraInput}
                onChange={(e) => setUrlImagenCarreraInput(e.target.value)}
                placeholder="URL pública de la imagen referencial..."
                className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-4 rounded-2xl bg-red-50/40 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-red-800 dark:text-red-300">
                  Archivo PDF del Tríptico de {carreraAdminSeleccionada.nombre}
                </label>
                <button
                  type="button"
                  onClick={() => inputTripticoPdfRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" /> Subir PDF (Storage)
                </button>
                <input
                  ref={inputTripticoPdfRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleSubirTripticoPdfStorage}
                  className="hidden"
                />
              </div>
              <input
                type="url"
                value={urlTripticoCarreraInput}
                onChange={(e) => setUrlTripticoCarreraInput(e.target.value)}
                placeholder="URL del PDF del Tríptico en Supabase Storage..."
                className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-blue-900 dark:text-blue-300">
                  Archivo PDF del Póster de Estudios de {carreraAdminSeleccionada.nombre}
                </label>
                <button
                  type="button"
                  onClick={() => inputPosterPdfRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#002855] hover:bg-blue-900 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" /> Subir PDF (Storage)
                </button>
                <input
                  ref={inputPosterPdfRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleSubirPosterPdfStorage}
                  className="hidden"
                />
              </div>
              <input
                type="url"
                value={urlPosterCarreraInput}
                onChange={(e) => setUrlPosterCarreraInput(e.target.value)}
                placeholder="URL del PDF del Póster en Supabase Storage..."
                className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="gpu-btn flex-1 py-3 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer"
              >
                Guardar en Supabase ({carreraAdminSeleccionada.nombre})
              </button>
              <button
                type="button"
                onClick={() => navegarACarrera(adminCarreraEditId)}
                className="gpu-btn px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#002855] dark:text-blue-300 cursor-pointer"
              >
                Ver Carrera →
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 h-fit">
          <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
            Vista Previa ({carreraAdminSeleccionada.nombre})
          </h4>
          <img
            src={carreraAdminSeleccionada.imagen_referencial_url}
            alt={carreraAdminSeleccionada.nombre}
            className="w-full h-60 object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-800"
          />
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {carreraAdminSeleccionada.vision_carrera}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 view-transition-gpu">
      <form
        onSubmit={handleGuardarCursoMalla}
        className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 h-fit"
      >
        <h3 className="font-bold text-sm text-[#002855] dark:text-white">
          Añadir Asignatura a la Malla
        </h3>
        <select
          value={formCursoMalla.carrera_id}
          onChange={(e) =>
            setFormCursoMalla({ ...formCursoMalla, carrera_id: e.target.value as CarreraId })
          }
          className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs"
        >
          {carreras.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={1}
            max={10}
            value={formCursoMalla.ciclo}
            onChange={(e) => setFormCursoMalla({ ...formCursoMalla, ciclo: Number(e.target.value) })}
            className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs"
          />
          <input
            type="text"
            required
            value={formCursoMalla.codigo}
            onChange={(e) => setFormCursoMalla({ ...formCursoMalla, codigo: e.target.value })}
            placeholder="Código (ej. CS399)"
            className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs"
          />
        </div>
        <input
          type="text"
          required
          value={formCursoMalla.nombre_curso}
          onChange={(e) => setFormCursoMalla({ ...formCursoMalla, nombre_curso: e.target.value })}
          placeholder="Nombre de la asignatura *"
          className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs"
        />
        <button
          type="submit"
          className="gpu-btn w-full py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer"
        >
          Guardar en la Malla
        </button>
      </form>

      <div className="lg:col-span-8 space-y-3">
        <div className="flex flex-wrap gap-2">
          {carreras.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setAdminFiltroCarreraMalla(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                adminFiltroCarreraMalla === c.id
                  ? "bg-[#002855] text-white"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
              }`}
            >
              {c.nombre}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden max-h-96 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#002855] dark:bg-slate-950 text-white border-b dark:border-slate-800">
                <th className="py-2.5 px-4">Ciclo</th>
                <th className="py-2.5 px-4">Código</th>
                <th className="py-2.5 px-4">Asignatura</th>
                <th className="py-2.5 px-4">Créd.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {malla
                .filter((c) => c.carrera_id === adminFiltroCarreraMalla)
                .map((cur) => (
                  <tr
                    key={cur.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 text-slate-900 dark:text-slate-200"
                  >
                    <td className="py-2.5 px-4">Ciclo {cur.ciclo}</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-red-700 dark:text-red-400">
                      {cur.codigo}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {cur.nombre_curso}
                    </td>
                    <td className="py-2.5 px-4">{cur.creditos}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
