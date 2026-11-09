"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  GraduationCap,
  Lock,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  UserCheck,
  Video,
} from "lucide-react";
import type {
  Carrera,
  CarreraId,
  CursoMalla,
  DiaSemanaTutoria,
  DisponibilidadDocenteTutoria,
  Docente,
  FranjaHorariaTutoria,
  SolicitudTutoria,
  TutoriasIAConfig,
} from "@/app/types/portal";
import { TEMA_CARRERA } from "@/app/data/portalInitialData";

export interface TutoriasViewProps {
  tutoriasConfig: TutoriasIAConfig;
  onGuardarTutoriasConfig: (nuevo: TutoriasIAConfig) => Promise<void> | void;
  carreras: Carrera[];
  malla: CursoMalla[];
  docentes: Docente[];
  adminAutenticado: boolean;
  modoSimuladorAdmin: boolean;
  setModoSimuladorAdmin: (v: boolean) => void;
  onVolverInicio: () => void;
  onIrAdminTutorias: () => void;
  lanzarToast: (msg: string) => void;
}

type ModalidadTutoria = FranjaHorariaTutoria["modalidad"];

const DIAS_SEMANA: DiaSemanaTutoria[] = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const BLOQUES_HORARIOS_ESTUDIANTE = [
  { id: "manana", label: "Mañana (08:00 - 12:00)", inicio: 8, fin: 12 },
  { id: "mediodia", label: "Mediodía (12:00 - 14:00)", inicio: 12, fin: 14 },
  { id: "tarde", label: "Tarde (14:00 - 18:00)", inicio: 14, fin: 18 },
  { id: "noche", label: "Noche (18:00 - 20:00)", inicio: 18, fin: 20 },
] as const;

type BloqueHorarioId = (typeof BLOQUES_HORARIOS_ESTUDIANTE)[number]["id"];

interface RecomendacionIA {
  docente: Docente;
  disponibilidad: DisponibilidadDocenteTutoria;
  franjaOptima: FranjaHorariaTutoria;
  puntajeIA: number;
  justificacionIA: string;
  coincideDiaHoraExacta: boolean;
}

function parseHoraEntera(horaStr: string): number {
  const partes = horaStr.split(":");
  const h = parseInt(partes[0] || "10", 10);
  return Number.isNaN(h) ? 10 : h;
}

