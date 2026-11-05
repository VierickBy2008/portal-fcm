"use client";

import React from "react";
import { CheckCircle2, Mail, Share2 } from "lucide-react";
import { Facebook, Instagram, Youtube } from "@/app/utils/portalFormatters";

interface FormContactoState {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  bot_trap: string;
}

interface ContactoViewProps {
  formContacto: FormContactoState;
  setFormContacto: React.Dispatch<React.SetStateAction<FormContactoState>>;
  ticketEnviadoOk: boolean;
  setTicketEnviadoOk: (v: boolean) => void;
  handleEnviarContacto: (e: React.FormEvent) => void;
}

export function ContactoView({
  formContacto,
  setFormContacto,
  ticketEnviadoOk,
  setTicketEnviadoOk,
  handleEnviarContacto,
}: ContactoViewProps) {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 view-transition-gpu">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-5 space-y-4">
          <span className="text-xs font-bold uppercase text-red-700">
            Directorio Telefónico e Institucional FCM
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#002855] dark:text-white">
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
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#002855] dark:text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-700" /> {item.area}
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/70 border dark:border-red-800/60 px-2 py-0.5 rounded">
                    {item.anexo}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300">{item.correo}</p>
              </div>
            ))}

            {/* Redes Sociales y Canales Oficiales FCM */}
            <div className="rounded-2xl border border-blue-200 dark:border-slate-800 bg-gradient-to-br from-blue-50/60 to-white dark:from-slate-900 dark:to-slate-900 p-4 shadow-xs space-y-2.5">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-blue-200 dark:border-slate-700 text-xs font-bold transition-all shadow-2xs hover:scale-102"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/facultaddecienciasmatematicas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-pink-700 hover:text-white border border-pink-200 dark:border-slate-700 text-xs font-bold transition-all shadow-2xs hover:scale-102"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.youtube.com/@fcmunmsm/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-[#FF0000] text-red-700 hover:text-white border border-red-200 dark:border-slate-700 text-xs font-bold transition-all shadow-2xs hover:scale-102"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-xl font-bold text-[#002855] dark:text-white">
              Formulario de Soporte Estudiantil
            </h2>
            {ticketEnviadoOk ? (
              <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ¡Consulta enviada correctamente!
                </h3>
                <button
                  onClick={() => setTicketEnviadoOk(false)}
                  className="px-4 py-2 rounded-xl bg-[#002855] text-xs font-bold text-white cursor-pointer"
                >
                  Enviar otro mensaje
                </button>
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
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#002855] dark:focus:border-blue-500"
                  />
                  <input
                    type="email"
                    required
                    value={formContacto.email}
                    onChange={(e) => setFormContacto({ ...formContacto, email: e.target.value })}
                    placeholder="Correo institucional (@unmsm.edu.pe) *"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#002855] dark:focus:border-blue-500"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={formContacto.asunto}
                  onChange={(e) => setFormContacto({ ...formContacto, asunto: e.target.value })}
                  placeholder="Asunto de la consulta *"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#002855] dark:focus:border-blue-500"
                />
                <textarea
                  rows={4}
                  required
                  value={formContacto.mensaje}
                  onChange={(e) => setFormContacto({ ...formContacto, mensaje: e.target.value })}
                  placeholder="Describe tu solicitud..."
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#002855] dark:focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#002855] hover:bg-blue-900 text-xs font-bold text-white cursor-pointer"
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
