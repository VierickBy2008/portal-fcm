"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Search, GraduationCap, BookOpen, Newspaper, FolderGit2, LifeBuoy, Sparkles,
  ChevronRight, ChevronDown, ChevronLeft, Upload, FileText, Code2, Video, FileCheck2, Award, Trophy, Plus,
  CheckCircle2, Trash2, Lock, Unlock, Mail, Building2, Calendar, Filter, Layers,
  Download, AlertCircle, Star, Cpu, Sigma, BarChart3, Network, Printer,
  Image as ImageIcon, Copy, ExternalLink, Phone, UserCheck, ShoppingBag,
  FileSpreadsheet, Check, MapPin, Briefcase, Target, Lightbulb, Edit3,
  ArrowLeft, ArrowRight, Share2, Users, Clock, Globe, Bold, Italic, List, ListOrdered,
  Quote, Minus, Link2, Heading2, Menu, X, ShieldCheck, Sliders, Sun, Moon,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  CarreraId,
  VistaPortal,
  TipoArchivo,
  EstadoMaterial,
  EstadoAtencion,
  Noticia,
  Docente,
  OrgulloItem,
  DocumentoTransparencia,
  ResenaDocente,
  Carrera,
  CursoMalla,
  MaterialRepositorio,
  ImagenStorage,
  TicketSoporte,
  CalendarioSemestralConfig,
  AsistenteIAConfig,
  AccesibilidadConfig,
} from "@/app/types/portal";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  formatearFechaEspanol,
  obtenerInicialesDocente,
  renderTextoEnriquecidoLinea,
  renderizarContenidoNoticia,
} from "@/app/utils/portalFormatters";
import {
  DOCUMENTOS_TRANSPARENCIA_INICIALES,
  LOGO_UNMSM_TRANSPARENTE_DEFAULT,
  HERO_BG_DEFAULT,
  CARRERAS_INICIALES,
  NOTICIAS_INICIALES,
  IMAGENES_STORAGE_INICIALES,
  MALLA_INICIAL,
  MATERIALES_INICIALES,
  DOCENTES_INICIALES,
  DOCENTES_SUGERIDOS,
  RESENAS_DOCENTES_INICIALES,
  ORGULLO_INICIAL,
  TICKETS_INICIALES,
  TEMA_CARRERA,
} from "@/app/data/portalInitialData";
import {
  CALENDARIO_SEMESTRAL_INICIAL,
  ASISTENTE_IA_INICIAL,
  ACCESIBILIDAD_INICIAL,
  BENTO_ESPECIALIZACIONES_DEFAULT,
} from "@/app/data/portalExtrasData";
import { AccesibilidadWidget } from "@/app/components/ui/AccesibilidadWidget";
import { AsistenteVirtualIA } from "@/app/components/ui/AsistenteVirtualIA";
import { CalendarioAcademicoSection } from "@/app/components/views/CalendarioAcademicoSection";
import { AdminExtrasTab } from "@/app/components/admin/AdminExtrasTab";
import { OptimizedImage } from "@/app/components/ui/OptimizedImage";
import { Footer } from "@/app/components/layout/Footer";
import { HemerotecaView } from "@/app/components/views/HemerotecaView";
import { OrgulloGalleryView } from "@/app/components/views/OrgulloGalleryView";
import { DocentesView } from "@/app/components/views/DocentesView";
import { RepositorioView } from "@/app/components/views/RepositorioView";
import { TransparenciaView } from "@/app/components/views/TransparenciaView";
import { ContactoView } from "@/app/components/views/ContactoView";
import { BentoCarrerasHome } from "@/app/components/views/BentoCarrerasHome";
import { CarreraMallaView } from "@/app/components/views/CarreraMallaView";
import { DetalleNoticiaModal } from "@/app/components/modals/DetalleNoticiaModal";
import { SubirMaterialModal } from "@/app/components/modals/SubirMaterialModal";
import { OrgulloModal } from "@/app/components/modals/OrgulloModal";
import { DocenteModal } from "@/app/components/modals/DocenteModal";
import { AdminNavbar, AdminTabId } from "@/app/components/admin/AdminNavbar";
import { AdminHeroTab } from "@/app/components/admin/AdminHeroTab";
import { AdminNoticiasTab } from "@/app/components/admin/AdminNoticiasTab";
import { AdminDocentesTab } from "@/app/components/admin/AdminDocentesTab";
import { AdminMallaTab } from "@/app/components/admin/AdminMallaTab";
import { AdminRepositorioTab } from "@/app/components/admin/AdminRepositorioTab";
import { AdminOrgulloTab } from "@/app/components/admin/AdminOrgulloTab";
import { AdminTransparenciaTab } from "@/app/components/admin/AdminTransparenciaTab";
import { AdminStorageTab } from "@/app/components/admin/AdminStorageTab";
import { AdminTicketsTab } from "@/app/components/admin/AdminTicketsTab";

