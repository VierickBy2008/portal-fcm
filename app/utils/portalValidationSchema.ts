import { z } from "zod";

const urlMultimediaSchema = z
  .string()
  .refine(
    (val) =>
      val.trim() === "" ||
      val.startsWith("https://") ||
      val.startsWith("http://") ||
      val.startsWith("data:") ||
      val.startsWith("/"),
    {
      message: "La URL multimedia debe iniciar con https:// o ser un recurso institucional válido.",
    }
  );

export const carreraSchema = z
  .object({
    id: z.enum([
      "computacion-cientifica",
      "matematica",
      "estadistica",
      "investigacion-operativa",
    ]),
    codigo_escuela: z.string().min(1),
    nombre: z.string().min(1),
    grado_academico: z.string().min(1),
    titulo_profesional: z.string().min(1),
    duracion_anios: z.number().int().min(1).max(10),
    total_semestres: z.number().int().min(2).max(20),
    creditos_totales: z.number().min(180).max(260),
    mision: z.string(),
    vision: z.string(),
    perfil_ingresante: z.string(),
    perfil_egresado: z.string(),
    campo_ocupacional: z.string(),
    pilares_formacion: z.array(z.string().min(1)),
    areas_desempeno: z.array(z.string().min(1)),
    imagen_referencial_url: urlMultimediaSchema,
    triptico_pdf_url: urlMultimediaSchema,
    poster_pdf_url: urlMultimediaSchema.optional(),
    subtitulo_bento: z.string().optional(),
    especializaciones_bento: z.array(z.string().min(1)).optional(),
    sectores_laborales_bento: z.array(z.string().min(1)).optional(),
    brochure_info: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

export const actividadCalendarioSchema = z
  .object({
    id: z.string().min(1),
    titulo: z.string().min(1, "El título de la actividad no puede estar vacío"),
    fecha: z.string().min(1, "La fecha de la actividad no puede estar vacía"),
    semestre: z.enum(["2026-I", "2026-II"]),
    categoria: z.enum([
      "matricula",
      "clases",
      "examenes",
      "tramites",
      "institucional",
    ]),
    descripcion: z.string(),
    destacado: z.boolean().optional(),
  })
  .passthrough();

export const calendarioConfigSchema = z
  .object({
    semestre_activo: z.enum(["2026-I", "2026-II"]),
    titulo_seccion: z.string().min(1),
    subtitulo_seccion: z.string(),
    resolucion_decanal: z.string(),
    pdf_oficial_url: urlMultimediaSchema.optional(),
    actividades: z.array(actividadCalendarioSchema),
  })
  .passthrough();

export const noticiaSchema = z
  .object({
    id: z.string().min(1),
    titulo: z.string().min(1),
    resumen: z.string().optional(),
    contenido: z.string().min(1),
    categoria: z.string().min(1),
    imagen_url: urlMultimediaSchema,
    fecha_publicacion: z.string().min(1),
    destacado: z.boolean(),
  })
  .passthrough();

export const docenteSchema = z
  .object({
    id: z.string().min(1),
    nombre_completo: z.string().min(1),
    grado_academico: z.string().min(1),
    categoria_docente: z.string().min(1),
    condicion: z.string().min(1),
    carrera_id: z.enum([
      "computacion-cientifica",
      "matematica",
      "estadistica",
      "investigacion-operativa",
    ]),
    especialidad: z.string().min(1),
    lineas_investigacion: z.string(),
    cursos_dictados: z.array(z.string()),
    correo: z.string().min(1),
    horario_asesoria: z.string(),
    foto_url: urlMultimediaSchema,
  })
  .passthrough();

export const materialSchema = z
  .object({
    id: z.string().min(1),
    titulo: z.string().min(1),
    carrera_id: z.string().min(1),
    curso_id: z.string().min(1),
    tipo_archivo: z.string().min(1),
    docente: z.string(),
    autor_alias: z.string(),
    url_archivo: urlMultimediaSchema,
    estado: z.enum(["aprobado", "pendiente"]),
  })
  .passthrough();

export const orgulloSchema = z
  .object({
    id: z.string().min(1),
    nombre_completo: z.string().min(1),
    carrera_id: z.string().min(1),
    logro_titulo: z.string().min(1),
    resumen: z.string(),
    imagen_url: urlMultimediaSchema,
  })
  .passthrough();

export const transparenciaSchema = z
  .object({
    id: z.string().min(1),
    titulo: z.string().min(1),
    categoria: z.string().min(1),
    anio: z.string().min(1),
    fecha_publicacion: z.string().min(1),
    archivo_url: urlMultimediaSchema,
  })
  .passthrough();

export const portalConfigSyncSchema = z
  .object({
    logo_url: urlMultimediaSchema.optional(),
    hero_bg_url: z.string().optional(),
    hero_blur: z.number().min(0).max(40).optional(),
    hero_overlay_opacity: z.number().min(0).max(100).optional(),
    hero_overlay_color: z.string().optional(),
    carreras_data: z.array(carreraSchema).optional(),
    calendario_data: calendarioConfigSchema.optional(),
    noticias_data: z.array(noticiaSchema).optional(),
    docentes_data: z.array(docenteSchema).optional(),
    materiales_data: z.array(materialSchema).optional(),
    orgullo_data: z.array(orgulloSchema).optional(),
    transparencia_data: z.array(transparenciaSchema).optional(),
    resenas_docentes: z.array(z.record(z.string(), z.unknown())).optional(),
    resenas_data: z.array(z.record(z.string(), z.unknown())).optional(),
    malla_data: z.array(z.record(z.string(), z.unknown())).optional(),
    tickets_data: z.array(z.record(z.string(), z.unknown())).optional(),
    storage_data: z.array(z.record(z.string(), z.unknown())).optional(),
    asistente_ia_data: z.record(z.string(), z.unknown()).optional(),
    accesibilidad_data: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();
