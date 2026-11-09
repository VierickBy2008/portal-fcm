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

function renderIconoEscuela(id: CarreraId) {
  switch (id) {
    case "computacion-cientifica":
      return <Cpu className="w-4 h-4 text-blue-400" />;
    case "matematica":
      return <Sigma className="w-4 h-4 text-red-400" />;
    case "estadistica":
      return <BarChart3 className="w-4 h-4 text-orange-400" />;
    case "investigacion-operativa":
      return <Network className="w-4 h-4 text-emerald-400" />;
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
    "#001833";
  const overlayOpacityAcad =
    heroConfigAcademico?.hero_overlay_opacity ??
    HERO_CONFIG_ACADEMICO_INICIAL.hero_overlay_opacity;
  const colorAcentoAcad =
    heroConfigAcademico?.color_acento_principal ||
    HERO_CONFIG_ACADEMICO_INICIAL.color_acento_principal ||
    "#8B1515";
  const etiquetaAcad =
    heroConfigAcademico?.etiqueta_campus ||
    HERO_CONFIG_ACADEMICO_INICIAL.etiqueta_campus;
  const tituloAcad =
    heroConfigAcademico?.titulo_principal ||
    HERO_CONFIG_ACADEMICO_INICIAL.titulo_principal;
  const descripcionAcad =
    heroConfigAcademico?.descripcion_campus ||
    HERO_CONFIG_ACADEMICO_INICIAL.descripcion_campus;
  const tituloTablero =
    heroConfigAcademico?.titulo_tablero ||
    HERO_CONFIG_ACADEMICO_INICIAL.titulo_tablero ||
    "Estructura Académica FCM";
  const estadoTablero =
    heroConfigAcademico?.estado_tablero ||
    HERO_CONFIG_ACADEMICO_INICIAL.estado_tablero ||
    "Plan Curricular 2026";

  const met1Valor =
    heroConfigAcademico?.metricas_personalizadas?.[0]?.valor ||
    heroConfigAcademico?.metrica_1_valor ||
    String(carreras.length);
  const met1Label =
    heroConfigAcademico?.metricas_personalizadas?.[0]?.label ||
    heroConfigAcademico?.metrica_1_label ||
    "Escuelas Profesionales";

  const met2Valor =
    heroConfigAcademico?.metricas_personalizadas?.[1]?.valor ||
    heroConfigAcademico?.metrica_2_valor ||
    String(malla.length);
  const met2Label =
    heroConfigAcademico?.metricas_personalizadas?.[1]?.label ||
    heroConfigAcademico?.metrica_2_label ||
    "Asignaturas Oficiales";

  const met3Valor =
    heroConfigAcademico?.metricas_personalizadas?.[2]?.valor ||
    heroConfigAcademico?.metrica_3_valor ||
    String(docentes.length);
  const met3Label =
    heroConfigAcademico?.metricas_personalizadas?.[2]?.label ||
    heroConfigAcademico?.metrica_3_label ||
    "Docentes e Investigadores";

  const met4Valor =
    heroConfigAcademico?.metricas_personalizadas?.[3]?.valor ||
    heroConfigAcademico?.metrica_4_valor ||
    "10 Ciclos";
  const met4Label =
    heroConfigAcademico?.metricas_personalizadas?.[3]?.label ||
    heroConfigAcademico?.metrica_4_label ||
    "Bachillerato + Licenciatura";

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
    <main className="flex-1 w-full overflow-x-hidden view-transition-gpu bg-slate-50 dark:bg-[#070b14]">
      {/* 1. HERO CAMPUS ACADÉMICO MODERNO FULL-WIDTH CON PALETA INSTITUCIONAL SAN MARCOS */}
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
              : noticiasDestacadas[slideActivoHero - 1]?.color_fondo || "#4d0713",
          borderBottomColor: colorAcentoAcad,
        }}
        className="group relative w-full text-white border-b-4 shadow-2xl overflow-hidden transition-colors duration-700 ease-in-out"
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#00132b]/90 via-[#002855]/65 to-[#2b070c]/75 pointer-events-none" />

            {adminAutenticado && (
              <button
                type="button"
                onClick={() => setModalHeroFondoAbierto(true)}
                className="absolute top-4 right-4 z-20 px-3.5 py-2 rounded-xl bg-black/65 hover:bg-black/90 text-white text-xs font-bold border border-white/25 backdrop-blur-md shadow-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                title="Personalizar Textos, Métricas, Fondo y Colores del Hero Campus"
              >
                <Sliders className="w-4 h-4 text-amber-300" />
                <span>
                  Editar Hero Campus ({overlayOpacityAcad}% • {blurAcad}px)
                </span>
              </button>
            )}

            <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Columna Izquierda: Identidad Educativa + Buscador */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div
                  style={{ backgroundColor: colorAcentoAcad }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-white text-[11px] font-bold uppercase tracking-wider border border-white/25 shadow-lg backdrop-blur-md"
                >
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  <span>{etiquetaAcad}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                  {tituloAcad}
                </h1>

                <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
                  {descripcionAcad}
                </p>

                {/* Buscador Académico con Paleta Institucional */}
                <div className="relative max-w-2xl w-full pt-1">
                  <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden border-2 border-white/30 bg-white focus-within:ring-4 focus-within:ring-red-500/40">
                    <Search className="w-5 h-5 text-[#002855] absolute left-4 pointer-events-none" />
                    <input
                      type="text"
                      value={busquedaGlobal}
                      onChange={(e) => setBusquedaGlobal(e.target.value)}
                      placeholder="Buscar asignatura (ej. CS113, MAT312), sílabo, docente o material académico..."
                      className="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
                    />
                    {busquedaGlobal ? (
                      <button
                        type="button"
                        onClick={() => setBusquedaGlobal("")}
                        className="absolute right-2.5 text-xs font-bold text-white bg-[#8B1515] hover:bg-red-800 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        Limpiar
                      </button>
                    ) : (
                      <span className="hidden sm:inline-flex absolute right-3 px-2.5 py-1 rounded-md bg-blue-50 text-[#002855] font-mono text-[10px] font-bold border border-blue-200">
                        2026-I / II
                      </span>
                    )}
                  </div>

                  {busquedaGlobal.trim() !== "" && (
                    <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white text-slate-900 border-2 border-[#002855] shadow-2xl p-4 z-40 space-y-3 max-h-96 overflow-y-auto">
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
                              <ChevronRight className="w-4 h-4 text-[#002855]" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Accesos Rápidos Universitarios con Acentos Sanmarquinos */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => navegar("/repositorio")}
                    className="px-3.5 py-2 rounded-xl bg-[#002855]/85 hover:bg-[#002855] border border-blue-400/30 text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-sm"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-amber-300" />
                    <span>Repositorio Digital</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navegar("/docentes")}
                    className="px-3.5 py-2 rounded-xl bg-[#8B1515]/85 hover:bg-[#8B1515] border border-red-400/30 text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-sm"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-300" />
                    <span>Plana Catedrática ({docentes.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navegar("/transparencia")}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-300" />
                    <span>Transparencia Universitaria</span>
                  </button>
                </div>
              </div>

              {/* Columna Derecha: Tablero de Indicadores Académicos Editables en CMS */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-[#00152e]/85 backdrop-blur-xl border border-white/20 border-t-4 border-t-[#8B1515] p-5 sm:p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        {tituloTablero}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/35 text-[10px] font-bold">
                      {estadoTablero}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                      <span className="text-2xl font-extrabold text-white block">
                        {met1Valor}
                      </span>
                      <span className="text-[11px] text-blue-100 font-medium">
                        {met1Label}
                      </span>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                      <span className="text-2xl font-extrabold text-amber-300 block">
                        {met2Valor}
                      </span>
                      <span className="text-[11px] text-blue-100 font-medium">
                        {met2Label}
                      </span>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                      <span className="text-2xl font-extrabold text-red-300 block">
                        {met3Valor}
                      </span>
                      <span className="text-[11px] text-blue-100 font-medium">
                        {met3Label}
                      </span>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                      <span className="text-2xl font-extrabold text-emerald-300 block">
                        {met4Valor}
                      </span>
                      <span className="text-[11px] text-blue-100 font-medium">
                        {met4Label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200 block">
                      Escuelas Profesionales (Colores Oficiales):
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {carreras.map((car) => (
                        <button
                          key={car.id}
                          type="button"
                          onClick={() => navegarACarrera(car.id)}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer group/btn"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {renderIconoEscuela(car.id)}
                            <span className="text-[11px] font-bold text-white truncate">
                              {car.nombre}
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-300 shrink-0 group-hover/btn:translate-x-0.5 transition-transform" />
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
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/45 text-red-200 border border-white/20 shadow-sm backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
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
                      className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#8B1515] hover:bg-red-800 text-white font-extrabold text-xs sm:text-sm border border-white/25 transition-all shadow-lg cursor-pointer"
                    >
                      <span>Leer comunicado académico completo</span>
                      <ChevronRight className="w-4 h-4 text-amber-300" />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-5 flex justify-center items-center">
                  <div className="relative w-full max-w-md aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/25 bg-slate-900">
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
                ? "w-10 sm:w-14 h-2 rounded-full bg-white shadow-md"
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
                    ? "w-10 sm:w-14 h-2 rounded-full bg-white shadow-md"
                    : "w-6 sm:w-8 h-2 rounded-full bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Ir al comunicado ${idx + 1}`}
              />
            );
          })}
        </div>
      </section>

      {/* CONTENEDOR CENTRAL DEL CAMPUS ACADÉMICO MODERNO CON PALETA ORIGINAL SAN MARCOS */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12 sm:space-y-16">
        {/* 2. ESCUELAS PROFESIONALES CON IDENTIDAD CROMÁTICA PROPIA POR ESCUELA (TEMA_CARRERA) */}
        <section className="space-y-6 reveal-on-scroll">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#002855] dark:border-l-red-600 shadow-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> Oferta Académica Oficial de Pregrado • UNMSM
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002855] dark:text-white tracking-tight">
                Escuelas Profesionales y Planes de Estudio 2026
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
                Cada escuela luce su color institucional oficial, fotografía referencial, malla de 10 ciclos y tríptico descargable.
              </p>
              {adminAutenticado && (
                <button
                  type="button"
                  onClick={() => {
                    setTabAdmin("carreras_cms");
                    navegar("/admin");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-600 text-amber-800 dark:text-amber-300 hover:text-white border border-amber-300 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Carreras en CMS</span>
                </button>
              )}
            </div>
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
                  className={`group rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 ${temaCar.cardHoverBorder} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer gpu-card`}
                >
                  <div>
                    {/* Cabecera Fotográfica con Color Oficial de cada Escuela (TEMA_CARRERA) */}
                    <div
                      className={`relative h-52 w-full overflow-hidden border-b-2 ${temaCar.borderAccent} bg-slate-950`}
                    >
                      <div className={`absolute top-0 inset-x-0 h-1.5 ${temaCar.headerBg} z-20`} />
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
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/30" />

                      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between gap-2 z-10">
                        <span
                          className={`px-3 py-1 rounded-md ${temaCar.headerBg} text-white font-mono text-xs font-bold shadow-md border border-white/25`}
                        >
                          {car.codigo_escuela}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-md bg-black/55 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-300" />
                            {car.duracion_bento || "5 años • 10 ciclos"}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-white font-mono text-[11px] font-extrabold border border-white/25">
                            {creditosMostrar} cr.
                          </span>
                        </div>
                      </div>

                      <div className="absolute bottom-3.5 left-5 right-5 z-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">
                          {car.subtitulo_bento || metaDefault.subtitulo}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-amber-200 transition-colors">
                          Escuela Profesional de {car.nombre}
                        </h3>
                      </div>
                    </div>

                    {/* Contenido Académico Estructurado con el Tema de cada Escuela */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {car.perfil_egreso || car.descripcion}
                      </p>

                      {/* Líneas de Especialización con el Badge de la Escuela */}
                      <div className="flex flex-wrap gap-1.5">
                        {pilaresMostrar.map((pilar) => (
                          <span
                            key={pilar}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${temaCar.badgeSoft}`}
                          >
                            ✦ {pilar}
                          </span>
                        ))}
                      </div>

                      {/* Tabla compacta de Grado, Título y Plan */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-start gap-2">
                          <GraduationCap className={`w-4 h-4 ${temaCar.textAccent} shrink-0 mt-0.5`} />
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
                          <Layers className={`w-4 h-4 ${temaCar.textAccent} shrink-0 mt-0.5`} />
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
                      className="px-4 py-2 rounded-xl bg-[#002855] hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Ver Malla Curricular</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDescargarTripticoPorCarrera(car, e)}
                      className="group/btn px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-red-700 text-slate-700 dark:text-slate-200 hover:text-white border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-red-700 dark:text-red-400 group-hover/btn:text-white" />
                      <span>Tríptico PDF</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. BOLETÍN Y GACETA UNIVERSITARIA ASIMÉTRICA (1 NOTICIA PRINCIPAL + 2 LATERALES ELEGIBLES) */}
        <section className="space-y-6 reveal-on-scroll">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-red-700 shadow-xs">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-700 dark:text-red-400">
                Boletín Académico e Institucional
              </span>
              <h2 className="text-2xl font-extrabold text-[#002855] dark:text-white flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-red-700 dark:text-red-400" />
                Actualidad, Convocatorias y Resoluciones
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => navegar("/noticias")}
                className="px-4 py-2 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Ver Hemeroteca Oficial ({noticias.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              {adminAutenticado && (
                <button
                  type="button"
                  onClick={() => {
                    setTabAdmin("noticias");
                    navegar("/admin");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-600 text-amber-800 dark:text-amber-300 hover:text-white border border-amber-300 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Elegir / Gestionar Noticias</span>
                </button>
              )}
            </div>
          </div>

          {(() => {
            const limpiarTextoNoticia = (not: (typeof noticias)[number]) =>
              (not.resumen && not.resumen.trim()) ||
              not.contenido
                .replace(/^[#>*-\d.]+\s*/gm, "")
                .replace(/\*\*/g, "")
                .replace(/\n+/g, " ")
                .trim();

            const poolPrioridad = [
              ...noticias.filter((n) => n.destacado),
              ...noticias.filter((n) => !n.destacado),
            ];

            const noticiaPrincipal =
              (heroConfigAcademico?.noticia_principal_id
                ? noticias.find((n) => n.id === heroConfigAcademico.noticia_principal_id)
                : undefined) || poolPrioridad[0];

            const usadosIds = new Set<string>(noticiaPrincipal ? [noticiaPrincipal.id] : []);

            const noticiaSecundaria1 =
              (heroConfigAcademico?.noticia_secundaria_1_id
                ? noticias.find(
                    (n) =>
                      n.id === heroConfigAcademico.noticia_secundaria_1_id && !usadosIds.has(n.id)
                  )
                : undefined) || poolPrioridad.find((n) => !usadosIds.has(n.id));

            if (noticiaSecundaria1) usadosIds.add(noticiaSecundaria1.id);

            const noticiaSecundaria2 =
              (heroConfigAcademico?.noticia_secundaria_2_id
                ? noticias.find(
                    (n) =>
                      n.id === heroConfigAcademico.noticia_secundaria_2_id && !usadosIds.has(n.id)
                  )
                : undefined) || poolPrioridad.find((n) => !usadosIds.has(n.id));

            const noticiasSecundarias = [noticiaSecundaria1, noticiaSecundaria2].filter(
              (item): item is (typeof noticias)[number] => Boolean(item)
            );

            if (!noticiaPrincipal) return null;

            const resumenPrincipal = limpiarTextoNoticia(noticiaPrincipal);

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* COLUMNA IZQUIERDA (OCUPA EL ESPACIO DE 2 NOTICIAS): NOTICIA PRINCIPAL HEROICA */}
                <article
                  onClick={() => abrirNoticiaDetalle(noticiaPrincipal.id)}
                  className="lg:col-span-7 group rounded-2xl border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:!border-[#002855] dark:hover:!border-blue-400 hover:!shadow-[0_18px_36px_-10px_rgba(37,99,235,0.28)] shadow-sm overflow-hidden flex flex-col justify-between cursor-pointer transition-all gpu-card"
                >
                  <div>
                    <div className="relative h-64 sm:h-80 lg:h-[320px] bg-slate-950 overflow-hidden">
                      <OptimizedImage
                        src={noticiaPrincipal.imagen_url}
                        alt={noticiaPrincipal.titulo}
                        priority={true}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/25 pointer-events-none" />

                      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#8B1515] to-red-700 text-white shadow-md border border-amber-400/40 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            Noticia Principal FCM
                          </span>
                          <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#002855]/90 backdrop-blur-md text-white shadow-md border border-white/20">
                            {noticiaPrincipal.categoria}
                          </span>
                        </div>
                        {noticiaPrincipal.destacado && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500 text-slate-950 shadow flex items-center gap-1">
                            <Star className="w-3 h-3 fill-slate-950" /> Destacado
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-4 left-5 right-5 z-10">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-amber-300 font-bold mb-1">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatearFechaEspanol(noticiaPrincipal.fecha_publicacion)}
                          </span>
                          {noticiaPrincipal.modalidad && (
                            <span className="px-2 py-0.5 rounded bg-white/15 backdrop-blur-md text-white text-[10px] border border-white/20">
                              {noticiaPrincipal.modalidad}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-amber-200 transition-colors leading-snug drop-shadow-md line-clamp-2">
                          {noticiaPrincipal.titulo}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        {resumenPrincipal}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-[#002855] dark:text-blue-300 group-hover:text-red-700 dark:group-hover:text-amber-400">
                    <span>Leer nota académica principal completa</span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#002855] group-hover:bg-red-700 text-white text-[11px] transition-colors">
                      <span>Abrir Comunicado</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </article>

                {/* COLUMNA DERECHA: 2 NOTICIAS SECUNDARIAS ELEGIBLES */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-5">
                  {noticiasSecundarias.map((not, idx) => {
                    const resumenSec = limpiarTextoNoticia(not);
                    return (
                      <article
                        key={not.id}
                        onClick={() => abrirNoticiaDetalle(not.id)}
                        className="group flex-1 rounded-2xl border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:!border-[#002855] dark:hover:!border-blue-400 hover:!shadow-[0_16px_32px_-10px_rgba(37,99,235,0.25)] shadow-xs overflow-hidden flex flex-col sm:flex-row cursor-pointer transition-all gpu-card"
                      >
                        <div className="relative w-full sm:w-44 md:w-48 h-44 sm:h-auto shrink-0 bg-slate-950 overflow-hidden">
                          <OptimizedImage
                            src={not.imagen_url}
                            alt={not.titulo}
                            priority={idx === 0}
                            sizes="(max-width: 640px) 100vw, 220px"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#002855]/95 text-white shadow">
                              {not.categoria}
                            </span>
                            {not.destacado && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-red-700 text-white shadow flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-white" />
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between min-w-0">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-red-700 dark:text-red-400 shrink-0" />
                              <span className="truncate">
                                {formatearFechaEspanol(not.fecha_publicacion)}
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-extrabold text-[#002855] dark:text-white group-hover:text-red-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                              {not.titulo}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {resumenSec}
                            </p>
                          </div>

                          <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#002855] dark:text-blue-300 group-hover:text-red-700 dark:group-hover:text-amber-400">
                            <span>Leer nota académica</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </section>

        {/* 4. SECCIÓN INSTITUCIONAL: ORGULLO SAN MARQUINO (DISEÑO IDÉNTICO A LA VERSIÓN PRINCIPAL) */}
        <section id="orgullo-sanmarquino" className="space-y-6 pt-4 reveal-on-scroll">
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
                investigadores que llevan el nombre de la Facultad de Ciencias Matemáticas y la
                Decana de América a los escenarios científicos más prestigiosos del mundo.
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
            {orgulloItems.slice(0, 3).map((item, idx) => {
              const temaOrgullo =
                item.carrera_id !== "fcm" ? TEMA_CARRERA[item.carrera_id] : undefined;
              const hoverBorderClass = temaOrgullo
                ? temaOrgullo.cardHoverBorder
                : "hover:!border-amber-500 dark:hover:!border-amber-400 hover:!shadow-[0_18px_36px_-10px_rgba(245,158,11,0.35)]";
              return (
                <div
                  key={item.id}
                  onClick={() => setModalDetalleOrgullo(item)}
                  className={`stagger-fade-up stagger-delay-${(idx % 3) + 1} gpu-card group relative rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 ${hoverBorderClass} shadow-md flex flex-col justify-between overflow-hidden cursor-pointer`}
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
                      <span
                        className={`text-xs font-bold ${
                          temaOrgullo
                            ? `${temaOrgullo.textAccent} ${temaOrgullo.groupHoverText}`
                            : "text-red-700 dark:text-amber-400"
                        } flex items-center gap-1 group-hover:translate-x-0.5 transition-transform`}
                      >
                        <span>Ver Detalle</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              onClick={() => navegar("/orgullo")}
              className="group relative rounded-2xl bg-gradient-to-br from-[#002855] via-[#001f42] to-[#4d0713] text-white p-6 sm:p-7 border-2 border-blue-800/80 hover:!border-amber-400 shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden min-h-[380px]"
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
                    Conoce todas las distinciones, pasantías en neurociencia, premios en hackathones
                    y congresos mundiales de nuestra facultad.
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

        {/* 5. CLAUSTRO DOCENTE E INVESTIGADORES CON COLORES OFICIALES POR ESCUELA */}
        <section id="plana-docente" className="space-y-6 reveal-on-scroll">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#002855] dark:border-l-blue-500 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-700 dark:text-red-400">
                Directorio Oficial de Cátedra e Investigación
              </span>
              <h2 className="text-2xl font-extrabold text-[#002855] dark:text-white">
                Plana Docente por Escuela Profesional
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
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
                  className="absolute right-1.5 top-1.5 px-3 py-1 rounded-lg bg-[#002855] hover:bg-blue-900 text-white text-[11px] font-bold cursor-pointer"
                >
                  Ver Todos
                </button>
              </div>
              {adminAutenticado && (
                <button
                  type="button"
                  onClick={() => {
                    setTabAdmin("docentes_cms");
                    navegar("/admin");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-600 text-amber-800 dark:text-amber-300 hover:text-white border border-amber-300 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Docentes CMS</span>
                </button>
              )}
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
                  className={`group rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 ${temaCar.cardHoverBorder} shadow-xs overflow-hidden cursor-pointer flex flex-col justify-between transition-all gpu-card`}
                >
                  <div>
                    <div className={`h-2 w-full ${temaCar.headerBg}`} />
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-white ${temaCar.headerBg}`}
                        >
                          {car.codigo_escuela}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${temaCar.badgeSoft}`}
                        >
                          {docentesEscuela.length} Catedráticos
                        </span>
                      </div>

                      <div>
                        <h3
                          className={`text-base font-extrabold text-[#002855] dark:text-white ${temaCar.groupHoverText} transition-colors`}
                        >
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
                  </div>

                  <div
                    className={`px-5 py-3 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#002855] dark:text-blue-300 ${temaCar.groupHoverText} transition-colors`}
                  >
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
