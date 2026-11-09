"use client";

import React, { useState } from "react";
import { TicketSoporte, EstadoAtencion } from "../../types/portal";
import { Mail, CheckCircle, Clock, Trash2, Search, ExternalLink, Inbox } from "lucide-react";

interface AdminTicketsTabProps {
  tickets: TicketSoporte[];
  onCambiarEstadoTicket?: (id: string, nuevoEstado: EstadoAtencion) => void;
  onEliminarTicket?: (id: string) => void;
}

export function AdminTicketsTab({
  tickets,
  onCambiarEstadoTicket,
  onEliminarTicket,
}: AdminTicketsTabProps) {
  const [filtroEstado, setFiltroEstado] = useState<"todos" | EstadoAtencion>("todos");
  const [busqueda, setBusqueda] = useState("");

  const pendientesCount = tickets.filter((t) => t.estado_atencion === "pendiente").length;
  const enProcesoCount = tickets.filter((t) => t.estado_atencion === "en_proceso").length;
  const resueltosCount = tickets.filter((t) => t.estado_atencion === "resuelto").length;

  const ticketsFiltrados = tickets.filter((t) => {
    const cumpleFiltro = filtroEstado === "todos" ? true : t.estado_atencion === filtroEstado;
    const term = busqueda.toLowerCase().trim();
    const cumpleBusqueda =
      !term ||
      t.asunto.toLowerCase().includes(term) ||
      t.mensaje.toLowerCase().includes(term) ||
      (t.nombre && t.nombre.toLowerCase().includes(term)) ||
      (t.email && t.email.toLowerCase().includes(term));
    return cumpleFiltro && cumpleBusqueda;
  });

  return (
    <div className="space-y-6 view-transition-gpu">
      {/* Encabezado y Métricas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#002855] dark:text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#8B1515]" />
              Bandeja de Tickets y Soporte Estudiantil
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Consultas remitidas desde el Formulario de Mesa de Ayuda del portal oficial.
            </p>
          </div>

          {/* Métricas rápidas */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
              Total: {tickets.length}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-xs font-bold text-amber-700 dark:text-amber-400">
              Pendientes: {pendientesCount}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs font-bold text-blue-700 dark:text-blue-400">
              En proceso: {enProcesoCount}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              Resueltos: {resueltosCount}
            </span>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFiltroEstado("todos")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filtroEstado === "todos"
                  ? "bg-[#002855] text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Todos ({tickets.length})
            </button>
            <button
              type="button"
              onClick={() => setFiltroEstado("pendiente")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filtroEstado === "pendiente"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Pendientes ({pendientesCount})
            </button>
            <button
              type="button"
              onClick={() => setFiltroEstado("en_proceso")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filtroEstado === "en_proceso"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              En proceso ({enProcesoCount})
            </button>
            <button
              type="button"
              onClick={() => setFiltroEstado("resuelto")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filtroEstado === "resuelto"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Resueltos ({resueltosCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por alumno, correo o asunto..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#002855]"
            />
          </div>
        </div>
      </div>

      {/* Lista de Tickets */}
      {ticketsFiltrados.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No hay tickets en este estado
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {busqueda ? "Prueba cambiando el término de búsqueda." : "Los mensajes enviados por estudiantes aparecerán aquí."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ticketsFiltrados.map((t) => {
            const esPendiente = t.estado_atencion === "pendiente";
            const esEnProceso = t.estado_atencion === "en_proceso";
            const esResuelto = t.estado_atencion === "resuelto";

            const mailtoUrl = `mailto:${t.email}?subject=${encodeURIComponent(
              `Re: [FCM UNMSM] ${t.asunto}`
            )}&body=${encodeURIComponent(
              `Estimado(a) ${t.nombre || "Estudiante"},\n\nEn atención a su consulta recibida en la Mesa de Ayuda de la Facultad de Ciencias Matemáticas:\n\n> "${t.mensaje}"\n\n[Escriba aquí su respuesta institucional]\n\nAtentamente,\nDecanato / Mesa de Ayuda FCM - UNMSM`
            )}`;

            return (
              <div
                key={t.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 transition hover:border-[#002855]/40"
              >
                {/* Cabecera del ticket */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        esPendiente
                          ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          : esEnProceso
                          ? "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                          : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                      }`}
                    >
                      {esPendiente ? (
                        <>
                          <Clock className="w-3 h-3" /> Pendiente
                        </>
                      ) : esEnProceso ? (
                        <>
                          <Clock className="w-3 h-3 text-blue-500" /> En proceso
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3" /> Resuelto
                        </>
                      )}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {t.fecha || "Fecha reciente"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Botón Responder por Email */}
                    <a
                      href={mailtoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition"
                      title="Abrir cliente de correo para responder a este estudiante"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Responder al Alumno
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>

                    {/* Botones de Cambio de Estado */}
                    {onCambiarEstadoTicket && (
                      <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
                        {esPendiente && (
                          <button
                            type="button"
                            onClick={() => onCambiarEstadoTicket(t.id, "en_proceso")}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                          >
                            Atendiendo
                          </button>
                        )}
                        {!esResuelto ? (
                          <button
                            type="button"
                            onClick={() => onCambiarEstadoTicket(t.id, "resuelto")}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                          >
                            Resolver
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onCambiarEstadoTicket(t.id, "pendiente")}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                          >
                            Reabrir
                          </button>
                        )}
                      </div>
                    )}

                    {/* Botón Eliminar */}
                    {onEliminarTicket && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`¿Eliminar ticket de "${t.nombre || t.email}"?`)) {
                            onEliminarTicket(t.id);
                          }
                        }}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                        title="Eliminar ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Remitente y Asunto */}
                <div>
                  <h3 className="font-extrabold text-base text-[#002855] dark:text-white">
                    {t.asunto}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>
                      Remitente:{" "}
                      <strong className="text-slate-800 dark:text-slate-200">
                        {t.nombre || "Estudiante FCM"}
                      </strong>
                    </span>
                    <span>•</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">
                      {t.email}
                    </span>
                  </div>
                </div>

                {/* Mensaje */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800/80 whitespace-pre-wrap">
                  {t.mensaje}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

