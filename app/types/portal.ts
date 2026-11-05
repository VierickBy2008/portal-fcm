export type CarreraId =
  | "computacion-cientifica"
  | "matematica"
  | "estadistica"
  | "investigacion-operativa";

export type VistaPortal =
  | "/"
  | "/carreras/[id]"
  | "/noticias/[id]"
  | "/repositorio"
  | "/contacto"
  | "/admin"
  | "/docentes"
  | "/noticias"
  | "/orgullo"
  | "/transparencia";

export type TipoArchivo = "PDF" | "Examen" | "Apunte" | "Codigo" | "Video" | "Silabo";
export type EstadoMaterial = "pendiente" | "aprobado" | "rechazado";
export type EstadoAtencion = "pendiente" | "en_proceso" | "resuelto";

export interface Noticia {
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
  fondo_imagen_url?: string;
  fondo_blur?: number;
  fondo_overlay_opacity?: number;
  fondo_overlay_color?: string;
}

export interface Docente {
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

export interface OrgulloItem {
  id: string;
  titulo: string;
  subtitulo_categoria: string;
  estudiante: string;
  carrera_id: CarreraId | "fcm";
  carrera_nombre?: string;
  descripcion: string;
  foto_url: string;
  tipo_tarjeta: "afiche" | "estudiante" | "delegacion";
  enlace_nota?: string;
  anio: string;
  destacado?: boolean;
}

export interface DocumentoTransparencia {
  id: string;
  codigo: string;
  titulo: string;
  categoria:
    | "Resoluciones Decanales"
    | "Resoluciones Rectorales"
    | "Plan Operativo Institucional (POI)"
    | "Memorias de Gestión"
    | "Balances y Presupuesto"
    | "Actas de Consejo de Facultad"
    | "Convenios y Alianzas"
    | "Anuncios y Convocatorias";
  anio: number;
  dependencia: string;
  fecha: string;
  tamano_archivo: string;
  url_pdf: string;
  sumilla?: string;
}

export interface ResenaDocente {
  id: string;
  docente_id: string;
  puntuacion: number; // 1 a 5
  comentario: string;
  curso: string;
  autor_alias: string;
  fecha: string;
  estado: "aprobado" | "pendiente";
}

export interface Carrera {
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
  poster_pdf_url?: string;
  poster_nombre_archivo?: string;
}

export interface CursoMalla {
  id: string;
  carrera_id: CarreraId;
  ciclo: number;
  codigo: string;
  nombre_curso: string;
  creditos: number;
  tipo_curso: "O" | "E";
  prerequisitos: string[];
}

export interface MaterialRepositorio {
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

export interface ImagenStorage {
  id: string;
  nombre_archivo: string;
  categoria: "Logo Institucional" | "Banner Noticia" | "Foto Facultad" | "Fondo Hero Home";
  url_publica: string;
  tamano_kb: string;
  fecha_subida: string;
}

export interface TicketSoporte {
  id: string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  fecha: string;
  estado_atencion: EstadoAtencion;
}

export interface TemaCarreraConfig {
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
