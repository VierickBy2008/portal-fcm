"use client";

import React, { useRef } from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cpu,
  Download,
  Edit3,
  FileText,
  FolderOpen,
  GraduationCap,
  Layers,
  Network,
  Newspaper,
  Search,
  Sigma,
  Sliders,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import type { HomeViewProps } from "@/app/components/views/HomeView";
import type { CarreraId } from "@/app/types/portal";
import { TEMA_CARRERA } from "@/app/data/portalInitialData";
import {
  BENTO_ESPECIALIZACIONES_DEFAULT,
  HERO_CONFIG_ACADEMICO_INICIAL,
} from "@/app/data/portalExtrasData";
import {
  formatearFechaEspanol,
  obtenerInicialesDocente,
} from "@/app/utils/portalFormatters";
import { OptimizedImage } from "@/app/components/ui/OptimizedImage";
import { CalendarioAcademicoSection } from "@/app/components/views/CalendarioAcademicoSection";
import {
  BentoSkeleton,
  CalendarioSkeleton,
  DocentesSkeleton,
  HeroSkeleton,
} from "@/app/components/ui/SkeletonLoaders";

const CARRERA_IMG_FALLBACK: Record<CarreraId, string> = {
  "computacion-cientifica":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
  matematica:
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80",
  estadistica:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
  "investigacion-operativa":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
};

function renderIconoAcademico(id: CarreraId) {
  switch (id) {
    case "computacion-cientifica":
      return <Cpu className="w-5 h-5 text-cyan-400" />;
    case "matematica":
      return <Sigma className="w-5 h-5 text-rose-400" />;
    case "estadistica":
      return <BarChart3 className="w-5 h-5 text-amber-400" />;
    case "investigacion-operativa":
      return <Network className="w-5 h-5 text-emerald-400" />;
  }
}

