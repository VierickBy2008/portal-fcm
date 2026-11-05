"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Calendar,
  BookOpen,
  GraduationCap,
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

      if (pregNorm.includes(q) || q.includes(pregNorm)) {
        score += 5;
      }
      for (const kw of palabras) {
        if (kw && q.includes(kw)) {
          score += 3;
        } else {
          const tokens = kw.split(/\s+/).filter((t) => t.length > 3);
          for (const tk of tokens) {
            if (q.includes(tk)) score += 1;
          }
        }
      }
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

    // 2. Buscar en cursos de la Malla Curricular (por código o nombre)
    const cursoEncontrado = malla.find((c) => {
      const cod = normalizarTexto(c.codigo);
      const nom = normalizarTexto(c.nombre_curso);
      return (cod.length >= 4 && q.includes(cod)) || (nom.length >= 5 && q.includes(nom));
    });

    if (cursoEncontrado) {
      const esc = carreras.find((c) => c.id === cursoEncontrado.carrera_id);
      const prereqs =
        cursoEncontrado.prerequisitos.length > 0
          ? cursoEncontrado.prerequisitos.join(", ")
          : "Ninguno (curso de ingreso directo)";
      return {
        texto: `📚 Asignatura encontrada: [${cursoEncontrado.codigo}] ${cursoEncontrado.nombre_curso} • Escuela: ${esc?.nombre || cursoEncontrado.carrera_id} • Ciclo ${cursoEncontrado.ciclo} • ${cursoEncontrado.creditos} créditos (${cursoEncontrado.tipo_curso === "O" ? "Obligatorio" : "Electivo"}). Prerrequisitos: ${prereqs}.`,
        carreraAccion: cursoEncontrado.carrera_id,
      };
    }

    // 3. Buscar en la Plana Docente
    const docenteEncontrado = docentes.find((d) => {
      const nom = normalizarTexto(d.nombre_completo);
      const apellidos = nom.split(/\s+/).filter((w) => w.length > 3);
      return q.includes(nom) || apellidos.some((ap) => q.includes(ap));
    });

    if (docenteEncontrado) {
      return {
        texto: `👨‍🏫 ${docenteEncontrado.grado_academico} ${docenteEncontrado.nombre_completo} (${docenteEncontrado.categoria_docente} - ${docenteEncontrado.condicion}). Especialidad: ${docenteEncontrado.especialidad}. Horario de asesoría: ${docenteEncontrado.horario_asesoria}. Correo: ${docenteEncontrado.correo}.`,
      };
    }

    // 4. Buscar actividades específicas en el Calendario Semestral 2026-I / 2026-II
    const actsCoincidentes = calendario.actividades.filter((a) => {
      const actNorm = normalizarTexto(a.actividad);
      return (
        actNorm.includes(q) ||
        (q.includes("parcial") && actNorm.includes("parcial")) ||
        (q.includes("final") && actNorm.includes("final")) ||
        (q.includes("aplazado") && actNorm.includes("aplazado")) ||
        (q.includes("rectificacion") && actNorm.includes("rectificacion")) ||
        (q.includes("anulacion") && actNorm.includes("anulacion")) ||
        (q.includes("clases") && actNorm.includes("clases")) ||
        (q.includes("matricula") && actNorm.includes("matricula regular"))
      );
    });

    if (actsCoincidentes.length > 0) {
      const resumen = actsCoincidentes
        .slice(0, 4)
        .map((a) => `• [${a.semestre}] ${a.actividad}: ${a.fecha}`)
        .join("\n");
      return {
        texto: `📅 Según el Régimen Semestral Oficial 2026:\n${resumen}`,
      };
    }

    // 5. Buscar por Escuela Profesional
    const carreraMatch = carreras.find((c) => q.includes(normalizarTexto(c.nombre)));
    if (carreraMatch) {
      const esp =
        carreraMatch.pilares_bento && carreraMatch.pilares_bento.length > 0
          ? carreraMatch.pilares_bento.join(", ")
          : "Ver póster oficial";
      return {
        texto: `🏛️ Escuela Profesional de ${carreraMatch.nombre} (${carreraMatch.codigo_escuela}): Otorga el grado de ${carreraMatch.grado_academico} y título de ${carreraMatch.titulo_profesional}. Líneas de especialización del póster: ${esp}.`,
        carreraAccion: carreraMatch.id,
      };
    }

    // Respuesta orientativa por defecto
    return {
      texto:
        "Puedo ayudarte con fechas exactas del Régimen Semestral 2026-I y 2026-II (matrícula, clases, parciales, finales, aplazados), especializaciones de las 4 escuelas (Matemática, Estadística, Investigación Operativa y Computación Científica), prerrequisitos de cursos por código (ej. CS112, 2314131) o información de docentes.",
    };
  };

  const enviarConsulta = (textoConsulta: string) => {
    const limpio = textoConsulta.trim();
    if (!limpio) return;

    const msgUser: MensajeChat = {
      id: `usr-${Date.now()}`,
      emisor: "usuario",
      texto: limpio,
    };

    const respuesta = generarRespuestaInteligente(limpio);
    const msgBot: MensajeChat = {
      id: `bot-${Date.now() + 1}`,
      emisor: "bot",
      ...respuesta,
    };

    setMensajes((prev) => [...prev, msgUser, msgBot]);
    setInputPregunta("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Panel de Chat Abierto */}
      {abierto && (
        <div className="mb-3 w-[340px] sm:w-[390px] max-h-[540px] rounded-3xl border-2 border-blue-900/80 dark:border-blue-700/80 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col modal-content-gpu">
          {/* Cabecera del Chatbot */}
          <div className="bg-gradient-to-r from-[#002855] via-blue-900 to-red-800 text-white px-4 py-3.5 flex items-center justify-between border-b border-white/15">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/25 flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold leading-tight flex items-center gap-1.5">
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
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[310px] bg-slate-50/70 dark:bg-slate-950/60">
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
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs shadow-2xs"
                  }`}
                >
                  {m.texto}

                  {m.enlaceUrl && (
                    <a
                      href={m.enlaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#002855] dark:text-blue-300 font-bold text-[11px] border border-blue-200 dark:border-blue-800 hover:underline"
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
                      className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-700 text-white font-bold text-[11px] hover:bg-red-800 cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Ver Malla Interactiva</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Píldoras de Preguntas Rápidas */}
          {config.preguntas_rapidas.length > 0 && (
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {config.preguntas_rapidas.map((preg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => enviarConsulta(preg)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 hover:bg-[#002855] hover:text-white dark:hover:bg-blue-600 text-[#002855] dark:text-blue-300 border border-blue-200 dark:border-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
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
              placeholder="Pregunta sobre matrícula, cursos, docentes..."
              className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#002855]"
            />
            <button
              type="submit"
              className="gpu-btn p-2.5 rounded-xl bg-[#002855] hover:bg-red-700 text-white cursor-pointer"
              title="Enviar consulta"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Botón Flotante Principal del Asistente IA */}
      <button
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        className="gpu-btn group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#002855] via-blue-900 to-red-800 text-white shadow-xl hover:shadow-2xl border-2 border-white/25 cursor-pointer"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-amber-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#002855]" />
        </div>
        <span className="text-xs font-bold tracking-wide hidden sm:inline">
          Asistente IA FCM
        </span>
      </button>
    </div>
  );
}
