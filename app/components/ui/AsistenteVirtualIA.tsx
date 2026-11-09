"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  ExternalLink,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import type {
  AsistenteIAConfig,
  CalendarioSemestralConfig,
  Carrera,
  CarreraId,
  CursoMalla,
  Docente,
} from "@/app/types/portal";

interface AsistenteVirtualIAProps {
  config: AsistenteIAConfig;
  calendario: CalendarioSemestralConfig;
  carreras: Carrera[];
  malla: CursoMalla[];
  docentes: Docente[];
  onExplorarCarrera?: (id: CarreraId) => void;
}

interface MensajeChat {
  id: string;
  emisor: "bot" | "usuario";
  texto: string;
  enlaceUrl?: string;
  enlaceTexto?: string;
  carreraAccion?: CarreraId;
}

function normalizarTexto(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function AsistenteVirtualIA({
  config,
  calendario,
  carreras,
  malla,
  docentes,
  onExplorarCarrera,
}: AsistenteVirtualIAProps) {
  const [abierto, setAbierto] = useState(false);
  const [inputPregunta, setInputPregunta] = useState("");
  const [pensando, setPensando] = useState(false);
  const [mensajes, setMensajes] = useState<MensajeChat[]>([
    {
      id: "msg-welcome",
      emisor: "bot",
      texto: config.mensaje_bienvenida,
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMensajes((prev) => {
      if (prev.length === 1 && prev[0].id === "msg-welcome") {
        return [{ id: "msg-welcome", emisor: "bot", texto: config.mensaje_bienvenida }];
      }
      return prev;
    });
  }, [config.mensaje_bienvenida]);

  useEffect(() => {
    if (abierto) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes, abierto]);

  if (!config.habilitado) return null;

  const generarRespuestaInteligente = (consultaRaw: string): Omit<MensajeChat, "id" | "emisor"> => {
    const q = normalizarTexto(consultaRaw);

    // 1. Buscar coincidencia en la base de conocimientos (FAQs configuradas desde el Panel Admin)
    let mejorFaq = null;
    let maxScore = 0;

    for (const faq of config.faqs) {
      const palabras = faq.palabras_clave
        .split(",")
        .map((p) => normalizarTexto(p))
        .filter(Boolean);
      const pregNorm = normalizarTexto(faq.pregunta);
      let score = 0;

      for (const pal of palabras) {
        if (pal && q.includes(pal)) score += 3;
      }
      if (pregNorm && q.includes(pregNorm)) score += 5;
      if (score > maxScore) {
        maxScore = score;
        mejorFaq = faq;
      }
    }

    if (mejorFaq && maxScore >= 2) {
      return {
        texto: mejorFaq.respuesta,
        enlaceUrl: mejorFaq.enlace_accion,
        enlaceTexto: mejorFaq.texto_enlace,
      };
    }

    // 2. Consultas automáticas en vivo del Calendario Académico 2026
    if (q.includes("calendario") || q.includes("cronograma") || q.includes("fecha") || q.includes("cuando")) {
      if (q.includes("matricula")) {
        const matI = calendario.actividades.find((a) => a.semestre === "2026-I" && a.actividad.toLowerCase().includes("matrícula regular"));
        const matII = calendario.actividades.find((a) => a.semestre === "2026-II" && a.actividad.toLowerCase().includes("matrícula regular"));
        return {
          texto: `📅 Fechas Oficiales de Matrícula Regular 2026 (SUM):\n• Semestre 2026-I: ${matI ? matI.fecha : "16 al 20 de marzo de 2026"}\n• Semestre 2026-II: ${matII ? matII.fecha : "10 al 14 de agosto de 2026"}\n\nRecuerda revisar la fecha límite para reactualización de matrícula en la sección de cronograma.`,
          enlaceUrl: "https://sum.unmsm.edu.pe/alumnoWebSum/login",
          enlaceTexto: "Ir al SUM UNMSM",
        };
      }

      if (q.includes("clase") || q.includes("inicio")) {
        const claI = calendario.actividades.find((a) => a.semestre === "2026-I" && a.actividad.toLowerCase().startsWith("clases"));
        const claII = calendario.actividades.find((a) => a.semestre === "2026-II" && a.actividad.toLowerCase().startsWith("clases"));
        return {
          texto: `🎓 Periodo de Clases 2026 (16 Semanas Lectivas):\n• Semestre 2026-I: ${claI ? claI.fecha : "Inicio: Lunes 30 de marzo / Término: Sábado 18 de julio"}\n• Semestre 2026-II: ${claII ? claII.fecha : "Inicio: Lunes 24 de agosto / Término: Sábado 12 de diciembre"}`,
        };
      }

      if (q.includes("examen") || q.includes("parcial") || q.includes("final") || q.includes("sustitutorio")) {
        return {
          texto: `📝 Periodo de Evaluaciones Oficiales:\n• Semestre 2026-I:\n  - Parciales: 18 al 22 de mayo\n  - Finales: 13 al 17 de julio\n  - Sustitutorios / Rezagados: 20 y 21 de julio\n• Semestre 2026-II:\n  - Parciales: 12 al 17 de octubre\n  - Finales: 07 al 12 de diciembre\n  - Sustitutorios: 14 al 16 de diciembre`,
        };
      }
    }

    // 3. Consultas sobre Carreras y Escuelas Profesionales
    for (const car of carreras) {
      const nombreNorm = normalizarTexto(car.nombre);
      const codigoNorm = normalizarTexto(car.codigo_escuela);
      if (q.includes(nombreNorm) || q.includes(codigoNorm) || (car.id === "computacion-cientifica" && (q.includes("computacion") || q.includes("hpc") || q.includes("software")))) {
        const totalCursos = malla.filter((m) => m.carrera_id === car.id).length;
        const especializaciones = car.pilares_bento?.join(", ") || "Áreas de especialidad oficial";
        return {
          texto: `🏛️ Escuela Profesional de ${car.nombre} (${car.codigo_escuela}):\n\n${car.descripcion.slice(0, 220)}...\n\n• Duración: 5 años (10 ciclos)\n• Grado: ${car.grado_academico}\n• Especialidades del Póster: ${especializaciones}\n• Asignaturas en Malla: ${totalCursos} registradas.`,
          carreraAccion: car.id,
        };
      }
    }

    // 4. Consultas sobre Catedráticos y Docentes
    if (q.includes("docente") || q.includes("profesor") || q.includes("catedra")) {
      const palabrasQ = q.split(" ").filter((p) => p.length > 3);
      const docenteEncontrado = docentes.find((d) => {
        const nomNorm = normalizarTexto(d.nombre_completo);
        const espNorm = normalizarTexto(d.especialidad);
        return palabrasQ.some((pal) => nomNorm.includes(pal) || espNorm.includes(pal));
      });

      if (docenteEncontrado) {
        return {
          texto: `👨‍🏫 Ficha de Cátedra:\n${docenteEncontrado.grado_academico} ${docenteEncontrado.nombre_completo}\n• Categoría: ${docenteEncontrado.categoria_docente} (${docenteEncontrado.condicion})\n• Especialidad: ${docenteEncontrado.especialidad}\n• Correo: ${docenteEncontrado.correo}\n• Asesoría: ${docenteEncontrado.horario_asesoria}`,
          enlaceUrl: docenteEncontrado.cti_vitae_url || undefined,
          enlaceTexto: docenteEncontrado.cti_vitae_url ? "Ver CTI Vitae CONCYTEC" : undefined,
        };
      }

      return {
        texto: `Puedes consultar la plana docente completa de las 4 escuelas profesionales en la sección de Docentes de la facultad, incluyendo horarios de asesoría y valoraciones estudiantiles.`,
      };
    }

    // Respuesta General si no hubo coincidencia exacta
    return {
      texto: `Disculpa, no encontré una respuesta exacta para "${consultaRaw}". Puedo ayudarte con:\n• Fechas de matrícula, clases y exámenes del Calendario 2026.\n• Información y mallas de Computación Científica, Matemática, Estadística e Investigación Operativa.\n• Horarios de asesoría de docentes o trámites del SUM.`,
    };
  };

  const enviarConsulta = async (textoPregunta: string) => {
    const limpia = textoPregunta.trim();
    if (!limpia || pensando) return;

    const userMsg: MensajeChat = {
      id: `usr-${Date.now()}`,
      emisor: "usuario",
      texto: limpia,
    };

    setMensajes((prev) => [...prev, userMsg]);
    setInputPregunta("");
    setPensando(true);

    try {
      // 1. Intentar responder vía backend seguro con Google Gemini (opción 2)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensaje: limpia,
          historial: mensajes.slice(-4).map((m) => ({ emisor: m.emisor, texto: m.texto })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.ok && typeof data.texto === "string" && data.texto.trim()) {
          const botMsg: MensajeChat = {
            id: `bot-${Date.now()}`,
            emisor: "bot",
            texto: data.texto,
            carreraAccion: data.carreraAccion,
          };
          setMensajes((prev) => [...prev, botMsg]);
          setPensando(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Fallo en conexión con Gemini API, usando motor de respaldo local:", err);
    }

    // 2. Respaldo Inteligente Automático (Cero caídas):
    // Si la API no tiene clave o no responde, responde de inmediato con el motor local
    setTimeout(() => {
      const respuesta = generarRespuestaInteligente(limpia);
      const botMsg: MensajeChat = {
        id: `bot-${Date.now()}`,
        emisor: "bot",
        ...respuesta,
      };
      setMensajes((prev) => [...prev, botMsg]);
      setPensando(false);
    }, 300);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Ventana Flotante del Chat */}
      {abierto && (
        <div className="mb-3 w-[320px] sm:w-[370px] h-[510px] rounded-3xl border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden modal-content-gpu">
          {/* Cabecera del Chat */}
          <div className="bg-gradient-to-r from-[#002855] to-blue-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-white/15">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-amber-300 shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1.5 leading-tight">
                  <span>{config.nombre_bot}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[10px] text-blue-100">{config.subtitulo_bot}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setMensajes([
                    {
                      id: "msg-welcome",
                      emisor: "bot",
                      texto: config.mensaje_bienvenida,
                    },
                  ])
                }
                title="Reiniciar conversación"
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                title="Cerrar asistente"
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Historial de Mensajes */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[300px] bg-slate-50/90 dark:bg-slate-950/80">
            {mensajes.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.emisor === "usuario" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    m.emisor === "usuario"
                      ? "bg-[#002855] text-white rounded-br-xs shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 rounded-bl-xs shadow-2xs"
                  }`}
                >
                  {m.texto}

                  {m.enlaceUrl && (
                    <a
                      href={m.enlaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#002855] border border-blue-200 font-bold text-[11px] hover:underline dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                    >
                      <span>{m.enlaceTexto || "Abrir enlace oficial"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {m.carreraAccion && onExplorarCarrera && (
                    <button
                      type="button"
                      onClick={() => {
                        onExplorarCarrera(m.carreraAccion!);
                        setAbierto(false);
                      }}
                      className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-700 text-white font-bold text-[11px] hover:bg-red-800 cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Ver Malla Interactiva</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {pensando && (
              <div className="flex flex-col items-start animate-fade-in">
                <div className="rounded-2xl px-3.5 py-2 text-xs bg-white text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 rounded-bl-xs shadow-2xs flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Consultando a la IA...
                  </span>
                  <span className="inline-flex gap-1 ml-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Píldoras de Preguntas Rápidas */}
          {config.preguntas_rapidas.length > 0 && (
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {config.preguntas_rapidas.map((preg, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={pensando}
                  onClick={() => enviarConsulta(preg)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-bold transition-colors cursor-pointer dark:bg-slate-800 dark:hover:bg-blue-600 dark:text-blue-300 dark:border-slate-700 disabled:opacity-50"
                >
                  {preg}
                </button>
              ))}
            </div>
          )}

          {/* Formulario de Entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviarConsulta(inputPregunta);
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPregunta}
              onChange={(e) => setInputPregunta(e.target.value)}
              disabled={pensando}
              placeholder={pensando ? "Esperando respuesta de la IA..." : "Pregunta sobre matrícula, cursos, docentes..."}
              className="flex-1 rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#002855] dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-blue-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={pensando || !inputPregunta.trim()}
              className="gpu-btn p-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white cursor-pointer shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
              title="Enviar consulta"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Botón Flotante Principal del Asistente IA: SOLO ÍCONO DEL BOTSITO (CON VERSIÓN CLARA Y OSCURA) */}
      <button
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        className="gpu-btn group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white hover:bg-blue-50/90 text-[#002855] border-2 border-blue-200 hover:border-[#002855] dark:bg-gradient-to-r dark:from-[#002855] dark:via-blue-900 dark:to-red-900 dark:text-white dark:border-white/20 shadow-lg hover:shadow-2xl cursor-pointer transition-all"
        title="Asistente Virtual IA FCM"
        aria-label="Abrir Asistente Virtual IA"
      >
        <div className="relative flex items-center justify-center">
          {abierto ? (
            <X className="w-5 h-5 text-[#002855] dark:text-white" />
          ) : (
            <>
              <Bot className="w-6 h-6 text-[#002855] dark:text-amber-300 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#002855] shadow-xs" />
            </>
          )}
        </div>
      </button>
    </div>
  );
}