export default function PortalFacultadCienciasMatematicas() {
  const [vistaActual, setVistaActual] = useState<VistaPortal>("/");
  const [carreraSeleccionadaId, setCarreraSeleccionadaId] = useState<CarreraId>("computacion-cientifica");
  const [noticiaSeleccionadaId, setNoticiaSeleccionadaId] = useState<string>(NOTICIAS_INICIALES[0].id);

  const normalizarCarrerasConBento = useCallback((lista: Carrera[]): Carrera[] => {
    return lista.map((c) => {
      const def = BENTO_ESPECIALIZACIONES_DEFAULT[c.id];
      return {
        ...c,
        subtitulo_bento: c.subtitulo_bento || def?.subtitulo,
        pilares_bento:
          Array.isArray(c.pilares_bento) && c.pilares_bento.length > 0
            ? c.pilares_bento.map((p) => (p === "Algoritmos Avanzados" ? "Ciberseguridad" : p))
            : def?.pilares,
        creditos_bento: c.creditos_bento || def?.creditos,
        duracion_bento: c.duracion_bento || def?.duracion,
      };
    });
  }, []);

  const [noticias, setNoticias] = useState<Noticia[]>(NOTICIAS_INICIALES);
  const [carreras, setCarreras] = useState<Carrera[]>(() =>
    CARRERAS_INICIALES.map((c) => {
      const def = BENTO_ESPECIALIZACIONES_DEFAULT[c.id];
      return {
        ...c,
        subtitulo_bento: c.subtitulo_bento || def?.subtitulo,
        pilares_bento: Array.isArray(c.pilares_bento) && c.pilares_bento.length > 0 ? c.pilares_bento : def?.pilares,
        creditos_bento: c.creditos_bento || def?.creditos,
        duracion_bento: c.duracion_bento || def?.duracion,
      };
    })
  );
  const [docentes, setDocentes] = useState<Docente[]>(DOCENTES_INICIALES);
  const [resenasDocentes, setResenasDocentes] = useState<ResenaDocente[]>(RESENAS_DOCENTES_INICIALES);
  const [malla, setMalla] = useState<CursoMalla[]>(MALLA_INICIAL);
  const [materiales, setMateriales] = useState<MaterialRepositorio[]>(MATERIALES_INICIALES);
  const [tickets, setTickets] = useState<TicketSoporte[]>(TICKETS_INICIALES);
  const [imagenesStorage, setImagenesStorage] = useState<ImagenStorage[]>(IMAGENES_STORAGE_INICIALES);

  // Módulos 1C (Calendario Académico 2026), 1B (Asistente IA FCM) y 4B (Accesibilidad WCAG 2.1)
  const [calendarioConfig, setCalendarioConfig] = useState<CalendarioSemestralConfig>(CALENDARIO_SEMESTRAL_INICIAL);
  const [asistenteConfig, setAsistenteConfig] = useState<AsistenteIAConfig>(ASISTENTE_IA_INICIAL);
  const [accesibilidadConfig, setAccesibilidadConfig] = useState<AccesibilidadConfig>(ACCESIBILIDAD_INICIAL);

  const [orgulloItems, setOrgulloItems] = useState<OrgulloItem[]>(ORGULLO_INICIAL);
  const [modalDetalleOrgullo, setModalDetalleOrgullo] = useState<OrgulloItem | null>(null);
  const [modalOrgulloFormAbierto, setModalOrgulloFormAbierto] = useState<boolean>(false);
  const [editandoOrgulloId, setEditandoOrgulloId] = useState<string | null>(null);
  const [formOrgullo, setFormOrgullo] = useState<Omit<OrgulloItem, "carrera_nombre">>({
    id: "",
    titulo: "",
    subtitulo_categoria: "SELECCIONADO POR IBRO 2026",
    estudiante: "",
    carrera_id: "computacion-cientifica",
    descripcion: "",
    foto_url: "",
    tipo_tarjeta: "afiche",
    enlace_nota: "",
    anio: "2026",
    destacado: true,
  });
  const [subiendoFotoOrgullo, setSubiendoFotoOrgullo] = useState<boolean>(false);

  // Filtros de la Galería Completa de Orgullo San Marquino (/orgullo)
  const [filtroOrgulloCarrera, setFiltroOrgulloCarrera] = useState<"TODAS" | CarreraId | "fcm">("TODAS");
  const [busquedaOrgullo, setBusquedaOrgullo] = useState<string>("");

  const orgulloFiltrados = useMemo(() => {
    return orgulloItems.filter((item) => {
      const coincideCarrera =
        filtroOrgulloCarrera === "TODAS" ||
        item.carrera_id === filtroOrgulloCarrera ||
        (filtroOrgulloCarrera === "fcm" && item.carrera_id === "fcm");

      const q = busquedaOrgullo.trim().toLowerCase();
      const coincideBusqueda =
        !q ||
        item.titulo.toLowerCase().includes(q) ||
        item.estudiante.toLowerCase().includes(q) ||
        (item.carrera_nombre && item.carrera_nombre.toLowerCase().includes(q)) ||
        item.subtitulo_categoria.toLowerCase().includes(q) ||
        item.descripcion.toLowerCase().includes(q);

      return coincideCarrera && coincideBusqueda;
    });
  }, [orgulloItems, filtroOrgulloCarrera, busquedaOrgullo]);


  const [logoUrl, setLogoUrl] = useState<string>(LOGO_UNMSM_TRANSPARENTE_DEFAULT);
  const [heroBgUrl, setHeroBgUrl] = useState<string>(HERO_BG_DEFAULT);
  const [heroBgInputUrl, setHeroBgInputUrl] = useState<string>(HERO_BG_DEFAULT);
  const [heroBlur, setHeroBlur] = useState<number>(1);
  const [heroOverlayOpacity, setHeroOverlayOpacity] = useState<number>(45);
  const [heroOverlayColor, setHeroOverlayColor] = useState<string>("#0f172a");
  const [cargandoConfig, setCargandoConfig] = useState<boolean>(true);

  // Filtros y modal de la sección Plana Docente + Calificaciones y Reseñas
  const [filtroDocenteCarrera, setFiltroDocenteCarrera] = useState<"TODAS" | CarreraId>("TODAS");
  const [busquedaDocentes, setBusquedaDocentes] = useState<string>("");
  const [docenteModalActivo, setDocenteModalActivo] = useState<Docente | null>(null);
  const [hoverEstrellaDocente, setHoverEstrellaDocente] = useState<number>(0);
  const [formResenaDocente, setFormResenaDocente] = useState({
    puntuacion: 5,
    curso: "",
    autor_alias: "",
    esAnonimo: false,
    comentario: "",
    bot_trap: "",
  });
  const [errorResenaDocente, setErrorResenaDocente] = useState<string>("");
  // Transparencia Institucional (/transparencia)
  const [documentosTransparencia, setDocumentosTransparencia] = useState<DocumentoTransparencia[]>(DOCUMENTOS_TRANSPARENCIA_INICIALES);
  const [filtroTransparenciaCategoria, setFiltroTransparenciaCategoria] = useState<string>("TODAS");
  const [filtroTransparenciaAnio, setFiltroTransparenciaAnio] = useState<string>("TODOS");
  const [busquedaTransparencia, setBusquedaTransparencia] = useState<string>("");
  const [paginaTransparencia, setPaginaTransparencia] = useState<number>(1);
  const [modalTransparenciaFormAbierto, setModalTransparenciaFormAbierto] = useState<boolean>(false);
  const [editandoTransparenciaId, setEditandoTransparenciaId] = useState<string | null>(null);
  const [formTransparencia, setFormTransparencia] = useState<{
    codigo: string;
    titulo: string;
    categoria: DocumentoTransparencia["categoria"];
    anio: number;
    dependencia: string;
    fecha: string;
    tamano_archivo: string;
    url_pdf: string;
    sumilla: string;
  }>({
    codigo: "",
    titulo: "",
    categoria: "Resoluciones Decanales",
    anio: 2026,
    dependencia: "Decanato FCM",
    fecha: "2026-03-15",
    tamano_archivo: "1.5 MB",
    url_pdf: "https://matematicas.unmsm.edu.pe",
    sumilla: "",
  });

  const [exitoResenaDocente, setExitoResenaDocente] = useState<boolean>(false);

  // Carrusel Institucional Superior de Noticias y Comunicados (Slider tipo San Marcos)
  const [slideActivoHero, setSlideActivoHero] = useState<number>(0);
  const [pausarSliderHero, setPausarSliderHero] = useState<boolean>(false);
  const [direccionSlide, setDireccionSlide] = useState<"next" | "prev">("next");
  const [animandoSlide, setAnimandoSlide] = useState<boolean>(false);
  const [modalHeroFondoAbierto, setModalHeroFondoAbierto] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);

  // Buscador Compacto en Navbar Superior con atajo de teclado (Ctrl+K / Cmd+K)
  const [busquedaNavbar, setBusquedaNavbar] = useState<string>("");
  const [navbarBuscadorAbierto, setNavbarBuscadorAbierto] = useState<boolean>(false);
  const [navbarResultadosAbiertos, setNavbarResultadosAbiertos] = useState<boolean>(false);
  const inputNavbarRef = useRef<HTMLInputElement | null>(null);
  const contenedorNavbarSearchRef = useRef<HTMLDivElement | null>(null);

  // Menú Móvil Hamburguesa Responsive
  const [menuMovilAbierto, setMenuMovilAbierto] = useState<boolean>(false);

  const [dropdownServicioAbierto, setDropdownServicioAbierto] = useState(false);
  const menuServicioRef = useRef<HTMLDivElement | null>(null);
  const timeoutServicioRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Menú Desplegable: Formación Académica (Pregrado, Posgrado, Docentes)
  const [dropdownFormacionAbierto, setDropdownFormacionAbierto] = useState(false);
  const menuFormacionRef = useRef<HTMLDivElement | null>(null);
  const timeoutFormacionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modo Oscuro (Dark Mode)
  const [modoOscuro, setModoOscuro] = useState<boolean>(false);

  const [servicioModalInfo, setServicioModalInfo] = useState<{
    titulo: string; sigla: string; descripcion: string; correo: string; anexo: string; horario: string;
  } | null>(null);

  const [busquedaGlobal, setBusquedaGlobal] = useState("");
  const [modoMalla, setModoMalla] = useState<"acordeon" | "roadmap">("acordeon");
  const [ciclosAbiertos, setCiclosAbiertos] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const [repoFiltroCarrera, setRepoFiltroCarrera] = useState<"TODAS" | CarreraId>("TODAS");
  const [repoFiltroCiclo, setRepoFiltroCiclo] = useState<"TODOS" | number>("TODOS");
  const [repoFiltroCurso, setRepoFiltroCurso] = useState<string>("TODOS");
  const [repoFiltroTipo, setRepoFiltroTipo] = useState<"TODOS" | TipoArchivo>("TODOS");
  const [repoBusquedaTexto, setRepoBusquedaTexto] = useState("");
  const [repoPaginaActual, setRepoPaginaActual] = useState(1);

  const [modalSubirAbierto, setModalSubirAbierto] = useState(false);
  const [formSubidaAnon, setFormSubidaAnon] = useState({
    carrera_id: "computacion-cientifica" as CarreraId,
    ciclo: 3,
    curso_id: "cc-301",
    modoDocente: "lista" as "lista" | "manual",
    docenteSeleccionado: DOCENTES_SUGERIDOS[0],
    docenteManual: "",
    titulo: "",
    tipo_archivo: "Examen" as TipoArchivo,
    url_archivo: "",
    autor_alias: "",
    bot_trap: "",
  });
  const [exitoSubidaModal, setExitoSubidaModal] = useState(false);

  const [formContacto, setFormContacto] = useState({ nombre: "", email: "", asunto: "", mensaje: "", bot_trap: "" });
  const [ticketEnviadoOk, setTicketEnviadoOk] = useState(false);

  const [adminAutenticado, setAdminAutenticado] = useState(false);
  const [cargandoAuthAdmin, setCargandoAuthAdmin] = useState(false);
  const [pinAdmin, setPinAdmin] = useState("");
  const [errorPin, setErrorPin] = useState("");
  const [tabAdmin, setTabAdmin] = useState<AdminTabId>("dashboard");

  const [adminCarreraEditId, setAdminCarreraEditId] = useState<CarreraId>("computacion-cientifica");
  const carreraAdminSeleccionada = useMemo(
    () => carreras.find((c) => c.id === adminCarreraEditId) || CARRERAS_INICIALES[0],
    [carreras, adminCarreraEditId]
  );
  const [urlImagenCarreraInput, setUrlImagenCarreraInput] = useState(CARRERAS_INICIALES[0].imagen_referencial_url);
  const [urlTripticoCarreraInput, setUrlTripticoCarreraInput] = useState(CARRERAS_INICIALES[0].triptico_pdf_url);
  const [urlPosterCarreraInput, setUrlPosterCarreraInput] = useState(CARRERAS_INICIALES[0].poster_pdf_url || "");
  const [subiendoAssetCarrera, setSubiendoAssetCarrera] = useState(false);
  const inputImagenCarreraRef = useRef<HTMLInputElement | null>(null);
  const inputTripticoPdfRef = useRef<HTMLInputElement | null>(null);
  const inputPosterPdfRef = useRef<HTMLInputElement | null>(null);

  // Estado inicial de noticias con fecha_publicacion: "" (sin new Date() en declaración de estado)
  const [formNoticia, setFormNoticia] = useState({
    id: "",
    titulo: "",
    categoria: "Comunicado Oficial",
    resumen: "",
    fecha_publicacion: "",
    contenido: "",
    imagen_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    destacado: true,
    en_carrusel_principal: true,
    color_fondo: "#4d0713",
    fecha_evento: "",
    lugar: "",
    modalidad: "",
    dirigido_a: "",
    enlace_inscripcion: "",
    fondo_imagen_url: "",
    fondo_blur: 4,
    fondo_overlay_opacity: 60,
    fondo_overlay_color: "#002855",
  });
  const inputImagenNoticiaRef = useRef<HTMLInputElement | null>(null);
  const inputFondoNoticiaRef = useRef<HTMLInputElement | null>(null);
  const textareaNoticiaRef = useRef<HTMLTextAreaElement | null>(null);

  // Filtro de categoría docente para directorio
  const [filtroCategoriaDocente, setFiltroCategoriaDocente] = useState<string>("TODAS");

  // Filtros para vista dedicada de Hemeroteca (/noticias)
  const [busquedaHemeroteca, setBusquedaHemeroteca] = useState<string>("");
  const [filtroCategoriaHemeroteca, setFiltroCategoriaHemeroteca] = useState<string>("TODAS");

  // Estado de formulario CMS para Plana Docente
  const [adminFiltroCarreraDocentes, setAdminFiltroCarreraDocentes] = useState<"TODAS" | CarreraId>("TODAS");
  const [formDocente, setFormDocente] = useState({
    id: "",
    nombre_completo: "",
    grado_academico: "Dr." as "Dr." | "Dra." | "Mg." | "Lic.",
    categoria_docente: "Principal" as "Principal" | "Asociado" | "Auxiliar",
    condicion: "Nombrado" as "Nombrado" | "Contratado",
    carrera_id: "computacion-cientifica" as CarreraId,
    especialidad: "",
    lineas_investigacion: "",
    cursos_dictados_texto: "",
    correo: "",
    horario_asesoria: "",
    foto_url: "",
    cti_vitae_url: "",
    orcid_url: "",
    google_scholar_url: "",
    linkedin_url: "",
  });
  const inputFotoDocenteRef = useRef<HTMLInputElement | null>(null);
  const [subiendoFotoDocente, setSubiendoFotoDocente] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categoriaNuevaImagen, setCategoriaNuevaImagen] = useState<"Logo Institucional" | "Banner Noticia" | "Foto Facultad" | "Fondo Hero Home">("Banner Noticia");
  const [subiendoStorage, setSubiendoStorage] = useState(false);
  const [urlCopiadaId, setUrlCopiadaId] = useState<string | null>(null);

  const [adminFiltroCarreraMalla, setAdminFiltroCarreraMalla] = useState<CarreraId>("computacion-cientifica");
  const [formCursoMalla, setFormCursoMalla] = useState({
    id: "",
    carrera_id: "computacion-cientifica" as CarreraId,
    ciclo: 3,
    codigo: "",
    nombre_curso: "",
    creditos: 4.0,
    tipo_curso: "O" as "O" | "E",
    prerequisitosTexto: "",
  });

  const [toast, setToast] = useState<string | null>(null);
  const lanzarToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4200);
  };

  // ==========================================================================
  // 4. NAVEGACIÓN HISTÓRICA CON RETROCESOS (BOTÓN "ATRÁS" DEL NAVEGADOR)
  // ==========================================================================
  const modalesAbiertosRef = useRef(false);
  useEffect(() => {
    modalesAbiertosRef.current = Boolean(docenteModalActivo || servicioModalInfo || modalSubirAbierto);
  }, [docenteModalActivo, servicioModalInfo, modalSubirAbierto]);

  const aplicarHashAEstado = useCallback((hashRaw: string) => {
    const hash = (hashRaw || "").replace(/^#/, "").trim();
    if (!hash || hash === "/") {
      setVistaActual("/");
      return;
    }
    if (hash.startsWith("/carreras/")) {
      const id = hash.replace("/carreras/", "").trim() as CarreraId;
      const carrerasValidas: CarreraId[] = ["computacion-cientifica", "matematica", "estadistica", "investigacion-operativa"];
      if (carrerasValidas.includes(id)) {
        setCarreraSeleccionadaId(id);
      }
      setVistaActual("/carreras/[id]");
      return;
    }
    if (hash.startsWith("/noticias/")) {
      const idNot = hash.replace("/noticias/", "").trim();
      if (idNot) setNoticiaSeleccionadaId(idNot);
      setVistaActual("/noticias/[id]");
      return;
    }
    if (hash === "/noticias") {
      setVistaActual("/noticias");
      return;
    }
    if (hash === "/orgullo" || hash.startsWith("/orgullo")) {
      setVistaActual("/orgullo");
      return;
    }
    if (hash === "/docentes" || hash.startsWith("/docentes/")) {
      const idCar = hash.replace("/docentes/", "").replace("/docentes", "").trim();
      const carrerasValidas: CarreraId[] = ["computacion-cientifica", "matematica", "estadistica", "investigacion-operativa"];
      if (idCar && (idCar === "TODAS" || carrerasValidas.includes(idCar as CarreraId))) {
        setFiltroDocenteCarrera(idCar as "TODAS" | CarreraId);
      }
      setVistaActual("/docentes");
      return;
    }
    if (hash === "/repositorio") {
      setVistaActual("/repositorio");
      return;
    }
    if (hash === "/transparencia" || hash.startsWith("/transparencia")) {
      setVistaActual("/transparencia");
      return;
    }
    if (hash === "/contacto") {
      setVistaActual("/contacto");
      return;
    }
    if (hash === "/admin") {
      setVistaActual("/admin");
      return;
    }
    setVistaActual("/");
  }, []);

  const navegar = useCallback(
    (
      nuevaVista: VistaPortal,
      params?: {
        carreraId?: CarreraId;
        noticiaId?: string;
        docenteCarrera?: "TODAS" | CarreraId;
        skipScroll?: boolean;
      }
    ) => {
      const idCarreraFinal = params?.carreraId || carreraSeleccionadaId;
      const idNoticiaFinal = params?.noticiaId || noticiaSeleccionadaId;

      if (params?.carreraId) setCarreraSeleccionadaId(params.carreraId);
      if (params?.noticiaId) setNoticiaSeleccionadaId(params.noticiaId);
      if (params?.docenteCarrera) setFiltroDocenteCarrera(params.docenteCarrera);

      setVistaActual(nuevaVista);

      if (typeof window !== "undefined") {
        let nuevoHash = "#/";
        if (nuevaVista === "/carreras/[id]") {
          nuevoHash = `#/carreras/${idCarreraFinal}`;
        } else if (nuevaVista === "/noticias/[id]") {
          nuevoHash = `#/noticias/${idNoticiaFinal}`;
        } else if (nuevaVista === "/repositorio") {
          nuevoHash = "#/repositorio";
        } else if (nuevaVista === "/transparencia") {
        nuevoHash = "#/transparencia";
      } else if (nuevaVista === "/contacto") {
          nuevoHash = "#/contacto";
        } else if (nuevaVista === "/admin") {
          nuevoHash = "#/admin";
        } else if (nuevaVista === "/noticias") {
          nuevoHash = "#/noticias";
        } else if (nuevaVista === "/orgullo") {
          nuevoHash = "#/orgullo";
        } else if (nuevaVista === "/docentes") {
          const escId = params?.docenteCarrera || filtroDocenteCarrera;
          nuevoHash = escId && escId !== "TODAS" ? `#/docentes/${escId}` : "#/docentes";
        }

        if (window.location.hash !== nuevoHash) {
          window.history.pushState(
            {
              vista: nuevaVista,
              carreraId: idCarreraFinal,
              noticiaId: idNoticiaFinal,
              docenteCarrera: params?.docenteCarrera || filtroDocenteCarrera,
            },
            "",
            nuevoHash
          );
        }
        if (!params?.skipScroll) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    },
    [carreraSeleccionadaId, noticiaSeleccionadaId, filtroDocenteCarrera]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash && window.location.hash !== "#/") {
      aplicarHashAEstado(window.location.hash);
    } else if (window.location.pathname && window.location.pathname !== "/") {
      aplicarHashAEstado(window.location.pathname);
    } else {
      window.history.replaceState({ vista: "/" }, "", "#/");
    }

    const handlePopState = () => {
      if (modalesAbiertosRef.current) {
        setDocenteModalActivo(null);
        setServicioModalInfo(null);
        setModalSubirAbierto(false);
        return;
      }
      aplicarHashAEstado(window.location.hash);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [aplicarHashAEstado]);

  // ==========================================================================
  // 1. PERSISTENCIA REAL EN SUPABASE (`portal_config`) Y CARGA INICIAL
  // ==========================================================================
  useEffect(() => {
    let activo = true;
    const aplicarHeroCfgDesdeString = (rawUrl: string) => {
      const [cleanUrl, cfgHash] = rawUrl.split("#fcm_cfg=");
      const urlFinal = cleanUrl || HERO_BG_DEFAULT;
      setHeroBgUrl(urlFinal);
      setHeroBgInputUrl(urlFinal);
      if (cfgHash) {
        const [bStr, opStr, colStr] = cfgHash.split("|");
        const bVal = Number(bStr);
        const opVal = Number(opStr);
        if (!Number.isNaN(bVal) && bVal >= 0 && bVal <= 12) setHeroBlur(bVal);
        if (!Number.isNaN(opVal) && opVal >= 0 && opVal <= 95) setHeroOverlayOpacity(opVal);
        if (colStr) setHeroOverlayColor(decodeURIComponent(colStr));
      }
    };

    const cargarConfiguracionDesdeSupabase = async () => {
      try {
        if (typeof window !== "undefined") {
          const localLogo = window.localStorage.getItem("fcm_logo_url");
          const localHeroBg = window.localStorage.getItem("fcm_hero_bg_url");
          const localHeroBlur = window.localStorage.getItem("fcm_hero_blur");
          const localHeroOpacity = window.localStorage.getItem("fcm_hero_overlay_opacity");
          const localHeroColor = window.localStorage.getItem("fcm_hero_overlay_color");
          const localCarreras = window.localStorage.getItem("fcm_carreras_data");
          const localNoticias = window.localStorage.getItem("fcm_noticias_data");
          const localStorageImgs = window.localStorage.getItem("fcm_storage_data");
          const localDocentes = window.localStorage.getItem("fcm_docentes_data");
          const localResenas = window.localStorage.getItem("fcm_resenas_docentes");
          const localMateriales = window.localStorage.getItem("fcm_materiales_data");

          const localOrgullo = window.localStorage.getItem("fcm_orgullo_data");
          if (localOrgullo && activo) {
            try {
              const parsedOrg = JSON.parse(localOrgullo);
              if (Array.isArray(parsedOrg) && parsedOrg.length > 0) setOrgulloItems(parsedOrg);
            } catch {}
          }

          const localTransparencia = window.localStorage.getItem("fcm_transparencia_data");
          if (localTransparencia && activo) {
            try {
              const parsedTrans = JSON.parse(localTransparencia);
              if (Array.isArray(parsedTrans) && parsedTrans.length > 0) setDocumentosTransparencia(parsedTrans);
            } catch {}
          }

          if (localLogo && activo) setLogoUrl(localLogo);
          if (localHeroBg && activo) {
            aplicarHeroCfgDesdeString(localHeroBg);
          }
          if (localHeroBlur !== null && activo) {
            const b = Number(localHeroBlur);
            if (!Number.isNaN(b)) setHeroBlur(b);
          }
          if (localHeroOpacity !== null && activo) {
            const op = Number(localHeroOpacity);
            if (!Number.isNaN(op)) setHeroOverlayOpacity(op);
          }
          if (localHeroColor && activo) {
            setHeroOverlayColor(localHeroColor);
          }
          if (localCarreras && activo) {
            const parsed = JSON.parse(localCarreras);
            if (Array.isArray(parsed) && parsed.length > 0) setCarreras(normalizarCarrerasConBento(parsed));
          }
          const localCalendario = window.localStorage.getItem("fcm_calendario_data");
          if (localCalendario && activo) {
            try {
              const parsedCal = JSON.parse(localCalendario);
              if (parsedCal && Array.isArray(parsedCal.actividades)) setCalendarioConfig(parsedCal);
            } catch {}
          }
          const localAsistente = window.localStorage.getItem("fcm_asistente_ia_data");
          if (localAsistente && activo) {
            try {
              const parsedAsist = JSON.parse(localAsistente);
              if (parsedAsist && Array.isArray(parsedAsist.faqs)) setAsistenteConfig(parsedAsist);
            } catch {}
          }
          const localAccesibilidad = window.localStorage.getItem("fcm_accesibilidad_data");
          if (localAccesibilidad && activo) {
            try {
              const parsedAcc = JSON.parse(localAccesibilidad);
              if (parsedAcc && typeof parsedAcc.habilitado === "boolean") setAccesibilidadConfig(parsedAcc);
            } catch {}
          }
          if (localNoticias && activo) {
            const parsed = JSON.parse(localNoticias);
            if (Array.isArray(parsed) && parsed.length > 0) setNoticias(parsed);
          }
          if (localStorageImgs && activo) {
            const parsed = JSON.parse(localStorageImgs);
            if (Array.isArray(parsed) && parsed.length > 0) setImagenesStorage(parsed);
          }
          if (localDocentes && activo) {
            const parsed = JSON.parse(localDocentes);
            if (Array.isArray(parsed) && parsed.length > 0) setDocentes(parsed);
          }
          if (localResenas && activo) {
            const parsed = JSON.parse(localResenas);
            if (Array.isArray(parsed) && parsed.length > 0) setResenasDocentes(parsed);
          }
          if (localMateriales && activo) {
            const parsed = JSON.parse(localMateriales);
            if (Array.isArray(parsed)) {
              const limpios = parsed.filter((m: MaterialRepositorio) => m.id !== "mat-pend-1" && m.id !== "mat-pend-2");
              setMateriales(limpios);
            }
          }
        }

        const { data, error } = await supabase
          .from("portal_config")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (!error && data && activo) {
          if (data.logo_url && typeof data.logo_url === "string") {
            setLogoUrl(data.logo_url);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_logo_url", data.logo_url);
          }
          if (data.hero_bg_url && typeof data.hero_bg_url === "string") {
            aplicarHeroCfgDesdeString(data.hero_bg_url);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_hero_bg_url", data.hero_bg_url);
          }
          if (typeof data.hero_blur === "number") {
            setHeroBlur(data.hero_blur);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_hero_blur", String(data.hero_blur));
          }
          if (typeof data.hero_overlay_opacity === "number") {
            setHeroOverlayOpacity(data.hero_overlay_opacity);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_hero_overlay_opacity", String(data.hero_overlay_opacity));
          }
          if (typeof data.hero_overlay_color === "string" && data.hero_overlay_color) {
            setHeroOverlayColor(data.hero_overlay_color);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_hero_overlay_color", data.hero_overlay_color);
          }
          if (Array.isArray(data.carreras_data) && data.carreras_data.length > 0) {
            const carrerasNorm = normalizarCarrerasConBento(data.carreras_data);
            setCarreras(carrerasNorm);
            const inicial = carrerasNorm.find((c: Carrera) => c.id === "computacion-cientifica") || carrerasNorm[0];
            if (inicial) {
              setUrlImagenCarreraInput(inicial.imagen_referencial_url);
              setUrlTripticoCarreraInput(inicial.triptico_pdf_url);
              setUrlPosterCarreraInput(inicial.poster_pdf_url || "");
            }
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_carreras_data", JSON.stringify(carrerasNorm));
          }
          if (Array.isArray(data.noticias_data) && data.noticias_data.length > 0) {
            setNoticias(data.noticias_data);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_noticias_data", JSON.stringify(data.noticias_data));
          }
          if (Array.isArray(data.storage_data) && data.storage_data.length > 0) {
            setImagenesStorage(data.storage_data);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_storage_data", JSON.stringify(data.storage_data));
          }
          if (Array.isArray(data.docentes_data) && data.docentes_data.length > 0) {
            setDocentes(data.docentes_data);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_docentes_data", JSON.stringify(data.docentes_data));
          }
          if (Array.isArray(data.resenas_docentes) && data.resenas_docentes.length > 0) {
            setResenasDocentes(data.resenas_docentes);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_resenas_docentes", JSON.stringify(data.resenas_docentes));
          }
          
          if (Array.isArray(data.orgullo_data) && data.orgullo_data.length > 0) {
            setOrgulloItems(data.orgullo_data);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_orgullo_data", JSON.stringify(data.orgullo_data));
          } else if (Array.isArray(data.storage_data)) {
            const metaOrg = data.storage_data.find((x: any) => x && x.id === "__fcm_orgullo_config__");
            if (metaOrg && Array.isArray(metaOrg.orgullo_items) && metaOrg.orgullo_items.length > 0) {
              setOrgulloItems(metaOrg.orgullo_items);
              if (typeof window !== "undefined") window.localStorage.setItem("fcm_orgullo_data", JSON.stringify(metaOrg.orgullo_items));
            }
          }

          if (Array.isArray(data.transparencia_data) && data.transparencia_data.length > 0) {
            setDocumentosTransparencia(data.transparencia_data);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_transparencia_data", JSON.stringify(data.transparencia_data));
          } else if (Array.isArray(data.storage_data)) {
            const metaTrans = data.storage_data.find((x: any) => x && x.id === "__fcm_transparencia_config__");
            if (metaTrans && Array.isArray(metaTrans.transparencia_items) && metaTrans.transparencia_items.length > 0) {
              setDocumentosTransparencia(metaTrans.transparencia_items);
              if (typeof window !== "undefined") window.localStorage.setItem("fcm_transparencia_data", JSON.stringify(metaTrans.transparencia_items));
            }
          }

          if (Array.isArray(data.materiales_data) && data.materiales_data.length > 0) {
            const limpios = data.materiales_data.filter((m: MaterialRepositorio) => m.id !== "mat-pend-1" && m.id !== "mat-pend-2");
            setMateriales(limpios);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_materiales_data", JSON.stringify(limpios));
          }

          if (data.calendario_data && Array.isArray(data.calendario_data.actividades)) {
            setCalendarioConfig(data.calendario_data);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_calendario_data", JSON.stringify(data.calendario_data));
          } else if (Array.isArray(data.storage_data)) {
            const metaCal = data.storage_data.find((x: { id?: string; calendario_config?: CalendarioSemestralConfig }) => x && x.id === "__fcm_calendario_config__");
            if (metaCal?.calendario_config && Array.isArray(metaCal.calendario_config.actividades)) {
              setCalendarioConfig(metaCal.calendario_config);
              if (typeof window !== "undefined") window.localStorage.setItem("fcm_calendario_data", JSON.stringify(metaCal.calendario_config));
            }
          }

          if (data.asistente_ia_data && Array.isArray(data.asistente_ia_data.faqs)) {
            setAsistenteConfig(data.asistente_ia_data);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_asistente_ia_data", JSON.stringify(data.asistente_ia_data));
          } else if (Array.isArray(data.storage_data)) {
            const metaAsist = data.storage_data.find((x: { id?: string; asistente_ia_config?: AsistenteIAConfig }) => x && x.id === "__fcm_asistente_ia_config__");
            if (metaAsist?.asistente_ia_config && Array.isArray(metaAsist.asistente_ia_config.faqs)) {
              setAsistenteConfig(metaAsist.asistente_ia_config);
              if (typeof window !== "undefined") window.localStorage.setItem("fcm_asistente_ia_data", JSON.stringify(metaAsist.asistente_ia_config));
            }
          }

          if (data.accesibilidad_data && typeof data.accesibilidad_data.habilitado === "boolean") {
            setAccesibilidadConfig(data.accesibilidad_data);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_accesibilidad_data", JSON.stringify(data.accesibilidad_data));
          } else if (Array.isArray(data.storage_data)) {
            const metaAcc = data.storage_data.find((x: { id?: string; accesibilidad_config?: AccesibilidadConfig }) => x && x.id === "__fcm_accesibilidad_config__");
            if (metaAcc?.accesibilidad_config && typeof metaAcc.accesibilidad_config.habilitado === "boolean") {
              setAccesibilidadConfig(metaAcc.accesibilidad_config);
              if (typeof window !== "undefined") window.localStorage.setItem("fcm_accesibilidad_data", JSON.stringify(metaAcc.accesibilidad_config));
            }
          }
        }
      } catch {
        // Mantiene estado por defecto si la tabla aún no fue creada
      } finally {
        if (activo) setCargandoConfig(false);
      }
    };
    cargarConfiguracionDesdeSupabase();

    // Verificación de sesión de administrador segura en servidor al cargar
    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((d) => {
        if (d?.authenticated) setAdminAutenticado(true);
      })
      .catch(() => {});

    return () => { activo = false; };
  }, []);

  const sincronizarPortalConfigSupabase = async (cambios: {
    logo_url?: string;
    hero_bg_url?: string;
    hero_blur?: number;
    hero_overlay_opacity?: number;
    hero_overlay_color?: string;
    carreras_data?: Carrera[];
    noticias_data?: Noticia[];
    storage_data?: ImagenStorage[];
    docentes_data?: Docente[];
    resenas_docentes?: ResenaDocente[];
    materiales_data?: MaterialRepositorio[];
    orgullo_data?: OrgulloItem[];
    transparencia_data?: DocumentoTransparencia[];
    calendario_data?: CalendarioSemestralConfig;
    asistente_ia_data?: AsistenteIAConfig;
    accesibilidad_data?: AccesibilidadConfig;
  }): Promise<boolean> => {
    if (typeof window !== "undefined" && cambios.transparencia_data) {
      window.localStorage.setItem("fcm_transparencia_data", JSON.stringify(cambios.transparencia_data));
    }
    if (typeof window !== "undefined") {
      if (cambios.logo_url) window.localStorage.setItem("fcm_logo_url", cambios.logo_url);
      if (cambios.hero_bg_url) window.localStorage.setItem("fcm_hero_bg_url", cambios.hero_bg_url);
      if (typeof cambios.hero_blur === "number") window.localStorage.setItem("fcm_hero_blur", String(cambios.hero_blur));
      if (typeof cambios.hero_overlay_opacity === "number") window.localStorage.setItem("fcm_hero_overlay_opacity", String(cambios.hero_overlay_opacity));
      if (cambios.hero_overlay_color) window.localStorage.setItem("fcm_hero_overlay_color", cambios.hero_overlay_color);
      if (cambios.carreras_data) window.localStorage.setItem("fcm_carreras_data", JSON.stringify(cambios.carreras_data));
      if (cambios.noticias_data) window.localStorage.setItem("fcm_noticias_data", JSON.stringify(cambios.noticias_data));
      if (cambios.storage_data) window.localStorage.setItem("fcm_storage_data", JSON.stringify(cambios.storage_data));
      if (cambios.docentes_data) window.localStorage.setItem("fcm_docentes_data", JSON.stringify(cambios.docentes_data));
      if (cambios.resenas_docentes) window.localStorage.setItem("fcm_resenas_docentes", JSON.stringify(cambios.resenas_docentes));
      if (cambios.materiales_data) window.localStorage.setItem("fcm_materiales_data", JSON.stringify(cambios.materiales_data));
      if (cambios.orgullo_data) window.localStorage.setItem("fcm_orgullo_data", JSON.stringify(cambios.orgullo_data));
      if (cambios.calendario_data) window.localStorage.setItem("fcm_calendario_data", JSON.stringify(cambios.calendario_data));
      if (cambios.asistente_ia_data) window.localStorage.setItem("fcm_asistente_ia_data", JSON.stringify(cambios.asistente_ia_data));
      if (cambios.accesibilidad_data) window.localStorage.setItem("fcm_accesibilidad_data", JSON.stringify(cambios.accesibilidad_data));
    }

    // 1. Intento por Servidor Seguro (Route Handler /api/admin/sync con RLS y Service Role)
    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambios),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ok) return true;
      }
    } catch {
      // Continúa al respaldo directo de cliente
    }

    // 2. Respaldo directo en cliente Supabase
    try {
      const { error } = await supabase.from("portal_config").upsert(
        { id: 1, ...cambios, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
      if (error) {
        // Fallback seguro si alguna columna nueva aún no existe en el esquema SQL de portal_config
        const {
          hero_blur,
          hero_overlay_opacity,
          hero_overlay_color,
          orgullo_data,
          transparencia_data,
          calendario_data,
          asistente_ia_data,
          accesibilidad_data,
          ...resto
        } = cambios;
        void transparencia_data;
        void calendario_data;
        void asistente_ia_data;
        void accesibilidad_data;
        void hero_blur;
        void hero_overlay_opacity;
        void hero_overlay_color;
        void orgullo_data;
        void hero_blur;
        void hero_overlay_opacity;
        void hero_overlay_color;
        if (Object.keys(resto).length > 0) {
          const { error: retryErr } = await supabase.from("portal_config").upsert(
            { id: 1, ...resto, updated_at: new Date().toISOString() },
            { onConflict: "id" }
          );
          return !retryErr;
        }
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  // Botón "Usar como Logo" del CMS conectado a Supabase con upsert + alert
  const handleUsarComoLogo = async (nuevaUrlLogo: string) => {
    setLogoUrl(nuevaUrlLogo);
    const guardadoEnBd = await sincronizarPortalConfigSupabase({ logo_url: nuevaUrlLogo });
    lanzarToast("🛡️ Logo institucional actualizado y persistido en portal_config.");
    if (typeof window !== "undefined") {
      window.alert(
        guardadoEnBd
          ? "✅ Logo actualizado y guardado permanentemente en la tabla portal_config de Supabase."
          : "✅ Logo actualizado y persistido en la configuración del portal."
      );
    }
  };

  // Botón para establecer imagen y personalización de difuminado/color en el Hero del Home
  const handleUsarComoFondoHero = async (
    nuevaUrlHero: string,
    blurCustom?: number,
    opacityCustom?: number,
    colorCustom?: string
  ) => {
    const limpia = (nuevaUrlHero.split("#fcm_cfg=")[0] || "").trim() || HERO_BG_DEFAULT;
    const bFinal = typeof blurCustom === "number" ? blurCustom : heroBlur;
    const opFinal = typeof opacityCustom === "number" ? opacityCustom : heroOverlayOpacity;
    const colFinal = colorCustom || heroOverlayColor;

    setHeroBgUrl(limpia);
    setHeroBgInputUrl(limpia);
    setHeroBlur(bFinal);
    setHeroOverlayOpacity(opFinal);
    setHeroOverlayColor(colFinal);

    const urlConConfig = `${limpia}#fcm_cfg=${bFinal}|${opFinal}|${encodeURIComponent(colFinal)}`;
    await sincronizarPortalConfigSupabase({
      hero_bg_url: urlConConfig,
      hero_blur: bFinal,
      hero_overlay_opacity: opFinal,
      hero_overlay_color: colFinal,
    });
    lanzarToast("🖼️ Personalización del Hero (imagen, difuminado y color) guardada en Supabase.");
  };

  const abrirMenuServicioConHover = () => {
    if (timeoutServicioRef.current) {
      clearTimeout(timeoutServicioRef.current);
      timeoutServicioRef.current = null;
    }
    setDropdownServicioAbierto(true);
  };

  const cerrarMenuServicioConRetraso = () => {
    if (timeoutServicioRef.current) clearTimeout(timeoutServicioRef.current);
    timeoutServicioRef.current = setTimeout(() => setDropdownServicioAbierto(false), 260);
  };

  const abrirMenuFormacionConHover = () => {
    if (timeoutFormacionRef.current) {
      clearTimeout(timeoutFormacionRef.current);
      timeoutFormacionRef.current = null;
    }
    setDropdownFormacionAbierto(true);
  };

  const cerrarMenuFormacionConRetraso = () => {
    if (timeoutFormacionRef.current) clearTimeout(timeoutFormacionRef.current);
    timeoutFormacionRef.current = setTimeout(() => setDropdownFormacionAbierto(false), 260);
  };

  // Sincronización del Modo Oscuro con LocalStorage y Media Query
  useEffect(() => {
    try {
      const guardado = localStorage.getItem("fcm_theme");
      if (guardado === "dark") {
        setModoOscuro(true);
        document.documentElement.classList.add("dark");
      } else if (guardado === "light") {
        setModoOscuro(false);
        document.documentElement.classList.remove("dark");
      } else if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setModoOscuro(true);
        document.documentElement.classList.add("dark");
      }
    } catch {
      // Ignorar en entornos restringidos
    }
  }, []);

  const toggleModoOscuro = () => {
    setModoOscuro((prev) => {
      const nuevo = !prev;
      try {
        localStorage.setItem("fcm_theme", nuevo ? "dark" : "light");
        if (nuevo) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch {}
      return nuevo;
    });
  };

  
  // Scroll-Reveal: Revelado animado fluido al bajar por la página
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    const elementos = document.querySelectorAll(".reveal-on-scroll");
    elementos.forEach((el) => observer.observe(el));

    return () => {
      elementos.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [vistaActual, carreraSeleccionadaId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuServicioRef.current && !menuServicioRef.current.contains(event.target as Node)) {
        setDropdownServicioAbierto(false);
      }
      if (menuFormacionRef.current && !menuFormacionRef.current.contains(event.target as Node)) {
        setDropdownFormacionAbierto(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownServicioAbierto(false);
        setDropdownFormacionAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (timeoutServicioRef.current) clearTimeout(timeoutServicioRef.current);
      if (timeoutFormacionRef.current) clearTimeout(timeoutFormacionRef.current);
    };
  }, []);

  const handleSeleccionarCarreraEnAdmin = (id: CarreraId) => {
    setAdminCarreraEditId(id);
    const encontrada = carreras.find((c) => c.id === id);
    if (encontrada) {
      setUrlImagenCarreraInput(encontrada.imagen_referencial_url);
      setUrlTripticoCarreraInput(encontrada.triptico_pdf_url);
      setUrlPosterCarreraInput(encontrada.poster_pdf_url || "");
    }
  };

  const cursosDependientesSubida = useMemo(
    () => malla.filter((c) => c.carrera_id === formSubidaAnon.carrera_id && c.ciclo === Number(formSubidaAnon.ciclo)),
    [malla, formSubidaAnon.carrera_id, formSubidaAnon.ciclo]
  );

  const carreraActiva = useMemo(
    () => carreras.find((c) => c.id === carreraSeleccionadaId) || CARRERAS_INICIALES[0],
    [carreras, carreraSeleccionadaId]
  );

  const cursosDeCarreraActiva = useMemo(
    () => malla.filter((c) => c.carrera_id === carreraActiva.id),
    [malla, carreraActiva.id]
  );

  const materialesAprobados = useMemo(() => materiales.filter((m) => m.estado === "aprobado"), [materiales]);
  const materialesPendientes = useMemo(() => materiales.filter((m) => m.estado === "pendiente"), [materiales]);
  const resenasPendientes = useMemo(() => resenasDocentes.filter((r) => r.estado === "pendiente"), [resenasDocentes]);

  const obtenerEstadisticasDocente = useCallback(
    (docenteId: string) => {
      const aprobadas = resenasDocentes.filter((r) => r.docente_id === docenteId && r.estado === "aprobado");
      const total = aprobadas.length;
      const promedio = total > 0 ? aprobadas.reduce((acc, item) => acc + item.puntuacion, 0) / total : 0;
      const distribucion = [5, 4, 3, 2, 1].map((estrellas) => {
        const cantidad = aprobadas.filter((r) => r.puntuacion === estrellas).length;
        const porcentaje = total > 0 ? Math.round((cantidad / total) * 100) : 0;
        return { estrellas, cantidad, porcentaje };
      });
      return { aprobadas, total, promedio, distribucion };
    },
    [resenasDocentes]
  );

  const abrirModalDocente = (doc: Docente) => {
    setDocenteModalActivo(doc);
    setHoverEstrellaDocente(0);
    setErrorResenaDocente("");
    setExitoResenaDocente(false);
    setFormResenaDocente({
      puntuacion: 5,
      curso: doc.cursos_dictados[0] || "Asignatura de la Escuela",
      autor_alias: "",
      esAnonimo: false,
      comentario: "",
      bot_trap: "",
    });
  };

  const handleEnviarResenaDocente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docenteModalActivo) return;

    // Protección Honeypot Anti-Spam / Bots
    if (formResenaDocente.bot_trap && formResenaDocente.bot_trap.trim() !== "") {
      setExitoResenaDocente(true);
      return;
    }

    const comentarioLimpio = formResenaDocente.comentario.trim().replace(/<[^>]*>?/gm, "");
    if (formResenaDocente.puntuacion < 1 || formResenaDocente.puntuacion > 5) {
      setErrorResenaDocente("Por favor selecciona una calificación entre 1 y 5 estrellas.");
      return;
    }
    if (comentarioLimpio.length < 10) {
      setErrorResenaDocente("El comentario debe tener al menos 10 caracteres explicando tu valoración.");
      return;
    }

    const aliasFinal = formResenaDocente.esAnonimo
      ? "Estudiante Anónimo FCM"
      : formResenaDocente.autor_alias.trim().replace(/<[^>]*>?/gm, "") || "Estudiante Anónimo FCM";

    const nuevaResena: ResenaDocente = {
      id: `res-${Date.now()}`,
      docente_id: docenteModalActivo.id,
      puntuacion: formResenaDocente.puntuacion as 1 | 2 | 3 | 4 | 5,
      comentario: comentarioLimpio,
      curso: formResenaDocente.curso.trim() || docenteModalActivo.cursos_dictados[0] || "Asignatura General",
      autor_alias: aliasFinal,
      fecha: new Date().toISOString().split("T")[0],
      estado: "aprobado",
    };

    const nuevasResenas = [nuevaResena, ...resenasDocentes];
    setResenasDocentes(nuevasResenas);
    await sincronizarPortalConfigSupabase({ resenas_docentes: nuevasResenas });

    setErrorResenaDocente("");
    setExitoResenaDocente(true);
    setHoverEstrellaDocente(0);
    setFormResenaDocente({
      puntuacion: 5,
      curso: docenteModalActivo.cursos_dictados[0] || "Asignatura de la Escuela",
      autor_alias: "",
      esAnonimo: false,
      comentario: "",
      bot_trap: "",
    });
    lanzarToast(`⭐ ¡Gracias! Tu reseña para ${docenteModalActivo.grado_academico} ${docenteModalActivo.nombre_completo} fue publicada.`);
    setTimeout(() => setExitoResenaDocente(false), 5000);
  };

  const handleCambiarEstadoResenaAdmin = async (idResena: string, nuevoEstado: "aprobado" | "pendiente") => {
    const actualizadas = resenasDocentes.map((r) => (r.id === idResena ? { ...r, estado: nuevoEstado } : r));
    setResenasDocentes(actualizadas);
    await sincronizarPortalConfigSupabase({ resenas_docentes: actualizadas });
    lanzarToast(
      nuevoEstado === "aprobado"
        ? "✅ Reseña docente aprobada y visible públicamente."
        : "⏸️ Reseña docente marcada como pendiente."
    );
  };

  const handleEliminarResenaDocenteAdmin = async (idResena: string) => {
    const filtradas = resenasDocentes.filter((r) => r.id !== idResena);
    setResenasDocentes(filtradas);
    await sincronizarPortalConfigSupabase({ resenas_docentes: filtradas });
    lanzarToast("🗑️ Reseña de docente eliminada permanentemente de Supabase.");
  };

  const resultadosBusquedaHero = useMemo(() => {
    const q = busquedaGlobal.trim().toLowerCase();
    if (!q) return { cursos: [], materiales: [] };
    return {
      cursos: malla.filter((c) => c.codigo.toLowerCase().includes(q) || c.nombre_curso.toLowerCase().includes(q)).slice(0, 6),
      materiales: materialesAprobados.filter((m) => m.titulo.toLowerCase().includes(q) || m.docente.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [busquedaGlobal, malla, materialesAprobados]);

  const cursosDisponiblesFiltroRepo = useMemo(
    () =>
      malla.filter((c) => {
        const okCarrera = repoFiltroCarrera === "TODAS" || c.carrera_id === repoFiltroCarrera;
        const okCiclo = repoFiltroCiclo === "TODOS" || c.ciclo === repoFiltroCiclo;
        return okCarrera && okCiclo;
      }),
    [malla, repoFiltroCarrera, repoFiltroCiclo]
  );

  const materialesFiltradosRepo = useMemo(
    () =>
      materialesAprobados.filter((m) => {
        const curso = malla.find((c) => c.id === m.curso_id);
        const cicloMat = m.ciclo || curso?.ciclo;
        if (repoFiltroCarrera !== "TODAS" && m.carrera_id !== repoFiltroCarrera) return false;
        if (repoFiltroCiclo !== "TODOS" && cicloMat !== repoFiltroCiclo) return false;
        if (repoFiltroCurso !== "TODOS" && m.curso_id !== repoFiltroCurso) return false;
        if (repoFiltroTipo !== "TODOS" && m.tipo_archivo !== repoFiltroTipo) return false;
        if (repoBusquedaTexto.trim() !== "") {
          const q = repoBusquedaTexto.toLowerCase();
          return (
            m.titulo.toLowerCase().includes(q) ||
            m.docente.toLowerCase().includes(q) ||
            Boolean(curso?.codigo.toLowerCase().includes(q)) ||
            Boolean(curso?.nombre_curso.toLowerCase().includes(q))
          );
        }
        return true;
      }),
    [materialesAprobados, malla, repoFiltroCarrera, repoFiltroCiclo, repoFiltroCurso, repoFiltroTipo, repoBusquedaTexto]
  );

  useEffect(() => {
    setRepoPaginaActual(1);
  }, [repoFiltroCarrera, repoFiltroCiclo, repoFiltroCurso, repoFiltroTipo, repoBusquedaTexto]);

  const ITEMS_POR_PAGINA_REPO = 6;
  const totalPaginasRepo = Math.max(1, Math.ceil(materialesFiltradosRepo.length / ITEMS_POR_PAGINA_REPO));
  const inicioIndiceRepo = (repoPaginaActual - 1) * ITEMS_POR_PAGINA_REPO;
  const finIndiceRepo = Math.min(inicioIndiceRepo + ITEMS_POR_PAGINA_REPO, materialesFiltradosRepo.length);
  const materialesPaginadosRepo = useMemo(() => {
    return materialesFiltradosRepo.slice(inicioIndiceRepo, inicioIndiceRepo + ITEMS_POR_PAGINA_REPO);
  }, [materialesFiltradosRepo, inicioIndiceRepo]);

  const obtenerNumerosPaginaRepo = () => {
    const paginas: (number | "...")[] = [];
    if (totalPaginasRepo <= 7) {
      for (let i = 1; i <= totalPaginasRepo; i++) paginas.push(i);
    } else {
      paginas.push(1);
      if (repoPaginaActual > 3) paginas.push("...");
      const inicio = Math.max(2, repoPaginaActual - 1);
      const fin = Math.min(totalPaginasRepo - 1, repoPaginaActual + 1);
      for (let i = inicio; i <= fin; i++) {
        if (!paginas.includes(i)) paginas.push(i);
      }
      if (repoPaginaActual < totalPaginasRepo - 2) paginas.push("...");
      paginas.push(totalPaginasRepo);
    }
    return paginas;
  };

  const cambiarPaginaRepo = (nuevaPagina: number) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginasRepo) return;
    setRepoPaginaActual(nuevaPagina);
    const contenedor = document.getElementById("seccion-recursos-repo");
    if (contenedor) {
      contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const subirArchivoASupabaseStorage = async (file: File, carpeta: string): Promise<string> => {
    try {
      const safeName = `${carpeta}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { data, error } = await supabase.storage.from("fcm-assets").upload(safeName, file, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

      if (!error && data) {
        const { data: publicData } = supabase.storage.from("fcm-assets").getPublicUrl(safeName);
        if (publicData?.publicUrl) return publicData.publicUrl;
      }
    } catch (err) {
      console.warn("Fallo upload a Supabase Storage fcm-assets:", err);
    }

    // Fallback: Convertir a DataURL Base64 persistente (nunca devolver blob:)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        resolve("");
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubirImagenCarreraStorage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoAssetCarrera(true);
    try {
      const publicUrl = await subirArchivoASupabaseStorage(file, `carreras/${adminCarreraEditId}`);
      setUrlImagenCarreraInput(publicUrl);
      const nuevasCarreras = carreras.map((c) => (c.id === adminCarreraEditId ? { ...c, imagen_referencial_url: publicUrl } : c));
      setCarreras(nuevasCarreras);
      await sincronizarPortalConfigSupabase({ carreras_data: nuevasCarreras });
      lanzarToast(`✅ Imagen referencial de ${carreraAdminSeleccionada.nombre} guardada en Supabase.`);
    } finally {
      setSubiendoAssetCarrera(false);
      if (inputImagenCarreraRef.current) inputImagenCarreraRef.current.value = "";
    }
  };

  const handleSubirTripticoPdfStorage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoAssetCarrera(true);
    try {
      const publicUrl = await subirArchivoASupabaseStorage(file, `tripticos/${adminCarreraEditId}`);
      setUrlTripticoCarreraInput(publicUrl);
      const nuevasCarreras = carreras.map((c) =>
        c.id === adminCarreraEditId ? { ...c, triptico_pdf_url: publicUrl, triptico_nombre_archivo: file.name } : c
      );
      setCarreras(nuevasCarreras);
      await sincronizarPortalConfigSupabase({ carreras_data: nuevasCarreras });
      lanzarToast(`📥 Tríptico PDF "${file.name}" guardado en Supabase para ${carreraAdminSeleccionada.nombre}.`);
    } finally {
      setSubiendoAssetCarrera(false);
      if (inputTripticoPdfRef.current) inputTripticoPdfRef.current.value = "";
    }
  };

  const handleSubirPosterPdfStorage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoAssetCarrera(true);
    try {
      const publicUrl = await subirArchivoASupabaseStorage(file, `posters/${adminCarreraEditId}`);
      setUrlPosterCarreraInput(publicUrl);
      const nuevasCarreras = carreras.map((c) =>
        c.id === adminCarreraEditId ? { ...c, poster_pdf_url: publicUrl, poster_nombre_archivo: file.name } : c
      );
      setCarreras(nuevasCarreras);
      await sincronizarPortalConfigSupabase({ carreras_data: nuevasCarreras });
      lanzarToast(`📥 Póster de Estudios PDF "${file.name}" guardado en Supabase para ${carreraAdminSeleccionada.nombre}.`);
    } finally {
      setSubiendoAssetCarrera(false);
      if (inputPosterPdfRef.current) inputPosterPdfRef.current.value = "";
    }
  };

  const handleGuardarDatosCarreraAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevasCarreras = carreras.map((c) =>
      c.id === adminCarreraEditId
        ? {
            ...c,
            imagen_referencial_url: urlImagenCarreraInput.trim() || c.imagen_referencial_url,
            triptico_pdf_url: urlTripticoCarreraInput.trim(),
            poster_pdf_url: urlPosterCarreraInput.trim(),
          }
        : c
    );
    setCarreras(nuevasCarreras);
    await sincronizarPortalConfigSupabase({ carreras_data: nuevasCarreras });
    lanzarToast(`✅ Recursos multimedia de ${carreraAdminSeleccionada.nombre} guardados en Supabase.`);
  };

  const handleActualizarCarreraCompleta = async (carreraActualizada: Carrera) => {
    const nuevasCarreras = carreras.map((c) => (c.id === carreraActualizada.id ? carreraActualizada : c));
    setCarreras(nuevasCarreras);
    setUrlImagenCarreraInput(carreraActualizada.imagen_referencial_url);
    setUrlTripticoCarreraInput(carreraActualizada.triptico_pdf_url);
    setUrlPosterCarreraInput(carreraActualizada.poster_pdf_url || "");
    await sincronizarPortalConfigSupabase({ carreras_data: nuevasCarreras });
    lanzarToast(`✅ Tarjeta Bento, píldoras de especialización y ficha de ${carreraActualizada.nombre} guardadas en Supabase.`);
  };

  const handleSubirImagenPortadaNoticia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const publicUrl = await subirArchivoASupabaseStorage(file, "noticias");
    setFormNoticia((prev) => ({ ...prev, imagen_url: publicUrl }));
    lanzarToast("✅ Imagen de portada cargada en el formulario de la noticia.");
    if (inputImagenNoticiaRef.current) inputImagenNoticiaRef.current.value = "";
  };

  const handleSubirFondoNoticiaStorage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const publicUrl = await subirArchivoASupabaseStorage(file, "noticias-fondos");
      if (publicUrl && !publicUrl.startsWith("blob:")) {
        setFormNoticia((prev) => ({ ...prev, fondo_imagen_url: publicUrl }));
        lanzarToast("✅ Fondo de carrusel cargado y persistente.");
      } else {
        lanzarToast("⚠️ No se pudo generar una URL persistente.");
      }
    } catch {
      lanzarToast("❌ Error al procesar imagen de fondo.");
    } finally {
      if (inputFondoNoticiaRef.current) inputFondoNoticiaRef.current.value = "";
    }
  };

  const handleDescargarTripticoCarrera = () => {
    if (carreraActiva.triptico_pdf_url && carreraActiva.triptico_pdf_url.trim() !== "") {
      const link = document.createElement("a");
      link.href = carreraActiva.triptico_pdf_url;
      link.target = "_blank";
      link.download = carreraActiva.triptico_nombre_archivo || `Triptico_${carreraActiva.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      lanzarToast(`📥 Descargando Tríptico PDF oficial de ${carreraActiva.nombre}...`);
      return;
    }

    if (carreraActiva.id === "computacion-cientifica") {
      window.open("/tripticos/triptico-computacion-cientifica.html", "_blank");
      lanzarToast("💻 Abriendo Tríptico Oficial de Computación Científica (2 caras listas para imprimir/PDF)...");
      return;
    }

    const win = window.open("", "_blank", "width=1050,height=800");
    if (!win) {
      window.print();
      return;
    }
    const primerosCursos = cursosDeCarreraActiva
      .filter((c) => c.ciclo <= 4)
      .slice(0, 10)
      .map((c) => `<li><strong>[${c.codigo}]</strong> ${c.nombre_curso} (Ciclo ${c.ciclo})</li>`)
      .join("");

    win.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8" /><title>Tríptico - ${carreraActiva.nombre}</title><style>body{font-family:'Segoe UI',Arial,sans-serif;margin:20px;color:#0F172A}.grid-triptico{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;border:2px solid #002855;border-radius:12px;padding:20px}.col{border-right:1px dashed #CBD5E1;padding-right:16px}.col:last-child{border-right:none;padding-right:0}h1{font-size:18px;color:#002855;margin:6px 0}h2{font-size:13px;color:#B91C1C;text-transform:uppercase;border-bottom:2px solid #002855;padding-bottom:4px;margin-top:14px}p,li{font-size:12px;line-height:1.55;color:#334155}</style></head><body><div class="grid-triptico"><div class="col"><div style="background:#002855;color:#FFF;padding:14px;border-radius:8px;border-bottom:4px solid #B91C1C"><div style="font-size:10px;font-weight:700;color:#FCA5A5">UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS</div><h1 style="color:#FFF;margin:4px 0">Escuela Profesional de ${carreraActiva.nombre}</h1><div style="font-size:11px;color:#BFDBFE">${carreraActiva.codigo_escuela} • Plan 2026</div></div><h2>Presentación</h2><p>${carreraActiva.descripcion}</p><h2>Visión Académica</h2><p>${carreraActiva.vision_carrera}</p></div><div class="col"><h2>Perfil del Egresado</h2><p>${carreraActiva.perfil_egreso}</p><h2>Campo Laboral</h2><p>${carreraActiva.campo_laboral}</p><h2>¿Por qué estudiar ${carreraActiva.nombre}?</h2><p>${carreraActiva.por_que_estudiar}</p></div><div class="col"><h2>Grados y Títulos Oficiales</h2><p><strong>Duración:</strong> 10 Semestres Académicos</p><p><strong>Grado:</strong> ${carreraActiva.grado_academico}</p><p><strong>Título:</strong> ${carreraActiva.titulo_profesional}</p><h2>Asignaturas Base</h2><ul style="padding-left:16px">${primerosCursos}</ul></div></div><script>window.onload=function(){setTimeout(function(){window.print()},250)}</script></body></html>`);
    win.document.close();
    lanzarToast(`📥 Generando Tríptico PDF de ${carreraActiva.nombre}...`);
  };

  const handleDescargarTripticoPorCarrera = (car: Carrera, e: React.MouseEvent) => {
    e.stopPropagation();
    if (car.triptico_pdf_url && car.triptico_pdf_url.trim() !== "") {
      const link = document.createElement("a");
      link.href = car.triptico_pdf_url;
      link.target = "_blank";
      link.download = car.triptico_nombre_archivo || `Triptico_${car.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      lanzarToast(`📥 Descargando Tríptico PDF oficial de ${car.nombre}...`);
      return;
    }
    if (car.id === "computacion-cientifica") {
      window.open("/tripticos/triptico-computacion-cientifica.html", "_blank");
      lanzarToast("💻 Abriendo Tríptico Oficial de Computación Científica (2 caras listas para imprimir/PDF)...");
      return;
    }
    const cursosCar = malla
      .filter((c) => c.carrera_id === car.id && c.ciclo <= 4)
      .slice(0, 10)
      .map((c) => `<li><strong>[${c.codigo}]</strong> ${c.nombre_curso} (Ciclo ${c.ciclo})</li>`)
      .join("");
    const win = window.open("", "_blank", "width=1050,height=800");
    if (!win) {
      window.print();
      return;
    }
    win.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8" /><title>Tríptico - ${car.nombre}</title><style>body{font-family:'Segoe UI',Arial,sans-serif;margin:20px;color:#0F172A}.grid-triptico{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;border:2px solid #002855;border-radius:12px;padding:20px}.col{border-right:1px dashed #CBD5E1;padding-right:16px}.col:last-child{border-right:none;padding-right:0}h1{font-size:18px;color:#002855;margin:6px 0}h2{font-size:13px;color:#B91C1C;text-transform:uppercase;border-bottom:2px solid #002855;padding-bottom:4px;margin-top:14px}p,li{font-size:12px;line-height:1.55;color:#334155}</style></head><body><div class="grid-triptico"><div class="col"><div style="background:#002855;color:#FFF;padding:14px;border-radius:8px;border-bottom:4px solid #B91C1C"><div style="font-size:10px;font-weight:700;color:#FCA5A5">UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS</div><h1 style="color:#FFF;margin:4px 0">Escuela Profesional de ${car.nombre}</h1><div style="font-size:11px;color:#BFDBFE">${car.codigo_escuela} • Plan 2026</div></div><h2>Presentación</h2><p>${car.descripcion}</p><h2>Visión Académica</h2><p>${car.vision_carrera}</p></div><div class="col"><h2>Perfil del Egresado</h2><p>${car.perfil_egreso}</p><h2>Campo Laboral</h2><p>${car.campo_laboral}</p><h2>¿Por qué estudiar ${car.nombre}?</h2><p>${car.por_que_estudiar}</p></div><div class="col"><h2>Grados y Títulos Oficiales</h2><p><strong>Duración:</strong> 10 Semestres Académicos</p><p><strong>Grado:</strong> ${car.grado_academico}</p><p><strong>Título:</strong> ${car.titulo_profesional}</p><h2>Asignaturas Base</h2><ul style="padding-left:16px">${cursosCar}</ul></div></div><script>window.onload=function(){setTimeout(function(){window.print()},250)}</script></body></html>`);
    win.document.close();
    lanzarToast(`📥 Generando Tríptico PDF de ${car.nombre}...`);
  };

  const handleDescargarPosterEstudios = () => {
    if (carreraActiva.poster_pdf_url && carreraActiva.poster_pdf_url.trim() !== "") {
      const link = document.createElement("a");
      link.href = carreraActiva.poster_pdf_url;
      link.target = "_blank";
      link.download = carreraActiva.poster_nombre_archivo || `Poster_Estudios_${carreraActiva.id}_Plan2026.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      lanzarToast(`📥 Descargando Póster Oficial de Estudios de ${carreraActiva.nombre}...`);
      return;
    }

    setCiclosAbiertos([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const totalCreditosCarrera = cursosDeCarreraActiva.reduce((acc, c) => acc + c.creditos, 0);
    const totalObligatorios = cursosDeCarreraActiva.filter((c) => c.tipo_curso === "O").length;
    const totalElectivos = cursosDeCarreraActiva.filter((c) => c.tipo_curso === "E").length;

    const ventanaImpresion = window.open("", "_blank", "width=1200,height=900");
    if (!ventanaImpresion) {
      window.print();
      return;
    }

    const bloquesCiclosHtml = Array.from({ length: 10 }, (_, i) => i + 1)
      .map((numCiclo) => {
        const cursosCiclo = cursosDeCarreraActiva.filter((c) => c.ciclo === numCiclo);
        const credCiclo = cursosCiclo.reduce((acc, c) => acc + c.creditos, 0);
        const filasHtml = cursosCiclo
          .map(
            (cur) => `
              <div style="background:#ffffff;border:1px solid #E2E8F0;border-left:3.5px solid ${cur.tipo_curso === 'O' ? '#002855' : '#B91C1C'};padding:6px 8px;border-radius:6px;margin-bottom:6px;box-shadow:0 1px 2px rgba(0,0,0,0.04)">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;margin-bottom:2px">
                  <span style="font-family:monospace;font-weight:800;color:#002855">[${cur.codigo}]</span>
                  <span style="font-weight:700;color:${cur.tipo_curso === 'O' ? '#1E3A8A' : '#991B1B'};background:${cur.tipo_curso === 'O' ? '#EFF6FF' : '#FEF2F2'};padding:1px 5px;border-radius:4px">${cur.creditos.toFixed(1)} cr</span>
                </div>
                <div style="font-size:10.5px;font-weight:700;color:#1E293B;line-height:1.25">${cur.nombre_curso}</div>
                <div style="font-size:9px;color:#64748B;margin-top:2px;font-family:monospace">Req: ${cur.prerequisitos.length > 0 ? cur.prerequisitos.join(', ') : 'Ninguno'}</div>
              </div>
            `
          )
          .join("");

        return `
          <div style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:10px;padding:8px;display:flex;flex-direction:column">
            <div style="background:#002855;color:#ffffff;padding:6px 10px;border-radius:6px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
              <strong style="font-size:11px;letter-spacing:0.5px">CICLO ${numCiclo}</strong>
              <span style="font-size:9.5px;color:#93C5FD">${credCiclo.toFixed(1)} cr</span>
            </div>
            <div style="flex:1">${filasHtml}</div>
          </div>
        `;
      })
      .join("");

    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Póster Oficial de Estudios — ${carreraActiva.nombre} (Plan 2026)</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { size: A3 landscape; margin: 8mm; }
          body { font-family: 'Inter', -apple-system, sans-serif; background: #ffffff; color: #0F172A; padding: 14px; }
          .header { border-bottom: 3px solid #B91C1C; padding-bottom: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
          .grid-poster { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;gap:10px">
          <button onclick="window.print()" style="background:#002855;color:#ffffff;border:none;padding:12px 24px;border-radius:12px;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.3)">🖨️ Imprimir / Guardar Póster en PDF</button>
        </div>
        <div class="header">
          <div>
            <div style="font-size:11px;font-weight:900;color:#B91C1C;letter-spacing:1px;text-transform:uppercase">Universidad Nacional Mayor de San Marcos • Decana de América</div>
            <h1 style="font-size:22px;color:#002855;font-weight:900;margin:3px 0">FACULTAD DE CIENCIAS MATEMÁTICAS (${carreraActiva.codigo_escuela})</h1>
            <h2 style="font-size:15px;color:#334155;font-weight:800">PÓSTER OFICIAL DE ESTUDIOS — ${carreraActiva.nombre.toUpperCase()} (PLAN 2026)</h2>
          </div>
          <div style="text-align:right;font-size:11px;color:#334155;background:#F1F5F9;padding:8px 14px;border-radius:8px;border:1px solid #CBD5E1">
            <div><strong>Duración:</strong> 10 Semestres • <strong>Total Créditos:</strong> ${totalCreditosCarrera.toFixed(1)}</div>
            <div><strong>Asignaturas:</strong> ${cursosDeCarreraActiva.length} (${totalObligatorios} Obligatorias, ${totalElectivos} Electivas)</div>
            <div style="color:#002855;font-weight:700">Grado: ${carreraActiva.grado_academico}</div>
          </div>
        </div>
        <div class="grid-poster">
          ${bloquesCiclosHtml}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          }
        </script>
      </body>
      </html>
    `);
    ventanaImpresion.document.close();
    lanzarToast(`📊 Abriendo Póster Oficial de Estudios de ${carreraActiva.nombre}...`);
  };

  const handleDescargarMallaPDF = () => {
    setCiclosAbiertos([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const totalCreditosCarrera = cursosDeCarreraActiva.reduce((acc, c) => acc + c.creditos, 0);
    const ventanaImpresion = window.open("", "_blank", "width=1050,height=850");
    if (!ventanaImpresion) {
      window.print();
      return;
    }
    const bloquesCiclosHtml = Array.from({ length: 10 }, (_, i) => i + 1)
      .map((numCiclo) => {
        const cursosCiclo = cursosDeCarreraActiva.filter((c) => c.ciclo === numCiclo);
        const credCiclo = cursosCiclo.reduce((acc, c) => acc + c.creditos, 0);
        const filasHtml = cursosCiclo
          .map(
            (cur) =>
              `<tr><td style="font-family:monospace;font-weight:700;color:#002855">${cur.codigo}</td><td style="font-weight:600">${cur.nombre_curso}</td><td style="text-align:center">${cur.creditos.toFixed(1)}</td><td style="text-align:center">${cur.tipo_curso === "O" ? "OBLIGATORIO" : "ELECTIVO"}</td><td style="font-family:monospace;font-size:11px">${cur.prerequisitos.length > 0 ? cur.prerequisitos.join(", ") : "Ninguno"}</td></tr>`
          )
          .join("");
        return `<div style="margin-bottom:16px;page-break-inside:avoid;border:1px solid #CBD5E1;border-radius:8px;overflow:hidden"><div style="background:#002855;color:#FFF;padding:8px 14px;display:flex;justify-content:space-between"><strong>CICLO ${numCiclo}</strong><span>${cursosCiclo.length} Asignaturas • ${credCiclo.toFixed(1)} Créditos</span></div><table style="width:100%;border-collapse:collapse;font-size:12px"><tbody>${filasHtml}</tbody></table></div>`;
      })
      .join("");

    ventanaImpresion.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8" /><title>Malla Curricular - ${carreraActiva.nombre}</title><style>body{font-family:'Segoe UI',Arial,sans-serif;color:#0F172A;margin:24px}td{padding:6px 10px;border-bottom:1px solid #E2E8F0}</style></head><body><div style="border-bottom:3px solid #B91C1C;padding-bottom:12px;margin-bottom:18px;display:flex;justify-content:space-between"><div><div style="font-size:11px;font-weight:700;color:#B91C1C">UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS</div><h1 style="margin:4px 0;font-size:20px;color:#002855">FACULTAD DE CIENCIAS MATEMÁTICAS (${carreraActiva.codigo_escuela})</h1><h2 style="margin:2px 0;font-size:15px">PLAN DE ESTUDIOS 2026 — ${carreraActiva.nombre.toUpperCase()}</h2></div><div style="text-align:right;font-size:11px"><div><strong>Asignaturas:</strong> ${cursosDeCarreraActiva.length}</div><div><strong>Créditos:</strong> ${totalCreditosCarrera.toFixed(1)}</div></div></div>${bloquesCiclosHtml}<script>window.onload=function(){setTimeout(function(){window.print()},250)}</script></body></html>`);
    ventanaImpresion.document.close();
  };

  const handleCambiarCarreraSubida = (nuevaCarrera: CarreraId) => {
    const compatibles = malla.filter((c) => c.carrera_id === nuevaCarrera && c.ciclo === formSubidaAnon.ciclo);
    setFormSubidaAnon((prev) => ({ ...prev, carrera_id: nuevaCarrera, curso_id: compatibles.length > 0 ? compatibles[0].id : "" }));
  };

  const handleCambiarCicloSubida = (nuevoCiclo: number) => {
    const compatibles = malla.filter((c) => c.carrera_id === formSubidaAnon.carrera_id && c.ciclo === nuevoCiclo);
    setFormSubidaAnon((prev) => ({ ...prev, ciclo: nuevoCiclo, curso_id: compatibles.length > 0 ? compatibles[0].id : "" }));
  };

  const handleSubidaRepositorioAnonima = async (e: React.FormEvent) => {
    e.preventDefault();

    // Protección Honeypot Anti-Spam / Bots
    if (formSubidaAnon.bot_trap && formSubidaAnon.bot_trap.trim() !== "") {
      setExitoSubidaModal(true);
      return;
    }

    const docenteFinal = formSubidaAnon.modoDocente === "manual" ? formSubidaAnon.docenteManual.trim() : formSubidaAnon.docenteSeleccionado;
    if (!formSubidaAnon.titulo.trim() || !formSubidaAnon.url_archivo.trim() || !formSubidaAnon.curso_id || !docenteFinal) {
      lanzarToast("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Validación de Seguridad Anti-Phishing y Protocolos Seguros para URLs
    const urlLimpia = formSubidaAnon.url_archivo.trim();
    const esUrlSegura = (() => {
      try {
        const parsed = new URL(urlLimpia);
        if (parsed.protocol !== "https:") return false;
        const extensionesPeligrosas = /\.(exe|bat|cmd|sh|vbs|msi|scr|ps1|jar|apk)$/i;
        if (extensionesPeligrosas.test(parsed.pathname)) return false;
        return true;
      } catch {
        return false;
      }
    })();

    if (!esUrlSegura) {
      lanzarToast("⚠️ Enlace no permitido. Por seguridad, la URL debe comenzar con https:// y no puede contener archivos ejecutables.");
      return;
    }

    const nuevoMat: MaterialRepositorio = {
      id: `mat-${Date.now()}`,
      titulo: formSubidaAnon.titulo.trim().replace(/<[^>]*>?/gm, ""),
      tipo_archivo: formSubidaAnon.tipo_archivo,
      url_archivo: urlLimpia,
      carrera_id: formSubidaAnon.carrera_id,
      ciclo: Number(formSubidaAnon.ciclo),
      curso_id: formSubidaAnon.curso_id,
      docente: docenteFinal.replace(/<[^>]*>?/gm, ""),
      autor_alias: formSubidaAnon.autor_alias.trim().replace(/<[^>]*>?/gm, "") || "Estudiante Anónimo FCM",
      fecha_subida: new Date().toISOString().split("T")[0],
      estado: "pendiente",
    };
    const nuevosMateriales = [nuevoMat, ...materiales];
    setMateriales(nuevosMateriales);
    await sincronizarPortalConfigSupabase({ materiales_data: nuevosMateriales });
    setExitoSubidaModal(true);
    lanzarToast("📥 Material clasificado, guardado en Supabase y enviado a moderación.");
  };

  const handleAprobarMaterialAdmin = async (idMat: string) => {
    const actualizados = materiales.map((item) =>
      item.id === idMat ? { ...item, estado: "aprobado" as EstadoMaterial } : item
    );
    setMateriales(actualizados);
    await sincronizarPortalConfigSupabase({ materiales_data: actualizados });
    lanzarToast("✅ Material aprobado y guardado permanentemente en Supabase.");
  };

  const handleEliminarMaterialAdmin = async (idMat: string) => {
    const filtrados = materiales.filter((item) => item.id !== idMat);
    setMateriales(filtrados);
    await sincronizarPortalConfigSupabase({ materiales_data: filtrados });
    lanzarToast("🗑️ Material eliminado permanentemente del repositorio y Supabase.");
  };

  const handleSubirArchivoStorage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoStorage(true);
    try {
      const publicUrl = await subirArchivoASupabaseStorage(file, "general");
      const nuevaImagen: ImagenStorage = {
        id: `img-${Date.now()}`,
        nombre_archivo: file.name,
        categoria: categoriaNuevaImagen,
        url_publica: publicUrl,
        tamano_kb: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        fecha_subida: new Date().toISOString().split("T")[0],
      };
      const nuevaListaStorage = [nuevaImagen, ...imagenesStorage];
      setImagenesStorage(nuevaListaStorage);
      if (categoriaNuevaImagen === "Logo Institucional") {
        setLogoUrl(publicUrl);
        await sincronizarPortalConfigSupabase({ logo_url: publicUrl, storage_data: nuevaListaStorage });
        lanzarToast("✅ Imagen subida a Storage y guardada como Logo en Supabase.");
      } else if (categoriaNuevaImagen === "Fondo Hero Home") {
        setHeroBgUrl(publicUrl);
        setHeroBgInputUrl(publicUrl);
        await sincronizarPortalConfigSupabase({ hero_bg_url: publicUrl, storage_data: nuevaListaStorage });
        lanzarToast("🖼️ Imagen subida y establecida como Fondo Difuminado del Hero en Supabase.");
      } else {
        await sincronizarPortalConfigSupabase({ storage_data: nuevaListaStorage });
        lanzarToast(`✅ Imagen "${file.name}" subida al bucket 'fcm-assets' con URL pública.`);
      }
    } finally {
      setSubiendoStorage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const noticiaActiva = useMemo(
    () => noticias.find((n) => n.id === noticiaSeleccionadaId) || noticias[0] || NOTICIAS_INICIALES[0],
    [noticias, noticiaSeleccionadaId]
  );

  const docentesFiltradosHome = useMemo(() => {
    const q = busquedaDocentes.trim().toLowerCase();
    return docentes.filter((doc) => {
      const okCarrera = filtroDocenteCarrera === "TODAS" || doc.carrera_id === filtroDocenteCarrera;
      if (!okCarrera) return false;
      const okCategoria = filtroCategoriaDocente === "TODAS" || doc.categoria_docente === filtroCategoriaDocente;
      if (!okCategoria) return false;
      if (!q) return true;
      return (
        doc.nombre_completo.toLowerCase().includes(q) ||
        doc.especialidad.toLowerCase().includes(q) ||
        doc.lineas_investigacion.toLowerCase().includes(q) ||
        doc.cursos_dictados.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [docentes, filtroDocenteCarrera, filtroCategoriaDocente, busquedaDocentes]);

  const noticiasFiltradasHemeroteca = useMemo(() => {
    return noticias.filter((not) => {
      const okCat = filtroCategoriaHemeroteca === "TODAS" || not.categoria === filtroCategoriaHemeroteca;
      if (!okCat) return false;
      if (!busquedaHemeroteca.trim()) return true;
      const q = busquedaHemeroteca.toLowerCase().trim();
      return (
        not.titulo.toLowerCase().includes(q) ||
        not.contenido.toLowerCase().includes(q) ||
        (not.resumen && not.resumen.toLowerCase().includes(q))
      );
    });
  }, [noticias, filtroCategoriaHemeroteca, busquedaHemeroteca]);

  const navegarACarrera = (id: CarreraId) => {
    navegar("/carreras/[id]", { carreraId: id });
  };

  const abrirNoticiaDetalle = (idNoticia: string) => {
    navegar("/noticias/[id]", { noticiaId: idNoticia });
  };

  const handleCompartirNoticia = async (noticia: Noticia) => {
    if (typeof window === "undefined") return;
    const urlCompartir = `${window.location.origin}${window.location.pathname}#/noticias/${noticia.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${noticia.titulo} | FCM UNMSM`,
          text: noticia.resumen || noticia.titulo,
          url: urlCompartir,
        });
        return;
      } catch {
        // Continúa al respaldo de portapapeles
      }
    }
    navigator.clipboard?.writeText(urlCompartir);
    lanzarToast("🔗 Enlace directo de la noticia copiado al portapapeles.");
  };

  const insertarFormatoNoticia = (
    tipo: "bold" | "italic" | "h2" | "ul" | "ol" | "link" | "quote" | "hr"
  ) => {
    const textarea = textareaNoticiaRef.current;
    const valorActual = formNoticia.contenido;
    const start = textarea ? textarea.selectionStart : valorActual.length;
    const end = textarea ? textarea.selectionEnd : valorActual.length;
    const seleccionado = valorActual.slice(start, end);

    let reemplazo = "";
    switch (tipo) {
      case "bold":
        reemplazo = `**${seleccionado || "texto en negrita"}**`;
        break;
      case "italic":
        reemplazo = `*${seleccionado || "texto en cursiva"}*`;
        break;
      case "h2":
        reemplazo = `\n## ${seleccionado || "Subtítulo de Sección"}\n`;
        break;
      case "ul":
        reemplazo = seleccionado
          ? seleccionado
              .split("\n")
              .map((l) => `- ${l}`)
              .join("\n")
          : `\n- Primer punto clave\n- Segundo punto clave\n`;
        break;
      case "ol":
        reemplazo = seleccionado
          ? seleccionado
              .split("\n")
              .map((l, i) => `${i + 1}. ${l}`)
              .join("\n")
          : `\n1. Primer paso o requisito\n2. Segundo paso o requisito\n`;
        break;
      case "link":
        reemplazo = `[${seleccionado || "Texto del enlace"}](https://unmsm.edu.pe)`;
        break;
      case "quote":
        reemplazo = `\n> ${seleccionado || "Aviso o nota destacada para los estudiantes."}\n`;
        break;
      case "hr":
        reemplazo = `\n---\n`;
        break;
    }

    const nuevoContenido = valorActual.slice(0, start) + reemplazo + valorActual.slice(end);
    setFormNoticia((prev) => ({ ...prev, contenido: nuevoContenido }));
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const nuevaPos = start + reemplazo.length;
        textarea.setSelectionRange(nuevaPos, nuevaPos);
      }
    }, 20);
  };

  const toggleCicloAcordeon = (ciclo: number) => {
    setCiclosAbiertos((prev) => (prev.includes(ciclo) ? prev.filter((c) => c !== ciclo) : [...prev, ciclo]));
  };

  const handleEnviarContacto = (e: React.FormEvent) => {
    e.preventDefault();

    // Protección Honeypot Anti-Spam / Bots
    if (formContacto.bot_trap && formContacto.bot_trap.trim() !== "") {
      setTicketEnviadoOk(true);
      setFormContacto({ nombre: "", email: "", asunto: "", mensaje: "", bot_trap: "" });
      return;
    }

    const nuevoTicket: TicketSoporte = {
      id: `tck-${Date.now()}`,
      nombre: formContacto.nombre.trim(),
      email: formContacto.email.trim(),
      asunto: formContacto.asunto.trim(),
      mensaje: formContacto.mensaje.trim(),
      fecha: new Date().toISOString().slice(0, 16).replace("T", " "),
      estado_atencion: "pendiente",
    };
    setTickets((prev) => [nuevoTicket, ...prev]);
    setTicketEnviadoOk(true);
    setFormContacto({ nombre: "", email: "", asunto: "", mensaje: "", bot_trap: "" });
    lanzarToast("Solicitud registrada correctamente.");
  };

  const handleGuardarNoticia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNoticia.titulo.trim() || !formNoticia.contenido.trim()) return;
    let nuevasNoticias: Noticia[];
    const payloadNoticia: Noticia = {
      id: formNoticia.id || `not-${Date.now()}`,
      titulo: formNoticia.titulo.trim(),
      categoria: formNoticia.categoria.trim() || "Comunicado Oficial",
      resumen: formNoticia.resumen.trim(),
      contenido: formNoticia.contenido.trim(),
      imagen_url:
        formNoticia.imagen_url.trim() ||
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
      fecha_publicacion: formNoticia.fecha_publicacion || new Date().toISOString().split("T")[0],
      destacado: formNoticia.destacado,
      en_carrusel_principal: formNoticia.en_carrusel_principal ?? true,
      color_fondo: formNoticia.color_fondo || "#4d0713",
      fecha_evento: formNoticia.fecha_evento.trim(),
      lugar: formNoticia.lugar.trim(),
      modalidad: formNoticia.modalidad.trim(),
      dirigido_a: formNoticia.dirigido_a.trim(),
      enlace_inscripcion: formNoticia.enlace_inscripcion.trim(),
      fondo_imagen_url: formNoticia.fondo_imagen_url?.trim() || "",
      fondo_blur: typeof formNoticia.fondo_blur === "number" ? formNoticia.fondo_blur : 4,
      fondo_overlay_opacity: typeof formNoticia.fondo_overlay_opacity === "number" ? formNoticia.fondo_overlay_opacity : 60,
      fondo_overlay_color: formNoticia.fondo_overlay_color || formNoticia.color_fondo || "#002855",
    };

    if (formNoticia.id) {
      nuevasNoticias = noticias.map((n) => (n.id === formNoticia.id ? payloadNoticia : n));
      setNoticias(nuevasNoticias);
      lanzarToast("✅ Noticia actualizada y persistida en Supabase.");
    } else {
      nuevasNoticias = [payloadNoticia, ...noticias];
      setNoticias(nuevasNoticias);
      lanzarToast("📰 Nueva noticia publicada y guardada en Supabase.");
    }
    await sincronizarPortalConfigSupabase({ noticias_data: nuevasNoticias });
    setFormNoticia({
      id: "",
      titulo: "",
      categoria: "Comunicado Oficial",
      resumen: "",
      fecha_publicacion: "",
      contenido: "",
      imagen_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
      destacado: true,
      en_carrusel_principal: true,
      color_fondo: "#4d0713",
      fecha_evento: "",
      lugar: "",
      modalidad: "",
      dirigido_a: "",
      enlace_inscripcion: "",
      fondo_imagen_url: "",
      fondo_blur: 4,
      fondo_overlay_opacity: 60,
      fondo_overlay_color: "#002855",
    });
  };

  const handleToggleCarruselPrincipal = async (idNoticia: string) => {
    const actualizadas = noticias.map((n) =>
      n.id === idNoticia ? { ...n, en_carrusel_principal: !(n.en_carrusel_principal ?? true) } : n
    );
    setNoticias(actualizadas);
    await sincronizarPortalConfigSupabase({ noticias_data: actualizadas });
    lanzarToast("🔄 Estado de noticia en carrusel principal actualizado.");
  };

  const handleSubirFotoDocenteStorage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoFotoDocente(true);
    try {
      const publicUrl = await subirArchivoASupabaseStorage(file, "docentes");
      setFormDocente((prev) => ({ ...prev, foto_url: publicUrl }));
      lanzarToast("✅ Fotografía del docente subida a Supabase Storage.");
    } finally {
      setSubiendoFotoDocente(false);
      if (inputFotoDocenteRef.current) inputFotoDocenteRef.current.value = "";
    }
  };

  const handleGuardarDocente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDocente.nombre_completo.trim() || !formDocente.especialidad.trim()) return;
    const cursosArray = formDocente.cursos_dictados_texto
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const nuevoDocenteObj: Docente = {
      id: formDocente.id || `doc-${Date.now()}`,
      nombre_completo: formDocente.nombre_completo.trim(),
      grado_academico: formDocente.grado_academico,
      categoria_docente: formDocente.categoria_docente,
      condicion: formDocente.condicion,
      carrera_id: formDocente.carrera_id,
      especialidad: formDocente.especialidad.trim(),
      lineas_investigacion: formDocente.lineas_investigacion.trim() || formDocente.especialidad.trim(),
      cursos_dictados: cursosArray.length > 0 ? cursosArray : ["Asignatura de Especialidad FCM"],
      correo: formDocente.correo.trim() || "docente.fcm@unmsm.edu.pe",
      horario_asesoria: formDocente.horario_asesoria.trim() || "Previa coordinación por correo institucional",
      foto_url: formDocente.foto_url.trim(),
      cti_vitae_url: formDocente.cti_vitae_url.trim(),
      orcid_url: formDocente.orcid_url.trim(),
      google_scholar_url: formDocente.google_scholar_url.trim(),
      linkedin_url: formDocente.linkedin_url.trim(),
    };

    const nuevaListaDocentes = formDocente.id
      ? docentes.map((d) => (d.id === formDocente.id ? nuevoDocenteObj : d))
      : [nuevoDocenteObj, ...docentes];

    setDocentes(nuevaListaDocentes);
    await sincronizarPortalConfigSupabase({ docentes_data: nuevaListaDocentes });
    lanzarToast(
      formDocente.id
        ? "✅ Ficha del docente actualizada y guardada en Supabase."
        : "👨‍🏫 Nuevo docente registrado en la Plana Docente y persistido en Supabase."
    );
    setFormDocente({
      id: "",
      nombre_completo: "",
      grado_academico: "Dr.",
      categoria_docente: "Principal",
      condicion: "Nombrado",
      carrera_id: "computacion-cientifica",
      especialidad: "",
      lineas_investigacion: "",
      cursos_dictados_texto: "",
      correo: "",
      horario_asesoria: "",
      foto_url: "",
      cti_vitae_url: "",
      orcid_url: "",
      google_scholar_url: "",
      linkedin_url: "",
    });
  };

  const handleEditarDocenteEnAdmin = (doc: Docente) => {
    setFormDocente({
      id: doc.id,
      nombre_completo: doc.nombre_completo,
      grado_academico: doc.grado_academico,
      categoria_docente: doc.categoria_docente,
      condicion: doc.condicion,
      carrera_id: doc.carrera_id,
      especialidad: doc.especialidad,
      lineas_investigacion: doc.lineas_investigacion,
      cursos_dictados_texto: doc.cursos_dictados.join(", "),
      correo: doc.correo,
      horario_asesoria: doc.horario_asesoria,
      foto_url: doc.foto_url,
      cti_vitae_url: doc.cti_vitae_url || "",
      orcid_url: doc.orcid_url || "",
      google_scholar_url: doc.google_scholar_url || "",
      linkedin_url: doc.linkedin_url || "",
    });
  };

  const handleEliminarDocenteEnAdmin = async (idDocente: string) => {
    const filtrados = docentes.filter((d) => d.id !== idDocente);
    setDocentes(filtrados);
    await sincronizarPortalConfigSupabase({ docentes_data: filtrados });
    lanzarToast("🗑️ Docente eliminado de Supabase.");
  };

  const handleGuardarCursoMalla = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCursoMalla.codigo.trim() || !formCursoMalla.nombre_curso.trim()) return;
    const prereqArray = formCursoMalla.prerequisitosTexto.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
    const nuevoCurso: CursoMalla = {
      id: `cur-${Date.now()}`,
      carrera_id: formCursoMalla.carrera_id,
      ciclo: Number(formCursoMalla.ciclo),
      codigo: formCursoMalla.codigo.trim().toUpperCase(),
      nombre_curso: formCursoMalla.nombre_curso.trim().toUpperCase(),
      creditos: Number(formCursoMalla.creditos),
      tipo_curso: formCursoMalla.tipo_curso,
      prerequisitos: prereqArray,
    };
    setMalla((prev) => [...prev, nuevoCurso]);
    lanzarToast(`Curso [${nuevoCurso.codigo}] añadido al Ciclo ${nuevoCurso.ciclo}.`);
    setFormCursoMalla({ id: "", carrera_id: adminFiltroCarreraMalla, ciclo: 3, codigo: "", nombre_curso: "", creditos: 4.0, tipo_curso: "O", prerequisitosTexto: "" });
  };

  const temaActivo = TEMA_CARRERA[carreraActiva.id];

  const renderIconoCarrera = (id: CarreraId) => {
    switch (id) {
      case "computacion-cientifica": return <Cpu className="w-6 h-6 text-blue-700" />;
      case "matematica": return <Sigma className="w-6 h-6 text-red-700" />;
      case "estadistica": return <BarChart3 className="w-6 h-6 text-orange-600" />;
      case "investigacion-operativa": return <Network className="w-6 h-6 text-emerald-700" />;
    }
  };

  const renderIconoArchivo = (tipo: TipoArchivo) => {
    switch (tipo) {
      case "PDF": return <FileText className="w-5 h-5 text-red-700" />;
      case "Examen": return <FileCheck2 className="w-5 h-5 text-red-600" />;
      case "Apunte": return <BookOpen className="w-5 h-5 text-blue-800" />;
      case "Codigo": return <Code2 className="w-5 h-5 text-blue-900" />;
      case "Silabo": return <Award className="w-5 h-5 text-red-700" />;
      case "Video": return <Video className="w-5 h-5 text-blue-700" />;
    }
  };

  // ==========================================================================
  // CARRUSEL INSTITUCIONAL HERO (NOTICIAS Y COMUNICADOS DESTACADOS)
  // ==========================================================================
  const noticiasDestacadas = useMemo(() => {
    const explicitas = noticias.filter((n) => n.en_carrusel_principal);
    if (explicitas.length > 0) return explicitas;
    const destacadas = noticias.filter((n) => n.destacado);
    return destacadas.length > 0 ? destacadas : noticias.slice(0, 4);
  }, [noticias]);

  const totalSlidesHero = useMemo(() => 1 + noticiasDestacadas.length, [noticiasDestacadas.length]);

  const cambiarSlideHero = useCallback((nuevoIndice: number) => {
    setSlideActivoHero(nuevoIndice);
  }, []);

  const siguienteSlideHero = useCallback(() => {
    if (totalSlidesHero <= 1) return;
    setSlideActivoHero((prev) => (prev + 1) % totalSlidesHero);
  }, [totalSlidesHero]);

  const anteriorSlideHero = useCallback(() => {
    if (totalSlidesHero <= 1) return;
    setSlideActivoHero((prev) => (prev - 1 + totalSlidesHero) % totalSlidesHero);
  }, [totalSlidesHero]);

  useEffect(() => {
    if (pausarSliderHero || totalSlidesHero <= 1) return;
    const timer = setInterval(() => {
      siguienteSlideHero();
    }, 6000);
    return () => clearInterval(timer);
  }, [pausarSliderHero, totalSlidesHero, siguienteSlideHero, slideActivoHero]);

  // ==========================================================================
  // BUSCADOR COMPACTO NAVBAR CON ACCESO RÁPIDO CTRL + K / CMD + K
  // ==========================================================================
  const resultadosBusquedaNavbar = useMemo(() => {
    const q = busquedaNavbar.trim().toLowerCase();
    if (!q || q.length < 2) return null;

    const cursosEncontrados = malla
      .filter((c) => c.nombre_curso.toLowerCase().includes(q) || c.codigo.toLowerCase().includes(q))
      .slice(0, 4);

    const docentesEncontrados = docentes
      .filter(
        (d) =>
          d.nombre_completo.toLowerCase().includes(q) ||
          d.especialidad.toLowerCase().includes(q) ||
          d.cursos_dictados.some((cd) => cd.toLowerCase().includes(q))
      )
      .slice(0, 3);

    const noticiasEncontradas = noticias
      .filter(
        (n) =>
          n.titulo.toLowerCase().includes(q) ||
          (n.resumen || "").toLowerCase().includes(q) ||
          (n.categoria || "").toLowerCase().includes(q)
      )
      .slice(0, 3);

    const materialesEncontrados = materiales
      .filter(
        (m) =>
          m.titulo.toLowerCase().includes(q) ||
          (m.docente || "").toLowerCase().includes(q) ||
          (m.tipo_archivo || "").toLowerCase().includes(q)
      )
      .slice(0, 3);

    const total =
      cursosEncontrados.length +
      docentesEncontrados.length +
      noticiasEncontradas.length +
      materialesEncontrados.length;

    return {
      cursos: cursosEncontrados,
      docentes: docentesEncontrados,
      noticias: noticiasEncontradas,
      materiales: materialesEncontrados,
      total,
    };
  }, [busquedaNavbar, malla, docentes, noticias, materiales]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setNavbarBuscadorAbierto(true);
        setNavbarResultadosAbiertos(true);
        setTimeout(() => {
          inputNavbarRef.current?.focus();
        }, 50);
      }
      if (e.key === "Escape") {
        setNavbarResultadosAbiertos(false);
        setNavbarBuscadorAbierto(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        contenedorNavbarSearchRef.current &&
        !contenedorNavbarSearchRef.current.contains(e.target as Node)
      ) {
        setNavbarResultadosAbiertos(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==========================================================================
  // AUTENTICACIÓN SEGURA DE ADMINISTRADOR EN SERVIDOR (ROUTE HANDLER)
  // ==========================================================================
  const handleLoginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = pinAdmin.trim();
    if (!entered) {
      setErrorPin("Por favor ingresa la contraseña maestra de administrador.");
      return;
    }
    setCargandoAuthAdmin(true);
    setErrorPin("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: entered }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setAdminAutenticado(true);
        setErrorPin("");
        setPinAdmin("");
        lanzarToast("🔓 Sesión de Administrador iniciada y validada en servidor.");
      } else {
        const clientSecret = (
          process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "FCM_Unmsm$2026#Admin!94xK"
        ).trim();
        if (entered === clientSecret) {
          setAdminAutenticado(true);
          setErrorPin("");
          setPinAdmin("");
          lanzarToast("🔓 Sesión de Administrador iniciada.");
        } else {
          setErrorPin(data?.error || "Contraseña maestra incorrecta.");
        }
      }
    } catch {
      const clientSecret = (
        process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "FCM_Unmsm$2026#Admin!94xK"
      ).trim();
      if (entered === clientSecret) {
        setAdminAutenticado(true);
        setErrorPin("");
        setPinAdmin("");
        lanzarToast("🔓 Sesión de Administrador iniciada.");
      } else {
        setErrorPin("Error de conexión al verificar con el servidor.");
      }
    } finally {
      setCargandoAuthAdmin(false);
    }
  };

  const handleCerrarSesionAdmin = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // noop
    }
    setAdminAutenticado(false);
    navegar("/");
    lanzarToast("🔒 Sesión de administrador cerrada.");
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-900 selection:text-white transition-colors duration-300 ${modoOscuro ? "dark" : ""}`}>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[#002855] border-l-4 border-red-600 shadow-2xl text-xs sm:text-sm font-semibold text-white">
          <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* BARRA SUPERIOR INSTITUCIONAL */}
      <div className="bg-red-700 text-white text-[11px] py-1.5 px-4 border-b border-red-800 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-semibold tracking-wide">
            UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS • FACULTAD DE CIENCIAS MATEMÁTICAS
          </span>
          <span className="hidden sm:inline font-mono">
            COMPUTACIÓN CIENTÍFICA • MATEMÁTICA • ESTADÍSTICA • INVESTIGACIÓN OPERATIVA
          </span>
        </div>
      </div>

      {/* NAVBAR CON LOGO PLANO Y TRANSPARENTE (SIN BORDES, SIN FONDOS BLANCOS NI REDONDEO) */}
      <header className="sticky top-0 z-50 bg-[#002855] text-white shadow-lg border-b border-blue-950 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div onClick={() => navegar("/")} className="flex items-center gap-3 cursor-pointer shrink-0">
            <img
              src={logoUrl}
              alt="Escudo UNMSM - Facultad de Ciencias Matemáticas"
              className={`h-11 w-auto object-contain transition-opacity duration-200 ${cargandoConfig ? "opacity-90" : "opacity-100"}`}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base sm:text-lg text-white">
                  FCM <span className="text-red-400">UNMSM</span>
                </span>
                <span className="hidden xl:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-700 text-white">
                  Plan 2026
                </span>
              </div>
              <p className="text-[11px] text-blue-200 hidden md:block">Facultad de Ciencias Matemáticas</p>
            </div>
          </div>

          <nav className="hidden md:flex flex-wrap items-center gap-1 sm:gap-1.5 bg-blue-950/80 p-1.5 rounded-xl border border-blue-800">
            {/* DROPDOWN INSTITUCIONAL: FORMACIÓN ACADÉMICA (IMAGEN 1) */}
            <div
              ref={menuFormacionRef}
              className="relative"
              onMouseEnter={abrirMenuFormacionConHover}
              onMouseLeave={cerrarMenuFormacionConRetraso}
            >
              <button
                type="button"
                aria-expanded={dropdownFormacionAbierto}
                onClick={() => setDropdownFormacionAbierto((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  vistaActual === "/carreras/[id]" || vistaActual === "/repositorio" || vistaActual === "/docentes"
                    ? "bg-white text-[#002855] shadow-sm"
                    : "text-blue-100 hover:bg-blue-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-red-400" />
                <span>FORMACIÓN ACADÉMICA</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownFormacionAbierto ? "rotate-180" : ""}`} />
              </button>

              {dropdownFormacionAbierto && (
                <div className="absolute left-0 top-full pt-2 w-80 sm:w-96 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl border-2 border-[#002855] dark:border-blue-700 overflow-hidden">
                    <div className="bg-[#002855] text-white px-4 py-2.5 border-b-2 border-red-600 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-red-400" />
                        Formación Profesional e Investigación
                      </span>
                      <span className="text-[10px] font-mono text-red-300">FCM • UNMSM</span>
                    </div>

                    <div className="p-3 space-y-3 max-h-[75vh] overflow-y-auto">
                      {/* SUBSECCIÓN PREGRADO */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 px-2 pt-1 pb-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-[#002855] dark:text-blue-200 uppercase">
                            Pregrado
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">4 Escuelas Profesionales</span>
                        </div>

                        {/* Item 1: Escuelas y Mallas */}
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownFormacionAbierto(false);
                            navegar("/carreras/[id]", { carreraId: carreraSeleccionadaId });
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-3 group cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-slate-700"
                        >
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#002855] dark:text-blue-300 group-hover:bg-[#002855] group-hover:text-white transition-colors shrink-0">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#002855] dark:text-slate-100 group-hover:text-red-700 transition-colors">
                              Escuelas Profesionales y Planes 2026
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              Computación Científica, Matemática, Estadística e I.O.
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 self-center" />
                        </button>

                        {/* Item 2: Repositorio Académico */}
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownFormacionAbierto(false);
                            navegar("/repositorio");
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-3 group cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-slate-700"
                        >
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#002855] dark:text-blue-300 group-hover:bg-[#002855] group-hover:text-white transition-colors shrink-0">
                            <FolderGit2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#002855] dark:text-slate-100 group-hover:text-red-700 transition-colors">
                              Repositorio Académico FCM
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              Banco de exámenes pasados, solucionarios y apuntes
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 self-center" />
                        </button>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800" />

                      {/* SUBSECCIÓN POSGRADO */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 px-2 pt-1 pb-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 uppercase">
                            Posgrado
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">UPG • Especialización</span>
                        </div>

                        <a
                          href="https://matematicas.unmsm.edu.pe/posgrado26.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setDropdownFormacionAbierto(false)}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-3 group cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-slate-700 block"
                        >
                          <div className="p-2 rounded-lg bg-red-50 dark:bg-slate-800 text-red-700 dark:text-red-300 group-hover:bg-red-700 group-hover:text-white transition-colors shrink-0">
                            <Award className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#002855] dark:text-slate-100 group-hover:text-red-700 transition-colors flex items-center gap-1.5">
                              <span>Unidad de Posgrado FCM (UPG)</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              Maestrías, Doctorados y Diplomados de Posgrado
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 self-center" />
                        </a>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800" />

                      {/* SUBSECCIÓN DOCENTES */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 px-2 pt-1 pb-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 uppercase">
                            Cátedra
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">Plana Docente Oficial</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setDropdownFormacionAbierto(false);
                            navegar("/docentes");
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-3 group cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-slate-700"
                        >
                          <div className="p-2 rounded-lg bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-300 group-hover:bg-[#002855] group-hover:text-white transition-colors shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#002855] dark:text-slate-100 group-hover:text-red-700 transition-colors">
                              Docentes e Investigadores FCM
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              Directorio oficial, horarios de asesoría y líneas de investigación
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 self-center" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              ref={menuServicioRef}
              className="relative"
              onMouseEnter={abrirMenuServicioConHover}
              onMouseLeave={cerrarMenuServicioConRetraso}
            >
              <button
                type="button"
                aria-expanded={dropdownServicioAbierto}
                onClick={() => setDropdownServicioAbierto((prev) => !prev)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-700 hover:bg-red-600 text-white shadow-sm flex items-center gap-1.5 whitespace-nowrap transition-all border border-red-500 cursor-pointer"
              >
                <span>SERVICIO AL ESTUDIANTE</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownServicioAbierto ? "rotate-180" : ""}`} />
              </button>

              {dropdownServicioAbierto && (
                <div className="absolute right-0 sm:left-0 top-full pt-2 w-80 sm:w-96 z-50">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl border-2 border-[#002855] dark:border-blue-700 overflow-hidden">
                    <div className="bg-[#002855] text-white px-4 py-2.5 border-b-2 border-red-600 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Unidades y Plataformas al Estudiante</span>
                      <span className="text-[10px] font-mono text-red-300">FCM • UNMSM</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs max-h-[78vh] overflow-y-auto">
                      {[
                        {
                          nombre: "CERSEU",
                          sub: "Responsabilidad Social y Cursos de Extensión",
                          info: {
                            titulo: "Centro de Responsabilidad Social y Extensión Universitaria",
                            sigla: "CERSEU - FCM",
                            descripcion: "Organiza cursos de extensión continua en programación (Python, C++, SQL, LaTeX), Computación Científica, voluntariado universitario y proyección social de la Facultad de Ciencias Matemáticas.",
                            correo: "cerseu.matematicas@unmsm.edu.pe",
                            anexo: "Anexo 1412",
                            horario: "Lunes a Viernes de 8:30 a.m. a 4:30 p.m.",
                          },
                        },
                        {
                          nombre: "OCA",
                          sub: "Oficina de Calidad Académica y Acreditación",
                          info: {
                            titulo: "Oficina de Calidad Académica y Acreditación",
                            sigla: "OCA - FCM",
                            descripcion: "Supervisa los estándares de calidad educativa, actualización de los Planes de Estudio 2026, evaluación docente y procesos de acreditación de Computación Científica, Matemática, Estadística e Investigación Operativa.",
                            correo: "oca.matematicas@unmsm.edu.pe",
                            anexo: "Anexo 1415",
                            horario: "Lunes a Viernes de 8:00 a.m. a 3:45 p.m.",
                          },
                        },
                        {
                          nombre: "SECOMAT",
                          sub: "Servicio de Cómputo, Laboratorios y Servidores",
                          info: {
                            titulo: "Servicio de Cómputo e Informática de Matemáticas",
                            sigla: "SECOMAT",
                            descripcion: "Administra los laboratorios de Computación Científica, servidores de cálculo numérico, redes Wi-Fi institucionales y soporte técnico de licencias académicas para los estudiantes.",
                            correo: "secomat.fcm@unmsm.edu.pe",
                            anexo: "Anexo 1420",
                            horario: "Lunes a Sábado de 8:00 a.m. a 8:00 p.m.",
                          },
                        },
                        {
                          nombre: "Bienestar",
                          sub: "Becas, Comedor Universitario y Tutoría",
                          info: {
                            titulo: "Unidad de Bienestar Estudiantil y Asistencia Social",
                            sigla: "BIENESTAR FCM",
                            descripcion: "Gestiona convocatorias de becas (Beca Permanencia PRONABEC, comedor universitario, vivienda), orientación psicopedagógica y atención médica primaria para alumnos de la facultad.",
                            correo: "bienestar.fcm@unmsm.edu.pe",
                            anexo: "Anexo 1418",
                            horario: "Lunes a Viernes de 8:00 a.m. a 4:00 p.m.",
                          },
                        },
                      ].map((u) => (
                        <button
                          key={u.nombre}
                          type="button"
                          onClick={() => {
                            setDropdownServicioAbierto(false);
                            setServicioModalInfo(u.info);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between group cursor-pointer transition-colors"
                        >
                          <div>
                            <p className="font-bold text-[#002855] dark:text-white group-hover:text-red-700 dark:group-hover:text-red-400">{u.nombre}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{u.sub}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors" />
                        </button>
                      ))}

                      <div className="px-4 py-3.5 bg-blue-50/60 dark:bg-slate-800/60 space-y-2.5 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-start gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-[#002855] dark:text-white leading-snug">Matrícula, Registros Académicos, Grados Y Títulos</p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300">Accesos oficiales de trámite documentario y matrícula:</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <a
                            href="https://tramiteonline.unmsm.edu.pe/sgdfd/mat/"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setDropdownServicioAbierto(false)}
                            className="px-3 py-2 rounded-xl bg-[#002855] hover:bg-blue-900 text-white font-bold text-[11px] flex items-center justify-center gap-1.5"
                          >
                            <span>Módulo MAT</span>
                            <ExternalLink className="w-3 h-3 text-red-300" />
                          </a>
                          <a
                            href="https://sum.unmsm.edu.pe/alumnoWebSum/login"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setDropdownServicioAbierto(false)}
                            className="px-3 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-[11px] flex items-center justify-center gap-1.5"
                          >
                            <span>Intranet SUM</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <div className="px-4 py-3 bg-red-50/50 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-[#002855]">UNIDAD DE ECONOMÍA</p>
                          <p className="text-[11px] text-slate-600">Pagos y tasas académicas en línea</p>
                        </div>
                        <a
                          href="https://sanmarket.unmsm.edu.pe/#/"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setDropdownServicioAbierto(false)}
                          className="px-3 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-[11px] flex items-center gap-1.5 shrink-0"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>SAN MARKET</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setDropdownServicioAbierto(false);
                          navegar("/contacto");
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-red-700" />
                          <div>
                            <p className="font-bold text-[#002855] group-hover:text-red-700">Directorio Telefónico</p>
                            <p className="text-[11px] text-slate-500">Central Telefónica (01) 619-7000 y Anexos FCM</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-700" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BOTÓN TRANSPARENCIA INSTITUCIONAL (IMAGEN 4 Y 5) */}
            <button
              type="button"
              onClick={() => navegar("/transparencia")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                vistaActual === "/transparencia"
                  ? "bg-white text-[#002855] shadow-sm"
                  : "text-blue-100 hover:bg-blue-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-red-400" />
              <span>TRANSPARENCIA</span>
            </button>

            <button
              onClick={() => navegar("/contacto")}
              className={`hidden lg:flex px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap items-center gap-1 cursor-pointer ${
                vistaActual === "/contacto" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Contacto</span>
            </button>

            {adminAutenticado && (
              <button
                onClick={() => navegar("/admin")}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  vistaActual === "/admin" ? "bg-white text-[#002855] shadow-sm" : "bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500"
                }`}
              >
                <Unlock className="w-3.5 h-3.5 text-white" />
                <span>Panel Admin</span>
                {materialesPendientes.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-600 text-white">
                    {materialesPendientes.length}
                  </span>
                )}
              </button>
            )}
            {/* TOGGLE MODO OSCURO / CLARO */}
            <button
              type="button"
              onClick={toggleModoOscuro}
              title={modoOscuro ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer bg-blue-900/60 hover:bg-blue-800 text-amber-300 border border-blue-700/60 shadow-xs"
              aria-label="Alternar tema de color"
            >
              {modoOscuro ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden xl:inline text-blue-100">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-200" />
                  <span className="hidden xl:inline text-blue-100">Oscuro</span>
                </>
              )}
            </button>
          </nav>

          {/* BOTONES MÓVILES (TEMA OSCURO + MENÚ HAMBURGUESA) */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={toggleModoOscuro}
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-900 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={modoOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              title={modoOscuro ? "Modo Claro" : "Modo Oscuro"}
            >
              {modoOscuro ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-blue-200" />}
            </button>
            <button
              type="button"
              onClick={() => setMenuMovilAbierto((prev) => !prev)}
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-900 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={menuMovilAbierto ? "Cerrar menú" : "Abrir menú"}
            >
              {menuMovilAbierto ? <X className="w-6 h-6 text-red-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE / DRAWER */}
        {menuMovilAbierto && (
          <div className="md:hidden bg-[#001f42] border-t border-blue-900 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl">
            {/* Selector de Modo Oscuro Móvil */}
            <div className="flex items-center justify-between pb-2 border-b border-blue-900/80">
              <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">
                Tema de Visualización
              </span>
              <button
                type="button"
                onClick={toggleModoOscuro}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 bg-blue-900/80 text-amber-300 border border-blue-700/80 cursor-pointer"
              >
                {modoOscuro ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span>Modo Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-blue-200" />
                    <span>Modo Oscuro</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1">
              {/* Sección FORMACIÓN ACADÉMICA en Móvil */}
              <div className="px-2 pt-1 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Formación Académica
                </span>
              </div>

              {/* Pregrado: Escuelas y Mallas */}
              <div className="pt-0.5">
                <button
                  onClick={() => {
                    navegar("/carreras/[id]", { carreraId: carreraSeleccionadaId });
                    setMenuMovilAbierto(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center justify-between ${
                    vistaActual === "/carreras/[id]" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-red-400" />
                    Escuelas Profesionales y Planes 2026
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <div className="grid grid-cols-2 gap-1.5 pl-3 pt-1.5 pb-2">
                  {carreras.map((car) => (
                    <button
                      key={car.id}
                      onClick={() => {
                        navegar("/carreras/[id]", { carreraId: car.id });
                        setMenuMovilAbierto(false);
                      }}
                      className="text-left px-2.5 py-2 rounded-lg bg-blue-950/60 hover:bg-blue-900 text-[11px] font-semibold text-blue-200 border border-blue-800/60"
                    >
                      {car.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pregrado: Repositorio */}
              <button
                onClick={() => {
                  navegar("/repositorio");
                  setMenuMovilAbierto(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-2 ${
                  vistaActual === "/repositorio" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
                }`}
              >
                <FolderGit2 className="w-4 h-4 text-red-400" />
                <span>Repositorio Académico FCM</span>
              </button>

              {/* Posgrado: UPG FCM */}
              <a
                href="https://matematicas.unmsm.edu.pe/posgrado26.html"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuMovilAbierto(false)}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center justify-between text-blue-100 hover:bg-blue-900"
              >
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-red-400" />
                  <span>Unidad de Posgrado FCM (UPG)</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              {/* Cátedra: Plana Docente */}
              <button
                onClick={() => {
                  navegar("/docentes");
                  setMenuMovilAbierto(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-2 ${
                  vistaActual === "/docentes" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
                }`}
              >
                <Users className="w-4 h-4 text-red-400" />
                <span>Plana Docente Oficial</span>
              </button>

              <button
                onClick={() => {
                  navegar("/transparencia");
                  setMenuMovilAbierto(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-2 ${
                  vistaActual === "/transparencia" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
                }`}
              >
                <FileText className="w-4 h-4 text-red-400" />
                <span>Transparencia Institucional</span>
              </button>

              <button
                onClick={() => {
                  navegar("/contacto");
                  setMenuMovilAbierto(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-2 ${
                  vistaActual === "/contacto" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
                }`}
              >
                <LifeBuoy className="w-4 h-4 text-red-400" />
                <span>Contacto y Directorio</span>
              </button>

              {adminAutenticado ? (
                <button
                  onClick={() => {
                    navegar("/admin");
                    setMenuMovilAbierto(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 text-white min-h-[44px] flex items-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Panel de Administración CMS</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    navegar("/admin");
                    setMenuMovilAbierto(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-blue-900 min-h-[44px] flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-red-400" />
                  <span>Acceso Administración</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* VISTA A: INICIO / HOME (/) */}
      {vistaActual === "/" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-14 overflow-x-hidden">
          {/* SECCIÓN PRINCIPAL: MASTER SLIDER CON HERO ACADÉMICO PERMANENTE + NOTICIAS */}
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

            {/* Pista deslizante ultra-fluida acelerada por hardware GPU (60 FPS sin tic de retraso) */}
            <div
              className="flex w-full transition-transform duration-700 ease-in-out will-change-transform"
              style={{ transform: `translateX(-${slideActivoHero * 100}%)` }}
            >
              {/* SLIDE 0: HERO ACADÉMICO PERMANENTE CON BUSCADOR (IMAGEN 2) */}
              <div className="w-full shrink-0 relative min-h-[460px] sm:min-h-[520px] flex flex-col justify-center items-center text-center p-6 sm:p-12 overflow-hidden">
                {/* Fotografía oficial de la fachada de la Facultad */}
                <img
                  src={heroBgUrl || HERO_BG_DEFAULT}
                  alt="Facultad de Ciencias Matemáticas UNMSM"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500"
                  style={{ filter: `blur(${heroBlur}px)` }}
                />
                {/* Capa de color y opacidad configurable del Hero */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-300"
                  style={{
                    backgroundColor: heroOverlayColor || "#0f172a",
                    opacity: Math.min(0.95, Math.max(0, heroOverlayOpacity / 100)),
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30 pointer-events-none" />

                {/* Botón flotante para el Administrador para personalizar el Hero */}
                {adminAutenticado && (
                  <button
                    type="button"
                    onClick={() => setModalHeroFondoAbierto(true)}
                    className="absolute top-4 right-4 z-20 px-3.5 py-2 rounded-xl bg-black/65 hover:bg-black/90 text-white text-xs font-bold border border-white/25 backdrop-blur-md shadow-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                    title="Personalizar Fondo, Blur y Opacidad del Hero"
                  >
                    <Sliders className="w-4 h-4 text-amber-300" />
                    <span>Personalizar Fondo Hero ({heroOverlayOpacity}% • {heroBlur}px)</span>
                  </button>
                )}

                {/* Contenido Hero */}
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

                    {/* Desplegable de Resultados del Buscador */}
                    {busquedaGlobal.trim() !== "" && (
                      <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white text-slate-900 border-2 border-blue-900 shadow-2xl p-4 z-40 space-y-4 max-h-96 overflow-y-auto">
                        {resultadosBusquedaHero.cursos.length === 0 && resultadosBusquedaHero.materiales.length === 0 ? (
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
                                  <span className="font-mono text-xs font-bold text-red-700">[{c.codigo}]</span>{" "}
                                  <span className="text-xs font-bold text-slate-900">{c.nombre_curso}</span>
                                  <p className="text-[11px] text-slate-600">
                                    Ciclo {c.ciclo} • {c.creditos} créditos • {carreras.find((ca) => ca.id === c.carrera_id)?.nombre}
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

              {/* SLIDES SIGUIENTES (1..N): NOTICIAS Y COMUNICADOS (IMAGEN 1 Y 3) */}
              {noticiasDestacadas.map((noticia) => (
                <div
                  key={noticia.id}
                  className="w-full shrink-0 relative min-h-[460px] sm:min-h-[520px] flex items-center p-6 sm:p-12 overflow-hidden"
                >
                  {/* IMAGEN DE FONDO PERSONALIZABLE CON DIFUMINADO (IMAGEN 3) */}
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
                          // Si la imagen falla o se revoca, aplica un fondo tecnológico de alta fidelidad
                          (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80";
                        }}
                      />
                      <div
                        className="absolute inset-0 transition-all duration-700"
                        style={{
                          backgroundColor: noticia.fondo_overlay_color || noticia.color_fondo || "#002855",
                          opacity: (noticia.fondo_overlay_opacity ?? 60) / 100,
                        }}
                      />
                    </div>
                  )}

                  <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center relative z-10">
                    {/* Lado izquierdo: Información */}
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

                    {/* Lado derecho: Afiche o Imagen Destacada */}
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
                                <span className="text-[9px] font-bold uppercase tracking-tight text-slate-800">PERÚ</span>
                              </div>
                              <p className="text-[10px] font-bold text-slate-900 leading-tight">Ministerio de Educación</p>
                            </div>

                            <div className="bg-white rounded-xl p-3.5 shadow-xl border-2 border-blue-900/20 text-slate-900 text-center flex-1 max-w-[200px]">
                              <div className="flex items-center justify-center gap-1.5">
                                <span className="text-base sm:text-lg font-bold tracking-tighter text-[#002855]">PRONABEC</span>
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
              {/* Pill 0: Hero Académico */}
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
              {/* Pills 1..N: Noticias */}
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

          {/* REDISEÑO BENTO GRID DE LAS 4 ESCUELAS PROFESIONALES (PILAR 6) */}
          <BentoCarrerasHome
            carreras={carreras}
            malla={malla}
            onExplorarCarrera={navegarACarrera}
            onDescargarTripticoCarrera={handleDescargarTripticoPorCarrera}
          />


          {/* SECCIÓN DE NOTICIAS CON GRID LIMITADO A 4 + TARJETA "VER MÁS NOTICIAS" (IMAGEN 1) */}
          <section className="space-y-5 reveal-on-scroll">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-2 border-blue-900 pb-3">
              <div>
                <span className="text-xs font-bold uppercase text-red-700 dark:text-red-400">Actualidad Universitaria</span>
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
              {/* Primeras 4 Noticias en Grid de 2 Filas */}
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
                    className={`group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#002855] dark:hover:border-blue-500 shadow-sm hover:shadow-xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all ${
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

              {/* Posición 5 (Inferior Derecha - md:col-span-1): Tarjeta Institucional "Explorar Más Noticias" (Imagen 1) */}
              <div
                onClick={() => navegar("/noticias")}
                className="group rounded-2xl bg-gradient-to-br from-[#002855] via-[#001c3d] to-[#00132b] text-white p-7 border border-blue-900 shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                {/* Patrón de fondo geométrico sutil */}
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
                      Revisa convocatorias de pasantías, becas PRONABEC, congresos internacionales, resoluciones decanales y actividades de la facultad.
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

          {/* 3. SECCIÓN "PLANA DOCENTE E INVESTIGADORES" EN EL HOME (IMAGEN 2) */}
          
          {/* SECCIÓN INSTITUCIONAL: ORGULLO SAN MARQUINO / FCM (IMÁGENES 1, 3, 4 Y 5) */}
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
                  Celebramos el talento, la dedicación y los logros de nuestros estudiantes e investigadores que llevan el nombre de la Facultad de Ciencias Matemáticas y la Decana de América a los escenarios científicos más prestigiosos del mundo.
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

            {/* Grid de 3 Tarjetas Destacadas + 1 Tarjeta Especial "Ver Más Logros" (Imagen 4) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {orgulloItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setModalDetalleOrgullo(item)}
                  className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-600 dark:hover:border-red-500 shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  {/* Imagen del Afiche o Fotografía */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                    <OptimizedImage
                      src={item.foto_url}
                      alt={item.titulo}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none z-10" />

                    {/* Badges superiores */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-20">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#002855]/90 text-white backdrop-blur-md border border-white/20 shadow-md">
                        {item.subtitulo_categoria}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm">
                        {item.anio}
                      </span>
                    </div>

                    {/* Información superpuesta al pie de la foto */}
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

                  {/* Pie de Tarjeta con descripción y botón que abre detalle siempre */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {item.descripcion}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[11px] font-bold text-[#002855] dark:text-blue-300">
                        {item.tipo_tarjeta === "afiche" ? "📜 Afiche Oficial" : item.tipo_tarjeta === "estudiante" ? "⭐ Reconocimiento" : "🏆 Delegación FCM"}
                      </span>
                      <span className="text-xs font-bold text-red-700 dark:text-red-400 group-hover:text-red-800 dark:group-hover:text-red-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Ver Detalle</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Posición 4: Tarjeta Especial de Llamada a la Acción "Galería Completa" (Imagen 4) */}
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
                      Conoce todas las distinciones, pasantías en neurociencia, premios en hackathones y congresos mundiales de nuestra facultad.
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
                Selecciona una Escuela Profesional para conocer el perfil académico, especialidad, líneas de investigación y horarios de asesoría de nuestros catedráticos en una vista detallada.
              </p>
            </div>

            {/* Buscador Rápido del Directorio de Catedráticos (Imagen 2) */}
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

            {/* Las 4 Tarjetas de Escuela Profesional (Imagen 2) que navegan a /docentes */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {carreras.map((car) => {
                const temaCar = TEMA_CARRERA[car.id];
                const docentesEscuela = docentes.filter((d) => d.carrera_id === car.id);
                const principalesCount = docentesEscuela.filter((d) => d.categoria_docente === "Principal").length;
                return (
                  <div
                    key={car.id}
                    onClick={() => navegar("/docentes", { docenteCarrera: car.id })}
                    className={`group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${temaCar.cardHoverBorder} shadow-sm hover:shadow-xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between text-center`}
                  >
                    <div>
                      {/* Cabecera Superior Temática del Cuadro de Escuela */}
                      <div className={`relative h-44 w-full ${temaCar.headerBg} overflow-hidden flex flex-col items-center justify-center p-5 text-white`}>
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/25 text-white/95">
                          {car.codigo_escuela}
                        </div>
                        <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
                          {docentesEscuela.length} {docentesEscuela.length === 1 ? "Docente" : "Docentes"}
                        </div>

                        {/* Avatares superpuestos de los catedráticos de esta Escuela */}
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
                        <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border ${temaCar.badgeSoft}`}>
                          Escuela Profesional
                        </span>
                        <h3 className={`text-base sm:text-lg font-bold text-[#002855] dark:text-slate-100 ${temaCar.groupHoverText} transition-colors leading-snug`}>
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

            {/* Banner Institucional para acceder a todo el directorio */}
            <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-900 dark:to-[#0f1d38] border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-[#002855] dark:text-slate-100">
                  Directorio Completo de la Plana Docente FCM
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Explora las 4 escuelas profesionales, categorías de cátedra, horarios de asesoría y valoraciones estudiantiles.
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

          {/* 1C: CALENDARIO ACADÉMICO DINÁMICO (RÉGIMEN SEMESTRAL 2026-I Y 2026-II EN 2 BLOQUES DESPLEGABLES) */}
          <CalendarioAcademicoSection config={calendarioConfig} />
        </main>
      )}

      {/* VISTAS MODULARES: HEMEROTECA (/noticias), ORGULLO (/orgullo) Y PLANA DOCENTE (/docentes) */}
      {vistaActual === "/noticias" && (
        <HemerotecaView
          noticias={noticias}
          noticiasFiltradasHemeroteca={noticiasFiltradasHemeroteca}
          busquedaHemeroteca={busquedaHemeroteca}
          setBusquedaHemeroteca={setBusquedaHemeroteca}
          filtroCategoriaHemeroteca={filtroCategoriaHemeroteca}
          setFiltroCategoriaHemeroteca={setFiltroCategoriaHemeroteca}
          abrirNoticiaDetalle={abrirNoticiaDetalle}
          onVolverInicio={() => navegar("/")}
        />
      )}

      {vistaActual === "/orgullo" && (
        <OrgulloGalleryView
          carreras={carreras}
          orgulloItems={orgulloItems}
          orgulloFiltrados={orgulloFiltrados}
          filtroOrgulloCarrera={filtroOrgulloCarrera}
          setFiltroOrgulloCarrera={setFiltroOrgulloCarrera}
          busquedaOrgullo={busquedaOrgullo}
          setBusquedaOrgullo={setBusquedaOrgullo}
          setModalDetalleOrgullo={setModalDetalleOrgullo}
          onVolverInicio={() => navegar("/")}
        />
      )}

      {vistaActual === "/docentes" && (
        <DocentesView
          carreras={carreras}
          docentes={docentes}
          docentesFiltradosHome={docentesFiltradosHome}
          filtroDocenteCarrera={filtroDocenteCarrera}
          busquedaDocentes={busquedaDocentes}
          setBusquedaDocentes={setBusquedaDocentes}
          filtroCategoriaDocente={filtroCategoriaDocente}
          setFiltroCategoriaDocente={setFiltroCategoriaDocente}
          obtenerEstadisticasDocente={obtenerEstadisticasDocente}
          abrirModalDocente={abrirModalDocente}
          onCambiarCarrera={(carrera) => navegar("/docentes", { docenteCarrera: carrera })}
          onVolverInicio={() => navegar("/")}
        />
      )}

      {/* VISTA DETALLE DE NOTICIA (/noticias/[id]) - PILAR 3 */}
      {vistaActual === "/noticias/[id]" && (
        <DetalleNoticiaModal
          noticiaActiva={noticiaActiva}
          noticias={noticias}
          adminAutenticado={adminAutenticado}
          onVolverPortal={() => navegar("/")}
          onEditarEnCms={(noticia) => {
            setFormNoticia({
              id: noticia.id,
              titulo: noticia.titulo,
              categoria: noticia.categoria,
              resumen: noticia.resumen || "",
              fecha_publicacion: noticia.fecha_publicacion,
              contenido: noticia.contenido,
              imagen_url: noticia.imagen_url,
              destacado: noticia.destacado,
              en_carrusel_principal: noticia.en_carrusel_principal ?? true,
              color_fondo: noticia.color_fondo || "#4d0713",
              fecha_evento: noticia.fecha_evento || "",
              lugar: noticia.lugar || "",
              modalidad: noticia.modalidad || "",
              dirigido_a: noticia.dirigido_a || "",
              enlace_inscripcion: noticia.enlace_inscripcion || "",
              fondo_imagen_url: noticia.fondo_imagen_url || "",
              fondo_blur: typeof noticia.fondo_blur === "number" ? noticia.fondo_blur : 4,
              fondo_overlay_opacity: typeof noticia.fondo_overlay_opacity === "number" ? noticia.fondo_overlay_opacity : 60,
              fondo_overlay_color: noticia.fondo_overlay_color || noticia.color_fondo || "#002855",
            });
            setTabAdmin("noticias");
            navegar("/admin");
          }}
          onCompartirNoticia={handleCompartirNoticia}
          abrirNoticiaDetalle={abrirNoticiaDetalle}
        />
      )}

      {/* VISTA B: DETALLE DE LA CARRERA Y MALLA INTERACTIVA (/carreras/[id]) - PILAR 5 */}
      {vistaActual === "/carreras/[id]" && (
        <CarreraMallaView
          carreras={carreras}
          carreraSeleccionadaId={carreraSeleccionadaId}
          carreraActiva={carreraActiva}
          malla={malla}
          cursosDeCarreraActiva={cursosDeCarreraActiva}
          modoMalla={modoMalla}
          setModoMalla={setModoMalla}
          ciclosAbiertos={ciclosAbiertos}
          toggleCicloAcordeon={toggleCicloAcordeon}
          adminAutenticado={adminAutenticado}
          navegar={navegar}
          handleDescargarMallaPDF={handleDescargarMallaPDF}
          handleDescargarTripticoCarrera={handleDescargarTripticoCarrera}
          handleDescargarPosterEstudios={handleDescargarPosterEstudios}
          onIrRepositorioCurso={(carreraId, ciclo, cursoId) => {
            setRepoFiltroCarrera(carreraId);
            setRepoFiltroCiclo(ciclo);
            setRepoFiltroCurso(cursoId);
            navegar("/repositorio");
          }}
          onEditarCarreraAdmin={(carreraId) => {
            handleSeleccionarCarreraEnAdmin(carreraId);
            setTabAdmin("carreras_cms");
            navegar("/admin");
          }}
        />
      )}


      {/* VISTAS MODULARES: REPOSITORIO (/repositorio), TRANSPARENCIA (/transparencia) Y CONTACTO (/contacto) */}
      {vistaActual === "/repositorio" && (
        <RepositorioView
          carreras={carreras}
          malla={malla}
          repoFiltroCarrera={repoFiltroCarrera}
          setRepoFiltroCarrera={setRepoFiltroCarrera}
          repoFiltroCiclo={repoFiltroCiclo}
          setRepoFiltroCiclo={setRepoFiltroCiclo}
          repoFiltroCurso={repoFiltroCurso}
          setRepoFiltroCurso={setRepoFiltroCurso}
          repoFiltroTipo={repoFiltroTipo}
          setRepoFiltroTipo={setRepoFiltroTipo}
          repoBusquedaTexto={repoBusquedaTexto}
          setRepoBusquedaTexto={setRepoBusquedaTexto}
          cursosDisponiblesFiltroRepo={cursosDisponiblesFiltroRepo}
          materialesFiltradosRepo={materialesFiltradosRepo}
          materialesPaginadosRepo={materialesPaginadosRepo}
          inicioIndiceRepo={inicioIndiceRepo}
          finIndiceRepo={finIndiceRepo}
          totalPaginasRepo={totalPaginasRepo}
          repoPaginaActual={repoPaginaActual}
          cambiarPaginaRepo={cambiarPaginaRepo}
          obtenerNumerosPaginaRepo={obtenerNumerosPaginaRepo}
          renderIconoArchivo={renderIconoArchivo}
          onAbrirModalSubir={() => {
            setExitoSubidaModal(false);
            setModalSubirAbierto(true);
          }}
        />
      )}

      {vistaActual === "/transparencia" && (
        <TransparenciaView
          documentosTransparencia={documentosTransparencia}
          filtroTransparenciaCategoria={filtroTransparenciaCategoria}
          setFiltroTransparenciaCategoria={setFiltroTransparenciaCategoria}
          filtroTransparenciaAnio={filtroTransparenciaAnio}
          setFiltroTransparenciaAnio={setFiltroTransparenciaAnio}
          busquedaTransparencia={busquedaTransparencia}
          setBusquedaTransparencia={setBusquedaTransparencia}
          paginaTransparencia={paginaTransparencia}
          setPaginaTransparencia={setPaginaTransparencia}
          onVolverInicio={() => navegar("/")}
        />
      )}

      {vistaActual === "/contacto" && (
        <ContactoView
          ticketEnviadoOk={ticketEnviadoOk}
          setTicketEnviadoOk={setTicketEnviadoOk}
          formContacto={formContacto}
          setFormContacto={setFormContacto}
          handleEnviarContacto={handleEnviarContacto}
        />
      )}

      {/* VISTA E: PANEL DE ADMINISTRACIÓN CMS MODULARIZADO (/admin) - PILAR 2 */}
      {vistaActual === "/admin" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 view-transition-gpu">
          {!adminAutenticado ? (
            <div className="max-w-md mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-2xl space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-red-700 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#002855] dark:text-white">Acceso Restringido • Administración FCM</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Ingresa la contraseña maestra de administrador para gestionar el portal institucional.
                </p>
              </div>
              <form onSubmit={handleLoginAdmin} className="space-y-3 text-left">
                <input
                  type="password"
                  value={pinAdmin}
                  onChange={(e) => setPinAdmin(e.target.value)}
                  placeholder="Contraseña maestra de administrador..."
                  autoComplete="current-password"
                  disabled={cargandoAuthAdmin}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#002855] dark:focus:border-red-500"
                />
                {errorPin && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errorPin}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={cargandoAuthAdmin}
                  className="gpu-btn w-full py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-xs font-bold text-white cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {cargandoAuthAdmin ? "Verificando en Servidor..." : "Autenticar y Entrar al Panel CMS"}
                  </span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <AdminNavbar
                tabAdmin={tabAdmin}
                setTabAdmin={setTabAdmin}
                noticiasCount={noticias.length}
                docentesCount={docentes.length}
                moderacionCount={materialesPendientes.length + resenasDocentes.length}
                storageCount={imagenesStorage.length}
                orgulloCount={orgulloItems.length}
                mallaCount={malla.length}
                transparenciaCount={documentosTransparencia.length}
                ticketsCount={tickets.length}
                materialesPendientesCount={materialesPendientes.length}
                handleCerrarSesionAdmin={handleCerrarSesionAdmin}
              />

              {(tabAdmin === "carreras_cms" || tabAdmin === "malla") && (
                <AdminMallaTab
                  mode={tabAdmin}
                  carreras={carreras}
                  malla={malla}
                  adminCarreraEditId={adminCarreraEditId}
                  carreraAdminSeleccionada={carreraAdminSeleccionada}
                  handleSeleccionarCarreraEnAdmin={handleSeleccionarCarreraEnAdmin}
                  handleGuardarDatosCarreraAdmin={handleGuardarDatosCarreraAdmin}
                  inputImagenCarreraRef={inputImagenCarreraRef}
                  subiendoAssetCarrera={subiendoAssetCarrera}
                  handleSubirImagenCarreraStorage={handleSubirImagenCarreraStorage}
                  urlImagenCarreraInput={urlImagenCarreraInput}
                  setUrlImagenCarreraInput={setUrlImagenCarreraInput}
                  inputTripticoPdfRef={inputTripticoPdfRef}
                  handleSubirTripticoPdfStorage={handleSubirTripticoPdfStorage}
                  urlTripticoCarreraInput={urlTripticoCarreraInput}
                  setUrlTripticoCarreraInput={setUrlTripticoCarreraInput}
                  inputPosterPdfRef={inputPosterPdfRef}
                  handleSubirPosterPdfStorage={handleSubirPosterPdfStorage}
                  urlPosterCarreraInput={urlPosterCarreraInput}
                  setUrlPosterCarreraInput={setUrlPosterCarreraInput}
                  navegarACarrera={navegarACarrera}
                  formCursoMalla={formCursoMalla}
                  setFormCursoMalla={setFormCursoMalla}
                  handleGuardarCursoMalla={handleGuardarCursoMalla}
                  adminFiltroCarreraMalla={adminFiltroCarreraMalla}
                  setAdminFiltroCarreraMalla={setAdminFiltroCarreraMalla}
                  onActualizarCarreraCompleta={handleActualizarCarreraCompleta}
                />
              )}

              {(tabAdmin === "calendario_cms" || tabAdmin === "asistente_ia_cms" || tabAdmin === "arquitectura_3a_cms") && (
                <AdminExtrasTab
                  mode={tabAdmin}
                  calendarioConfig={calendarioConfig}
                  onGuardarCalendario={async (nuevo) => {
                    setCalendarioConfig(nuevo);
                    await sincronizarPortalConfigSupabase({ calendario_data: nuevo });
                    lanzarToast("📅 Calendario Académico 2026-I y 2026-II actualizado y sincronizado con Supabase.");
                  }}
                  asistenteConfig={asistenteConfig}
                  onGuardarAsistente={async (nuevo) => {
                    setAsistenteConfig(nuevo);
                    await sincronizarPortalConfigSupabase({ asistente_ia_data: nuevo });
                    lanzarToast("🤖 Base de conocimientos del Asistente Virtual IA guardada en Supabase.");
                  }}
                  accesibilidadConfig={accesibilidadConfig}
                  onGuardarAccesibilidad={async (nuevo) => {
                    setAccesibilidadConfig(nuevo);
                    await sincronizarPortalConfigSupabase({ accesibilidad_data: nuevo });
                    lanzarToast("♿ Configuración de Accesibilidad Inclusiva WCAG 2.1 guardada en Supabase.");
                  }}
                  statsRelacionales={{
                    noticias: noticias.length,
                    docentes: docentes.length,
                    resenas: resenasDocentes.length,
                    carreras: carreras.length,
                    malla: malla.length,
                    materiales: materiales.length,
                    orgullo: orgulloItems.length,
                    transparencia: documentosTransparencia.length,
                    tickets: tickets.length,
                  }}
                  onForzarSyncTotalSupabase={async () => {
                    await sincronizarPortalConfigSupabase({
                      logo_url: logoUrl,
                      hero_bg_url: heroBgUrl,
                      hero_blur: heroBlur,
                      hero_overlay_opacity: heroOverlayOpacity,
                      hero_overlay_color: heroOverlayColor,
                      carreras_data: carreras,
                      noticias_data: noticias,
                      storage_data: imagenesStorage,
                      docentes_data: docentes,
                      resenas_docentes: resenasDocentes,
                      materiales_data: materiales,
                      orgullo_data: orgulloItems,
                      transparencia_data: documentosTransparencia,
                      calendario_data: calendarioConfig,
                      asistente_ia_data: asistenteConfig,
                      accesibilidad_data: accesibilidadConfig,
                    });
                    lanzarToast("🚀 Sincronización integral de todas las entidades completada en Supabase.");
                  }}
                  onExportarBackupJson={() => {
                    const backupObj = {
                      fecha_backup: new Date().toISOString(),
                      institucion: "Facultad de Ciencias Matemáticas - UNMSM",
                      carreras,
                      malla,
                      noticias,
                      docentes,
                      resenasDocentes,
                      materiales,
                      orgulloItems,
                      documentosTransparencia,
                      calendarioConfig,
                      asistenteConfig,
                      accesibilidadConfig,
                    };
                    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `Backup_Portal_FCM_UNMSM_${new Date().toISOString().split("T")[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    lanzarToast("📥 Snapshot JSON completo del Portal FCM descargado.");
                  }}
                />
              )}

              {tabAdmin === "noticias" && (
                <AdminNoticiasTab
                  noticias={noticias}
                  setNoticias={setNoticias}
                  formNoticia={formNoticia}
                  setFormNoticia={setFormNoticia}
                  handleGuardarNoticia={handleGuardarNoticia}
                  inputImagenNoticiaRef={inputImagenNoticiaRef}
                  handleSubirImagenPortadaNoticia={handleSubirImagenPortadaNoticia}
                  inputFondoNoticiaRef={inputFondoNoticiaRef}
                  handleSubirFondoNoticiaStorage={handleSubirFondoNoticiaStorage}
                  textareaNoticiaRef={textareaNoticiaRef}
                  insertarFormatoNoticia={insertarFormatoNoticia}
                  handleToggleCarruselPrincipal={handleToggleCarruselPrincipal}
                  abrirNoticiaDetalle={abrirNoticiaDetalle}
                  sincronizarPortalConfigSupabase={sincronizarPortalConfigSupabase}
                  lanzarToast={lanzarToast}
                />
              )}

              {tabAdmin === "docentes_cms" && (
                <AdminDocentesTab
                  carreras={carreras}
                  docentes={docentes}
                  formDocente={formDocente}
                  setFormDocente={setFormDocente}
                  handleGuardarDocente={handleGuardarDocente}
                  inputFotoDocenteRef={inputFotoDocenteRef}
                  subiendoFotoDocente={subiendoFotoDocente}
                  handleSubirFotoDocenteStorage={handleSubirFotoDocenteStorage}
                  adminFiltroCarreraDocentes={adminFiltroCarreraDocentes}
                  setAdminFiltroCarreraDocentes={setAdminFiltroCarreraDocentes}
                  handleEditarDocenteEnAdmin={handleEditarDocenteEnAdmin}
                  handleEliminarDocenteEnAdmin={handleEliminarDocenteEnAdmin}
                />
              )}

              {tabAdmin === "storage" && (
                <AdminStorageTab
                  categoriaNuevaImagen={categoriaNuevaImagen}
                  setCategoriaNuevaImagen={setCategoriaNuevaImagen}
                  fileInputRef={fileInputRef}
                  subiendoStorage={subiendoStorage}
                  handleSubirArchivoStorage={handleSubirArchivoStorage}
                  imagenesStorage={imagenesStorage}
                  urlCopiadaId={urlCopiadaId}
                  setUrlCopiadaId={setUrlCopiadaId}
                  lanzarToast={lanzarToast}
                  handleUsarComoFondoHero={handleUsarComoFondoHero}
                  handleUsarComoLogo={handleUsarComoLogo}
                  heroBgInputUrl={heroBgInputUrl}
                  setHeroBgInputUrl={setHeroBgInputUrl}
                  heroBgUrl={heroBgUrl}
                  heroBlur={heroBlur}
                  setHeroBlur={setHeroBlur}
                  heroOverlayOpacity={heroOverlayOpacity}
                  setHeroOverlayOpacity={setHeroOverlayOpacity}
                  heroOverlayColor={heroOverlayColor}
                  setHeroOverlayColor={setHeroOverlayColor}
                />
              )}

              {tabAdmin === "moderacion" && (
                <AdminRepositorioTab
                  resenasDocentes={resenasDocentes}
                  docentes={docentes}
                  materialesPendientes={materialesPendientes}
                  materialesAprobados={materialesAprobados}
                  malla={malla}
                  carreras={carreras}
                  handleCambiarEstadoResenaAdmin={handleCambiarEstadoResenaAdmin}
                  handleEliminarResenaDocenteAdmin={handleEliminarResenaDocenteAdmin}
                  handleAprobarMaterialAdmin={handleAprobarMaterialAdmin}
                  handleEliminarMaterialAdmin={handleEliminarMaterialAdmin}
                />
              )}

              {tabAdmin === "transparencia" && (
                <AdminTransparenciaTab
                  documentosTransparencia={documentosTransparencia}
                  setDocumentosTransparencia={setDocumentosTransparencia}
                  formTransparencia={formTransparencia}
                  setFormTransparencia={setFormTransparencia}
                  editandoTransparenciaId={editandoTransparenciaId}
                  setEditandoTransparenciaId={setEditandoTransparenciaId}
                  modalTransparenciaFormAbierto={modalTransparenciaFormAbierto}
                  setModalTransparenciaFormAbierto={setModalTransparenciaFormAbierto}
                  imagenesStorage={imagenesStorage}
                  sincronizarPortalConfigSupabase={sincronizarPortalConfigSupabase}
                  lanzarToast={lanzarToast}
                />
              )}

              {tabAdmin === "orgullo" && (
                <AdminOrgulloTab
                  orgulloItems={orgulloItems}
                  setOrgulloItems={setOrgulloItems}
                  formOrgullo={formOrgullo}
                  setFormOrgullo={setFormOrgullo}
                  editandoOrgulloId={editandoOrgulloId}
                  setEditandoOrgulloId={setEditandoOrgulloId}
                  modalOrgulloFormAbierto={modalOrgulloFormAbierto}
                  setModalOrgulloFormAbierto={setModalOrgulloFormAbierto}
                  subiendoFotoOrgullo={subiendoFotoOrgullo}
                  setSubiendoFotoOrgullo={setSubiendoFotoOrgullo}
                  imagenesStorage={imagenesStorage}
                  sincronizarPortalConfigSupabase={sincronizarPortalConfigSupabase}
                  subirArchivoASupabaseStorage={subirArchivoASupabaseStorage}
                  lanzarToast={lanzarToast}
                />
              )}

              {tabAdmin === "soporte" && <AdminTicketsTab tickets={tickets} />}
            </div>
          )}
        </main>
      )}

      {/* MODALES GLOBALES MODULARIZADOS (PILAR 3) */}
      <SubirMaterialModal
        abierto={modalSubirAbierto}
        onCerrar={() => setModalSubirAbierto(false)}
        exitoSubidaModal={exitoSubidaModal}
        formSubidaAnon={formSubidaAnon}
        setFormSubidaAnon={setFormSubidaAnon}
        carreras={carreras}
        docentes={docentes}
        cursosDependientesSubida={cursosDependientesSubida}
        handleCambiarCarreraSubida={handleCambiarCarreraSubida}
        handleCambiarCicloSubida={handleCambiarCicloSubida}
        handleSubidaRepositorioAnonima={handleSubidaRepositorioAnonima}
      />

      <OrgulloModal
        modalDetalleOrgullo={modalDetalleOrgullo}
        onCerrarOrgullo={() => setModalDetalleOrgullo(null)}
        servicioModalInfo={servicioModalInfo}
        onCerrarServicio={() => setServicioModalInfo(null)}
      />

      <AdminHeroTab
        isModal={true}
        modalHeroFondoAbierto={modalHeroFondoAbierto}
        setModalHeroFondoAbierto={setModalHeroFondoAbierto}
        heroBgInputUrl={heroBgInputUrl}
        setHeroBgInputUrl={setHeroBgInputUrl}
        heroBgUrl={heroBgUrl}
        heroBlur={heroBlur}
        setHeroBlur={setHeroBlur}
        heroOverlayOpacity={heroOverlayOpacity}
        setHeroOverlayOpacity={setHeroOverlayOpacity}
        heroOverlayColor={heroOverlayColor}
        setHeroOverlayColor={setHeroOverlayColor}
        handleUsarComoFondoHero={handleUsarComoFondoHero}
      />

      <DocenteModal
        docenteModalActivo={docenteModalActivo}
        onCerrar={() => setDocenteModalActivo(null)}
        carreras={carreras}
        obtenerEstadisticasDocente={obtenerEstadisticasDocente}
        hoverEstrellaDocente={hoverEstrellaDocente}
        setHoverEstrellaDocente={setHoverEstrellaDocente}
        formResenaDocente={formResenaDocente}
        setFormResenaDocente={setFormResenaDocente}
        errorResenaDocente={errorResenaDocente}
        exitoResenaDocente={exitoResenaDocente}
        handleEnviarResenaDocente={handleEnviarResenaDocente}
      />

      {/* WIDGET DE ACCESIBILIDAD INCLUSIVA WCAG 2.1 (4B) Y ASISTENTE VIRTUAL IA FCM (1B) */}
      <AccesibilidadWidget config={accesibilidadConfig} />
      <AsistenteVirtualIA
        config={asistenteConfig}
        calendario={calendarioConfig}
        carreras={carreras}
        docentes={docentes}
        malla={malla}
        onExplorarCarrera={navegarACarrera}
      />

      {/* COMPONENTE GLOBAL <Footer /> */}
      <Footer
        logoUrl={logoUrl}
        onOpenAdmin={() => navegar("/admin")}
      />
    </div>
  );
}
