"use client";

import React from "react";
import { GraduationCap, Lock, Mail, MapPin, Phone } from "lucide-react";
import { Facebook, Instagram, Linkedin, Youtube } from "@/app/utils/portalFormatters";

interface FooterProps {
  logoUrl: string;
  onOpenAdmin: () => void;
}

export function Footer({ logoUrl, onOpenAdmin }: FooterProps) {
  return (
    <footer className="bg-[#001833] text-white border-t-4 border-red-700 pt-12 pb-8 mt-16 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Escudo UNMSM" className="h-11 w-auto object-contain" />
              <div>
                <p className="font-bold text-sm tracking-wide text-white">FACULTAD DE CIENCIAS MATEMÁTICAS</p>
                <p className="text-xs text-blue-200">Universidad Nacional Mayor de San Marcos</p>
              </div>
            </div>
            <p className="text-xs text-blue-200/90 leading-relaxed">
              Formando líderes científicos e investigadores en Computación Científica, Matemática, Estadística e Investigación Operativa.
            </p>
          </div>

          <div className="space-y-2 text-xs text-blue-200">
            <p className="font-bold uppercase tracking-wider text-white mb-2">Contacto Institucional</p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" />
              <span>Ciudad Universitaria UNMSM - Av. Venezuela cdra. 34, Lima</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-400 shrink-0" />
              <span>Central Telefónica: (01) 619-7000 Anexo 1401</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-400 shrink-0" />
              <span>decanato.matematicas@unmsm.edu.pe</span>
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-bold uppercase tracking-wider text-xs text-white">Redes Sociales Oficiales</p>
            <p className="text-xs text-blue-200">
              Conéctate con las transmisiones, eventos y comunicados de la facultad:
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.facebook.com/FacultadDeCienciasMatematicasOficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Oficial FCM UNMSM"
                title="Facebook Oficial FCM UNMSM"
                className="w-10 h-10 rounded-xl bg-blue-950 hover:bg-[#1877F2] border border-blue-800 flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.instagram.com/facultaddecienciasmatematicas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Oficial FCM UNMSM"
                title="Instagram Oficial FCM UNMSM"
                className="w-10 h-10 rounded-xl bg-blue-950 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 border border-blue-800 flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@fcmunmsm/videos"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Oficial FCM UNMSM"
                title="Canal Oficial de YouTube FCM UNMSM"
                className="w-10 h-10 rounded-xl bg-blue-950 hover:bg-[#FF0000] border border-blue-800 flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              >
                <Youtube className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.linkedin.com/school/universidad-nacional-mayor-de-san-marcos/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Institucional UNMSM"
                title="LinkedIn Institucional UNMSM"
                className="w-10 h-10 rounded-xl bg-blue-950 hover:bg-[#0A66C2] border border-blue-800 flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              >
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-blue-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-red-400" />
            <span>© 2026 Facultad de Ciencias Matemáticas - UNMSM. Todos los derechos reservados.</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              title="Acceso Administrativo"
              aria-label="Acceso Administrativo"
              className="ml-1 p-1 rounded text-blue-400/25 hover:text-blue-200/80 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px]">
            <a
              href="https://matematicas.unmsm.edu.pe/posgrado26.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline decoration-red-500"
            >
              Posgrado FCM
            </a>
            <a
              href="https://sum.unmsm.edu.pe/alumnoWebSum/login"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline decoration-red-500"
            >
              SUM UNMSM
            </a>
            <a
              href="https://tramiteonline.unmsm.edu.pe/sgdfd/mat/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline decoration-red-500"
            >
              Módulo MAT
            </a>
            <a
              href="https://sanmarket.unmsm.edu.pe/#/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline decoration-red-500"
            >
              San Market
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