export function HomeViewAcademico({
  cargandoConfig,
  heroConfigAcademico,
  slideActivoHero,
  totalSlidesHero,
  setPausarSliderHero,
  anteriorSlideHero,
  siguienteSlideHero,
  cambiarSlideHero,
  heroBgUrl,
  heroDefaultBgUrl,
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

  const bgUrlAcad =
    heroConfigAcademico?.hero_bg_url ||
    HERO_CONFIG_ACADEMICO_INICIAL.hero_bg_url ||
    heroBgUrl ||
    heroDefaultBgUrl;
  const blurAcad =
    heroConfigAcademico?.hero_blur ?? HERO_CONFIG_ACADEMICO_INICIAL.hero_blur;
  const overlayColorAcad =
    heroConfigAcademico?.hero_overlay_color ||
    HERO_CONFIG_ACADEMICO_INICIAL.hero_overlay_color ||
    "#06152d";
  const overlayOpacityAcad =
    heroConfigAcademico?.hero_overlay_opacity ??
    HERO_CONFIG_ACADEMICO_INICIAL.hero_overlay_opacity;
  const etiquetaAcad =
    heroConfigAcademico?.etiqueta_campus ||
    HERO_CONFIG_ACADEMICO_INICIAL.etiqueta_campus;
  const tituloAcad =
    heroConfigAcademico?.titulo_principal ||
    HERO_CONFIG_ACADEMICO_INICIAL.titulo_principal;
  const descripcionAcad =
    heroConfigAcademico?.descripcion_campus ||
    HERO_CONFIG_ACADEMICO_INICIAL.descripcion_campus;

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
    <main className="flex-1 w-full overflow-x-hidden view-transition-gpu bg-[#f8fafc] dark:bg-[#070d19]">
      {/* 1. HERO CAMPUS ACADÉMICO MODERNO FULL-WIDTH CON CONTROLES GHOST DISCRETOS */}
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
              ? overlayColorAcad
              : noticiasDestacadas[slideActivoHero - 1]?.color_fondo || "#002855",
        }}
        className="group relative w-full text-white border-b-4 border-cyan-500/80 shadow-2xl overflow-hidden transition-colors duration-700 ease-in-out"
      >
        {/* Flechas laterales sutiles estilo ghost glassmorphism */}
        {totalSlidesHero > 1 && (
          <>
            <button
              type="button"
              onClick={anteriorSlideHero}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/25 text-white/75 hover:text-white flex items-center justify-center transition-all duration-300 opacity-0 md:opacity-20 group-hover:opacity-80 hover:!opacity-100 active:scale-95 backdrop-blur-md cursor-pointer border border-white/15"
              aria-label="Diapositiva anterior"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={siguienteSlideHero}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/25 text-white/75 hover:text-white flex items-center justify-center transition-all duration-300 opacity-0 md:opacity-20 group-hover:opacity-80 hover:!opacity-100 active:scale-95 backdrop-blur-md cursor-pointer border border-white/15"
              aria-label="Siguiente diapositiva"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Pista deslizante GPU */}
        <div
          className="flex w-full transition-transform duration-700 ease-in-out will-change-transform"
          style={{ transform: `translateX(-${slideActivoHero * 100}%)` }}
        >
          {/* SLIDE 0: CAMPUS ACADÉMICO MODERNO */}
          <div className="w-full shrink-0 relative min-h-[520px] sm:min-h-[580px] flex flex-col justify-center px-6 sm:px-16 py-12 sm:py-16 overflow-hidden">
            <img
              src={bgUrlAcad}
              alt="Campus Académico FCM UNMSM"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500"
              style={{ filter: `blur(${blurAcad}px)` }}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: overlayColorAcad,
                opacity: Math.min(0.95, Math.max(0.2, overlayOpacityAcad / 100)),
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#041024]/90 via-[#002855]/65 to-slate-950/75 pointer-events-none" />

            {adminAutenticado && (
              <button
                type="button"
                onClick={() => setModalHeroFondoAbierto(true)}
                className="absolute top-4 right-4 z-20 px-3.5 py-2 rounded-xl bg-black/65 hover:bg-black/90 text-white text-xs font-bold border border-cyan-400/40 backdrop-blur-md shadow-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                title="Personalizar Hero Campus Académico Moderno"
              >
                <Sliders className="w-4 h-4 text-cyan-300" />
                <span>
                  Editar Hero Campus ({overlayOpacityAcad}% • {blurAcad}px)
                </span>
              </button>
            )}

            <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Columna Izquierda: Identidad Educativa + Buscador */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-200 text-[11px] font-bold uppercase tracking-widest border border-cyan-400/35 backdrop-blur-md">
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  <span>{etiquetaAcad}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                  {tituloAcad}
                </h1>

                <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
                  {descripcionAcad}
                </p>

                {/* Buscador Académico Moderno */}
                <div className="relative max-w-2xl w-full pt-1">
                  <div className="relative flex items-center shadow-2xl rounded-xl overflow-hidden border-2 border-cyan-400/40 bg-white">
                    <Search className="w-5 h-5 text-[#002855] absolute left-4 pointer-events-none" />
                    <input
                      type="text"
                      value={busquedaGlobal}
                      onChange={(e) => setBusquedaGlobal(e.target.value)}
                      placeholder="Buscar asignatura (ej. CS113, MAT312), sílabo, docente o material académico..."
                      className="w-full pl-12 pr-24 py-3.5 sm:py-4 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
                    />
                    {busquedaGlobal ? (
                      <button
                        type="button"
                        onClick={() => setBusquedaGlobal("")}
                        className="absolute right-2.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        Limpiar
                      </button>
                    ) : (
                      <span className="hidden sm:inline-flex absolute right-3 px-2.5 py-1 rounded-md bg-slate-100 text-[#002855] font-mono text-[10px] font-bold border border-slate-200">
                        2026-I / II
                      </span>
                    )}
                  </div>

                  {busquedaGlobal.trim() !== "" && (
                    <div className="absolute left-0 right-0 mt-2 rounded-xl bg-white text-slate-900 border-2 border-[#002855] shadow-2xl p-4 z-40 space-y-3 max-h-96 overflow-y-auto">
                      {resultadosBusquedaHero.cursos.length === 0 &&
                      resultadosBusquedaHero.materiales.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-4">
                          No se encontraron registros académicos para &ldquo;{busquedaGlobal}&rdquo;.
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {resultadosBusquedaHero.cursos.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setBusquedaGlobal("");
                                navegarACarrera(c.carrera_id);
                              }}
                              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition-colors cursor-pointer"
                            >
                              <div>
                                <span className="font-mono text-xs font-bold text-[#002855]">
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
                              <ChevronRight className="w-4 h-4 text-[#002855]" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Accesos Rápidos Universitarios */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => navegar("/repositorio")}
                    className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-cyan-500/30 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Repositorio Digital</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navegar("/docentes")}
                    className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-cyan-500/30 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-300" />
                    <span>Plana Catedrática ({docentes.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navegar("/transparencia")}
                    className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-cyan-500/30 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Transparencia Universitaria</span>
                  </button>
                </div>
              </div>

              {/* Columna Derecha: Tablero de Indicadores Académicos en Vivo */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-slate-950/65 backdrop-blur-xl border border-cyan-400/30 p-5 sm:p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                        Estructura Académica FCM
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                      Plan Curricular Activo
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                      <span className="text-2xl font-extrabold text-white block">
                        {carreras.length}
                      </span>
                      <span className="text-[11px] text-slate-300 font-medium">
                        Escuelas Profesionales
                      </span>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                      <span className="text-2xl font-extrabold text-cyan-300 block">
                        {malla.length}
                      </span>
                      <span className="text-[11px] text-slate-300 font-medium">
                        Asignaturas Oficiales
                      </span>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                      <span className="text-2xl font-extrabold text-amber-300 block">
                        {docentes.length}
                      </span>
                      <span className="text-[11px] text-slate-300 font-medium">
                        Docentes e Investigadores
                      </span>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                      <span className="text-2xl font-extrabold text-emerald-300 block">
                        10 Ciclos
                      </span>
                      <span className="text-[11px] text-slate-300 font-medium">
                        Bachillerato + Licenciatura
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 block">
                      Acceso directo a Mallas Curriculares:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {carreras.map((car) => (
                        <button
                          key={car.id}
                          type="button"
                          onClick={() => navegarACarrera(car.id)}
                          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer group/btn"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {renderIconoAcademico(car.id)}
                            <span className="text-[11px] font-bold text-white truncate">
                              {car.nombre}
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-cyan-300 shrink-0 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDES SIGUIENTES (1..N): COMUNICADOS DESTACADOS */}
          {noticiasDestacadas.map((noticia) => (
            <div
              key={noticia.id}
              className="w-full shrink-0 relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center px-6 sm:px-16 py-12 sm:py-16 overflow-hidden"
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
                  />
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      backgroundColor:
                        noticia.fondo_overlay_color || noticia.color_fondo || "#002855",
                      opacity: (noticia.fondo_overlay_opacity ?? 65) / 100,
                    }}
                  />
                </div>
              )}

              <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center relative z-10">
                <div className="md:col-span-7 space-y-4 sm:space-y-5 text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 shadow-sm backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {noticia.categoria || "Comunicado Oficial"}
                  </span>

                  <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
                    {noticia.titulo}
                  </h2>

                  <p className="text-xs sm:text-sm md:text-base text-white/90 line-clamp-3 leading-relaxed max-w-xl">
                    {noticia.resumen}
                  </p>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => navegar("/noticias/[id]", { noticiaId: noticia.id })}
                      className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg cursor-pointer"
                    >
                      <span>Leer comunicado académico completo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-5 flex justify-center items-center">
                  <div className="relative w-full max-w-md aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-2 border-cyan-400/30 bg-slate-900">
                    <img
                      src={noticia.imagen_url}
                      alt={noticia.titulo}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicadores inferiores */}
        <div className="pb-5 flex items-center justify-center gap-2 sm:gap-2.5 z-20 relative">
          <button
            type="button"
            onClick={() => cambiarSlideHero(0)}
            className={`cursor-pointer transition-all duration-300 ${
              slideActivoHero === 0
                ? "w-10 sm:w-14 h-2 rounded-full bg-cyan-400 shadow-md"
                : "w-6 sm:w-8 h-2 rounded-full bg-white/40 hover:bg-white/70"
            }`}
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
                    ? "w-10 sm:w-14 h-2 rounded-full bg-cyan-400 shadow-md"
                    : "w-6 sm:w-8 h-2 rounded-full bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Ir al comunicado ${idx + 1}`}
              />
            );
          })}
        </div>
      </section>

      {/* CONTENEDOR CENTRAL DEL CAMPUS ACADÉMICO MODERNO */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12 sm:space-y-16">
        {/* 2. ESCUELAS PROFESIONALES CON CABECERA FOTOGRÁFICA Y FICHA CURRICULAR MODERNA */}
        <section className="space-y-6 reveal-on-scroll">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#002855] dark:border-l-cyan-400 shadow-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#002855] dark:text-cyan-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> Oferta Académica Oficial de Pregrado • UNMSM
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Escuelas Profesionales y Planes de Estudio 2026
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
              Cada escuela integra su fotografía referencial de laboratorio/cátedra, malla curricular de 10 ciclos y tríptico oficial descargable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {carreras.map((car, idx) => {
              const cursosCar = malla.filter((c) => c.carrera_id === car.id);
              const totalCreditosMalla = cursosCar.reduce((acc, c) => acc + c.creditos, 0);
              const temaCar = TEMA_CARRERA[car.id];
              const metaDefault = BENTO_ESPECIALIZACIONES_DEFAULT[car.id];
              const creditosMostrar =
                typeof car.creditos_bento === "number" && car.creditos_bento > 0
                  ? String(car.creditos_bento)
                  : totalCreditosMalla >= 180
                  ? totalCreditosMalla.toFixed(0)
                  : String(metaDefault.creditos);
              const pilaresMostrar =
                Array.isArray(car.pilares_bento) &&
                car.pilares_bento.filter((p) => p.trim().length > 0).length > 0
                  ? car.pilares_bento.filter((p) => p.trim().length > 0)
                  : metaDefault.pilares;

              return (
                <article
                  key={car.id}
                  onClick={() => navegarACarrera(car.id)}
                  className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#002855] dark:hover:border-cyan-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer gpu-card"
                >
                  <div>
                    {/* Imagen referencial de la carrera con indicadores */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                      <OptimizedImage
                        src={
                          car.imagen_referencial_url && car.imagen_referencial_url.trim().length > 0
                            ? car.imagen_referencial_url
                            : CARRERA_IMG_FALLBACK[car.id]
                        }
                        alt={`E.P. de ${car.nombre}`}
                        priority={idx < 2}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001833]/95 via-slate-950/40 to-black/25" />

                      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between gap-2 z-10">
                        <span
                          className={`px-3 py-1 rounded-md ${temaCar.headerBg} text-white font-mono text-xs font-bold shadow-md border border-white/20`}
                        >
                          {car.codigo_escuela}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-md bg-black/55 backdrop-blur-md text-white text-[11px] font-bold border border-white/15 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-300" />
                            {car.duracion_bento || "10 Ciclos"}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-cyan-500/80 backdrop-blur-md text-slate-950 font-mono text-[11px] font-extrabold">
                            {creditosMostrar} cr.
                          </span>
                        </div>
                      </div>

                      <div className="absolute bottom-3.5 left-5 right-5 z-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 block">
                          {car.subtitulo_bento || metaDefault.subtitulo}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-cyan-200 transition-colors">
                          Escuela Profesional de {car.nombre}
                        </h3>
                      </div>
                    </div>

                    {/* Contenido Académico Estructurado */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {car.perfil_egreso || car.descripcion}
                      </p>

                      {/* Líneas de Especialización */}
                      <div className="flex flex-wrap gap-1.5">
                        {pilaresMostrar.map((pilar) => (
                          <span
                            key={pilar}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#002855] dark:text-cyan-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700"
                          >
                            • {pilar}
                          </span>
                        ))}
                      </div>

                      {/* Tabla compacta de Grado, Título y Plan */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-start gap-2">
                          <GraduationCap className="w-4 h-4 text-[#002855] dark:text-cyan-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Grado Oficial
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                              {car.grado_academico}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Layers className="w-4 h-4 text-[#002855] dark:text-cyan-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Malla Curricular
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                              {cursosCar.length} cursos activos
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Acción Académica */}
                  <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navegarACarrera(car.id);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#002855] hover:bg-blue-900 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Ver Malla Curricular</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDescargarTripticoPorCarrera(car, e)}
                      className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-red-700 text-slate-700 dark:text-slate-200 hover:text-white border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tríptico PDF</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. BOLETÍN Y GACETA UNIVERSITARIA MODERNA */}
        <section className="space-y-6 reveal-on-scroll">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-red-700 shadow-xs">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-700 dark:text-red-400">
                Boletín Académico e Institucional
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-[#002855] dark:text-cyan-400" />
                Actualidad, Convocatorias y Resoluciones
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navegar("/noticias")}
              className="px-4 py-2 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Ver Hemeroteca Oficial ({noticias.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
                  className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#002855] dark:hover:border-cyan-400 shadow-xs hover:shadow-xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all gpu-card"
                >
                  <div>
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      <OptimizedImage
                        src={not.imagen_url}
                        alt={not.titulo}
                        priority={idx < 2}
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#002855]/90 text-white backdrop-blur-xs">
                        {not.categoria}
                      </span>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-red-700 dark:text-cyan-400" />
                        <span>{formatearFechaEspanol(not.fecha_publicacion)}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#002855] dark:group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                        {not.titulo}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {resumenLimpio}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#002855] dark:text-cyan-400">
                    <span>Leer nota académica</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 4. CUADRO DE HONOR Y ORGULLO SAN MARQUINO */}
        <section id="orgullo-sanmarquino" className="space-y-6 reveal-on-scroll">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-amber-500 shadow-xs">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                <Award className="w-4 h-4" /> Mérito Científico & Representación Internacional
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                Cuadro de Honor: Orgullo San Marquino
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navegar("/orgullo")}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Galería de Mérito ({orgulloItems.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              {adminAutenticado && (
                <button
                  type="button"
                  onClick={() => {
                    setTabAdmin("orgullo");
                    navegar("/admin");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>CMS</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgulloItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => setModalDetalleOrgullo(item)}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all gpu-card"
              >
                <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
                  <OptimizedImage
                    src={item.foto_url}
                    alt={item.titulo}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-[#002855]/90 text-white">
                      {item.subtitulo_categoria}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-950">
                      {item.anio}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block">
                      {item.carrera_nombre || "FCM UNMSM"}
                    </span>
                    <h3 className="text-base font-bold leading-snug line-clamp-2">
                      {item.titulo}
                    </h3>
                  </div>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {item.descripcion}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#002855] dark:text-cyan-400">
                    <span className="truncate">👤 {item.estudiante}</span>
                    <span className="text-amber-600 dark:text-amber-400 shrink-0">
                      Ver Distinción →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CLAUSTRO DOCENTE E INVESTIGADORES */}
        <section id="plana-docente" className="space-y-6 reveal-on-scroll">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-cyan-500 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                Directorio Oficial de Cátedra e Investigación
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Plana Docente por Escuela Profesional
              </h2>
            </div>

            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={busquedaDocentes}
                onChange={(e) => setBusquedaDocentes(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navegar("/docentes");
                }}
                placeholder="Filtrar catedrático o especialidad..."
                className="w-full pl-10 pr-20 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#002855]"
              />
              <button
                type="button"
                onClick={() => navegar("/docentes")}
                className="absolute right-1.5 top-1.5 px-3 py-1 rounded-lg bg-[#002855] text-white text-[11px] font-bold cursor-pointer"
              >
                Ver Todos
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {carreras.map((car) => {
              const temaCar = TEMA_CARRERA[car.id];
              const docentesEscuela = docentes.filter((d) => d.carrera_id === car.id);
              const principalesCount = docentesEscuela.filter(
                (d) => d.categoria_docente === "Principal"
              ).length;
              return (
                <div
                  key={car.id}
                  onClick={() => navegar("/docentes", { docenteCarrera: car.id })}
                  className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#002855] dark:hover:border-cyan-400 shadow-xs hover:shadow-xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all gpu-card"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-white ${temaCar.headerBg}`}
                      >
                        {car.codigo_escuela}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {docentesEscuela.length} Catedráticos
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#002855] dark:group-hover:text-cyan-300 transition-colors">
                        E.P. de {car.nombre}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {principalesCount} Docentes Principales • Investigación RENACYT
                      </p>
                    </div>

                    <div className="flex items-center -space-x-2.5 pt-1">
                      {docentesEscuela.slice(0, 5).map((doc) => (
                        <div
                          key={doc.id}
                          className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-800 overflow-hidden shadow-xs flex items-center justify-center text-[11px] font-bold text-white"
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
                  </div>

                  <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#002855] dark:text-cyan-400">
                    <span>Explorar Plana Docente</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. CALENDARIO ACADÉMICO SEMESTRAL */}
        <CalendarioAcademicoSection config={calendarioConfig} />
      </div>
    </main>
  );
}
