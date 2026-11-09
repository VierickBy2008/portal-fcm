import nodemailer from "nodemailer";
import type { TicketSoporte, SolicitudTutoria } from "@/app/types/portal";

interface SendEmailResult {
  ok: boolean;
  provider?: "resend" | "smtp" | "simulated";
  error?: string;
}

const DEFAULT_DESTINATARIO =
  process.env.ADMIN_NOTIFICATION_EMAIL || "decanato.matematicas@unmsm.edu.pe";

/**
 * Plantilla HTML Institucional UNMSM - FCM para nuevos tickets de Mesa de Ayuda
 */
function generarHtmlTicket(ticket: TicketSoporte, urlAdmin: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nuevo Ticket - FCM UNMSM</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <!-- Header Institucional -->
          <tr>
            <td style="background: linear-gradient(135deg, #002855 0%, #001733 100%); padding: 28px 30px; text-align: center; border-bottom: 4px solid #8B1515;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">
                Mesa de Ayuda y Atención Estudiantil
              </h1>
              <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Facultad de Ciencias Matemáticas • UNMSM
              </p>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding: 30px;">
              <div style="background-color: #fef2f2; border-left: 4px solid #8B1515; padding: 12px 16px; border-radius: 6px; margin-bottom: 22px;">
                <span style="color: #8B1515; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                  🔔 Nuevo mensaje recibido desde el Portal Web
                </span>
              </div>

              <h2 style="margin: 0 0 16px 0; color: #002855; font-size: 17px; font-weight: 800; line-height: 1.4;">
                ${ticket.asunto}
              </h2>

              <table role="presentation" width="100%" style="margin-bottom: 22px; font-size: 13px; color: #475569;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; width: 140px; color: #64748b;">Estudiante:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${ticket.nombre || "Anónimo"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Correo:</td>
                  <td style="padding: 6px 0;">
                    <a href="mailto:${ticket.email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${ticket.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Fecha y Hora:</td>
                  <td style="padding: 6px 0; color: #0f172a;">${ticket.fecha || "Reciente"}</td>
                </tr>
              </table>

              <!-- Mensaje -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 26px;">
                <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                  Mensaje del Estudiante:
                </p>
                <p style="margin: 0; color: #1e293b; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">
                  ${ticket.mensaje}
                </p>
              </div>

              <!-- Botones de Acción -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 10px;">
                    <a href="${urlAdmin}" target="_blank" style="display: inline-block; background-color: #002855; color: #ffffff; font-size: 13px; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px;">
                      Gestionar en el Panel /admin →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="mailto:${ticket.email}?subject=Re: [FCM UNMSM] ${encodeURIComponent(ticket.asunto)}" style="display: inline-block; color: #002855; font-size: 12px; font-weight: 600; text-decoration: underline;">
                      Responder directamente al estudiante (${ticket.email})
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
              Sistema de Notificaciones Oficiales • Facultad de Ciencias Matemáticas • UNMSM<br>
              Ciudad Universitaria, Lima, Perú.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Plantilla HTML para solicitudes de Tutoría IA
 */
function generarHtmlTutoria(tut: SolicitudTutoria, urlAdmin: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Nueva Solicitud de Tutoría IA</title></head>
<body style="margin:0;padding:20px;background:#f8fafc;font-family:sans-serif;">
  <div style="max-width:560px;margin:auto;background:#fff;border-radius:14px;padding:26px;border:1px solid #e2e8f0;box-shadow:0 2px 10px rgba(0,0,0,0.04);">
    <div style="background:#002855;color:#fff;padding:14px 18px;border-radius:10px;text-align:center;">
      <h2 style="margin:0;font-size:16px;">🎓 Nueva Reserva de Tutoría Académica con IA</h2>
    </div>
    <div style="margin-top:20px;font-size:13px;color:#334155;line-height:1.6;">
      <p><strong>Estudiante:</strong> ${tut.estudiante_nombre} (${tut.codigo_estudiante})</p>
      <p><strong>Correo:</strong> <a href="mailto:${tut.estudiante_correo}">${tut.estudiante_correo}</a></p>
      <p><strong>Curso:</strong> ${tut.curso_nombre}</p>
      <p><strong>Docente Asignado:</strong> ${tut.docente_nombre}</p>
      <p><strong>Horario:</strong> ${tut.dia} ${tut.bloque_horario} (${tut.modalidad})</p>
      <p><strong>Motivo / Consulta:</strong> ${tut.motivo_consulta}</p>
    </div>
    <div style="margin-top:24px;text-align:center;">
      <a href="${urlAdmin}" style="background:#002855;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:bold;">
        Revisar en Panel Administrativo →
      </a>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Envía una notificación por correo electrónico del ticket recibido.
 * Soporta automáticamente:
 * 1. Resend API (si está configurada RESEND_API_KEY)
 * 2. Nodemailer SMTP (si están configurados SMTP_USER y SMTP_PASS)
 * 3. Modo Simulación / Log si no hay credenciales (no rompe la web)
 */
export async function enviarNotificacionTicketEmail(
  ticket: TicketSoporte,
  destinatarioOverride?: string
): Promise<SendEmailResult> {
  const destinatario = destinatarioOverride || DEFAULT_DESTINATARIO;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-fcm.vercel.app";
  const urlAdmin = `${baseUrl}/admin`;
  const subject = `[FCM UNMSM] Nueva consulta de soporte: ${ticket.asunto}`;
  const html = generarHtmlTicket(ticket, urlAdmin);

  // 1. INTENTO VÍA RESEND (Recomendado para Vercel)
  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  if (resendApiKey) {
    try {
      const fromEmail =
        process.env.RESEND_FROM_EMAIL || "FCM UNMSM Soporte <onboarding@resend.dev>";
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [destinatario],
          reply_to: ticket.email,
          subject,
          html,
        }),
      });

      if (resp.ok) {
        return { ok: true, provider: "resend" };
      }
      const errJson = await resp.json().catch(() => null);
      console.warn("[EmailService Resend Error]:", errJson);
    } catch (err) {
      console.warn("[EmailService Resend Fetch Exception]:", err);
    }
  }

  // 2. INTENTO VÍA SMTP / NODEMAILER (Gmail u otro servidor SMTP)
  const smtpUser = (process.env.SMTP_USER || "").trim();
  const smtpPass = (process.env.SMTP_PASS || "").trim();
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: (process.env.SMTP_SECURE || "true") === "true",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || "Mesa de Ayuda FCM"}" <${smtpUser}>`,
        to: destinatario,
        replyTo: ticket.email,
        subject,
        html,
      });

      return { ok: true, provider: "smtp" };
    } catch (err) {
      console.warn("[EmailService SMTP Error]:", err);
      return {
        ok: false,
        provider: "smtp",
        error: err instanceof Error ? err.message : "Error enviando correo SMTP",
      };
    }
  }

  // 3. MODO SIMULACIÓN (Si no hay variables de entorno aún)
  console.log(
    `[EmailService Simulado]: Ticket de ${ticket.email} procesado. Para recibir correos reales configura RESEND_API_KEY o SMTP_USER/SMTP_PASS en Vercel.`
  );
  return {
    ok: true,
    provider: "simulated",
  };
}

