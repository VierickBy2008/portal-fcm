"use client";

import React from "react";
import { FileText, Plus, X } from "lucide-react";
import {
  DocumentoTransparencia,
  ImagenStorage,
} from "../../types/portal";

export type CategoriaTransparencia = DocumentoTransparencia["categoria"];

export interface FormTransparenciaState {
  codigo: string;
  titulo: string;
  categoria: CategoriaTransparencia;
  anio: number;
  dependencia: string;
  fecha: string;
  tamano_archivo: string;
  url_pdf: string;
  sumilla: string;
}

interface AdminTransparenciaTabProps {
  documentosTransparencia: DocumentoTransparencia[];
  setDocumentosTransparencia: React.Dispatch<
    React.SetStateAction<DocumentoTransparencia[]>
  >;
  formTransparencia: FormTransparenciaState;
  setFormTransparencia: React.Dispatch<React.SetStateAction<FormTransparenciaState>>;
  editandoTransparenciaId: string | null;
  setEditandoTransparenciaId: React.Dispatch<React.SetStateAction<string | null>>;
  modalTransparenciaFormAbierto: boolean;
  setModalTransparenciaFormAbierto: React.Dispatch<React.SetStateAction<boolean>>;
  imagenesStorage: ImagenStorage[];
  sincronizarPortalConfigSupabase: (payload: Record<string, unknown>) => Promise<boolean>;
  lanzarToast: (msg: string) => void;
}

