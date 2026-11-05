"use client";

import React, { useState, useMemo } from "react";
import {
  Briefcase,
  ChevronDown,
  Download,
  FolderGit2,
  Lightbulb,
  Printer,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import type { Carrera, CarreraId, CursoMalla, VistaPortal } from "@/app/types/portal";
import { TEMA_CARRERA } from "@/app/data/portalInitialData";

interface CarreraMallaViewProps {
  carreras: Carrera[];
  carreraSeleccionadaId: CarreraId;
  carreraActiva: Carrera;
  malla: CursoMalla[];
  cursosDeCarreraActiva: CursoMalla[];
  modoMalla: "acordeon" | "roadmap";
  setModoMalla: (modo: "acordeon" | "roadmap") => void;
  ciclosAbiertos: number[];
  toggleCicloAcordeon: (numCiclo: number) => void;
  adminAutenticado: boolean;
  navegar: (
    nuevaVista: VistaPortal,
    params?: {
      carreraId?: CarreraId;
      noticiaId?: string;
      docenteCarrera?: "TODAS" | CarreraId;
      skipScroll?: boolean;
    }
  ) => void;
  handleDescargarMallaPDF: () => void;
  handleDescargarTripticoCarrera: () => void;
  handleDescargarPosterEstudios: () => void;
  onIrRepositorioCurso: (carreraId: CarreraId, ciclo: number | "TODOS", cursoId: string) => void;
  onEditarCarreraAdmin: (carreraId: CarreraId) => void;
}

export function CarreraMallaView({
  carreras,
  carreraSeleccionadaId,
  carreraActiva,
  malla,
  cursosDeCarreraActiva,
  modoMalla,
  setModoMalla,
  ciclosAbiertos,
  toggleCicloAcordeon,
  adminAutenticado,
  navegar,
  handleDescargarMallaPDF,
  handleDescargarTripticoCarrera,
  handleDescargarPosterEstudios,
  onIrRepositorioCurso,
  onEditarCarreraAdmin,
}: CarreraMallaViewProps) {
  const temaActivo = TEMA_CARRERA[carreraActiva.id];

  // Estado para el Resaltado Inteligente de Prerrequisitos (Hover en Desktop / Tap en Móvil)
  const [cursoHoverCodigo, setCursoHoverCodigo] = useState<string | null>(null);
  const [cursoFijadoCodigo, setCursoFijadoCodigo] = useState<string | null>(null);

  const codigoActivo = cursoHoverCodigo || cursoFijadoCodigo;

  const relacionCursos = useMemo(() => {
    if (!codigoActivo) {
      return {
        cursoEnFoco: null as CursoMalla | null,
        prerrequisitosSet: new Set<string>(),
        desbloqueadosSet: new Set<string>(),
      };
    }
    const cursoEnFoco = cursosDeCarreraActiva.find((c) => c.codigo === codigoActivo) || null;
    const prerrequisitosSet = new Set<string>(cursoEnFoco?.prerequisitos || []);
    const desbloqueadosSet = new Set<string>(
      cursosDeCarreraActiva
        .filter((c) => c.prerequisitos.includes(codigoActivo))
        .map((c) => c.codigo)
    );
    return { cursoEnFoco, prerrequisitosSet, desbloqueadosSet };
  }, [codigoActivo, cursosDeCarreraActiva]);

  const handleToggleFijarCurso = (codigo: string) => {
    setCursoFijadoCodigo((prev) => (prev === codigo ? null : codigo));
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 view-transition-gpu">
      {/* Selector de Escuela Profesional */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap gap-2">
          {carreras.map((c) => {
            const count = malla.filter((m) => m.carrera_id === c.id).length;
            const temaTab = TEMA_CARRERA[c.id];
            const esActiva = carreraSeleccionadaId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setCursoFijadoCodigo(null);
                  setCursoHoverCodigo(null);
                  navegar("/carreras/[id]", { carreraId: c.id, skipScroll: true });
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer gpu-btn ${
                  esActiva
                    ? temaTab.tabActive
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{c.nombre}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    esActiva ? temaTab.tabPillActive : "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {count} cursos
                </span>
              </button>
            );
          })}
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 px-2">
          Ruta: <strong className={temaActivo.textAccent}>/carreras/{carreraActiva.id}</strong>
        </span>
      </div>

      {/* ENCABEZADO DE LA CARRERA CON COLOR PROPIO POR ESCUELA */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div
          className={`${temaActivo.headerBg} text-white px-6 sm:px-8 py-6 border-b-4 ${temaActivo.borderAccent} flex flex-col lg:flex-row lg:items-center justify-between gap-6`}
        >
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded bg-black/25 text-white text-xs font-mono font-bold border border-white/20">
                {carreraActiva.codigo_escuela}
              </span>
              <span className="text-xs text-white/90 font-medium">
                10 Ciclos Académicos • {cursosDeCarreraActiva.length} Asignaturas Registradas
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">
              Escuela Profesional de {carreraActiva.nombre}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              {carreraActiva.descripcion}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 print:hidden">
            <button
              onClick={handleDescargarMallaPDF}
              className="px-5 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer gpu-btn"
            >
              <Download className={`w-4 h-4 ${temaActivo.textAccent}`} />
              <span>📥 Descargar Malla Curricular (PDF)</span>
            </button>
            <button
              onClick={() => onIrRepositorioCurso(carreraActiva.id, "TODOS", "TODOS")}
              className="px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/25 cursor-pointer gpu-btn"
            >
              <FolderGit2 className="w-4 h-4 text-white" />
              <span>Ir al Repositorio de {carreraActiva.nombre}</span>
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="md:col-span-2 space-y-1.5">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${temaActivo.textAccent}`}>
              Perfil del Egresado
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {carreraActiva.perfil_egreso}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 space-y-1.5 text-xs">
            <p className={`font-bold uppercase ${temaActivo.textAccent}`}>Grados y Títulos Oficiales</p>
            <p className="text-slate-600 dark:text-slate-400">
              Grado: <strong className="text-slate-900 dark:text-white">{carreraActiva.grado_academico}</strong>
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Título: <strong className="text-slate-900 dark:text-white">{carreraActiva.titulo_profesional}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN A 2 COLUMNAS: PERFIL / CAMPO LABORAL + BOTÓN TRÍPTICO PDF Y FOTO REFERENCIAL */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${temaActivo.textAccent}`}>
                Proyección Profesional e Investigación • FCM UNMSM
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#002855] dark:text-white mt-1">
                ¿En qué consiste la carrera de {carreraActiva.nombre}?
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${temaActivo.iconWrap}`}>
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#002855] dark:text-white">Visión y Perfil Académico</h4>
                  <p>{carreraActiva.vision_carrera}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${temaActivo.iconWrap}`}>
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#002855] dark:text-white">
                    Campo Laboral y Desempeño Profesional
                  </h4>
                  <p>{carreraActiva.campo_laboral}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${temaActivo.iconWrap}`}>
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#002855] dark:text-white">
                    ¿Por qué estudiar {carreraActiva.nombre} en San Marcos?
                  </h4>
                  <p>{carreraActiva.por_que_estudiar}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 print:hidden">
              <button
                onClick={handleDescargarTripticoCarrera}
                className={`px-5 py-3.5 rounded-xl ${temaActivo.badgeSolid} font-bold text-xs sm:text-sm shadow-md flex items-center gap-2.5 border cursor-pointer gpu-btn`}
              >
                <Download className="w-4 h-4 text-white" />
                <span>📥 Descargar Tríptico de la Carrera (PDF)</span>
              </button>

              <button
                onClick={handleDescargarPosterEstudios}
                className="px-5 py-3.5 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2.5 border border-[#002855] cursor-pointer gpu-btn"
              >
                <Download className="w-4 h-4 text-red-400" />
                <span>📊 Descargar Póster de Estudios (PDF)</span>
              </button>

              {carreraActiva.triptico_pdf_url && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  ✓ Tríptico oficial sincronizado
                </span>
              )}
              {carreraActiva.poster_pdf_url && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  ✓ Póster oficial sincronizado
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <img
              src={carreraActiva.imagen_referencial_url}
              alt={`Estudiantes de ${carreraActiva.nombre} - FCM UNMSM`}
              className="w-full h-72 sm:h-80 lg:h-96 object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-800"
            />
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>
                Escuela Profesional de{" "}
                <strong className={temaActivo.textAccent}>{carreraActiva.nombre}</strong>
              </span>
              {adminAutenticado && (
                <button
                  onClick={() => onEditarCarreraAdmin(carreraActiva.id)}
                  className={`${temaActivo.textAccent} font-bold hover:underline print:hidden cursor-pointer`}
                >
                  Cambiar imagen / PDF en /admin →
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MALLA CURRICULAR INTERACTIVA CON RESALTADO DE PRERREQUISITOS (PILAR 5) */}
      <section className="space-y-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#002855] dark:text-white flex items-center gap-2">
                <span>Malla Curricular de {carreraActiva.nombre} (Ciclo 1 al Ciclo 10)</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Pasa el cursor o haz clic sobre cualquier asignatura para iluminar su cadena de prerrequisitos y los cursos futuros que desbloquea.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setModoMalla("acordeon")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer gpu-btn ${
                  modoMalla === "acordeon"
                    ? `${temaActivo.badgeSolid}`
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                }`}
              >
                Vista Acordeón
              </button>
              <button
                onClick={() => setModoMalla("roadmap")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer gpu-btn ${
                  modoMalla === "roadmap"
                    ? `${temaActivo.badgeSolid}`
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                }`}
              >
                Vista Columnas / Roadmap
              </button>
              <button
                onClick={handleDescargarMallaPDF}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer gpu-btn"
              >
                <Printer className="w-3.5 h-3.5" /> Exportar Malla PDF
              </button>
            </div>
          </div>

          {/* LEYENDA VISUAL EXPLICATIVA DE PRERREQUISITOS */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-bold text-[#002855] dark:text-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Mapa Interactivo:</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-400 dark:border-blue-600 text-[#002855] dark:text-blue-200 font-semibold text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#002855] dark:bg-blue-400" />
                Curso seleccionado
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                ⬅ Prerrequisito Previo (Requerido)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-500 text-amber-800 dark:text-amber-300 font-semibold text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                ➡ Curso Futuro Desbloqueado
              </span>
            </div>

            {relacionCursos.cursoEnFoco && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-semibold shadow-sm">
                <span className="font-mono text-amber-300 font-bold">
                  [{relacionCursos.cursoEnFoco.codigo}]
                </span>
                <span>
                  Requiere:{" "}
                  <strong className="text-emerald-300 font-mono">
                    {relacionCursos.cursoEnFoco.prerequisitos.length > 0
                      ? `[${relacionCursos.cursoEnFoco.prerequisitos.join(", ")}]`
                      : "Ninguno"}
                  </strong>{" "}
                  • Desbloquea:{" "}
                  <strong className="text-amber-300">
                    {relacionCursos.desbloqueadosSet.size}{" "}
                    {relacionCursos.desbloqueadosSet.size === 1 ? "curso futuro" : "cursos futuros"}
                  </strong>
                </span>
                {cursoFijadoCodigo && (
                  <button
                    type="button"
                    onClick={() => {
                      setCursoFijadoCodigo(null);
                      setCursoHoverCodigo(null);
                    }}
                    className="ml-1 p-0.5 rounded hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                    title="Limpiar selección"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {modoMalla === "acordeon" ? (
          <div className="space-y-4">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((numCiclo) => {
              const cursosCiclo = cursosDeCarreraActiva.filter((c) => c.ciclo === numCiclo);
              const totalCreditos = cursosCiclo.reduce((acc, c) => acc + c.creditos, 0);
              const abierto = ciclosAbiertos.includes(numCiclo);
              return (
                <div
                  key={numCiclo}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleCicloAcordeon(numCiclo)}
                    className={`w-full px-5 py-4 flex items-center justify-between ${temaActivo.cycleBtn} text-white transition-colors cursor-pointer`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${temaActivo.cyclePill} shadow-sm border border-white/20`}
                      >
                        CICLO {numCiclo}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {cursosCiclo.length} Asignaturas
                      </span>
                      <span className="text-xs text-white/85 font-mono">
                        • {totalCreditos.toFixed(1)} Créditos
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white transition-transform duration-200 ${
                        abierto ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {abierto && (
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/70 dark:bg-slate-950/40">
                      {cursosCiclo.map((cur) => {
                        const esEnFoco = codigoActivo === cur.codigo;
                        const esPrereq = relacionCursos.prerrequisitosSet.has(cur.codigo);
                        const esDesbloqueado = relacionCursos.desbloqueadosSet.has(cur.codigo);
                        const atenuado = Boolean(codigoActivo && !esEnFoco && !esPrereq && !esDesbloqueado);
                        const desbloqueaCount = cursosDeCarreraActiva.filter((x) =>
                          x.prerequisitos.includes(cur.codigo)
                        ).length;

                        let cardClasses = `border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${temaActivo.cardHoverBorder}`;
                        if (esEnFoco) {
                          cardClasses =
                            "border-[#002855] dark:border-blue-400 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-[#002855]/30 dark:ring-blue-400/40 shadow-xl scale-[1.015] z-10";
                        } else if (esPrereq) {
                          cardClasses =
                            "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 ring-2 ring-emerald-500/35 shadow-lg scale-[1.01] z-10";
                        } else if (esDesbloqueado) {
                          cardClasses =
                            "border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 ring-2 ring-amber-500/35 shadow-lg scale-[1.01] z-10";
                        }

                        return (
                          <div
                            key={cur.id}
                            onMouseEnter={() => setCursoHoverCodigo(cur.codigo)}
                            onMouseLeave={() => setCursoHoverCodigo(null)}
                            onClick={() => handleToggleFijarCurso(cur.codigo)}
                            className={`rounded-xl border-2 p-4 flex flex-col justify-between gap-3 shadow-sm cursor-pointer transform-gpu transition-all duration-300 ${cardClasses} ${
                              atenuado ? "opacity-40" : "opacity-100"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded border ${temaActivo.badgeSoft}`}
                                >
                                  {cur.codigo}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                      cur.tipo_curso === "O"
                                        ? "bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 dark:border dark:border-slate-700"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                                    }`}
                                  >
                                    {cur.tipo_curso === "O" ? "Obligatorio" : "Electivo"}
                                  </span>
                                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                    {cur.creditos.toFixed(1)} cr.
                                  </span>
                                </div>
                              </div>

                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                                {cur.nombre_curso}
                              </h4>

                              {/* Insignia interactiva de estado de relación */}
                              {(esEnFoco || esPrereq || esDesbloqueado) && (
                                <div className="pt-0.5">
                                  {esEnFoco && (
                                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#002855] dark:bg-blue-600 text-white shadow-2xs">
                                      Requiere:{" "}
                                      {cur.prerequisitos.length > 0
                                        ? `[${cur.prerequisitos.join(", ")}]`
                                        : "Ninguno"}{" "}
                                      • Desbloquea: {desbloqueaCount}{" "}
                                      {desbloqueaCount === 1 ? "curso futuro" : "cursos futuros"}
                                    </span>
                                  )}
                                  {esPrereq && (
                                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-2xs">
                                      ⬅ Prerrequisito previo requerido
                                    </span>
                                  )}
                                  {esDesbloqueado && (
                                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 shadow-2xs">
                                      ➡ Desbloqueado por [{codigoActivo}]
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                              <span className="text-slate-600 dark:text-slate-400">
                                Pre-req:{" "}
                                <strong className="text-slate-900 dark:text-slate-200 font-mono">
                                  {cur.prerequisitos.length > 0 ? cur.prerequisitos.join(", ") : "Ninguno"}
                                </strong>
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onIrRepositorioCurso(carreraActiva.id, cur.ciclo, cur.id);
                                }}
                                className={`${temaActivo.textAccent} dark:text-blue-300 hover:underline font-bold cursor-pointer`}
                              >
                                Materiales →
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((numCiclo) => {
              const cursosCiclo = cursosDeCarreraActiva.filter((c) => c.ciclo === numCiclo);
              const totalCred = cursosCiclo.reduce((acc, c) => acc + c.creditos, 0);
              return (
                <div
                  key={numCiclo}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col"
                >
                  <div
                    className={`${temaActivo.cycleBtn} text-white px-4 py-2.5 flex items-center justify-between border-b-2 ${temaActivo.borderAccent}`}
                  >
                    <span className="text-xs font-bold">CICLO {numCiclo}</span>
                    <span className="text-[11px] font-mono text-white/90">{totalCred.toFixed(0)} cr.</span>
                  </div>
                  <div className="p-3 space-y-2.5 flex-1 bg-slate-50/50 dark:bg-slate-950/40">
                    {cursosCiclo.map((cur) => {
                      const esEnFoco = codigoActivo === cur.codigo;
                      const esPrereq = relacionCursos.prerrequisitosSet.has(cur.codigo);
                      const esDesbloqueado = relacionCursos.desbloqueadosSet.has(cur.codigo);
                      const atenuado = Boolean(codigoActivo && !esEnFoco && !esPrereq && !esDesbloqueado);

                      let miniClass =
                        "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80";
                      if (esEnFoco) {
                        miniClass =
                          "border-[#002855] dark:border-blue-400 bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500/40 scale-[1.02]";
                      } else if (esPrereq) {
                        miniClass =
                          "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 ring-2 ring-emerald-500/40 scale-[1.02]";
                      } else if (esDesbloqueado) {
                        miniClass =
                          "border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 ring-2 ring-amber-500/40 scale-[1.02]";
                      }

                      return (
                        <div
                          key={cur.id}
                          onMouseEnter={() => setCursoHoverCodigo(cur.codigo)}
                          onMouseLeave={() => setCursoHoverCodigo(null)}
                          onClick={() => handleToggleFijarCurso(cur.codigo)}
                          className={`p-2.5 rounded-xl border-2 shadow-xs space-y-1 cursor-pointer transform-gpu transition-all duration-300 ${miniClass} ${
                            atenuado ? "opacity-40" : "opacity-100"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className={`font-mono font-bold ${temaActivo.textAccent} dark:text-blue-300`}>
                              {cur.codigo}
                            </span>
                            <span className="font-semibold text-slate-600 dark:text-slate-400">
                              {cur.creditos.toFixed(1)} cr.
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {cur.nombre_curso}
                          </p>
                          {cur.prerequisitos.length > 0 && (
                            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                              Pre: {cur.prerequisitos.join(", ")}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