/**
 * Envía notificación de solicitud de tutoría
 */
export async function enviarNotificacionTutoriaEmail(
  tutoria: SolicitudTutoria,
  destinatarioOverride?: string
): Promise<SendEmailResult> {
  const destinatario = destinatarioOverride || DEFAULT_DESTINATARIO;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-fcm.vercel.app";
  const urlAdmin = `${baseUrl}/admin`;
  const subject = `[Tutorías IA FCM] Reserva de tutoría: ${tutoria.curso_nombre} - ${tutoria.estudiante_nombre}`;
  const html = generarHtmlTutoria(tutoria, urlAdmin);

  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  if (resendApiKey) {
    try {
      const fromEmail =
        process.env.RESEND_FROM_EMAIL || "FCM Tutorías <onboarding@resend.dev>";
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [destinatario],
          reply_to: tutoria.estudiante_correo,
          subject,
          html,
        }),
      });
      if (resp.ok) return { ok: true, provider: "resend" };
    } catch (e) {
      console.warn("[Tutoria Email Resend Err]:", e);
    }
  }

  const smtpUser = (process.env.SMTP_USER || "").trim();
  const smtpPass = (process.env.SMTP_PASS || "").trim();
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || "Tutorías IA FCM"}" <${smtpUser}>`,
        to: destinatario,
        replyTo: tutoria.estudiante_correo,
        subject,
        html,
      });
      return { ok: true, provider: "smtp" };
    } catch (e) {
      console.warn("[Tutoria Email SMTP Err]:", e);
    }
  }

  return { ok: true, provider: "simulated" };
}
