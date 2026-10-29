"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, GraduationCap, BookOpen, Newspaper, FolderGit2, LifeBuoy, Sparkles,
  ChevronRight, ChevronDown, Upload, FileText, Code2, Video, FileCheck2, Award,
  CheckCircle2, Trash2, Lock, Unlock, Mail, Building2, Calendar, Filter, Layers,
  Download, AlertCircle, Star, Cpu, Sigma, BarChart3, Network, Printer,
  Image as ImageIcon, Copy, ExternalLink, Phone, UserCheck, ShoppingBag,
  FileSpreadsheet, Check, MapPin, Briefcase, Target, Lightbulb, Edit3,
  createLucideIcon,
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
type TipoArchivo = "PDF" | "Examen" | "Apunte" | "Codigo" | "Video" | "Silabo";
type EstadoMaterial = "pendiente" | "aprobado" | "rechazado";
type EstadoAtencion = "pendiente" | "en_proceso" | "resuelto";

interface Noticia {
  id: string;
  titulo: string;
  categoria: string;
  contenido: string;
  imagen_url: string;
  fecha_publicacion: string;
  destacado: boolean;
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
  categoria: "Logo Institucional" | "Banner Noticia" | "Foto Facultad";
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

const DOCENTES_SUGERIDOS: string[] = [
  "Mg. Herminio Paucar Curasma",
  "Dr. Eugenio Cabanillas Lapa",
  "Dr. Alfonso Pérez Salvatierra",
  "Dr. Carlos Vásquez Alzamora",
  "Mg. Rosa Medina Sandoval",
  "Dr. Julio Flores Ostos",
  "Dra. María Calvo Gutiérrez",
  "Dr. Víctor Soto Cáceres",
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
    "AI161|IA APLICADA|4|O|CS111;CS100|INTRODUCCIÓN A LA COMPUTACIÓN CIENTÍFICA|3;CS112|PROGRAMACIÓN ORIENTADA A OBJETOS I|4|O|CS111;FI101|FÍSICA GENERAL|5|O|MA111;MA111|CÁLCULO I|5|O|MA100",
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
    "MA100|MATEMÁTICA BÁSICA|5;CS111|INTRODUCCIÓN A LA PROGRAMACIÓN|5;FG140|FUNDAMENTOS DE INVESTIGACIÓN CIENTÍFICA|3;FG109|AMBIENTE Y DESARROLLO SOSTENIBLE|3;FG101|LENGUAJE|2;FG112|MÉTODOS DE GESTIÓN PERSONAL UNIVERSITARIA|2",
    "MAT111|CÁLCULO I|5|O|MA100;MAT121|ÁLGEBRA I (TEORÍA DE CONJUNTOS Y ENTEROS)|5|O|MA100;FI101|FÍSICA GENERAL I|5|O|MA100;MAT130|GEOMETRÍA ANALÍTICA VECTORIAL|4|O|MA100;ID101|INGLÉS CIENTÍFICO I|3",
    "MAT211|CÁLCULO II|5|O|MAT111;MAT221|ÁLGEBRA LINEAL I|5|O|MAT121,MAT130;MAT281|TEORÍA DE NÚMEROS Y COMBINATORIA|4|O|MAT121;FI102|FÍSICA GENERAL II (ELECTROMAGNETISMO)|4|O|FI101,MAT111;MAT205|SOFTWARE MATEMÁTICO Y SIMBÓLICO|3|O|CS111;ID102|INGLÉS CIENTÍFICO II|3|O|ID101",
    "MAT212|CÁLCULO III (VARIAS VARIABLES)|5|O|MAT211,MAT221;MAT222|ÁLGEBRA LINEAL II (FORMAS CANÓNICAS)|5|O|MAT221;MAT241|ESTRUCTURAS ALGEBRAICAS I (GRUPOS)|5|O|MAT281;MAT251|PROBABILIDAD Y ESTADÍSTICA MATEMÁTICA|4|O|MAT211;MAT232|GEOMETRÍA EUCLIDIANA Y PROYECTIVA|4|O|MAT130",
    "MAT311|ANÁLISIS REAL I|5|O|MAT212;MAT342|ESTRUCTURAS ALGEBRAICAS II (ANILLOS Y CUERPOS)|5|O|MAT241;MAT315|ECUACIONES DIFERENCIALES ORDINARIAS|5|O|MAT212,MAT222;MAT321|ANÁLISIS NUMÉRICO I|4|O|MAT222,MAT205;MAT331|CÁLCULO EN VARIEDADES|4|O|MAT212;MAT309|HISTORIA Y EPISTEMOLOGÍA DE LA MATEMÁTICA|2|E|MAT241",
    "MAT312|ANÁLISIS REAL II (MEDIDA E INTEGRACIÓN)|5|O|MAT311;MAT361|TOPOLOGÍA GENERAL Y ESPACIOS MÉTRICOS|5|O|MAT311;MAT318|VARIABLE COMPLEJA I|5|O|MAT311;MAT345|TEORÍA DE MÓDULOS Y ÁLGEBRA MULTILINEAL|4|O|MAT342,MAT222;MAT325|ANÁLISIS NUMÉRICO II|4|O|MAT321,MAT315",
    "MAT411|ANÁLISIS FUNCIONAL I|5|O|MAT312,MAT361;MAT431|GEOMETRÍA DIFERENCIAL I|5|O|MAT331,MAT361;MAT415|ECUACIONES DIFERENCIALES PARCIALES I|5|O|MAT315,MAT312;MAT441|TEORÍA DE GALOIS|4|O|MAT342;MAT462|TOPOLOGÍA ALGEBRAICA|4|E|MAT361,MAT241;MAT419|VARIABLE COMPLEJA II|4|E|MAT318",
    "MAT412|ANÁLISIS FUNCIONAL II (TEORÍA ESPECTRAL)|5|O|MAT411;MAT432|GEOMETRÍA RIEMANNIANA|5|O|MAT431;MAT416|ECUACIONES DIFERENCIALES PARCIALES II|5|O|MAT415,MAT411;MAT401|PROYECTO DE TESIS EN MATEMÁTICA I|3|O|MAT411;MAT471|SISTEMAS DINÁMICOS Y TEORÍA DE BIFURCACIONES|4|E|MAT315,MAT361;MAT482|ÁLGEBRA CONMUTATIVA Y GEOMETRÍA ALGEBRAICA|4|E|MAT441",
    "MAT501|SEMINARIO DE TESIS EN MATEMÁTICA II|5|O|MAT401;MAT511|TEORÍA DE DISTRIBUCIONES Y ESPACIOS DE SOBOLEV|5|O|MAT412,MAT416;MAT541|GRUPOS Y ÁLGEBRAS DE LIE|4|E|MAT432;MAT521|ELEMENTOS FINITOS PARA EDP|4|E|MAT415,MAT325;MAT551|PROBABILIDAD AVANZADA Y MARTINGALAS|4|E|MAT312,MAT251;MAT565|OPTIMIZACIÓN VARIACIONAL Y CONTROL ÓPTIMO|4|E|MAT412",
    "MAT502|TRABAJO DE INVESTIGACIÓN FINAL (TESIS III)|6|O|MAT501;MAT590|PRÁCTICAS PRE-PROFESIONALES EN MATEMÁTICA|4|O|MAT401;MAT575|TÓPICOS AVANZADOS EN ANÁLISIS NO LINEAL|4|E|MAT511;MAT585|CRIPTOGRAFÍA ELÍPTICA Y TEORÍA DE CÓDIGOS|4|E|MAT441;MAT595|SEMINARIO DE FÍSICA MATEMÁTICA Y CUÁNTICA|4|E|MAT412",
  ],
  "estadistica": [
    "MA100|MATEMÁTICA BÁSICA|5;CS111|INTRODUCCIÓN A LA PROGRAMACIÓN|5;EST101|ESTADÍSTICA DESCRIPTIVA Y EXPLORATORIA|4;FG140|FUNDAMENTOS DE INVESTIGACIÓN CIENTÍFICA|3;FG101|LENGUAJE Y COMUNICACIÓN|2;FG109|AMBIENTE Y DESARROLLO SOSTENIBLE|3",
    "MA111|CÁLCULO I|5|O|MA100;MA121|ÁLGEBRA LINEAL I|4|O|MA100;EST112|CÁLCULO DE PROBABILIDADES I|5|O|EST101,MA100;EST120|PROGRAMACIÓN EN R Y PYTHON PARA ESTADÍSTICA|4|O|CS111;ID101|INGLÉS I|3",
    "MA112|CÁLCULO II|4|O|MA111;MA122|ÁLGEBRA LINEAL II (ÁLGEBRA MATRICIAL)|4|O|MA121;EST211|CÁLCULO DE PROBABILIDADES II|5|O|EST112,MA111;EST221|GESTIÓN DE BASES DE DATOS ESTADÍSTICAS (SQL)|4|O|EST120;EC101|MICROECONOMÍA Y MACROECONOMÍA|3|O|MA100;ID102|INGLÉS II|3|O|ID101",
    "MA210|CÁLCULO III|4|O|MA112;EST215|INFERENCIA ESTADÍSTICA PARAMÉTRICA I|5|O|EST211;EST231|TEORÍA DEL MUESTREO I|4|O|EST211;EST241|MÉTODOS NUMÉRICOS PARA ESTADÍSTICA|4|O|MA122,EST120;EST250|DEMOGRAFÍA Y ESTADÍSTICAS POBLACIONALES|3|O|EST101;ID201|INGLÉS III|3|O|ID102",
    "EST315|INFERENCIA ESTADÍSTICA II (TEORÍA ASINTÓTICA)|5|O|EST215;EST318|MODELOS LINEALES Y REGRESIÓN APLICADA|5|O|EST215,MA122;EST332|MUESTREO AVANZADO Y DISEÑO DE ENCUESTAS|4|O|EST231;EST361|ESTADÍSTICA NO PARAMÉTRICA|4|O|EST215;EST352|PROCESOS ESTOCÁSTICOS I|4|O|EST211,MA210;EST325|VISUALIZACIÓN CIENTÍFICA Y DASHBOARDS|3|E|EST221",
    "EST341|DISEÑO Y ANÁLISIS DE EXPERIMENTOS I|5|O|EST318;EST371|MODELOS LINEALES GENERALIZADOS (GLM)|5|O|EST318,EST315;EST381|ESTADÍSTICA COMPUTACIONAL Y BOOTSTRAP|4|O|EST315,EST241;EST353|PROCESOS ESTOCÁSTICOS II (CADENAS DE MARKOV)|4|O|EST352;EST391|CONTROL ESTADÍSTICO DE LA CALIDAD Y SEIS SIGMA|4|O|EST318",
    "EST420|ANÁLISIS MULTIVARIADO I|5|O|EST371;EST431|ANÁLISIS DE SERIES DE TIEMPO I|5|O|EST318,EST353;EST442|DISEÑO DE EXPERIMENTOS II (SUPERFICIES DE RESPUESTA)|4|O|EST341;EST451|ESTADÍSTICA BAYESIANA I|4|O|EST315,EST381;EST461|ANÁLISIS DE DATOS CATEGÓRICOS|4|E|EST371;EST471|PSICOMETRÍA Y MODELOS DE ECUACIONES ESTRUCTURALES|3|E|EST371",
    "EST422|ANÁLISIS MULTIVARIADO II Y REDUCCIÓN DIMENSIONAL|5|O|EST420;EST481|APRENDIZAJE ESTADÍSTICO (STATISTICAL LEARNING)|5|O|EST420,EST381;EST432|ECONOMETRÍA FINANCIERA Y SERIES DE TIEMPO II|4|O|EST431;EST401|PROYECTO DE TESIS EN ESTADÍSTICA I|3|O|EST420;EST491|BIOESTADÍSTICA Y ENSAYOS CLÍNICOS|4|E|EST341,EST371;EST452|MÉTODOS MCMC Y BAYESIANA COMPUTACIONAL|4|E|EST451",
    "EST501|SEMINARIO DE TESIS EN ESTADÍSTICA II|5|O|EST401;EST511|ANÁLISIS DE SUPERVIVENCIA Y CONFIABILIDAD|5|O|EST371;EST521|ESTADÍSTICA ESPACIAL Y GEOESTADÍSTICA|4|E|EST431,EST422;EST531|MINERÍA DE DATOS Y BIG DATA ANALYTICS|4|E|EST481;EST541|MODELOS DE RIESGO CREDITICIO Y ACTUARIAL|4|E|EST432",
    "EST502|TRABAJO DE INVESTIGACIÓN FINAL (TESIS III)|6|O|EST501;EST590|PRÁCTICAS PRE-PROFESIONALES EN ESTADÍSTICA|4|O|EST401;EST555|CONSULTORÍA ESTADÍSTICA APLICADA|4|O|EST481;EST565|REDES NEURONALES Y DEEP LEARNING ESTADÍSTICO|4|E|EST481;EST575|ESTADÍSTICA GENÓMICA Y BIOINFORMÁTICA|4|E|EST491",
  ],
  "investigacion-operativa": [
    "MA100|MATEMÁTICA BÁSICA|5;CS111|INTRODUCCIÓN A LA PROGRAMACIÓN|5;IO101|FUNDAMENTOS DE INVESTIGACIÓN DE OPERACIONES|4;FG140|FUNDAMENTOS DE INVESTIGACIÓN CIENTÍFICA|3;FG101|LENGUAJE Y COMUNICACIÓN|2;FG109|AMBIENTE Y DESARROLLO SOSTENIBLE|3",
    "MA111|CÁLCULO I|5|O|MA100;IO115|ÁLGEBRA LINEAL COMPUTACIONAL Y CONVEXIDAD|5|O|MA100;CS112|PROGRAMACIÓN ORIENTADA A OBJETOS|4|O|CS111;IO120|TEORÍA GENERAL DE SISTEMAS Y ORGANIZACIONES|4|O|IO101;ID101|INGLÉS I|3",
    "MA112|CÁLCULO II|4|O|MA111;IO201|PROGRAMACIÓN LINEAL Y MÉTODO SIMPLEX|5|O|IO115;IO210|ALGORITMOS Y ESTRUCTURAS DE DATOS PARA OPTIMIZACIÓN|4|O|CS112;EST201|PROBABILIDADES Y ESTADÍSTICA APLICADA|4|O|MA111;IO230|CONTABILIDAD DE COSTOS Y PRESUPUESTOS|3|O|IO101;ID102|INGLÉS II|3|O|ID101",
    "MA210|CÁLCULO III (OPTIMIZACIÓN MULTIVARIABLE)|4|O|MA112;IO214|OPTIMIZACIÓN EN REDES Y FLUJOS EN GRAFOS|5|O|IO201,IO210;IO225|DUALIDAD Y ANÁLISIS DE SENSIBILIDAD|4|O|IO201;EST215|INFERENCIA ESTADÍSTICA Y PRONÓSTICOS|4|O|EST201;IO240|MICROECONOMÍA CUANTITATIVA|3|O|IO230;IO250|BASES DE DATOS EMPRESARIALES|3|O|IO210",
    "IO305|PROGRAMACIÓN ENTERA Y COMBINATORIA|5|O|IO214,IO225;IO312|PROGRAMACIÓN NO LINEAL I|5|O|MA210,IO201;IO351|PROCESOS ESTOCÁSTICOS I|4|O|EST215;IO331|INGENIERÍA ECONÓMICA Y EVALUACIÓN FINANCIERA|4|O|IO240;IO341|MODELADO CON LENGUAJES ALGEBRAICOS (AMPL/GUROBI/PYOMO)|4|O|IO214;IO360|GESTIÓN DE OPERACIONES Y PRODUCCIÓN I|3|O|IO201",
    "IO320|PROGRAMACIÓN DINÁMICA DETERMINÍSTICA Y ESTOCÁSTICA|5|O|IO305,IO351;IO322|OPTIMIZACIÓN CONVEXA Y MÉTODOS DE PUNTO INTERIOR|5|O|IO312;IO355|TEORÍA DE COLAS Y SISTEMAS DE SERVICIO|4|O|IO351;IO371|TEORÍA DE INVENTARIOS Y ALMACENES|4|O|IO360,IO351;IO381|ANÁLISIS DE DECISIONES Y TEORÍA DE UTILIDAD|4|O|EST215",
    "IO418|SIMULACIÓN DE SISTEMAS DISCRETOS Y MONTE CARLO|5|O|IO355;IO425|TEORÍA DE JUEGOS Y EQUILIBRIO DE NASH|4|O|IO322,IO381;IO431|LOGÍSTICA CUANTITATIVA Y RUTEO DE VEHÍCULOS (VRP)|5|O|IO305,IO371;IO441|PLANIFICACIÓN Y PROGRAMACIÓN DE PROYECTOS (CPM/PERT)|4|O|IO305;IO451|CONFIABILIDAD Y MANTENIMIENTO DE SISTEMAS|4|E|IO355;IO461|MÉTODOS MULTICRITERIO (AHP, TOPSIS, DEA)|3|E|IO381",
    "IO503|METAHEURÍSTICAS Y ALGORITMOS EVOLUTIVOS|5|O|IO431;IO471|GESTIÓN DE CADENAS DE SUMINISTRO (SUPPLY CHAIN)|5|O|IO431;IO481|SIMULACIÓN DINÁMICA DE SISTEMAS (SYSTEM DYNAMICS)|4|O|IO418;IO401|PROYECTO DE TESIS EN INVESTIGACIÓN OPERATIVA I|3|O|IO418;IO491|OPTIMIZACIÓN DE CARTERAS Y FINANZAS CUANTITATIVAS|4|E|IO322,IO331;IO495|REVENUE MANAGEMENT Y PRICING DINÁMICO|4|E|IO320",
    "IO501|SEMINARIO DE TESIS EN INVESTIGACIÓN OPERATIVA II|5|O|IO401;IO511|PROGRAMACIÓN ESTOCÁSTICA Y OPTIMIZACIÓN ROBUSTA|5|O|IO320,IO503;IO521|MACHINE LEARNING APLICADO A OPERACIONES|4|E|IO503;IO531|PLANIFICACIÓN DE SISTEMAS ENERGÉTICOS Y TRANSPORTE|4|E|IO471;IO541|DESCOMPOSICIÓN DE BENDERS Y GENERACIÓN DE COLUMNAS|4|E|IO305",
    "IO502|TRABAJO DE INVESTIGACIÓN FINAL (TESIS III)|6|O|IO501;IO590|PRÁCTICAS PRE-PROFESIONALES EN INVESTIGACIÓN OPERATIVA|4|O|IO401;IO555|CONSULTORÍA EN INVESTIGACIÓN DE OPERACIONES|4|O|IO471;IO565|ANALÍTICA PRESCRIPTIVA INDUSTRIAL|4|E|IO511;IO575|OPTIMIZACIÓN EN TELECOMUNICACIONES Y SMART CITIES|4|E|IO503",
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
    id: "not-1",
    titulo: "Implementación Oficial del Plan de Estudios 2026 en Computación Científica, Matemática, Estadística e I.O.",
    categoria: "Académico • Plan 2026",
    contenido: "La Facultad de Ciencias Matemáticas publica las mallas curriculares completas de los 10 ciclos académicos con asignaturas actualizadas en Inteligencia Artificial, Computación Científica, Análisis Funcional y Optimización Estocástica.",
    imagen_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    fecha_publicacion: "2026-10-15",
    destacado: true,
  },
  {
    id: "not-2",
    titulo: "Convocatoria Internacional: Pasantías de Investigación en Computación Científica y Matemática Aplicada 2026-2027",
    categoria: "Becas e Investigación",
    contenido: "Estudiantes del quinto y décimo superior de las 4 escuelas profesionales pueden postular a estancias de investigación y becas de excelencia académica.",
    imagen_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
    fecha_publicacion: "2026-10-20",
    destacado: true,
  },
  {
    id: "not-3",
    titulo: "Apertura del Clúster de Computación Científica y GPU para Proyectos de Fin de Carrera",
    categoria: "Infraestructura FCM",
    contenido: "Acceso habilitado para alumnos de los ciclos 7 al 10 en simulaciones numéricas, entrenamiento de modelos de Deep Learning y optimización a gran escala.",
    imagen_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    fecha_publicacion: "2026-10-25",
    destacado: true,
  },
];

