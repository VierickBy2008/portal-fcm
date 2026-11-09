import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type {
  ResenaDocente,
  MaterialRepositorio,
  TicketSoporte,
  SolicitudTutoria,
} from "@/app/types/portal";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const SUPABASE_ADMIN_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-anon-key";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY);

function cleanText(str: unknown, maxLen = 500): string {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>?/gm, "").trim().slice(0, maxLen);
}

function esUrlHttpsSegura(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "https:") return false;
    const extensionesPeligrosas = /\.(exe|bat|cmd|sh|vbs|msi|scr|ps1|jar|apk)$/i;
    if (extensionesPeligrosas.test(parsed.pathname)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Cuerpo de solicitud inválido." }, { status: 400 });
    }

    const { tipo, payload } = body;
    if (!tipo || !payload || typeof payload !== "object") {
      return NextResponse.json({ ok: false, error: "Tipo y datos requeridos." }, { status: 400 });
    }

    // 1. Detección silenciosa de Honeypot anti-bots (si un bot llena el campo trampa, simular éxito)
    if (payload.bot_trap && String(payload.bot_trap).trim() !== "") {
      return NextResponse.json({ ok: true, simulated: true });
    }

    // 2. Obtener estado actual de la tabla portal_config
    const { data: configData, error: readError } = await supabaseAdmin
      .from("portal_config")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (readError && readError.code !== "PGRST116") {
      return NextResponse.json(
        { ok: false, error: "Error de lectura en la base de datos institucional." },
        { status: 500 }
      );
    }

    // =========================================================================
    // CASO A: RESEÑA DE DOCENTE PÚBLICA (ESTADO OBLIGATORIO: "pendiente")
    // =========================================================================
    if (tipo === "resena") {
      const docenteId = cleanText(payload.docente_id, 80);
      const comentario = cleanText(payload.comentario, 800);
      const puntuacion = Math.min(5, Math.max(1, Math.round(Number(payload.puntuacion) || 5))) as 1 | 2 | 3 | 4 | 5;

      if (!docenteId) {
        return NextResponse.json({ ok: false, error: "Docente no especificado." }, { status: 400 });
      }
      if (comentario.length < 10) {
        return NextResponse.json(
          { ok: false, error: "El comentario debe contener al menos 10 caracteres explicativos." },
          { status: 400 }
        );
      }

      const nuevaResena: ResenaDocente = {
        id: `res-${Date.now()}`,
        docente_id: docenteId,
        puntuacion,
        comentario,
        curso: cleanText(payload.curso, 100) || "Asignatura General",
        autor_alias: cleanText(payload.autor_alias, 80) || "Estudiante Anónimo FCM",
        fecha: new Date().toISOString().split("T")[0],
        estado: "pendiente", // Blindaje: el alumno nunca puede auto-aprobarse
      };

      const resenasExistentes: ResenaDocente[] = Array.isArray(configData?.resenas_docentes)
        ? configData.resenas_docentes
        : [];
      const actualizadas = [nuevaResena, ...resenasExistentes];

      const { error: writeErr } = await supabaseAdmin
        .from("portal_config")
        .upsert({ id: 1, resenas_docentes: actualizadas, updated_at: new Date().toISOString() });

      if (writeErr) {
        return NextResponse.json({ ok: false, error: writeErr.message }, { status: 500 });
      }

      return NextResponse.json({
        ok: true,
        mensaje: "Reseña registrada con éxito. Se encuentra en moderación administrativa.",
        item: nuevaResena,
      });
    }

    // =========================================================================
    // CASO B: MATERIAL ACADÉMICO PARA EL REPOSITORIO (ESTADO: "pendiente")
    // =========================================================================
    if (tipo === "material") {
      const titulo = cleanText(payload.titulo, 120);
      const urlArchivo = typeof payload.url_archivo === "string" ? payload.url_archivo.trim() : "";
      const cursoId = cleanText(payload.curso_id, 60);

      if (!titulo || !urlArchivo || !cursoId) {
        return NextResponse.json(
          { ok: false, error: "Título, curso y URL del archivo son obligatorios." },
          { status: 400 }
        );
      }

      if (!esUrlHttpsSegura(urlArchivo)) {
        return NextResponse.json(
          { ok: false, error: "Por seguridad institucional, el enlace debe ser https:// y sin ejecutables." },
          { status: 400 }
        );
      }

      const nuevoMaterial: MaterialRepositorio = {
        id: `mat-${Date.now()}`,
        titulo,
        tipo_archivo: payload.tipo_archivo || "Examen",
        url_archivo: urlArchivo,
        carrera_id: payload.carrera_id || "computacion-cientifica",
        ciclo: Math.min(10, Math.max(1, Number(payload.ciclo) || 1)),
        curso_id: cursoId,
        docente: cleanText(payload.docente, 100) || "Cátedra FCM",
        autor_alias: cleanText(payload.autor_alias, 80) || "Estudiante Anónimo FCM",
        fecha_subida: new Date().toISOString().split("T")[0],
        estado: "pendiente", // Blindaje: debe ser aprobado por el moderador en /admin
      };

      const materialesExistentes: MaterialRepositorio[] = Array.isArray(configData?.materiales_data)
        ? configData.materiales_data
        : [];
      const actualizados = [nuevoMaterial, ...materialesExistentes];

      const { error: writeErr } = await supabaseAdmin
        .from("portal_config")
        .upsert({ id: 1, materiales_data: actualizados, updated_at: new Date().toISOString() });

      if (writeErr) {
        return NextResponse.json({ ok: false, error: writeErr.message }, { status: 500 });
      }

      return NextResponse.json({
        ok: true,
        mensaje: "Material enviado exitosamente a la cola de moderación del Repositorio.",
        item: nuevoMaterial,
      });
    }

    // =========================================================================
    // CASO C: SOLICITUD DE TUTORÍA ACADÉMICA CON IA (ESTADO: "pendiente")
    // =========================================================================
    if (tipo === "tutoria") {
      const estudianteNombre = cleanText(payload.estudiante_nombre, 100);
      const estudianteCorreo = cleanText(payload.estudiante_correo, 100).toLowerCase();
      const codigoEstudiante = cleanText(payload.codigo_estudiante, 12);
      const cursoNombre = cleanText(payload.curso_nombre, 120);

      if (!estudianteNombre || !estudianteCorreo || !codigoEstudiante) {
        return NextResponse.json(
          { ok: false, error: "Nombre, correo institucional y código de estudiante requeridos." },
          { status: 400 }
        );
      }

      if (!estudianteCorreo.endsWith("@unmsm.edu.pe")) {
        return NextResponse.json(
          { ok: false, error: "El registro exige correo institucional oficial (@unmsm.edu.pe)." },
          { status: 400 }
        );
      }

      const nuevaSolicitud: SolicitudTutoria = {
        id: `tut-${Date.now()}`,
        estudiante_nombre: estudianteNombre,
        estudiante_correo: estudianteCorreo,
        codigo_estudiante: codigoEstudiante,
        carrera_id: payload.carrera_id || "computacion-cientifica",
        ciclo: Math.min(10, Math.max(1, Number(payload.ciclo) || 5)),
        curso_id: cleanText(payload.curso_id, 60) || "fcm-gen",
        curso_nombre: cursoNombre || "Asignatura FCM",
        docente_id: cleanText(payload.docente_id, 60),
        docente_nombre: cleanText(payload.docente_nombre, 100),
        dia: payload.dia || "Lunes",
        bloque_horario: cleanText(payload.bloque_horario, 50) || "10:00 - 12:00",
        modalidad: payload.modalidad || "Virtual (Google Meet)",
        motivo_consulta: cleanText(payload.motivo_consulta, 600) || "Consulta académica",
        estado: "pendiente",
        fecha_solicitud: new Date().toISOString().split("T")[0],
        puntaje_match_ia: Math.min(100, Math.max(0, Number(payload.puntaje_match_ia) || 90)),
      };

      // Recuperar configuración de tutorías (desde columna o fallback en storage_data)
      const accData =
        configData?.accesibilidad_data && typeof configData.accesibilidad_data === "object"
          ? (configData.accesibilidad_data as Record<string, unknown>)
          : {};

      let tutConfig: { solicitudes?: SolicitudTutoria[]; [key: string]: unknown } =
        accData.tutorias_ia_config && typeof accData.tutorias_ia_config === "object"
          ? (accData.tutorias_ia_config as { solicitudes?: SolicitudTutoria[]; [key: string]: unknown })
          : {};

      if ((!tutConfig.solicitudes || tutConfig.solicitudes.length === 0) && Array.isArray(configData?.storage_data)) {
        const metaTut = configData.storage_data.find(
          (x: { id?: string; tutorias_ia_config?: { solicitudes?: SolicitudTutoria[] } }) =>
            x && x.id === "__fcm_tutorias_config__"
        );
        if (metaTut?.tutorias_ia_config) {
          tutConfig = metaTut.tutorias_ia_config;
        }
      }

      const solicitudesExistentes: SolicitudTutoria[] = Array.isArray(tutConfig.solicitudes)
        ? tutConfig.solicitudes
        : [];

      const nuevasSolicitudes = [nuevaSolicitud, ...solicitudesExistentes];
      const accDataActualizado = {
        ...accData,
        tutorias_ia_config: {
          ...tutConfig,
          solicitudes: nuevasSolicitudes,
        },
      };

      const { error: writeErr } = await supabaseAdmin
        .from("portal_config")
        .upsert({ id: 1, accesibilidad_data: accDataActualizado, updated_at: new Date().toISOString() });

      if (writeErr) {
        // Fallback seguro a storage_data si falta la columna accesibilidad_data en PostgreSQL
        const listaStorage = Array.isArray(configData?.storage_data) ? [...configData.storage_data] : [];
        const idx = listaStorage.findIndex((x: { id?: string }) => x && x.id === "__fcm_tutorias_config__");
        const metaItem = { id: "__fcm_tutorias_config__", tutorias_ia_config: accDataActualizado.tutorias_ia_config };
        if (idx >= 0) {
          listaStorage[idx] = metaItem;
        } else {
          listaStorage.push(metaItem);
        }
        const { error: storageErr } = await supabaseAdmin
          .from("portal_config")
          .upsert({ id: 1, storage_data: listaStorage, updated_at: new Date().toISOString() });

        if (storageErr) {
          return NextResponse.json({ ok: false, error: storageErr.message }, { status: 500 });
        }
      }

      return NextResponse.json({
        ok: true,
        mensaje: "Solicitud de tutoría agendada con éxito.",
        item: nuevaSolicitud,
      });
    }

    // =========================================================================
    // CASO D: FORMULARIO DE CONTACTO / TICKET DE ATENCIÓN
    // =========================================================================
    if (tipo === "ticket") {
      const nombre = cleanText(payload.nombre, 100);
      const email = cleanText(payload.email, 100);
      const asunto = cleanText(payload.asunto, 150);
      const mensaje = cleanText(payload.mensaje, 1000);

      if (!nombre || !email || !asunto || !mensaje) {
        return NextResponse.json({ ok: false, error: "Todos los campos son obligatorios." }, { status: 400 });
      }

      const nuevoTicket: TicketSoporte = {
        id: `tck-${Date.now()}`,
        nombre,
        email,
        asunto,
        mensaje,
        fecha: new Date().toISOString().slice(0, 16).replace("T", " "),
        estado_atencion: "pendiente",
      };

      // Recuperar tickets existentes (columna directa o fallback en storage_data)
      let ticketsExistentes: TicketSoporte[] = [];
      if (Array.isArray(configData?.tickets_data) && configData.tickets_data.length > 0) {
        ticketsExistentes = configData.tickets_data;
      } else if (Array.isArray(configData?.storage_data)) {
        const metaTck = configData.storage_data.find(
          (x: { id?: string; tickets?: TicketSoporte[] }) => x && x.id === "__fcm_tickets_config__"
        );
        if (metaTck && Array.isArray(metaTck.tickets)) {
          ticketsExistentes = metaTck.tickets;
        }
      }

      const actualizados = [nuevoTicket, ...ticketsExistentes];

      const { error: writeErr } = await supabaseAdmin
        .from("portal_config")
        .upsert({ id: 1, tickets_data: actualizados, updated_at: new Date().toISOString() });

      if (writeErr) {
        // Fallback seguro a storage_data si no existe la columna tickets_data en PostgreSQL
        const listaStorage = Array.isArray(configData?.storage_data) ? [...configData.storage_data] : [];
        const idx = listaStorage.findIndex((x: { id?: string }) => x && x.id === "__fcm_tickets_config__");
        const metaItem = { id: "__fcm_tickets_config__", tickets: actualizados };
        if (idx >= 0) {
          listaStorage[idx] = metaItem;
        } else {
          listaStorage.push(metaItem);
        }

        const { error: storageErr } = await supabaseAdmin
          .from("portal_config")
          .upsert({ id: 1, storage_data: listaStorage, updated_at: new Date().toISOString() });

        if (storageErr) {
          return NextResponse.json({ ok: false, error: storageErr.message }, { status: 500 });
        }
      }

      return NextResponse.json({
        ok: true,
        mensaje: "Ticket de atención registrado con éxito.",
        item: nuevoTicket,
      });
    }

    return NextResponse.json({ ok: false, error: "Tipo de envío no reconocido." }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error interno del servidor." },
      { status: 500 }
    );
  }
}
