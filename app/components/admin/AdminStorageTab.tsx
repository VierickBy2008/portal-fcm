"use client";

import React from "react";
import { Image as ImageIcon, Upload, Check, Copy } from "lucide-react";
import {
  DisenoPortadaId,
  HeroBentoConfig,
  HeroHarvardConfig,
  ImagenStorage,
} from "../../types/portal";
import { AdminHeroTab } from "./AdminHeroTab";

interface AdminStorageTabProps {
  categoriaNuevaImagen: ImagenStorage["categoria"];
  setCategoriaNuevaImagen: React.Dispatch<React.SetStateAction<ImagenStorage["categoria"]>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  subiendoStorage: boolean;
  handleSubirArchivoStorage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  imagenesStorage: ImagenStorage[];
  urlCopiadaId: string | null;
  setUrlCopiadaId: React.Dispatch<React.SetStateAction<string | null>>;
  lanzarToast: (msg: string) => void;
  handleUsarComoFondoHero: (
    url: string,
    nuevoBlur?: number,
    nuevaOpacity?: number,
    nuevoColor?: string
  ) => Promise<void> | void;
  handleUsarComoLogo: (url: string) => Promise<void> | void;
  heroBgInputUrl: string;
  setHeroBgInputUrl: React.Dispatch<React.SetStateAction<string>>;
  heroBgUrl: string;
  heroBlur: number;
  setHeroBlur: React.Dispatch<React.SetStateAction<number>>;
  heroOverlayOpacity: number;
  setHeroOverlayOpacity: React.Dispatch<React.SetStateAction<number>>;
  heroOverlayColor: string;
  setHeroOverlayColor: React.Dispatch<React.SetStateAction<string>>;
  disenoPortadaActivo?: DisenoPortadaId;
  heroConfigBento?: HeroBentoConfig;
  heroConfigHarvard?: HeroHarvardConfig;
  onGuardarHeroBento?: (cfg: HeroBentoConfig) => Promise<void> | void;
  onGuardarHeroHarvard?: (cfg: HeroHarvardConfig) => Promise<void> | void;
}

export function AdminStorageTab({
  categoriaNuevaImagen,
  setCategoriaNuevaImagen,
  fileInputRef,
  subiendoStorage,
  handleSubirArchivoStorage,
  imagenesStorage,
  urlCopiadaId,
  setUrlCopiadaId,
  lanzarToast,
  handleUsarComoFondoHero,
  handleUsarComoLogo,
  heroBgInputUrl,
  setHeroBgInputUrl,
  heroBgUrl,
  heroBlur,
  setHeroBlur,
  heroOverlayOpacity,
  setHeroOverlayOpacity,
  heroOverlayColor,
  setHeroOverlayColor,
  disenoPortadaActivo,
  heroConfigBento,
  heroConfigHarvard,
  onGuardarHeroBento,
  onGuardarHeroHarvard,
}: AdminStorageTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 view-transition-gpu">
      <div className="lg:col-span-5 space-y-6 h-fit">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
            <ImageIcon className="w-5 h-5 text-red-700 dark:text-red-400" />
            <div>
              <h3 className="font-bold text-sm text-[#002855] dark:text-white">
                Subir Imagen a Supabase Storage
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bucket público: <code className="font-bold text-red-700 dark:text-red-400">fcm-assets</code>
              </p>
            </div>
          </div>
          <select
            value={categoriaNuevaImagen}
            onChange={(e) =>
              setCategoriaNuevaImagen(e.target.value as ImagenStorage["categoria"])
            }
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          >
            <option value="Logo Institucional">Logo Institucional Transparente (Navbar)</option>
            <option value="Fondo Hero Home">Fondo Difuminado para el Hero del Home</option>
            <option value="Banner Noticia">Banner para Noticias del Home</option>
            <option value="Foto Facultad">Foto Referencial de la Facultad</option>
          </select>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="rounded-2xl border-2 border-dashed border-blue-900/40 dark:border-blue-700/50 hover:border-red-600 dark:hover:border-red-500 bg-slate-50 dark:bg-slate-950/60 p-6 text-center cursor-pointer space-y-2 transition-colors"
          >
            <Upload className="w-8 h-8 text-[#002855] dark:text-blue-300 mx-auto" />
            <p className="text-xs font-bold text-[#002855] dark:text-blue-300">
              {subiendoStorage
                ? "Subiendo imagen..."
                : "Haz clic aquí para elegir una imagen de tu PC"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleSubirArchivoStorage}
              className="hidden"
            />
          </div>
        </div>

        {/* Configuración directa del Fondo Difuminado, Opacidad y Color del Hero */}
        <AdminHeroTab
          heroBgInputUrl={heroBgInputUrl}
          setHeroBgInputUrl={setHeroBgInputUrl}
          heroBgUrl={heroBgUrl}
          heroBlur={heroBlur}
          setHeroBlur={setHeroBlur}
          heroOverlayOpacity={heroOverlayOpacity}
          setHeroOverlayOpacity={setHeroOverlayOpacity}
          heroOverlayColor={heroOverlayColor}
          setHeroOverlayColor={setHeroOverlayColor}
          handleUsarComoFondoHero={handleUsarComoFondoHero}
          disenoPortadaActivo={disenoPortadaActivo}
          heroConfigBento={heroConfigBento}
          heroConfigHarvard={heroConfigHarvard}
          onGuardarHeroBento={onGuardarHeroBento}
          onGuardarHeroHarvard={onGuardarHeroHarvard}
        />
      </div>

      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
        {imagenesStorage
          .filter((img) => !img.id?.startsWith("__fcm_"))
          .map((img) => (
          <div
            key={img.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-36 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <img
                  src={img.url_publica}
                  alt={img.nombre_archivo}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-[#002855] text-white text-[10px] font-bold">
                  {img.categoria}
                </span>
              </div>
              <div className="p-3.5">
                <p className="text-xs font-bold text-[#002855] dark:text-white truncate">
                  {img.nombre_archivo}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  {img.tamano_kb} • {img.fecha_subida}
                </p>
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
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
                {urlCopiadaId === img.id ? (
                  <>
                    <Check className="w-3 h-3" /> Copiada
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copiar URL
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleUsarComoFondoHero(img.url_publica)}
                className="py-1.5 px-2.5 rounded-lg bg-blue-100 dark:bg-blue-950 hover:bg-[#002855] hover:text-white text-[#002855] dark:text-blue-300 text-[11px] font-bold transition-colors cursor-pointer"
              >
                Usar en Hero
              </button>
              <button
                type="button"
                onClick={() => handleUsarComoLogo(img.url_publica)}
                className="py-1.5 px-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-red-700 hover:text-white text-slate-800 dark:text-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
              >
                Usar como Logo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
