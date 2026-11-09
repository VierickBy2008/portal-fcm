"use client";

import React from "react";
import {
  Upload,
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Link2,
  Quote,
  Minus,
  Edit3,
  Trash2,
} from "lucide-react";
import { HeroAcademicoConfig, Noticia } from "../../types/portal";
import { renderizarContenidoNoticia } from "../../utils/portalFormatters";
import { HERO_CONFIG_ACADEMICO_INICIAL } from "../../data/portalExtrasData";

export interface FormNoticiaState {
  id: string;
  titulo: string;
  categoria: string;
  resumen: string;
  fecha_publicacion: string;
  contenido: string;
  imagen_url: string;
  destacado: boolean;
  en_carrusel_principal: boolean;
  color_fondo: string;
  fecha_evento: string;
  lugar: string;
  modalidad: string;
  dirigido_a: string;
  enlace_inscripcion: string;
  fondo_imagen_url: string;
  fondo_blur: number;
  fondo_overlay_opacity: number;
  fondo_overlay_color: string;
}

interface AdminNoticiasTabProps {
  noticias: Noticia[];
  setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>>;
  formNoticia: FormNoticiaState;
  setFormNoticia: React.Dispatch<React.SetStateAction<FormNoticiaState>>;
  handleGuardarNoticia: (e: React.FormEvent) => Promise<void> | void;
  inputImagenNoticiaRef: React.RefObject<HTMLInputElement | null>;
  handleSubirImagenPortadaNoticia: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  inputFondoNoticiaRef: React.RefObject<HTMLInputElement | null>;
  handleSubirFondoNoticiaStorage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  textareaNoticiaRef: React.RefObject<HTMLTextAreaElement | null>;
  insertarFormatoNoticia: (
    tipo: "bold" | "italic" | "h2" | "ul" | "ol" | "quote" | "link" | "hr"
  ) => void;
  handleToggleCarruselPrincipal: (noticiaId: string) => Promise<void> | void;
  abrirNoticiaDetalle: (id: string) => void;
  sincronizarPortalConfigSupabase: (payload: Record<string, unknown>) => Promise<boolean>;
  lanzarToast: (msg: string) => void;
  heroConfigAcademico?: HeroAcademicoConfig;
  onGuardarHeroAcademico?: (cfg: HeroAcademicoConfig) => Promise<void> | void;
}

