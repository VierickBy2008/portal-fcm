"use client";

import React from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  FileText,
  GraduationCap,
  Landmark,
  Newspaper,
  Search,
  Sliders,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import type { HomeViewProps } from "@/app/components/views/HomeView";
import { formatearFechaEspanol, obtenerInicialesDocente } from "@/app/utils/portalFormatters";
import { OptimizedImage } from "@/app/components/ui/OptimizedImage";
import { CalendarioAcademicoSection } from "@/app/components/views/CalendarioAcademicoSection";
import {
  BentoSkeleton,
  CalendarioSkeleton,
  DocentesSkeleton,
  HeroSkeleton,
} from "@/app/components/ui/SkeletonLoaders";

export function HomeViewHarvard({
  cargandoConfig,
  slideActivoHero,
  totalSlidesHero,
  anteriorSlideHero,
  siguienteSlideHero,
  cambiarSlideHero,
  heroBgUrl,
  heroDefaultBgUrl,
  heroBlur,
  heroOverlayColor,
  heroOverlayOpacity,
  adminAutenticado,
  setModalHeroFondoAbierto,
  busquedaGlobal,
  setBusquedaGlobal,
  resultadosBusquedaHero,
  carreras,
  malla,
  noticias,
  noticiasDestacadas,
  orgulloItems,
  docentes,
  busquedaDocentes,
  setBusquedaDocentes,
  calendarioConfig,
  navegar,
  navegarACarrera,
  handleDescargarTripticoPorCarrera,
  abrirNoticiaDetalle,
  setModalDetalleOrgullo,
  setTabAdmin,
}: HomeViewProps) {
  if (cargandoConfig && carreras.length === 0) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-14 overflow-x-hidden">
        <HeroSkeleton />
        <BentoSkeleton />
        <DocentesSkeleton />
        <CalendarioSkeleton />
      </main>
    );
  }

  const noticiaPrincipal = noticias[0];
  const noticiasSecundarias = noticias.slice(1, 4);
  const slideNoticiaActiva =
    slideActivoHero > 0 ? noticiasDestacadas[slideActivoHero - 1] : null;

  return (
    <main className="flex-1 w-full bg-[#fcfbf8] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors view-transition-gpu">
      {/* =====================================================================
          1. BANNER EDITORIAL CLÁSICO ESTILO HARVARD / IVY LEAGUE (THE CRIMSON)
          ===================================================================== */}
      <section className="relative border-b-4 border-[#8B1515] bg-[#140507] text-white overflow-hidden">
        {/* Imagen de fondo arquitectónica con filtro editorial */}
        <img
          src={heroBgUrl || heroDefaultBgUrl}
          alt="Claustro Facultad de Ciencias Matemáticas UNMSM"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-700"
          style={{ filter: `blur(${heroBlur}px) grayscale(20%)` }}
        />
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            backgroundColor: heroOverlayColor || "#1a0508",
            opacity: Math.min(0.94, Math.max(0.55, heroOverlayOpacity / 100)),
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b070c]/95 via-[#001733]/85 to-black/75 pointer-events-none" />

        {/* Cinta Superior Solemne (Latin & Institutional Motto) */}
        <div className="relative z-20 border-b border-amber-500/30 bg-black/45 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-semibold text-amber-200/90">
            <div className="flex items-center gap-2">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>VERITAS ET SCIENTIA • DECANA DE AMÉRICA • FUNDADA EN 1551</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navegar("/transparencia")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Actas y Resoluciones
              </button>
              <span className="text-amber-500/40">|</span>
              <button
                type="button"
                onClick={() => navegar("/repositorio")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Biblioteca & Repositorio
              </button>
              {adminAutenticado && (
                <>
                  <span className="text-amber-500/40">|</span>
                  <button
                    type="button"
                    onClick={() => setModalHeroFondoAbierto(true)}
                    className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white font-bold cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Ajustar Portada ({heroOverlayOpacity}%)</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contenido Principal del Hero Editorial */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Columna Izquierda: Identidad Editorial Clásica + Buscador HOLLIS */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 border-l-4 border-amber-400 bg-white/10 backdrop-blur-xs text-amber-200 text-xs font-bold uppercase tracking-widest">
                <span>Facultad de Ciencias Matemáticas • UNMSM</span>
              </div>

              <h1 className="font-harvard-serif text-3xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-white leading-[1.12] drop-shadow-sm">
                Excelencia en Ciencias Exactas, Estadística y Computación Científica
              </h1>

              <blockquote className="border-l-2 border-red-400/70 pl-4 py-1 text-slate-200 text-xs sm:text-sm md:text-base italic leading-relaxed max-w-2xl font-harvard-body">
                &ldquo;Formando investigadores, matemáticos y científicos de datos con rigor
                demostrativo y compromiso con el desarrollo científico del Perú y del mundo.&rdquo;
              </blockquote>

              {/* Buscador Global estilo Catálogo Académico de Harvard */}
              <div className="relative max-w-2xl w-full pt-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-amber-300/90 mb-2">
                  Catálogo Curricular Unificado (Planes 2026 • 10 Ciclos Académicos)
                </label>
                <div className="relative flex items-center bg-white rounded-none border-2 border-amber-500/80 shadow-2xl harvard-hollis-box">
                  <Search className="w-5 h-5 text-[#8B1515] absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={busquedaGlobal}
                    onChange={(e) => setBusquedaGlobal(e.target.value)}
                    placeholder="Consultar asignatura por código o nombre (ej. Análisis Real, IA, Estadística)..."
                    className="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-white text-slate-900 placeholder:text-slate-500 text-xs sm:text-sm font-medium focus:outline-none"
                  />
                  {busquedaGlobal ? (
                    <button
                      type="button"
                      onClick={() => setBusquedaGlobal("")}
                      className="gpu-btn absolute right-2 px-3 py-2 bg-[#8B1515] hover:bg-red-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      Limpiar
                    </button>
                  ) : (
                    <span className="hidden sm:inline-block absolute right-3 px-2.5 py-1 bg-slate-100 text-[#002855] border border-slate-300 text-[10px] font-mono font-bold uppercase">
                      {malla.length} Cursos
                    </span>
                  )}
                </div>

                {busquedaGlobal.trim() !== "" && (
                  <div className="absolute left-0 right-0 mt-1 bg-white text-slate-900 border-2 border-[#8B1515] shadow-2xl p-4 z-40 space-y-2 max-h-96 overflow-y-auto">
                    {resultadosBusquedaHero.cursos.length === 0 &&
                    resultadosBusquedaHero.materiales.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">
                        No se hallaron registros en el catálogo para &ldquo;{busquedaGlobal}&rdquo;.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-200">
                        {resultadosBusquedaHero.cursos.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setBusquedaGlobal("");
                              navegarACarrera(c.carrera_id);
                            }}
                            className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-red-50/70 text-left transition-colors cursor-pointer"
                          >
                            <div>
                              <span className="font-mono text-xs font-bold text-[#8B1515]">
                                [{c.codigo}]
                              </span>{" "}
                              <span className="text-xs font-bold text-slate-900">
                                {c.nombre_curso}
                              </span>
                              <p className="text-[11px] text-slate-600">
                                Ciclo {c.ciclo} • {c.creditos} créditos •{" "}
                                {carreras.find((ca) => ca.id === c.carrera_id)?.nombre}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#8B1515]" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Métricas Clásicas de Prestigio */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/20 max-w-xl">
                <div>
                  <span className="font-harvard-serif text-2xl sm:text-3xl font-bold text-amber-400 block">
                    4
                  </span>
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider">
                    Escuelas Profesionales
                  </span>
                </div>
                <div>
                  <span className="font-harvard-serif text-2xl sm:text-3xl font-bold text-amber-400 block">
                    10 Ciclos
                  </span>
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider">
                    Régimen Semestral
                  </span>
                </div>
                <div>
                  <span className="font-harvard-serif text-2xl sm:text-3xl font-bold text-amber-400 block">
                    {docentes.length}+
                  </span>
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider">
                    Catedráticos e Inv.
                  </span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Vitrina Editorial de Destacados / Comunicados del Carrusel */}
            <div className="lg:col-span-5">
              <div className="bg-[#0d1526]/90 border-2 border-amber-500/60 p-6 sm:p-7 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {slideNoticiaActiva ? slideNoticiaActiva.categoria : "Boletín de Decanato"}
                    </span>
                  </span>
                  {totalSlidesHero > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={anteriorSlideHero}
                        className="w-7 h-7 border border-white/25 hover:bg-white/15 flex items-center justify-center text-white cursor-pointer"
                        aria-label="Anterior boletín"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-mono text-slate-300 px-1">
                        {slideActivoHero + 1}/{totalSlidesHero}
                      </span>
                      <button
                        type="button"
                        onClick={siguienteSlideHero}
                        className="w-7 h-7 border border-white/25 hover:bg-white/15 flex items-center justify-center text-white cursor-pointer"
                        aria-label="Siguiente boletín"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {slideNoticiaActiva ? (
                  <div className="space-y-4">
                    <div className="aspect-[16/9] w-full overflow-hidden border border-white/20 bg-slate-950">
                      <img
                        src={slideNoticiaActiva.imagen_url}
                        alt={slideNoticiaActiva.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="font-harvard-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                      {slideNoticiaActiva.titulo}
                    </h2>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {slideNoticiaActiva.resumen}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        navegar("/noticias/[id]", { noticiaId: slideNoticiaActiva.id })
                      }
                      className="w-full py-2.5 px-4 bg-[#8B1515] hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Leer Comunicado Oficial</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="aspect-[16/9] w-full overflow-hidden border border-white/20 bg-slate-950 relative">
                      <img
                        src={noticiaPrincipal?.imagen_url || heroBgUrl || heroDefaultBgUrl}
                        alt="Actualidad FCM"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-3">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                          Ciudad Universitaria • Lima, Perú
                        </span>
                      </div>
                    </div>
                    <h2 className="font-harvard-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                      {noticiaPrincipal
                        ? noticiaPrincipal.titulo
                        : "Admisión y Formación Científica de Alto Nivel"}
                    </h2>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {noticiaPrincipal?.resumen ||
                        "Conoce nuestras cuatro escuelas profesionales, laboratorios de cómputo científico y grupos de investigación."}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      {noticiaPrincipal && (
                        <button
                          type="button"
                          onClick={() => abrirNoticiaDetalle(noticiaPrincipal.id)}
                          className="flex-1 py-2.5 px-4 bg-[#8B1515] hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <span>Leer Despacho Principal</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                      {noticiasDestacadas.length > 0 && (
                        <button
                          type="button"
                          onClick={() => cambiarSlideHero(1)}
                          className="py-2.5 px-3 border border-amber-400/50 hover:bg-white/10 text-amber-300 text-xs font-bold cursor-pointer"
                          title="Ver siguientes avisos del carrusel"
                        >
                          Avisos ({noticiasDestacadas.length})
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenedor Central Editorial */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16 sm:space-y-20">
        {/* ===================================================================
            2. ESCUELAS PROFESIONALES (ESTILO HARVARD ACADEMIC DEPARTMENTS)
            =================================================================== */}
        <section className="space-y-8">
          <div className="border-t-2 border-b-2 border-[#002855] dark:border-slate-700 py-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B1515] dark:text-red-400 block">
                Programas de Pregrado y Licenciatura • Plan Curricular 2026
              </span>
              <h2 className="font-harvard-serif text-2xl sm:text-4xl font-bold text-[#002855] dark:text-white tracking-tight mt-1">
                Escuelas Profesionales de la Facultad
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md font-harvard-body">
              Cuatro escuelas académicas acreditadas que integran la teoría matemática rigurosa con
              la tecnología computacional y la analítica moderna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {carreras.map((car, idx) => {
              const totalCursos = malla.filter((m) => m.carrera_id === car.id).length;
              const pilares = car.pilares_bento || [];
              const staggerClass = `stagger-fade-up stagger-delay-${(idx % 4) + 1}`;
              return (
                <article
                  key={car.id}
                  className={`${staggerClass} harvard-card-gpu group bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 border-t-4 border-t-[#8B1515] shadow-md hover:shadow-xl flex flex-col justify-between`}
                >
                  <div>
                    {/* Cabecera Clásica con Imagen y Sello de Escuela */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-slate-200 dark:border-slate-800">
                      <div className="sm:col-span-5 relative h-48 sm:h-auto bg-slate-900 overflow-hidden">
                        <OptimizedImage
                          src={car.imagen_referencial_url}
                          alt={car.nombre}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out transform-gpu"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#8B1515] text-white font-mono text-[11px] font-bold tracking-wider">
                          E.P. {car.codigo_escuela}
                        </span>
                        <span className="absolute bottom-3 left-3 right-3 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                          {car.duracion_bento || "10 Semestres (5 Años)"}
                        </span>
                      </div>

                      <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B1515] dark:text-red-400">
                            {car.subtitulo_bento || "Escuela Académico Profesional"}
                          </span>
                          <h3
                            onClick={() => navegarACarrera(car.id)}
                            className="font-harvard-serif text-xl sm:text-2xl font-bold text-[#002855] dark:text-white hover:text-[#8B1515] dark:hover:text-red-400 cursor-pointer transition-colors leading-tight"
                          >
                            Escuela Profesional de {car.nombre}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                            {car.descripcion}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-[#8B1515]" />
                            {car.creditos_bento || 200} Créditos
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-[#002855] dark:text-blue-400" />
                            {totalCursos} Asignaturas
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Líneas de Especialización en Formato Clásico */}
                    {pilares.length > 0 && (
                      <div className="px-6 py-4 bg-[#f8f6f0] dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 block mb-2">
                          Áreas de Investigación y Especialización Curricular:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {pilares.slice(0, 5).map((pilar, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px] font-medium text-slate-800 dark:text-slate-200"
                            >
                              § {pilar}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Barra de Acciones Académicas */}
                  <div className="px-6 py-4 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => navegarACarrera(car.id)}
                      className="gpu-btn px-4 py-2 bg-[#002855] hover:bg-[#8B1515] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Plan de Estudios (10 Ciclos)</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleDescargarTripticoPorCarrera(car, e)}
                        className="gpu-btn px-3 py-2 border border-slate-300 dark:border-slate-700 hover:border-[#8B1515] hover:bg-rose-50/40 dark:hover:bg-rose-950/30 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Descargar Tríptico Oficial en PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-[#8B1515]" />
                        <span>Tríptico</span>
                      </button>
                      {car.poster_pdf_url && (
                        <a
                          href={car.poster_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="gpu-btn px-3 py-2 border border-amber-500/60 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Póster</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ===================================================================
            3. THE HARVARD GAZETTE LAYOUT (NOTICIAS Y COMUNICADOS OFICIALES)
            =================================================================== */}
        <section className="space-y-8">
          <div className="border-t-2 border-b-2 border-[#8B1515] py-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B1515] dark:text-red-400 block">
                Gaceta Oficial • Crónica Académica y Científica
              </span>
              <h2 className="font-harvard-serif text-2xl sm:text-4xl font-bold text-[#002855] dark:text-white tracking-tight mt-1">
                Boletín Oficial de Noticias y Comunicados
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navegar("/noticias")}
              className="px-4 py-2 border-2 border-[#002855] dark:border-blue-400 text-[#002855] dark:text-blue-300 hover:bg-[#002855] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-end"
            >
              <Newspaper className="w-4 h-4" />
              <span>Archivo Hemerográfico ({noticias.length})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Artículo Principal Estilo Portada The Harvard Gazette */}
            {noticiaPrincipal && (
              <article
                onClick={() => abrirNoticiaDetalle(noticiaPrincipal.id)}
                className="lg:col-span-7 harvard-card-gpu bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-xl cursor-pointer group space-y-5"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <OptimizedImage
                    src={noticiaPrincipal.imagen_url}
                    alt={noticiaPrincipal.titulo}
                    priority={true}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out transform-gpu"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#8B1515] text-white text-[10px] font-bold uppercase tracking-widest">
                      {noticiaPrincipal.categoria}
                    </span>
                    {noticiaPrincipal.destacado && (
                      <span className="px-2.5 py-1 bg-[#002855] text-amber-300 text-[10px] font-bold uppercase tracking-widest">
                        Destacado
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#8B1515]" />
                    <span>{formatearFechaEspanol(noticiaPrincipal.fecha_publicacion)}</span>
                    {noticiaPrincipal.modalidad && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-[#002855] dark:text-blue-300">
                          Modalidad: {noticiaPrincipal.modalidad}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-harvard-serif text-2xl sm:text-3xl font-bold text-[#002855] dark:text-white group-hover:text-[#8B1515] dark:group-hover:text-red-400 transition-colors leading-tight">
                    {noticiaPrincipal.titulo}
                  </h3>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4 font-harvard-body">
                    {noticiaPrincipal.resumen || noticiaPrincipal.contenido}
                  </p>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8B1515] dark:text-red-400 flex items-center gap-1.5">
                      <span>Continuar leyendo el comunicado</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Edición Oficial FCM</span>
                  </div>
                </div>
              </article>
            )}

            {/* Columna Derecha: Despachos Secundarios Numerados */}
            <div className="lg:col-span-5 lg:border-l lg:border-slate-300 dark:lg:border-slate-800 lg:pl-8 space-y-6">
              <div className="border-b border-slate-300 dark:border-slate-800 pb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#002855] dark:text-blue-300">
                  Despachos Recientes de Decanato
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Índice I — {noticiasSecundarias.length}
                </span>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {noticiasSecundarias.map((not, idx) => {
                  const romanos = ["I", "II", "III", "IV"];
                  return (
                    <article
                      key={not.id}
                      onClick={() => abrirNoticiaDetalle(not.id)}
                      className="py-5 first:pt-1 last:pb-1 group cursor-pointer flex gap-4 items-start harvard-gazette-item border-l-2 border-l-transparent hover:border-l-[#8B1515] dark:hover:border-l-red-400 pl-3 -ml-3"
                    >
                      <span className="font-harvard-serif text-2xl font-bold text-[#8B1515]/70 dark:text-red-400/80 w-7 shrink-0 pt-0.5">
                        {romanos[idx] || idx + 1}.
                      </span>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#8B1515] dark:text-red-400">
                          <span>{not.categoria}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 dark:text-slate-400 font-mono">
                            {formatearFechaEspanol(not.fecha_publicacion)}
                          </span>
                        </div>
                        <h4 className="font-harvard-serif text-base sm:text-lg font-bold text-[#002855] dark:text-slate-100 group-hover:text-[#8B1515] dark:group-hover:text-red-400 transition-colors leading-snug">
                          {not.titulo}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {not.resumen || not.contenido}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="p-5 bg-[#002855] text-white border-l-4 border-[#8B1515] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block">
                  Archivo Histórico Universitario
                </span>
                <h4 className="font-harvard-serif text-lg font-bold">
                  Hemeroteca Completa de la Facultad
                </h4>
                <p className="text-xs text-blue-100/85 leading-relaxed">
                  Accede a todas las convocatorias de becas, coloquios internacionales y decretos
                  académicos publicados.
                </p>
                <button
                  type="button"
                  onClick={() => navegar("/noticias")}
                  className="mt-2 px-4 py-2 bg-white text-[#002855] hover:bg-amber-400 hover:text-slate-950 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Consultar todos los boletines</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            4. CLAUSTRO DE HONOR Y DISTINCIONES (ORGULLO SANMARQUINO)
            =================================================================== */}
        <section className="space-y-8">
          <div className="border-t-2 border-b-2 border-[#002855] dark:border-slate-700 py-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B1515] dark:text-red-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Honors & Distinguished Scholars • Mérito Académico</span>
              </span>
              <h2 className="font-harvard-serif text-2xl sm:text-4xl font-bold text-[#002855] dark:text-white tracking-tight mt-1">
                Claustro de Honor y Orgullo Sanmarquino
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => navegar("/orgullo")}
                className="px-4 py-2 border-2 border-[#8B1515] text-[#8B1515] dark:text-red-300 hover:bg-[#8B1515] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Ver Galería de Honor ({orgulloItems.length})</span>
              </button>
              {adminAutenticado && (
                <button
                  type="button"
                  onClick={() => {
                    setTabAdmin("orgullo");
                    navegar("/admin");
                  }}
                  className="px-3.5 py-2 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {orgulloItems.slice(0, 3).map((item, idx) => (
              <article
                key={item.id}
                onClick={() => setModalDetalleOrgullo(item)}
                className={`stagger-fade-up stagger-delay-${(idx % 3) + 1} harvard-card-gpu bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between group`}
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 border-b-2 border-[#8B1515]">
                    <OptimizedImage
                      src={item.foto_url}
                      alt={item.titulo}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#002855] text-white text-[10px] font-bold uppercase tracking-wider">
                      {item.subtitulo_categoria}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-mono font-bold">
                      {item.anio}
                    </span>
                  </div>
                  <div className="p-6 space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B1515] dark:text-red-400 block">
                      {item.carrera_nombre || "Facultad de Ciencias Matemáticas"}
                    </span>
                    <h3 className="font-harvard-serif text-lg sm:text-xl font-bold text-[#002855] dark:text-white group-hover:text-[#8B1515] dark:group-hover:text-red-400 transition-colors leading-snug">
                      {item.titulo}
                    </h3>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Distinción otorgada a: {item.estudiante}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {item.descripcion}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-3.5 bg-[#f8f6f0] dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#002855] dark:text-blue-300">
                  <span>Leer reseña honorífica</span>
                  <ChevronRight className="w-4 h-4 text-[#8B1515]" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===================================================================
            5. DIRECTORIO DEL CLAUSTRO DOCENTE E INVESTIGADORES
            =================================================================== */}
        <section id="plana-docente" className="space-y-8">
          <div className="border-t-2 border-b-2 border-[#002855] dark:border-slate-700 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B1515] dark:text-red-400 block">
                Claustro Universitario • Catedráticos e Investigadores RENACYT
              </span>
              <h2 className="font-harvard-serif text-2xl sm:text-4xl font-bold text-[#002855] dark:text-white tracking-tight mt-1">
                Plana Docente por Escuela Profesional
              </h2>
            </div>

            {/* Buscador Clásico de Cátedra */}
            <div className="w-full lg:w-96 flex items-center border-2 border-[#002855] dark:border-slate-700 bg-white dark:bg-slate-900">
              <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={busquedaDocentes}
                onChange={(e) => setBusquedaDocentes(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navegar("/docentes");
                }}
                placeholder="Apellido del catedrático o línea..."
                className="w-full px-3 py-2 text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => navegar("/docentes")}
                className="px-4 py-2 bg-[#002855] hover:bg-[#8B1515] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shrink-0"
              >
                Buscar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {carreras.map((car, idx) => {
              const docentesEscuela = docentes.filter((d) => d.carrera_id === car.id);
              const principalesCount = docentesEscuela.filter(
                (d) => d.categoria_docente === "Principal"
              ).length;
              return (
                <div
                  key={car.id}
                  onClick={() => navegar("/docentes", { docenteCarrera: car.id })}
                  className={`stagger-fade-up stagger-delay-${(idx % 4) + 1} harvard-card-gpu bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 border-t-4 border-t-[#002855] p-6 shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between space-y-5 group`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      <span>Depto. {car.codigo_escuela}</span>
                      <span className="text-[#8B1515] dark:text-red-400">
                        {docentesEscuela.length} Catedráticos
                      </span>
                    </div>

                    <h3 className="font-harvard-serif text-lg font-bold text-[#002855] dark:text-white group-hover:text-[#8B1515] dark:group-hover:text-red-400 transition-colors leading-snug">
                      Claustro de {car.nombre}
                    </h3>

                    <div className="flex items-center -space-x-2 py-1">
                      {docentesEscuela.slice(0, 5).map((doc) => (
                        <div
                          key={doc.id}
                          className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-800 overflow-hidden shadow-xs flex items-center justify-center text-[10px] font-bold text-white"
                          title={`${doc.grado_academico} ${doc.nombre_completo}`}
                        >
                          {doc.foto_url ? (
                            <img
                              src={doc.foto_url}
                              alt={doc.nombre_completo}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <span>{obtenerInicialesDocente(doc.nombre_completo)}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {docentesEscuela
                        .slice(0, 2)
                        .map((d) => `${d.grado_academico} ${d.nombre_completo.split(",")[0]}`)
                        .join(" • ")}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {principalesCount} Principales
                    </span>
                    <span className="text-[#8B1515] dark:text-red-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Directorio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => navegar("/docentes", { docenteCarrera: "TODAS" })}
              className="px-6 py-3 bg-[#002855] hover:bg-[#8B1515] text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>Explorar Directorio General del Claustro Docente ({docentes.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ===================================================================
            6. CRONOGRAMA ACADÉMICO OFICIAL 2026-I Y 2026-II
            =================================================================== */}
        <CalendarioAcademicoSection config={calendarioConfig} />
      </div>
    </main>
  );
}