export function TutoriasView({
  tutoriasConfig,
  onGuardarTutoriasConfig,
  carreras,
  malla,
  docentes,
  adminAutenticado,
  modoSimuladorAdmin,
  setModoSimuladorAdmin,
  onVolverInicio,
  onIrAdminTutorias,
  lanzarToast,
}: TutoriasViewProps) {
  const [correoPreAviso, setCorreoPreAviso] = useState("");
  const [avisoEnviado, setAvisoEnviado] = useState(false);

  const [estudianteNombre, setEstudianteNombre] = useState("Estudiante Piloto FCM");
  const [estudianteCorreo, setEstudianteCorreo] = useState("alumno.fcm@unmsm.edu.pe");
  const [codigoEstudiante, setCodigoEstudiante] = useState("22140158");
  const [carreraSeleccionada, setCarreraSeleccionada] =
    useState<CarreraId>("computacion-cientifica");
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string>(
    "ANÁLISIS NUMÉRICO I"
  );
  const [diasSeleccionados, setDiasSeleccionados] = useState<DiaSemanaTutoria[]>([
    "Lunes",
    "Miércoles",
    "Jueves",
  ]);
  const [bloquesSeleccionados, setBloquesSeleccionados] = useState<BloqueHorarioId[]>([
    "manana",
    "tarde",
  ]);
  const [modalidadPreferida, setModalidadPreferida] = useState<
    "TODAS" | ModalidadTutoria
  >("TODAS");
  const [notasTema, setNotasTema] = useState(
    "Consulta sobre demostración de teoremas, resolución de ejercicios de examen parcial y orientación bibliográfica."
  );
  const [procesandoIA, setProcesandoIA] = useState(false);
  const [mostrarResultadosIA, setMostrarResultadosIA] = useState(true);
  const [franjaElegidaPorDocente, setFranjaElegidaPorDocente] = useState<
    Record<string, string>
  >({});

  const sistemaDesbloqueado =
    tutoriasConfig.acceso_publico_habilitado || modoSimuladorAdmin;

  const cursosDeCarrera = useMemo(() => {
    return malla.filter((c) => c.carrera_id === carreraSeleccionada);
  }, [malla, carreraSeleccionada]);

  const disponibilidadesCompletas = useMemo<DisponibilidadDocenteTutoria[]>(() => {
    const mapaConfig = new Map<string, DisponibilidadDocenteTutoria>();
    for (const disp of tutoriasConfig.disponibilidades) {
      mapaConfig.set(disp.docente_id, disp);
    }

    return docentes.map((doc, idx) => {
      const existente = mapaConfig.get(doc.id);
      if (existente) return existente;

      const diaDefault1: DiaSemanaTutoria = DIAS_SEMANA[idx % 5] || "Lunes";
      const diaDefault2: DiaSemanaTutoria = DIAS_SEMANA[(idx + 2) % 5] || "Miércoles";
      return {
        docente_id: doc.id,
        habilitado_tutoria: true,
        cupos_semanales: 4,
        temas_especialidad: doc.cursos_dictados?.length
          ? doc.cursos_dictados
          : [doc.especialidad],
        franjas: [
          {
            id: `auto-f1-${doc.id}`,
            dia: diaDefault1,
            hora_inicio: "10:00",
            hora_fin: "12:00",
            modalidad: "Presencial (Cubículo FCM)",
            ubicacion_detalle: "Cubículo Docente - Pabellón FCM",
          },
          {
            id: `auto-f2-${doc.id}`,
            dia: diaDefault2,
            hora_inicio: "15:00",
            hora_fin: "17:00",
            modalidad: "Virtual (Google Meet)",
            ubicacion_detalle: "Sala Institucional Google Meet (@unmsm.edu.pe)",
          },
        ],
      };
    });
  }, [docentes, tutoriasConfig.disponibilidades]);

  const recomendacionesIA = useMemo<RecomendacionIA[]>(() => {
    const resultados: RecomendacionIA[] = [];
    const cursoLower = cursoSeleccionado.toLowerCase();

    for (const disp of disponibilidadesCompletas) {
      if (!disp.habilitado_tutoria || disp.franjas.length === 0) continue;
      const doc = docentes.find((d) => d.id === disp.docente_id);
      if (!doc) continue;

      let mejorFranja = disp.franjas[0];
      let mejorPuntajeFranja = 0;
      let coincideDiaHoraExacta = false;

      for (const franja of disp.franjas) {
        let pts = 50;
        const coincideDia = diasSeleccionados.includes(franja.dia);
        const horaIni = parseHoraEntera(franja.hora_inicio);

        const coincideHora = bloquesSeleccionados.some((bId) => {
          const bloque = BLOQUES_HORARIOS_ESTUDIANTE.find((b) => b.id === bId);
          if (!bloque) return false;
          return horaIni >= bloque.inicio && horaIni < bloque.fin;
        });

        if (coincideDia && coincideHora) {
          pts += 32;
          coincideDiaHoraExacta = true;
        } else if (coincideDia) {
          pts += 18;
        } else if (coincideHora) {
          pts += 10;
        }

        if (modalidadPreferida === "TODAS" || franja.modalidad === modalidadPreferida) {
          pts += 6;
        }

        if (pts > mejorPuntajeFranja) {
          mejorPuntajeFranja = pts;
          mejorFranja = franja;
        }
      }

      let bonoAcademico = 0;
      if (doc.carrera_id === carreraSeleccionada) {
        bonoAcademico += 8;
      }
      const coincideMateria =
        disp.temas_especialidad.some(
          (m) =>
            m.toLowerCase().includes(cursoLower) || cursoLower.includes(m.toLowerCase())
        ) || doc.especialidad.toLowerCase().includes(cursoLower);

      if (coincideMateria) {
        bonoAcademico += 5;
      }

      const puntajeFinal = Math.min(99, Math.max(68, mejorPuntajeFranja + bonoAcademico));

      const razones: string[] = [];
      if (coincideDiaHoraExacta) {
        razones.push(
          `Emparejamiento horario exacto sin cruces el ${mejorFranja.dia} (${mejorFranja.hora_inicio} - ${mejorFranja.hora_fin})`
        );
      } else {
        razones.push(
          `Horario disponible más próximo el ${mejorFranja.dia} (${mejorFranja.hora_inicio} - ${mejorFranja.hora_fin})`
        );
      }

      if (doc.carrera_id === carreraSeleccionada) {
        razones.push(`Catedrático titular adscrito a tu Escuela Profesional`);
      }
      if (coincideMateria) {
        razones.push(`Alta afinidad temática con "${cursoSeleccionado}"`);
      } else {
        razones.push(`Especialista en ${doc.especialidad}`);
      }

      resultados.push({
        docente: doc,
        disponibilidad: disp,
        franjaOptima: mejorFranja,
        puntajeIA: puntajeFinal,
        justificacionIA: razones.join(" • "),
        coincideDiaHoraExacta,
      });
    }

    return resultados.sort((a, b) => b.puntajeIA - a.puntajeIA);
  }, [
    disponibilidadesCompletas,
    docentes,
    diasSeleccionados,
    bloquesSeleccionados,
    modalidadPreferida,
    carreraSeleccionada,
    cursoSeleccionado,
  ]);

  const toggleDia = (dia: DiaSemanaTutoria) => {
    setDiasSeleccionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const toggleBloque = (id: BloqueHorarioId) => {
    setBloquesSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const ejecutarMotorIA = () => {
    if (!estudianteCorreo.trim().toLowerCase().endsWith("@unmsm.edu.pe")) {
      lanzarToast("⚠️ El acceso requiere un correo institucional válido (@unmsm.edu.pe)");
      return;
    }
    if (diasSeleccionados.length === 0 || bloquesSeleccionados.length === 0) {
      lanzarToast(
        "⚠️ Selecciona al menos un día y un bloque horario libre para que la IA organice tu tutoría."
      );
      return;
    }
    setProcesandoIA(true);
    setTimeout(() => {
      setProcesandoIA(false);
      setMostrarResultadosIA(true);
      lanzarToast("🤖 IA FCM: Horarios analizados y ordenados por compatibilidad óptima.");
    }, 350);
  };

  const handleAgendarTutoria = async (rec: RecomendacionIA) => {
    if (!estudianteCorreo.trim().toLowerCase().endsWith("@unmsm.edu.pe")) {
      lanzarToast("⚠️ Debes ingresar un correo institucional @unmsm.edu.pe válido.");
      return;
    }
    if (!estudianteNombre.trim() || !codigoEstudiante.trim()) {
      lanzarToast("⚠️ Completa tu nombre y código de matrícula sanmarquino.");
      return;
    }

    const franjaIdSeleccionada =
      franjaElegidaPorDocente[rec.docente.id] || rec.franjaOptima.id;
    const franjaFinal =
      rec.disponibilidad.franjas.find((f) => f.id === franjaIdSeleccionada) ||
      rec.franjaOptima;

    const cursoObj = cursosDeCarrera.find((c) => c.nombre_curso === cursoSeleccionado);

    const nuevaSolicitud: SolicitudTutoria = {
      id: `tut-${Date.now()}`,
      estudiante_nombre: estudianteNombre.trim(),
      estudiante_correo: estudianteCorreo.trim().toLowerCase(),
      codigo_estudiante: codigoEstudiante.trim(),
      carrera_id: carreraSeleccionada,
      ciclo: cursoObj?.ciclo || 5,
      curso_id: cursoObj?.id || "fcm-gen",
      curso_nombre: cursoSeleccionado,
      docente_id: rec.docente.id,
      docente_nombre: rec.docente.nombre_completo,
      dia: franjaFinal.dia,
      bloque_horario: `${franjaFinal.hora_inicio} - ${franjaFinal.hora_fin}`,
      modalidad: franjaFinal.modalidad,
      motivo_consulta:
        notasTema.trim() || `Asesoría académica en ${cursoSeleccionado}`,
      estado: "pendiente",
      fecha_solicitud: new Date().toISOString().split("T")[0],
      puntaje_match_ia: rec.puntajeIA,
    };

    const nuevoConfig: TutoriasIAConfig = {
      ...tutoriasConfig,
      solicitudes: [nuevaSolicitud, ...tutoriasConfig.solicitudes],
    };

    await onGuardarTutoriasConfig(nuevoConfig);
    lanzarToast(
      `✅ Tutoría agendada con ${rec.docente.nombre_completo} (${franjaFinal.dia} ${franjaFinal.hora_inicio}-${franjaFinal.hora_fin})`
    );
  };

  // ============================================================================
  // VISTA 1: ACCESO PÚBLICO RESTRINGIDO (EN FASE DE HOMOLOGACIÓN OFICIAL)
  // ============================================================================
  if (!sistemaDesbloqueado) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060d1a] text-slate-900 dark:text-slate-100 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Barra Superior de Navegación + Control Exclusivo Admin */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onVolverInicio}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:border-[#002855] transition cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Portal Principal FCM
            </button>

            {adminAutenticado && (
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/40">
                <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Modo Admin Activo:
                </span>
                <button
                  type="button"
                  onClick={() => setModoSimuladorAdmin(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#002855] to-[#8B1515] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:opacity-95 transition cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-300" />
                  Probar Simulador Interactivo de Tutorías IA
                </button>
                <button
                  type="button"
                  onClick={onIrAdminTutorias}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:border-amber-500 transition cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#8B1515] dark:text-amber-400" />
                  Gestionar en Panel Admin
                </button>
              </div>
            )}
          </div>

          {/* Tarjeta Principal Institucional de Acceso Restringido */}
          <div className="rounded-3xl overflow-hidden border-2 border-[#002855]/25 dark:border-amber-500/30 bg-white dark:bg-slate-900 shadow-xl">
            <div className="relative bg-gradient-to-br from-[#002855] via-[#001833] to-[#8B1515] p-7 sm:p-10 text-white overflow-hidden">
              <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5" /> Servicio al Estudiante • Innovación FCM
                    </span>
                    <span className="px-3 py-1 rounded-full bg-rose-500/25 border border-rose-300/40 text-rose-200 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> Acceso Público Inhabilitado Temporalmente
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                    Sistema Automatizado de Tutorías Académicas con IA
                  </h1>
                  <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                    Plataforma algorítmica de emparejamiento inteligente de horarios entre
                    estudiantes y docentes consejeros de las cuatro Escuelas Profesionales de la
                    Facultad de Ciencias Matemáticas — UNMSM.
                  </p>
                </div>

                <div className="shrink-0 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-amber-400/40 p-5 max-w-xs w-full space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                      Estado del Módulo
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      ● En Homologación
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-sky-400 shrink-0" />
                    Base de Datos SUM &amp; Decanato FCM
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Semestre {tutoriasConfig.semestre_activo} • Sincronización oficial de padrón de
                    matrículas y carga lectiva docente en curso.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-8">
              <div className="rounded-2xl p-5 sm:p-6 bg-amber-50/90 dark:bg-amber-950/30 border-l-4 border-amber-500 flex flex-col sm:flex-row items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    ¿Por qué el acceso público se encuentra restringido en este momento?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {tutoriasConfig.mensaje_restriccion}
                  </p>
                  <p className="text-xs font-bold text-[#8B1515] dark:text-amber-300 pt-1">
                    🔒 Requisito obligatorio de seguridad: Ningún usuario externo puede consultar ni
                    reservar horarios docentes sin validación oficial de matrícula vigente y correo
                    institucional ({tutoriasConfig.dominio_autorizado}) provisto por la Facultad.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-6 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#002855] dark:text-blue-300">
                        <Lock className="w-3.5 h-3.5" /> Pasarela Institucional UNMSM
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        SSO {tutoriasConfig.dominio_autorizado}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Validación de Credenciales Estudiantiles
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      El inicio de sesión directo estará disponible en cuanto el Decanato de la FCM
                      habilite la conexión con la base de datos oficial de alumnos matriculados.
                    </p>

                    <div className="space-y-3 opacity-75">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                          Correo Institucional Sanmarquino:
                        </label>
                        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-200/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-500 text-xs font-mono">
                          <Mail className="w-4 h-4 shrink-0" />
                          <span>estudiante.fcm@unmsm.edu.pe</span>
                          <Lock className="w-3.5 h-3.5 ml-auto text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                          Código Único de Matrícula (SUM):
                        </label>
                        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-200/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-500 text-xs font-mono">
                          <GraduationCap className="w-4 h-4 shrink-0" />
                          <span>•••••••• (Validación Padrón FCM)</span>
                          <Lock className="w-3.5 h-3.5 ml-auto text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    {!avisoEnviado ? (
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                          Recibir aviso cuando la Facultad habilite el padrón oficial:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={correoPreAviso}
                            onChange={(e) => setCorreoPreAviso(e.target.value)}
                            placeholder="tucorreo@unmsm.edu.pe"
                            className="flex-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#002855]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!correoPreAviso.trim().toLowerCase().endsWith("@unmsm.edu.pe")) {
                                lanzarToast("⚠️ Ingresa un correo @unmsm.edu.pe para notificarte.");
                                return;
                              }
                              setAvisoEnviado(true);
                              lanzarToast(
                                "✅ Correo registrado para notificación de apertura oficial."
                              );
                            }}
                            className="px-3.5 py-2 rounded-xl bg-[#002855] hover:bg-[#001d3d] text-white text-xs font-extrabold transition cursor-pointer shrink-0"
                          >
                            Notificarme
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Te notificaremos en {correoPreAviso} al activarse la base de datos oficial.
                      </div>
                    )}

                    {adminAutenticado && (
                      <button
                        type="button"
                        onClick={() => setModoSimuladorAdmin(true)}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                      >
                        <Bot className="w-4 h-4" />
                        Entrar al Simulador de Pruebas (Solo Admin)
                      </button>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8B1515] dark:text-amber-400 block mb-1">
                      Arquitectura Lista para Producción Oficial
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      ¿Cómo funciona el Sistema Automatizado de Tutorías con IA?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      El módulo ya cuenta con el motor algorítmico completo para organizar y
                      asignar tutorías automáticamente en cuanto la Facultad conecte la base de
                      datos oficial:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                        1. Emparejamiento Horario por IA
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        El estudiante marca sus horas libres de lunes a sábado y la asignatura que
                        necesita reforzar; la IA cruza la matriz de horarios docentes y recomienda
                        al profesor ideal sin cruces de horario.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-[#8B1515] dark:text-rose-400 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                        2. Validación con Base de Datos FCM
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Acceso blindado exclusivamente para alumnos con matrícula activa verificada
                        en el SUM y correo institucional <code>@unmsm.edu.pe</code>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                        3. Organización Automática de Cupos
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Control automático de cupos semanales por docente, evitando sobrecarga de
                        horarios y distribuyendo equitativamente las asesorías por escuela.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Video className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                        4. Modalidad Híbrida (Cubículo / Meet)
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Permite seleccionar tutorías presenciales en los cubículos docentes de la
                        FCM o sesiones síncronas vía Google Meet Institucional.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VISTA 2: SISTEMA INTERACTIVO DE TUTORÍAS CON IA (SIMULADOR ADMIN O PILOTO ABIERTO)
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060d1a] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onVolverInicio}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Portal
            </button>

            {modoSimuladorAdmin && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-extrabold">
                <Bot className="w-4 h-4" />
                MODO SIMULADOR DE PRUEBA (VISTA DE ESTUDIANTE AUTENTICADO)
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {modoSimuladorAdmin && (
              <button
                type="button"
                onClick={() => setModoSimuladorAdmin(false)}
                className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#8B1515] dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-extrabold flex items-center gap-1.5 hover:bg-rose-100 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                Ver Pantalla Pública Bloqueada
              </button>
            )}
            {adminAutenticado && (
              <button
                type="button"
                onClick={onIrAdminTutorias}
                className="px-3.5 py-2 rounded-xl bg-[#002855] text-white text-xs font-extrabold flex items-center gap-1.5 hover:bg-[#001d3d] transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-300" />
                Panel Admin de Tutorías IA
              </button>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-to-r from-[#002855] via-[#001833] to-[#8B1515] p-6 sm:p-8 text-white shadow-lg border border-amber-400/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Motor de Organización Automática con IA
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" /> Sesión Institucional @unmsm.edu.pe
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Asignación Inteligente de Tutorías y Disponibilidad Docente
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Selecciona tu Escuela Profesional, la asignatura de consulta y tus bloques horarios
              libres. Nuestra IA cruzará tu disponibilidad con la base de datos de docentes de la
              FCM para asignarte el mejor horario sin cruces.
            </p>
          </div>

          <div className="shrink-0 grid grid-cols-2 gap-3 bg-slate-950/50 p-4 rounded-2xl border border-white/15 text-center">
            <div>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-300 block">
                {disponibilidadesCompletas.filter((d) => d.habilitado_tutoria).length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-blue-100 font-bold">
                Docentes Activos
              </span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-300 block">
                {tutoriasConfig.solicitudes.length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-blue-100 font-bold">
                Tutorías Registradas
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLUMNA IZQUIERDA (5 cols): CREDENCIALES Y DISPONIBILIDAD DEL ESTUDIANTE */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8B1515] dark:text-amber-400 block">
                Paso 1 • Datos y Disponibilidad del Estudiante
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                Configura tu Horario Libre para la IA
              </h2>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#002855] dark:text-blue-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Credencial Institucional UNMSM
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                  Verificado
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Nombre del Estudiante:
                  </label>
                  <input
                    type="text"
                    value={estudianteNombre}
                    onChange={(e) => setEstudianteNombre(e.target.value)}
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Código de Matrícula:
                  </label>
                  <input
                    type="text"
                    value={codigoEstudiante}
                    onChange={(e) => setCodigoEstudiante(e.target.value)}
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Correo Institucional Obligatorio (@unmsm.edu.pe):
                </label>
                <input
                  type="email"
                  value={estudianteCorreo}
                  onChange={(e) => setEstudianteCorreo(e.target.value)}
                  className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1.5">
                  1. Escuela Profesional FCM:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {carreras.map((car) => {
                    const activo = carreraSeleccionada === car.id;
                    const tema = TEMA_CARRERA[car.id];
                    return (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => {
                          setCarreraSeleccionada(car.id);
                          const primerCurso = malla.find((c) => c.carrera_id === car.id);
                          if (primerCurso) setCursoSeleccionado(primerCurso.nombre_curso);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          activo
                            ? "border-[#002855] dark:border-amber-400 bg-blue-50/60 dark:bg-slate-800 shadow-xs"
                            : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-[10px] font-extrabold uppercase tracking-wider block text-[#8B1515] dark:text-amber-400">
                          {car.codigo_escuela} • {tema?.badgeSolid ? "FCM" : ""}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {car.nombre.replace("E.P. de ", "")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1.5">
                  2. Asignatura o Línea de Tutoría Requerida:
                </label>
                <select
                  value={cursoSeleccionado}
                  onChange={(e) => setCursoSeleccionado(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#002855]"
                >
                  {cursosDeCarrera.map((c) => (
                    <option key={c.id} value={c.nombre_curso}>
                      Ciclo {c.ciclo} • {c.nombre_curso}
                    </option>
                  ))}
                  <option value="Orientación de Tesis e Investigación Científica">
                    Orientación de Tesis e Investigación Científica
                  </option>
                  <option value="Nivelación en Cálculo y Análisis Matemático">
                    Nivelación en Cálculo y Análisis Matemático
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1.5">
                3. Tus Días con Disponibilidad Horaria:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DIAS_SEMANA.map((dia) => {
                  const activo = diasSeleccionados.includes(dia);
                  return (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => toggleDia(dia)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                        activo
                          ? "bg-[#002855] text-white border-[#002855] shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {activo ? "✓ " : ""}
                      {dia}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1.5">
                4. Tus Franjas Horarias Libres (Sin cruce de clases):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BLOQUES_HORARIOS_ESTUDIANTE.map((bloque) => {
                  const activo = bloquesSeleccionados.includes(bloque.id);
                  return (
                    <button
                      key={bloque.id}
                      type="button"
                      onClick={() => toggleBloque(bloque.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                        activo
                          ? "bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        {bloque.label}
                      </span>
                      {activo && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1">
                  5. Modalidad Preferida:
                </label>
                <select
                  value={modalidadPreferida}
                  onChange={(e) =>
                    setModalidadPreferida(e.target.value as "TODAS" | ModalidadTutoria)
                  }
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="TODAS">Indistinto (Presencial Cubículo o Google Meet)</option>
                  <option value="Presencial (Cubículo FCM)">Solo Presencial (Cubículo FCM)</option>
                  <option value="Virtual (Google Meet)">Solo Virtual (Google Meet)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1">
                  6. Motivo o Tema Específico de la Tutoría:
                </label>
                <textarea
                  rows={2}
                  value={notasTema}
                  onChange={(e) => setNotasTema(e.target.value)}
                  placeholder="Describe los temas o problemas que deseas consultar con el docente..."
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={ejecutarMotorIA}
              disabled={procesandoIA}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#002855] via-[#001d3d] to-[#8B1515] hover:opacity-95 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <Bot className="w-5 h-5 text-amber-300" />
              {procesandoIA
                ? "Analizando Matriz de Horarios con IA..."
                : "🤖 Organizar y Buscar Profesor Compatible con IA"}
            </button>
          </div>

          {/* COLUMNA DERECHA (7 cols): RECOMENDACIONES DEL MOTOR IA Y SOLICITUDES AGENDADAS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Paso 2 • Ranking Algorítmico de Catedráticos
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                    Profesores y Horarios Optimizados por IA ({recomendacionesIA.length})
                  </h2>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#002855] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Ordenado por % Match sin cruce
                </span>
              </div>

              {mostrarResultadosIA && recomendacionesIA.length > 0 ? (
                <div className="space-y-4">
                  {recomendacionesIA.slice(0, 5).map((rec, index) => {
                    const franjaSeleccionadaId =
                      franjaElegidaPorDocente[rec.docente.id] || rec.franjaOptima.id;

                    return (
                      <div
                        key={rec.docente.id}
                        className={`rounded-2xl p-5 border-2 transition-all ${
                          index === 0
                            ? "border-emerald-500/70 bg-emerald-50/20 dark:bg-emerald-950/15 shadow-sm"
                            : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <img
                              src={rec.docente.foto_url}
                              alt={rec.docente.nombre_completo}
                              className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-xs shrink-0"
                            />
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {index === 0 && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                                    ★ Mejor Opción IA
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#002855]/10 text-[#002855] dark:bg-blue-950 dark:text-blue-300">
                                  {rec.docente.grado_academico} • {rec.docente.categoria_docente}
                                </span>
                              </div>
                              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                                {rec.docente.nombre_completo}
                              </h3>
                              <p className="text-xs text-slate-600 dark:text-slate-300">
                                Especialidad: <strong>{rec.docente.especialidad}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
                            <span className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <Bot className="w-4 h-4" />
                              {rec.puntajeIA}% Match IA
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              {rec.coincideDiaHoraExacta
                                ? "✓ Sin cruce de horario"
                                : "Horario alternativo"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 p-3 rounded-xl bg-blue-50/70 dark:bg-slate-900 border border-blue-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-[#002855] dark:text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Análisis IA:</strong> {rec.justificacionIA}
                          </span>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1.5 flex-1">
                            <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400 block">
                              Selecciona el horario disponible del docente:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {rec.disponibilidad.franjas.map((franja) => {
                                const activa = franjaSeleccionadaId === franja.id;
                                return (
                                  <button
                                    key={franja.id}
                                    type="button"
                                    onClick={() =>
                                      setFranjaElegidaPorDocente((prev) => ({
                                        ...prev,
                                        [rec.docente.id]: franja.id,
                                      }))
                                    }
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer ${
                                      activa
                                        ? "bg-[#002855] text-white border-[#002855]"
                                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                                    }`}
                                  >
                                    <Calendar className="w-3.5 h-3.5" />
                                    {franja.dia} {franja.hora_inicio}-{franja.hora_fin}
                                    <span className="text-[10px] opacity-85">
                                      ({franja.modalidad.includes("Virtual") ? "Meet" : "Cubículo"})
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAgendarTutoria(rec)}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer shrink-0"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Reservar Tutoría
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                  Configura tus días libres a la izquierda y pulsa &ldquo;Organizar con IA&rdquo;.
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8B1515] dark:text-amber-400 block">
                    Historial Sincronizado con el Panel Admin
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Solicitudes de Tutoría Agendadas ({tutoriasConfig.solicitudes.length})
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {tutoriasConfig.solicitudes.map((sol) => (
                  <div
                    key={sol.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {sol.curso_nombre}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          ({sol.puntaje_match_ia}% Match IA)
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Docente: <strong>{sol.docente_nombre}</strong> • Horario:{" "}
                        <strong>
                          {sol.dia} ({sol.bloque_horario})
                        </strong>{" "}
                        • {sol.modalidad}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Estudiante: {sol.estudiante_nombre} ({sol.estudiante_correo}) — Código:{" "}
                        {sol.codigo_estudiante}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