export function AdminNoticiasTab({
  noticias,
  setNoticias,
  formNoticia,
  setFormNoticia,
  handleGuardarNoticia,
  inputImagenNoticiaRef,
  handleSubirImagenPortadaNoticia,
  inputFondoNoticiaRef,
  handleSubirFondoNoticiaStorage,
  textareaNoticiaRef,
  insertarFormatoNoticia,
  handleToggleCarruselPrincipal,
  abrirNoticiaDetalle,
  sincronizarPortalConfigSupabase,
  lanzarToast,
  heroConfigAcademico,
  onGuardarHeroAcademico,
}: AdminNoticiasTabProps) {
  const cfgBase = heroConfigAcademico || HERO_CONFIG_ACADEMICO_INICIAL;

  const handleActualizarSlotPortada = async (
    campo: "noticia_principal_id" | "noticia_secundaria_1_id" | "noticia_secundaria_2_id",
    valor: string
  ) => {
    if (!onGuardarHeroAcademico) return;
    const nuevoCfg: HeroAcademicoConfig = {
      ...cfgBase,
      [campo]: valor,
    };
    await onGuardarHeroAcademico(nuevoCfg);
  };

  return (
    <div className="space-y-8 view-transition-gpu">
      {/* Selector Directo de las 3 Noticias en Portada (1 Principal + 2 Laterales) */}
      <div className="rounded-2xl border-2 border-[#002855]/30 dark:border-blue-800/70 bg-gradient-to-r from-blue-50/70 via-white to-rose-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-700 dark:text-amber-400 block">
              Diagramación Editorial Asimétrica • Campus Académico Moderno
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-[#002855] dark:text-white">
              📰 Selección de Noticias en Portada (1 Principal Grande + 2 Laterales)
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#002855] text-white text-[10px] font-bold self-start sm:self-center">
            Sincronización Instantánea en Supabase
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Slot 1: Noticia Principal */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border-2 border-red-200 dark:border-red-900/60 space-y-1.5">
            <label className="text-xs font-extrabold text-[#8B1515] dark:text-rose-300 flex items-center justify-between">
              <span>1. Noticia Principal (Izquierda Grande)</span>
              <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-[9px] text-red-800 dark:text-red-300 font-mono">
                Ocupa 2 espacios
              </span>
            </label>
            <select
              value={cfgBase.noticia_principal_id || ""}
              onChange={(e) =>
                handleActualizarSlotPortada("noticia_principal_id", e.target.value)
              }
              className="w-full rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#8B1515]"
            >
              <option value="">✨ Automático (1ra Destacada Más Reciente)</option>
              {noticias.map((n) => (
                <option key={n.id} value={n.id}>
                  [{n.categoria}] {n.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* Slot 2: Noticia Secundaria 1 */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-blue-200 dark:border-blue-900/60 space-y-1.5">
            <label className="text-xs font-extrabold text-[#002855] dark:text-blue-300 flex items-center justify-between">
              <span>2. Noticia Secundaria 1 (Derecha Arriba)</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[9px] text-blue-800 dark:text-blue-300 font-mono">
                Lateral 1
              </span>
            </label>
            <select
              value={cfgBase.noticia_secundaria_1_id || ""}
              onChange={(e) =>
                handleActualizarSlotPortada("noticia_secundaria_1_id", e.target.value)
              }
              className="w-full rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#002855]"
            >
              <option value="">✨ Automático (2da Destacada Más Reciente)</option>
              {noticias.map((n) => (
                <option key={n.id} value={n.id}>
                  [{n.categoria}] {n.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* Slot 3: Noticia Secundaria 2 */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-blue-200 dark:border-blue-900/60 space-y-1.5">
            <label className="text-xs font-extrabold text-[#002855] dark:text-blue-300 flex items-center justify-between">
              <span>3. Noticia Secundaria 2 (Derecha Abajo)</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[9px] text-blue-800 dark:text-blue-300 font-mono">
                Lateral 2
              </span>
            </label>
            <select
              value={cfgBase.noticia_secundaria_2_id || ""}
              onChange={(e) =>
                handleActualizarSlotPortada("noticia_secundaria_2_id", e.target.value)
              }
              className="w-full rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#002855]"
            >
              <option value="">✨ Automático (3ra Destacada Más Reciente)</option>
              {noticias.map((n) => (
                <option key={n.id} value={n.id}>
                  [{n.categoria}] {n.titulo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Editor Enriquecido con Barra de Herramientas */}
        <form
          onSubmit={handleGuardarNoticia}
          className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-base text-[#002855] dark:text-white">
              {formNoticia.id
                ? "✏️ Editar Noticia / Comunicado"
                : "➕ Publicar Nueva Noticia Estructurada"}
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
                    imagen_url:
                      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
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
                  })
                }
                className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline cursor-pointer"
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
            className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="date"
              required
              value={formNoticia.fecha_publicacion}
              onChange={(e) =>
                setFormNoticia({ ...formNoticia, fecha_publicacion: e.target.value })
              }
              className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
            />
            <input
              type="text"
              value={formNoticia.categoria}
              onChange={(e) => setFormNoticia({ ...formNoticia, categoria: e.target.value })}
              placeholder="Categoría (ej. Evento, Comunicado, Becas)"
              className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
            />
          </div>

          <input
            type="text"
            value={formNoticia.resumen}
            onChange={(e) => setFormNoticia({ ...formNoticia, resumen: e.target.value })}
            placeholder="Resumen corto para la tarjeta del Home (opcional, máx. 3 líneas)"
            className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3.5 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Imagen o Afiche de Portada *
              </label>
              <button
                type="button"
                onClick={() => inputImagenNoticiaRef.current?.click()}
                className="text-[11px] font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" /> Subir desde PC (Storage)
              </button>
              <input
                ref={inputImagenNoticiaRef}
                type="file"
                accept="image/*"
                onChange={handleSubirImagenPortadaNoticia}
                className="hidden"
              />
            </div>
            <input
              type="url"
              required
              value={formNoticia.imagen_url}
              onChange={(e) => setFormNoticia({ ...formNoticia, imagen_url: e.target.value })}
              placeholder="URL pública de la imagen o afiche..."
              className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
            />
          </div>

          {/* Barra de Herramientas de Formato */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#002855] dark:text-slate-200">
              Contenido Estructurado de la Noticia (Usa los botones para ordenar el texto) *
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800">
              <button
                type="button"
                onClick={() => insertarFormatoNoticia("bold")}
                title="Negrita (**texto**)"
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-[#002855] dark:hover:bg-blue-900 hover:text-white border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Bold className="w-3.5 h-3.5" /> <span>Negrita</span>
              </button>
              <button
                type="button"
                onClick={() => insertarFormatoNoticia("italic")}
                title="Cursiva (*texto*)"
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-[#002855] dark:hover:bg-blue-900 hover:text-white border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Italic className="w-3.5 h-3.5" /> <span>Cursiva</span>
              </button>
              <button
                type="button"
                onClick={() => insertarFormatoNoticia("h2")}
                title="Subtítulo (## Título)"
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-[#002855] dark:hover:bg-blue-900 hover:text-white border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Heading2 className="w-3.5 h-3.5" /> <span>Subtítulo</span>
              </button>
              <button
                type="button"
                onClick={() => insertarFormatoNoticia("ul")}
                title="Lista con viñetas (- item)"
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-[#002855] dark:hover:bg-blue-900 hover:text-white border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <List className="w-3.5 h-3.5" /> <span>Viñetas</span>
              </button>
              <button
                type="button"
                onClick={() => insertarFormatoNoticia("ol")}
                title="Lista numerada (1. item)"
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-[#002855] dark:hover:bg-blue-900 hover:text-white border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ListOrdered className="w-3.5 h-3.5" /> <span>Numerada</span>
              </button>
              <button
                type="button"
                onClick={() => insertarFormatoNoticia("link")}
                title="Insertar enlace ([Texto](https://...))"
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-[#002855] dark:hover:bg-blue-900 hover:text-white border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Link2 className="w-3.5 h-3.5" /> <span>Enlace</span>
              </button>
              <button
                type="button"
                onClick={() => insertarFormatoNoticia("quote")}
                title="Recuadro destacado (> Nota)"
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-[#002855] dark:hover:bg-blue-900 hover:text-white border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Quote className="w-3.5 h-3.5" /> <span>Destacado</span>
              </button>
              <button
                type="button"
                onClick={() => insertarFormatoNoticia("hr")}
                title="Separador (---)"
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-[#002855] dark:hover:bg-blue-900 hover:text-white border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
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
              className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3.5 py-3 text-xs font-mono leading-relaxed focus:outline-none focus:border-red-600 dark:focus:border-red-500"
            />
          </div>

          {/* Campos opcionales ordenados para Eventos / Convocatorias */}
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-950/60 border border-blue-200 dark:border-slate-800 space-y-3">
            <p className="text-xs font-bold text-[#002855] dark:text-blue-300">
              📌 Ficha Rápida del Evento / Convocatoria (Opcional)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={formNoticia.fecha_evento}
                onChange={(e) => setFormNoticia({ ...formNoticia, fecha_evento: e.target.value })}
                placeholder="Fecha / Hora del evento (ej. Sáb. 07 Nov - 9:00 a.m.)"
                className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
              />
              <input
                type="text"
                value={formNoticia.lugar}
                onChange={(e) => setFormNoticia({ ...formNoticia, lugar: e.target.value })}
                placeholder="Lugar / Aula (ej. Auditorio FCM / FISI)"
                className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
              />
              <input
                type="text"
                value={formNoticia.modalidad}
                onChange={(e) => setFormNoticia({ ...formNoticia, modalidad: e.target.value })}
                placeholder="Modalidad (ej. Presencial / Equipos de 3)"
                className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
              />
              <input
                type="text"
                value={formNoticia.dirigido_a}
                onChange={(e) => setFormNoticia({ ...formNoticia, dirigido_a: e.target.value })}
                placeholder="Dirigido a (ej. Estudiantes de Pregrado)"
                className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
              />
            </div>
            <input
              type="url"
              value={formNoticia.enlace_inscripcion}
              onChange={(e) =>
                setFormNoticia({ ...formNoticia, enlace_inscripcion: e.target.value })
              }
              placeholder="URL de Inscripción o Bases Oficiales (https://forms.gle/...)"
              className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
            />
          </div>

          {/* Opciones de Publicación en Portada y Color de Fondo */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-[#002855] dark:text-blue-300">
                  ⭐ Proyección en Sección Principal (Carrusel de Portada)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
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
                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
              </label>
            </div>

            {/* Selector de Color de Fondo para la Noticia */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  🎨 Color de Fondo del Banner para esta Noticia
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 shadow-xs inline-block"
                    style={{ backgroundColor: formNoticia.color_fondo || "#4d0713" }}
                  />
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 font-bold">
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
                    onChange={(e) =>
                      setFormNoticia({ ...formNoticia, color_fondo: e.target.value })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-900"
                    title="Selector de color personalizado"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Personalizado
                  </span>
                </div>
              </div>

              {/* Imagen de Fondo Opcional para Carrusel con Difuminado y Opacidad */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>🖼️ Imagen de Fondo del Slider (Opcional)</span>
                  </label>
                  {formNoticia.fondo_imagen_url && (
                    <button
                      type="button"
                      onClick={() => setFormNoticia({ ...formNoticia, fondo_imagen_url: "" })}
                      className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:text-red-800 cursor-pointer"
                    >
                      Quitar fondo
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formNoticia.fondo_imagen_url || ""}
                    onChange={(e) =>
                      setFormNoticia({ ...formNoticia, fondo_imagen_url: e.target.value })
                    }
                    placeholder="URL de imagen de fondo (https://...)"
                    className="flex-1 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-xs focus:outline-none focus:border-red-600 dark:focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => inputFondoNoticiaRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#002855] dark:text-blue-300 text-xs font-bold cursor-pointer flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir Foto</span>
                  </button>
                  <input
                    ref={inputFondoNoticiaRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSubirFondoNoticiaStorage}
                    className="hidden"
                  />
                </div>

                {formNoticia.fondo_imagen_url && (
                  <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>Difuminado de Fondo (Blur):</span>
                        <span className="font-mono text-[#002855] dark:text-blue-300">
                          {formNoticia.fondo_blur ?? 4}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="16"
                        step="1"
                        value={formNoticia.fondo_blur ?? 4}
                        onChange={(e) =>
                          setFormNoticia({ ...formNoticia, fondo_blur: Number(e.target.value) })
                        }
                        className="w-full accent-[#002855] cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>0px (Nítido)</span>
                        <span>4px (Recomendado)</span>
                        <span>16px (Muy difuso)</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>Opacidad de Cobertura Oscura / Institucional:</span>
                        <span className="font-mono text-[#002855] dark:text-blue-300">
                          {formNoticia.fondo_overlay_opacity ?? 60}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        step="5"
                        value={formNoticia.fondo_overlay_opacity ?? 60}
                        onChange={(e) =>
                          setFormNoticia({
                            ...formNoticia,
                            fondo_overlay_opacity: Number(e.target.value),
                          })
                        }
                        className="w-full accent-red-700 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>10% (Muy transparente)</span>
                        <span>60% (Equilibrado)</span>
                        <span>90% (Oscuro)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formNoticia.destacado}
              onChange={(e) => setFormNoticia({ ...formNoticia, destacado: e.target.checked })}
            />
            Destacar como &ldquo;Importante&rdquo;
          </label>

          <button
            type="submit"
            className="gpu-btn w-full py-3 rounded-xl bg-[#002855] dark:bg-red-700 hover:bg-blue-900 dark:hover:bg-red-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            {formNoticia.id ? "Guardar Cambios en Supabase" : "Publicar Noticia en Supabase"}
          </button>
        </form>

        {/* Columna Derecha: Vista Previa en Vivo */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs sticky top-20">
          <div className="bg-[#002855] text-white px-4 py-2.5 border-b-2 border-red-600 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">👁️ Vista Previa en Vivo</span>
            <span className="text-[10px] font-mono text-blue-200">Así lo leerán los alumnos</span>
          </div>
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {formNoticia.imagen_url && (
              <div className="rounded-xl bg-slate-950 overflow-hidden max-h-56 flex items-center justify-center">
                <img
                  src={formNoticia.imagen_url}
                  alt="Preview"
                  className="max-h-56 w-auto object-contain"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded bg-[#002855] text-white text-[10px] font-bold">
                {formNoticia.categoria || "Comunicado Oficial"}
              </span>
              <h4 className="text-base font-bold text-[#002855] dark:text-white leading-snug">
                {formNoticia.titulo || "Título de la noticia..."}
              </h4>
              {formNoticia.resumen && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  {formNoticia.resumen}
                </p>
              )}
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              {renderizarContenidoNoticia(
                formNoticia.contenido || "Escribe en el editor para previsualizar el formato..."
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Noticias Publicadas */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-[#002855] dark:text-white">
          Noticias Publicadas ({noticias.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {noticias.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={n.imagen_url}
                  alt={n.titulo}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[11px] font-bold text-red-700 dark:text-red-400">
                      {n.categoria} • {n.fecha_publicacion}
                    </span>
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
                  <h4 className="font-bold text-xs sm:text-sm text-[#002855] dark:text-white line-clamp-2">
                    {n.titulo}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={() => handleToggleCarruselPrincipal(n.id)}
                  title={
                    n.en_carrusel_principal !== false
                      ? "Desactivar de carrusel de portada"
                      : "Activar en carrusel de portada"
                  }
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    n.en_carrusel_principal !== false
                      ? "bg-amber-500 text-white hover:bg-amber-600 shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {n.en_carrusel_principal !== false ? "⭐ Portada" : "⚪ Off"}
                </button>
                <button
                  type="button"
                  onClick={() => abrirNoticiaDetalle(n.id)}
                  title="Ver noticia"
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#002855] dark:text-blue-300 text-[11px] font-bold cursor-pointer hover:bg-blue-100"
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
                      fondo_imagen_url: n.fondo_imagen_url || "",
                      fondo_blur: typeof n.fondo_blur === "number" ? n.fondo_blur : 4,
                      fondo_overlay_opacity:
                        typeof n.fondo_overlay_opacity === "number" ? n.fondo_overlay_opacity : 60,
                      fondo_overlay_color: n.fondo_overlay_color || n.color_fondo || "#002855",
                    })
                  }
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#002855] dark:text-blue-300 hover:bg-slate-200 cursor-pointer"
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
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 hover:bg-red-700 hover:text-white cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
