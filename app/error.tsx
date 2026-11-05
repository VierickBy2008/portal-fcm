"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ShieldCheck } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalPortalError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("[Portal FCM Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-12 font-sans transition-colors duration-300">
      <div className="max-w-xl w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1324] shadow-2xl overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-red-700 via-[#002855] to-amber-500" />

        <div className="p-7 sm:p-10 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangle className="w-8 h-8 text-red-700 dark:text-red-400" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#002855] dark:text-blue-300 text-[10px] font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Sistema de Resiliencia Institucional • FCM UNMSM
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#002855] dark:text-white">
              Interrupción temporal en la vista solicitada
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Se ha detectado una excepción inesperada al procesar este módulo. Tus datos locales y la conexión con el
              portal de la Facultad de Ciencias Matemáticas se encuentran protegidos.
            </p>
          </div>

          {error?.digest && (
            <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Código de diagnóstico: <span className="font-bold text-slate-700 dark:text-slate-200">{error.digest}</span>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-300" />
              <span>Intentar reconectar</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all"
            >
              <Home className="w-4 h-4 text-red-700 dark:text-red-400" />
              <span>Ir al Inicio del Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
