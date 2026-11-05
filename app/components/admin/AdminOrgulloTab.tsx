"use client";

import React from "react";
import { Trophy, Plus, Upload, X } from "lucide-react";
import { ImagenStorage, OrgulloItem } from "../../types/portal";

export type FormOrgulloState = Omit<OrgulloItem, "carrera_nombre"> & {
  carrera_nombre?: string;
};

interface AdminOrgulloTabProps {
  orgulloItems: OrgulloItem[];
  setOrgulloItems: React.Dispatch<React.SetStateAction<OrgulloItem[]>>;
  formOrgullo: FormOrgulloState;
  setFormOrgullo: React.Dispatch<React.SetStateAction<FormOrgulloState>>;
  editandoOrgulloId: string | null;
  setEditandoOrgulloId: React.Dispatch<React.SetStateAction<string | null>>;
  modalOrgulloFormAbierto: boolean;
  setModalOrgulloFormAbierto: React.Dispatch<React.SetStateAction<boolean>>;
  subiendoFotoOrgullo: boolean;
  setSubiendoFotoOrgullo: React.Dispatch<React.SetStateAction<boolean>>;
  imagenesStorage: ImagenStorage[];
  sincronizarPortalConfigSupabase: (payload: Record<string, unknown>) => Promise<boolean>;
  subirArchivoASupabaseStorage: (file: File, carpeta: string) => Promise<string | null>;
  lanzarToast: (msg: string) => void;
}

