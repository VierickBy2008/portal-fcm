"use client";

import React from "react";
import type {
  CalendarioSemestralConfig,
  Carrera,
  CarreraId,
  CursoMalla,
  DisenoPortadaId,
  Docente,
  MaterialRepositorio,
  Noticia,
  OrgulloItem,
  VistaPortal,
} from "@/app/types/portal";
import type { AdminTabId } from "@/app/components/admin/AdminNavbar";
import { HomeViewBento } from "@/app/components/views/HomeViewBento";
import { HomeViewHarvard } from "@/app/components/views/HomeViewHarvard";

export interface HomeViewProps {
  cargandoConfig: boolean;
  disenoPortadaActivo?: DisenoPortadaId;
  slideActivoHero: number;
  totalSlidesHero: number;
  setPausarSliderHero: (v: boolean) => void;
  anteriorSlideHero: () => void;
  siguienteSlideHero: () => void;
  cambiarSlideHero: (idx: number) => void;
  heroBgUrl: string;
  heroDefaultBgUrl: string;
  heroBlur: number;
  heroOverlayColor: string;
  heroOverlayOpacity: number;
  adminAutenticado: boolean;
  setModalHeroFondoAbierto: (v: boolean) => void;
  busquedaGlobal: string;
  setBusquedaGlobal: (v: string) => void;
  resultadosBusquedaHero: {
    cursos: CursoMalla[];
    materiales: MaterialRepositorio[];
  };
  carreras: Carrera[];
  malla: CursoMalla[];
  noticias: Noticia[];
  noticiasDestacadas: Noticia[];
  orgulloItems: OrgulloItem[];
  docentes: Docente[];
  busquedaDocentes: string;
  setBusquedaDocentes: (v: string) => void;
  calendarioConfig: CalendarioSemestralConfig;
  navegar: (
    ruta: VistaPortal,
    opciones?: {
      carreraId?: CarreraId;
      noticiaId?: string;
      docenteCarrera?: "TODAS" | CarreraId;
    }
  ) => void;
  navegarACarrera: (id: CarreraId) => void;
  handleDescargarTripticoPorCarrera: (car: Carrera, e: React.MouseEvent) => void;
  abrirNoticiaDetalle: (idNoticia: string) => void;
  setModalDetalleOrgullo: (item: OrgulloItem | null) => void;
  setTabAdmin: (tab: AdminTabId) => void;
}

export function HomeView(props: HomeViewProps) {
  const layoutKey = props.disenoPortadaActivo || "bento_moderno";
  return (
    <div key={layoutKey} className="layout-switch-gpu flex-1 flex flex-col w-full">
      {layoutKey === "harvard_editorial" ? (
        <HomeViewHarvard {...props} />
      ) : (
        <HomeViewBento {...props} />
      )}
    </div>
  );
}
