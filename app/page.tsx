"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Search, GraduationCap, BookOpen, Newspaper, FolderGit2, LifeBuoy, Sparkles,
  ChevronRight, ChevronDown, ChevronLeft, Upload, FileText, Code2, Video, FileCheck2, Award,
  CheckCircle2, Trash2, Lock, Unlock, Mail, Building2, Calendar, Filter, Layers,
  Download, AlertCircle, Star, Cpu, Sigma, BarChart3, Network, Printer,
  Image as ImageIcon, Copy, ExternalLink, Phone, UserCheck, ShoppingBag,
  FileSpreadsheet, Check, MapPin, Briefcase, Target, Lightbulb, Edit3,
  ArrowLeft, Share2, Users, Clock, Globe, Bold, Italic, List, ListOrdered,
  Quote, Minus, Link2, Heading2, Menu, X, ShieldCheck, Sliders, createLucideIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Íconos de Redes Sociales con createLucideIcon de lucide-react (compatible con lucide-react v1+)
const Facebook = createLucideIcon("Facebook", [
  ["path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", key: "fb" }],
]);
const Instagram = createLucideIcon("Instagram", [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "ig-rect" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "ig-path" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "ig-line" }],
]);
const Linkedin = createLucideIcon("Linkedin", [
  ["path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z", key: "in-1" }],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "in-2" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "in-3" }],
]);
const Youtube = createLucideIcon("Youtube", [
  ["path", { d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17", key: "yt-1" }],
  ["path", { d: "m10 15 5-3-5-3z", key: "yt-2" }],
]);

type CarreraId = "computacion-cientifica" | "matematica" | "estadistica" | "investigacion-operativa";
type VistaPortal = "/" | "/carreras/[id]" | "/noticias/[id]" | "/repositorio" | "/contacto" | "/admin";
type TipoArchivo = "PDF" | "Examen" | "Apunte" | "Codigo" | "Video" | "Silabo";
type EstadoMaterial = "pendiente" | "aprobado" | "rechazado";
type EstadoAtencion = "pendiente" | "en_proceso" | "resuelto";

interface Noticia {
  id: string;
  titulo: string;
  categoria: string;
  resumen?: string;
  contenido: string;
  imagen_url: string;
  fecha_publicacion: string;
  destacado: boolean;
  en_carrusel_principal?: boolean;
  color_fondo?: string;
  fecha_evento?: string;
  lugar?: string;
  modalidad?: string;
  dirigido_a?: string;
  enlace_inscripcion?: string;
}

interface Docente {
  id: string;
  nombre_completo: string;
  grado_academico: "Dr." | "Dra." | "Mg." | "Lic.";
  categoria_docente: "Principal" | "Asociado" | "Auxiliar";
  condicion: "Nombrado" | "Contratado";
  carrera_id: CarreraId;
  especialidad: string;
  lineas_investigacion: string;
  cursos_dictados: string[];
  correo: string;
  horario_asesoria: string;
  foto_url: string;
  cti_vitae_url?: string;
  orcid_url?: string;
  google_scholar_url?: string;
  linkedin_url?: string;
}

interface ResenaDocente {
  id: string;
  docente_id: string;
  puntuacion: number; // 1 a 5
  comentario: string;
  curso: string;
  autor_alias: string;
  fecha: string;
  estado: "aprobado" | "pendiente";
}

function formatearFechaEspanol(fechaIso: string): string {
  if (!fechaIso) return "Fecha institucional";
  const partes = fechaIso.split("-");
  if (partes.length !== 3) return fechaIso;
  const anio = Number(partes[0]);
  const mes = Number(partes[1]) - 1;
  const dia = Number(partes[2]);
  const fecha = new Date(Date.UTC(anio, mes, dia, 12, 0, 0));
  if (Number.isNaN(fecha.getTime())) return fechaIso;
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${diasSemana[fecha.getUTCDay()]}, ${String(dia).padStart(2, "0")} de ${meses[mes] || ""} de ${anio}`;
}

function obtenerInicialesDocente(nombre: string): string {
  const limpio = nombre.replace(/^(Dr\.|Dra\.|Mg\.|Lic\.)\s*/i, "").trim();
  const partes = limpio.split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "FCM";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
}

// Motor seguro de renderizado inline (**negrita**, *cursiva*, [texto](url) y URLs automáticas)
function renderTextoEnriquecidoLinea(texto: string, keyPrefix: string): React.ReactNode[] {
  const tokenRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s<]+|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const partes = texto.split(tokenRegex);
  return partes.map((parte, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (!parte) return null;
    const matchLinkMd = parte.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (matchLinkMd) {
      return (
        <a
          key={key}
          href={matchLinkMd[2]}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-red-700 hover:text-red-800 font-bold underline decoration-red-400 underline-offset-2 break-all inline-flex items-center gap-1"
        >
          <span>{matchLinkMd[1]}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0" />
        </a>
      );
    }
    if (/^https?:\/\/[^\s<]+$/.test(parte)) {
      const urlLimpia = parte.replace(/[.,;)]+$/, "");
      return (
        <a
          key={key}
          href={urlLimpia}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-red-700 hover:text-red-800 font-bold underline decoration-red-400 underline-offset-2 break-all inline-flex items-center gap-1"
        >
          <span>{urlLimpia}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0" />
        </a>
      );
    }
    if (parte.startsWith("**") && parte.endsWith("**") && parte.length > 4) {
      return (
        <strong key={key} className="font-extrabold text-slate-900">
          {parte.slice(2, -2)}
        </strong>
      );
    }
    if (parte.startsWith("*") && parte.endsWith("*") && parte.length > 2) {
      return (
        <em key={key} className="italic text-slate-800">
          {parte.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={key}>{parte}</React.Fragment>;
  });
}

// Motor seguro de bloques Markdown ligero para noticias (sin dangerouslySetInnerHTML)
function renderizarContenidoNoticia(contenido: string): React.ReactNode {
  if (!contenido || !contenido.trim()) {
    return <p className="text-slate-500 italic">Sin contenido adicional.</p>;
  }
  // Si es una noticia antigua en un solo bloque con viñetas "• ", las separamos para que se lea ordenado
  const textoNormalizado =
    !contenido.includes("\n") && contenido.includes("• ")
      ? contenido.replace(/\s*•\s*/g, "\n- ")
      : contenido;

  const lineas = textoNormalizado.split(/\r?\n/);
  const elementos: React.ReactNode[] = [];
  let listaViñetasActual: string[] = [];
  let listaNumeradaActual: string[] = [];

  const vaciarListas = (keyBase: string) => {
    if (listaViñetasActual.length > 0) {
      elementos.push(
        <ul key={`${keyBase}-ul`} className="list-disc pl-6 space-y-2 text-slate-700 my-3">
          {listaViñetasActual.map((item, i) => (
            <li key={`${keyBase}-ul-${i}`} className="leading-relaxed">
              {renderTextoEnriquecidoLinea(item, `${keyBase}-uli-${i}`)}
            </li>
          ))}
        </ul>
      );
      listaViñetasActual = [];
    }
    if (listaNumeradaActual.length > 0) {
      elementos.push(
        <ol key={`${keyBase}-ol`} className="list-decimal pl-6 space-y-2 text-slate-700 my-3">
          {listaNumeradaActual.map((item, i) => (
            <li key={`${keyBase}-ol-${i}`} className="leading-relaxed">
              {renderTextoEnriquecidoLinea(item, `${keyBase}-oli-${i}`)}
            </li>
          ))}
        </ol>
      );
      listaNumeradaActual = [];
    }
  };

  lineas.forEach((lineaRaw, idx) => {
    const linea = lineaRaw.trim();
    const key = `blk-${idx}`;

    if (!linea) {
      vaciarListas(key);
      return;
    }
    if (linea === "---" || linea === "***") {
      vaciarListas(key);
      elementos.push(<hr key={key} className="my-6 border-slate-200" />);
      return;
    }
    if (linea.startsWith("### ")) {
      vaciarListas(key);
      elementos.push(
        <h4 key={key} className="text-base sm:text-lg font-extrabold text-[#002855] mt-5 mb-2">
          {renderTextoEnriquecidoLinea(linea.slice(4), key)}
        </h4>
      );
      return;
    }
    if (linea.startsWith("## ")) {
      vaciarListas(key);
      elementos.push(
        <h3 key={key} className="text-lg sm:text-xl font-extrabold text-[#002855] mt-6 mb-2.5 border-l-4 border-red-600 pl-3">
          {renderTextoEnriquecidoLinea(linea.slice(3), key)}
        </h3>
      );
      return;
    }
    if (linea.startsWith("> ")) {
      vaciarListas(key);
      elementos.push(
        <blockquote
          key={key}
          className="my-4 border-l-4 border-red-700 bg-blue-50/70 px-4 py-3.5 rounded-r-2xl text-slate-800 text-xs sm:text-sm font-medium leading-relaxed"
        >
          {renderTextoEnriquecidoLinea(linea.slice(2), key)}
        </blockquote>
      );
      return;
    }
    if (linea.startsWith("- ") || linea.startsWith("• ") || linea.startsWith("* ")) {
      if (listaNumeradaActual.length > 0) vaciarListas(key);
      listaViñetasActual.push(linea.slice(2).trim());
      return;
    }
    const matchNum = linea.match(/^\d+\.\s+(.*)$/);
    if (matchNum) {
      if (listaViñetasActual.length > 0) vaciarListas(key);
      listaNumeradaActual.push(matchNum[1].trim());
      return;
    }

    vaciarListas(key);
    elementos.push(
      <p key={key} className="text-slate-700 text-sm sm:text-base leading-relaxed my-3">
        {renderTextoEnriquecidoLinea(linea, key)}
      </p>
    );
  });

  vaciarListas("final");
  return <div className="space-y-1">{elementos}</div>;
}

interface Carrera {
  id: CarreraId;
  codigo_escuela: string;
  nombre: string;
  descripcion: string;
  perfil_egreso: string;
  grado_academico: string;
  titulo_profesional: string;
  vision_carrera: string;
  campo_laboral: string;
  por_que_estudiar: string;
  imagen_referencial_url: string;
  triptico_pdf_url: string;
  triptico_nombre_archivo?: string;
}

interface CursoMalla {
  id: string;
  carrera_id: CarreraId;
  ciclo: number;
  codigo: string;
  nombre_curso: string;
  creditos: number;
  tipo_curso: "O" | "E";
  prerequisitos: string[];
}

interface MaterialRepositorio {
  id: string;
  titulo: string;
  tipo_archivo: TipoArchivo;
  url_archivo: string;
  carrera_id: CarreraId;
  ciclo: number;
  curso_id: string;
  docente: string;
  autor_alias: string;
  fecha_subida: string;
  estado: EstadoMaterial;
}

interface ImagenStorage {
  id: string;
  nombre_archivo: string;
  categoria: "Logo Institucional" | "Banner Noticia" | "Foto Facultad" | "Fondo Hero Home";
  url_publica: string;
  tamano_kb: string;
  fecha_subida: string;
}

interface TicketSoporte {
  id: string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  fecha: string;
  estado_atencion: EstadoAtencion;
}

const LOGO_UNMSM_TRANSPARENTE_DEFAULT =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UNMSM_coatofarms_seal.svg/240px-UNMSM_coatofarms_seal.svg.png";

const HERO_BG_DEFAULT =
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80";

const CARRERAS_INICIALES: Carrera[] = [
  {
    id: "computacion-cientifica",
    codigo_escuela: "E.P. 14.5",
    nombre: "Computación Científica",
    descripcion:
      "Forma profesionales e investigadores en Computación Científica e ingeniería de software con rigurosa base matemática, capaces de diseñar algoritmos de alto rendimiento, sistemas de inteligencia artificial, aprendizaje profundo y computación paralela.",
    perfil_egreso:
      "El egresado de Computación Científica lidera proyectos de desarrollo de software, inteligencia artificial, ciencia de datos, ciberseguridad y simulación numérica de gran escala en centros de investigación e industria tecnológica global.",
    grado_academico: "Bachiller en Computación Científica",
    titulo_profesional: "Licenciado en Computación Científica",
    vision_carrera:
      "Consolidarse como el programa líder en el Perú y referente en Latinoamérica en la intersección entre las Ciencias de la Computación, la Ingeniería de Software Avanzada, el Análisis Numérico y la Inteligencia Artificial.",
    campo_laboral:
      "Arquitecto de Software y Sistemas Distribuidos, Científico de Datos e Ingeniero de Machine Learning / Deep Learning, Especialista en Computación de Alto Rendimiento (HPC), Ciberseguridad e Investigador en laboratorios tecnológicos y banca cuantitativa.",
    por_que_estudiar:
      "Porque el Plan de Estudios 2026 combina la potencia algorítmica y de desarrollo de software moderno con la profundidad matemática que exigen la Inteligencia Artificial, la Visión Computacional y la Computación Cuántica.",
    imagen_referencial_url:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
    triptico_pdf_url: "",
    triptico_nombre_archivo: "Triptico_Oficial_Computacion_Cientifica_2026.pdf",
  },
  {
    id: "matematica",
    codigo_escuela: "E.P. 14.1",
    nombre: "Matemática",
    descripcion:
      "Pilar fundamental de la investigación científica formal en el Perú. Desarrolla el razonamiento deductivo riguroso en análisis funcional, ecuaciones diferenciales parciales, álgebra abstracta, topología y geometría diferencial.",
    perfil_egreso:
      "El matemático sanmarquino está capacitado para formular teorías matemáticas originales, ejercer la docencia universitaria superior y construir modelos determinísticos para física matemática, finanzas y criptografía.",
    grado_academico: "Bachiller en Matemática",
    titulo_profesional: "Licenciado en Matemática",
    vision_carrera:
      "Ser la escuela referente nacional en generación de conocimiento matemático puro y aplicado, impulsando publicaciones indexadas y proyectos interdisciplinarios de impacto global.",
    campo_laboral:
      "Investigador en institutos científicos y universidades internacionales, modelador matemático en finanzas cuantitativas y criptografía, consultor en sistemas dinámicos y docencia universitaria de posgrado.",
    por_que_estudiar:
      "Brinda una formación rigurosa con docentes investigadores de primer nivel en Análisis Funcional, Ecuaciones Diferenciales Parciales, Geometría Riemanniana y Álgebra Moderna.",
    imagen_referencial_url:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80",
    triptico_pdf_url: "",
    triptico_nombre_archivo: "Triptico_Oficial_Matematica_2026.pdf",
  },
  {
    id: "estadistica",
    codigo_escuela: "E.P. 14.2",
    nombre: "Estadística",
    descripcion:
      "Especializada en teoría de la probabilidad, inferencia estadística paramétrica, no paramétrica y bayesiana, muestreo avanzado, diseño de experimentos, análisis de series temporales y aprendizaje estadístico.",
    perfil_egreso:
      "Domina la toma de decisiones bajo incertidumbre, modelado estocástico, bioestadística, econometría, control de calidad industrial y analítica predictiva sobre grandes volúmenes de datos.",
    grado_academico: "Bachiller en Estadística",
    titulo_profesional: "Licenciado en Estadística",
    vision_carrera:
      "Liderar la ciencia de la incertidumbre y la analítica avanzada de datos en el país, formando profesionales capaces de transformar datos complejos en decisiones estratégicas.",
    campo_laboral:
      "Científico de Datos y Analista Predictivo en banca, seguros y retail, Bioestadístico en ensayos clínicos y sector salud, Especialista en Muestreo e Inferencia en organismos públicos y centros de investigación.",
    por_que_estudiar:
      "Integra la teoría probabilística y bayesiana rigurosa con programación intensiva en R, Python y SQL para Big Data y Statistical Learning.",
    imagen_referencial_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    triptico_pdf_url: "",
    triptico_nombre_archivo: "Triptico_Oficial_Estadistica_2026.pdf",
  },
  {
    id: "investigacion-operativa",
    codigo_escuela: "E.P. 14.4",
    nombre: "Investigación Operativa",
    descripcion:
      "Enfocada en la optimización matemática, programación lineal, entera, dinámica y no lineal, teoría de colas, simulación de procesos estocásticos, teoría de juegos y logística cuantitativa para sistemas complejos.",
    perfil_egreso:
      "Diseña y optimiza cadenas de suministro, redes de transporte, planificación energética, carteras financieras y operaciones industriales mediante algoritmos exactos y metaheurísticos.",
    grado_academico: "Bachiller en Investigación Operativa",
    titulo_profesional: "Licenciado en Investigación Operativa",
    vision_carrera:
      "Ser la escuela líder en optimización matemática, analítica prescriptiva y modelado de sistemas complejos para la industria, el transporte, la energía y las finanzas.",
    campo_laboral:
      "Ingeniero de Optimización y Logística Cuantitativa (Supply Chain), Analista de Riesgos y Carteras de Inversión, Especialista en Simulación de Procesos en minería, energía, aerolíneas y banca.",
    por_que_estudiar:
      "Domina herramientas de optimización industrial (Gurobi, AMPL, Pyomo, Simulación Monte Carlo y Metaheurísticas) altamente demandadas por corporaciones globales.",
    imagen_referencial_url:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
    triptico_pdf_url: "",
    triptico_nombre_archivo: "Triptico_Oficial_Investigacion_Operativa_2026.pdf",
  },
];

const DOCENTES_INICIALES: Docente[] = [
  // COMPUTACIÓN CIENTÍFICA (3)
  {
    id: "doc-cc-1",
    nombre_completo: "Herminio Paucar Curasma",
    grado_academico: "Mg.",
    categoria_docente: "Asociado",
    condicion: "Nombrado",
    carrera_id: "computacion-cientifica",
    especialidad: "Computación de Alto Rendimiento (HPC), C++ Moderno y Visión Computacional",
    lineas_investigacion: "Paralelismo en GPU (CUDA/OpenMP), Procesamiento Digital de Imágenes y Algoritmos Paralelos.",
    cursos_dictados: ["CS113 - POO II", "CS3P1 - Computación Paralela", "AI268 - Visión Computacional"],
    correo: "hpaucarc@unmsm.edu.pe",
    horario_asesoria: "Martes y Jueves de 11:00 a.m. a 1:00 p.m. (Lab. SECOMAT)",
    foto_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    cti_vitae_url: "https://ctivitae.concytec.gob.pe/",
    orcid_url: "https://orcid.org/",
    google_scholar_url: "https://scholar.google.com/",
  },
  {
    id: "doc-cc-2",
    nombre_completo: "Carlos Vásquez Alzamora",
    grado_academico: "Dr.",
    categoria_docente: "Principal",
    condicion: "Nombrado",
    carrera_id: "computacion-cientifica",
    especialidad: "Inteligencia Artificial, Deep Learning y Modelado Numérico",
    lineas_investigacion: "Redes Neuronales Informadas por la Física (PINNs), Aprendizaje Profundo y Procesamiento de Lenguaje Natural.",
    cursos_dictados: ["AI263 - Machine Learning", "AI264 - Aprendizaje Profundo", "MA361 - Modelado Matemático"],
    correo: "cvasqueza@unmsm.edu.pe",
    horario_asesoria: "Lunes y Miércoles de 3:00 p.m. a 5:00 p.m. (Oficina 204 FCM)",
    foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    cti_vitae_url: "https://ctivitae.concytec.gob.pe/",
    orcid_url: "https://orcid.org/",
    google_scholar_url: "https://scholar.google.com/",
  },
  {
    id: "doc-cc-3",
    nombre_completo: "Rosa Medina Sandoval",
    grado_academico: "Mg.",
    categoria_docente: "Asociado",
    condicion: "Nombrado",
    carrera_id: "computacion-cientifica",
    especialidad: "Estructuras Discretas, Teoría de Grafos y Algoritmos Avanzados",
    lineas_investigacion: "Complejidad Computacional, Optimización en Grafos, Criptografía Aplicada y Bases de Datos.",
    cursos_dictados: ["CS1D1 - Estructuras Discretas I", "CS210 - Algoritmos y Estructuras de Datos", "CS271 - Bases de Datos I"],
    correo: "rmedinas@unmsm.edu.pe",
    horario_asesoria: "Miércoles y Viernes de 10:00 a.m. a 12:00 m. (Pabellón FCM)",
    foto_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    cti_vitae_url: "https://ctivitae.concytec.gob.pe/",
    orcid_url: "https://orcid.org/",
  },
  // INVESTIGACIÓN OPERATIVA (3)
  {
    id: "doc-io-1",
    nombre_completo: "Víctor Soto Cáceres",
    grado_academico: "Dr.",
    categoria_docente: "Principal",
    condicion: "Nombrado",
    carrera_id: "investigacion-operativa",
    especialidad: "Programación Entera Mixta, Logística Cuantitativa y Ruteo de Vehículos",
    lineas_investigacion: "Optimización Combinatoria, Descomposición de Benders, Supply Chain Analytics y Metaheurísticas.",
    cursos_dictados: ["IO305 - Programación Entera", "IO431 - Logística y VRP", "IO503 - Metaheurísticas"],
    correo: "vsotoc@unmsm.edu.pe",
    horario_asesoria: "Martes y Jueves de 2:00 p.m. a 4:00 p.m. (Escuela de I.O.)",
    foto_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    cti_vitae_url: "https://ctivitae.concytec.gob.pe/",
    orcid_url: "https://orcid.org/",
    google_scholar_url: "https://scholar.google.com/",
  },
  {
    id: "doc-io-2",
    nombre_completo: "Julio Flores Ostos",
    grado_academico: "Dr.",
    categoria_docente: "Principal",
    condicion: "Nombrado",
    carrera_id: "investigacion-operativa",
    especialidad: "Optimización Convexa, Teoría de Juegos y Finanzas Cuantitativas",
    lineas_investigacion: "Métodos de Punto Interior, Equilibrio de Nash, Programación Estocástica y Gestión de Riesgos.",
    cursos_dictados: ["IO322 - Optimización Convexa", "IO425 - Teoría de Juegos", "IO511 - Programación Estocástica"],
    correo: "jfloreso@unmsm.edu.pe",
    horario_asesoria: "Lunes y Viernes de 4:00 p.m. a 6:00 p.m. (Oficina Docentes IO)",
    foto_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    cti_vitae_url: "https://ctivitae.concytec.gob.pe/",
    orcid_url: "https://orcid.org/",
  },
  {
    id: "doc-io-3",
    nombre_completo: "Elena Rojas Huamán",
    grado_academico: "Mg.",
    categoria_docente: "Asociado",
    condicion: "Nombrado",
    carrera_id: "investigacion-operativa",
    especialidad: "Simulación de Eventos Discretos, Teoría de Colas y Sistemas Dinámicos",
    lineas_investigacion: "Simulación Monte Carlo, Optimización de Sistemas Hospitalarios y Transporte Urbano.",
    cursos_dictados: ["IO355 - Teoría de Colas", "IO418 - Simulación de Sistemas", "IO481 - System Dynamics"],
    correo: "erojash@unmsm.edu.pe",
    horario_asesoria: "Miércoles de 9:00 a.m. a 12:00 m. (Lab. Optimización)",
    foto_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    cti_vitae_url: "https://ctivitae.concytec.gob.pe/",
  },
  // MATEMÁTICA (3)
  {
    id: "doc-mat-1",
    nombre_completo: "Eugenio Cabanillas Lapa",
    grado_academico: "Dr.",
    categoria_docente: "Principal",
    condicion: "Nombrado",
    carrera_id: "matematica",
    especialidad: "Ecuaciones Diferenciales Parciales, Análisis Funcional y Control Óptimo",
    lineas_investigacion: "Estabilidad Exponencial de Sistemas Evolutivos, Espacios de Sobolev y Análisis No Lineal.",
    cursos_dictados: ["MAT312 - Análisis Real II", "MAT411 - Análisis Funcional I", "MAT415 - EDP I"],
    correo: "ecabanillasl@unmsm.edu.pe",
    horario_asesoria: "Lunes y Miércoles de 10:00 a.m. a 12:00 m. (Instituto de Investigación Matemática)",
    foto_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    cti_vitae_url: "https://ctivitae.concytec.gob.pe/",
    orcid_url: "https://orcid.org/",
    google_scholar_url: "https://scholar.google.com/",
  },
  {
    id: "doc-mat-2",
    nombre_completo: "Alfonso Pérez Salvatierra",
    grado_academico: "Dr.",
    categoria_docente: "Principal",
    condicion: "Nombrado",
    carrera_id: "matematica",
    especialidad: "Álgebra Conmutativa, Geometría Algebraica y Teoría de Galois",
    lineas_investigacion: "Estructuras Algebraicas, Criptografía en Curvas Elípticas, Teoría de Módulos y Grupos de Lie.",
    cursos_dictados: ["MAT222 - Álgebra Lineal II", "MAT342 - Estructuras Algebraicas II", "MAT441 - Teoría de Galois"],
    correo: "aperezs@unmsm.edu.pe",
    horario_asesoria: "Martes y Jueves de 3:00 p.m. a 5:00 p.m. (Pabellón Matemática)",
    foto_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    cti_vitae_url: "https://ctivitae.concytec.gob.pe/",
    orcid_url: "https://orcid.org/",
  },
  {
    id: "doc-mat-3",
    nombre_completo: "Lucía Mendoza Villavicencio",
    grado_academico: "Dra.",
    categoria_docente: "Asociado",
    condicion: "Nombrado",
    carrera_id: "matematica",
    especialidad: "Geometría Diferencial, Variedades Riemannianas y Topología Algebraica",
    lineas_investigacion: "Flujo de Ricci, Curvatura en Variedades Diferenciables y Sistemas Dinámicos Geométricos.",
    cursos_dictados: ["MAT361 - Topología General", "MAT431 - Geometría Diferencial I", "MAT432 - Geometría Riemanniana"],
    correo: "lmendozav@unmsm.edu.pe",
    horario_asesoria: "Jueves y Viernes de 11:00 a.m. a 1:00 p.m. (Oficina 302 FCM)",
    foto_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    cti_vitae_url: "https://ctivitae.concytec.gob.pe/",
    google_scholar_url: "https://scholar.google.com/",
  },
  // ESTADÍSTICA (3)
  {
    id: "doc-est-1",
    nombre_completo: "María Calvo Gutiérrez",
    grado_academico: "Dra.",
    categoria_docente: "Principal",
    condicion: "Nombrado",
    carrera_id: "estadistica",
    especialidad: "Inferencia Bayesiana, Modelos Lineales Generalizados y Bioestadística",
    lineas_investigacion: "Métodos MCMC, Análisis de Supervivencia, Ensayos Clínicos y Estadística Genómica.",
    cursos_dictados: ["EST318 - Modelos Lineales", "EST371 - GLM", "EST451 - Estadística Bayesiana I"],
    correo: "mcalvog@unmsm.edu.pe",
    horario_asesoria: "Lunes y Miércoles de 11:00 a.m. a 1:00 p.m. (Escuela de Estadística)",
    foto_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
    cti_vitae_url: "https://ctivitae.concytec.gob.pe/",
    orcid_url: "https://orcid.org/",
    google_scholar_url: "https://scholar.google.com/",
  },
  {
    id: "doc-est-2",
    nombre_completo: "Ricardo Paredes Huarcaya",
    grado_academico: "Dr.",
    categoria_docente: "Principal",
    condicion: "Nombrado",
    carrera_id: "estadistica",
    especialidad: "Statistical Learning, Series de Tiempo Financieras y Big Data Analytics",
    lineas_investigacion: "Econometría de Alta Frecuencia, Modelos GARCH Estocásticos y Reducción Dimensional.",
    cursos_dictados: ["EST420 - Análisis Multivariado I", "EST431 - Series de Tiempo I", "EST481 - Statistical Learning"],
    correo: "rparedesh@unmsm.edu.pe",
    horario_asesoria: "Martes y Viernes de 4:00 p.m. a 6:00 p.m. (Lab. Cómputo Estadístico)",
    foto_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    cti_vitae_url: "https://ctivitae.concytec.gob.pe/",
    orcid_url: "https://orcid.org/",
  },
  {
    id: "doc-est-3",
    nombre_completo: "Patricia Quispe Condori",
    grado_academico: "Mg.",
    categoria_docente: "Asociado",
    condicion: "Nombrado",
    carrera_id: "estadistica",
    especialidad: "Teoría del Muestreo Complejo, Diseño de Experimentos y Control de Calidad",
    lineas_investigacion: "Encuestas Nacionales de Hogares, Superficies de Respuesta Industrial y Metodología Seis Sigma.",
    cursos_dictados: ["EST231 - Teoría del Muestreo I", "EST341 - Diseño de Experimentos I", "EST391 - Control de Calidad"],
    correo: "pquispec@unmsm.edu.pe",
    horario_asesoria: "Miércoles y Jueves de 2:00 p.m. a 4:00 p.m. (Pabellón Estadística)",
    foto_url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
    cti_vitae_url: "https://ctivitae.concytec.gob.pe/",
  },
];

const DOCENTES_SUGERIDOS: string[] = DOCENTES_INICIALES.map(
  (d) => `${d.grado_academico} ${d.nombre_completo}`
);

const RESENAS_DOCENTES_INICIALES: ResenaDocente[] = [
  {
    id: "res-1",
    docente_id: "doc-cc-1",
    puntuacion: 5,
    comentario: "Excelente profesor en POO II y Computación Paralela. Sus laboratorios en C++20 y OpenMP te preparan para proyectos reales de alto rendimiento.",
    curso: "CS113 - POO II",
    autor_alias: "Estudiante Base 23 CC",
    fecha: "2026-10-18",
    estado: "aprobado",
  },
  {
    id: "res-2",
    docente_id: "doc-cc-1",
    puntuacion: 5,
    comentario: "Muy didáctico y siempre dispuesto a asesorar en el laboratorio SECOMAT. Sus exámenes son retadores pero justos con lo visto en clase.",
    curso: "CS3P1 - Computación Paralela",
    autor_alias: "Estudiante Anónimo FCM",
    fecha: "2026-10-22",
    estado: "aprobado",
  },
  {
    id: "res-3",
    docente_id: "doc-cc-2",
    puntuacion: 5,
    comentario: "Domina totalmente Deep Learning y el fundamento matemático detrás de cada arquitectura. Recomendado para quienes buscan hacer tesis en IA.",
    curso: "AI264 - Aprendizaje Profundo",
    autor_alias: "Tesista Computación Científica",
    fecha: "2026-10-19",
    estado: "aprobado",
  },
  {
    id: "res-4",
    docente_id: "doc-io-1",
    puntuacion: 5,
    comentario: "Sus clases de Programación Entera y Logística con Gurobi/Pyomo son de nivel industrial. Explica paso a paso el modelado matemático.",
    curso: "IO305 - Programación Entera",
    autor_alias: "Alumno 7mo Ciclo IO",
    fecha: "2026-10-20",
    estado: "aprobado",
  },
  {
    id: "res-5",
    docente_id: "doc-mat-1",
    puntuacion: 5,
    comentario: "Rigor matemático impecable en Análisis Real y Ecuaciones Diferenciales Parciales. Sus apuntes y demostraciones son una joya para toda la carrera.",
    curso: "MAT312 - Análisis Real II",
    autor_alias: "Círculo de Estudios Matemática",
    fecha: "2026-10-21",
    estado: "aprobado",
  },
  {
    id: "res-6",
    docente_id: "doc-est-1",
    puntuacion: 5,
    comentario: "Explica Inferencia Bayesiana y GLM con muchísima claridad y casos aplicados en R. Siempre puntual y ordenada con las evaluaciones.",
    curso: "EST451 - Estadística Bayesiana I",
    autor_alias: "Estudiante Base 22 Estadística",
    fecha: "2026-10-24",
    estado: "aprobado",
  },
  {
    id: "res-pend-1",
    docente_id: "doc-cc-3",
    puntuacion: 4,
    comentario: "Muy buena base en Teoría de Grafos y Estructuras Discretas. Recomiendo repasar inducción matemática y practicar las listas de ejercicios con anticipación.",
    curso: "CS1D1 - Estructuras Discretas I",
    autor_alias: "Estudiante Anónimo FCM",
    fecha: "2026-10-28",
    estado: "pendiente",
  },
];

const PREFIJO_CARRERA: Record<CarreraId, string> = {
  "computacion-cientifica": "cc",
  "matematica": "mat",
  "estadistica": "est",
  "investigacion-operativa": "io",
};

const MALLA_POR_CICLO: Record<CarreraId, string[]> = {
  "computacion-cientifica": [
    "CS111|INTRODUCCIÓN A LA PROGRAMACIÓN|5;MA100|MATEMÁTICA BÁSICA|5;FG140|FUNDAMENTOS DE INVESTIGACIÓN CIENTÍFICA|3;FG109|AMBIENTE Y DESARROLLO SOSTENIBLE|3;FG101|LENGUAJE|2;FG105|GÉNERO Y SOCIEDAD|2;FG112|MÉTODOS DE GESTIÓN PERSONAL UNIVERSITARIA|2",
    "AI161|IA APLICADA|4|O|CS111;CS100|INTRODUCCIÓN A LA CIENCIA DE LA COMPUTACIÓN|3;CS112|PROGRAMACIÓN ORIENTADA A OBJETOS I|4|O|CS111;FI101|FÍSICA GENERAL|5|O|MA111;MA111|CÁLCULO I|5|O|MA100",
    "CS113|PROGRAMACIÓN ORIENTADA A OBJETOS II|3|O|CS112;CS1D1|ESTRUCTURAS DISCRETAS I|4|O|MA100;CS2B1|DESARROLLO BASADO EN PLATAFORMAS|4|O|CS112;ID101|INGLÉS I|3;MA112|CÁLCULO II|4|O|MA111;MA121|ÁLGEBRA LINEAL I|4|O|MA100",
    "CS1D2|ESTRUCTURAS DISCRETAS II|3|O|CS1D1;CS210|ALGORITMOS Y ESTRUCTURAS DE DATOS|4|O|CS113;CS271|BASES DE DATOS I|3|O|CS112,CS1D1;ID102|INGLÉS II|4|O|ID101;MA122|ÁLGEBRA LINEAL II|4|O|MA121;MA210|CÁLCULO III|4|O|MA112",
    "CS251|COMPUTACIÓN GRÁFICA|3|O|CS210;ID201|INGLÉS III|3|O|ID102;MA211|CÁLCULO IV|3|O|MA210,MA121;MA221|ANÁLISIS NUMÉRICO I|3|O|AI161,MA112,MA122;MA222|ANÁLISIS REAL I|5|O|MA112,ID101;MA251|INTRODUCCIÓN A LA ESTADÍSTICA|3|O|AI161;MA281|TEORÍA DE NÚMEROS|2|O|MA100",
    "ID202|INGLÉS IV|3|O|ID201;MA212|ECUACIONES DIFERENCIALES ORDINARIAS|6|O|MA121,MA222,CS112;MA325|ANÁLISIS NUMÉRICO II|4|O|MA221;MA351|ESTADÍSTICA Y PROBABILIDADES|4|O|CS112,MA251;MA371|ANÁLISIS FUNCIONAL I|5|O|MA122,ID201,MA222",
    "CS261|INTELIGENCIA ARTIFICIAL|3|O|MA251;CS3P1|COMPUTACIÓN PARALELA Y DISTRIBUIDA|3|O|CS210;ID203|INGLÉS V|4|O|ID202;MA213|ECUACIONES DIFERENCIALES PARCIALES|4|O|MA212,MA211;MA326|ANÁLISIS NUMÉRICO III|4|O|MA325;MA361|MODELADO MATEMÁTICO|4|O|MA325",
    "AI263|INTRODUCCIÓN AL APRENDIZAJE DE MÁQUINA|4|O|CS261;MA401|PROYECTO DE FINAL DE CARRERA I|3|O|MA371,MA361;CS253|ANÁLISIS EXPLORATORIO DE DATOS|5|E|MA351;CS2S1|SISTEMAS OPERATIVOS|5|E|CS210;CS370|BIG DATA Y ANALÍTICA DE DATOS|5|E|CS271;CS311|SEGURIDAD EN COMPUTACIÓN|5|E|CS210;MA352|PROCESOS ESTOCÁSTICOS|5|E|MA210,CS261,MA351;QC251|MECÁNICA CUÁNTICA|5|E|FI101,MA371",
    "AI264|APRENDIZAJE PROFUNDO|5|O|AI263;MA402|PROYECTO DE FINAL DE CARRERA II|5|O|MA401,ID203;AI262|PROCESAMIENTO DE LENGUAJE NATURAL|4|E|AI263;CS231|REDES Y COMUNICACIÓN|4|E|CS2S1;CS273|ANÁLISIS DE SERIES TEMPORALES|4|E|MA351;MA341|OPTIMIZACIÓN I|4|E|MA221;MA355|TEORÍA DE APRENDIZAJE ESTADÍSTICO|4|E|MA352;MA381|ESTRUCTURAS ALGEBRAICAS|4|E|MA281",
    "AI268|VISIÓN COMPUTACIONAL|5|O|AI264;AI367|TÓPICOS EN INTELIGENCIA ARTIFICIAL|5|O|AI264;CS400|PRÁCTICAS PRE-PROFESIONALES|3;MA403|PROYECTO DE FINAL DE CARRERA III|5|O|MA402;CS254|VISUALIZACIÓN DE DATOS AVANZADA|4|E|CS253;QC381|INTRODUCCIÓN A LA COMPUTACIÓN CUÁNTICA|4|E|MA381,QC251",
  ],
  "matematica": [
    "23EG11|LENGUAJE|2|O;23EG12|MÉTODOS DE GESTIÓN PERSONAL UNIVERSITARIA|2|O;23EG13|FÍSICA GENERAL|5|O;23EG14|CÁLCULO I|5|O;23EG15|MATEMÁTICA BÁSICA|5|O;23EGEB1|INTRODUCCIÓN A LA CIENCIA DE LA COMPUTACIÓN|5|O",
    "23EG21|AMBIENTE Y DESARROLLO SOSTENIBLE|3|O;23EG22|CÁLCULO II|4|O|23EG14 - CÁLCULO I;23EG23|INTRODUCCIÓN A LA ESTADÍSTICA|4|O;23EG24|FUNDAMENTOS DE INVESTIGACIÓN CIENTÍFICA|3|O;23EG25|INGLÉS TÉCNICO|2|O;23EGB2|MATEMÁTICA FINANCIERA|4|O;23EGEB2|COMPLEMENTOS DE MATEMÁTICA|4|O",
    "2314131|ÁLGEBRA LINEAL I|6|O|23EG15 - MATEMÁTICA BÁSICA;2314132|CÁLCULO III|6|O|23EG22 - CÁLCULO II;2314133|METODOLOGÍA DE LA INVESTIGACIÓN|4|O|23EG24 - FUNDAMENTOS DE INVESTIGACIÓN CIENTÍFICA;2314134|TEORÍA DE NÚMEROS|6|O|23EGEB2 - COMPLEMENTOS DE MATEMÁTICA",
    "2314141|ÁLGEBRA LINEAL II|6|O|2314131 - ÁLGEBRA LINEAL I;2314142|ANÁLISIS REAL I|6|O|2314134 - TEORÍA DE NÚMEROS;2314143|CÁLCULO IV|6|O|2314132 - CÁLCULO III;2314144|PROGRAMACIÓN DE COMPUTADORAS|4|O|23EGEB1 - INTRODUCCIÓN A LA CIENCIA DE LA COMPUTACIÓN",
    "2314151|ESTRUCTURAS ALGEBRAICAS I|6|O|2314141 - ÁLGEBRA LINEAL II;2314152|ANÁLISIS REAL II|6|O|2314142 - ANÁLISIS REAL I;2314153|MÉTODOS NUMÉRICOS I|4|O|2314144 - PROGRAMACIÓN DE COMPUTADORAS;2314154|INTRODUCCIÓN A LAS ECUACIONES DIFERENCIALES|6|O|2314143 - CÁLCULO IV",
    "2314161|ESTRUCTURAS ALGEBRAICAS II|6|O|2314151 - ESTRUCTURAS ALGEBRAICAS I;2314162|ANÁLISIS COMPLEJO|6|O|2314152 - ANÁLISIS REAL II;2314163|MÉTODOS NUMÉRICOS II|4|O|2314153 - MÉTODOS NUMÉRICOS I;2314164|FUNDAMENTOS DE LA MATEMÁTICA|6|O|2314142 - ANÁLISIS REAL I",
    "2314171|TEORÍA DE LA MEDIDA E INTEGRACIÓN|6|O|2314162 - ANÁLISIS COMPLEJO;2314172|ECUACIONES DIFERENCIALES ORDINARIAS|6|O|2314154 - INTRODUCCIÓN A LAS ECUACIONES DIFERENCIALES;2314173|GEOMETRÍA DIFERENCIAL|6|O|2314152 - ANÁLISIS REAL II;2314174|ANÁLISIS CONVEXO|5|E;2314175|TEORÍA DE GALOIS|5|E;2314176|DIDÁCTICA DE LA ENSEÑANZA DE LA MATEMÁTICA|5|E",
    "2314181|ANÁLISIS FUNCIONAL|6|O|2314171 - TEORÍA DE LA MEDIDA E INTEGRACIÓN;2314182|ECUACIONES EN DERIVADAS PARCIALES|6|O|2314172 - ECUACIONES DIFERENCIALES ORDINARIAS;2314183|TOPOLOGÍA GENERAL|6|O|2314173 - GEOMETRÍA DIFERENCIAL;2314184|ÁLGEBRA CONMUTATIVA|5|E;2314185|CÁLCULO VARIACIONAL|5|E;2314186|TÓPICOS DE PROGRAMACIÓN MATEMÁTICA|5|E;2314187|EL PROBLEMA DE STURM-LIOUVILLE|5|E;2314188|INTRODUCCIÓN A LOS SISTEMAS DINÁMICOS CAÓTICOS|5|E;2314189|MODELACIÓN MATEMÁTICA|5|E",
    "2314191|TESIS I|6|O;2314192|SEMINARIO DE MATEMÁTICA I|6|O;2314193|MATEMÁTICA COMPUTACIONAL I|4|O|2314163 - MÉTODOS NUMÉRICOS II;23141910|VARIEDADES DIFERENCIABLES|5|E;2314194|ÁLGEBRA HOMOLÓGICA|5|E;2314195|GEOMETRÍA ALGEBRAICA|5|E;2314196|TEORÍA DE DISTRIBUCIONES Y ESPACIOS DE SOBOLEV|5|E;2314197|TÓPICOS DE ECUACIONES DIFERENCIALES|5|E;2314198|TÓPICOS EN TEORÍA DE OPTIMIZACIÓN|5|E;2314199|TOPOLOGÍA ALGEBRAICA|5|E",
    "23141101|TESIS II|6|O|2314191 - TESIS I;23141102|SEMINARIO DE MATEMÁTICA II|6|O|2314192 - SEMINARIO DE MATEMÁTICA I;23141108|TRABAJO DE INVESTIGACIÓN|5|O|2314191 - TESIS I;23141103|ANÁLISIS FUNCIONAL NO LINEAL|5|E;23141104|GEOMETRÍA RIEMANNIANA|5|E;23141105|MATEMÁTICA COMPUTACIONAL II|5|E;23141106|TOPOLOGÍA DIFERENCIAL|5|E;23141107|TÓPICOS DE ANÁLISIS FUNCIONAL|5|E",
  ],
  "estadistica": [
    "23EG14|CÁLCULO I|5|O;23EG11|LENGUAJE|2|O;23EG02|RAZONAMIENTO ESTADÍSTICO I|5|O;23EG13|FÍSICA GENERAL|5|O;23EG15|MATEMÁTICA BÁSICA|5|O;23EG12|MÉTODOS DE GESTIÓN PERSONAL UNIVERSITARIO|2|O",
    "23EG22|CÁLCULO II|4|O|23EG14 - CÁLCULO I;23EG21|AMBIENTE Y DESARROLLO SOSTENIBLE|3|O;23EG23|INTRODUCCIÓN A LA ESTADÍSTICA|4|O;23EG24|FUNDAMENTOS DE INVESTIGACIÓN CIENTÍFICA|3|O;23EG07|RAZONAMIENTO ESTADÍSTICO II|4|O|23EG02 - RAZONAMIENTO ESTADÍSTICO I;23EG25|INGLÉS TÉCNICO|2|O;23EG03|INTRODUCCIÓN A LA PROGRAMACIÓN|4|O",
    "232031|CÁLCULO III|5|O|23EG22 - CÁLCULO II;232032|ÁLGEBRA LINEAL APLICADO A LA ESTADÍSTICA|5|O;232033|PROBABILIDAD I|5|O;232034|MÉTODOS ESTADÍSTICOS|4|O|23EG23 - INTRODUCCIÓN A LA ESTADÍSTICA;232035|ÉTICA Y LIDERAZGO|3|O",
    "232041|ANÁLISIS REAL|5|O|232031 - CÁLCULO III;232042|PROGRAMACIÓN Y MÉTODOS NUMÉRICOS|4|O;232043|PROBABILIDAD II|5|O|232033 - PROBABILIDAD I;232044|PROGRAMACIÓN EN LENGUAJE ESTADÍSTICO|4|O|232032 - ÁLGEBRA LINEAL APLICADO A LA ESTADÍSTICA;232045|FUNDAMENTOS DE ECONOMÍA|3|O;232046|MÉTODO CIENTÍFICO Y REDACCIÓN|2|O",
    "232051|BASE DE DATOS|4|O|232041 - ANÁLISIS REAL;232052|INFERENCIA ESTADÍSTICA PARAMÉTRICA|5|O|232043 - PROBABILIDAD II;232053|DEMOGRAFÍA|4|O|232034 - MÉTODOS ESTADÍSTICOS;232054|FUNDAMENTOS DE FINANZAS|4|O|232045 - FUNDAMENTOS DE ECONOMÍA;232055|FORMULACIÓN Y EVALUACIÓN DE PROYECTOS|4|O|232045 - FUNDAMENTOS DE ECONOMÍA",
    "232061|MODELOS LINEALES|5|O|232052 - INFERENCIA ESTADÍSTICA PARAMÉTRICA;232062|TÉCNICAS DE MUESTREO I|5|O|232052 - INFERENCIA ESTADÍSTICA PARAMÉTRICA;232063|GESTIÓN DE BASES DE DATOS|4|O|232051 - BASE DE DATOS;232064|COMPUTACIÓN ESTADÍSTICA|5|O|232044 - PROGRAMACIÓN EN LENGUAJE ESTADÍSTICO;232065|INFERENCIA ESTADÍSTICA NO PARAMÉTRICA|5|O|232052 - INFERENCIA ESTADÍSTICA PARAMÉTRICA",
    "232071|ANÁLISIS DE REGRESIÓN|5|O|232061 - MODELOS LINEALES;232072|TÉCNICAS DE MUESTREO II|5|O|232062 - TÉCNICAS DE MUESTREO I;232073|INFERENCIA ESTADÍSTICA BAYESIANA|5|O|232065 - INFERENCIA ESTADÍSTICA NO PARAMÉTRICA;232074|DISEÑO Y ANÁLISIS DE EXPERIMENTOS|5|O|232061 - MODELOS LINEALES;232075|PROCESOS ESTOCÁSTICOS|4|O|232043 - PROBABILIDAD II",
    "232081|ANÁLISIS MULTIVARIANTE I|5|O|232071 - ANÁLISIS DE REGRESIÓN;232082|ESTADÍSTICA ESPACIAL|5|O|232075 - PROCESOS ESTOCÁSTICOS;232083|MODELOS DE PRONÓSTICOS|5|O|232075 - PROCESOS ESTOCÁSTICOS;232084|MODELOS DE SOBREVIVENCIA|5|O|232071 - ANÁLISIS DE REGRESIÓN;232085|CÁLCULO ACTUARIAL|4|O|232053 - DEMOGRAFÍA",
    "232091|ANÁLISIS MULTIVARIANTE II|5|O|232081 - ANÁLISIS MULTIVARIANTE I;232092|MINERÍA DE DATOS I|5|O|232081 - ANÁLISIS MULTIVARIANTE I,232063 - GESTIÓN DE BASES DE DATOS;232093|PROYECTO DE TESIS I|4|O|232081 - ANÁLISIS MULTIVARIANTE I,232072 - TÉCNICAS DE MUESTREO II,232083 - MODELOS DE PRONÓSTICOS;232111|INVESTIGACIÓN OPERATIVA|4|E|232052 - INFERENCIA ESTADÍSTICA PARAMÉTRICA;232112|TEORÍA DE RESPUESTA AL ÍTEM|5|E|232071 - ANÁLISIS DE REGRESIÓN;232113|CONTROL DE CALIDAD|4|E|232074 - DISEÑO Y ANÁLISIS DE EXPERIMENTOS;232115|EPIDEMIOLOGÍA|4|E|232033 - PROBABILIDAD I",
    "232101|CONSULTORÍA ESTADÍSTICA|3|O|232091 - ANÁLISIS MULTIVARIANTE II,232084 - MODELOS DE SOBREVIVENCIA,232074 - DISEÑO Y ANÁLISIS DE EXPERIMENTOS;232102|MINERÍA DE DATOS II|5|O|232092 - MINERÍA DE DATOS I;232103|PROYECTO DE TESIS II|4|O|232093 - PROYECTO DE TESIS I;232114|ECONOMETRÍA|4|E|232071 - ANÁLISIS DE REGRESIÓN;232116|ANÁLISIS BAYESIANO|5|E|232073 - INFERENCIA ESTADÍSTICA BAYESIANA;232117|BIG DATA ANALYSIS|5|E|232091 - ANÁLISIS MULTIVARIANTE II",
  ],
  "investigacion-operativa": [
    "23144AO01|LENGUAJE|2|O;23144AO02|MÉTODOS DE GESTIÓN PERSONAL UNIVERSITARIA|2|O;23144AO03|FÍSICA GENERAL|5|O;23144AO04|CÁLCULO I|5|O;23144AO05|MATEMÁTICA BÁSICA|5|O;23144AO06|CURSO DE ESPECIALIDAD BÁSICA: INTRODUCCIÓN A LA INVESTIGACIÓN OPERATIVA|5|O",
    "23144BO01|AMBIENTE Y DESARROLLO SOSTENIBLE|3|O;23144BO02|CÁLCULO II|4|O|23144AO04 - CÁLCULO I;23144BO03|INTRODUCCIÓN A LA ESTADÍSTICA|4|O;23144BO04|FUNDAMENTOS DE INVESTIGACIÓN CIENTÍFICA|3|O;23144BO05|INGLÉS TÉCNICO|2|O;23144BO06|CURSO DE ESPECIALIDAD BÁSICA: INTRODUCCIÓN A LA PROGRAMACIÓN|4|O;23144BO07|CURSO DE ESPECIALIDAD: MATEMÁTICA FINANCIERA|4|O",
    "23144CO01|CÁLCULO III|5|O|23144BO02 - CÁLCULO II;23144CO02|ÁLGEBRA LINEAL|6|O|23144AO05 - MATEMÁTICA BÁSICA;23144CO03|ESTADÍSTICA DESCRIPTIVA|5|O|23144BO03 - INTRODUCCIÓN A LA ESTADÍSTICA;23144CO04|CONTABILIDAD|3|O;23144CO05|MODELOS DETERMINÍSTICOS EN INVESTIGACIÓN OPERATIVA I|5|O|23144AO06 - INTRODUCCIÓN A LA INVESTIGACIÓN OPERATIVA,23144AO04 - CÁLCULO I",
    "23144DO01|PROGRAMACIÓN DE COMPUTADORAS|5|O|23144CO05 - MODELOS DETERMINÍSTICOS EN IO I;23144DO02|CÁLCULO DE PROBABILIDADES|5|O|23144BO02 - CÁLCULO II,23144CO03 - ESTADÍSTICA DESCRIPTIVA;23144DO03|ECONOMÍA Y FINANZAS|4|O|23144CO04 - CONTABILIDAD,23144BO01 - AMBIENTE Y DESARROLLO SOSTENIBLE;23144DO04|ECUACIONES DIFERENCIALES ORDINARIAS|4|O|23144CO01 - CÁLCULO III,23144CO02 - ÁLGEBRA LINEAL;23144DO05|PROGRAMACIÓN LINEAL|6|O|23144CO02 - ÁLGEBRA LINEAL",
    "23144EO01|TEORÍA, ANÁLISIS Y DISEÑO DE SISTEMAS|5|O|23144CO05 - MODELOS DETERMINÍSTICOS EN IO I;23144EO02|MODELOS DETERMINÍSTICOS EN INVESTIGACIÓN OPERATIVA II|5|O|23144CO05 - MODELOS DETERMINÍSTICOS EN IO I,23144DO05 - PROGRAMACIÓN LINEAL;23144EO03|COSTOS Y PRESUPUESTOS|3|O|23144DO03 - ECONOMÍA Y FINANZAS;23144EO04|MÉTODOS NUMÉRICOS|6|O|23144BO02 - CÁLCULO II,23144DO01 - PROGRAMACIÓN DE COMPUTADORAS,23144CO02 - ÁLGEBRA LINEAL;23144EO05|INFERENCIA ESTADÍSTICA|5|O|23144DO02 - CÁLCULO DE PROBABILIDADES",
    "23144FO01|MODELOS PROBABILÍSTICOS EN INVESTIGACIÓN OPERATIVA|6|O|23144CO05 - MODELOS DETERMINÍSTICOS EN IO I,23144DO02 - CÁLCULO DE PROBABILIDADES;23144FO02|TEORÍA DE DECISIONES|5|O|23144EO05 - INFERENCIA ESTADÍSTICA;23144FO03|GESTIÓN DE SISTEMAS ORGANIZACIONALES|4|O|23144EO01 - TEORÍA, ANÁLISIS Y DISEÑO DE SISTEMAS;23144FO04|MODELOS ECONOMÉTRICOS|5|O|23144EO05 - INFERENCIA ESTADÍSTICA,23144EO03 - COSTOS Y PRESUPUESTOS;23144FO05|BASE DE DATOS|3|O|23144DO01 - PROGRAMACIÓN DE COMPUTADORAS",
    "23144GO01|PROCESOS ESTOCÁSTICOS|6|O|23144DO02 - CÁLCULO DE PROBABILIDADES,23144DO04 - ECUACIONES DIFERENCIALES ORDINARIAS;23144GO02|TEORÍA DE GRAFOS Y PROGRAMACIÓN ENTERA|6|O|23144DO05 - PROGRAMACIÓN LINEAL;23144GO03|FORMULACIÓN Y GESTIÓN DE PROYECTOS|3|O|23144EO03 - COSTOS Y PRESUPUESTOS,23144FO03 - GESTIÓN DE SISTEMAS ORGANIZACIONALES;23144GO04|SEMINARIO DE INVESTIGACIÓN I|3|O|23144EO02 - MODELOS DETERMINÍSTICOS EN IO II;23144GO05|MINERÍA DE DATOS|3|O|23144FO05 - BASE DE DATOS;23144ZE06|LOGÍSTICA Y CADENA DE SUMINISTRO|3|E|23144CO05 - MODELOS DETERMINÍSTICOS EN IO I;23144ZE04|MODELOS DE TRANSPORTE|3|E|23144EO02 - MODELOS DETERMINÍSTICOS EN IO II",
    "23144HO01|HEURÍSTICAS Y METAHEURÍSTICAS|6|O|23144GO02 - TEORÍA DE GRAFOS Y PROGRAMACIÓN ENTERA,23144FO05 - BASE DE DATOS;23144HO02|SIMULACIÓN DE SISTEMAS|6|O|23144GO01 - PROCESOS ESTOCÁSTICOS,23144EO05 - INFERENCIA ESTADÍSTICA,23144FO01 - MODELOS PROBABILÍSTICOS EN IO;23144HO03|PROGRAMACIÓN NO LINEAL Y DINÁMICA|6|O|23144EO04 - MÉTODOS NUMÉRICOS,23144CO01 - CÁLCULO III,23144DO05 - PROGRAMACIÓN LINEAL;23144HO04|SEMINARIO DE INVESTIGACIÓN II|3|O|23144GO04 - SEMINARIO DE INVESTIGACIÓN I;23144HO05|PROGRAMACIÓN EN DISPOSITIVOS MÓVILES ORIENTADOS A LA IO|3|O|23144GO05 - MINERÍA DE DATOS;23144ZE01|GESTIÓN DE LA CALIDAD|3|E|23144FO03 - GESTIÓN DE SISTEMAS ORGANIZACIONALES;23144ZE07|MODELOS PARA LAS FINANZAS|3|E|23144EO03 - COSTOS Y PRESUPUESTOS",
    "23144IO01|SEMINARIO DE TESIS DE INVESTIGACIÓN OPERATIVA|6|O|23144FO02 - TEORÍA DE DECISIONES,23144HO01 - HEURÍSTICAS Y METAHEURÍSTICAS,23144HO03 - PROGRAMACIÓN NO LINEAL,23144HO02 - SIMULACIÓN DE SISTEMAS,23144HO04 - SEMINARIO DE INVESTIGACIÓN II;23144IO02|ESTUDIO DE CASOS DE INVESTIGACIÓN OPERATIVA|3|O|23144HO03 - PROGRAMACIÓN NO LINEAL,23144HO01 - HEURÍSTICAS Y METAHEURÍSTICAS,23144FO02 - TEORÍA DE DECISIONES;23144IO03|SERIES CRONOLÓGICAS|4|O|23144FO04 - MODELOS ECONOMÉTRICOS;23144IO04|INTELIGENCIA ARTIFICIAL|5|O|23144HO01 - HEURÍSTICAS Y METAHEURÍSTICAS,23144GO05 - MINERÍA DE DATOS;23144ZE02|INDICADORES DE GESTIÓN|3|E|23144ZE01 - GESTIÓN DE LA CALIDAD;23144ZE03|TÉCNICAS DE MEJORAMIENTO DE LA CALIDAD|3|E|23144ZE01 - GESTIÓN DE LA CALIDAD;23144ZE05|REDES DE OPTIMIZACIÓN|3|E|23144HO01 - HEURÍSTICAS Y METAHEURÍSTICAS;23144ZE08|ANÁLISIS DE RIESGOS FINANCIEROS|3|E|23144ZE07 - MODELOS PARA LAS FINANZAS",
    "23144JO01|ANALÍTICA DE NEGOCIOS|5|O|23144HO02 - SIMULACIÓN DE SISTEMAS,23144IO04 - INTELIGENCIA ARTIFICIAL;23144JO02|TRABAJO DE INVESTIGACIÓN|6|O|23144IO01 - SEMINARIO DE TESIS DE INVESTIGACIÓN OPERATIVA;23144JO03|PRÁCTICA PRE-PROFESIONAL|3|O|23144GO03 - FORMULACIÓN Y GESTIÓN DE PROYECTOS;23144ZE09|GESTIÓN DE PROYECTOS FINANCIEROS|3|E|23144ZE08 - ANÁLISIS DE RIESGOS FINANCIEROS",
  ],
};

const MALLA_INICIAL: CursoMalla[] = (Object.entries(MALLA_POR_CICLO) as [CarreraId, string[]][]).flatMap(
  ([carrera_id, ciclos]) =>
    ciclos.flatMap((bloqueCiclo, idxCiclo) =>
      bloqueCiclo.split(";").map((item, idxCurso) => {
        const [codigo, nombre_curso, creditos, tipo_curso, prereqStr] = item.split("|");
        return {
          id: `${PREFIJO_CARRERA[carrera_id]}-${idxCiclo + 1}0${idxCurso + 1}`,
          carrera_id,
          ciclo: idxCiclo + 1,
          codigo,
          nombre_curso,
          creditos: Number(creditos),
          tipo_curso: (tipo_curso as "O" | "E") || "O",
          prerequisitos: prereqStr ? prereqStr.split(",") : [],
        };
      })
    )
);

const NOTICIAS_INICIALES: Noticia[] = [
  {
    id: "not-pronabec-2026",
    titulo: "DS Nº 017-2026-MINEDU que modifica el Reglamento de la Ley Nº 29837 (Ley del PRONABEC)",
    categoria: "Comunicado Oficial • PRONABEC",
    resumen:
      "Se informa a los estudiantes beneficiarios y postulantes de la Facultad sobre las disposiciones complementarias actualizadas para la permanencia y renovación de becas de pregrado.",
    contenido:
      "## DS Nº 017-2026-MINEDU: Modificaciones al Reglamento de la Ley Nº 29837\nEl Ministerio de Educación publica el Decreto Supremo que actualiza las disposiciones complementarias aplicables a las becas de pregrado otorgadas por el **PRONABEC** (Beca 18, Beca Permanencia y Beca Continuidad) para estudiantes de universidades públicas licenciadas.\n\n> Se informa a la comunidad universitaria de la Facultad de Ciencias Matemáticas sobre los nuevos plazos y procedimientos administrativos vigentes.\n\n### Puntos Clave para Estudiantes FCM\n- **Acreditación Académica:** Se simplifica el envío de fichas de matrícula y constancias de notas oficiales emitidas a través del SUM.\n- **Plazos de Renovación:** Validación semestral asistida con la Unidad de Bienestar Estudiantil de la FCM.\n- **Atención Presencial y Virtual:** Asesoría personalizada en el Pabellón FCM (Anexo 1418).\n\nPara revisar el texto íntegro del Decreto Supremo y realizar consultas directas con el equipo de Bienestar, consulta el enlace oficial de PRONABEC o escribe a bienestar.fcm@unmsm.edu.pe",
    imagen_url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1000&q=80",
    fecha_publicacion: "2026-10-28",
    destacado: true,
    en_carrusel_principal: true,
    color_fondo: "#4d0713",
    fecha_evento: "Semestre 2026-I / 2026-II",
    lugar: "Ciudad Universitaria UNMSM - Bienestar FCM",
    modalidad: "Atención Presencial y Virtual",
    dirigido_a: "Estudiantes beneficiarios y postulantes a becas",
    enlace_inscripcion: "https://www.gob.pe/pronabec",
  },
  {
    id: "not-1",
    titulo: "Implementación Oficial del Plan de Estudios 2026 en Computación Científica, Matemática, Estadística e I.O.",
    categoria: "Académico • Plan 2026",
    resumen:
      "La Facultad de Ciencias Matemáticas publica las mallas curriculares completas de los 10 ciclos académicos con asignaturas actualizadas en IA, Computación Científica, Análisis Funcional y Optimización Estocástica.",
    contenido:
      "## Modernización Curricular Plan 2026\nLa Facultad de Ciencias Matemáticas de la **Universidad Nacional Mayor de San Marcos** pone a disposición de la comunidad estudiantil y docente las mallas curriculares oficiales correspondientes al **Plan de Estudios 2026** para sus cuatro Escuelas Profesionales.\n\n> Todos los sílabos, tablas de equivalencia y cronogramas de matrícula están sincronizados con el Sistema Único de Matrícula (SUM).\n\n### Ejes Estratégicos por Escuela\n- **Computación Científica:** Énfasis en Inteligencia Artificial, Aprendizaje Profundo, Visión Computacional y Computación Paralela en GPU.\n- **Investigación Operativa:** Optimización Entera Mixta, Logística Cuantitativa (VRP), Simulación Monte Carlo y Analítica Prescriptiva.\n- **Matemática:** Análisis Funcional, Ecuaciones Diferenciales Parciales, Geometría Riemanniana y Álgebra Conmutativa.\n- **Estadística:** Inferencia Bayesiana, Modelos Lineales Generalizados (GLM), Series de Tiempo y Statistical Learning.\n\n---\nPara revisar el detalle de asignaturas y descargar el tríptico oficial de cada carrera, visita la sección de Escuelas y Mallas del portal o consulta en https://sum.unmsm.edu.pe/alumnoWebSum/login",
    imagen_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    fecha_publicacion: "2026-10-15",
    destacado: true,
    en_carrusel_principal: true,
    color_fondo: "#002855",
    fecha_evento: "Semestre Académico 2026-I / 2026-II",
    lugar: "Ciudad Universitaria UNMSM - Pabellón FCM",
    modalidad: "Presencial",
    dirigido_a: "Estudiantes de Pregrado de las 4 Escuelas Profesionales",
    enlace_inscripcion: "https://sum.unmsm.edu.pe/alumnoWebSum/login",
  },
  {
    id: "not-2",
    titulo: "Convocatoria Internacional: Pasantías de Investigación en Computación Científica y Matemática Aplicada 2026-2027",
    categoria: "Becas e Investigación",
    resumen:
      "Estudiantes del quinto y décimo superior de las 4 escuelas profesionales pueden postular a estancias de investigación y becas integrales de excelencia académica.",
    contenido:
      "## Programa de Movilidad Estudiantil e Investigación\nSe invita a los estudiantes destacados de **Computación Científica, Matemática, Estadística e Investigación Operativa** a participar en la convocatoria de pasantías internacionales de investigación 2026-2027.\n\n### Requisitos de Postulación\n1. Pertenecer al quinto o décimo superior de su Escuela Profesional.\n2. Haber culminado satisfactoriamente al menos el 6.º ciclo académico.\n3. Contar con carta de aval de un docente investigador de la FCM.\n\n> Las becas cubren pasajes aéreos, estipendio mensual de alojamiento y acceso a laboratorios de supercomputación en universidades asociadas de Europa, Brasil y Estados Unidos.",
    imagen_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
    fecha_publicacion: "2026-10-20",
    destacado: true,
    en_carrusel_principal: true,
    color_fondo: "#0f172a",
    fecha_evento: "Cierre de postulaciones: 30 de noviembre de 2026",
    lugar: "Vicedecanato de Investigación y Posgrado FCM",
    modalidad: "Híbrida (Evaluación virtual / Pasantía presencial)",
    dirigido_a: "Estudiantes de 6.º a 10.º ciclo (Quinto y Décimo Superior)",
    enlace_inscripcion: "https://tramiteonline.unmsm.edu.pe/sgdfd/mat/",
  },
  {
    id: "not-3",
    titulo: "Apertura del Clúster de Computación Científica y GPU para Proyectos de Fin de Carrera",
    categoria: "Infraestructura FCM",
    resumen:
      "Acceso habilitado mediante SECOMAT para alumnos de los ciclos 7 al 10 en simulaciones numéricas, entrenamiento de modelos de Deep Learning y optimización a gran escala.",
    contenido:
      "## Nuevo Clúster de Alto Rendimiento SECOMAT - FCM\nEl **Servicio de Cómputo e Informática de Matemáticas (SECOMAT)** anuncia la habilitación de nodos equipados con aceleradores GPU para apoyar el desarrollo de tesis y Proyectos de Final de Carrera.\n\n### Software y Entornos Preinstalados\n- Compiladores C++20, OpenMP, MPI y CUDA Toolkit para Computación Paralela.\n- Entornos Python con PyTorch, TensorFlow, JAX y Scikit-Learn.\n- Solvers académicos Gurobi, AMPL, Pyomo y RStudio Server.\n\nPara solicitar tu cuenta de acceso remoto vía SSH, comunícate con **secomat.fcm@unmsm.edu.pe** indicando tu código de matrícula y el nombre de tu asesor.",
    imagen_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    fecha_publicacion: "2026-10-25",
    destacado: true,
    en_carrusel_principal: true,
    color_fondo: "#064e3b",
    fecha_evento: "Habilitado de Lunes a Sábado (Acceso SSH 24/7)",
    lugar: "Laboratorios SECOMAT - 2.º Piso FCM",
    modalidad: "Presencial y Acceso Remoto SSH",
    dirigido_a: "Tesistas y estudiantes de los ciclos 7 al 10",
  },
];

const MATERIALES_INICIALES: MaterialRepositorio[] = [
  { id: "mat-1", titulo: "Solucionario Examen Parcial POO II (C++20, Templates, STL y Smart Pointers)", tipo_archivo: "Examen", url_archivo: "https://github.com/unmsm-fcm/cs113-poo2-parcial", carrera_id: "computacion-cientifica", ciclo: 3, curso_id: "cc-301", docente: "Mg. Herminio Paucar Curasma", autor_alias: "Comité Académico CC", fecha_subida: "2026-10-14", estado: "aprobado" },
  { id: "mat-2", titulo: "Compendio de Estructuras Discretas I en LaTeX: Lógica, Inducción y Grafos", tipo_archivo: "Apunte", url_archivo: "https://drive.google.com/file/d/cs1d1-discretas-apuntes", carrera_id: "computacion-cientifica", ciclo: 3, curso_id: "cc-302", docente: "Mg. Rosa Medina Sandoval", autor_alias: "Admin FCM", fecha_subida: "2026-10-16", estado: "aprobado" },
  { id: "mat-3", titulo: "Problemas Resueltos de Análisis Real II (Medida de Lebesgue y Convergencia)", tipo_archivo: "PDF", url_archivo: "https://drive.google.com/file/d/mat312-analisis-real", carrera_id: "matematica", ciclo: 5, curso_id: "mat-502", docente: "Dr. Eugenio Cabanillas Lapa", autor_alias: "Seminario Análisis UNMSM", fecha_subida: "2026-10-18", estado: "aprobado" },
  { id: "mat-4", titulo: "Scripts en R y Python para Inferencia Estadística Paramétrica y Modelos Lineales", tipo_archivo: "Codigo", url_archivo: "https://github.com/unmsm-fcm/est318-modelos-lineales", carrera_id: "estadistica", ciclo: 6, curso_id: "est-601", docente: "Dra. María Calvo Gutiérrez", autor_alias: "Laboratorio Estadística", fecha_subida: "2026-10-19", estado: "aprobado" },
  { id: "mat-5", titulo: "Guía Práctica de Programación Entera y Ruteo de Vehículos con Gurobi / Pyomo", tipo_archivo: "Codigo", url_archivo: "https://github.com/unmsm-fcm/io305-entera", carrera_id: "investigacion-operativa", ciclo: 7, curso_id: "io-702", docente: "Dr. Víctor Soto Cáceres", autor_alias: "Círculo IO San Marcos", fecha_subida: "2026-10-21", estado: "aprobado" },
];

const IMAGENES_STORAGE_INICIALES: ImagenStorage[] = [
  { id: "img-1", nombre_archivo: "estudiantes-computacion-cientifica.jpg", categoria: "Foto Facultad", url_publica: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80", tamano_kb: "340 KB", fecha_subida: "2026-10-15" },
  { id: "img-2", nombre_archivo: "cluster-computacion-cientifica.jpg", categoria: "Banner Noticia", url_publica: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80", tamano_kb: "412 KB", fecha_subida: "2026-10-24" },
];

const TICKETS_INICIALES: TicketSoporte[] = [
  { id: "tck-1", nombre: "Carlos Mendoza Quispe", email: "carlos.mendoza@unmsm.edu.pe", asunto: "Consulta sobre convalidación al Plan de Estudios 2026 (Computación Científica)", mensaje: "Solicito información sobre la tabla de equivalencias automáticas en el SUM para los cursos de tercer ciclo del Plan 2026 de Computación Científica.", fecha: "2026-10-27 10:15", estado_atencion: "pendiente" },
];

export default function PortalFacultadCienciasMatematicas() {
  const [vistaActual, setVistaActual] = useState<VistaPortal>("/");
  const [carreraSeleccionadaId, setCarreraSeleccionadaId] = useState<CarreraId>("computacion-cientifica");
  const [noticiaSeleccionadaId, setNoticiaSeleccionadaId] = useState<string>(NOTICIAS_INICIALES[0].id);

  const [noticias, setNoticias] = useState<Noticia[]>(NOTICIAS_INICIALES);
  const [carreras, setCarreras] = useState<Carrera[]>(CARRERAS_INICIALES);
  const [docentes, setDocentes] = useState<Docente[]>(DOCENTES_INICIALES);
  const [resenasDocentes, setResenasDocentes] = useState<ResenaDocente[]>(RESENAS_DOCENTES_INICIALES);
  const [malla, setMalla] = useState<CursoMalla[]>(MALLA_INICIAL);
  const [materiales, setMateriales] = useState<MaterialRepositorio[]>(MATERIALES_INICIALES);
  const [tickets, setTickets] = useState<TicketSoporte[]>(TICKETS_INICIALES);
  const [imagenesStorage, setImagenesStorage] = useState<ImagenStorage[]>(IMAGENES_STORAGE_INICIALES);
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
  const [tabAdmin, setTabAdmin] = useState<
    "dashboard" | "carreras_cms" | "noticias" | "docentes_cms" | "malla" | "moderacion" | "storage" | "soporte"
  >("dashboard");

  const [adminCarreraEditId, setAdminCarreraEditId] = useState<CarreraId>("computacion-cientifica");
  const carreraAdminSeleccionada = useMemo(
    () => carreras.find((c) => c.id === adminCarreraEditId) || CARRERAS_INICIALES[0],
    [carreras, adminCarreraEditId]
  );
  const [urlImagenCarreraInput, setUrlImagenCarreraInput] = useState(CARRERAS_INICIALES[0].imagen_referencial_url);
  const [urlTripticoCarreraInput, setUrlTripticoCarreraInput] = useState(CARRERAS_INICIALES[0].triptico_pdf_url);
  const [subiendoAssetCarrera, setSubiendoAssetCarrera] = useState(false);
  const inputImagenCarreraRef = useRef<HTMLInputElement | null>(null);
  const inputTripticoPdfRef = useRef<HTMLInputElement | null>(null);

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
  });
  const inputImagenNoticiaRef = useRef<HTMLInputElement | null>(null);
  const textareaNoticiaRef = useRef<HTMLTextAreaElement | null>(null);

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
    if (hash.startsWith("/docentes/")) {
      const idCar = hash.replace("/docentes/", "").trim();
      const carrerasValidas: CarreraId[] = ["computacion-cientifica", "matematica", "estadistica", "investigacion-operativa"];
      if (idCar === "TODAS" || carrerasValidas.includes(idCar as CarreraId)) {
        setFiltroDocenteCarrera(idCar as "TODAS" | CarreraId);
      }
      setVistaActual("/");
      return;
    }
    if (hash === "/repositorio") {
      setVistaActual("/repositorio");
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
        } else if (nuevaVista === "/contacto") {
          nuevoHash = "#/contacto";
        } else if (nuevaVista === "/admin") {
          nuevoHash = "#/admin";
        } else if (nuevaVista === "/" && params?.docenteCarrera) {
          nuevoHash = `#/docentes/${params.docenteCarrera}`;
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
    if (window.location.hash) {
      aplicarHashAEstado(window.location.hash);
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
            if (Array.isArray(parsed) && parsed.length > 0) setCarreras(parsed);
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
            setCarreras(data.carreras_data);
            const inicial = data.carreras_data.find((c: Carrera) => c.id === "computacion-cientifica") || data.carreras_data[0];
            if (inicial) {
              setUrlImagenCarreraInput(inicial.imagen_referencial_url);
              setUrlTripticoCarreraInput(inicial.triptico_pdf_url);
            }
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_carreras_data", JSON.stringify(data.carreras_data));
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
          if (Array.isArray(data.materiales_data) && data.materiales_data.length > 0) {
            const limpios = data.materiales_data.filter((m: MaterialRepositorio) => m.id !== "mat-pend-1" && m.id !== "mat-pend-2");
            setMateriales(limpios);
            if (typeof window !== "undefined") window.localStorage.setItem("fcm_materiales_data", JSON.stringify(limpios));
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
  }): Promise<boolean> => {
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
        const { hero_blur, hero_overlay_opacity, hero_overlay_color, ...resto } = cambios;
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuServicioRef.current && !menuServicioRef.current.contains(event.target as Node)) {
        setDropdownServicioAbierto(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDropdownServicioAbierto(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (timeoutServicioRef.current) clearTimeout(timeoutServicioRef.current);
    };
  }, []);

  const handleSeleccionarCarreraEnAdmin = (id: CarreraId) => {
    setAdminCarreraEditId(id);
    const encontrada = carreras.find((c) => c.id === id);
    if (encontrada) {
      setUrlImagenCarreraInput(encontrada.imagen_referencial_url);
      setUrlTripticoCarreraInput(encontrada.triptico_pdf_url);
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

  const subirArchivoASupabaseStorage = async (file: File, carpeta: string): Promise<string> => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      const safeName = `${carpeta}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const uploadEndpoint = `${supabaseUrl}/storage/v1/object/fcm-assets/${safeName}`;
      try {
        const res = await fetch(uploadEndpoint, {
          method: "POST",
          headers: { Authorization: `Bearer ${supabaseAnonKey}`, apikey: supabaseAnonKey, "x-upsert": "true" },
          body: file,
        });
        if (res.ok) return `${supabaseUrl}/storage/v1/object/public/fcm-assets/${safeName}`;
      } catch {
        // Fallback local
      }
    }
    return URL.createObjectURL(file);
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

  const handleGuardarDatosCarreraAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevasCarreras = carreras.map((c) =>
      c.id === adminCarreraEditId
        ? { ...c, imagen_referencial_url: urlImagenCarreraInput.trim() || c.imagen_referencial_url, triptico_pdf_url: urlTripticoCarreraInput.trim() }
        : c
    );
    setCarreras(nuevasCarreras);
    await sincronizarPortalConfigSupabase({ carreras_data: nuevasCarreras });
    lanzarToast(`✅ Recursos multimedia de ${carreraAdminSeleccionada.nombre} guardados en Supabase.`);
  };

  const handleSubirImagenPortadaNoticia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const publicUrl = await subirArchivoASupabaseStorage(file, "noticias");
    setFormNoticia((prev) => ({ ...prev, imagen_url: publicUrl }));
    lanzarToast("✅ Imagen de portada cargada en el formulario de la noticia.");
    if (inputImagenNoticiaRef.current) inputImagenNoticiaRef.current.value = "";
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
      if (!q) return true;
      return (
        doc.nombre_completo.toLowerCase().includes(q) ||
        doc.especialidad.toLowerCase().includes(q) ||
        doc.lineas_investigacion.toLowerCase().includes(q) ||
        doc.cursos_dictados.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [docentes, filtroDocenteCarrera, busquedaDocentes]);

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

  const TEMA_CARRERA: Record<
    CarreraId,
    {
      headerBg: string;
      borderAccent: string;
      cardHoverBorder: string;
      badgeSolid: string;
      badgeSoft: string;
      iconWrap: string;
      textAccent: string;
      groupHoverText: string;
      tabActive: string;
      tabPillActive: string;
      cycleBtn: string;
      cyclePill: string;
    }
  > = {
    "computacion-cientifica": {
      headerBg: "bg-gradient-to-r from-[#002855] via-blue-900 to-blue-700",
      borderAccent: "border-blue-400",
      cardHoverBorder: "hover:border-blue-700",
      badgeSolid: "bg-blue-700 hover:bg-blue-600 text-white border-blue-500",
      badgeSoft: "bg-blue-50 text-blue-800 border-blue-200",
      iconWrap: "bg-blue-50 border-blue-200 text-blue-700",
      textAccent: "text-blue-700",
      groupHoverText: "group-hover:text-blue-700",
      tabActive: "bg-[#002855] text-white shadow-md border-b-2 border-blue-400",
      tabPillActive: "bg-blue-600 text-white",
      cycleBtn: "bg-[#002855] hover:bg-blue-900",
      cyclePill: "bg-blue-600 text-white",
    },
    "investigacion-operativa": {
      headerBg: "bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700",
      borderAccent: "border-emerald-400",
      cardHoverBorder: "hover:border-emerald-700",
      badgeSolid: "bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500",
      badgeSoft: "bg-emerald-50 text-emerald-800 border-emerald-200",
      iconWrap: "bg-emerald-50 border-emerald-200 text-emerald-700",
      textAccent: "text-emerald-700",
      groupHoverText: "group-hover:text-emerald-700",
      tabActive: "bg-emerald-800 text-white shadow-md border-b-2 border-emerald-400",
      tabPillActive: "bg-emerald-600 text-white",
      cycleBtn: "bg-emerald-800 hover:bg-emerald-700",
      cyclePill: "bg-emerald-600 text-white",
    },
    matematica: {
      headerBg: "bg-gradient-to-r from-red-900 via-red-800 to-red-700",
      borderAccent: "border-red-300",
      cardHoverBorder: "hover:border-red-700",
      badgeSolid: "bg-red-700 hover:bg-red-600 text-white border-red-500",
      badgeSoft: "bg-red-50 text-red-800 border-red-200",
      iconWrap: "bg-red-50 border-red-200 text-red-700",
      textAccent: "text-red-700",
      groupHoverText: "group-hover:text-red-700",
      tabActive: "bg-red-800 text-white shadow-md border-b-2 border-red-300",
      tabPillActive: "bg-red-600 text-white",
      cycleBtn: "bg-red-800 hover:bg-red-700",
      cyclePill: "bg-red-600 text-white",
    },
    estadistica: {
      headerBg: "bg-gradient-to-r from-orange-800 via-orange-700 to-amber-600",
      borderAccent: "border-amber-300",
      cardHoverBorder: "hover:border-orange-600",
      badgeSolid: "bg-orange-600 hover:bg-orange-500 text-white border-orange-400",
      badgeSoft: "bg-orange-50 text-orange-800 border-orange-200",
      iconWrap: "bg-orange-50 border-orange-200 text-orange-600",
      textAccent: "text-orange-600",
      groupHoverText: "group-hover:text-orange-600",
      tabActive: "bg-orange-600 text-white shadow-md border-b-2 border-amber-200",
      tabPillActive: "bg-orange-800 text-white",
      cycleBtn: "bg-orange-700 hover:bg-orange-600",
      cyclePill: "bg-orange-900 text-white",
    },
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
    }, 7000);
    return () => clearInterval(timer);
  }, [pausarSliderHero, totalSlidesHero, siguienteSlideHero]);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-900 selection:text-white">
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
                <span className="font-extrabold tracking-tight text-base sm:text-lg text-white">
                  FCM <span className="text-red-400">UNMSM</span>
                </span>
                <span className="hidden xl:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-700 text-white">
                  Plan 2026
                </span>
              </div>
              <p className="text-[11px] text-blue-200 hidden md:block">Facultad de Ciencias Matemáticas</p>
            </div>
          </div>

          {/* BUSCADOR COMPACTO EN NAVBAR (ENTRE LOGO Y NAVEGACIÓN) */}
          <div
            ref={contenedorNavbarSearchRef}
            className="relative hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-3"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-blue-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputNavbarRef}
                type="text"
                value={busquedaNavbar}
                onChange={(e) => {
                  setBusquedaNavbar(e.target.value);
                  setNavbarResultadosAbiertos(true);
                }}
                onFocus={() => {
                  if (busquedaNavbar.trim().length >= 2) setNavbarResultadosAbiertos(true);
                }}
                placeholder="Buscar cursos, docentes, noticias..."
                className="w-full pl-9 pr-14 py-1.5 text-xs rounded-xl bg-blue-900/60 hover:bg-blue-900/90 focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 placeholder-blue-300/80 border border-blue-700/60 focus:border-red-500 focus:outline-none transition-all shadow-inner text-white"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-0.5">
                <kbd className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-700 text-blue-200">
                  Ctrl K
                </kbd>
              </div>
            </div>

            {/* Desplegable en tiempo real de resultados de búsqueda navbar */}
            {navbarResultadosAbiertos && busquedaNavbar.trim().length >= 2 && resultadosBusquedaNavbar && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white text-slate-900 rounded-2xl shadow-2xl border-2 border-[#002855] overflow-hidden z-50 divide-y divide-slate-100 max-h-[75vh] overflow-y-auto">
                <div className="bg-[#002855] text-white px-4 py-2.5 flex items-center justify-between text-xs">
                  <span className="font-extrabold flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-red-400" />
                    {resultadosBusquedaNavbar.total > 0
                      ? `${resultadosBusquedaNavbar.total} resultado(s)`
                      : "Sin resultados directos"}
                  </span>
                  <span className="text-[10px] text-blue-200">ESC para cerrar</span>
                </div>

                {resultadosBusquedaNavbar.cursos.length > 0 && (
                  <div className="p-2 space-y-1">
                    <p className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Cursos del Plan de Estudios
                    </p>
                    {resultadosBusquedaNavbar.cursos.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          navegar("/carreras/[id]", { carreraId: c.carrera_id });
                          setCiclosAbiertos((prev) => (prev.includes(c.ciclo) ? prev : [...prev, c.ciclo]));
                          setNavbarResultadosAbiertos(false);
                          setNavbarBuscadorAbierto(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50/80 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <p className="font-extrabold text-xs text-[#002855] group-hover:text-red-700">
                            {c.nombre_curso}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Código: <strong className="font-mono text-slate-700">[{c.codigo}]</strong> • Ciclo {c.ciclo} • {c.creditos} Créditos
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-700" />
                      </button>
                    ))}
                  </div>
                )}

                {resultadosBusquedaNavbar.docentes.length > 0 && (
                  <div className="p-2 space-y-1">
                    <p className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Docentes e Investigadores
                    </p>
                    {resultadosBusquedaNavbar.docentes.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setDocenteModalActivo(d);
                          setNavbarResultadosAbiertos(false);
                          setNavbarBuscadorAbierto(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50/80 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <p className="font-extrabold text-xs text-[#002855] group-hover:text-red-700">
                            {d.grado_academico} {d.nombre_completo}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {d.especialidad} • {d.cursos_dictados.slice(0, 2).join(", ")}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-700" />
                      </button>
                    ))}
                  </div>
                )}

                {resultadosBusquedaNavbar.noticias.length > 0 && (
                  <div className="p-2 space-y-1">
                    <p className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Noticias y Comunicados
                    </p>
                    {resultadosBusquedaNavbar.noticias.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          navegar("/noticias/[id]", { noticiaId: n.id });
                          setNavbarResultadosAbiertos(false);
                          setNavbarBuscadorAbierto(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50/80 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <p className="font-extrabold text-xs text-[#002855] group-hover:text-red-700 line-clamp-1">
                            {n.titulo}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {n.categoria} • {n.fecha_publicacion}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-700" />
                      </button>
                    ))}
                  </div>
                )}

                {resultadosBusquedaNavbar.materiales.length > 0 && (
                  <div className="p-2 space-y-1">
                    <p className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Materiales del Repositorio
                    </p>
                    {resultadosBusquedaNavbar.materiales.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          navegar("/repositorio");
                          setRepoBusquedaTexto(m.titulo);
                          setNavbarResultadosAbiertos(false);
                          setNavbarBuscadorAbierto(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50/80 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <p className="font-extrabold text-xs text-[#002855] group-hover:text-red-700 line-clamp-1">
                            [{m.tipo_archivo}] {m.titulo}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Docente: {m.docente} • Subido por: {m.autor_alias}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-700" />
                      </button>
                    ))}
                  </div>
                )}

                {resultadosBusquedaNavbar.total === 0 && (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No se encontraron coincidencias para &quot;{busquedaNavbar}&quot;. Prueba con otro término.
                  </div>
                )}
              </div>
            )}
          </div>

          <nav className="hidden md:flex flex-wrap items-center gap-1 sm:gap-1.5 bg-blue-950/80 p-1.5 rounded-xl border border-blue-800">
            <button
              onClick={() => navegar("/")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                vistaActual === "/" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => navegar("/carreras/[id]", { carreraId: carreraSeleccionadaId })}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                vistaActual === "/carreras/[id]" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-red-400" />
              <span>Escuelas y Mallas</span>
            </button>
            <button
              onClick={() => navegar("/repositorio")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                vistaActual === "/repositorio" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5 text-red-400" />
              <span>Repositorio</span>
            </button>

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
                className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-red-700 hover:bg-red-600 text-white shadow-sm flex items-center gap-1.5 whitespace-nowrap transition-all border border-red-500 cursor-pointer"
              >
                <span>SERVICIO AL ESTUDIANTE</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownServicioAbierto ? "rotate-180" : ""}`} />
              </button>

              {dropdownServicioAbierto && (
                <div className="absolute right-0 sm:left-0 top-full pt-2 w-80 sm:w-96 z-50">
                  <div className="rounded-2xl bg-white text-slate-900 shadow-2xl border-2 border-[#002855] overflow-hidden">
                    <div className="bg-[#002855] text-white px-4 py-2.5 border-b-2 border-red-600 flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider">Unidades y Plataformas al Estudiante</span>
                      <span className="text-[10px] font-mono text-red-300">FCM • UNMSM</span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs max-h-[78vh] overflow-y-auto">
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
                          className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <p className="font-extrabold text-[#002855] group-hover:text-red-700">{u.nombre}</p>
                            <p className="text-[11px] text-slate-500">{u.sub}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-700" />
                        </button>
                      ))}

                      <div className="px-4 py-3.5 bg-blue-50/60 space-y-2.5">
                        <div className="flex items-start gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-extrabold text-[#002855] leading-snug">Matrícula, Registros Académicos, Grados Y Títulos</p>
                            <p className="text-[11px] text-slate-600">Accesos oficiales de trámite documentario y matrícula:</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <a
                            href="https://tramiteonline.unmsm.edu.pe/sgdfd/mat/"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setDropdownServicioAbierto(false)}
                            className="px-3 py-2 rounded-xl bg-[#002855] hover:bg-blue-900 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5"
                          >
                            <span>Módulo MAT</span>
                            <ExternalLink className="w-3 h-3 text-red-300" />
                          </a>
                          <a
                            href="https://sum.unmsm.edu.pe/alumnoWebSum/login"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setDropdownServicioAbierto(false)}
                            className="px-3 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5"
                          >
                            <span>Intranet SUM</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <div className="px-4 py-3 bg-red-50/50 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-extrabold text-[#002855]">UNIDAD DE ECONOMÍA</p>
                          <p className="text-[11px] text-slate-600">Pagos y tasas académicas en línea</p>
                        </div>
                        <a
                          href="https://sanmarket.unmsm.edu.pe/#/"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setDropdownServicioAbierto(false)}
                          className="px-3 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-[11px] flex items-center gap-1.5 shrink-0"
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
                            <p className="font-extrabold text-[#002855] group-hover:text-red-700">Directorio Telefónico</p>
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
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-red-600 text-white">
                    {materialesPendientes.length}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* BOTONES MÓVILES (BUSCADOR EXPANDIBLE + MENÚ HAMBURGUESA) */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setNavbarBuscadorAbierto((prev) => !prev);
                setMenuMovilAbierto(false);
                setTimeout(() => inputNavbarRef.current?.focus(), 60);
              }}
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-900 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Abrir buscador"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuMovilAbierto((prev) => !prev);
                setNavbarBuscadorAbierto(false);
              }}
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-900 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={menuMovilAbierto ? "Cerrar menú" : "Abrir menú"}
            >
              {menuMovilAbierto ? <X className="w-6 h-6 text-red-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* BUSCADOR MÓVIL DESPLEGABLE */}
        {navbarBuscadorAbierto && (
          <div className="md:hidden bg-[#001f42] border-t border-blue-900 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="relative">
              <Search className="w-4 h-4 text-blue-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={busquedaNavbar}
                onChange={(e) => {
                  setBusquedaNavbar(e.target.value);
                  setNavbarResultadosAbiertos(true);
                }}
                placeholder="Buscar cursos, docentes, noticias..."
                className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-blue-900/90 text-white placeholder-blue-300 border border-blue-700 focus:outline-none focus:border-red-500"
                autoFocus
              />
              {busquedaNavbar && (
                <button
                  type="button"
                  onClick={() => setBusquedaNavbar("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Resultados móviles */}
            {busquedaNavbar.trim().length >= 2 && resultadosBusquedaNavbar && (
              <div className="mt-2 bg-white text-slate-900 rounded-xl shadow-xl overflow-hidden divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
                {resultadosBusquedaNavbar.cursos.length > 0 && (
                  <div className="p-2 space-y-1">
                    <p className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Cursos
                    </p>
                    {resultadosBusquedaNavbar.cursos.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          navegar("/carreras/[id]", { carreraId: c.carrera_id });
                          setCiclosAbiertos((prev) => (prev.includes(c.ciclo) ? prev : [...prev, c.ciclo]));
                          setNavbarBuscadorAbierto(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-xs font-bold text-[#002855] block"
                      >
                        [{c.codigo}] {c.nombre_curso}
                      </button>
                    ))}
                  </div>
                )}
                {resultadosBusquedaNavbar.docentes.length > 0 && (
                  <div className="p-2 space-y-1">
                    <p className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Docentes
                    </p>
                    {resultadosBusquedaNavbar.docentes.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setDocenteModalActivo(d);
                          setNavbarBuscadorAbierto(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-xs font-bold text-[#002855] block"
                      >
                        {d.grado_academico} {d.nombre_completo}
                      </button>
                    ))}
                  </div>
                )}
                {resultadosBusquedaNavbar.noticias.length > 0 && (
                  <div className="p-2 space-y-1">
                    <p className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Noticias
                    </p>
                    {resultadosBusquedaNavbar.noticias.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          navegar("/noticias/[id]", { noticiaId: n.id });
                          setNavbarBuscadorAbierto(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-xs font-bold text-[#002855] block line-clamp-1"
                      >
                        {n.titulo}
                      </button>
                    ))}
                  </div>
                )}
                {resultadosBusquedaNavbar.materiales.length > 0 && (
                  <div className="p-2 space-y-1">
                    <p className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Repositorio
                    </p>
                    {resultadosBusquedaNavbar.materiales.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          navegar("/repositorio");
                          setRepoBusquedaTexto(m.titulo);
                          setNavbarBuscadorAbierto(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-xs font-bold text-[#002855] block line-clamp-1"
                      >
                        [{m.tipo_archivo}] {m.titulo}
                      </button>
                    ))}
                  </div>
                )}
                {resultadosBusquedaNavbar.total === 0 && (
                  <div className="p-3 text-center text-xs text-slate-500">
                    Sin resultados para &quot;{busquedaNavbar}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MENÚ MÓVIL DESPLEGABLE / DRAWER */}
        {menuMovilAbierto && (
          <div className="md:hidden bg-[#001f42] border-t border-blue-900 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl">
            <div className="space-y-1">
              <button
                onClick={() => {
                  navegar("/");
                  setMenuMovilAbierto(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center ${
                  vistaActual === "/" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
                }`}
              >
                Inicio
              </button>

              <div className="pt-1">
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
                    Escuelas y Mallas 2026
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
                <span>Repositorio Académico</span>
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
              className="flex w-full transition-transform duration-500 ease-out will-change-transform"
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

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-lg">
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

              {/* SLIDES SIGUIENTES (1..N): NOTICIAS Y COMUNICADOS (IMAGEN 1) */}
              {noticiasDestacadas.map((noticia) => (
                <div
                  key={noticia.id}
                  className="w-full shrink-0 relative min-h-[460px] sm:min-h-[520px] flex items-center p-6 sm:p-12"
                >
                  <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center">
                    {/* Lado izquierdo: Información */}
                    <div className="md:col-span-7 space-y-4 sm:space-y-5 text-left">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-black/40 text-red-200 border border-white/20 shadow-sm backdrop-blur-xs">
                        <Sparkles className="w-3.5 h-3.5 text-red-400" />
                        {noticia.categoria || "Comunicado Oficial"}
                      </span>

                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
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
                                <span className="text-[9px] font-extrabold uppercase tracking-tight text-slate-800">PERÚ</span>
                              </div>
                              <p className="text-[10px] font-bold text-slate-900 leading-tight">Ministerio de Educación</p>
                            </div>

                            <div className="bg-white rounded-xl p-3.5 shadow-xl border-2 border-blue-900/20 text-slate-900 text-center flex-1 max-w-[200px]">
                              <div className="flex items-center justify-center gap-1.5">
                                <span className="text-base sm:text-lg font-black tracking-tighter text-[#002855]">PRONABEC</span>
                              </div>
                              <div className="h-1 w-full bg-gradient-to-r from-red-600 via-yellow-400 to-blue-600 rounded-full my-1" />
                              <div className="mt-1 bg-blue-50/80 rounded-lg py-1 px-1.5 border border-blue-200">
                                <span className="text-[9px] font-extrabold text-blue-950 uppercase block leading-tight">
                                  DECRETO SUPREMO
                                </span>
                                <span className="text-[10px] font-black text-red-700 block leading-tight">
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

          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-2 border-blue-900 pb-3">
              <div>
                <span className="text-xs font-bold uppercase text-red-700">Mallas Curriculares Completas (Ciclos 1 al 10)</span>
                <h2 className="text-2xl font-extrabold text-[#002855]">Escuelas Profesionales de la Facultad</h2>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                Haz clic en cualquier escuela para ver su tríptico y malla en PDF
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {carreras.map((car) => {
                const cursosCar = malla.filter((c) => c.carrera_id === car.id);
                const totalCreditos = cursosCar.reduce((acc, c) => acc + c.creditos, 0);
                const temaCar = TEMA_CARRERA[car.id];
                return (
                  <div
                    key={car.id}
                    onClick={() => navegarACarrera(car.id)}
                    className={`group rounded-2xl border border-slate-200 bg-white ${temaCar.cardHoverBorder} shadow-sm hover:shadow-xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between`}
                  >
                    <div>
                      <div className={`${temaCar.headerBg} text-white px-5 py-3.5 flex items-center justify-between border-b-2 ${temaCar.borderAccent}`}>
                        <span className="text-xs font-mono font-bold text-white/90">{car.codigo_escuela}</span>
                        <span className="text-[11px] font-semibold bg-black/25 px-2.5 py-0.5 rounded-md">10 Ciclos</span>
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl border ${temaCar.iconWrap}`}>{renderIconoCarrera(car.id)}</div>
                          <h3 className={`text-lg font-extrabold text-[#002855] ${temaCar.groupHoverText} transition-colors`}>{car.nombre}</h3>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{car.descripcion}</p>
                      </div>
                    </div>
                    <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                        <span className={`${temaCar.textAccent} font-bold`}>{cursosCar.length} asignaturas</span>
                        <span>{totalCreditos.toFixed(0)} créditos</span>
                      </div>
                      <div className={`flex items-center justify-between text-xs font-bold text-[#002855] ${temaCar.groupHoverText}`}>
                        <span>Ver Tríptico y Malla (1-10)</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECCIÓN DE NOTICIAS CON TARJETAS INTERACTIVAS Y VISTA DE LECTURA */}
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-2 border-blue-900 pb-3">
              <div>
                <span className="text-xs font-bold uppercase text-red-700">Actualidad Universitaria</span>
                <h2 className="text-2xl font-extrabold text-[#002855] flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-red-700" />
                  Noticias y Comunicados Oficiales
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                Haz clic en cualquier noticia para leer el artículo completo y enlaces oficiales
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {noticias.map((not, idx) => {
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
                    className={`group rounded-2xl border border-slate-200 bg-white hover:border-[#002855] shadow-sm hover:shadow-xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all ${
                      idx === 0 ? "md:col-span-2" : "md:col-span-1"
                    }`}
                  >
                    <div>
                      <div className="relative h-56 bg-slate-900 overflow-hidden">
                        <img
                          src={not.imagen_url}
                          alt={not.titulo}
                          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
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
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-red-700" />
                          <span>{formatearFechaEspanol(not.fecha_publicacion)}</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-[#002855] group-hover:text-red-700 transition-colors leading-snug">
                          {not.titulo}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                          {resumenLimpio}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#002855] group-hover:text-red-700 flex items-center gap-1.5">
                        <span>Leer noticia completa</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      {not.modalidad && (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#002855] border border-blue-200">
                          {not.modalidad}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* 3. SECCIÓN "PLANA DOCENTE E INVESTIGADORES" CENTRADA AL FINAL DEL HOME */}
          <section id="plana-docente" className="pt-4 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#002855] text-xs font-extrabold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-red-700" />
                <span>Excelencia Académica e Investigación • FCM UNMSM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002855] tracking-tight">
                Plana Docente e Investigadores de la Facultad
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Selecciona una Escuela Profesional o busca por asignatura para conocer el perfil académico, líneas de investigación, correo institucional y horarios de asesoría de nuestros catedráticos.
              </p>
            </div>

            {/* Pestañas por Carrera + Buscador Centrado */}
            <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => navegar("/", { docenteCarrera: "TODAS", skipScroll: true })}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    filtroDocenteCarrera === "TODAS"
                      ? "bg-[#002855] text-white shadow-md border-b-2 border-red-600"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>Todas (FCM)</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${filtroDocenteCarrera === "TODAS" ? "bg-red-700 text-white" : "bg-slate-300 text-slate-800"}`}>
                    {docentes.length}
                  </span>
                </button>

                {carreras.map((car) => {
                  const temaCar = TEMA_CARRERA[car.id];
                  const activo = filtroDocenteCarrera === car.id;
                  const totalPorEscuela = docentes.filter((d) => d.carrera_id === car.id).length;
                  return (
                    <button
                      key={car.id}
                      type="button"
                      onClick={() => navegar("/", { docenteCarrera: car.id, skipScroll: true })}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                        activo ? temaCar.tabActive : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span>{car.nombre}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${activo ? temaCar.tabPillActive : "bg-slate-300 text-slate-800"}`}>
                        {totalPorEscuela}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative max-w-xl mx-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={busquedaDocentes}
                  onChange={(e) => setBusquedaDocentes(e.target.value)}
                  placeholder="Buscar profesor por apellido, especialidad o curso que dicta..."
                  className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#002855]"
                />
                {busquedaDocentes && (
                  <button
                    type="button"
                    onClick={() => setBusquedaDocentes("")}
                    className="absolute right-2.5 top-2 px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-[11px] font-bold text-slate-700"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            {/* Vista por Cuadros de Escuela Profesional o Sección de Escuela Seleccionada */}
            {filtroDocenteCarrera === "TODAS" && busquedaDocentes.trim() === "" ? (
              <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {carreras.map((car) => {
                  const temaCar = TEMA_CARRERA[car.id];
                  const docentesEscuela = docentes.filter((d) => d.carrera_id === car.id);
                  const principalesCount = docentesEscuela.filter((d) => d.categoria_docente === "Principal").length;
                  return (
                    <div
                      key={car.id}
                      onClick={() => navegar("/", { docenteCarrera: car.id, skipScroll: true })}
                      className={`group rounded-2xl bg-white border border-slate-200 ${temaCar.cardHoverBorder} shadow-sm hover:shadow-xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between text-center`}
                    >
                      <div>
                        {/* Cabecera Superior Temática del Cuadro de Escuela */}
                        <div className={`relative h-44 w-full ${temaCar.headerBg} overflow-hidden flex flex-col items-center justify-center p-5 text-white`}>
                          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/25 text-white/95">
                            {car.codigo_escuela}
                          </div>
                          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-white/20 text-white backdrop-blur-xs">
                            {docentesEscuela.length} {docentesEscuela.length === 1 ? "Docente" : "Docentes"}
                          </div>

                          {/* Avatares superpuestos de los catedráticos de esta Escuela */}
                          <div className="flex items-center justify-center -space-x-3 mb-3 mt-3">
                            {docentesEscuela.slice(0, 4).map((doc) => (
                              <div
                                key={doc.id}
                                className="w-12 h-12 rounded-full border-2 border-white bg-slate-800 overflow-hidden shadow-md flex items-center justify-center text-xs font-extrabold text-white"
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
                              <div className="w-12 h-12 rounded-full border-2 border-white bg-black/60 text-white text-xs font-extrabold flex items-center justify-center shadow-md">
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
                          <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${temaCar.badgeSoft}`}>
                            Escuela Profesional
                          </span>
                          <h3 className={`text-base sm:text-lg font-extrabold text-[#002855] ${temaCar.groupHoverText} transition-colors leading-snug`}>
                            {car.nombre}
                          </h3>
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {docentesEscuela
                              .slice(0, 2)
                              .map((d) => `${d.grado_academico} ${d.nombre_completo.split(",")[0]}`)
                              .join(" • ")}
                            {docentesEscuela.length > 2 ? ` y ${docentesEscuela.length - 2} más` : ""}
                          </p>
                          <div className="flex items-center justify-center gap-2 pt-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                              {principalesCount} Principales
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Calificar
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#002855] group-hover:text-red-700">
                        <span>Ver Docentes de {car.nombre}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : docentesFiltradosHome.length === 0 ? (
              <div className="max-w-xl mx-auto rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-extrabold text-[#002855]">No se encontraron docentes con ese criterio</p>
                <p className="text-xs text-slate-500">Prueba cambiando la Escuela Profesional o limpiando el buscador.</p>
                <button
                  type="button"
                  onClick={() => {
                    setBusquedaDocentes("");
                    navegar("/", { docenteCarrera: "TODAS", skipScroll: true });
                  }}
                  className="px-4 py-2 rounded-xl bg-[#002855] text-white text-xs font-extrabold cursor-pointer"
                >
                  Volver a las 4 Escuelas
                </button>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Si hay una escuela específica seleccionada, mostramos su barra de cabecera + botón para regresar a los 4 cuadros */}
                {filtroDocenteCarrera !== "TODAS" && (() => {
                  const escuelaObj = carreras.find((c) => c.id === filtroDocenteCarrera) || CARRERAS_INICIALES[0];
                  const temaEsc = TEMA_CARRERA[escuelaObj.id];
                  return (
                    <div className={`rounded-2xl ${temaEsc.headerBg} text-white p-5 shadow-md flex flex-wrap items-center justify-between gap-4 border-b-4 ${temaEsc.borderAccent}`}>
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20">
                          {renderIconoCarrera(escuelaObj.id)}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-white/80 block">
                            {escuelaObj.codigo_escuela} • Plana Docente por Escuela
                          </span>
                          <h3 className="text-lg sm:text-xl font-extrabold text-white">
                            Escuela Profesional de {escuelaObj.nombre} ({docentesFiltradosHome.length})
                          </h3>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => navegar("/", { docenteCarrera: "TODAS", skipScroll: true })}
                        className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Ver las 4 Escuelas</span>
                      </button>
                    </div>
                  );
                })()}

                {/* Si busca en TODAS, agrupa ordenadamente por cada Escuela con resultados; si eligió una escuela, muestra su cuadrícula */}
                {(filtroDocenteCarrera === "TODAS"
                  ? carreras.filter((c) => docentesFiltradosHome.some((d) => d.carrera_id === c.id))
                  : carreras.filter((c) => c.id === filtroDocenteCarrera)
                ).map((escuelaGrupo) => {
                  const temaGrupo = TEMA_CARRERA[escuelaGrupo.id];
                  const listaDocentesGrupo = docentesFiltradosHome.filter((d) => d.carrera_id === escuelaGrupo.id);
                  return (
                    <div key={escuelaGrupo.id} className="space-y-4">
                      {filtroDocenteCarrera === "TODAS" && (
                        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${temaGrupo.headerBg}`} />
                            <h3 className="text-base font-extrabold text-[#002855]">
                              E.P. de {escuelaGrupo.nombre}
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${temaGrupo.badgeSoft}`}>
                              {listaDocentesGrupo.length} {listaDocentesGrupo.length === 1 ? "docente" : "docentes"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => navegar("/", { docenteCarrera: escuelaGrupo.id, skipScroll: true })}
                            className="text-xs font-bold text-[#002855] hover:text-red-700 cursor-pointer"
                          >
                            Ver solo esta escuela →
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {listaDocentesGrupo.map((doc) => {
                          const temaDoc = TEMA_CARRERA[doc.carrera_id];
                          const nombreEscuela = carreras.find((c) => c.id === doc.carrera_id)?.nombre || "FCM";
                          const statsDoc = obtenerEstadisticasDocente(doc.id);
                          return (
                            <div
                              key={doc.id}
                              onClick={() => abrirModalDocente(doc)}
                              className={`group rounded-2xl bg-white border border-slate-200 ${temaDoc.cardHoverBorder} shadow-sm hover:shadow-xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between text-center`}
                            >
                              <div>
                                {/* Fotografía Superior Uniforme o Avatar Institucional */}
                                <div className="relative h-52 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                                  {doc.foto_url ? (
                                    <img
                                      src={doc.foto_url}
                                      alt={`${doc.grado_academico} ${doc.nombre_completo}`}
                                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className={`w-full h-full ${temaDoc.headerBg} flex items-center justify-center text-white text-3xl font-extrabold tracking-wider`}>
                                      {obtenerInicialesDocente(doc.nombre_completo)}
                                    </div>
                                  )}
                                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-black/70 text-white backdrop-blur-xs">
                                    {doc.categoria_docente}
                                  </span>
                                </div>

                                {/* Franja de color de su Escuela Profesional */}
                                <div className={`h-1.5 w-full ${temaDoc.headerBg}`} />

                                {/* Información Centrada estilo matematicas.unmsm.edu.pe */}
                                <div className="p-5 space-y-2">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${temaDoc.badgeSoft}`}>
                                    {nombreEscuela}
                                  </span>
                                  <h3 className={`text-sm sm:text-base font-extrabold text-[#002855] ${temaDoc.groupHoverText} transition-colors leading-snug`}>
                                    {doc.grado_academico} {doc.nombre_completo}
                                  </h3>

                                  {/* Badge sutil de promedio de estrellas y votos debajo del nombre */}
                                  <div className="flex items-center justify-center">
                                    {statsDoc.total > 0 ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-extrabold text-amber-800">
                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        <span>{statsDoc.promedio.toFixed(1)}</span>
                                        <span className="text-amber-600 font-semibold">({statsDoc.total})</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        <span>Nuevo • Calificar</span>
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                    {doc.especialidad}
                                  </p>
                                </div>
                              </div>

                              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-[#002855] group-hover:text-red-700">
                                <span>Ver Ficha y Calificar</span>
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </div>
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
      )}

      {/* VISTA DETALLE DE NOTICIA (/noticias/[id]) */}
      {vistaActual === "/noticias/[id]" && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
          {/* Barra superior de navegación y compartir */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-xs print:hidden">
            <button
              type="button"
              onClick={() => navegar("/")}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#002855] hover:text-white text-slate-800 text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Volver al Portal</span>
            </button>

            <div className="flex items-center gap-2">
              {adminAutenticado && (
                <button
                  type="button"
                  onClick={() => {
                    setFormNoticia({
                      id: noticiaActiva.id,
                      titulo: noticiaActiva.titulo,
                      categoria: noticiaActiva.categoria,
                      resumen: noticiaActiva.resumen || "",
                      fecha_publicacion: noticiaActiva.fecha_publicacion,
                      contenido: noticiaActiva.contenido,
                      imagen_url: noticiaActiva.imagen_url,
                      destacado: noticiaActiva.destacado,
                      en_carrusel_principal: noticiaActiva.en_carrusel_principal ?? true,
                      color_fondo: noticiaActiva.color_fondo || "#4d0713",
                      fecha_evento: noticiaActiva.fecha_evento || "",
                      lugar: noticiaActiva.lugar || "",
                      modalidad: noticiaActiva.modalidad || "",
                      dirigido_a: noticiaActiva.dirigido_a || "",
                      enlace_inscripcion: noticiaActiva.enlace_inscripcion || "",
                    });
                    setTabAdmin("noticias");
                    navegar("/admin");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#002855] border border-blue-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar en CMS</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleCompartirNoticia(noticiaActiva)}
                className="px-4 py-2 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-red-400" />
                <span>Compartir Noticia</span>
              </button>
            </div>
          </div>

          {/* Contenedor Principal del Artículo */}
          <article className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            {/* Portada adaptable: muestra afiches verticales o banners completos sin recortarlos bruscamente */}
            <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden min-h-[260px] max-h-[540px]">
              <img
                src={noticiaActiva.imagen_url}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-25 blur-xl scale-110 pointer-events-none"
              />
              <img
                src={noticiaActiva.imagen_url}
                alt={noticiaActiva.titulo}
                className="relative z-10 w-full max-h-[520px] object-contain"
              />
            </div>

            <div className="p-6 sm:p-10">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="space-y-3 border-b border-slate-200 pb-6">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-[#002855] text-white">
                      {noticiaActiva.categoria}
                    </span>
                    {noticiaActiva.destacado && (
                      <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-red-700 text-white flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-white" /> Destacado FCM
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 ml-auto">
                      <Calendar className="w-4 h-4 text-red-700" />
                      {formatearFechaEspanol(noticiaActiva.fecha_publicacion)}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-[#002855] leading-tight">
                    {noticiaActiva.titulo}
                  </h1>

                  {noticiaActiva.resumen && (
                    <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                      {noticiaActiva.resumen}
                    </p>
                  )}
                </div>

                {/* Layout con Ficha Rápida de Evento (si tiene metadatos opcionales) + Cuerpo del Artículo */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div
                    className={
                      noticiaActiva.fecha_evento ||
                      noticiaActiva.lugar ||
                      noticiaActiva.modalidad ||
                      noticiaActiva.dirigido_a ||
                      noticiaActiva.enlace_inscripcion
                        ? "lg:col-span-8"
                        : "lg:col-span-12 max-w-3xl mx-auto w-full"
                    }
                  >
                    {renderizarContenidoNoticia(noticiaActiva.contenido)}
                  </div>

                  {(noticiaActiva.fecha_evento ||
                    noticiaActiva.lugar ||
                    noticiaActiva.modalidad ||
                    noticiaActiva.dirigido_a ||
                    noticiaActiva.enlace_inscripcion) && (
                    <aside className="lg:col-span-4 rounded-2xl bg-slate-50 border-2 border-[#002855]/15 p-5 space-y-4">
                      <div className="border-b border-slate-200 pb-2.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-700">
                          Ficha Oficial del Evento / Comunicado
                        </span>
                        <h3 className="text-sm font-extrabold text-[#002855]">Datos Clave</h3>
                      </div>

                      <div className="space-y-3 text-xs">
                        {noticiaActiva.fecha_evento && (
                          <div className="flex items-start gap-2.5">
                            <Calendar className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-slate-500 uppercase text-[10px]">Fecha / Cronograma</p>
                              <p className="font-extrabold text-slate-900">{noticiaActiva.fecha_evento}</p>
                            </div>
                          </div>
                        )}
                        {noticiaActiva.lugar && (
                          <div className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-slate-500 uppercase text-[10px]">Lugar / Sede</p>
                              <p className="font-extrabold text-slate-900">{noticiaActiva.lugar}</p>
                            </div>
                          </div>
                        )}
                        {noticiaActiva.modalidad && (
                          <div className="flex items-start gap-2.5">
                            <Globe className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-slate-500 uppercase text-[10px]">Modalidad</p>
                              <p className="font-extrabold text-slate-900">{noticiaActiva.modalidad}</p>
                            </div>
                          </div>
                        )}
                        {noticiaActiva.dirigido_a && (
                          <div className="flex items-start gap-2.5">
                            <Users className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-slate-500 uppercase text-[10px]">Dirigido a</p>
                              <p className="font-extrabold text-slate-900">{noticiaActiva.dirigido_a}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {noticiaActiva.enlace_inscripcion && (
                        <a
                          href={noticiaActiva.enlace_inscripcion}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                        >
                          <span>🚀 Inscribirse / Ver Bases Oficiales</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </aside>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* Otras noticias relacionadas */}
          {noticias.filter((n) => n.id !== noticiaActiva.id).length > 0 && (
            <section className="space-y-4 print:hidden">
              <div className="flex items-center justify-between border-b-2 border-blue-900 pb-2.5">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#002855]">Otras Noticias de la Facultad</h2>
                <button
                  type="button"
                  onClick={() => navegar("/")}
                  className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                >
                  Ver todas en el Inicio →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {noticias
                  .filter((n) => n.id !== noticiaActiva.id)
                  .slice(0, 3)
                  .map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => abrirNoticiaDetalle(rel.id)}
                      className="group rounded-2xl border border-slate-200 bg-white hover:border-[#002855] overflow-hidden shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-36 bg-slate-900 overflow-hidden">
                          <img src={rel.imagen_url} alt={rel.titulo} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="p-4 space-y-1.5">
                          <span className="text-[10px] font-extrabold uppercase text-red-700">{rel.categoria}</span>
                          <h3 className="text-xs sm:text-sm font-extrabold text-[#002855] group-hover:text-red-700 line-clamp-2">
                            {rel.titulo}
                          </h3>
                        </div>
                      </div>
                      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#002855]">
                        <span>{rel.fecha_publicacion}</span>
                        <span>Leer →</span>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </main>
      )}

      {/* VISTA B: DETALLE DE LA CARRERA (/carreras/[id]) */}
      {vistaActual === "/carreras/[id]" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex flex-wrap gap-2">
              {carreras.map((c) => {
                const count = malla.filter((m) => m.carrera_id === c.id).length;
                const temaTab = TEMA_CARRERA[c.id];
                const esActiva = carreraSeleccionadaId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => navegar("/carreras/[id]", { carreraId: c.id, skipScroll: true })}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                      esActiva
                        ? temaTab.tabActive
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>{c.nombre}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${esActiva ? temaTab.tabPillActive : "bg-slate-300 text-slate-800"}`}>
                      {count} cursos
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-mono text-slate-500 px-2">
              Ruta: <strong className={temaActivo.textAccent}>/carreras/{carreraActiva.id}</strong>
            </span>
          </div>

          {/* ENCABEZADO DE LA CARRERA CON COLOR PROPIO POR ESCUELA */}
          <section className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className={`${temaActivo.headerBg} text-white px-6 sm:px-8 py-6 border-b-4 ${temaActivo.borderAccent} flex flex-col lg:flex-row lg:items-center justify-between gap-6`}>
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded bg-black/25 text-white text-xs font-mono font-bold border border-white/20">{carreraActiva.codigo_escuela}</span>
                  <span className="text-xs text-white/90 font-medium">
                    10 Ciclos Académicos • {cursosDeCarreraActiva.length} Asignaturas Registradas
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Escuela Profesional de {carreraActiva.nombre}</h1>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">{carreraActiva.descripcion}</p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 print:hidden">
                <button
                  onClick={handleDescargarMallaPDF}
                  className="px-5 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className={`w-4 h-4 ${temaActivo.textAccent}`} />
                  <span>📥 Descargar Malla Curricular (PDF)</span>
                </button>
                <button
                  onClick={() => {
                    setRepoFiltroCarrera(carreraActiva.id);
                    setRepoFiltroCiclo("TODOS");
                    setRepoFiltroCurso("TODOS");
                    navegar("/repositorio");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/25 cursor-pointer"
                >
                  <FolderGit2 className="w-4 h-4 text-white" />
                  <span>Ir al Repositorio de {carreraActiva.nombre}</span>
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
              <div className="md:col-span-2 space-y-1.5">
                <h3 className={`text-xs font-extrabold uppercase tracking-wider ${temaActivo.textAccent}`}>Perfil del Egresado</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{carreraActiva.perfil_egreso}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-1.5 text-xs">
                <p className={`font-extrabold uppercase ${temaActivo.textAccent}`}>Grados y Títulos Oficiales</p>
                <p className="text-slate-600">Grado: <strong className="text-slate-900">{carreraActiva.grado_academico}</strong></p>
                <p className="text-slate-600">Título: <strong className="text-slate-900">{carreraActiva.titulo_profesional}</strong></p>
              </div>
            </div>
          </section>

          {/* SECCIÓN A 2 COLUMNAS: PERFIL / CAMPO LABORAL + BOTÓN TRÍPTICO PDF Y FOTO REFERENCIAL (rounded-xl shadow-md) */}
          <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <span className={`text-xs font-extrabold uppercase tracking-wider ${temaActivo.textAccent}`}>
                    Proyección Profesional e Investigación • FCM UNMSM
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#002855] mt-1">
                    ¿En qué consiste la carrera de {carreraActiva.nombre}?
                  </h2>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${temaActivo.iconWrap}`}><Target className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-extrabold text-[#002855]">Visión y Perfil Académico</h4>
                      <p>{carreraActiva.vision_carrera}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${temaActivo.iconWrap}`}><Briefcase className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-extrabold text-[#002855]">Campo Laboral y Desempeño Profesional</h4>
                      <p>{carreraActiva.campo_laboral}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${temaActivo.iconWrap}`}><Lightbulb className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-extrabold text-[#002855]">¿Por qué estudiar {carreraActiva.nombre} en San Marcos?</h4>
                      <p>{carreraActiva.por_que_estudiar}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3 print:hidden">
                  <button
                    onClick={handleDescargarTripticoCarrera}
                    className={`px-5 py-3.5 rounded-xl ${temaActivo.badgeSolid} font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2.5 border transition-transform active:scale-95 cursor-pointer`}
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>📥 Descargar Tríptico de la Carrera (PDF)</span>
                  </button>
                  {carreraActiva.triptico_pdf_url && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                      ✓ PDF oficial sincronizado con Supabase
                    </span>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5">
                <img
                  src={carreraActiva.imagen_referencial_url}
                  alt={`Estudiantes de ${carreraActiva.nombre} - FCM UNMSM`}
                  className="w-full h-72 sm:h-80 lg:h-96 object-cover rounded-xl shadow-md border border-slate-200"
                />
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span>Escuela Profesional de <strong className={temaActivo.textAccent}>{carreraActiva.nombre}</strong></span>
                  {adminAutenticado && (
                    <button
                      onClick={() => {
                        handleSeleccionarCarreraEnAdmin(carreraActiva.id);
                        setTabAdmin("carreras_cms");
                        navegar("/admin");
                      }}
                      className={`${temaActivo.textAccent} font-bold hover:underline print:hidden cursor-pointer`}
                    >
                      Cambiar imagen / PDF en /admin →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* MALLA CURRICULAR (CICLOS 1 AL 10) */}
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm print:hidden">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#002855]">
                  Malla Curricular de {carreraActiva.nombre} (Ciclo 1 al Ciclo 10)
                </h2>
                <p className="text-xs text-slate-600">
                  Cada ciclo muestra todas sus asignaturas obligatorias y electivas con créditos y prerrequisitos.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setModoMalla("acordeon")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border ${
                    modoMalla === "acordeon" ? `${temaActivo.badgeSolid}` : "bg-slate-100 text-slate-700 border-slate-300"
                  }`}
                >
                  Vista Acordeón
                </button>
                <button
                  onClick={() => setModoMalla("roadmap")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border ${
                    modoMalla === "roadmap" ? `${temaActivo.badgeSolid}` : "bg-slate-100 text-slate-700 border-slate-300"
                  }`}
                >
                  Vista Roadmap
                </button>
                <button
                  onClick={handleDescargarMallaPDF}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" /> Exportar Malla PDF
                </button>
              </div>
            </div>

            {modoMalla === "acordeon" ? (
              <div className="space-y-4">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((numCiclo) => {
                  const cursosCiclo = cursosDeCarreraActiva.filter((c) => c.ciclo === numCiclo);
                  const totalCreditos = cursosCiclo.reduce((acc, c) => acc + c.creditos, 0);
                  const abierto = ciclosAbiertos.includes(numCiclo);
                  return (
                    <div key={numCiclo} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleCicloAcordeon(numCiclo)}
                        className={`w-full px-5 py-4 flex items-center justify-between ${temaActivo.cycleBtn} text-white transition-colors cursor-pointer`}
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`px-3 py-1 rounded-lg text-xs font-extrabold ${temaActivo.cyclePill} shadow-sm border border-white/20`}>CICLO {numCiclo}</span>
                          <span className="text-xs sm:text-sm font-bold text-white">{cursosCiclo.length} Asignaturas</span>
                          <span className="text-xs text-white/85 font-mono">• {totalCreditos.toFixed(1)} Créditos</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-white transition-transform ${abierto ? "rotate-180" : ""}`} />
                      </button>

                      {abierto && (
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/70">
                          {cursosCiclo.map((cur) => (
                            <div key={cur.id} className={`rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between gap-3 shadow-sm ${temaActivo.cardHoverBorder} transition-all`}>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`font-mono text-xs font-extrabold px-2.5 py-0.5 rounded border ${temaActivo.badgeSoft}`}>{cur.codigo}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase ${cur.tipo_curso === "O" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 border border-slate-300"}`}>
                                      {cur.tipo_curso === "O" ? "Obligatorio" : "Electivo"}
                                    </span>
                                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">{cur.creditos.toFixed(1)} cr.</span>
                                  </div>
                                </div>
                                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">{cur.nombre_curso}</h4>
                              </div>
                              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                <span className="text-slate-600">
                                  Pre-req: <strong className="text-slate-900 font-mono">{cur.prerequisitos.length > 0 ? cur.prerequisitos.join(", ") : "Ninguno"}</strong>
                                </span>
                                <button
                                  onClick={() => {
                                    setRepoFiltroCarrera(carreraActiva.id);
                                    setRepoFiltroCiclo(cur.ciclo);
                                    setRepoFiltroCurso(cur.id);
                                    navegar("/repositorio");
                                  }}
                                  className={`${temaActivo.textAccent} hover:underline font-bold cursor-pointer`}
                                >
                                  Materiales →
                                </button>
                              </div>
                            </div>
                          ))}
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
                    <div key={numCiclo} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
                      <div className={`${temaActivo.cycleBtn} text-white px-4 py-2.5 flex items-center justify-between border-b-2 ${temaActivo.borderAccent}`}>
                        <span className="text-xs font-extrabold">CICLO {numCiclo}</span>
                        <span className="text-[11px] font-mono text-white/90">{totalCred.toFixed(0)} cr.</span>
                      </div>
                      <div className="p-3 space-y-2.5 flex-1 bg-slate-50/50">
                        {cursosCiclo.map((cur) => (
                          <div key={cur.id} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className={`font-mono font-extrabold ${temaActivo.textAccent}`}>{cur.codigo}</span>
                              <span className="font-semibold text-slate-600">{cur.creditos.toFixed(1)} cr.</span>
                            </div>
                            <p className="text-xs font-bold text-slate-900 leading-tight">{cur.nombre_curso}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      )}

      {/* VISTA C: REPOSITORIO ACADÉMICO (/repositorio) */}
      {vistaActual === "/repositorio" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="rounded-3xl bg-[#002855] text-white p-6 sm:p-8 border-b-4 border-red-700 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase text-red-300 font-bold">Comunidad Académica FCM • /repositorio</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Repositorio Académico de la Facultad</h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
                Filtra exámenes resueltos, apuntes en LaTeX, libros y código por <strong>Carrera ➔ Ciclo ➔ Curso ➔ Formato</strong>.
              </p>
            </div>
            <button
              onClick={() => {
                setExitoSubidaModal(false);
                setModalSubirAbierto(true);
              }}
              className="px-5 py-3.5 rounded-xl bg-red-700 hover:bg-red-600 text-xs sm:text-sm font-extrabold text-white shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Upload className="w-4 h-4" /> ➕ Aportar Material Académico
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 space-y-5 h-fit shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-extrabold text-[#002855] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-red-700" /> Filtros Acumulativos
                </h3>
                <button
                  onClick={() => {
                    setRepoFiltroCarrera("TODAS");
                    setRepoFiltroCiclo("TODOS");
                    setRepoFiltroCurso("TODOS");
                    setRepoFiltroTipo("TODOS");
                    setRepoBusquedaTexto("");
                  }}
                  className="text-xs font-bold text-red-700 hover:underline"
                >
                  Reiniciar
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">1. Carrera Profesional</label>
                <select
                  value={repoFiltroCarrera}
                  onChange={(e) => {
                    setRepoFiltroCarrera(e.target.value as "TODAS" | CarreraId);
                    setRepoFiltroCurso("TODOS");
                  }}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900"
                >
                  <option value="TODAS">Todas las Carreras (4)</option>
                  {carreras.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">2. Ciclo Académico (1 - 10)</label>
                <select
                  value={repoFiltroCiclo}
                  onChange={(e) => {
                    setRepoFiltroCiclo(e.target.value === "TODOS" ? "TODOS" : Number(e.target.value));
                    setRepoFiltroCurso("TODOS");
                  }}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900"
                >
                  <option value="TODOS">Todos los Ciclos</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                    <option key={c} value={c}>Ciclo {c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">3. Curso ({cursosDisponiblesFiltroRepo.length})</label>
                <select
                  value={repoFiltroCurso}
                  onChange={(e) => setRepoFiltroCurso(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900"
                >
                  <option value="TODOS">Todos los cursos</option>
                  {cursosDisponiblesFiltroRepo.map((cur) => (
                    <option key={cur.id} value={cur.id}>[{cur.codigo}] {cur.nombre_curso}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">4. Formato de Archivo</label>
                <select
                  value={repoFiltroTipo}
                  onChange={(e) => setRepoFiltroTipo(e.target.value as "TODOS" | TipoArchivo)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900"
                >
                  <option value="TODOS">Todos los formatos</option>
                  <option value="Examen">Examen Resuelto</option>
                  <option value="Apunte">Apuntes LaTeX / Clase</option>
                  <option value="Codigo">Código Fuente / Lab</option>
                  <option value="PDF">Libro / Guía PDF</option>
                  <option value="Silabo">Sílabo Oficial</option>
                </select>
              </div>
            </aside>

            <section className="lg:col-span-9 space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={repoBusquedaTexto}
                  onChange={(e) => setRepoBusquedaTexto(e.target.value)}
                  placeholder="Filtrar recursos por título, código de curso, nombre del curso o docente..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 shadow-xs"
                />
              </div>

              {materialesFiltradosRepo.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
                  <FolderGit2 className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">No hay materiales aprobados para esta selección</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materialesFiltradosRepo.map((mat) => {
                    const curso = malla.find((c) => c.id === mat.curso_id);
                    const carrera = carreras.find((ca) => ca.id === mat.carrera_id);
                    return (
                      <article key={mat.id} className="rounded-2xl border border-slate-200 bg-white hover:border-[#002855] p-5 flex flex-col justify-between gap-4 shadow-sm">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-extrabold bg-red-50 text-red-700 border border-red-200">
                              [{curso?.codigo || "CURSO"}] • Ciclo {mat.ciclo || curso?.ciclo || 1}
                            </span>
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold border ${TEMA_CARRERA[mat.carrera_id].badgeSoft}`}>
                              {carrera?.nombre}
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0 mt-0.5">{renderIconoArchivo(mat.tipo_archivo)}</div>
                            <div className="space-y-1">
                              <h3 className="font-extrabold text-sm text-[#002855] leading-snug">{mat.titulo}</h3>
                              <p className="text-xs text-red-700 font-bold">Curso: {curso?.nombre_curso}</p>
                              <p className="text-xs text-slate-700 flex items-center gap-1.5 pt-0.5">
                                <UserCheck className="w-3.5 h-3.5 text-[#002855]" />
                                <span>Docente: <strong>{mat.docente}</strong></span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Subido por: <strong className="text-slate-800">{mat.autor_alias}</strong></span>
                          <a href={mat.url_archivo} target="_blank" rel="noreferrer" className="px-3.5 py-1.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white font-bold flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5" /> Descargar
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </main>
      )}

      {/* VISTA D: CONTACTO (/contacto) */}
      {vistaActual === "/contacto" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase text-red-700">Directorio Telefónico e Institucional FCM</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002855]">Directorio y Mesa de Ayuda</h1>
              <p className="text-xs text-slate-600">Central Telefónica UNMSM: <strong>(01) 619-7000</strong></p>
              <div className="space-y-3 pt-1">
                {[
                  { area: "Decanato y Secretaría Académica", correo: "decanato.matematicas@unmsm.edu.pe", anexo: "Anexo 1401 / 1402" },
                  { area: "Matrícula, Registros Académicos, Grados y Títulos", correo: "matricula.fcm@unmsm.edu.pe", anexo: "Anexo 1408" },
                  { area: "Escuela Profesional de Computación Científica", correo: "epcc.matematicas@unmsm.edu.pe", anexo: "Anexo 1425" },
                  { area: "CERSEU / SECOMAT / Unidad de Economía", correo: "economia.fcm@unmsm.edu.pe", anexo: "Anexos 1412 / 1420 / 1410" },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold text-[#002855] flex items-center gap-2"><Mail className="w-4 h-4 text-red-700" /> {item.area}</h3>
                      <span className="text-[11px] font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">{item.anexo}</span>
                    </div>
                    <p className="text-xs font-mono text-slate-700">{item.correo}</p>
                  </div>
                ))}

                {/* Redes Sociales y Canales Oficiales FCM */}
                <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/60 to-white p-4 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-red-700" />
                    <h3 className="text-xs font-extrabold text-[#002855]">Redes Sociales y Canales Oficiales</h3>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Sigue las transmisiones en vivo de ceremonias, conferencias magistrales, eventos y comunicados:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href="https://www.facebook.com/FacultadDeCienciasMatematicasOficial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-blue-200 hover:border-[#1877F2] text-xs font-extrabold transition-all shadow-2xs hover:scale-102"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                      <span>Facebook</span>
                    </a>
                    <a
                      href="https://www.instagram.com/facultaddecienciasmatematicas/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gradient-to-r hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-pink-700 hover:text-white border border-pink-200 text-xs font-extrabold transition-all shadow-2xs hover:scale-102"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                    </a>
                    <a
                      href="https://www.youtube.com/@fcmunmsm/videos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FF0000] text-red-700 hover:text-white border border-red-200 text-xs font-extrabold transition-all shadow-2xs hover:scale-102"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      <span>YouTube</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
                <h2 className="text-xl font-extrabold text-[#002855]">Formulario de Soporte Estudiantil</h2>
                {ticketEnviadoOk ? (
                  <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h3 className="text-base font-bold text-slate-900">¡Consulta enviada correctamente!</h3>
                    <button onClick={() => setTicketEnviadoOk(false)} className="px-4 py-2 rounded-xl bg-[#002855] text-xs font-bold text-white">Enviar otro mensaje</button>
                  </div>
                ) : (
                  <form onSubmit={handleEnviarContacto} className="space-y-4">
                    {/* Campo Honeypot Anti-Bot (invisible para usuarios) */}
                    <input
                      type="text"
                      name="bot_trap_field"
                      value={formContacto.bot_trap}
                      onChange={(e) => setFormContacto({ ...formContacto, bot_trap: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      style={{ display: "none" }}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input type="text" required value={formContacto.nombre} onChange={(e) => setFormContacto({ ...formContacto, nombre: e.target.value })} placeholder="Nombre completo *" className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs" />
                      <input type="email" required value={formContacto.email} onChange={(e) => setFormContacto({ ...formContacto, email: e.target.value })} placeholder="Correo institucional (@unmsm.edu.pe) *" className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs" />
                    </div>
                    <input type="text" required value={formContacto.asunto} onChange={(e) => setFormContacto({ ...formContacto, asunto: e.target.value })} placeholder="Asunto de la consulta *" className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs" />
                    <textarea rows={4} required value={formContacto.mensaje} onChange={(e) => setFormContacto({ ...formContacto, mensaje: e.target.value })} placeholder="Describe tu solicitud..." className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs" />
                    <button type="submit" className="w-full py-3 rounded-xl bg-[#002855] hover:bg-blue-900 text-xs font-extrabold text-white">Enviar Mensaje a Soporte</button>
                  </form>
                )}
              </div>
            </section>
          </div>
        </main>
      )}

      {/* VISTA E: PANEL DE ADMINISTRACIÓN CMS (/admin) */}
      {vistaActual === "/admin" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
          {!adminAutenticado ? (
            <div className="max-w-md mx-auto rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto"><Lock className="w-6 h-6 text-red-700" /></div>
              <div>
                <h2 className="text-xl font-extrabold text-[#002855]">Acceso Restringido • Administración FCM</h2>
                <p className="text-xs text-slate-600 mt-1">
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
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#002855]"
                />
                {errorPin && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errorPin}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={cargandoAuthAdmin}
                  className="w-full py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-xs font-extrabold text-white cursor-pointer transition-colors flex items-center justify-center gap-2"
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
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#002855] text-white rounded-2xl p-5 border-b-4 border-red-700">
                <div>
                  <h1 className="text-lg sm:text-xl font-extrabold">Panel de Administración CMS • FCM UNMSM</h1>
                  <p className="text-xs text-blue-200">Sincronizado con la tabla <code className="text-red-300">portal_config</code> de Supabase.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "dashboard", label: "📊 Resumen" },
                    { id: "carreras_cms", label: "🏛️ Gestión de Carreras" },
                    { id: "noticias", label: `📰 Noticias (${noticias.length})` },
                    { id: "docentes_cms", label: `👨‍🏫 Docentes (${docentes.length})` },
                    { id: "moderacion", label: `🛡️ Moderación (${materialesPendientes.length + resenasDocentes.length})` },
                    { id: "storage", label: `🖼️ Imágenes Storage (${imagenesStorage.length})` },
                    { id: "malla", label: `🎓 Mallas (${malla.length})` },
                    { id: "soporte", label: `📬 Soporte (${tickets.length})` },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTabAdmin(t.id as typeof tabAdmin)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${tabAdmin === t.id ? "bg-red-700 text-white shadow" : "bg-blue-900 text-blue-100 hover:bg-blue-800"}`}
                    >
                      {t.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleCerrarSesionAdmin}
                    className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-black text-red-300 border border-red-500/40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" /> Salir
                  </button>
                </div>
              </div>

              {tabAdmin === "dashboard" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div onClick={() => setTabAdmin("carreras_cms")} className="rounded-2xl border-2 border-blue-200 bg-white p-5 cursor-pointer hover:border-[#002855]">
                    <p className="text-xs text-[#002855] font-extrabold uppercase">Gestión de Carreras</p>
                    <p className="text-3xl font-extrabold text-[#002855] mt-2">4 Escuelas</p>
                  </div>
                  <div onClick={() => setTabAdmin("noticias")} className="rounded-2xl border-2 border-red-200 bg-white p-5 cursor-pointer hover:border-red-600">
                    <p className="text-xs text-red-700 font-extrabold uppercase">Noticias Activas</p>
                    <p className="text-3xl font-extrabold text-[#002855] mt-2">{noticias.length}</p>
                  </div>
                  <div onClick={() => setTabAdmin("docentes_cms")} className="rounded-2xl border-2 border-emerald-200 bg-white p-5 cursor-pointer hover:border-emerald-700">
                    <p className="text-xs text-emerald-700 font-extrabold uppercase">Plana Docente</p>
                    <p className="text-3xl font-extrabold text-[#002855] mt-2">{docentes.length}</p>
                  </div>
                  <div onClick={() => setTabAdmin("moderacion")} className="rounded-2xl border border-slate-200 bg-white p-5 cursor-pointer hover:border-[#002855]">
                    <p className="text-xs text-[#002855] font-extrabold uppercase">Archivos Pendientes</p>
                    <p className="text-3xl font-extrabold text-[#002855] mt-2">{materialesPendientes.length}</p>
                  </div>
                  <div onClick={() => setTabAdmin("storage")} className="rounded-2xl border border-slate-200 bg-white p-5 cursor-pointer hover:border-[#002855]">
                    <p className="text-xs text-[#002855] font-extrabold uppercase">Supabase Storage & Logo</p>
                    <p className="text-3xl font-extrabold text-[#002855] mt-2">{imagenesStorage.length}</p>
                  </div>
                </div>
              )}

              {tabAdmin === "carreras_cms" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
                    <h3 className="text-lg font-extrabold text-[#002855] border-b border-slate-200 pb-3">
                      Actualizar Imagen Referencial y Tríptico PDF por Carrera
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {carreras.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSeleccionarCarreraEnAdmin(c.id)}
                          className={`px-3 py-2.5 rounded-xl text-xs font-extrabold border ${adminCarreraEditId === c.id ? "bg-[#002855] text-white border-[#002855]" : "bg-slate-50 text-slate-700 border-slate-300"}`}
                        >
                          {c.nombre}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleGuardarDatosCarreraAdmin} className="space-y-5">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-extrabold text-[#002855]">Imagen Referencial de {carreraAdminSeleccionada.nombre}</label>
                          <button type="button" onClick={() => inputImagenCarreraRef.current?.click()} className="px-3 py-1.5 rounded-lg bg-[#002855] text-white text-[11px] font-bold flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" /> {subiendoAssetCarrera ? "Subiendo..." : "Subir Imagen (Storage)"}
                          </button>
                          <input ref={inputImagenCarreraRef} type="file" accept="image/*" onChange={handleSubirImagenCarreraStorage} className="hidden" />
                        </div>
                        <input type="url" value={urlImagenCarreraInput} onChange={(e) => setUrlImagenCarreraInput(e.target.value)} placeholder="URL pública de la imagen referencial..." className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs" />
                      </div>

                      <div className="p-4 rounded-2xl bg-red-50/40 border border-red-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-extrabold text-red-800">Archivo PDF del Tríptico de {carreraAdminSeleccionada.nombre}</label>
                          <button type="button" onClick={() => inputTripticoPdfRef.current?.click()} className="px-3 py-1.5 rounded-lg bg-red-700 text-white text-[11px] font-bold flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" /> Subir PDF (Storage)
                          </button>
                          <input ref={inputTripticoPdfRef} type="file" accept="application/pdf" onChange={handleSubirTripticoPdfStorage} className="hidden" />
                        </div>
                        <input type="url" value={urlTripticoCarreraInput} onChange={(e) => setUrlTripticoCarreraInput(e.target.value)} placeholder="URL del PDF en Supabase Storage..." className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs" />
                      </div>

                      <div className="flex gap-3">
                        <button type="submit" className="flex-1 py-3 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-extrabold">
                          Guardar en Supabase ({carreraAdminSeleccionada.nombre})
                        </button>
                        <button type="button" onClick={() => navegarACarrera(adminCarreraEditId)} className="px-4 py-3 rounded-xl bg-slate-100 text-xs font-bold text-[#002855]">
                          Ver Carrera →
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 space-y-4 h-fit">
                    <h4 className="text-xs font-extrabold uppercase text-slate-500">Vista Previa ({carreraAdminSeleccionada.nombre})</h4>
                    <img src={carreraAdminSeleccionada.imagen_referencial_url} alt={carreraAdminSeleccionada.nombre} className="w-full h-60 object-cover rounded-xl shadow-md border border-slate-200" />
                    <p className="text-xs text-slate-600">{carreraAdminSeleccionada.vision_carrera}</p>
                  </div>
                </div>
              )}

              {tabAdmin === "noticias" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Columna Izquierda: Editor Enriquecido con Barra de Herramientas */}
                    <form onSubmit={handleGuardarNoticia} className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <h3 className="font-extrabold text-base text-[#002855]">
                          {formNoticia.id ? "✏️ Editar Noticia / Comunicado" : "➕ Publicar Nueva Noticia Estructurada"}
                        </h3>
                        {formNoticia.id && (
                          <button
                            type="button"
                            onClick={() =>
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
                              })
                            }
                            className="text-xs font-bold text-red-700 hover:underline"
                          >
                            Cancelar edición
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        value={formNoticia.titulo}
                        onChange={(e) => setFormNoticia({ ...formNoticia, titulo: e.target.value })}
                        placeholder="Título de la Noticia o Evento *"
                        className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs font-bold"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="date"
                          required
                          value={formNoticia.fecha_publicacion}
                          onChange={(e) => setFormNoticia({ ...formNoticia, fecha_publicacion: e.target.value })}
                          className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                        />
                        <input
                          type="text"
                          value={formNoticia.categoria}
                          onChange={(e) => setFormNoticia({ ...formNoticia, categoria: e.target.value })}
                          placeholder="Categoría (ej. Evento, Comunicado, Becas)"
                          className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                        />
                      </div>

                      <input
                        type="text"
                        value={formNoticia.resumen}
                        onChange={(e) => setFormNoticia({ ...formNoticia, resumen: e.target.value })}
                        placeholder="Resumen corto para la tarjeta del Home (opcional, máx. 3 líneas)"
                        className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2 text-xs"
                      />

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700">Imagen o Afiche de Portada *</label>
                          <button
                            type="button"
                            onClick={() => inputImagenNoticiaRef.current?.click()}
                            className="text-[11px] font-bold text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3 h-3" /> Subir desde PC (Storage)
                          </button>
                          <input ref={inputImagenNoticiaRef} type="file" accept="image/*" onChange={handleSubirImagenPortadaNoticia} className="hidden" />
                        </div>
                        <input
                          type="url"
                          required
                          value={formNoticia.imagen_url}
                          onChange={(e) => setFormNoticia({ ...formNoticia, imagen_url: e.target.value })}
                          placeholder="URL pública de la imagen o afiche..."
                          className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                        />
                      </div>

                      {/* Barra de Herramientas de Formato */}
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-[#002855]">
                          Contenido Estructurado de la Noticia (Usa los botones para ordenar el texto) *
                        </label>
                        <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-100 border border-slate-300">
                          <button
                            type="button"
                            onClick={() => insertarFormatoNoticia("bold")}
                            title="Negrita (**texto**)"
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#002855] hover:text-white border border-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Bold className="w-3.5 h-3.5" /> <span>Negrita</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertarFormatoNoticia("italic")}
                            title="Cursiva (*texto*)"
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#002855] hover:text-white border border-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Italic className="w-3.5 h-3.5" /> <span>Cursiva</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertarFormatoNoticia("h2")}
                            title="Subtítulo (## Título)"
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#002855] hover:text-white border border-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Heading2 className="w-3.5 h-3.5" /> <span>Subtítulo</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertarFormatoNoticia("ul")}
                            title="Lista con viñetas (- item)"
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#002855] hover:text-white border border-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <List className="w-3.5 h-3.5" /> <span>Viñetas</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertarFormatoNoticia("ol")}
                            title="Lista numerada (1. item)"
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#002855] hover:text-white border border-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <ListOrdered className="w-3.5 h-3.5" /> <span>Numerada</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertarFormatoNoticia("link")}
                            title="Insertar enlace ([Texto](https://...))"
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#002855] hover:text-white border border-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Link2 className="w-3.5 h-3.5" /> <span>Enlace</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertarFormatoNoticia("quote")}
                            title="Recuadro destacado (> Nota)"
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#002855] hover:text-white border border-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Quote className="w-3.5 h-3.5" /> <span>Destacado</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertarFormatoNoticia("hr")}
                            title="Separador (---)"
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#002855] hover:text-white border border-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" /> <span>Separador</span>
                          </button>
                        </div>

                        <textarea
                          ref={textareaNoticiaRef}
                          rows={8}
                          required
                          value={formNoticia.contenido}
                          onChange={(e) => setFormNoticia({ ...formNoticia, contenido: e.target.value })}
                          placeholder="Escribe aquí el cuerpo de la noticia. Usa saltos de línea, ## para subtítulos, - para listas y **negrita**..."
                          className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-3 text-xs font-mono leading-relaxed"
                        />
                      </div>

                      {/* Campos opcionales ordenados para Eventos / Convocatorias */}
                      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                        <p className="text-xs font-extrabold text-[#002855]">
                          📌 Ficha Rápida del Evento / Convocatoria (Opcional)
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={formNoticia.fecha_evento}
                            onChange={(e) => setFormNoticia({ ...formNoticia, fecha_evento: e.target.value })}
                            placeholder="Fecha / Hora del evento (ej. Sáb. 07 Nov - 9:00 a.m.)"
                            className="rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs"
                          />
                          <input
                            type="text"
                            value={formNoticia.lugar}
                            onChange={(e) => setFormNoticia({ ...formNoticia, lugar: e.target.value })}
                            placeholder="Lugar / Aula (ej. Auditorio FCM / FISI)"
                            className="rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs"
                          />
                          <input
                            type="text"
                            value={formNoticia.modalidad}
                            onChange={(e) => setFormNoticia({ ...formNoticia, modalidad: e.target.value })}
                            placeholder="Modalidad (ej. Presencial / Equipos de 3)"
                            className="rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs"
                          />
                          <input
                            type="text"
                            value={formNoticia.dirigido_a}
                            onChange={(e) => setFormNoticia({ ...formNoticia, dirigido_a: e.target.value })}
                            placeholder="Dirigido a (ej. Estudiantes de Pregrado)"
                            className="rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs"
                          />
                        </div>
                        <input
                          type="url"
                          value={formNoticia.enlace_inscripcion}
                          onChange={(e) => setFormNoticia({ ...formNoticia, enlace_inscripcion: e.target.value })}
                          placeholder="URL de Inscripción o Bases Oficiales (https://forms.gle/...)"
                          className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs"
                        />
                      </div>

                      {/* Opciones de Publicación en Portada y Color de Fondo */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-xs font-extrabold text-[#002855]">
                              ⭐ Proyección en Sección Principal (Carrusel de Portada)
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Determina si este comunicado se proyectará en el slider principal del Home.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formNoticia.en_carrusel_principal ?? true}
                              onChange={(e) =>
                                setFormNoticia({ ...formNoticia, en_carrusel_principal: e.target.checked })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
                          </label>
                        </div>

                        {/* Selector de Color de Fondo para la Noticia */}
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700">
                              🎨 Color de Fondo del Banner para esta Noticia
                            </label>
                            <div className="flex items-center gap-2">
                              <span
                                className="w-4 h-4 rounded-full border border-slate-300 shadow-xs inline-block"
                                style={{ backgroundColor: formNoticia.color_fondo || "#4d0713" }}
                              />
                              <span className="font-mono text-[11px] text-slate-600 font-bold">
                                {formNoticia.color_fondo || "#4d0713"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { label: "Guinda San Marcos", hex: "#4d0713" },
                              { label: "Azul UNMSM", hex: "#002855" },
                              { label: "Carbón Elegante", hex: "#0f172a" },
                              { label: "Verde Esmeralda", hex: "#064e3b" },
                            ].map((paleta) => (
                              <button
                                key={paleta.hex}
                                type="button"
                                onClick={() => setFormNoticia({ ...formNoticia, color_fondo: paleta.hex })}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer ${
                                  formNoticia.color_fondo === paleta.hex
                                    ? "ring-2 ring-offset-2 ring-red-600 scale-102 shadow-md"
                                    : "opacity-85 hover:opacity-100"
                                }`}
                                style={{ backgroundColor: paleta.hex }}
                              >
                                <span>{paleta.label}</span>
                              </button>
                            ))}

                            <div className="flex items-center gap-1.5 pl-1">
                              <input
                                type="color"
                                value={formNoticia.color_fondo || "#4d0713"}
                                onChange={(e) => setFormNoticia({ ...formNoticia, color_fondo: e.target.value })}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                                title="Selector de color personalizado"
                              />
                              <span className="text-[11px] text-slate-500 font-medium">Personalizado</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formNoticia.destacado}
                          onChange={(e) => setFormNoticia({ ...formNoticia, destacado: e.target.checked })}
                        />
                        Destacar como &ldquo;Importante&rdquo;
                      </label>

                      <button type="submit" className="w-full py-3 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-extrabold cursor-pointer">
                        {formNoticia.id ? "Guardar Cambios en Supabase" : "Publicar Noticia en Supabase"}
                      </button>
                    </form>

                    {/* Columna Derecha: Vista Previa en Vivo */}
                    <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs sticky top-20">
                      <div className="bg-[#002855] text-white px-4 py-2.5 border-b-2 border-red-600 flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider">👁️ Vista Previa en Vivo</span>
                        <span className="text-[10px] font-mono text-blue-200">Así lo leerán los alumnos</span>
                      </div>
                      <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                        {formNoticia.imagen_url && (
                          <div className="rounded-xl bg-slate-950 overflow-hidden max-h-56 flex items-center justify-center">
                            <img src={formNoticia.imagen_url} alt="Preview" className="max-h-56 w-auto object-contain" />
                          </div>
                        )}
                        <div className="space-y-1.5">
                          <span className="px-2.5 py-0.5 rounded bg-[#002855] text-white text-[10px] font-bold">
                            {formNoticia.categoria || "Comunicado Oficial"}
                          </span>
                          <h4 className="text-base font-extrabold text-[#002855] leading-snug">
                            {formNoticia.titulo || "Título de la noticia..."}
                          </h4>
                          {formNoticia.resumen && (
                            <p className="text-xs text-slate-500 italic">{formNoticia.resumen}</p>
                          )}
                        </div>
                        <div className="border-t border-slate-100 pt-3">
                          {renderizarContenidoNoticia(
                            formNoticia.contenido || "Escribe en el editor para previsualizar el formato..."
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Noticias Publicadas */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-extrabold text-[#002855]">Noticias Publicadas ({noticias.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {noticias.map((n) => (
                        <div key={n.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <img src={n.imagen_url} alt={n.titulo} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" />
                            <div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-[11px] font-bold text-red-700">{n.categoria} • {n.fecha_publicacion}</span>
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shrink-0 shadow-xs"
                                  style={{ backgroundColor: n.color_fondo || "#4d0713" }}
                                  title={`Color en carrusel: ${n.color_fondo || "#4d0713"}`}
                                />
                                {n.en_carrusel_principal !== false && (
                                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full border border-amber-300">
                                    ⭐ Portada
                                  </span>
                                )}
                              </div>
                              <h4 className="font-extrabold text-xs sm:text-sm text-[#002855] line-clamp-2">{n.titulo}</h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                            <button
                              type="button"
                              onClick={() => handleToggleCarruselPrincipal(n.id)}
                              title={n.en_carrusel_principal !== false ? "Desactivar de carrusel de portada" : "Activar en carrusel de portada"}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                                n.en_carrusel_principal !== false
                                  ? "bg-amber-500 text-white hover:bg-amber-600 shadow-xs"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {n.en_carrusel_principal !== false ? "⭐ Portada" : "⚪ Off"}
                            </button>
                            <button
                              type="button"
                              onClick={() => abrirNoticiaDetalle(n.id)}
                              title="Ver noticia"
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-[#002855] text-[11px] font-bold cursor-pointer hover:bg-blue-100"
                            >
                              Ver
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFormNoticia({
                                  id: n.id,
                                  titulo: n.titulo,
                                  categoria: n.categoria,
                                  resumen: n.resumen || "",
                                  fecha_publicacion: n.fecha_publicacion,
                                  contenido: n.contenido,
                                  imagen_url: n.imagen_url,
                                  destacado: n.destacado,
                                  en_carrusel_principal: n.en_carrusel_principal ?? true,
                                  color_fondo: n.color_fondo || "#4d0713",
                                  fecha_evento: n.fecha_evento || "",
                                  lugar: n.lugar || "",
                                  modalidad: n.modalidad || "",
                                  dirigido_a: n.dirigido_a || "",
                                  enlace_inscripcion: n.enlace_inscripcion || "",
                                })
                              }
                              className="p-2 rounded-lg bg-slate-100 text-[#002855] hover:bg-slate-200 cursor-pointer"
                              title="Editar noticia"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const filtradas = noticias.filter((item) => item.id !== n.id);
                                setNoticias(filtradas);
                                await sincronizarPortalConfigSupabase({ noticias_data: filtradas });
                                lanzarToast("🗑️ Noticia eliminada de Supabase.");
                              }}
                              className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-700 hover:text-white cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PESTAÑA CMS: GESTIÓN DE PLANA DOCENTE (CRUD COMPLETO + SUPABASE) */}
              {tabAdmin === "docentes_cms" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <form onSubmit={handleGuardarDocente} className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h3 className="font-extrabold text-base text-[#002855]">
                        {formDocente.id ? "✏️ Editar Ficha de Docente" : "👨‍🏫 Registrar Docente en la Facultad"}
                      </h3>
                      {formDocente.id && (
                        <button
                          type="button"
                          onClick={() =>
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
                            })
                          }
                          className="text-xs font-bold text-red-700 hover:underline"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={formDocente.grado_academico}
                        onChange={(e) => setFormDocente({ ...formDocente, grado_academico: e.target.value as Docente["grado_academico"] })}
                        className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-bold"
                      >
                        <option value="Dr.">Dr.</option>
                        <option value="Dra.">Dra.</option>
                        <option value="Mg.">Mg.</option>
                        <option value="Lic.">Lic.</option>
                      </select>
                      <input
                        type="text"
                        required
                        value={formDocente.nombre_completo}
                        onChange={(e) => setFormDocente({ ...formDocente, nombre_completo: e.target.value })}
                        placeholder="Apellidos y Nombres *"
                        className="col-span-2 rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={formDocente.carrera_id}
                        onChange={(e) => setFormDocente({ ...formDocente, carrera_id: e.target.value as CarreraId })}
                        className="rounded-xl bg-slate-50 border border-slate-300 px-2.5 py-2 text-xs font-semibold"
                      >
                        {carreras.map((c) => (
                          <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                      </select>
                      <select
                        value={formDocente.categoria_docente}
                        onChange={(e) => setFormDocente({ ...formDocente, categoria_docente: e.target.value as Docente["categoria_docente"] })}
                        className="rounded-xl bg-slate-50 border border-slate-300 px-2.5 py-2 text-xs font-semibold"
                      >
                        <option value="Principal">Principal</option>
                        <option value="Asociado">Asociado</option>
                        <option value="Auxiliar">Auxiliar</option>
                      </select>
                      <select
                        value={formDocente.condicion}
                        onChange={(e) => setFormDocente({ ...formDocente, condicion: e.target.value as Docente["condicion"] })}
                        className="rounded-xl bg-slate-50 border border-slate-300 px-2.5 py-2 text-xs font-semibold"
                      >
                        <option value="Nombrado">Nombrado</option>
                        <option value="Contratado">Contratado</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">Fotografía del Docente (o dejar vacío para Avatar)</label>
                        <button
                          type="button"
                          onClick={() => inputFotoDocenteRef.current?.click()}
                          className="text-[11px] font-bold text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" /> {subiendoFotoDocente ? "Subiendo..." : "Subir Foto"}
                        </button>
                        <input ref={inputFotoDocenteRef} type="file" accept="image/*" onChange={handleSubirFotoDocenteStorage} className="hidden" />
                      </div>
                      <input
                        type="url"
                        value={formDocente.foto_url}
                        onChange={(e) => setFormDocente({ ...formDocente, foto_url: e.target.value })}
                        placeholder="URL de la foto (Supabase Storage o externa)..."
                        className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                      />
                    </div>

                    <input
                      type="text"
                      required
                      value={formDocente.especialidad}
                      onChange={(e) => setFormDocente({ ...formDocente, especialidad: e.target.value })}
                      placeholder="Especialidad principal (ej. Optimización Convexa, Deep Learning) *"
                      className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                    />

                    <textarea
                      rows={2}
                      value={formDocente.lineas_investigacion}
                      onChange={(e) => setFormDocente({ ...formDocente, lineas_investigacion: e.target.value })}
                      placeholder="Líneas de investigación activas..."
                      className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                    />

                    <input
                      type="text"
                      value={formDocente.cursos_dictados_texto}
                      onChange={(e) => setFormDocente({ ...formDocente, cursos_dictados_texto: e.target.value })}
                      placeholder="Cursos que dicta separados por coma (ej. CS113 - POO II, AI264 - Deep Learning)"
                      className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="email"
                        value={formDocente.correo}
                        onChange={(e) => setFormDocente({ ...formDocente, correo: e.target.value })}
                        placeholder="Correo (@unmsm.edu.pe)"
                        className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        value={formDocente.horario_asesoria}
                        onChange={(e) => setFormDocente({ ...formDocente, horario_asesoria: e.target.value })}
                        placeholder="Horario de asesoría"
                        className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="url"
                        value={formDocente.cti_vitae_url}
                        onChange={(e) => setFormDocente({ ...formDocente, cti_vitae_url: e.target.value })}
                        placeholder="URL CTI Vitae (CONCYTEC)"
                        className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                      />
                      <input
                        type="url"
                        value={formDocente.orcid_url}
                        onChange={(e) => setFormDocente({ ...formDocente, orcid_url: e.target.value })}
                        placeholder="URL ORCID"
                        className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                      />
                      <input
                        type="url"
                        value={formDocente.google_scholar_url}
                        onChange={(e) => setFormDocente({ ...formDocente, google_scholar_url: e.target.value })}
                        placeholder="URL Google Scholar"
                        className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                      />
                      <input
                        type="url"
                        value={formDocente.linkedin_url}
                        onChange={(e) => setFormDocente({ ...formDocente, linkedin_url: e.target.value })}
                        placeholder="URL LinkedIn"
                        className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                      />
                    </div>

                    <button type="submit" className="w-full py-3 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-extrabold cursor-pointer">
                      {formDocente.id ? "Guardar Cambios del Docente" : "Registrar Docente en Supabase"}
                    </button>
                  </form>

                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap gap-2 bg-white border border-slate-200 p-3 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setAdminFiltroCarreraDocentes("TODAS")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                          adminFiltroCarreraDocentes === "TODAS" ? "bg-[#002855] text-white" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        Todas ({docentes.length})
                      </button>
                      {carreras.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setAdminFiltroCarreraDocentes(c.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                            adminFiltroCarreraDocentes === c.id ? TEMA_CARRERA[c.id].badgeSolid : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {c.nombre} ({docentes.filter((d) => d.carrera_id === c.id).length})
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {docentes
                        .filter((d) => adminFiltroCarreraDocentes === "TODAS" || d.carrera_id === adminFiltroCarreraDocentes)
                        .map((doc) => {
                          const temaD = TEMA_CARRERA[doc.carrera_id];
                          return (
                            <div key={doc.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {doc.foto_url ? (
                                  <img src={doc.foto_url} alt={doc.nombre_completo} className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" />
                                ) : (
                                  <div className={`w-14 h-14 rounded-xl ${temaD.headerBg} text-white font-extrabold text-sm flex items-center justify-center shrink-0`}>
                                    {obtenerInicialesDocente(doc.nombre_completo)}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold border ${temaD.badgeSoft}`}>
                                    {carreras.find((c) => c.id === doc.carrera_id)?.nombre}
                                  </span>
                                  <h4 className="font-extrabold text-xs sm:text-sm text-[#002855] truncate mt-0.5">
                                    {doc.grado_academico} {doc.nombre_completo}
                                  </h4>
                                  <p className="text-[11px] text-slate-500 truncate">{doc.especialidad}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleEditarDocenteEnAdmin(doc)}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-[#002855] cursor-pointer"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEliminarDocenteEnAdmin(doc.id)}
                                  className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-700 hover:text-white cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {tabAdmin === "storage" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 space-y-6 h-fit">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
                      <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                        <ImageIcon className="w-5 h-5 text-red-700" />
                        <div>
                          <h3 className="font-extrabold text-sm text-[#002855]">Subir Imagen a Supabase Storage</h3>
                          <p className="text-[11px] text-slate-500">Bucket público: <code className="font-bold text-red-700">fcm-assets</code></p>
                        </div>
                      </div>
                      <select
                        value={categoriaNuevaImagen}
                        onChange={(e) => setCategoriaNuevaImagen(e.target.value as typeof categoriaNuevaImagen)}
                        className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2.5 text-xs font-semibold"
                      >
                        <option value="Logo Institucional">Logo Institucional Transparente (Navbar)</option>
                        <option value="Fondo Hero Home">Fondo Difuminado para el Hero del Home</option>
                        <option value="Banner Noticia">Banner para Noticias del Home</option>
                        <option value="Foto Facultad">Foto Referencial de la Facultad</option>
                      </select>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-2xl border-2 border-dashed border-blue-900/40 hover:border-red-600 bg-slate-50 p-6 text-center cursor-pointer space-y-2"
                      >
                        <Upload className="w-8 h-8 text-[#002855] mx-auto" />
                        <p className="text-xs font-bold text-[#002855]">
                          {subiendoStorage ? "Subiendo imagen..." : "Haz clic aquí para elegir una imagen de tu PC"}
                        </p>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleSubirArchivoStorage} className="hidden" />
                      </div>
                    </div>

                    {/* Configuración directa del Fondo Difuminado, Opacidad y Color del Hero */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                      <div className="border-b border-slate-200 pb-2.5">
                        <h3 className="font-extrabold text-sm text-[#002855]">
                          🖼️ Personalización del Fondo Hero (Difuminado, Opacidad y Color)
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Ajusta el nivel de desenfoque, el porcentaje de transparencia y el color de la capa superpuesta.
                        </p>
                      </div>

                      {/* Vista Previa en Tiempo Real */}
                      <div
                        className="relative h-32 rounded-xl overflow-hidden border border-slate-200 transition-colors"
                        style={{ backgroundColor: heroOverlayColor || "#0f172a" }}
                      >
                        <img
                          src={heroBgInputUrl || heroBgUrl || HERO_BG_DEFAULT}
                          alt="Vista previa Hero"
                          className="w-full h-full object-cover transition-all duration-300"
                          style={{ filter: `blur(${heroBlur}px)` }}
                        />
                        <div
                          className="absolute inset-0 transition-all duration-200"
                          style={{
                            backgroundColor: heroOverlayColor || "#0f172a",
                            opacity: Math.min(0.95, Math.max(0, heroOverlayOpacity / 100)),
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 flex flex-col items-center justify-center p-3 text-center">
                          <span className="text-xs font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                            Vista Previa en Vivo • Portal Académico FCM
                          </span>
                          <span className="mt-1 px-2.5 py-0.5 rounded-full bg-black/55 text-[10px] font-bold text-white border border-white/20">
                            Difuminado: {heroBlur}px • Capa: {heroOverlayOpacity}% ({heroOverlayColor})
                          </span>
                        </div>
                      </div>

                      {/* URL de la imagen */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold text-slate-700">URL de la Imagen de Fondo:</label>
                        <input
                          type="url"
                          value={heroBgInputUrl}
                          onChange={(e) => setHeroBgInputUrl(e.target.value)}
                          placeholder="Pega aquí la URL de la imagen de fondo para el Hero..."
                          className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                        />
                      </div>

                      {/* Control Deslizante 1: Nivel de Difuminado (Blur en px) */}
                      <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-[#002855]">1. Nivel de Difuminado (Desenfoque):</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#002855] text-white font-mono text-[11px] font-bold">
                            {heroBlur} px {heroBlur === 0 ? "(Nítido)" : heroBlur <= 1.5 ? "(Sutil)" : "(Intenso)"}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={8}
                          step={0.5}
                          value={heroBlur}
                          onChange={(e) => setHeroBlur(Number(e.target.value))}
                          className="w-full accent-[#002855] cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                          <span>0px (Sin blur)</span>
                          <span>1px (Recomendado)</span>
                          <span>4px (Medio)</span>
                          <span>8px (Máximo)</span>
                        </div>
                      </div>

                      {/* Control Deslizante 2: Porcentaje de Opacidad de la Capa */}
                      <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-[#002855]">2. Opacidad / Oscuridad del Fondo:</span>
                          <span className="px-2 py-0.5 rounded-md bg-red-700 text-white font-mono text-[11px] font-bold">
                            {heroOverlayOpacity}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={90}
                          step={5}
                          value={heroOverlayOpacity}
                          onChange={(e) => setHeroOverlayOpacity(Number(e.target.value))}
                          className="w-full accent-red-700 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                          <span>0% (Imagen 100% libre)</span>
                          <span>45% (Equilibrado)</span>
                          <span>90% (Muy oscuro)</span>
                        </div>
                      </div>

                      {/* Selector 3: Color de la Capa (Normal Neutro, Negro, Gris, Azul o Libre) */}
                      <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-[#002855]">3. Color del Filtro / Capa:</span>
                          <span className="font-mono text-[11px] font-bold text-slate-600">{heroOverlayColor}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { label: "Neutro Carbón (Normal)", hex: "#0f172a" },
                            { label: "Negro Cinematográfico", hex: "#000000" },
                            { label: "Gris Grafito Suave", hex: "#27272a" },
                            { label: "Azul Institucional", hex: "#002855" },
                          ].map((preset) => (
                            <button
                              key={preset.hex}
                              type="button"
                              onClick={() => setHeroOverlayColor(preset.hex)}
                              className={`px-2.5 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                                heroOverlayColor.toLowerCase() === preset.hex.toLowerCase()
                                  ? "border-[#002855] bg-blue-50 text-[#002855] ring-2 ring-[#002855]/20"
                                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-white shadow-xs shrink-0"
                                style={{ backgroundColor: preset.hex }}
                              />
                              <span className="truncate">{preset.label}</span>
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-semibold text-slate-600">O elige un color personalizado:</span>
                          <input
                            type="color"
                            value={heroOverlayColor}
                            onChange={(e) => setHeroOverlayColor(e.target.value)}
                            className="w-9 h-7 rounded cursor-pointer border border-slate-300 bg-white p-0.5"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleUsarComoFondoHero(heroBgInputUrl, heroBlur, heroOverlayOpacity, heroOverlayColor)
                          }
                          className="flex-1 py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-extrabold cursor-pointer shadow-xs"
                        >
                          Guardar Personalización del Banner
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUsarComoFondoHero(HERO_BG_DEFAULT, 1, 45, "#0f172a")}
                          className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                        >
                          Restaurar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
                    {imagenesStorage.map((img) => (
                      <div key={img.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between">
                        <div>
                          <div className="relative h-36 bg-slate-100 border-b border-slate-200">
                            <img src={img.url_publica} alt={img.nombre_archivo} className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-[#002855] text-white text-[10px] font-bold">{img.categoria}</span>
                          </div>
                          <div className="p-3.5">
                            <p className="text-xs font-extrabold text-[#002855] truncate">{img.nombre_archivo}</p>
                            <p className="text-[10px] text-slate-400">{img.tamano_kb} • {img.fecha_subida}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(img.url_publica);
                              setUrlCopiadaId(img.id);
                              setTimeout(() => setUrlCopiadaId(null), 2000);
                              lanzarToast("📋 URL pública copiada.");
                            }}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-[#002855] text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            {urlCopiadaId === img.id ? <><Check className="w-3 h-3" /> Copiada</> : <><Copy className="w-3 h-3" /> Copiar URL</>}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUsarComoFondoHero(img.url_publica)}
                            className="py-1.5 px-2.5 rounded-lg bg-blue-100 hover:bg-[#002855] hover:text-white text-[#002855] text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Usar en Hero
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUsarComoLogo(img.url_publica)}
                            className="py-1.5 px-2.5 rounded-lg bg-slate-200 hover:bg-red-700 hover:text-white text-slate-800 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Usar como Logo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tabAdmin === "moderacion" && (
                <div className="space-y-8">
                  {/* SECCIÓN 1: MODERACIÓN DE RESEÑAS Y CALIFICACIONES DE DOCENTES */}
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <div className="bg-[#002855] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-2 border-b-2 border-red-700">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <h3 className="text-sm font-extrabold">
                          Moderación de Calificaciones y Reseñas de Docentes ({resenasDocentes.length})
                        </h3>
                      </div>
                      <span className="text-[11px] text-blue-200">
                        Sincronizado en <code className="text-amber-300 font-bold">portal_config.resenas_docentes</code>
                      </span>
                    </div>

                    {resenasDocentes.length === 0 ? (
                      <div className="p-10 text-center space-y-2">
                        <Star className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-sm font-bold text-slate-700">Aún no se han registrado reseñas de docentes.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 uppercase text-[10px] border-b border-slate-200">
                              <th className="py-3 px-4">Docente Evaluado</th>
                              <th className="py-3 px-4">Calificación</th>
                              <th className="py-3 px-4">Curso / Autor</th>
                              <th className="py-3 px-4">Comentario de la Reseña</th>
                              <th className="py-3 px-4">Estado</th>
                              <th className="py-3 px-4 text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {resenasDocentes.map((resena) => {
                              const docInfo = docentes.find((d) => d.id === resena.docente_id);
                              return (
                                <tr key={resena.id} className="hover:bg-slate-50/80">
                                  <td className="py-3.5 px-4 font-extrabold text-[#002855]">
                                    {docInfo ? `${docInfo.grado_academico} ${docInfo.nombre_completo}` : resena.docente_id}
                                    <div className="text-[10px] font-normal text-slate-400">{resena.fecha}</div>
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 font-extrabold text-amber-800">
                                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                      <span>{resena.puntuacion}.0</span>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <div className="font-bold text-slate-800">{resena.curso}</div>
                                    <div className="text-[11px] text-slate-500">Por: {resena.autor_alias}</div>
                                  </td>
                                  <td className="py-3.5 px-4 max-w-md">
                                    <p className="text-slate-700 leading-relaxed line-clamp-3">{resena.comentario}</p>
                                  </td>
                                  <td className="py-3.5 px-4">
                                    {resena.estado === "aprobado" ? (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase">
                                        Pública
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold uppercase">
                                        Oculta / Pendiente
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                                    {resena.estado === "pendiente" ? (
                                      <button
                                        type="button"
                                        onClick={() => handleCambiarEstadoResenaAdmin(resena.id, "aprobado")}
                                        className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold cursor-pointer"
                                      >
                                        ✅ Aprobar
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleCambiarEstadoResenaAdmin(resena.id, "pendiente")}
                                        className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold cursor-pointer"
                                      >
                                        ⏸️ Ocultar
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleEliminarResenaDocenteAdmin(resena.id)}
                                      className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-700 text-red-700 hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                                    >
                                      🗑️ Eliminar
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* SECCIÓN 2: MODERACIÓN DE ARCHIVOS DEL REPOSITORIO PENDIENTES */}
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <div className="bg-slate-100 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-extrabold text-[#002855]">
                        Archivos del Repositorio Pendientes de Aprobación ({materialesPendientes.length})
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        Sincronizado en <code className="font-bold text-[#002855]">portal_config.materiales_data</code>
                      </span>
                    </div>
                    {materialesPendientes.length === 0 ? (
                      <div className="p-10 text-center space-y-2">
                        <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
                        <h3 className="text-sm font-bold text-slate-900">No hay archivos pendientes de moderación</h3>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#002855] text-white uppercase text-[11px]">
                              <th className="py-3.5 px-4">Material</th>
                              <th className="py-3.5 px-4">Carrera / Curso</th>
                              <th className="py-3.5 px-4">Docente / Autor</th>
                              <th className="py-3.5 px-4 text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {materialesPendientes.map((m) => {
                              const curso = malla.find((c) => c.id === m.curso_id);
                              const carrera = carreras.find((ca) => ca.id === m.carrera_id);
                              return (
                                <tr key={m.id}>
                                  <td className="py-4 px-4">
                                    <p className="font-bold text-[#002855]">{m.titulo}</p>
                                    <a
                                      href={m.url_archivo}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[11px] text-red-700 hover:underline font-mono"
                                    >
                                      Ver enlace del archivo ↗
                                    </a>
                                  </td>
                                  <td className="py-4 px-4">
                                    {carrera?.nombre} • [{curso?.codigo || m.curso_id}] {curso?.nombre_curso || `Ciclo ${m.ciclo}`}
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="font-semibold text-slate-800">{m.docente}</div>
                                    <div className="text-[10px] text-slate-500">Por: {m.autor_alias} ({m.fecha_subida})</div>
                                  </td>
                                  <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => handleAprobarMaterialAdmin(m.id)}
                                      className="px-3 py-1.5 rounded-lg bg-[#002855] hover:bg-blue-900 text-white font-bold cursor-pointer"
                                    >
                                      ✅ Aprobar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEliminarMaterialAdmin(m.id)}
                                      className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold cursor-pointer"
                                    >
                                      ❌ Rechazar
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* SECCIÓN 3: ARCHIVOS APROBADOS PUBLICADOS EN EL REPOSITORIO */}
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <div className="bg-slate-100 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-[#002855]">
                        Materiales Publicados en el Repositorio ({materialesAprobados.length})
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                            <th className="py-3 px-4">Título del Material</th>
                            <th className="py-3 px-4">Escuela / Asignatura</th>
                            <th className="py-3 px-4">Docente</th>
                            <th className="py-3 px-4 text-right">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {materialesAprobados.map((m) => {
                            const curso = malla.find((c) => c.id === m.curso_id);
                            const carrera = carreras.find((ca) => ca.id === m.carrera_id);
                            return (
                              <tr key={m.id} className="hover:bg-slate-50/70">
                                <td className="py-3 px-4 font-bold text-[#002855]">{m.titulo}</td>
                                <td className="py-3 px-4">
                                  {carrera?.nombre} • [{curso?.codigo || m.curso_id}] {curso?.nombre_curso || `Ciclo ${m.ciclo}`}
                                </td>
                                <td className="py-3 px-4">{m.docente}</td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleEliminarMaterialAdmin(m.id)}
                                    className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-700 text-red-700 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                                  >
                                    🗑️ Eliminar
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {tabAdmin === "malla" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <form onSubmit={handleGuardarCursoMalla} className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 space-y-3 h-fit">
                    <h3 className="font-extrabold text-sm text-[#002855]">Añadir Asignatura a la Malla</h3>
                    <select
                      value={formCursoMalla.carrera_id}
                      onChange={(e) => setFormCursoMalla({ ...formCursoMalla, carrera_id: e.target.value as CarreraId })}
                      className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                    >
                      {carreras.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" min={1} max={10} value={formCursoMalla.ciclo} onChange={(e) => setFormCursoMalla({ ...formCursoMalla, ciclo: Number(e.target.value) })} className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs" />
                      <input type="text" required value={formCursoMalla.codigo} onChange={(e) => setFormCursoMalla({ ...formCursoMalla, codigo: e.target.value })} placeholder="Código (ej. CS399)" className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs" />
                    </div>
                    <input type="text" required value={formCursoMalla.nombre_curso} onChange={(e) => setFormCursoMalla({ ...formCursoMalla, nombre_curso: e.target.value })} placeholder="Nombre de la asignatura *" className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs" />
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-[#002855] text-white text-xs font-bold">Guardar en la Malla</button>
                  </form>

                  <div className="lg:col-span-8 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {carreras.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setAdminFiltroCarreraMalla(c.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold ${adminFiltroCarreraMalla === c.id ? "bg-[#002855] text-white" : "bg-white text-slate-700 border border-slate-300"}`}
                        >
                          {c.nombre}
                        </button>
                      ))}
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden max-h-96 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#002855] text-white">
                            <th className="py-2.5 px-4">Ciclo</th>
                            <th className="py-2.5 px-4">Código</th>
                            <th className="py-2.5 px-4">Asignatura</th>
                            <th className="py-2.5 px-4">Créd.</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {malla.filter((c) => c.carrera_id === adminFiltroCarreraMalla).map((cur) => (
                            <tr key={cur.id}>
                              <td className="py-2.5 px-4">Ciclo {cur.ciclo}</td>
                              <td className="py-2.5 px-4 font-mono font-bold text-red-700">{cur.codigo}</td>
                              <td className="py-2.5 px-4 font-semibold">{cur.nombre_curso}</td>
                              <td className="py-2.5 px-4">{cur.creditos}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {tabAdmin === "soporte" && (
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-[#002855]">{t.asunto}</p>
                        <p className="text-xs text-slate-600">{t.mensaje}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700">{t.estado_atencion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* MODAL DE SUBIDA AL REPOSITORIO */}
      {modalSubirAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full rounded-3xl border-2 border-[#002855] bg-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-red-600 pb-3">
              <h3 className="text-lg font-extrabold text-[#002855]">➕ Aportar Material al Repositorio FCM</h3>
              <button onClick={() => setModalSubirAbierto(false)} className="text-xs font-bold text-slate-500 hover:text-red-700">✕ Cerrar</button>
            </div>
            {exitoSubidaModal ? (
              <div className="p-6 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-extrabold text-[#002855]">¡Gracias! Tu material será revisado antes de publicarse</h4>
                <button onClick={() => setModalSubirAbierto(false)} className="px-4 py-2 rounded-xl bg-[#002855] text-xs font-bold text-white">Cerrar</button>
              </div>
            ) : (
              <form onSubmit={handleSubidaRepositorioAnonima} className="space-y-3.5">
                {/* Campo Honeypot Anti-Bot (invisible para usuarios) */}
                <input
                  type="text"
                  name="bot_trap_upload"
                  value={formSubidaAnon.bot_trap}
                  onChange={(e) => setFormSubidaAnon({ ...formSubidaAnon, bot_trap: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  style={{ display: "none" }}
                />
                <div className="grid grid-cols-2 gap-3">
                  <select required value={formSubidaAnon.carrera_id} onChange={(e) => handleCambiarCarreraSubida(e.target.value as CarreraId)} className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2.5 text-xs font-semibold">
                    {carreras.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                  <select required value={formSubidaAnon.ciclo} onChange={(e) => handleCambiarCicloSubida(Number(e.target.value))} className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2.5 text-xs font-semibold">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => <option key={num} value={num}>Ciclo {num}</option>)}
                  </select>
                </div>
                <select required value={formSubidaAnon.curso_id} onChange={(e) => setFormSubidaAnon({ ...formSubidaAnon, curso_id: e.target.value })} className="w-full rounded-xl bg-blue-50/60 border border-blue-300 px-3 py-2.5 text-xs font-bold text-[#002855]">
                  {cursosDependientesSubida.map((cur) => <option key={cur.id} value={cur.id}>[{cur.codigo}] {cur.nombre_curso}</option>)}
                </select>
                <select required value={formSubidaAnon.docenteSeleccionado} onChange={(e) => setFormSubidaAnon({ ...formSubidaAnon, docenteSeleccionado: e.target.value })} className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2.5 text-xs font-semibold">
                  {docentes.map((doc) => {
                    const etiqueta = `${doc.grado_academico} ${doc.nombre_completo}`;
                    return (
                      <option key={doc.id} value={etiqueta}>
                        {etiqueta} ({carreras.find((c) => c.id === doc.carrera_id)?.nombre})
                      </option>
                    );
                  })}
                </select>
                <div className="grid grid-cols-3 gap-3">
                  <select value={formSubidaAnon.tipo_archivo} onChange={(e) => setFormSubidaAnon({ ...formSubidaAnon, tipo_archivo: e.target.value as TipoArchivo })} className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2.5 text-xs font-semibold">
                    <option value="Examen">Examen</option>
                    <option value="Apunte">Apunte</option>
                    <option value="Codigo">Código</option>
                    <option value="PDF">PDF</option>
                    <option value="Silabo">Sílabo</option>
                  </select>
                  <input type="text" required value={formSubidaAnon.titulo} onChange={(e) => setFormSubidaAnon({ ...formSubidaAnon, titulo: e.target.value })} placeholder="Título del Material *" className="col-span-2 rounded-xl bg-slate-50 border border-slate-300 px-3 py-2.5 text-xs" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input type="url" required value={formSubidaAnon.url_archivo} onChange={(e) => setFormSubidaAnon({ ...formSubidaAnon, url_archivo: e.target.value })} placeholder="URL (Google Drive / GitHub) *" className="col-span-2 rounded-xl bg-slate-50 border border-slate-300 px-3 py-2.5 text-xs" />
                  <input type="text" value={formSubidaAnon.autor_alias} onChange={(e) => setFormSubidaAnon({ ...formSubidaAnon, autor_alias: e.target.value })} placeholder="Alias (Opcional)" className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2.5 text-xs" />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-extrabold">Enviar Material a Revisión</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE UNIDADES DE SERVICIO AL ESTUDIANTE */}
      {servicioModalInfo && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border-2 border-[#002855] bg-white overflow-hidden shadow-2xl">
            <div className="bg-[#002855] text-white px-6 py-4 border-b-4 border-red-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-red-300 font-bold">{servicioModalInfo.sigla}</span>
                <h3 className="text-base font-extrabold text-white">{servicioModalInfo.titulo}</h3>
              </div>
              <button onClick={() => setServicioModalInfo(null)} className="text-xs font-bold text-blue-200 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-700 leading-relaxed">{servicioModalInfo.descripcion}</p>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-1.5">
                <p><strong className="text-[#002855]">Correo:</strong> <span className="font-mono text-red-700">{servicioModalInfo.correo}</span></p>
                <p><strong className="text-[#002855]">Teléfono:</strong> (01) 619-7000 — {servicioModalInfo.anexo}</p>
                <p><strong className="text-[#002855]">Horario:</strong> {servicioModalInfo.horario}</p>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setServicioModalInfo(null)} className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PERSONALIZACIÓN DEL FONDO HERO (DIFUMINADO, OPACIDAD Y COLOR) - IMAGEN 3 */}
      {modalHeroFondoAbierto && (
        <div
          onClick={() => setModalHeroFondoAbierto(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border-2 border-[#002855] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#002855]">
                  🖼️ Personalización del Fondo Hero (Difuminado, Opacidad y Color)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Ajusta el nivel de desenfoque, el porcentaje de transparencia y el color de la capa superpuesta.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalHeroFondoAbierto(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vista Previa en Vivo */}
            <div
              className="relative h-36 rounded-2xl overflow-hidden border border-slate-200 transition-colors"
              style={{ backgroundColor: heroOverlayColor || "#0f172a" }}
            >
              <img
                src={heroBgInputUrl || heroBgUrl || HERO_BG_DEFAULT}
                alt="Vista previa Hero"
                className="w-full h-full object-cover transition-all duration-300"
                style={{ filter: `blur(${heroBlur}px)` }}
              />
              <div
                className="absolute inset-0 transition-all duration-200"
                style={{
                  backgroundColor: heroOverlayColor || "#0f172a",
                  opacity: Math.min(0.95, Math.max(0, heroOverlayOpacity / 100)),
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 flex flex-col items-center justify-center p-3 text-center">
                <span className="text-xs font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                  Vista Previa en Vivo • Portal Académico FCM
                </span>
                <span className="mt-1 px-3 py-0.5 rounded-full bg-black/60 text-[10px] font-bold text-white border border-white/20">
                  Difuminado: {heroBlur}px • Capa: {heroOverlayOpacity}% ({heroOverlayColor})
                </span>
              </div>
            </div>

            {/* URL de la imagen */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700">URL de la Imagen de Fondo:</label>
              <input
                type="url"
                value={heroBgInputUrl}
                onChange={(e) => setHeroBgInputUrl(e.target.value)}
                placeholder="Pega aquí la URL de la imagen de fondo para el Hero..."
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002855]"
              />
            </div>

            {/* 1. Nivel de Difuminado */}
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#002855]">1. Nivel de Difuminado (Desenfoque):</span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#002855] text-white font-mono text-[11px] font-bold">
                  {heroBlur} px {heroBlur === 0 ? "(Sin blur)" : heroBlur <= 1.5 ? "(Sutil)" : "(Intenso)"}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={8}
                step={0.5}
                value={heroBlur}
                onChange={(e) => setHeroBlur(Number(e.target.value))}
                className="w-full accent-[#002855] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>0px (Sin blur)</span>
                <span>1px (Recomendado)</span>
                <span>4px (Medio)</span>
                <span>8px (Máximo)</span>
              </div>
            </div>

            {/* 2. Opacidad / Oscuridad */}
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#002855]">2. Opacidad / Oscuridad del Fondo:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-red-700 text-white font-mono text-[11px] font-bold">
                  {heroOverlayOpacity}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={heroOverlayOpacity}
                onChange={(e) => setHeroOverlayOpacity(Number(e.target.value))}
                className="w-full accent-red-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>0% (Imagen 100% libre)</span>
                <span>45% (Equilibrado)</span>
                <span>90% (Muy oscuro)</span>
              </div>
            </div>

            {/* 3. Color del Filtro / Capa */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#002855]">3. Color del Filtro / Capa:</span>
                <span className="font-mono text-[11px] font-bold text-slate-600">{heroOverlayColor}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Neutro Carbón (Normal)", hex: "#0f172a" },
                  { label: "Negro Cinematográfico", hex: "#000000" },
                  { label: "Gris Grafito Suave", hex: "#27272a" },
                  { label: "Azul Institucional", hex: "#002855" },
                ].map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setHeroOverlayColor(preset.hex)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                      heroOverlayColor.toLowerCase() === preset.hex.toLowerCase()
                        ? "border-[#002855] bg-blue-50 text-[#002855] ring-2 ring-[#002855]/20"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-xs shrink-0"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-slate-600">O elige un color personalizado:</span>
                <input
                  type="color"
                  value={heroOverlayColor}
                  onChange={(e) => setHeroOverlayColor(e.target.value)}
                  className="w-9 h-7 rounded cursor-pointer border border-slate-300 bg-white p-0.5"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={async () => {
                  await handleUsarComoFondoHero(heroBgInputUrl, heroBlur, heroOverlayOpacity, heroOverlayColor);
                  setModalHeroFondoAbierto(false);
                }}
                className="flex-1 py-3 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-extrabold cursor-pointer shadow-md transition-colors"
              >
                Guardar Personalización del Banner
              </button>
              <button
                type="button"
                onClick={() => handleUsarComoFondoHero(HERO_BG_DEFAULT, 1, 45, "#0f172a")}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INFORMATIVO DE FICHA COMPLETA DEL DOCENTE + SISTEMA DE CALIFICACIÓN Y RESEÑAS */}
      {docenteModalActivo && (() => {
        const statsModal = obtenerEstadisticasDocente(docenteModalActivo.id);
        const estrellaActiva = hoverEstrellaDocente || formResenaDocente.puntuacion;
        const etiquetasEstrellas: Record<number, string> = {
          1: "1★ • Necesita mejorar metodología",
          2: "2★ • Regular / Poco claro",
          3: "3★ • Buen docente / Cumple el sílabo",
          4: "4★ • Muy buen docente / Recomendado",
          5: "5★ • Excelente cátedra y dominio académico",
        };

        return (
          <div
            onClick={() => setDocenteModalActivo(null)}
            className="fixed inset-0 z-50 bg-slate-900/75 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-[#002855] bg-white shadow-2xl"
            >
              <div className={`${TEMA_CARRERA[docenteModalActivo.carrera_id].headerBg} text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 ${TEMA_CARRERA[docenteModalActivo.carrera_id].borderAccent} sticky top-0 z-10`}>
                <div className="flex items-center gap-4">
                  {docenteModalActivo.foto_url ? (
                    <img
                      src={docenteModalActivo.foto_url}
                      alt={docenteModalActivo.nombre_completo}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white/80 shadow-md shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-black/30 border-2 border-white/60 flex items-center justify-center text-2xl font-extrabold text-white shrink-0">
                      {obtenerInicialesDocente(docenteModalActivo.nombre_completo)}
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-black/30 text-[10px] font-extrabold uppercase tracking-wider text-white border border-white/20">
                        Escuela de {carreras.find((c) => c.id === docenteModalActivo.carrera_id)?.nombre}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-white/20 text-[10px] font-bold text-white">
                        Docente {docenteModalActivo.categoria_docente} • {docenteModalActivo.condicion}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/60 text-[11px] font-extrabold text-amber-200">
                        <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        <span>
                          {statsModal.total > 0
                            ? `${statsModal.promedio.toFixed(1)} / 5.0 (${statsModal.total})`
                            : "Sin calificaciones aún"}
                        </span>
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                      {docenteModalActivo.grado_academico} {docenteModalActivo.nombre_completo}
                    </h3>
                    <p className="text-xs text-white/90 font-mono">{docenteModalActivo.correo}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDocenteModalActivo(null)}
                  className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-black/25 hover:bg-black/40 text-xs font-bold text-white cursor-pointer shrink-0"
                >
                  ✕ Cerrar
                </button>
              </div>

              <div className="p-6 space-y-6 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <h4 className={`text-xs font-extrabold uppercase tracking-wider ${TEMA_CARRERA[docenteModalActivo.carrera_id].textAccent}`}>
                    Área de Especialidad Académica
                  </h4>
                  <p className="text-slate-800 font-semibold leading-relaxed">{docenteModalActivo.especialidad}</p>
                </div>

                <div className="space-y-1.5">
                  <h4 className={`text-xs font-extrabold uppercase tracking-wider ${TEMA_CARRERA[docenteModalActivo.carrera_id].textAccent}`}>
                    Líneas de Investigación Activas
                  </h4>
                  <p className="text-slate-600 leading-relaxed">{docenteModalActivo.lineas_investigacion}</p>
                </div>

                <div className="space-y-2">
                  <h4 className={`text-xs font-extrabold uppercase tracking-wider ${TEMA_CARRERA[docenteModalActivo.carrera_id].textAccent}`}>
                    Asignaturas a su Cargo
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {docenteModalActivo.cursos_dictados.map((cursoStr, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border ${TEMA_CARRERA[docenteModalActivo.carrera_id].badgeSoft}`}
                      >
                        {cursoStr}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Mail className={`w-4 h-4 shrink-0 mt-0.5 ${TEMA_CARRERA[docenteModalActivo.carrera_id].textAccent}`} />
                    <div>
                      <p className="font-bold text-slate-500 uppercase text-[10px]">Correo Institucional</p>
                      <p className="font-mono font-bold text-slate-900 break-all">{docenteModalActivo.correo}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className={`w-4 h-4 shrink-0 mt-0.5 ${TEMA_CARRERA[docenteModalActivo.carrera_id].textAccent}`} />
                    <div>
                      <p className="font-bold text-slate-500 uppercase text-[10px]">Horario de Asesoría</p>
                      <p className="font-semibold text-slate-800">{docenteModalActivo.horario_asesoria}</p>
                    </div>
                  </div>
                </div>

                {(docenteModalActivo.cti_vitae_url ||
                  docenteModalActivo.orcid_url ||
                  docenteModalActivo.google_scholar_url ||
                  docenteModalActivo.linkedin_url) && (
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-500">Perfiles Científicos e Investigación:</span>
                    <div className="flex flex-wrap gap-2">
                      {docenteModalActivo.cti_vitae_url && (
                        <a
                          href={docenteModalActivo.cti_vitae_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <span>CTI Vitae</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {docenteModalActivo.orcid_url && (
                        <a
                          href={docenteModalActivo.orcid_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <span>ORCID</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {docenteModalActivo.google_scholar_url && (
                        <a
                          href={docenteModalActivo.google_scholar_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <span>Google Scholar</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {docenteModalActivo.linkedin_url && (
                        <a
                          href={docenteModalActivo.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <span>LinkedIn</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* ====================================================================
                    SECCIÓN DESTACADA: ⭐ CALIFICACIONES Y OPINIONES ESTUDIANTILES
                   ==================================================================== */}
                <div className="pt-6 border-t-2 border-slate-200 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <h4 className="text-base font-extrabold text-[#002855]">
                        ⭐ Calificaciones y Opiniones Estudiantiles
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Comunidad Estudiantil FCM - UNMSM
                    </span>
                  </div>

                  {/* 1. RESUMEN GENERAL + DISTRIBUCIÓN DE ESTRELLAS */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center rounded-2xl bg-slate-50 border border-slate-200 p-5">
                    <div className="sm:col-span-5 text-center sm:border-r border-slate-200 sm:pr-4 space-y-1.5">
                      <div className="text-3xl sm:text-4xl font-extrabold text-[#002855]">
                        {statsModal.total > 0 ? statsModal.promedio.toFixed(1) : "—"}
                        <span className="text-lg font-bold text-slate-400"> / 5.0</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((starIndex) => {
                          const rellena = statsModal.total > 0 && starIndex <= Math.round(statsModal.promedio);
                          return (
                            <Star
                              key={starIndex}
                              className={`w-5 h-5 ${
                                rellena ? "text-amber-400 fill-amber-400" : "text-slate-300"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-[11px] font-bold text-slate-600">
                        {statsModal.total > 0
                          ? `Basado en ${statsModal.total} ${statsModal.total === 1 ? "reseña" : "reseñas"} de estudiantes`
                          : "Aún sin calificaciones registradas"}
                      </p>
                    </div>

                    <div className="sm:col-span-7 space-y-2">
                      {statsModal.distribucion.map((fila) => (
                        <div key={fila.estrellas} className="flex items-center gap-2.5 text-xs">
                          <span className="w-8 font-extrabold text-slate-700 flex items-center gap-0.5 shrink-0">
                            {fila.estrellas} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          </span>
                          <div className="flex-1 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-amber-400 transition-all duration-300"
                              style={{ width: `${fila.porcentaje}%` }}
                            />
                          </div>
                          <span className="w-12 text-right font-mono text-[11px] font-bold text-slate-600">
                            {fila.porcentaje}% ({fila.cantidad})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. FORMULARIO DE ENVÍO DE RESEÑA (1 A 5 ESTRELLAS + COMENTARIO) */}
                  <form
                    onSubmit={handleEnviarResenaDocente}
                    className="rounded-2xl border-2 border-blue-900/15 bg-blue-50/35 p-5 space-y-4"
                  >
                    {/* Campo Honeypot Anti-Bot (invisible para usuarios) */}
                    <input
                      type="text"
                      name="bot_trap_review"
                      value={formResenaDocente.bot_trap}
                      onChange={(e) => setFormResenaDocente((prev) => ({ ...prev, bot_trap: e.target.value }))}
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      style={{ display: "none" }}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="text-xs sm:text-sm font-extrabold text-[#002855]">
                        Califica al docente y comparte tu experiencia académica
                      </h5>
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        {etiquetasEstrellas[estrellaActiva]}
                      </span>
                    </div>

                    {/* Selector interactivo de 1 a 5 estrellas con hover animado */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                        Selecciona tu calificación (1 a 5 estrellas) *
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((valor) => {
                          const iluminada = valor <= estrellaActiva;
                          return (
                            <button
                              key={valor}
                              type="button"
                              onMouseEnter={() => setHoverEstrellaDocente(valor)}
                              onMouseLeave={() => setHoverEstrellaDocente(0)}
                              onClick={() => setFormResenaDocente((prev) => ({ ...prev, puntuacion: valor }))}
                              aria-label={`Calificar con ${valor} estrellas`}
                              className="p-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:scale-110 transition-all cursor-pointer shadow-2xs"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  iluminada ? "text-amber-400 fill-amber-400" : "text-slate-300"
                                }`}
                              />
                            </button>
                          );
                        })}
                        <span className="ml-2 text-xs font-extrabold text-[#002855]">
                          {formResenaDocente.puntuacion}.0 / 5.0
                        </span>
                      </div>
                    </div>

                    {/* Selector de curso llevado + Alias del estudiante */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">
                          Asignatura cursada con el docente *
                        </label>
                        <select
                          value={formResenaDocente.curso}
                          onChange={(e) => setFormResenaDocente((prev) => ({ ...prev, curso: e.target.value }))}
                          className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800"
                        >
                          {docenteModalActivo.cursos_dictados.map((c, idx) => (
                            <option key={idx} value={c}>
                              {c}
                            </option>
                          ))}
                          <option value="Otro curso de la Escuela">Otro curso de la Escuela</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-700">Tu Nombre o Alias</label>
                          <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#002855] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formResenaDocente.esAnonimo}
                              onChange={(e) =>
                                setFormResenaDocente((prev) => ({ ...prev, esAnonimo: e.target.checked }))
                              }
                              className="rounded border-slate-300"
                            />
                            <span>Publicar como Anónimo</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          disabled={formResenaDocente.esAnonimo}
                          value={
                            formResenaDocente.esAnonimo
                              ? "Estudiante Anónimo FCM"
                              : formResenaDocente.autor_alias
                          }
                          onChange={(e) =>
                            setFormResenaDocente((prev) => ({ ...prev, autor_alias: e.target.value }))
                          }
                          placeholder="Ej. Alumno de 5to Ciclo / Estudiante FCM"
                          className="w-full rounded-xl bg-white disabled:bg-slate-100 border border-slate-300 px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    {/* Comentario del porqué de la calificación */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">
                        ¿Por qué das esta calificación? (Metodología, exigencia, puntualidad, consejos) *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formResenaDocente.comentario}
                        onChange={(e) =>
                          setFormResenaDocente((prev) => ({ ...prev, comentario: e.target.value }))
                        }
                        placeholder="¿Por qué das esta calificación? Describe la metodología, nivel de exigencia, puntualidad o recomendaciones para futuros alumnos..."
                        className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-xs leading-relaxed"
                      />
                    </div>

                    {errorResenaDocente && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorResenaDocente}</span>
                      </div>
                    )}

                    {exitoResenaDocente && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>
                          ¡Reseña publicada con éxito! Tu valoración ya forma parte del promedio del docente.
                        </span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>Enviar Reseña del Docente</span>
                      </button>
                    </div>
                  </form>

                  {/* 3. MURO DE RESEÑAS PÚBLICAS DEL DOCENTE */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Opiniones de Estudiantes ({statsModal.total})
                    </h5>

                    {statsModal.aprobadas.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center space-y-1.5">
                        <Star className="w-7 h-7 text-amber-400 mx-auto" />
                        <p className="text-xs font-extrabold text-[#002855]">
                          Este docente aún no tiene reseñas registradas
                        </p>
                        <p className="text-[11px] text-slate-500">
                          ¡Sé el primer estudiante de la FCM en calificar y dejar una recomendación!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {statsModal.aprobadas.map((resena) => (
                          <div
                            key={resena.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-3.5 h-3.5 ${
                                        s <= resena.puntuacion
                                          ? "text-amber-400 fill-amber-400"
                                          : "text-slate-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-extrabold text-[#002855]">
                                  {resena.autor_alias}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    TEMA_CARRERA[docenteModalActivo.carrera_id].badgeSoft
                                  }`}
                                >
                                  {resena.curso}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 font-medium">
                                {formatearFechaEspanol(resena.fecha)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{resena.comentario}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* COMPONENTE GLOBAL <Footer /> */}
      <Footer
        logoUrl={logoUrl}
        onOpenAdmin={() => navegar("/admin")}
      />
    </div>
  );
}

function Footer({ logoUrl, onOpenAdmin }: { logoUrl: string; onOpenAdmin: () => void }) {
  return (
    <footer className="bg-[#001833] text-white border-t-4 border-red-700 pt-12 pb-8 mt-16 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Escudo UNMSM" className="h-11 w-auto object-contain" />
              <div>
                <p className="font-extrabold text-sm tracking-wide text-white">FACULTAD DE CIENCIAS MATEMÁTICAS</p>
                <p className="text-xs text-blue-200">Universidad Nacional Mayor de San Marcos</p>
              </div>
            </div>
            <p className="text-xs text-blue-200/90 leading-relaxed">
              Formando líderes científicos e investigadores en Computación Científica, Matemática, Estadística e Investigación Operativa.
            </p>
          </div>

          <div className="space-y-2 text-xs text-blue-200">
            <p className="font-extrabold uppercase tracking-wider text-white mb-2">Contacto Institucional</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-400 shrink-0" /><span>Ciudad Universitaria UNMSM - Av. Venezuela cdra. 34, Lima</span></p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-red-400 shrink-0" /><span>Central Telefónica: (01) 619-7000 Anexo 1401</span></p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-red-400 shrink-0" /><span>decanato.matematicas@unmsm.edu.pe</span></p>
          </div>

          <div className="space-y-3">
            <p className="font-extrabold uppercase tracking-wider text-xs text-white">Redes Sociales Oficiales</p>
            <p className="text-xs text-blue-200">Conéctate con las transmisiones, eventos y comunicados de la facultad:</p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.facebook.com/FacultadDeCienciasMatematicasOficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Oficial FCM UNMSM"
                title="Facebook Oficial FCM UNMSM"
                className="w-10 h-10 rounded-xl bg-blue-950 hover:bg-[#1877F2] border border-blue-800 flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.instagram.com/facultaddecienciasmatematicas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Oficial FCM UNMSM"
                title="Instagram Oficial FCM UNMSM"
                className="w-10 h-10 rounded-xl bg-blue-950 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 border border-blue-800 flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@fcmunmsm/videos"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Oficial FCM UNMSM"
                title="Canal Oficial de YouTube FCM UNMSM"
                className="w-10 h-10 rounded-xl bg-blue-950 hover:bg-[#FF0000] border border-blue-800 flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              >
                <Youtube className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.linkedin.com/school/universidad-nacional-mayor-de-san-marcos/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Institucional UNMSM"
                title="LinkedIn Institucional UNMSM"
                className="w-10 h-10 rounded-xl bg-blue-950 hover:bg-[#0A66C2] border border-blue-800 flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              >
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-blue-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-red-400" />
            <span>© 2026 Facultad de Ciencias Matemáticas - UNMSM. Todos los derechos reservados.</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              title="Acceso Administrativo"
              aria-label="Acceso Administrativo"
              className="ml-1 p-1 rounded text-blue-400/25 hover:text-blue-200/80 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px]">
            <a href="https://sum.unmsm.edu.pe/alumnoWebSum/login" target="_blank" rel="noopener noreferrer" className="hover:text-white underline decoration-red-500">SUM UNMSM</a>
            <a href="https://tramiteonline.unmsm.edu.pe/sgdfd/mat/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline decoration-red-500">Módulo MAT</a>
            <a href="https://sanmarket.unmsm.edu.pe/#/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline decoration-red-500">San Market</a>
          </div>
        </div>
      </div>
    </footer>
  );
}