const MATERIALES_INICIALES: MaterialRepositorio[] = [
  { id: "mat-1", titulo: "Solucionario Examen Parcial POO II (C++20, Templates, STL y Smart Pointers)", tipo_archivo: "Examen", url_archivo: "https://github.com/unmsm-fcm/cs113-poo2-parcial", carrera_id: "computacion-cientifica", ciclo: 3, curso_id: "cc-301", docente: "Mg. Herminio Paucar Curasma", autor_alias: "Comité Académico CC", fecha_subida: "2026-10-14", estado: "aprobado" },
  { id: "mat-2", titulo: "Compendio de Estructuras Discretas I en LaTeX: Lógica, Inducción y Grafos", tipo_archivo: "Apunte", url_archivo: "https://drive.google.com/file/d/cs1d1-discretas-apuntes", carrera_id: "computacion-cientifica", ciclo: 3, curso_id: "cc-302", docente: "Mg. Rosa Medina Sandoval", autor_alias: "Admin FCM", fecha_subida: "2026-10-16", estado: "aprobado" },
  { id: "mat-3", titulo: "Problemas Resueltos de Análisis Real II (Medida de Lebesgue y Convergencia)", tipo_archivo: "PDF", url_archivo: "https://drive.google.com/file/d/mat312-analisis-real", carrera_id: "matematica", ciclo: 6, curso_id: "mat-601", docente: "Dr. Eugenio Cabanillas Lapa", autor_alias: "Seminario Análisis UNMSM", fecha_subida: "2026-10-18", estado: "aprobado" },
  { id: "mat-4", titulo: "Scripts en R y Python para Inferencia Estadística Paramétrica y Modelos Lineales", tipo_archivo: "Codigo", url_archivo: "https://github.com/unmsm-fcm/est318-modelos-lineales", carrera_id: "estadistica", ciclo: 5, curso_id: "est-502", docente: "Dra. María Calvo Gutiérrez", autor_alias: "Laboratorio Estadística", fecha_subida: "2026-10-19", estado: "aprobado" },
  { id: "mat-5", titulo: "Guía Práctica de Programación Entera y Ruteo de Vehículos con Gurobi / Pyomo", tipo_archivo: "Codigo", url_archivo: "https://github.com/unmsm-fcm/io305-entera", carrera_id: "investigacion-operativa", ciclo: 5, curso_id: "io-501", docente: "Dr. Víctor Soto Cáceres", autor_alias: "Círculo IO San Marcos", fecha_subida: "2026-10-21", estado: "aprobado" },
  { id: "mat-pend-1", titulo: "Examen Final Resuelto 2026-I de Álgebra Lineal I (Valores Propios y Diagonalización)", tipo_archivo: "Examen", url_archivo: "https://drive.google.com/file/d/ma121-final-resuelto", carrera_id: "computacion-cientifica", ciclo: 3, curso_id: "cc-306", docente: "Dr. Alfonso Pérez Salvatierra", autor_alias: "Estudiante Anónimo FCM", fecha_subida: "2026-10-27", estado: "pendiente" },
  { id: "mat-pend-2", titulo: "Apuntes de Cálculo II en Overleaf: Integrales Múltiples y Teorema de Stokes", tipo_archivo: "Apunte", url_archivo: "https://drive.google.com/file/d/ma112-calculo2-latex", carrera_id: "computacion-cientifica", ciclo: 3, curso_id: "cc-305", docente: "Dr. Eugenio Cabanillas Lapa", autor_alias: "Anónimo Base 25", fecha_subida: "2026-10-28", estado: "pendiente" },
];

