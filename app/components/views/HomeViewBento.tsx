"use client";

import React, { useRef } from "react";
import {
  ArrowRight,
  Award,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Newspaper,
  Search,
  Sliders,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import type { HomeViewProps } from "@/app/components/views/HomeView";
import { TEMA_CARRERA } from "@/app/data/portalInitialData";
import { formatearFechaEspanol, obtenerInicialesDocente } from "@/app/utils/portalFormatters";
import { OptimizedImage } from "@/app/components/ui/OptimizedImage";
import { BentoCarrerasHome } from "@/app/components/views/BentoCarrerasHome";
import { CalendarioAcademicoSection } from "@/app/components/views/CalendarioAcademicoSection";
import {
  BentoSkeleton,
  CalendarioSkeleton,
  DocentesSkeleton,
  HeroSkeleton,
} from "@/app/components/ui/SkeletonLoaders";

export function HomeViewBento({
  cargandoConfig,
  slideActivoHero,
  totalSlidesHero,
  setPausarSliderHero,
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
  const touchStartXRef = useRef<number | null>(null);

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

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-14 overflow-x-hidden view-transition-gpu">
      {/* 1. SECCIÓN PRINCIPAL: MASTER SLIDER CON HERO ACADÉMICO PERMANENTE + NOTICIAS */}
      <section
        onMouseEnter={() => setPausarSliderHero(true)}
        onMouseLeave={() => setPausarSliderHero(false)}
        onTouchStart={(e) => {
          touchStartXRef.current = e.touches[0].clientX;
          setPausarSliderHero(true);
        }}
        onTouchEnd={(e) => {
          if (touchStartXRef.current !== null) {
            const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
            if (diffX > 50) {
              anteriorSlideHero();
            } else if (diffX < -50) {
              siguienteSlideHero();
            }
            touchStartXRef.current = null;
          }
          setPausarSliderHero(false);
        }}
        style={{
          backgroundColor:
            slideActivoHero === 0
              ? heroOverlayColor || "#0f172a"
              : noticiasDestacadas[slideActivoHero - 1]?.color_fondo || "#4d0713",
        }}
        className="relative text-white rounded-3xl shadow-2xl border-b-4 border-red-900/70 overflow-hidden transition-colors duration-700 ease-in-out"
      >
        {/* Botones de navegación lateral con micro-efecto táctil (visibles si hay más de 1 slide) */}
        {totalSlidesHero > 1 && (
          <>
            <button
              type="button"
              onClick={anteriorSlideHero}
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 backdrop-blur-md cursor-pointer border border-white/25 shadow-xl"
              aria-label="Diapositiva anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={siguienteSlideHero}
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 backdrop-blur-md cursor-pointer border border-white/25 shadow-xl"
              aria-label="Siguiente diapositiva"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Pista deslizante ultra-fluida acelerada por hardware GPU */}
        <div
          className="flex w-full transition-transform duration-700 ease-in-out will-change-transform"
          style={{ transform: `translateX(-${slideActivoHero * 100}%)` }}
        >
          {/* SLIDE 0: HERO ACADÉMICO PERMANENTE CON BUSCADOR */}
          <div className="w-full shrink-0 relative min-h-[460px] sm:min-h-[520px] flex flex-col justify-center items-center text-center p-6 sm:p-12 overflow-hidden">
            <img
              src={heroBgUrl || heroDefaultBgUrl}
              alt="Facultad de Ciencias Matemáticas UNMSM"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500"
              style={{ filter: `blur(${heroBlur}px)` }}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: heroOverlayColor || "#0f172a",
                opacity: Math.min(0.95, Math.max(0, heroOverlayOpacity / 100)),
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30 pointer-events-none" />

            {adminAutenticado && (
              <button
                type="button"
                onClick={() => setModalHeroFondoAbierto(true)}
                className="absolute top-4 right-4 z-20 px-3.5 py-2 rounded-xl bg-black/65 hover:bg-black/90 text-white text-xs font-bold border border-white/25 backdrop-blur-md shadow-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                title="Personalizar Fondo, Blur y Opacidad del Hero"
              >
                <Sliders className="w-4 h-4 text-amber-300" />
                <span>
                  Personalizar Fondo Hero ({heroOverlayOpacity}% • {heroBlur}px)
                </span>
              </button>
            )}

            <div className="relative z-10 max-w-4xl mx-auto space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-700/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg border border-red-500/30 backdrop-blur-xs">
                <Building2 className="w-3.5 h-3.5" />
                <span>Facultad de Ciencias Matemáticas • UNMSM</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-lg">
                Portal Académico e Investigación en{" "}
                <span className="underline decoration-red-500 decoration-4 underline-offset-4">
                  Ciencias Exactas y Computación Científica
                </span>
              </h1>

              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed drop-shadow font-normal">
                Explora los planes de estudio completos de los 10 ciclos para{" "}
                <strong className="text-white">Computación Científica</strong>,{" "}
                <strong className="text-white">Matemática</strong>,{" "}
                <strong className="text-white">Estadística</strong> e{" "}
                <strong className="text-white">Investigación Operativa</strong>.
              </p>

              {/* Buscador Global en el Hero */}
              <div className="relative max-w-2xl mx-auto w-full pt-1 text-left">
                <div className="relative flex items-center shadow-2xl rounded-2xl">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={busquedaGlobal}
                    onChange={(e) => setBusquedaGlobal(e.target.value)}
                    placeholder="Buscar curso (ej. CS113, AI264, MAT312), docente o material del repositorio..."
                    className="w-full pl-12 pr-24 py-3.5 sm:py-4 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-4 focus:ring-red-500/40 border border-slate-200"
                  />
                  {busquedaGlobal && (
                    <button
                      onClick={() => setBusquedaGlobal("")}
                      className="absolute right-3 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {busquedaGlobal.trim() !== "" && (
                  <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white text-slate-900 border-2 border-blue-900 shadow-2xl p-4 z-40 space-y-4 max-h-96 overflow-y-auto">
                    {resultadosBusquedaHero.cursos.length === 0 &&
                    resultadosBusquedaHero.materiales.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">
                        No se encontraron resultados para &ldquo;{busquedaGlobal}&rdquo;.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {resultadosBusquedaHero.cursos.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setBusquedaGlobal("");
                              navegarACarrera(c.carrera_id);
                            }}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition-colors cursor-pointer"
                          >
                            <div>
                              <span className="font-mono text-xs font-bold text-red-700">
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
                            <ChevronRight className="w-4 h-4 text-blue-900" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SLIDES SIGUIENTES (1..N): NOTICIAS Y COMUNICADOS */}
          {noticiasDestacadas.map((noticia) => (
            <div
              key={noticia.id}
              className="w-full shrink-0 relative min-h-[460px] sm:min-h-[520px] flex items-center p-6 sm:p-12 overflow-hidden"
            >
              {noticia.fondo_imagen_url && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src={
                      noticia.fondo_imagen_url.startsWith("blob:")
                        ? "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
                        : noticia.fondo_imagen_url
                    }
                    alt=""
                    className="w-full h-full object-cover scale-105 transition-all duration-700"
                    style={{
                      filter: `blur(${noticia.fondo_blur ?? 4}px)`,
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80";
                    }}
                  />
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      backgroundColor:
                        noticia.fondo_overlay_color || noticia.color_fondo || "#002855",
                      opacity: (noticia.fondo_overlay_opacity ?? 60) / 100,
                    }}
                  />
                </div>
              )}

              <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center relative z-10">
                <div className="md:col-span-7 space-y-4 sm:space-y-5 text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/40 text-red-200 border border-white/20 shadow-sm backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    {noticia.categoria || "Comunicado Oficial"}
                  </span>

                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-md">
                    {noticia.titulo}
                  </h2>

                  <p className="text-xs sm:text-sm md:text-base text-white/90 line-clamp-3 leading-relaxed max-w-xl drop-shadow-xs">
                    {noticia.resumen}
                  </p>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => navegar("/noticias/[id]", { noticiaId: noticia.id })}
                      className="inline-flex items-center gap-2.5 px-5 py-2.5 sm:py-3 rounded-xl bg-black/45 hover:bg-black/70 text-white font-bold text-xs sm:text-sm border border-white/25 transition-all shadow-lg group cursor-pointer backdrop-blur-xs"
                    >
                      <span>Se informa... / Leer comunicado oficial</span>
                      <ChevronRight className="w-4 h-4 text-red-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-5 flex justify-center items-center">
                  {noticia.id === "not-pronabec-2026" ? (
                    <div className="relative w-full max-w-md aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-between p-4 group">
                      <img
                        src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80"
                        alt="Ministerio de Educación"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
                      <div className="relative z-10 w-full flex items-center justify-between gap-3">
                        <div className="bg-white/95 rounded-xl p-3 shadow-lg border border-slate-200 text-slate-900 text-left max-w-[130px]">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                            <span className="text-[9px] font-bold uppercase tracking-tight text-slate-800">
                              PERÚ
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-900 leading-tight">
                            Ministerio de Educación
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-3.5 shadow-xl border-2 border-blue-900/20 text-slate-900 text-center flex-1 max-w-[200px]">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="text-base sm:text-lg font-bold tracking-tighter text-[#002855]">
                              PRONABEC
                            </span>
                          </div>
                          <div className="h-1 w-full bg-gradient-to-r from-red-600 via-yellow-400 to-blue-600 rounded-full my-1" />
                          <div className="mt-1 bg-blue-50/80 rounded-lg py-1 px-1.5 border border-blue-200">
                            <span className="text-[9px] font-bold text-blue-950 uppercase block leading-tight">
                              DECRETO SUPREMO
                            </span>
                            <span className="text-[10px] font-bold text-red-700 block leading-tight">
                              Nº 017-2026-MINEDU
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full max-w-md aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 group">
                      <img
                        src={noticia.imagen_url}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicadores horizontales (Dash Pills) */}
        <div className="pb-4 flex items-center justify-center gap-2 sm:gap-2.5 z-20 relative">
          <button
            type="button"
            onClick={() => cambiarSlideHero(0)}
            className={`cursor-pointer transition-all duration-300 flex items-center justify-center ${
              slideActivoHero === 0
                ? "w-10 sm:w-14 h-2 rounded-full bg-white shadow-md"
                : "w-6 sm:w-8 h-2 rounded-full bg-white/40 hover:bg-white/70"
            }`}
            title="Slide Principal: Portal Académico"
            aria-label="Ir al Slide Principal"
          />
          {noticiasDestacadas.map((item, idx) => {
            const indiceSlide = idx + 1;
            return (
              <button
                key={item.id || idx}
                type="button"
                onClick={() => cambiarSlideHero(indiceSlide)}
                className={`cursor-pointer transition-all duration-300 ${
                  slideActivoHero === indiceSlide
                    ? "w-10 sm:w-14 h-2 rounded-full bg-white shadow-md"
                    : "w-6 sm:w-8 h-2 rounded-full bg-white/40 hover:bg-white/70"
                }`}
                title={item.titulo}
                aria-label={`Ir al comunicado ${idx + 1}`}
              />
            );
          })}
        </div>
      </section>

      {/* 2. BENTO GRID DE LAS 4 ESCUELAS PROFESIONALES */}
      <BentoCarrerasHome
        carreras={carreras}
        malla={malla}
        onExplorarCarrera={navegarACarrera}
        onDescargarTripticoCarrera={handleDescargarTripticoPorCarrera}
      />

      {/* 3. SECCIÓN DE NOTICIAS CON GRID LIMITADO A 4 + TARJETA "VER MÁS NOTICIAS" */}
      <section className="space-y-5 reveal-on-scroll">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-2 border-blue-900 pb-3">
          <div>
            <span className="text-xs font-bold uppercase text-red-700 dark:text-red-400">
              Actualidad Universitaria
            </span>
            <h2 className="text-2xl font-bold text-[#002855] dark:text-white flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-red-700 dark:text-red-400" />
              Noticias y Comunicados Oficiales
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs font-semibold text-slate-500">
              Mostrando los 4 comunicados más recientes
            </span>
            <button
              type="button"
              onClick={() => navegar("/noticias")}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-[#002855] dark:hover:bg-blue-600 text-[#002855] dark:text-blue-300 hover:text-white border border-blue-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Hemeroteca Completa ({noticias.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {noticias.slice(0, 4).map((not, idx) => {
            const resumenLimpio =
              (not.resumen && not.resumen.trim()) ||
              not.contenido
                .replace(/^[#>*-\d.]+\s*/gm, "")
                .replace(/\*\*/g, "")
                .replace(/\n+/g, " ")
                .trim();
            return (
              <article
                key={not.id}
                onClick={() => abrirNoticiaDetalle(not.id)}
                className={`stagger-fade-up stagger-delay-${(idx % 4) + 1} gpu-card group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#002855] dark:hover:border-blue-500 shadow-sm hover:shadow-xl overflow-hidden flex flex-col justify-between cursor-pointer ${
                  idx === 0 ? "md:col-span-2" : "md:col-span-1"
                }`}
              >
                <div>
                  <div className="relative h-56 bg-slate-900 overflow-hidden">
                    <OptimizedImage
                      src={not.imagen_url}
                      alt={not.titulo}
                      priority={idx < 2}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-10">
                      <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-[#002855] text-white shadow">
                        {not.categoria}
                      </span>
                      {not.destacado && (
                        <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-red-700 text-white shadow flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" /> Importante
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-red-700" />
                      <span>{formatearFechaEspanol(not.fecha_publicacion)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#002855] dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors leading-snug">
                      {not.titulo}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {resumenLimpio}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002855] dark:text-blue-300 group-hover:text-red-700 flex items-center gap-1.5">
                    <span>Leer noticia completa</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {not.modalidad && (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#002855] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {not.modalidad}
                    </span>
                  )}
                </div>
              </article>
            );
          })}

          {/* Tarjeta Institucional "Explorar Más Noticias" */}
          <div
            onClick={() => navegar("/noticias")}
            className="group rounded-2xl bg-gradient-to-br from-[#002855] via-[#001c3d] to-[#00132b] text-white p-7 border border-blue-900 shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-red-300 shadow-sm">
                  <Newspaper className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-700 text-white shadow-sm border border-red-500/30">
                  +{Math.max(0, noticias.length - 4)} Más
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-blue-200 block">
                  Hemeroteca FCM UNMSM
                </span>
                <h3 className="text-xl font-bold text-white leading-snug group-hover:text-red-300 transition-colors">
                  Explorar Más Noticias y Comunicados
                </h3>
                <p className="text-xs text-blue-100/80 leading-relaxed">
                  Revisa convocatorias de pasantías, becas PRONABEC, congresos internacionales,
                  resoluciones decanales y actividades de la facultad.
                </p>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <div className="w-full py-3 px-4 rounded-xl bg-white text-[#002855] font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-red-700 group-hover:text-white transition-all shadow-md">
                <span>Ver todas las noticias</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN INSTITUCIONAL: ORGULLO SAN MARQUINO / FCM */}
      <section id="orgullo-sanmarquino" className="space-y-6 pt-4">
        <div className="border-b-2 border-blue-900 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>EXCELENCIA ESTUDIANTIL E IMPACTO INTERNACIONAL • FCM UNMSM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#002855] dark:text-white flex items-center gap-2.5 tracking-tight">
              <Trophy className="w-7 h-7 text-amber-500" />
              <span>Orgullo San Marquino</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Celebramos el talento, la dedicación y los logros de nuestros estudiantes e
              investigadores que llevan el nombre de la Facultad de Ciencias Matemáticas y la Decana
              de América a los escenarios científicos más prestigiosos del mundo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-end">
            <button
              type="button"
              onClick={() => navegar("/orgullo")}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-[#002855] dark:hover:bg-blue-600 text-[#002855] dark:text-blue-300 hover:text-white border border-blue-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Galería Completa ({orgulloItems.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            {adminAutenticado && (
              <button
                type="button"
                onClick={() => {
                  setTabAdmin("orgullo");
                  navegar("/admin");
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-600 text-amber-800 dark:text-amber-300 hover:text-white border border-amber-300 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Gestionar CMS</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orgulloItems.slice(0, 3).map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setModalDetalleOrgullo(item)}
              className={`stagger-fade-up stagger-delay-${(idx % 3) + 1} gpu-card group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-600 dark:hover:border-red-500 shadow-md hover:shadow-2xl flex flex-col justify-between overflow-hidden cursor-pointer`}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                <OptimizedImage
                  src={item.foto_url}
                  alt={item.titulo}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none z-10" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-20">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#002855]/90 text-white backdrop-blur-md border border-white/20 shadow-md">
                    {item.subtitulo_categoria}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm">
                    {item.anio}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 space-y-1 text-white pointer-events-none z-20">
                  <span className="text-[11px] font-semibold text-red-300 block uppercase tracking-wider">
                    {item.carrera_nombre || "Facultad de Ciencias Matemáticas"}
                  </span>
                  <h3 className="text-base font-bold leading-tight line-clamp-2 drop-shadow-md">
                    {item.titulo}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium line-clamp-1">
                    👤 {item.estudiante}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {item.descripcion}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] font-bold text-[#002855] dark:text-blue-300">
                    {item.tipo_tarjeta === "afiche"
                      ? "📜 Afiche Oficial"
                      : item.tipo_tarjeta === "estudiante"
                      ? "⭐ Reconocimiento"
                      : "🏆 Delegación FCM"}
                  </span>
                  <span className="text-xs font-bold text-red-700 dark:text-red-400 group-hover:text-red-800 dark:group-hover:text-red-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Ver Detalle</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div
            onClick={() => navegar("/orgullo")}
            className="group relative rounded-2xl bg-gradient-to-br from-[#002855] via-[#001f42] to-[#4d0713] text-white p-6 sm:p-7 border-2 border-blue-800/80 shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden min-h-[380px]"
          >
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/15 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-md">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 shadow-sm border border-amber-400">
                  +{Math.max(0, orgulloItems.length - 3)} Más
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-300 block">
                  Reconocimientos FCM
                </span>
                <h3 className="text-xl font-bold text-white leading-snug group-hover:text-amber-200 transition-colors">
                  Galería Completa de Orgullo San Marquino
                </h3>
                <p className="text-xs text-blue-100/80 leading-relaxed">
                  Conoce todas las distinciones, pasantías en neurociencia, premios en hackathones y
                  congresos mundiales de nuestra facultad.
                </p>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <div className="w-full py-3 px-4 rounded-xl bg-white text-[#002855] font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-md">
                <span>Explorar todos los logros</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN "PLANA DOCENTE E INVESTIGADORES" EN EL HOME */}
      <section id="plana-docente" className="pt-4 space-y-8 reveal-on-scroll">
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-[#002855] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-red-700 dark:text-red-400" />
            <span>Excelencia Académica e Investigación • FCM UNMSM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#002855] dark:text-white tracking-tight">
            Plana Docente e Investigadores de la Facultad
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Selecciona una Escuela Profesional para conocer el perfil académico, especialidad,
            líneas de investigación y horarios de asesoría de nuestros catedráticos en una vista
            detallada.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={busquedaDocentes}
              onChange={(e) => setBusquedaDocentes(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navegar("/docentes");
                }
              }}
              placeholder="Buscar docente por apellido, especialidad o asignatura (Enter para ver directorio)..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#002855]"
            />
            <button
              type="button"
              onClick={() => navegar("/docentes")}
              className="absolute right-1.5 top-1.5 px-4 py-2 rounded-lg bg-[#002855] hover:bg-blue-900 text-[11px] font-bold text-white cursor-pointer transition-colors shadow-xs"
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {carreras.map((car, idx) => {
            const temaCar = TEMA_CARRERA[car.id];
            const docentesEscuela = docentes.filter((d) => d.carrera_id === car.id);
            const principalesCount = docentesEscuela.filter(
              (d) => d.categoria_docente === "Principal"
            ).length;
            return (
              <div
                key={car.id}
                onClick={() => navegar("/docentes", { docenteCarrera: car.id })}
                className={`stagger-fade-up stagger-delay-${(idx % 4) + 1} gpu-card group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${temaCar.cardHoverBorder} shadow-sm hover:shadow-xl overflow-hidden cursor-pointer flex flex-col justify-between text-center`}
              >
                <div>
                  <div
                    className={`relative h-44 w-full ${temaCar.headerBg} overflow-hidden flex flex-col items-center justify-center p-5 text-white`}
                  >
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/25 text-white/95">
                      {car.codigo_escuela}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
                      {docentesEscuela.length}{" "}
                      {docentesEscuela.length === 1 ? "Docente" : "Docentes"}
                    </div>

                    <div className="flex items-center justify-center -space-x-3 mb-3 mt-3">
                      {docentesEscuela.slice(0, 4).map((doc) => (
                        <div
                          key={doc.id}
                          className="w-12 h-12 rounded-full border-2 border-white bg-slate-800 overflow-hidden shadow-md flex items-center justify-center text-xs font-bold text-white"
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
                      {docentesEscuela.length > 4 && (
                        <div className="w-12 h-12 rounded-full border-2 border-white bg-black/60 text-white text-xs font-bold flex items-center justify-center shadow-md">
                          +{docentesEscuela.length - 4}
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] font-bold text-white/90 tracking-wide uppercase">
                      Plana Catedrática Oficial
                    </span>
                  </div>

                  <div className={`h-1.5 w-full ${temaCar.headerBg} opacity-80`} />

                  <div className="p-5 space-y-3">
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border ${temaCar.badgeSoft}`}
                    >
                      Escuela Profesional
                    </span>
                    <h3
                      className={`text-base sm:text-lg font-bold text-[#002855] dark:text-slate-100 ${temaCar.groupHoverText} transition-colors leading-snug`}
                    >
                      {car.nombre}
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {docentesEscuela
                        .slice(0, 2)
                        .map((d) => `${d.grado_academico} ${d.nombre_completo.split(",")[0]}`)
                        .join(" • ")}
                      {docentesEscuela.length > 2 ? ` y ${docentesEscuela.length - 2} más` : ""}
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                        {principalesCount} Principales
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-[10px] font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Calificar
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs font-bold text-[#002855] dark:text-blue-300 group-hover:text-red-700">
                  <span>Ver Docentes de {car.nombre}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-900 dark:to-[#0f1d38] border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-[#002855] dark:text-slate-100">
              Directorio Completo de la Plana Docente FCM
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Explora las 4 escuelas profesionales, categorías de cátedra, horarios de asesoría y
              valoraciones estudiantiles.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navegar("/docentes", { docenteCarrera: "TODAS" })}
            className="px-5 py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all shrink-0"
          >
            <Users className="w-4 h-4 text-red-400" />
            <span>Explorar Directorio General ({docentes.length}) →</span>
          </button>
        </div>
      </section>

      {/* 6. CALENDARIO ACADÉMICO DINÁMICO (RÉGIMEN SEMESTRAL 2026-I Y 2026-II EN 2 BLOQUES DESPLEGABLES) */}
      <CalendarioAcademicoSection config={calendarioConfig} />
    </main>
  );
}
