import DOMPurify from "dompurify";

const ALLOWED_TAGS_LIST = [
  "p",
  "b",
  "strong",
  "i",
  "em",
  "a",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "code",
  "pre",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "br",
  "span",
];

const ALLOWED_ATTR_LIST = ["href", "title", "target", "rel", "class"];

/**
 * Valida que una URL sea segura (impide protocolos javascript:, vbscript:, data:text/html).
 */
export function sanitizarUrlSegura(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") return "#";
  const trimmed = rawUrl.trim();
  const normalized = trimmed.replace(/[\u0000-\u001F\u007F-\u009F\s]+/g, "").toLowerCase();
  if (
    normalized.startsWith("javascript:") ||
    normalized.startsWith("vbscript:") ||
    normalized.startsWith("data:text/html") ||
    normalized.startsWith("data:application")
  ) {
    return "#";
  }
  if (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("#")
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Sanitizador determinístico compatible tanto con SSR (Node.js) como con Navegador (DOMPurify).
 * Elimina <script>, <iframe>, handlers on*=, eval(), javascript: y fuerza rel="noopener noreferrer" target="_blank" en enlaces.
 */
export function sanitizarHtml(htmlString: string): string {
  if (!htmlString || typeof htmlString !== "string") return "";

  // 1. Limpieza preliminar determinística (SSR + Cliente) contra vectores XSS
  let clean = htmlString
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<(object|embed|style|form|input|button|textarea|meta|link|base)\b[^>]*>/gi, "")
    .replace(/<\/(object|embed|style|form|input|button|textarea|meta|link|base)>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(?:javascript|vbscript|data\s*:\s*text\/html)\s*:/gi, "blocked:")
    .replace(/\beval\s*\(/gi, "blocked_eval(");

  // 2. Si estamos en el cliente, ejecutar DOMPurify con lista blanca estricta
  if (typeof window !== "undefined" && typeof DOMPurify?.sanitize === "function") {
    clean = DOMPurify.sanitize(clean, {
      ALLOWED_TAGS: ALLOWED_TAGS_LIST,
      ALLOWED_ATTR: ALLOWED_ATTR_LIST,
      ALLOW_DATA_ATTR: false,
    });
  } else {
    // En SSR: filtrar cualquier etiqueta que no pertenezca a ALLOWED_TAGS_LIST
    clean = clean.replace(/<\/?([a-zA-Z0-9-]+)(\s[^>]*)?>/g, (fullMatch, tagName: string) => {
      const lowerTag = tagName.toLowerCase();
      if (!ALLOWED_TAGS_LIST.includes(lowerTag)) {
        return "";
      }
      return fullMatch;
    });
  }

  // 3. Forzar rel="noopener noreferrer" y target="_blank" en todas las etiquetas <a>
  clean = clean.replace(/<a\b([^>]*)>/gi, (_match, attrs: string) => {
    const hrefMatch = attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const rawHref = hrefMatch ? hrefMatch[1] || hrefMatch[2] || hrefMatch[3] || "#" : "#";
    const safeHref = sanitizarUrlSegura(rawHref);
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">`;
  });

  return clean;
}

/**
 * Sanitiza cadenas de texto o Markdown ligero eliminando etiquetas HTML maliciosas
 * antes de ser procesadas por el formateador de noticias, reseñas o descripciones del repositorio.
 */
export function sanitizarTextoEnriquecido(texto: string): string {
  if (!texto || typeof texto !== "string") return "";
  return texto
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(?:javascript|vbscript|data\s*:\s*text\/html)\s*:/gi, "")
    .replace(/\beval\s*\(/gi, "")
    .replace(/<\/?(?:script|iframe|object|embed|style|form|input|svg|math)\b[^>]*>/gi, "");
}
