import React from "react";

const ESCUDO_UNMSM_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UNMSM_coatofarms_seal.svg/320px-UNMSM_coatofarms_seal.svg.png";

export default function PortalLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
      {/* Barra de progreso superior animada */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
        <div className="h-full w-1/2 bg-gradient-to-r from-[#002855] via-red-600 to-amber-500 animate-pulse rounded-r-full" />
      </div>

      {/* Contenedor central con pulso del isotipo institucional */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center space-y-5">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-blue-500/10 dark:bg-blue-400/10 animate-ping absolute" />
          <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#0d1629] border-2 border-[#002855]/20 dark:border-blue-500/30 shadow-xl flex items-center justify-center p-3 relative z-10">
            <img
              src={ESCUDO_UNMSM_URL}
              alt="Cargando Portal FCM UNMSM"
              className="w-full h-full object-contain animate-pulse"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002855]/10 dark:bg-blue-950/70 text-[#002855] dark:text-blue-300 text-[10px] font-extrabold uppercase tracking-widest">
            <span>Facultad de Ciencias Matemáticas • UNMSM</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#002855] dark:text-white tracking-tight">
            Cargando Portal Académico Oficial...
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sincronizando planes de estudio 2026, plana docente y cronograma académico
          </p>
        </div>
      </div>

      <div className="py-3 text-center text-[10px] font-mono text-slate-400 dark:text-slate-500">
        COMPUTACIÓN CIENTÍFICA • MATEMÁTICA • ESTADÍSTICA • INVESTIGACIÓN OPERATIVA
      </div>
    </div>
  );
}
