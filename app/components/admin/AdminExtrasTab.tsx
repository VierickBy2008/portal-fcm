"use client";

import React, { useState } from "react";
import {
  Calendar,
  Bot,
  Database,
  Eye,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  Download,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import type {
  CalendarioSemestralConfig,
  ActividadCalendario,
  AsistenteIAConfig,
  FaqAsistenteIA,
  AccesibilidadConfig,
} from "@/app/types/portal";
import {
  CALENDARIO_SEMESTRAL_INICIAL,
  ASISTENTE_IA_INICIAL,
  ACCESIBILIDAD_INICIAL,
} from "@/app/data/portalExtrasData";

interface AdminExtrasTabProps {
  mode: "calendario_cms" | "asistente_ia_cms" | "arquitectura_3a_cms";
  calendarioConfig: CalendarioSemestralConfig;
  onGuardarCalendario: (nuevo: CalendarioSemestralConfig) => Promise<void> | void;
  asistenteConfig: AsistenteIAConfig;
  onGuardarAsistente: (nuevo: AsistenteIAConfig) => Promise<void> | void;
  accesibilidadConfig: AccesibilidadConfig;
  onGuardarAccesibilidad: (nuevo: AccesibilidadConfig) => Promise<void> | void;
  statsRelacionales: {
    noticias: number;
    docentes: number;
    resenas: number;
    carreras: number;
    malla: number;
    materiales: number;
    orgullo: number;
    transparencia: number;
    tickets: number;
  };
  onForzarSyncTotalSupabase: () => Promise<void> | void;
  onExportarBackupJson: () => void;
}

const SQL_MIGRACION_RELACIONAL_3A = `-- ==========================================================================================
-- ARQUITECTURA 3A: NORMALIZACIÓN RELACIONAL + ROW LEVEL SECURITY (RLS) - PORTAL FCM UNMSM
-- Compatible al 100% con portal_config (id = 1) y preparada para escalamiento institucional
-- ==========================================================================================

-- 1. Asegurar columnas extendidas en portal_config (Persistencia Híbrida Instantánea)
ALTER TABLE public.portal_config ADD COLUMN IF NOT EXISTS orgullo_data jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.portal_config ADD COLUMN IF NOT EXISTS transparencia_data jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.portal_config ADD COLUMN IF NOT EXISTS calendario_data jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.portal_config ADD COLUMN IF NOT EXISTS asistente_ia_data jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.portal_config ADD COLUMN IF NOT EXISTS accesibilidad_data jsonb DEFAULT '{}'::jsonb;

-- 2. Tabla Relacional de Calendario Académico Semestral (2026-I y 2026-II)
CREATE TABLE IF NOT EXISTS public.fcm_calendario_semestral (
  id text PRIMARY KEY,
  semestre text NOT NULL CHECK (semestre IN ('2026-I', '2026-II')),
  actividad text NOT NULL,
  fecha text NOT NULL,
  categoria text DEFAULT 'tramite',
  destacado boolean DEFAULT false,
  orden int DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- 3. Tabla Relacional de Base de Conocimiento del Asistente Virtual IA
CREATE TABLE IF NOT EXISTS public.fcm_asistente_faqs (
  id text PRIMARY KEY,
  pregunta text NOT NULL,
  palabras_clave text NOT NULL,
  respuesta text NOT NULL,
  categoria text DEFAULT 'General',
  enlace_accion text,
  texto_enlace text,
  updated_at timestamptz DEFAULT now()
);

-- 4. Políticas Row Level Security (RLS) - Lectura Pública / Escritura exclusiva Service Role (Admin)
ALTER TABLE public.fcm_calendario_semestral ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fcm_asistente_faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura publica calendario FCM" ON public.fcm_calendario_semestral;
CREATE POLICY "Lectura publica calendario FCM"
  ON public.fcm_calendario_semestral FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura publica asistente FCM" ON public.fcm_asistente_faqs;
CREATE POLICY "Lectura publica asistente FCM"
  ON public.fcm_asistente_faqs FOR SELECT USING (true);
`;

export function AdminExtrasTab({
  mode,
  calendarioConfig,
  onGuardarCalendario,
  asistenteConfig,
  onGuardarAsistente,
  accesibilidadConfig,
  onGuardarAccesibilidad,
  statsRelacionales,
  onForzarSyncTotalSupabase,
  onExportarBackupJson,
}: AdminExtrasTabProps) {
  // ==================== ESTADOS PARA 1C: CALENDARIO ACADÉMICO ====================
  const [filtroSemestreAdmin, setFiltroSemestreAdmin] = useState<"2026-I" | "2026-II">("2026-I");
  const [editActividadId, setEditActividadId] = useState<string | null>(null);
  const [formSemestre, setFormSemestre] = useState<"2026-I" | "2026-II">("2026-I");
  const [formActividad, setFormActividad] = useState("");
  const [formFecha, setFormFecha] = useState("");
  const [formCategoria, setFormCategoria] = useState<
    NonNullable<ActividadCalendario["categoria"]>
  >("matricula");
  const [formDestacado, setFormDestacado] = useState(false);

  // ==================== ESTADOS PARA 1B: ASISTENTE VIRTUAL IA ====================
  const [editFaqId, setEditFaqId] = useState<string | null>(null);
  const [faqPregunta, setFaqPregunta] = useState("");
  const [faqKeywords, setFaqKeywords] = useState("");
  const [faqRespuesta, setFaqRespuesta] = useState("");
  const [faqCategoria, setFaqCategoria] = useState<FaqAsistenteIA["categoria"]>("Matrícula");
  const [faqEnlace, setFaqEnlace] = useState("");
  const [faqTextoEnlace, setFaqTextoEnlace] = useState("");
  const [nuevaPreguntaRapida, setNuevaPreguntaRapida] = useState("");

  // ==================== ESTADO SQL COPY ====================
  const [sqlCopiado, setSqlCopiado] = useState(false);

  // ================================================================================
  // MODO 1: GESTIÓN DEL CALENDARIO ACADÉMICO 2026-I Y 2026-II (1C)
  // ================================================================================
  if (mode === "calendario_cms") {
    const handleGuardarFilaCalendario = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formActividad.trim() || !formFecha.trim()) return;

      let nuevasActividades: ActividadCalendario[];
      if (editActividadId) {
        nuevasActividades = calendarioConfig.actividades.map((item) =>
          item.id === editActividadId
            ? {
                ...item,
                semestre: formSemestre,
                actividad: formActividad.trim(),
                fecha: formFecha.trim(),
                categoria: formCategoria,
                destacado: formDestacado,
              }
            : item
        );
      } else {
        const nueva: ActividadCalendario = {
          id: `cal-${Date.now()}`,
          semestre: formSemestre,
          actividad: formActividad.trim(),
          fecha: formFecha.trim(),
          categoria: formCategoria,
          destacado: formDestacado,
        };
        nuevasActividades = [...calendarioConfig.actividades, nueva];
      }

      await onGuardarCalendario({
        ...calendarioConfig,
        actividades: nuevasActividades,
      });

      setEditActividadId(null);
      setFormActividad("");
      setFormFecha("");
      setFormDestacado(false);
    };

    const handleEditarFila = (item: ActividadCalendario) => {
      setEditActividadId(item.id);
      setFormSemestre(item.semestre);
      setFormActividad(item.actividad);
      setFormFecha(item.fecha);
      setFormCategoria(item.categoria || "tramite");
      setFormDestacado(Boolean(item.destacado));
      setFiltroSemestreAdmin(item.semestre);
    };

    const handleEliminarFila = async (id: string) => {
      const filtradas = calendarioConfig.actividades.filter((a) => a.id !== id);
      await onGuardarCalendario({
        ...calendarioConfig,
        actividades: filtradas,
      });
    };

    const actividadesSemestreActual = calendarioConfig.actividades.filter(
      (a) => a.semestre === filtroSemestreAdmin
    );

    return (
      <div className="space-y-6 view-transition-gpu">
        {/* Cabecera y Configuración General del Régimen Semestral */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#002855] dark:text-white">
                  Gestión del Régimen Semestral (Semestres 2026-I y 2026-II)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Agrega, modifica o actualiza cualquier actividad, fecha oficial o nota al pie del calendario académico.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onGuardarCalendario(CALENDARIO_SEMESTRAL_INICIAL)}
              className="gpu-btn px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar Tabla Oficial 2026
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Título Principal de la Sección
              </label>
              <input
                type="text"
                value={calendarioConfig.titulo}
                onChange={(e) =>
                  onGuardarCalendario({ ...calendarioConfig, titulo: e.target.value })
                }
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Subtítulo Descriptivo
              </label>
              <input
                type="text"
                value={calendarioConfig.subtitulo}
                onChange={(e) =>
                  onGuardarCalendario({ ...calendarioConfig, subtitulo: e.target.value })
                }
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Vista Predeterminada al Abrir el Portal
              </label>
              <select
                value={calendarioConfig.semestre_activo_default}
                onChange={(e) =>
                  onGuardarCalendario({
                    ...calendarioConfig,
                    semestre_activo_default: e.target.value as "ambos" | "2026-I" | "2026-II",
                  })
                }
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="ambos">Mostrar Ambos Semestres (2026-I y 2026-II)</option>
                <option value="2026-I">Enfocar en Semestre 2026-I</option>
                <option value="2026-II">Enfocar en Semestre 2026-II</option>
              </select>
            </div>
          </div>

          {/* Notas al Pie (*), (**), (***) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block mb-1">
                Nota al Pie (*)
              </label>
              <textarea
                rows={2}
                value={calendarioConfig.nota_pie_1}
                onChange={(e) =>
                  onGuardarCalendario({ ...calendarioConfig, nota_pie_1: e.target.value })
                }
                className="w-full rounded-xl bg-amber-50/40 dark:bg-slate-950 border border-amber-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block mb-1">
                Nota al Pie (**)
              </label>
              <textarea
                rows={2}
                value={calendarioConfig.nota_pie_2}
                onChange={(e) =>
                  onGuardarCalendario({ ...calendarioConfig, nota_pie_2: e.target.value })
                }
                className="w-full rounded-xl bg-amber-50/40 dark:bg-slate-950 border border-amber-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block mb-1">
                Nota al Pie (***)
              </label>
              <textarea
                rows={2}
                value={calendarioConfig.nota_pie_3}
                onChange={(e) =>
                  onGuardarCalendario({ ...calendarioConfig, nota_pie_3: e.target.value })
                }
                className="w-full rounded-xl bg-amber-50/40 dark:bg-slate-950 border border-amber-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Editor y Tabla de Actividades por Semestre */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleGuardarFilaCalendario}
            className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3.5 h-fit"
          >
            <h4 className="font-bold text-sm text-[#002855] dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-red-700 dark:text-red-400" />
              <span>
                {editActividadId
                  ? "Editar Actividad del Cronograma"
                  : "Añadir Actividad al Cronograma"}
              </span>
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Régimen / Semestre
                </label>
                <select
                  value={formSemestre}
                  onChange={(e) => setFormSemestre(e.target.value as "2026-I" | "2026-II")}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="2026-I">SEMESTRE 2026-I</option>
                  <option value="2026-II">SEMESTRE 2026-II</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Categoría Visual
                </label>
                <select
                  value={formCategoria}
                  onChange={(e) =>
                    setFormCategoria(
                      e.target.value as NonNullable<ActividadCalendario["categoria"]>
                    )
                  }
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  <option value="matricula">Matrícula</option>
                  <option value="clases">Clases</option>
                  <option value="evaluacion">Evaluación</option>
                  <option value="actas">Notas y Actas</option>
                  <option value="tramite">Trámite SUM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Nombre de la Actividad *
              </label>
              <input
                type="text"
                required
                value={formActividad}
                onChange={(e) => setFormActividad(e.target.value)}
                placeholder="Ej. Matrícula regular / Evaluación Parcial"
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Fecha o Rango de Fechas *
              </label>
              <input
                type="text"
                required
                value={formFecha}
                onChange={(e) => setFormFecha(e.target.value)}
                placeholder="Ej. Lunes 16 al martes 20 de marzo"
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formDestacado}
                onChange={(e) => setFormDestacado(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span>Resaltar fila como fecha clave (Matrícula / Inicio Clases / Exámenes)</span>
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                className="gpu-btn flex-1 py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer"
              >
                {editActividadId ? "Actualizar Actividad en Supabase" : "Agregar y Guardar en Supabase"}
              </button>
              {editActividadId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditActividadId(null);
                    setFormActividad("");
                    setFormFecha("");
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFiltroSemestreAdmin("2026-I")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    filtroSemestreAdmin === "2026-I"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                  }`}
                >
                  SEMESTRE 2026-I (
                  {calendarioConfig.actividades.filter((a) => a.semestre === "2026-I").length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroSemestreAdmin("2026-II")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    filtroSemestreAdmin === "2026-II"
                      ? "bg-red-700 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                  }`}
                >
                  SEMESTRE 2026-II (
                  {calendarioConfig.actividades.filter((a) => a.semestre === "2026-II").length})
                </button>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Haz clic en ✏️ para modificar cualquier fecha
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden max-h-[520px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#002855] dark:bg-slate-950 text-white border-b dark:border-slate-800">
                    <th className="py-3 px-4">Actividad</th>
                    <th className="py-3 px-4">Fecha Oficial</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {actividadesSemestreActual.map((act) => (
                    <tr
                      key={act.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-900 dark:text-slate-200"
                    >
                      <td className="py-2.5 px-4 font-semibold">
                        <div className="flex items-center gap-1.5">
                          {act.destacado && (
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                          <span>{act.actividad}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">
                        {act.fecha}
                      </td>
                      <td className="py-2.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditarFila(act)}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 cursor-pointer"
                          title="Editar actividad"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEliminarFila(act.id)}
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-100 cursor-pointer"
                          title="Eliminar actividad"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================================================================================
  // MODO 2: GESTIÓN DEL ASISTENTE VIRTUAL IA FCM (1B)
  // ================================================================================
  if (mode === "asistente_ia_cms") {
    const handleGuardarFaq = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!faqPregunta.trim() || !faqRespuesta.trim()) return;

      let nuevasFaqs: FaqAsistenteIA[];
      if (editFaqId) {
        nuevasFaqs = asistenteConfig.faqs.map((f) =>
          f.id === editFaqId
            ? {
                ...f,
                pregunta: faqPregunta.trim(),
                palabras_clave: faqKeywords.trim(),
                respuesta: faqRespuesta.trim(),
                categoria: faqCategoria,
                enlace_accion: faqEnlace.trim() || undefined,
                texto_enlace: faqTextoEnlace.trim() || undefined,
              }
            : f
        );
      } else {
        const nueva: FaqAsistenteIA = {
          id: `faq-${Date.now()}`,
          pregunta: faqPregunta.trim(),
          palabras_clave: faqKeywords.trim(),
          respuesta: faqRespuesta.trim(),
          categoria: faqCategoria,
          enlace_accion: faqEnlace.trim() || undefined,
          texto_enlace: faqTextoEnlace.trim() || undefined,
        };
        nuevasFaqs = [...asistenteConfig.faqs, nueva];
      }

      await onGuardarAsistente({
        ...asistenteConfig,
        faqs: nuevasFaqs,
      });

      setEditFaqId(null);
      setFaqPregunta("");
      setFaqKeywords("");
      setFaqRespuesta("");
      setFaqEnlace("");
      setFaqTextoEnlace("");
    };

    return (
      <div className="space-y-6 view-transition-gpu">
        {/* Configuración Principal del Bot */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#002855] dark:text-white">
                  Configuración y Entrenamiento del Asistente Virtual IA • FCM
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Personaliza el mensaje de bienvenida, sugerencias rápidas y respuestas oficiales del chatbot institucional.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={asistenteConfig.habilitado}
                  onChange={(e) =>
                    onGuardarAsistente({ ...asistenteConfig, habilitado: e.target.checked })
                  }
                />
                <span>Asistente IA Activo en el Portal</span>
              </label>
              <button
                type="button"
                onClick={() => onGuardarAsistente(ASISTENTE_IA_INICIAL)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restaurar IA
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Nombre Visible del Asistente
              </label>
              <input
                type="text"
                value={asistenteConfig.nombre_bot}
                onChange={(e) =>
                  onGuardarAsistente({ ...asistenteConfig, nombre_bot: e.target.value })
                }
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Subtítulo de Estado
              </label>
              <input
                type="text"
                value={asistenteConfig.subtitulo_bot}
                onChange={(e) =>
                  onGuardarAsistente({ ...asistenteConfig, subtitulo_bot: e.target.value })
                }
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Mensaje de Bienvenida del Chatbot
            </label>
            <textarea
              rows={2}
              value={asistenteConfig.mensaje_bienvenida}
              onChange={(e) =>
                onGuardarAsistente({ ...asistenteConfig, mensaje_bienvenida: e.target.value })
              }
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Píldoras de Preguntas Rápidas */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
              Botones de Preguntas Rápidas (Sugerencias en el Chat)
            </label>
            <div className="flex flex-wrap gap-2">
              {asistenteConfig.preguntas_rapidas.map((preg, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[#002855] dark:text-blue-300 border border-blue-200 dark:border-slate-700 text-xs font-bold"
                >
                  <span>{preg}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onGuardarAsistente({
                        ...asistenteConfig,
                        preguntas_rapidas: asistenteConfig.preguntas_rapidas.filter(
                          (_, i) => i !== idx
                        ),
                      })
                    }
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={nuevaPreguntaRapida}
                onChange={(e) => setNuevaPreguntaRapida(e.target.value)}
                placeholder="Nueva pregunta rápida sugerida..."
                className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (!nuevaPreguntaRapida.trim()) return;
                  onGuardarAsistente({
                    ...asistenteConfig,
                    preguntas_rapidas: [
                      ...asistenteConfig.preguntas_rapidas,
                      nuevaPreguntaRapida.trim(),
                    ],
                  });
                  setNuevaPreguntaRapida("");
                }}
                className="px-3 py-1.5 rounded-xl bg-[#002855] text-white text-xs font-bold cursor-pointer"
              >
                + Añadir
              </button>
            </div>
          </div>
        </div>

        {/* Base de Conocimientos (FAQs) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleGuardarFaq}
            className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 h-fit"
          >
            <h4 className="font-bold text-sm text-[#002855] dark:text-white">
              {editFaqId ? "Editar Respuesta Entrenada" : "Añadir Nueva Respuesta al Asistente IA"}
            </h4>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Pregunta Frecuente / Tema *
              </label>
              <input
                type="text"
                required
                value={faqPregunta}
                onChange={(e) => setFaqPregunta(e.target.value)}
                placeholder="Ej. ¿Cómo solicito carné universitario?"
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Palabras Clave (separadas por coma) *
                </label>
                <input
                  type="text"
                  required
                  value={faqKeywords}
                  onChange={(e) => setFaqKeywords(e.target.value)}
                  placeholder="carne, sunedu, tramite, bienestar"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Categoría
                </label>
                <select
                  value={faqCategoria}
                  onChange={(e) =>
                    setFaqCategoria(e.target.value as FaqAsistenteIA["categoria"])
                  }
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Matrícula">Matrícula</option>
                  <option value="Mallas y Cursos">Mallas y Cursos</option>
                  <option value="Trámites y Grados">Trámites y Grados</option>
                  <option value="Servicios FCM">Servicios FCM</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Respuesta Oficial del Chatbot *
              </label>
              <textarea
                rows={4}
                required
                value={faqRespuesta}
                onChange={(e) => setFaqRespuesta(e.target.value)}
                placeholder="Escribe la respuesta detallada que brindará el asistente..."
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="url"
                value={faqEnlace}
                onChange={(e) => setFaqEnlace(e.target.value)}
                placeholder="URL de acción (opcional)"
                className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={faqTextoEnlace}
                onChange={(e) => setFaqTextoEnlace(e.target.value)}
                placeholder="Texto del botón (ej. Ir al SUM)"
                className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="gpu-btn w-full py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer"
            >
              {editFaqId ? "Guardar Cambios en FAQ" : "Guardar Nueva FAQ en Supabase"}
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {asistenteConfig.faqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#002855] dark:text-blue-300 text-[10px] font-bold">
                      {faq.categoria}
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-[#002855] dark:text-white mt-1">
                      {faq.pregunta}
                    </h5>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditFaqId(faq.id);
                        setFaqPregunta(faq.pregunta);
                        setFaqKeywords(faq.palabras_clave);
                        setFaqRespuesta(faq.respuesta);
                        setFaqCategoria(faq.categoria);
                        setFaqEnlace(faq.enlace_accion || "");
                        setFaqTextoEnlace(faq.texto_enlace || "");
                      }}
                      className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onGuardarAsistente({
                          ...asistenteConfig,
                          faqs: asistenteConfig.faqs.filter((x) => x.id !== faq.id),
                        })
                      }
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{faq.respuesta}</p>
                <p className="text-[10px] font-mono text-slate-400">
                  Keywords: {faq.palabras_clave}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ================================================================================
  // MODO 3: ACCESIBILIDAD WCAG 2.1 (4B) + ARQUITECTURA RELACIONAL SUPABASE (3A)
  // ================================================================================
  return (
    <div className="space-y-6 view-transition-gpu">
      {/* BLOQUE 4B: PANEL DE CONTROL DE ACCESIBILIDAD WCAG 2.1 */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-[#002855] dark:text-amber-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#002855] dark:text-white">
                4B • Configuración del Módulo de Accesibilidad Inclusiva (WCAG 2.1 / CONADIS)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Controla qué herramientas de accesibilidad y lectura por voz se muestran en el portal público.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGuardarAccesibilidad(ACCESIBILIDAD_INICIAL)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar Valores
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              key: "habilitado" as const,
              label: "Mostrar Botón Flotante WCAG",
            },
            {
              key: "mostrar_lector_voz" as const,
              label: "Habilitar Lector de Voz (TTS)",
            },
            {
              key: "mostrar_alto_contraste" as const,
              label: "Habilitar Alto Contraste",
            },
            {
              key: "mostrar_escala_grises" as const,
              label: "Habilitar Modo Monocromático",
            },
            {
              key: "mostrar_reduccion_animaciones" as const,
              label: "Habilitar Reducción Movimiento",
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={accesibilidadConfig[item.key]}
                onChange={(e) =>
                  onGuardarAccesibilidad({
                    ...accesibilidadConfig,
                    [item.key]: e.target.checked,
                  })
                }
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Locución Institucional para el Lector por Voz (Text-to-Speech en Español)
          </label>
          <textarea
            rows={2}
            value={accesibilidadConfig.texto_lectura_institucional}
            onChange={(e) =>
              onGuardarAccesibilidad({
                ...accesibilidadConfig,
                texto_lectura_institucional: e.target.value,
              })
            }
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* BLOQUE 3A: NORMALIZACIÓN RELACIONAL EN SUPABASE, RLS & BACKUP */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#002855] dark:text-white">
                3A • Consola de Persistencia Relacional en Supabase, RLS y Respaldo Institucional
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monitoreo de registros sincronizados, exportación de snapshot JSON y script SQL de normalización con Row Level Security.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onForzarSyncTotalSupabase}
              className="gpu-btn px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Sincronizar Todo con Supabase Ahora
            </button>
            <button
              type="button"
              onClick={onExportarBackupJson}
              className="gpu-btn px-3.5 py-2 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Descargar Backup JSON
            </button>
          </div>
        </div>

        {/* Métricas de Entidades Sincronizadas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: "Escuelas Bento", count: statsRelacionales.carreras },
            { label: "Cursos en Malla", count: statsRelacionales.malla },
            { label: "Actividades 2026", count: calendarioConfig.actividades.length },
            { label: "FAQs Asistente IA", count: asistenteConfig.faqs.length },
            { label: "Plana Docente", count: statsRelacionales.docentes },
            { label: "Resoluciones PDF", count: statsRelacionales.transparencia },
          ].map((st) => (
            <div
              key={st.label}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
            >
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                {st.label}
              </span>
              <span className="text-xl font-extrabold text-[#002855] dark:text-white font-mono">
                {st.count}
              </span>
            </div>
          ))}
        </div>

        {/* Generador SQL Relacional + RLS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#002855] dark:text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Script SQL para Supabase SQL Editor (Columnas + Tablas Relacionales + RLS)
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(SQL_MIGRACION_RELACIONAL_3A);
                setSqlCopiado(true);
                setTimeout(() => setSqlCopiado(false), 2500);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {sqlCopiado ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> SQL Copiado
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copiar Script SQL
                </>
              )}
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-60 border border-slate-800 leading-relaxed">
            {SQL_MIGRACION_RELACIONAL_3A}
          </pre>
        </div>
      </div>
    </div>
  );
}
