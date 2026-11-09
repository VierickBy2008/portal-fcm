import { NextRequest, NextResponse } from "next/server";

interface MensajeHistorial {
  emisor: "bot" | "usuario";
  texto: string;
}

interface ChatRequestBody {
  mensaje?: string;
  historial?: MensajeHistorial[];
}

const SYSTEM_INSTRUCTION_FCM = `
Eres el "Asistente Virtual Inteligente" del Portal Oficial de la Facultad de Ciencias Matemáticas (FCM) de la Universidad Nacional Mayor de San Marcos (UNMSM) — Decana de América, Lima, Perú.

Tus objetivos y reglas de oro son:
1. TONO: Amable, formal, empático, académico y orgullosamente sanmarquino.
2. CONCISIÓN: Respuestas directas, claras y bien redactadas. Usa viñetas cuando sea conveniente para facilitar la lectura en teléfonos y computadoras.
3. VERACIDAD (CERO ALUCINACIONES): Responde basándote únicamente en la información oficial de la Facultad:
   - 4 Escuelas Profesionales (Pregrado 2026):
     * Computación Científica (Código 14.5): 5 años, 10 ciclos, 220 créditos. Áreas: Inteligencia Artificial, Ciberseguridad, Simulación Numérica, Software de Alto Rendimiento (HPC) y Ciencia de Datos.
     * Matemática (Código 14.1): 5 años, 10 ciclos, 220 créditos. Áreas: Rigor científico, Abstracción, Modelado Teórico, Análisis, Álgebra y Ecuaciones Diferenciales.
     * Estadística (Código 14.2): 5 años, 10 ciclos, 231 créditos. Áreas: Ciencia de Datos, Inferencia y Modelado Predictivo, Machine Learning, Bioestadística y Muestreo.
     * Investigación Operativa (Código 14.4): 5 años, 10 ciclos, 220 créditos. Áreas: Optimización Matemática, Logística y Cadena de Suministro, Toma de Decisiones Complejas y Simulación Estocástica.
   - Calendario Académico Oficial 2026 (SUM):
     * Semestre 2026-I:
       - Matrícula regular: 16 al 20 de marzo de 2026.
       - Clases lectivas: Del 30 de marzo al 18 de julio de 2026 (16 semanas).
       - Exámenes parciales: 18 al 22 de mayo de 2026.
       - Exámenes finales: 13 al 17 de julio de 2026.
       - Exámenes sustitutorios / rezagados: 20 y 21 de julio de 2026.
     * Semestre 2026-II:
       - Matrícula regular: 10 al 14 de agosto de 2026.
       - Clases lectivas: Del 24 de agosto al 12 de diciembre de 2026.
       - Exámenes parciales: 12 al 17 de octubre de 2026.
       - Exámenes finales: 07 al 12 de diciembre de 2026.
       - Exámenes sustitutorios: 14 al 16 de diciembre de 2026.
   - Contactos Oficiales y Mesa de Partes:
     * Central Telefónica UNMSM: (01) 619-7000.
     * Decanato y Secretaría: decanato.matematicas@unmsm.edu.pe (Anexo 1401 / 1402).
     * Matrícula, Grados y Títulos: matricula.fcm@unmsm.edu.pe (Anexo 1408).
     * Escuela de Computación Científica: epcc.matematicas@unmsm.edu.pe (Anexo 1425).
     * Portal del SUM: https://sum.unmsm.edu.pe
4. LIMITACIONES: Si te preguntan algo que no concierne a la FCM o a San Marcos, redirige cortésmente hacia las materias académicas, cursos o trámites de la facultad.
5. RECOMENDACIONES DE ENLACES: Si la respuesta se relaciona con una escuela específica, puedes invitar al estudiante a revisar su malla curricular interactiva en el menú superior o en la sección /carreras.
`.trim();

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json().catch(() => ({}));
    const mensaje = body.mensaje?.trim();

    if (!mensaje) {
      return NextResponse.json(
        { ok: false, error: "El mensaje no puede estar vacío." },
        { status: 400 }
      );
    }

    if (mensaje.length > 800) {
      return NextResponse.json(
        { ok: false, error: "El mensaje excede el límite permitido de 800 caracteres." },
        { status: 400 }
      );
    }

    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    // Si no hay API key disponible en las variables de entorno, devolvemos fallback para que el cliente use su motor local
    if (!apiKey) {
      return NextResponse.json({
        ok: false,
        fallback: true,
        motivo: "GEMINI_API_KEY no configurada en variables de entorno del servidor.",
      });
    }

    // Formatear historial reciente (máximo los últimos 4 intercambios)
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(body.historial)) {
      for (const h of body.historial.slice(-4)) {
        if (!h.texto) continue;
        contents.push({
          role: h.emisor === "usuario" ? "user" : "model",
          parts: [{ text: h.texto }],
        });
      }
    }

    // Añadir el mensaje actual del usuario
    contents.push({
      role: "user",
      parts: [{ text: mensaje }],
    });

    // Lista de modelos de alta velocidad soportados en orden de prioridad
    const modelosParaProbar = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-1.5-flash"];
    interface GeminiResponse {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    }
    let dataGoogle: GeminiResponse | null = null;
    let modeloExitoso = "";

    for (const model of modelosParaProbar) {
      try {
        const urlGemini = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const resG = await fetch(urlGemini, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION_FCM }] },
            contents,
            generationConfig: {
              temperature: 0.35,
              maxOutputTokens: 550,
              topP: 0.9,
            },
          }),
        });

        if (resG.ok) {
          const parsed = (await resG.json()) as GeminiResponse;
          if (parsed?.candidates?.[0]?.content?.parts?.[0]?.text) {
            dataGoogle = parsed;
            modeloExitoso = model;
            break;
          }
        }
      } catch {
        // Continuar al siguiente modelo
      }
    }

    if (!dataGoogle || !dataGoogle.candidates?.[0]) {
      return NextResponse.json({
        ok: false,
        fallback: true,
        motivo: "Modelos no respondieron, usando motor local",
      });
    }

    const candidato = dataGoogle.candidates[0];
    const textoRespuesta: string | undefined = candidato?.content?.parts?.[0]?.text;

    if (!textoRespuesta) {
      return NextResponse.json({
        ok: false,
        fallback: true,
        motivo: "Sin respuesta de texto del modelo",
      });
    }

    // Detectar si la respuesta menciona fuertemente alguna carrera para sugerir acción en UI
    const lower = mensaje.toLowerCase();
    let carreraAccion: string | undefined = undefined;
    if (lower.includes("computacion") || lower.includes("hpc") || lower.includes("software")) {
      carreraAccion = "computacion-cientifica";
    } else if (lower.includes("estadistica") || lower.includes("datos")) {
      carreraAccion = "estadistica";
    } else if (lower.includes("operativa") || lower.includes("optimizacion")) {
      carreraAccion = "investigacion-operativa";
    } else if (lower.includes("matematica pura") || lower.includes("epm")) {
      carreraAccion = "matematica";
    }

    return NextResponse.json({
      ok: true,
      texto: textoRespuesta.trim(),
      carreraAccion,
      fuente: modeloExitoso || "gemini",
    });
  } catch (error) {
    console.error("Error en endpoint /api/chat:", error);
    return NextResponse.json(
      { ok: false, fallback: true, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