const IMAGENES_STORAGE_INICIALES: ImagenStorage[] = [
  { id: "img-1", nombre_archivo: "estudiantes-computacion-cientifica.jpg", categoria: "Foto Facultad", url_publica: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80", tamano_kb: "340 KB", fecha_subida: "2026-10-15" },
  { id: "img-2", nombre_archivo: "cluster-computacion-cientifica.jpg", categoria: "Banner Noticia", url_publica: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80", tamano_kb: "412 KB", fecha_subida: "2026-10-24" },
];

const TICKETS_INICIALES: TicketSoporte[] = [
  { id: "tck-1", nombre: "Carlos Mendoza Quispe", email: "carlos.mendoza@unmsm.edu.pe", asunto: "Consulta sobre convalidación al Plan de Estudios 2026 (Computación Científica)", mensaje: "Solicito información sobre la tabla de equivalencias automáticas en el SUM para los cursos de tercer ciclo del Plan 2026 de Computación Científica.", fecha: "2026-10-27 10:15", estado_atencion: "pendiente" },
];

export default function PortalFacultadCienciasMatematicas() {
  const [vistaActual, setVistaActual] = useState<"/" | "/carreras/[id]" | "/repositorio" | "/contacto" | "/admin">("/");
  const [carreraSeleccionadaId, setCarreraSeleccionadaId] = useState<CarreraId>("computacion-cientifica");

  const [noticias, setNoticias] = useState<Noticia[]>(NOTICIAS_INICIALES);
  const [carreras, setCarreras] = useState<Carrera[]>(CARRERAS_INICIALES);
  const [malla, setMalla] = useState<CursoMalla[]>(MALLA_INICIAL);
  const [materiales, setMateriales] = useState<MaterialRepositorio[]>(MATERIALES_INICIALES);
  const [tickets, setTickets] = useState<TicketSoporte[]>(TICKETS_INICIALES);
  const [imagenesStorage, setImagenesStorage] = useState<ImagenStorage[]>(IMAGENES_STORAGE_INICIALES);
  const [logoUrl, setLogoUrl] = useState<string>(LOGO_UNMSM_TRANSPARENTE_DEFAULT);
  const [cargandoConfig, setCargandoConfig] = useState<boolean>(true);

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
  });
  const [exitoSubidaModal, setExitoSubidaModal] = useState(false);

  const [formContacto, setFormContacto] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });
  const [ticketEnviadoOk, setTicketEnviadoOk] = useState(false);

  const [adminAutenticado, setAdminAutenticado] = useState(false);
  const [pinAdmin, setPinAdmin] = useState("");
  const [errorPin, setErrorPin] = useState("");
  const [tabAdmin, setTabAdmin] = useState<"dashboard" | "carreras_cms" | "noticias" | "malla" | "moderacion" | "storage" | "soporte">("dashboard");

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
    fecha_publicacion: "",
    contenido: "",
    imagen_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    destacado: true,
  });
  const inputImagenNoticiaRef = useRef<HTMLInputElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categoriaNuevaImagen, setCategoriaNuevaImagen] = useState<"Logo Institucional" | "Banner Noticia" | "Foto Facultad">("Banner Noticia");
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
  // 1. PERSISTENCIA REAL EN SUPABASE (`portal_config`) Y CARGA INICIAL
  // ==========================================================================
  useEffect(() => {
    let activo = true;
    const cargarConfiguracionDesdeSupabase = async () => {
      try {
        if (typeof window !== "undefined") {
          const localLogo = window.localStorage.getItem("fcm_logo_url");
          const localCarreras = window.localStorage.getItem("fcm_carreras_data");
          const localNoticias = window.localStorage.getItem("fcm_noticias_data");
          const localStorageImgs = window.localStorage.getItem("fcm_storage_data");
          if (localLogo && activo) setLogoUrl(localLogo);
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
        }
      } catch {
        // Mantiene estado por defecto si la tabla aún no fue creada
      } finally {
        if (activo) setCargandoConfig(false);
      }
    };
    cargarConfiguracionDesdeSupabase();
    return () => { activo = false; };
  }, []);

  const sincronizarPortalConfigSupabase = async (cambios: {
    logo_url?: string;
    carreras_data?: Carrera[];
    noticias_data?: Noticia[];
    storage_data?: ImagenStorage[];
  }): Promise<boolean> => {
    if (typeof window !== "undefined") {
      if (cambios.logo_url) window.localStorage.setItem("fcm_logo_url", cambios.logo_url);
      if (cambios.carreras_data) window.localStorage.setItem("fcm_carreras_data", JSON.stringify(cambios.carreras_data));
      if (cambios.noticias_data) window.localStorage.setItem("fcm_noticias_data", JSON.stringify(cambios.noticias_data));
      if (cambios.storage_data) window.localStorage.setItem("fcm_storage_data", JSON.stringify(cambios.storage_data));
    }
    try {
      const { error } = await supabase.from("portal_config").upsert(
        { id: 1, ...cambios, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
      return !error;
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

  const handleSubidaRepositorioAnonima = (e: React.FormEvent) => {
    e.preventDefault();
    const docenteFinal = formSubidaAnon.modoDocente === "manual" ? formSubidaAnon.docenteManual.trim() : formSubidaAnon.docenteSeleccionado;
    if (!formSubidaAnon.titulo.trim() || !formSubidaAnon.url_archivo.trim() || !formSubidaAnon.curso_id || !docenteFinal) {
      lanzarToast("Por favor completa todos los campos obligatorios.");
      return;
    }
    const nuevoMat: MaterialRepositorio = {
      id: `mat-${Date.now()}`,
      titulo: formSubidaAnon.titulo.trim(),
      tipo_archivo: formSubidaAnon.tipo_archivo,
      url_archivo: formSubidaAnon.url_archivo.trim(),
      carrera_id: formSubidaAnon.carrera_id,
      ciclo: Number(formSubidaAnon.ciclo),
      curso_id: formSubidaAnon.curso_id,
      docente: docenteFinal,
      autor_alias: formSubidaAnon.autor_alias.trim() || "Estudiante Anónimo FCM",
      fecha_subida: new Date().toISOString().split("T")[0],
      estado: "pendiente",
    };
    setMateriales((prev) => [nuevoMat, ...prev]);
    setExitoSubidaModal(true);
    lanzarToast("Material clasificado y enviado en estado 'pendiente'.");
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
      } else {
        await sincronizarPortalConfigSupabase({ storage_data: nuevaListaStorage });
        lanzarToast(`✅ Imagen "${file.name}" subida al bucket 'fcm-assets' con URL pública.`);
      }
    } finally {
      setSubiendoStorage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const navegarACarrera = (id: CarreraId) => {
    setCarreraSeleccionadaId(id);
    setVistaActual("/carreras/[id]");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCicloAcordeon = (ciclo: number) => {
    setCiclosAbiertos((prev) => (prev.includes(ciclo) ? prev.filter((c) => c !== ciclo) : [...prev, ciclo]));
  };

  const handleEnviarContacto = (e: React.FormEvent) => {
    e.preventDefault();
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
    setFormContacto({ nombre: "", email: "", asunto: "", mensaje: "" });
    lanzarToast("Solicitud registrada correctamente.");
  };

  const handleGuardarNoticia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNoticia.titulo.trim() || !formNoticia.contenido.trim()) return;
    let nuevasNoticias: Noticia[];
    if (formNoticia.id) {
      nuevasNoticias = noticias.map((n) => (n.id === formNoticia.id ? { ...n, ...formNoticia } : n));
      setNoticias(nuevasNoticias);
      lanzarToast("✅ Noticia actualizada y persistida en Supabase.");
    } else {
      nuevasNoticias = [
        {
          id: `not-${Date.now()}`,
          titulo: formNoticia.titulo.trim(),
          categoria: formNoticia.categoria,
          contenido: formNoticia.contenido.trim(),
          imagen_url: formNoticia.imagen_url.trim() || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
          fecha_publicacion: formNoticia.fecha_publicacion || new Date().toISOString().split("T")[0],
          destacado: formNoticia.destacado,
        },
        ...noticias,
      ];
      setNoticias(nuevasNoticias);
      lanzarToast("📰 Nueva noticia publicada y guardada en Supabase.");
    }
    await sincronizarPortalConfigSupabase({ noticias_data: nuevasNoticias });
    setFormNoticia({
      id: "",
      titulo: "",
      categoria: "Comunicado Oficial",
      fecha_publicacion: "",
      contenido: "",
      imagen_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
      destacado: true,
    });
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
          <div onClick={() => setVistaActual("/")} className="flex items-center gap-3 cursor-pointer shrink-0">
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

          <nav className="flex flex-wrap items-center gap-1 sm:gap-1.5 bg-blue-950/80 p-1.5 rounded-xl border border-blue-800">
            <button
              onClick={() => setVistaActual("/")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                vistaActual === "/" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setVistaActual("/carreras/[id]")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                vistaActual === "/carreras/[id]" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-red-400" />
              <span>Escuelas y Mallas</span>
            </button>
            <button
              onClick={() => setVistaActual("/repositorio")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
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
                          setVistaActual("/contacto");
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
              onClick={() => setVistaActual("/contacto")}
              className={`hidden lg:flex px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap items-center gap-1 ${
                vistaActual === "/contacto" ? "bg-white text-[#002855] shadow-sm" : "text-blue-100 hover:bg-blue-900"
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Contacto</span>
            </button>

            {adminAutenticado && (
              <button
                onClick={() => setVistaActual("/admin")}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
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
        </div>
      </header>

      {/* VISTA A: INICIO / HOME (/) */}
      {vistaActual === "/" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 space-y-12">
          <section className="relative rounded-3xl bg-gradient-to-br from-[#002855] via-blue-900 to-blue-950 text-white p-6 sm:p-12 text-center shadow-xl border-b-4 border-red-700">
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-700 text-white text-xs font-bold uppercase tracking-wide shadow">
                <Building2 className="w-3.5 h-3.5" />
                <span>Facultad de Ciencias Matemáticas • UNMSM</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Portal Académico e Investigación en{" "}
                <span className="underline decoration-red-500 decoration-4 underline-offset-4">
                  Ciencias Exactas y Computación Científica
                </span>
              </h1>
              <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto">
                Explora los planes de estudio completos de los 10 ciclos para{" "}
                <strong className="text-white">Computación Científica</strong>,{" "}
                <strong className="text-white">Matemática</strong>,{" "}
                <strong className="text-white">Estadística</strong> e{" "}
                <strong className="text-white">Investigación Operativa</strong>.
              </p>

              <div className="relative max-w-2xl mx-auto pt-2 text-left">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={busquedaGlobal}
                    onChange={(e) => setBusquedaGlobal(e.target.value)}
                    placeholder="Buscar curso (ej. CS113, AI264, MAT312), docente o material del repositorio..."
                    className="w-full pl-12 pr-24 py-4 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-red-500/40 shadow-xl"
                  />
                  {busquedaGlobal && (
                    <button
                      onClick={() => setBusquedaGlobal("")}
                      className="absolute right-3 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 px-3 py-1.5 rounded-lg"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {busquedaGlobal.trim() !== "" && (
                  <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white text-slate-900 border-2 border-blue-900 shadow-2xl p-4 z-30 space-y-4 max-h-96 overflow-y-auto">
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
                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left"
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

          <section className="space-y-5">
            <div className="flex items-center justify-between border-b-2 border-blue-900 pb-3">
              <div>
                <span className="text-xs font-bold uppercase text-red-700">Actualidad Universitaria</span>
                <h2 className="text-2xl font-extrabold text-[#002855] flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-red-700" />
                  Noticias y Comunicados Oficiales
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {noticias.map((not, idx) => (
                <article
                  key={not.id}
                  className={`rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between ${
                    idx === 0 ? "md:col-span-2" : "md:col-span-1"
                  }`}
                >
                  <div>
                    <div className="relative h-52 bg-slate-900">
                      <img src={not.imagen_url} alt={not.titulo} className="w-full h-full object-cover opacity-90" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-[#002855] text-white shadow">{not.categoria}</span>
                        {not.destacado && (
                          <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-red-700 text-white shadow flex items-center gap-1">
                            <Star className="w-3 h-3 fill-white" /> Importante
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-red-700" />
                        <span>{not.fecha_publicacion}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#002855] leading-snug">{not.titulo}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{not.contenido}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
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
                    onClick={() => setCarreraSeleccionadaId(c.id)}
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
                    setVistaActual("/repositorio");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/25"
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
                        setVistaActual("/admin");
                      }}
                      className={`${temaActivo.textAccent} font-bold hover:underline print:hidden`}
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
                                    setVistaActual("/repositorio");
                                  }}
                                  className={`${temaActivo.textAccent} hover:underline font-bold`}
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
                  if (adminSecret && pinAdmin === adminSecret) {
                    setAdminAutenticado(true);
                    setErrorPin("");
                    setPinAdmin("");
                    lanzarToast("🔓 Sesión de Administrador iniciada.");
                  } else {
                    setErrorPin("Contraseña maestra incorrecta o acceso no autorizado.");
                  }
                }}
                className="space-y-3 text-left"
              >
                <input
                  type="password"
                  value={pinAdmin}
                  onChange={(e) => setPinAdmin(e.target.value)}
                  placeholder="Contraseña maestra de administrador..."
                  autoComplete="current-password"
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs"
                />
                {errorPin && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errorPin}</p>}
                <button type="submit" className="w-full py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-xs font-extrabold text-white cursor-pointer">
                  Autenticar y Entrar al Panel CMS
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
                    { id: "moderacion", label: `🛡️ Moderación (${materialesPendientes.length})` },
                    { id: "storage", label: `🖼️ Imágenes Storage (${imagenesStorage.length})` },
                    { id: "malla", label: `🎓 Mallas (${malla.length})` },
                    { id: "soporte", label: `📬 Soporte (${tickets.length})` },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTabAdmin(t.id as typeof tabAdmin)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${tabAdmin === t.id ? "bg-red-700 text-white shadow" : "bg-blue-900 text-blue-100 hover:bg-blue-800"}`}
                    >
                      {t.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setAdminAutenticado(false);
                      setVistaActual("/");
                      lanzarToast("🔒 Sesión de administrador cerrada.");
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-black text-red-300 border border-red-500/40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" /> Salir
                  </button>
                </div>
              </div>

              {tabAdmin === "dashboard" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div onClick={() => setTabAdmin("carreras_cms")} className="rounded-2xl border-2 border-blue-200 bg-white p-5 cursor-pointer hover:border-[#002855]">
                    <p className="text-xs text-[#002855] font-extrabold uppercase">Gestión de Carreras</p>
                    <p className="text-3xl font-extrabold text-[#002855] mt-2">4 Escuelas</p>
                  </div>
                  <div onClick={() => setTabAdmin("noticias")} className="rounded-2xl border-2 border-red-200 bg-white p-5 cursor-pointer hover:border-red-600">
                    <p className="text-xs text-red-700 font-extrabold uppercase">Noticias Activas</p>
                    <p className="text-3xl font-extrabold text-[#002855] mt-2">{noticias.length}</p>
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <form onSubmit={handleGuardarNoticia} className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 space-y-4 h-fit">
                    <h3 className="font-extrabold text-base text-[#002855] border-b border-slate-200 pb-3">
                      {formNoticia.id ? "✏️ Editar Noticia" : "➕ Publicar Nueva Noticia"}
                    </h3>
                    <input type="text" required value={formNoticia.titulo} onChange={(e) => setFormNoticia({ ...formNoticia, titulo: e.target.value })} placeholder="Título de la Noticia *" className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="date" required value={formNoticia.fecha_publicacion} onChange={(e) => setFormNoticia({ ...formNoticia, fecha_publicacion: e.target.value })} className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs" />
                      <input type="text" value={formNoticia.categoria} onChange={(e) => setFormNoticia({ ...formNoticia, categoria: e.target.value })} placeholder="Categoría" className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">Imagen de Portada *</label>
                        <button type="button" onClick={() => inputImagenNoticiaRef.current?.click()} className="text-[11px] font-bold text-red-700 hover:underline flex items-center gap-1">
                          <Upload className="w-3 h-3" /> Subir desde PC
                        </button>
                        <input ref={inputImagenNoticiaRef} type="file" accept="image/*" onChange={handleSubirImagenPortadaNoticia} className="hidden" />
                      </div>
                      <input type="url" required value={formNoticia.imagen_url} onChange={(e) => setFormNoticia({ ...formNoticia, imagen_url: e.target.value })} className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs" />
                    </div>
                    <textarea rows={4} required value={formNoticia.contenido} onChange={(e) => setFormNoticia({ ...formNoticia, contenido: e.target.value })} placeholder="Contenido de la noticia *" className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs" />
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={formNoticia.destacado} onChange={(e) => setFormNoticia({ ...formNoticia, destacado: e.target.checked })} />
                      Destacar como &ldquo;Importante&rdquo;
                    </label>
                    <button type="submit" className="w-full py-3 rounded-xl bg-[#002855] text-white text-xs font-extrabold">
                      {formNoticia.id ? "Guardar Cambios" : "Publicar Noticia"}
                    </button>
                  </form>

                  <div className="lg:col-span-7 space-y-3">
                    {noticias.map((n) => (
                      <div key={n.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <img src={n.imagen_url} alt={n.titulo} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" />
                          <div>
                            <span className="text-[11px] font-bold text-red-700">{n.categoria} • {n.fecha_publicacion}</span>
                            <h4 className="font-extrabold text-xs sm:text-sm text-[#002855]">{n.titulo}</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => setFormNoticia({ ...n })} className="p-2 rounded-lg bg-slate-100 text-[#002855]"><Edit3 className="w-4 h-4" /></button>
                          <button
                            onClick={async () => {
                              const filtradas = noticias.filter((item) => item.id !== n.id);
                              setNoticias(filtradas);
                              await sincronizarPortalConfigSupabase({ noticias_data: filtradas });
                              lanzarToast("🗑️ Noticia eliminada de Supabase.");
                            }}
                            className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-700 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tabAdmin === "storage" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 space-y-5 h-fit">
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

                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(img.url_publica);
                              setUrlCopiadaId(img.id);
                              setTimeout(() => setUrlCopiadaId(null), 2000);
                              lanzarToast("📋 URL pública copiada.");
                            }}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-[#002855] text-white text-[11px] font-bold flex items-center justify-center gap-1"
                          >
                            {urlCopiadaId === img.id ? <><Check className="w-3 h-3" /> Copiada</> : <><Copy className="w-3 h-3" /> Copiar URL</>}
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
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  {materialesPendientes.length === 0 ? (
                    <div className="p-12 text-center space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                      <h3 className="text-base font-bold text-slate-900">No hay archivos pendientes de moderación</h3>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#002855] text-white uppercase text-[11px]">
                          <th className="py-3.5 px-4">Material</th>
                          <th className="py-3.5 px-4">Carrera / Curso</th>
                          <th className="py-3.5 px-4">Docente</th>
                          <th className="py-3.5 px-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {materialesPendientes.map((m) => {
                          const curso = malla.find((c) => c.id === m.curso_id);
                          const carrera = carreras.find((ca) => ca.id === m.carrera_id);
                          return (
                            <tr key={m.id}>
                              <td className="py-4 px-4 font-bold text-[#002855]">{m.titulo}</td>
                              <td className="py-4 px-4">{carrera?.nombre} • [{curso?.codigo}] {curso?.nombre_curso}</td>
                              <td className="py-4 px-4">{m.docente}</td>
                              <td className="py-4 px-4 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    setMateriales((prev) => prev.map((item) => (item.id === m.id ? { ...item, estado: "aprobado" } : item)));
                                    lanzarToast("✅ Material aprobado.");
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#002855] text-white font-bold"
                                >
                                  ✅ Aprobar
                                </button>
                                <button
                                  onClick={() => {
                                    setMateriales((prev) => prev.filter((item) => item.id !== m.id));
                                    lanzarToast("❌ Material rechazado.");
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-red-700 text-white font-bold"
                                >
                                  ❌ Rechazar
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
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
                  {DOCENTES_SUGERIDOS.map((doc) => <option key={doc} value={doc}>{doc}</option>)}
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

      {/* COMPONENTE GLOBAL <Footer /> */}
      <Footer
        logoUrl={logoUrl}
        onOpenAdmin={() => {
          setVistaActual("/admin");
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
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
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook Oficial FCM UNMSM" className="w-10 h-10 rounded-xl bg-blue-950 hover:bg-red-700 border border-blue-800 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram Oficial FCM UNMSM" className="w-10 h-10 rounded-xl bg-blue-950 hover:bg-red-700 border border-blue-800 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Oficial FCM UNMSM" className="w-10 h-10 rounded-xl bg-blue-950 hover:bg-red-700 border border-blue-800 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4 text-white" />
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube Oficial FCM UNMSM" className="w-10 h-10 rounded-xl bg-blue-950 hover:bg-red-700 border border-blue-800 flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4 text-white" />
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