export function AdminTransparenciaTab({
  documentosTransparencia,
  setDocumentosTransparencia,
  formTransparencia,
  setFormTransparencia,
  editandoTransparenciaId,
  setEditandoTransparenciaId,
  modalTransparenciaFormAbierto,
  setModalTransparenciaFormAbierto,
  imagenesStorage,
  sincronizarPortalConfigSupabase,
  lanzarToast,
}: AdminTransparenciaTabProps) {
  return (
    <div className="space-y-6 view-transition-gpu">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#002855] dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-700 dark:text-red-400" />
            Gestor de Documentos Oficiales y Resoluciones FCM
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publica, edita y retira Resoluciones Decanales, Rectorales, POI y Memorias. Sincronizado en{" "}
            <code className="text-red-600 dark:text-red-400 font-bold">
              portal_config.transparencia_data
            </code>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditandoTransparenciaId(null);
            setFormTransparencia({
              codigo: "R.D. Nº ",
              titulo: "",
              categoria: "Resoluciones Decanales",
              anio: 2026,
              dependencia: "Decanato FCM",
              fecha: new Date().toISOString().slice(0, 10),
              tamano_archivo: "1.5 MB",
              url_pdf: "https://matematicas.unmsm.edu.pe",
              sumilla: "",
            });
            setModalTransparenciaFormAbierto(true);
          }}
          className="gpu-btn px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-2 shrink-0 cursor-pointer shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>➕ Nueva Resolución / Documento Oficial</span>
        </button>
      </div>

      {/* Lista de Documentos en Admin */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {documentosTransparencia.map((doc) => (
          <div
            key={doc.id}
            className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/60">
                  {doc.codigo}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#002855] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {doc.categoria}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  • Año {doc.anio} • {doc.fecha} • {doc.dependencia}
                </span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                {doc.titulo}
              </h4>
              {doc.sumilla && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {doc.sumilla}
                </p>
              )}
              <div className="text-[10px] text-slate-400 font-mono">
                PDF:{" "}
                <a
                  href={doc.url_pdf}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  {doc.url_pdf}
                </a>{" "}
                ({doc.tamano_archivo})
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditandoTransparenciaId(doc.id);
                  setFormTransparencia({
                    codigo: doc.codigo,
                    titulo: doc.titulo,
                    categoria: doc.categoria,
                    anio: doc.anio,
                    dependencia: doc.dependencia,
                    fecha: doc.fecha,
                    tamano_archivo: doc.tamano_archivo,
                    url_pdf: doc.url_pdf,
                    sumilla: doc.sumilla || "",
                  });
                  setModalTransparenciaFormAbierto(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 hover:bg-[#002855] hover:text-white text-[#002855] dark:text-blue-300 font-bold text-xs transition-colors cursor-pointer border border-blue-200 dark:border-slate-700"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (
                    window.confirm(
                      `¿Estás seguro de eliminar el documento "${doc.codigo} - ${doc.titulo}" del portal de transparencia?`
                    )
                  ) {
                    const actualizados = documentosTransparencia.filter(
                      (x) => x.id !== doc.id
                    );
                    setDocumentosTransparencia(actualizados);
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem(
                        "fcm_transparencia_data",
                        JSON.stringify(actualizados)
                      );
                    }
                    const metaTrans = {
                      id: "__fcm_transparencia_config__",
                      transparencia_items: actualizados,
                    };
                    const storageFiltrado = imagenesStorage.filter(
                      (x) => x.id !== "__fcm_transparencia_config__"
                    );
                    const nuevoStorage = [
                      ...storageFiltrado,
                      metaTrans as unknown as ImagenStorage,
                    ];
                    await sincronizarPortalConfigSupabase({
                      transparencia_data: actualizados,
                      storage_data: nuevoStorage,
                    });
                    lanzarToast("🗑️ Documento eliminado del Portal de Transparencia.");
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 hover:bg-red-700 hover:text-white text-red-700 dark:text-red-300 font-bold text-xs transition-colors cursor-pointer border border-red-200 dark:border-red-800"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PARA CREAR O EDITAR DOCUMENTOS DE TRANSPARENCIA */}
      {modalTransparenciaFormAbierto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto modal-backdrop-gpu">
          <div className="modal-panel-gpu bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-[#002855] dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-700 dark:text-red-400" />
                {editandoTransparenciaId
                  ? "Editar Documento de Transparencia"
                  : "Nuevo Documento Normativo / Resolución"}
              </h3>
              <button
                type="button"
                onClick={() => setModalTransparenciaFormAbierto(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!formTransparencia.codigo.trim() || !formTransparencia.titulo.trim()) {
                  lanzarToast("⚠️ El código y el título del documento son obligatorios.");
                  return;
                }

                const docCompleto: DocumentoTransparencia = {
                  id: editandoTransparenciaId || `trans-${Date.now()}`,
                  codigo: formTransparencia.codigo.trim(),
                  titulo: formTransparencia.titulo.trim(),
                  categoria: formTransparencia.categoria || "Resoluciones Decanales",
                  anio: Number(formTransparencia.anio) || 2026,
                  dependencia: formTransparencia.dependencia.trim() || "Decanato FCM",
                  fecha:
                    formTransparencia.fecha || new Date().toISOString().slice(0, 10),
                  tamano_archivo: formTransparencia.tamano_archivo.trim() || "1.5 MB",
                  url_pdf:
                    formTransparencia.url_pdf.trim() || "https://matematicas.unmsm.edu.pe",
                  sumilla: formTransparencia.sumilla.trim(),
                };

                let actualizados: DocumentoTransparencia[];
                if (editandoTransparenciaId) {
                  actualizados = documentosTransparencia.map((d) =>
                    d.id === editandoTransparenciaId ? docCompleto : d
                  );
                } else {
                  actualizados = [docCompleto, ...documentosTransparencia];
                }

                setDocumentosTransparencia(actualizados);
                if (typeof window !== "undefined") {
                  window.localStorage.setItem(
                    "fcm_transparencia_data",
                    JSON.stringify(actualizados)
                  );
                }

                const metaTrans = {
                  id: "__fcm_transparencia_config__",
                  transparencia_items: actualizados,
                };
                const storageFiltrado = imagenesStorage.filter(
                  (x) => x.id !== "__fcm_transparencia_config__"
                );
                const nuevoStorage = [
                  ...storageFiltrado,
                  metaTrans as unknown as ImagenStorage,
                ];

                const exito = await sincronizarPortalConfigSupabase({
                  transparencia_data: actualizados,
                  storage_data: nuevoStorage,
                });

                setModalTransparenciaFormAbierto(false);
                setEditandoTransparenciaId(null);
                lanzarToast(
                  exito
                    ? "✅ Documento de Transparencia guardado y sincronizado en Supabase."
                    : "✅ Guardado localmente y en caché del portal."
                );
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                    Código Oficial (ej. R.D. Nº 0488-D-FCM-2026):
                  </label>
                  <input
                    type="text"
                    required
                    value={formTransparencia.codigo}
                    onChange={(e) =>
                      setFormTransparencia({ ...formTransparencia, codigo: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                    Categoría Normativa:
                  </label>
                  <select
                    value={formTransparencia.categoria}
                    onChange={(e) =>
                      setFormTransparencia({
                        ...formTransparencia,
                        categoria: e.target.value as CategoriaTransparencia,
                      })
                    }
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                  >
                    <option value="Resoluciones Decanales">Resoluciones Decanales</option>
                    <option value="Resoluciones Rectorales">Resoluciones Rectorales</option>
                    <option value="Plan Operativo Institucional (POI)">
                      Plan Operativo Institucional (POI)
                    </option>
                    <option value="Memorias de Gestión">Memorias de Gestión</option>
                    <option value="Balances y Presupuesto">Balances y Presupuesto</option>
                    <option value="Actas de Consejo de Facultad">
                      Actas de Consejo de Facultad
                    </option>
                    <option value="Convenios y Alianzas">Convenios y Alianzas</option>
                    <option value="Anuncios y Convocatorias">Anuncios y Convocatorias</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                  Título del Documento / Asunto:
                </label>
                <input
                  type="text"
                  required
                  value={formTransparencia.titulo}
                  onChange={(e) =>
                    setFormTransparencia({ ...formTransparencia, titulo: e.target.value })
                  }
                  placeholder="Ej: Aprobación del Cronograma de Matrícula y Actualización Curricular 2026"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                    Año:
                  </label>
                  <input
                    type="number"
                    required
                    value={formTransparencia.anio}
                    onChange={(e) =>
                      setFormTransparencia({
                        ...formTransparencia,
                        anio: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                    Fecha Oficial:
                  </label>
                  <input
                    type="date"
                    required
                    value={formTransparencia.fecha}
                    onChange={(e) =>
                      setFormTransparencia({ ...formTransparencia, fecha: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                    Tamaño (ej. 2.4 MB):
                  </label>
                  <input
                    type="text"
                    required
                    value={formTransparencia.tamano_archivo}
                    onChange={(e) =>
                      setFormTransparencia({
                        ...formTransparencia,
                        tamano_archivo: e.target.value,
                      })
                    }
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                    Dependencia Emisora:
                  </label>
                  <input
                    type="text"
                    required
                    value={formTransparencia.dependencia}
                    onChange={(e) =>
                      setFormTransparencia({
                        ...formTransparencia,
                        dependencia: e.target.value,
                      })
                    }
                    placeholder="Ej: Decanato FCM, Consejo de Facultad..."
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                    URL del Archivo PDF:
                  </label>
                  <input
                    type="url"
                    required
                    value={formTransparencia.url_pdf}
                    onChange={(e) =>
                      setFormTransparencia({ ...formTransparencia, url_pdf: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                  Sumilla / Resumen del Documento:
                </label>
                <textarea
                  rows={3}
                  value={formTransparencia.sumilla}
                  onChange={(e) =>
                    setFormTransparencia({ ...formTransparencia, sumilla: e.target.value })
                  }
                  placeholder="Breve descripción o resumen de la resolución..."
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalTransparenciaFormAbierto(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="gpu-btn px-5 py-2 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer"
                >
                  Guardar Documento Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
