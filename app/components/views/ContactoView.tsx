"use client";

import React from "react";
import { CheckCircle2, Mail, Share2, ExternalLink, Send } from "lucide-react";
import type { DisenoPortadaId } from "@/app/types/portal";
import { Facebook, Instagram, Youtube } from "@/app/utils/portalFormatters";

interface FormContactoState {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  bot_trap: string;
}

interface ContactoViewProps {
  disenoActivo?: DisenoPortadaId;
  formContacto: FormContactoState;
  setFormContacto: React.Dispatch<React.SetStateAction<FormContactoState>>;
  ticketEnviadoOk: boolean;
  setTicketEnviadoOk: (v: boolean) => void;
  handleEnviarContacto: (e: React.FormEvent) => void;
  ultimoTicketEnviado?: {
    nombre: string;
    email: string;
    asunto: string;
    mensaje: string;
  } | null;
}

export function ContactoView({
  disenoActivo = "bento_moderno",
  formContacto,
  setFormContacto,
  ticketEnviadoOk,
  setTicketEnviadoOk,
  handleEnviarContacto,
  ultimoTicketEnviado,
}: ContactoViewProps) {
  const esHarvard = disenoActivo === "harvard_editorial";
  const esAcademico = disenoActivo === "academico_moderno";

  const destinatarioDecanato = "decanato.matematicas@unmsm.edu.pe";
  const asuntoFinal = ultimoTicketEnviado?.asunto
    ? `[Mesa de Ayuda FCM] ${ultimoTicketEnviado.asunto}`
    : "[Mesa de Ayuda FCM] Consulta Estudiantil";

  const cuerpoEmail = `Estimado Decanato de la Facultad de Ciencias Matemáticas - UNMSM,

Por medio de la presente, me dirijo a su despacho para remitir la siguiente consulta a través de la Mesa de Ayuda del portal oficial:

--------------------------------------------------
ESTUDIANTE: ${ultimoTicketEnviado?.nombre || "Estudiante FCM"}
CORREO INSTITUCIONAL: ${ultimoTicketEnviado?.email || ""}
FECHA: ${new Date().toLocaleDateString("es-PE")}
ASUNTO: ${ultimoTicketEnviado?.asunto || ""}
--------------------------------------------------

DETALLE DE LA CONSULTA:
${ultimoTicketEnviado?.mensaje || ""}

--------------------------------------------------
Atentamente,
${ultimoTicketEnviado?.nombre || "Estudiante"}
Facultad de Ciencias Matemáticas
Universidad Nacional Mayor de San Marcos`;

  const urlGmailWeb = `https://mail.google.com/mail/?view=cm&fs=1&to=${destinatarioDecanato}&su=${encodeURIComponent(
    asuntoFinal
  )}&body=${encodeURIComponent(cuerpoEmail)}`;

  const urlMailto = `mailto:${destinatarioDecanato}?subject=${encodeURIComponent(
    asuntoFinal
  )}&body=${encodeURIComponent(cuerpoEmail)}`;

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 view-transition-gpu">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-5 space-y-4">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              esAcademico ? "text-[#8B1515] dark:text-amber-400" : "text-red-700"
            }`}
          >
            {esHarvard
              ? "SECRETARÍA ACADÉMICA Y DIRECTORIO DECANAL • FCM"
              : esAcademico
              ? "CAMPUS ACADÉMICO • SECRETARÍA Y ATENCIÓN ESTUDIANTIL"
              : "Directorio Telefónico e Institucional FCM"}
          </span>
          <h1
            className={`text-2xl sm:text-3xl font-bold text-[#002855] dark:text-white ${
              esHarvard ? "font-harvard-serif text-4xl" : ""
            }`}
          >
            Directorio y Mesa de Ayuda
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Central Telefónica UNMSM:{" "}
            <strong className="text-slate-900 dark:text-white">(01) 619-7000</strong>
          </p>
          <div className="space-y-3 pt-1">
            {[
              {
                area: "Decanato y Secretaría Académica",
                correo: "decanato.matematicas@unmsm.edu.pe",
                anexo: "Anexo 1401 / 1402",
              },
              {
                area: "Matrícula, Registros Académicos, Grados y Títulos",
                correo: "matricula.fcm@unmsm.edu.pe",
                anexo: "Anexo 1408",
              },
              {
                area: "Escuela Profesional de Computación Científica",
                correo: "epcc.matematicas@unmsm.edu.pe",
                anexo: "Anexo 1425",
              },
              {
                area: "CERSEU / SECOMAT / Unidad de Economía",
                correo: "economia.fcm@unmsm.edu.pe",
                anexo: "Anexos 1412 / 1420 / 1410",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-1 ${
                  esHarvard
                    ? "rounded-none border-l-4 border-l-[#8B1515] harvard-card-gpu"
                    : esAcademico
                    ? "rounded-xl border-l-4 border-l-[#8B1515] gpu-card"
                    : "rounded-2xl gpu-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-xs font-bold text-[#002855] dark:text-white flex items-center gap-2 ${
                      esHarvard ? "font-harvard-serif text-sm" : ""
                    }`}
                  >
                    <Mail className="w-4 h-4 text-red-700" /> {item.area}
                  </h3>
                  <span
                    className={`text-[11px] font-mono font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/70 border dark:border-red-800/60 px-2 py-0.5 ${
                      esHarvard ? "rounded-none" : "rounded"
                    }`}
                  >
                    {item.anexo}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300">{item.correo}</p>
              </div>
            ))}

            {/* Redes Sociales y Canales Oficiales FCM */}
            <div
              className={`border border-blue-200 dark:border-slate-800 bg-gradient-to-br from-blue-50/60 to-white dark:from-slate-900 dark:to-slate-900 p-4 shadow-xs space-y-2.5 ${
                esHarvard ? "rounded-none border-t-4 border-t-[#002855]" : "rounded-2xl"
              }`}
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-red-700" />
                <h3 className="text-xs font-bold text-[#002855] dark:text-white">
                  Redes Sociales y Canales Oficiales
                </h3>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Sigue las transmisiones en vivo de ceremonias, conferencias magistrales, eventos y comunicados:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="https://www.facebook.com/FacultadDeCienciasMatematicasOficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-blue-200 dark:border-slate-700 text-xs font-bold transition-all shadow-2xs hover:scale-102 ${
                    esHarvard ? "rounded-none" : "rounded-xl"
                  }`}
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/facultaddecienciasmatematicas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-pink-700 hover:text-white border border-pink-200 dark:border-slate-700 text-xs font-bold transition-all shadow-2xs hover:scale-102 ${
                    esHarvard ? "rounded-none" : "rounded-xl"
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.youtube.com/@fcmunmsm/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-[#FF0000] text-red-700 hover:text-white border border-red-200 dark:border-slate-700 text-xs font-bold transition-all shadow-2xs hover:scale-102 ${
                    esHarvard ? "rounded-none" : "rounded-xl"
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-7">
          <div
            className={`border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-5 ${
              esHarvard
                ? "rounded-none border-t-4 border-t-[#8B1515]"
                : "rounded-3xl"
            }`}
          >
            <h2
              className={`text-xl font-bold text-[#002855] dark:text-white ${
                esHarvard ? "font-harvard-serif text-2xl" : ""
              }`}
            >
              Formulario de Soporte Estudiantil
            </h2>
            {ticketEnviadoOk ? (
              <div
                className={`border border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 p-6 sm:p-8 text-center space-y-4 ${
                  esHarvard ? "rounded-none" : "rounded-3xl"
                } shadow-sm`}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-[#002855] dark:text-white">
                    ¡Consulta registrada en la Mesa de Ayuda!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Tu solicitud quedó respaldada en el sistema. Para que el <strong>Decanato de la FCM</strong> reciba tu correo institucional y te responda directamente, envíala con un solo clic:
                  </p>
                </div>

                {/* Destinatario institucional */}
                <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 max-w-md mx-auto text-xs text-slate-700 dark:text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-left sm:text-center">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    Destino Oficial Decanato:
                  </span>
                  <span className="font-mono font-bold text-[#8B1515] dark:text-rose-400">
                    {destinatarioDecanato}
                  </span>
                </div>

                {/* Botones de acción directa */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-lg mx-auto">
                  <a
                    href={urlGmailWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 bg-[#002855] hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    Enviar desde Gmail San Marcos (@unmsm.edu.pe)
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <a
                    href={urlMailto}
                    className="w-full sm:w-auto px-4 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    Otra App (Outlook / Mail)
                  </a>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setTicketEnviadoOk(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-semibold cursor-pointer"
                  >
                    ← Redactar otra consulta
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnviarContacto} className="space-y-4">
                {/* Campo Honeypot Anti-Bot (invisible para usuarios) */}
                <input
                  type="text"
                  name="bot_trap_field"
                  value={formContacto.bot_trap}
                  onChange={(e) => setFormContacto({ ...formContacto, bot_trap: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  style={{ display: "none" }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={formContacto.nombre}
                    onChange={(e) => setFormContacto({ ...formContacto, nombre: e.target.value })}
                    placeholder="Nombre completo *"
                    className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#002855] dark:focus:border-blue-500 ${
                      esHarvard ? "rounded-none" : "rounded-xl"
                    }`}
                  />
                  <input
                    type="email"
                    required
                    value={formContacto.email}
                    onChange={(e) => setFormContacto({ ...formContacto, email: e.target.value })}
                    placeholder="Correo institucional (@unmsm.edu.pe) *"
                    className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#002855] dark:focus:border-blue-500 ${
                      esHarvard ? "rounded-none" : "rounded-xl"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  required
                  value={formContacto.asunto}
                  onChange={(e) => setFormContacto({ ...formContacto, asunto: e.target.value })}
                  placeholder="Asunto de la consulta *"
                  className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#002855] dark:focus:border-blue-500 ${
                    esHarvard ? "rounded-none" : "rounded-xl"
                  }`}
                />
                <textarea
                  rows={4}
                  required
                  value={formContacto.mensaje}
                  onChange={(e) => setFormContacto({ ...formContacto, mensaje: e.target.value })}
                  placeholder="Describe tu solicitud..."
                  className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#002855] dark:focus:border-blue-500 ${
                    esHarvard ? "rounded-none" : "rounded-xl"
                  }`}
                />
                <button
                  type="submit"
                  className={`w-full py-3 text-xs font-bold text-white cursor-pointer gpu-btn ${
                    esHarvard
                      ? "rounded-none bg-[#8B1515] hover:bg-[#002855] uppercase tracking-wider"
                      : "rounded-xl bg-[#002855] hover:bg-blue-900"
                  }`}
                >
                  Enviar Mensaje a Soporte
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
