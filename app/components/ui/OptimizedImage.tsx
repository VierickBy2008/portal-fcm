"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

const OPTIMIZED_HOST_PATTERNS = [
  /\.supabase\.co$/i,
  /^images\.unsplash\.com$/i,
  /\.unmsm\.edu\.pe$/i,
  /\.gstatic\.com$/i,
  /\.wikimedia\.org$/i,
  /\.googleusercontent\.com$/i,
];

function canOptimizeWithNextImage(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/") && !src.startsWith("//")) {
    return !src.toLowerCase().endsWith(".svg");
  }
  if (src.startsWith("blob:") || src.startsWith("data:")) {
    return false;
  }
  try {
    const parsed = new URL(src);
    if (parsed.protocol !== "https:") return false;
    if (parsed.pathname.toLowerCase().endsWith(".svg")) return false;
    return OPTIMIZED_HOST_PATTERNS.some((pattern) => pattern.test(parsed.hostname));
  } catch {
    return false;
  }
}

/**
 * Componente de Imagen Optimizada con Next.js `<Image>` y Carga Progresiva (Blur-Up + Skeleton).
 * - Convierte automáticamente a WebP/AVIF imágenes de Supabase, Unsplash, UNMSM y locales (`/public`).
 * - Aplica transición progresiva suave (blur-up) mientras descarga para eliminar saltos visuales (CLS).
 * - Soporta URLs externas arbitrarias ingresadas en el CMS mediante `unoptimized` seguro y fallback institucional.
 */
export function OptimizedImage({
  src,
  alt,
  className = "",
  fill = true,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  style,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const cleanSrc = (src || "").trim();

  if (!cleanSrc || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#002855] via-slate-900 to-[#4d0713] text-white/70 p-4 text-center ${
          fill ? "absolute inset-0 w-full h-full" : ""
        } ${className}`}
        style={style}
      >
        <ImageIcon className="w-7 h-7 opacity-60 mb-1" />
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-75 line-clamp-1">
          FCM • UNMSM
        </span>
      </div>
    );
  }

  const isOptimizable = canOptimizeWithNextImage(cleanSrc);

  return (
    <>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-slate-200/60 dark:bg-slate-800/60 animate-pulse pointer-events-none"
        />
      )}
      <Image
        src={cleanSrc}
        alt={alt || "Imagen institucional FCM UNMSM"}
        {...(fill ? { fill: true, sizes } : { width: width || 800, height: height || 500 })}
        priority={priority}
        unoptimized={!isOptimizable}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        style={style}
        className={`${className} transition-all duration-500 ${
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-xs"
        }`}
      />
    </>
  );
}
