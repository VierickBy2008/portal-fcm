"use client";

import React from "react";

export function HeroSkeleton() {
  return (
    <section
      aria-label="Cargando portada institucional"
      className="relative overflow-hidden border-b border-blue-950 bg-[#0b1324] text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
        <div className="max-w-4xl space-y-5 animate-pulse">
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-6 w-36 rounded-full bg-slate-700/70" />
            <div className="h-6 w-48 rounded-full bg-slate-800/80" />
          </div>
          <div className="space-y-3">
            <div className="h-10 sm:h-12 w-11/12 rounded-2xl bg-slate-700/80" />
            <div className="h-10 sm:h-12 w-3/4 rounded-2xl bg-slate-800/80" />
          </div>
          <div className="h-4 sm:h-5 w-4/5 rounded-lg bg-slate-700/60" />
          <div className="pt-2">
            <div className="h-14 w-full max-w-2xl rounded-2xl bg-slate-800/90 border border-slate-700/60" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-2xl">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="h-14 rounded-xl bg-slate-800/70 border border-slate-700/50" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function BentoSkeleton() {
  return (
    <div
      aria-label="Cargando escuelas profesionales"
      className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse"
    >
      {[1, 2, 3, 4].map((cardIdx) => (
        <div
          key={cardIdx}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1629] overflow-hidden shadow-md"
        >
          {/* Barra superior */}
          <div className="h-11 px-5 bg-slate-200 dark:bg-slate-800/90 flex items-center justify-between">
            <div className="h-4 w-28 rounded bg-slate-300 dark:bg-slate-700" />
            <div className="h-5 w-32 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>
          {/* Cuerpo */}
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-48 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-64 rounded-lg bg-slate-300 dark:bg-slate-700" />
              </div>
            </div>
            {/* Píldoras */}
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-36 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
            {/* Descripción */}
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            {/* Cajas métricas */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50" />
              <div className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50" />
            </div>
            {/* Botones */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="h-10 w-44 rounded-xl bg-slate-300 dark:bg-slate-700" />
              <div className="h-10 w-44 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DocentesSkeleton() {
  return (
    <div
      aria-label="Cargando plana docente"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse"
    >
      {[1, 2, 3, 4].map((idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-3/4 rounded bg-slate-300 dark:bg-slate-700" />
            <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="flex -space-x-2 pt-1">
            {[1, 2, 3, 4].map((av) => (
              <div
                key={av}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900"
              />
            ))}
          </div>
          <div className="h-9 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

export function CalendarioSkeleton() {
  return (
    <section
      aria-label="Cargando cronograma académico"
      className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 animate-pulse"
    >
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d19] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-5 w-52 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-7 w-80 rounded-xl bg-slate-300 dark:bg-slate-700" />
          </div>
          <div className="h-9 w-48 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((col) => (
            <div
              key={col}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1628] overflow-hidden"
            >
              <div className="h-12 bg-slate-200 dark:bg-slate-800 px-5 flex items-center justify-between">
                <div className="h-4 w-32 rounded bg-slate-300 dark:bg-slate-700" />
                <div className="h-6 w-20 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>
              <div className="p-5 space-y-3">
                {[1, 2, 3].map((row) => (
                  <div
                    key={row}
                    className="h-16 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