export function AdminOrgulloTab({
  orgulloItems,
  setOrgulloItems,
  formOrgullo,
  setFormOrgullo,
  editandoOrgulloId,
  setEditandoOrgulloId,
  modalOrgulloFormAbierto,
  setModalOrgulloFormAbierto,
  subiendoFotoOrgullo,
  setSubiendoFotoOrgullo,
  imagenesStorage,
  sincronizarPortalConfigSupabase,
  subirArchivoASupabaseStorage,
  lanzarToast,
}: AdminOrgulloTabProps) {
  return (
    <div className="space-y-6 view-transition-gpu">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-base text-[#002855] dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Gestión de Historias de Éxito: Orgullo San Marquino
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Agrega o edita pósters, fotografías y reconocimientos de estudiantes destacados que impactan a nivel nacional e internacional.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormOrgullo({
              id: "",
              titulo: "",
              subtitulo_categoria: "SELECCIONADO POR IBRO 2026",
              estudiante: "",
              carrera_id: "computacion-cientifica",
              descripcion: "",
              foto_url: "",
              tipo_tarjeta: "afiche",
              enlace_nota: "",
              anio: "2026",
              destacado: true,
            });
            setEditandoOrgulloId(null);
            setModalOrgulloFormAbierto(true);
          }}
          className="gpu-btn px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-2 shadow cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>➕ Añadir Nuevo Logro</span>
        </button>
      </div>

      {/* Lista de Logros en CMS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orgulloItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col justify-between space-y-3"
          >
            <div className="flex gap-3">
              <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
                <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 min-w-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-[#002855] dark:text-blue-200">
                  {item.subtitulo_categoria}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-[#002855] dark:text-white truncate">
                  {item.titulo}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  👤 {item.estudiante}
                </p>
                <p className="text-[10px] font-semibold text-red-700 dark:text-red-400">
                  {item.carrera_nombre} • {item.anio}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {item.descripcion}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setFormOrgullo(item);
                  setEditandoOrgulloId(item.id);
                  setModalOrgulloFormAbierto(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#002855] dark:text-blue-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (
                    window.confirm(
                      `¿Estás seguro de eliminar "${item.titulo}" del Orgullo San Marquino?`
                    )
                  ) {
                    const actualizados = orgulloItems.filter((x) => x.id !== item.id);
                    setOrgulloItems(actualizados);
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem(
                        "fcm_orgullo_data",
                        JSON.stringify(actualizados)
                      );
                    }
                    const metaPayload = {
                      id: "__fcm_orgullo_config__",
                      orgullo_items: actualizados,
                    };
                    const storageFiltrado = imagenesStorage.filter(
                      (x) => x.id !== "__fcm_orgullo_config__"
                    );
                    const nuevoStorage = [
                      ...storageFiltrado,
                      metaPayload as unknown as ImagenStorage,
                    ];
                    await sincronizarPortalConfigSupabase({
                      orgullo_data: actualizados,
                      storage_data: nuevoStorage,
                    });
                    lanzarToast("🗑️ Logro eliminado y cambios persistidos en Supabase.");
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900 text-red-700 dark:text-red-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CMS: CREAR / EDITAR LOGRO ORGULLO SAN MARQUINO */}
      {modalOrgulloFormAbierto && (
        <div
          onClick={() => setModalOrgulloFormAbierto(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm modal-backdrop-gpu"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-panel-gpu bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border-2 border-[#002855] dark:border-blue-700 max-h-[92vh] overflow-y-auto text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-[#002855] dark:text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  {editandoOrgulloId
                    ? "Editar Logro en Orgullo San Marquino"
                    : "Añadir Nuevo Logro en Orgullo San Marquino"}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Completa los campos para publicar un reconocimiento con fotografía o póster oficial.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOrgulloFormAbierto(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!formOrgullo.titulo.trim() || !formOrgullo.foto_url.trim()) {
                  lanzarToast("⚠️ Debes ingresar un título y la URL de la imagen.");
                  return;
                }

                const carreraNombreMap: Record<string, string> = {
                  "computacion-cientifica": "Computación Científica",
                  matematica: "Matemática",
                  estadistica: "Estadística",
                  "investigacion-operativa": "Investigación Operativa",
                  fcm: "Facultad de Ciencias Matemáticas",
                };

                const itemCompleto: OrgulloItem = {
                  ...formOrgullo,
                  id: editandoOrgulloId || `org-${Date.now()}`,
                  carrera_nombre: carreraNombreMap[formOrgullo.carrera_id] || "FCM UNMSM",
                };

                let actualizados: OrgulloItem[];
                if (editandoOrgulloId) {
                  actualizados = orgulloItems.map((item) =>
                    item.id === editandoOrgulloId ? itemCompleto : item
                  );
                } else {
                  actualizados = [itemCompleto, ...orgulloItems];
                }

                setOrgulloItems(actualizados);
                if (typeof window !== "undefined") {
                  window.localStorage.setItem(
                    "fcm_orgullo_data",
                    JSON.stringify(actualizados)
                  );
                }

                const metaPayload = {
                  id: "__fcm_orgullo_config__",
                  orgullo_items: actualizados,
                };
                const storageFiltrado = imagenesStorage.filter(
                  (x) => x.id !== "__fcm_orgullo_config__"
                );
                const nuevoStorage = [
                  ...storageFiltrado,
                  metaPayload as unknown as ImagenStorage,
                ];

                const exito = await sincronizarPortalConfigSupabase({
                  orgullo_data: actualizados,
                  storage_data: nuevoStorage,
                });

                setModalOrgulloFormAbierto(false);
                setEditandoOrgulloId(null);
                lanzarToast(
                  exito
                    ? "✅ Logro de Orgullo San Marquino guardado y sincronizado en Supabase."
                    : "✅ Guardado localmente y en caché del portal."
                );
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                  Título del Logro / Reconocimiento:
                </label>
                <input
                  type="text"
                  required
                  value={formOrgullo.titulo}
                  onChange={(e) => setFormOrgullo({ ...formOrgullo, titulo: e.target.value })}
                  placeholder="ej. Translational Neuroscience School — IBRO 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                    Categoría / Distintivo Superior:
                  </label>
                  <input
                    type="text"
                    required
                    value={formOrgullo.subtitulo_categoria}
                    onChange={(e) =>
                      setFormOrgullo({ ...formOrgullo, subtitulo_categoria: e.target.value })
                    }
                    placeholder="ej. SELECCIONADO POR IBRO 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                    Estudiante o Equipo Reconocido:
                  </label>
                  <input
                    type="text"
                    required
                    value={formOrgullo.estudiante}
                    onChange={(e) => setFormOrgullo({ ...formOrgullo, estudiante: e.target.value })}
                    placeholder="ej. Diego Quispe Huamán"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                    Escuela Profesional:
                  </label>
                  <select
                    value={formOrgullo.carrera_id}
                    onChange={(e) =>
                      setFormOrgullo({
                        ...formOrgullo,
                        carrera_id: e.target.value as OrgulloItem["carrera_id"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="computacion-cientifica">Computación Científica</option>
                    <option value="matematica">Matemática</option>
                    <option value="estadistica">Estadística</option>
                    <option value="investigacion-operativa">Investigación Operativa</option>
                    <option value="fcm">Facultad FCM General</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                    Tipo de Tarjeta:
                  </label>
                  <select
                    value={formOrgullo.tipo_tarjeta}
                    onChange={(e) =>
                      setFormOrgullo({
                        ...formOrgullo,
                        tipo_tarjeta: e.target.value as OrgulloItem["tipo_tarjeta"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="afiche">Afiche / Convocatoria</option>
                    <option value="estudiante">Protagonista / Estudiante</option>
                    <option value="delegacion">Delegación / Premiación</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                    Año:
                  </label>
                  <input
                    type="text"
                    value={formOrgullo.anio}
                    onChange={(e) => setFormOrgullo({ ...formOrgullo, anio: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                  URL de la Fotografía o Póster (Aspecto 3:4):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formOrgullo.foto_url}
                    onChange={(e) => setFormOrgullo({ ...formOrgullo, foto_url: e.target.value })}
                    placeholder="ej. /orgullo/card1.png o https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#002855] dark:text-blue-200 border border-blue-200 dark:border-blue-800 font-bold hover:bg-blue-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{subiendoFotoOrgullo ? "Subiendo..." : "Subir Foto"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setSubiendoFotoOrgullo(true);
                        try {
                          const publicUrl = await subirArchivoASupabaseStorage(file, "orgullo");
                          if (publicUrl) {
                            setFormOrgullo((prev) => ({ ...prev, foto_url: publicUrl }));
                            lanzarToast("📸 Foto subida con éxito.");
                          } else {
                            lanzarToast("❌ Error al subir la imagen.");
                          }
                        } catch {
                          lanzarToast("❌ Error al procesar archivo.");
                        } finally {
                          setSubiendoFotoOrgullo(false);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                  Enlace a Nota de Prensa o Web Oficial (Opcional):
                </label>
                <input
                  type="url"
                  value={formOrgullo.enlace_nota || ""}
                  onChange={(e) => setFormOrgullo({ ...formOrgullo, enlace_nota: e.target.value })}
                  placeholder="https://ejemplo.unmsm.edu.pe/nota-prensa"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#002855] dark:text-slate-200 block mb-1">
                  Descripción / Resumen del Logro:
                </label>
                <textarea
                  rows={3}
                  value={formOrgullo.descripcion}
                  onChange={(e) => setFormOrgullo({ ...formOrgullo, descripcion: e.target.value })}
                  placeholder="Describe brevemente el impacto del logro..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOrgulloFormAbierto(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="gpu-btn px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold flex items-center gap-2 shadow cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>Guardar Logro</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
