"use client";

import React from "react";
import { ExternalLink, createLucideIcon } from "lucide-react";
import { sanitizarHtml, sanitizarTextoEnriquecido, sanitizarUrlSegura } from "./securitySanitizer";

export { sanitizarHtml, sanitizarTextoEnriquecido, sanitizarUrlSegura };

// Íconos de Redes Sociales con createLucideIcon de lucide-react (compatible con lucide-react v1+)
export const Facebook = createLucideIcon("Facebook", [
  ["path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", key: "fb" }],
]);

export const Instagram = createLucideIcon("Instagram", [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "ig-rect" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "ig-path" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "ig-line" }],
]);

export const Linkedin = createLucideIcon("Linkedin", [
  ["path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z", key: "in-1" }],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "in-2" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "in-3" }],
]);

export const Youtube = createLucideIcon("Youtube", [
  ["path", { d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17", key: "yt-1" }],
  ["path", { d: "m10 15 5-3-5-3z", key: "yt-2" }],
]);

export function formatearFechaEspanol(fechaIso: string): string {
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

export function obtenerInicialesDocente(nombre: string): string {
  const limpio = nombre.replace(/^(Dr\.|Dra\.|Mg\.|Lic\.)\s*/i, "").trim();
  const partes = limpio.split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "FCM";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
}

// Motor seguro de renderizado inline (**negrita**, *cursiva*, [texto](url) y URLs automáticas) con sanitización anti-XSS
export function renderTextoEnriquecidoLinea(texto: string, keyPrefix: string): React.ReactNode[] {
  const textoSeguro = sanitizarTextoEnriquecido(texto);
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s<]+|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const partes = textoSeguro.split(tokenRegex);
  return partes.map((parte, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (!parte) return null;
    const matchLinkMd = parte.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (matchLinkMd) {
      const label = sanitizarTextoEnriquecido(matchLinkMd[1]);
      const safeHref = sanitizarUrlSegura(matchLinkMd[2]);
      return (
        <a
          key={key}
          href={safeHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-red-700 hover:text-red-800 font-bold underline decoration-red-400 underline-offset-2 break-all inline-flex items-center gap-1"
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0" />
        </a>
      );
    }
    if (/^https?:\/\/[^\s<]+$/.test(parte)) {
      const urlLimpia = sanitizarUrlSegura(parte.replace(/[.,;)]+$/, ""));
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
        <strong key={key} className="font-bold text-slate-900 dark:text-white">
          {parte.slice(2, -2)}
        </strong>
      );
    }
    if (parte.startsWith("*") && parte.endsWith("*") && parte.length > 2) {
      return (
        <em key={key} className="italic text-slate-800 dark:text-slate-200">
          {parte.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={key}>{parte}</React.Fragment>;
  });
}

// Motor de bloques para el cuerpo de las noticias con protección anti-XSS (DOMPurify + lista blanca)
export function renderizarContenidoNoticia(contenido: string): React.ReactNode {
  if (!contenido) return null;
  const contenidoLimpio = sanitizarTextoEnriquecido(contenido);
  const lineas = contenidoLimpio.split(/\r?\n/);
  const elementos: React.ReactNode[] = [];
  let listaViñetasActual: string[] = [];
  let listaNumeradaActual: string[] = [];

  const vaciarListas = (keyBase: string) => {
    if (listaViñetasActual.length > 0) {
      elementos.push(
        <ul key={`${keyBase}-ul`} className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 my-3">
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
        <ol key={`${keyBase}-ol`} className="list-decimal pl-6 space-y-2 text-slate-700 dark:text-slate-300 my-3">
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
      elementos.push(<hr key={key} className="my-6 border-slate-200 dark:border-slate-800" />);
      return;
    }
    if (linea.startsWith("### ")) {
      vaciarListas(key);
      elementos.push(
        <h4 key={key} className="text-base sm:text-lg font-bold text-[#002855] dark:text-white mt-5 mb-2">
          {renderTextoEnriquecidoLinea(linea.slice(4), key)}
        </h4>
      );
      return;
    }
    if (linea.startsWith("## ")) {
      vaciarListas(key);
      elementos.push(
        <h3 key={key} className="text-lg sm:text-xl font-bold text-[#002855] dark:text-white mt-6 mb-2.5 border-l-4 border-red-600 pl-3">
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
          className="my-4 border-l-4 border-red-700 bg-blue-50/70 dark:bg-slate-800/60 px-4 py-3.5 rounded-r-2xl text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium leading-relaxed"
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
      <p key={key} className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed my-3">
        {renderTextoEnriquecidoLinea(linea, key)}
      </p>
    );
  });

  vaciarListas("final");
  return <div className="space-y-1">{elementos}</div>;
}
