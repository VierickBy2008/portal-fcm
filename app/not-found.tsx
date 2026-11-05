"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Home,
  Compass,
  BookOpen,
  Cpu,
  Sigma,
  BarChart3,
  Network,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

const ESCUDO_UNMSM_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UNMSM_coatofarms_seal.svg/320px-UNMSM_coatofarms_seal.svg.png";

export default function NotFoundPage() {
  const [busqueda, setBusqueda] = useState("");

  const handleBuscarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans transition-colors duration-300">
      {/* Franja superior institucional */}
      <div className="bg-red-700 text-white text-[11px] py-1.5 px-4 border-b border-red-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-semibold tracking-wide">
            UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS • FACULTAD DE CIENCIAS MATEMÁTICAS
          </span>
          <span className="hidden sm:inline font-mono">PORTAL ACADÉMICO OFICIAL • CÓDIGO HTTP 404</span>
        </div>
      </div>

      {/* Cuerpo central */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0b1324] shadow-2xl overflow-hidden relative">
          {/* Barra superior tricolor institucional */}
          <div className="h-2 w-full bg-gradient-to-r from-[#002855] via-red-700 to-amber-500" />

          <div className="p-6 sm:p-10 md:p-12 text-center space-y-6">
            {/* Escudo y código 404 animado */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-[#111c35] border border-slate-200 dark:border-slate-700/80 flex items-center justify-center p-3 shadow-md">
                  <img
                    src={ESCUDO_UNMSM_URL}
                    alt="Escudo Oficial UNMSM"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-red-700 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
                  404
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/70 text-red-700 dark:text-red-300 text-[11px] font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Recurso o Ruta Institucional No Encontrada</span>
              </div>
            </div>

            {/* Título y mensaje formal */}
            <div className="space-y-2 max-w-xl mx-auto">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#002855] dark:text-white">
                Página no encontrada en el Portal FCM
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                El enlace solicitado no existe, ha cambiado de ubicación dentro del Plan Curricular 2026 o fue movido al
                Repositorio Académico de la Facultad de Ciencias Matemáticas — UNMSM.
              </p>
            </div>

            {/* Buscador integrado de redirección */}
            <form onSubmit={handleBuscarSubmit} className="max-w-lg mx-auto">
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#070d19] border border-slate-300 dark:border-slate-700/80 focus-within:border-[#002855] dark:focus-within:border-blue-500 transition-colors">
                <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar asignatura, escuela profesional, sílabo o docente..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none py-2 px-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#002855] hover:bg-blue-900 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Ir al Portal
                </button>
              </div>
            </form>

            {/* Accesos rápidos a las 4 Escuelas Profesionales */}
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center justify-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Accesos Directos a las Escuelas Profesionales FCM</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left max-w-xl mx-auto">
                {[
                  {
                    codigo: "E.P. 14.5",
                    nombre: "Computación Científica",
                    icono: <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
                  },
                  {
                    codigo: "E.P. 14.1",
                    nombre: "Matemática",
                    icono: <Sigma className="w-4 h-4 text-red-600 dark:text-red-400" />,
                  },
                  {
                    codigo: "E.P. 14.2",
                    nombre: "Estadística",
                    icono: <BarChart3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
                  },
                  {
                    codigo: "E.P. 14.4",
                    nombre: "Investigación Operativa",
                    icono: <Network className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
                  },
                ].map((ep) => (
                  <Link
                    key={ep.codigo}
                    href="/"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#111c35]/70 hover:border-[#002855] dark:hover:border-blue-500/60 transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 shrink-0">
                      {ep.icono}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono font-bold text-slate-400">{ep.codigo}</span>
                      <span className="block text-xs font-bold text-[#002855] dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-blue-300 truncate">
                        {ep.nombre}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Botones principales de acción */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002855] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm shadow-lg transition-all"
              >
                <Home className="w-4 h-4 text-amber-300" />
                <span>Retornar a la Página de Inicio</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") window.history.back();
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver Atrás</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Pie institucional ligero */}
      <footer className="py-4 px-4 text-center text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-semibold text-[#002855] dark:text-slate-300">
            <BookOpen className="w-3.5 h-3.5 text-red-700 dark:text-red-400" />
            Facultad de Ciencias Matemáticas — UNMSM
          </span>
          <span>Ciudad Universitaria, Av. Venezuela cdra. 34, Lima - Perú</span>
        </div>
      </footer>
    </div>
  );
}
