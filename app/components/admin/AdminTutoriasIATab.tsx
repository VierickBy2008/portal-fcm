"use client";

import React, { useState } from "react";
import {
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Database,
  Eye,
  Lock,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Unlock,
  Users,
} from "lucide-react";
import type {
  DiaSemanaTutoria,
  DisponibilidadDocenteTutoria,
  Docente,
  FranjaHorariaTutoria,
  SolicitudTutoria,
  TutoriasIAConfig,
} from "@/app/types/portal";

export interface AdminTutoriasIATabProps {
  tutoriasConfig: TutoriasIAConfig;
  onGuardarTutoriasConfig: (nuevo: TutoriasIAConfig) => Promise<void> | void;
  docentes: Docente[];
  onAbrirSimuladorEstudiante: () => void;
  onVerVistaPublicaBloqueada: () => void;
  lanzarToast: (msg: string) => void;
}

type ModalidadTutoria = FranjaHorariaTutoria["modalidad"];
type EstadoSolicitudTutoria = SolicitudTutoria["estado"];

const DIAS_SEMANA: DiaSemanaTutoria[] = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export function AdminTutoriasIATab({
  tutoriasConfig,
  onGuardarTutoriasConfig,
  docentes,
  onAbrirSimuladorEstudiante,
  onVerVistaPublicaBloqueada,
  lanzarToast,
}: AdminTutoriasIATabProps) {
  const [mensajeRestriccion, setMensajeRestriccion] = useState(
    tutoriasConfig.mensaje_restriccion
  );
  const [periodoAcademico, setPeriodoAcademico] = useState(
    tutoriasConfig.semestre_activo
  );

  const [docenteSeleccionadoId, setDocenteSeleccionadoId] = useState<string>(
    docentes[0]?.id || "doc-cc-1"
  );
  const [nuevoDia, setNuevoDia] = useState<DiaSemanaTutoria>("Lunes");
  const [nuevaHoraInicio, setNuevaHoraInicio] = useState("10:00");
  const [nuevaHoraFin, setNuevaHoraFin] = useState("12:00");
  const [nuevaModalidad, setNuevaModalidad] = useState<ModalidadTutoria>(
    "Presencial (Cubículo FCM)"
  );

  const handleToggleAccesoPublico = async (habilitado: boolean) => {
    const actualizado: TutoriasIAConfig = {
      ...tutoriasConfig,
      acceso_publico_habilitado: habilitado,
    };
    await onGuardarTutoriasConfig(actualizado);
    lanzarToast(
      habilitado
        ? "🔓 Sistema de Tutorías habilitado en Modo Piloto (@unmsm.edu.pe)"
        : "🔒 Sistema de Tutorías bloqueado al público (Modo Homologación Oficial)"
    );
  };

  const handleGuardarTextosConfig = async () => {
    const actualizado: TutoriasIAConfig = {
      ...tutoriasConfig,
      mensaje_restriccion:
        mensajeRestriccion.trim() || tutoriasConfig.mensaje_restriccion,
      semestre_activo: periodoAcademico.trim() || "2026-I",
    };
    await onGuardarTutoriasConfig(actualizado);
    lanzarToast("✅ Configuración institucional de Tutorías IA guardada.");
  };

  const handleAgregarFranjaDocente = async () => {
    const doc = docentes.find((d) => d.id === docenteSeleccionadoId);
    if (!doc) return;

    const nuevaFranja: FranjaHorariaTutoria = {
      id: `fr-${Date.now()}`,
      dia: nuevoDia,
      hora_inicio: nuevaHoraInicio,
      hora_fin: nuevaHoraFin,
      modalidad: nuevaModalidad,
      ubicacion_detalle:
        nuevaModalidad === "Virtual (Google Meet)"
          ? "Sala Institucional Google Meet (@unmsm.edu.pe)"
          : "Cubículo Docente - Pabellón FCM",
    };

    const existeDisp = tutoriasConfig.disponibilidades.find(
      (d) => d.docente_id === docenteSeleccionadoId
    );

    let nuevasDisponibilidades: DisponibilidadDocenteTutoria[];
    if (existeDisp) {
      nuevasDisponibilidades = tutoriasConfig.disponibilidades.map((d) =>
        d.docente_id === docenteSeleccionadoId
          ? { ...d, franjas: [...d.franjas, nuevaFranja] }
          : d
      );
    } else {
      nuevasDisponibilidades = [
        ...tutoriasConfig.disponibilidades,
        {
          docente_id: docenteSeleccionadoId,
          habilitado_tutoria: true,
          cupos_semanales: 4,
          temas_especialidad: doc.cursos_dictados?.length
            ? doc.cursos_dictados
            : [doc.especialidad],
          franjas: [nuevaFranja],
        },
      ];
    }

    await onGuardarTutoriasConfig({
      ...tutoriasConfig,
      disponibilidades: nuevasDisponibilidades,
    });
    lanzarToast(
      `✅ Horario agregado a ${doc.nombre_completo} (${nuevoDia} ${nuevaHoraInicio}-${nuevaHoraFin})`
    );
  };

  const handleEliminarFranja = async (docenteId: string, franjaId: string) => {
    const nuevasDisponibilidades = tutoriasConfig.disponibilidades.map((d) =>
      d.docente_id === docenteId
        ? { ...d, franjas: d.franjas.filter((f) => f.id !== franjaId) }
        : d
    );
    await onGuardarTutoriasConfig({
      ...tutoriasConfig,
      disponibilidades: nuevasDisponibilidades,
    });
    lanzarToast("🗑️ Franja horaria eliminada.");
  };

  const handleCambiarEstadoSolicitud = async (
    solicitudId: string,
    nuevoEstado: EstadoSolicitudTutoria
  ) => {
    const nuevasSolicitudes = tutoriasConfig.solicitudes.map((s) =>
      s.id === solicitudId ? { ...s, estado: nuevoEstado } : s
    );
    await onGuardarTutoriasConfig({
      ...tutoriasConfig,
      solicitudes: nuevasSolicitudes,
    });
    lanzarToast(`✅ Estado de solicitud actualizado a "${nuevoEstado.toUpperCase()}".`);
  };

  const handleEliminarSolicitud = async (solicitudId: string) => {
    const nuevasSolicitudes = tutoriasConfig.solicitudes.filter(
      (s) => s.id !== solicitudId
    );
    await onGuardarTutoriasConfig({
      ...tutoriasConfig,
      solicitudes: nuevasSolicitudes,
    });
    lanzarToast("🗑️ Solicitud de tutoría eliminada.");
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-[#002855] via-[#001833] to-[#8B1515] p-6 sm:p-8 text-white shadow-lg border border-amber-400/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" /> Gestión CMS • Servicio al Estudiante
            </span>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                tutoriasConfig.acceso_publico_habilitado
                  ? "bg-emerald-500/25 border border-emerald-300/40 text-emerald-200"
                  : "bg-rose-500/25 border border-rose-300/40 text-rose-200"
              }`}
            >
              {tutoriasConfig.acceso_publico_habilitado ? (
                <>
                  <Unlock className="w-3 h-3" /> Modo Piloto Abierto (@unmsm.edu.pe)
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" /> Acceso Público Restringido (Homologación)
                </>
              )}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sistema Automatizado de Tutorías con IA (Panel de Control)
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Administra el estado de acceso público del sistema, prueba el simulador de
            emparejamiento algorítmico por IA y gestiona los horarios de asesoría docente
            preparados para la integración oficial con la base de datos de la FCM.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onAbrirSimuladorEstudiante}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Probar Simulador Interactivo de Estudiante (IA)
          </button>
          <button
            type="button"
            onClick={onVerVistaPublicaBloqueada}
            className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Eye className="w-4 h-4 text-sky-300" />
            Ver Pantalla Pública Restringida
          </button>
        </div>
      </div>

      {/* SECCIÓN 1: INTERRUPTOR MAESTRO DE ACCESO PÚBLICO Y HOMOLOGACIÓN */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8B1515] dark:text-amber-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> 1. Control de Visibilidad y Base de Datos Oficial FCM
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Estado de Acceso al Módulo de Tutorías
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              Por defecto se mantiene en <strong>Modo Restringido (Inaccesible al público)</strong>{" "}
              hasta contar con el padrón oficial de alumnos y docentes de la Facultad. Como
              administrador puedes probar todas las funciones desde el Simulador sin abrirlo al
              público.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleToggleAccesoPublico(false)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition cursor-pointer ${
                !tutoriasConfig.acceso_publico_habilitado
                  ? "bg-[#8B1515] text-white border-[#8B1515] shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Modo Restringido (Recomendado)
            </button>
            <button
              type="button"
              onClick={() => handleToggleAccesoPublico(true)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition cursor-pointer ${
                tutoriasConfig.acceso_publico_habilitado
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              Habilitar Piloto Público (@unmsm.edu.pe)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-3">
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1.5">
              Semestre Académico Objetivo:
            </label>
            <input
              type="text"
              value={periodoAcademico}
              onChange={(e) => setPeriodoAcademico(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>
          <div className="lg:col-span-7">
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1.5">
              Mensaje Oficial en Pantalla de Acceso Restringido:
            </label>
            <input
              type="text"
              value={mensajeRestriccion}
              onChange={(e) => setMensajeRestriccion(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
            />
          </div>
          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={handleGuardarTextosConfig}
              className="w-full py-2.5 px-4 rounded-xl bg-[#002855] hover:bg-[#001d3d] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Guardar Aviso
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: MATRIZ DE DISPONIBILIDAD HORARIA DE DOCENTES */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#002855] dark:text-blue-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> 2. Matriz de Horarios de Cátedra para Emparejamiento IA
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
            Disponibilidad de Profesores Consejeros
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Agrega o edita las franjas horarias libres de cada docente. El algoritmo de IA utiliza
            esta matriz para encontrar el mejor horario compatible con el estudiante.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <div className="lg:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Docente FCM:
            </label>
            <select
              value={docenteSeleccionadoId}
              onChange={(e) => setDocenteSeleccionadoId(e.target.value)}
              className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
            >
              {docentes.map((d) => (
                <option key={d.id} value={d.id}>
                  [{d.carrera_id}] {d.nombre_completo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Día:
            </label>
            <select
              value={nuevoDia}
              onChange={(e) => setNuevoDia(e.target.value as DiaSemanaTutoria)}
              className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
            >
              {DIAS_SEMANA.map((dia) => (
                <option key={dia} value={dia}>
                  {dia}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Inicio:
              </label>
              <input
                type="time"
                value={nuevaHoraInicio}
                onChange={(e) => setNuevaHoraInicio(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Fin:
              </label>
              <input
                type="time"
                value={nuevaHoraFin}
                onChange={(e) => setNuevaHoraFin(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Modalidad:
            </label>
            <select
              value={nuevaModalidad}
              onChange={(e) => setNuevaModalidad(e.target.value as ModalidadTutoria)}
              className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2.5 py-2 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="Presencial (Cubículo FCM)">Presencial (Cubículo)</option>
              <option value="Virtual (Google Meet)">Virtual (Google Meet)</option>
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={handleAgregarFranjaDocente}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Añadir Horario
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutoriasConfig.disponibilidades.map((disp) => {
            const doc = docentes.find((d) => d.id === disp.docente_id);
            if (!doc) return null;

            return (
              <div
                key={disp.docente_id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8B1515] dark:text-amber-400 block">
                      {doc.carrera_id} • {doc.especialidad}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {doc.nombre_completo}
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                    {disp.franjas.length} franjas IA
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {disp.franjas.map((f) => (
                    <div
                      key={f.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#002855] dark:text-amber-400" />
                      <span>
                        {f.dia} {f.hora_inicio}-{f.hora_fin}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleEliminarFranja(disp.docente_id, f.id)}
                        className="text-rose-500 hover:text-rose-700 ml-1 cursor-pointer"
                        title="Eliminar horario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 3: BANDEJA DE SOLICITUDES DE TUTORÍA */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> 3. Bandeja de Solicitudes y Reservas Estudiantiles
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
              Tutorías Emparejadas por IA ({tutoriasConfig.solicitudes.length})
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {tutoriasConfig.solicitudes.map((sol) => (
            <div
              key={sol.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      sol.estado === "confirmada"
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                        : sol.estado === "completada"
                        ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                        : "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {sol.estado}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    {sol.curso_nombre} ({sol.carrera_id})
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    • {sol.puntaje_match_ia}% Match IA
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Estudiante: <strong>{sol.estudiante_nombre}</strong> ({sol.estudiante_correo} •{" "}
                  Cód. {sol.codigo_estudiante}) → Docente: <strong>{sol.docente_nombre}</strong>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Horario Asignado:{" "}
                  <strong>
                    {sol.dia} ({sol.bloque_horario})
                  </strong>{" "}
                  • {sol.modalidad} • Tema: &ldquo;{sol.motivo_consulta}&rdquo;
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCambiarEstadoSolicitud(sol.id, "confirmada")}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => handleCambiarEstadoSolicitud(sol.id, "completada")}
                  className="px-3 py-1.5 rounded-xl bg-[#002855] hover:bg-[#001d3d] text-white text-xs font-bold transition cursor-pointer"
                >
                  Marcar Completada
                </button>
                <button
                  type="button"
                  onClick={() => handleEliminarSolicitud(sol.id)}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition cursor-pointer"
                  title="Eliminar solicitud"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
