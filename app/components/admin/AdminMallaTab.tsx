"use client";

import React, { useState, useEffect } from "react";
import { Upload, Sparkles, RotateCcw, CheckCircle2 } from "lucide-react";
import { Carrera, CarreraId, CursoMalla } from "../../types/portal";
import { BENTO_ESPECIALIZACIONES_DEFAULT } from "../../data/portalExtrasData";

export interface FormCursoMallaState {
  id: string;
  carrera_id: CarreraId;
  ciclo: number;
  codigo: string;
  nombre_curso: string;
  creditos: number;
  tipo_curso: "O" | "E";
  prerequisitosTexto: string;
}

interface AdminMallaTabProps {
  mode: "carreras_cms" | "malla";
  carreras: Carrera[];
  malla: CursoMalla[];
  adminCarreraEditId: CarreraId;
  carreraAdminSeleccionada: Carrera;
  handleSeleccionarCarreraEnAdmin: (cId: CarreraId) => void;
  handleGuardarDatosCarreraAdmin: (e: React.FormEvent) => Promise<void> | void;
  onActualizarCarreraCompleta?: (carreraActualizada: Carrera) => Promise<void> | void;
  inputImagenCarreraRef: React.RefObject<HTMLInputElement | null>;
  subiendoAssetCarrera: boolean;
  handleSubirImagenCarreraStorage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  urlImagenCarreraInput: string;
  setUrlImagenCarreraInput: React.Dispatch<React.SetStateAction<string>>;
  inputTripticoPdfRef: React.RefObject<HTMLInputElement | null>;
  handleSubirTripticoPdfStorage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  urlTripticoCarreraInput: string;
  setUrlTripticoCarreraInput: React.Dispatch<React.SetStateAction<string>>;
  inputPosterPdfRef: React.RefObject<HTMLInputElement | null>;
  handleSubirPosterPdfStorage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  urlPosterCarreraInput: string;
  setUrlPosterCarreraInput: React.Dispatch<React.SetStateAction<string>>;
  navegarACarrera: (cId: CarreraId) => void;
  formCursoMalla: FormCursoMallaState;
  setFormCursoMalla: React.Dispatch<React.SetStateAction<FormCursoMallaState>>;
  handleGuardarCursoMalla: (e: React.FormEvent) => Promise<void> | void;
  adminFiltroCarreraMalla: CarreraId;
  setAdminFiltroCarreraMalla: React.Dispatch<React.SetStateAction<CarreraId>>;
}

export function AdminMallaTab({
  mode,
  carreras,
  malla,
  adminCarreraEditId,
  carreraAdminSeleccionada,
  handleSeleccionarCarreraEnAdmin,
  handleGuardarDatosCarreraAdmin,
  onActualizarCarreraCompleta,
  inputImagenCarreraRef,
  subiendoAssetCarrera,
  handleSubirImagenCarreraStorage,
  urlImagenCarreraInput,
  setUrlImagenCarreraInput,
  inputTripticoPdfRef,
  handleSubirTripticoPdfStorage,
  urlTripticoCarreraInput,
  setUrlTripticoCarreraInput,
  inputPosterPdfRef,
  handleSubirPosterPdfStorage,
  urlPosterCarreraInput,
  setUrlPosterCarreraInput,
  navegarACarrera,
  formCursoMalla,
  setFormCursoMalla,
  handleGuardarCursoMalla,
  adminFiltroCarreraMalla,
  setAdminFiltroCarreraMalla,
}: AdminMallaTabProps) {
  const defaultsBento = BENTO_ESPECIALIZACIONES_DEFAULT[carreraAdminSeleccionada.id];

  const [codigoEscuela, setCodigoEscuela] = useState(carreraAdminSeleccionada.codigo_escuela || "");
  const [subtituloBento, setSubtituloBento] = useState(
    carreraAdminSeleccionada.subtitulo_bento || defaultsBento.subtitulo
  );
  const [pilar1, setPilar1] = useState(
    carreraAdminSeleccionada.pilares_bento?.[0] || defaultsBento.pilares[0] || ""
  );
  const [pilar2, setPilar2] = useState(
    carreraAdminSeleccionada.pilares_bento?.[1] || defaultsBento.pilares[1] || ""
  );
  const [pilar3, setPilar3] = useState(
    carreraAdminSeleccionada.pilares_bento?.[2] || defaultsBento.pilares[2] || ""
  );
  const [creditosBento, setCreditosBento] = useState<number>(
    carreraAdminSeleccionada.creditos_bento || defaultsBento.creditos
  );
  const [duracionBento, setDuracionBento] = useState(
    carreraAdminSeleccionada.duracion_bento || defaultsBento.duracion
  );
  const [gradoAcademico, setGradoAcademico] = useState(carreraAdminSeleccionada.grado_academico || "");
  const [tituloProfesional, setTituloProfesional] = useState(
    carreraAdminSeleccionada.titulo_profesional || ""
  );
  const [perfilEgreso, setPerfilEgreso] = useState(carreraAdminSeleccionada.perfil_egreso || "");
  const [descripcion, setDescripcion] = useState(carreraAdminSeleccionada.descripcion || "");
  const [visionCarrera, setVisionCarrera] = useState(carreraAdminSeleccionada.vision_carrera || "");
  const [campoLaboral, setCampoLaboral] = useState(carreraAdminSeleccionada.campo_laboral || "");
  const [porQueEstudiar, setPorQueEstudiar] = useState(
    carreraAdminSeleccionada.por_que_estudiar || ""
  );

  useEffect(() => {
    const def = BENTO_ESPECIALIZACIONES_DEFAULT[carreraAdminSeleccionada.id];
    setCodigoEscuela(carreraAdminSeleccionada.codigo_escuela || "");
    setSubtituloBento(carreraAdminSeleccionada.subtitulo_bento || def.subtitulo);
    setPilar1(carreraAdminSeleccionada.pilares_bento?.[0] || def.pilares[0] || "");
    setPilar2(carreraAdminSeleccionada.pilares_bento?.[1] || def.pilares[1] || "");
    setPilar3(carreraAdminSeleccionada.pilares_bento?.[2] || def.pilares[2] || "");
    setCreditosBento(carreraAdminSeleccionada.creditos_bento || def.creditos);
    setDuracionBento(carreraAdminSeleccionada.duracion_bento || def.duracion);
    setGradoAcademico(carreraAdminSeleccionada.grado_academico || "");
    setTituloProfesional(carreraAdminSeleccionada.titulo_profesional || "");
    setPerfilEgreso(carreraAdminSeleccionada.perfil_egreso || "");
    setDescripcion(carreraAdminSeleccionada.descripcion || "");
    setVisionCarrera(carreraAdminSeleccionada.vision_carrera || "");
    setCampoLaboral(carreraAdminSeleccionada.campo_laboral || "");
    setPorQueEstudiar(carreraAdminSeleccionada.por_que_estudiar || "");
  }, [carreraAdminSeleccionada]);

  const restaurarPildorasPoster = () => {
    const def = BENTO_ESPECIALIZACIONES_DEFAULT[carreraAdminSeleccionada.id];
    setSubtituloBento(def.subtitulo);
    setPilar1(def.pilares[0] || "");
    setPilar2(def.pilares[1] || "");
    setPilar3(def.pilares[2] || "");
    setCreditosBento(def.creditos);
    setDuracionBento(def.duracion);
  };

  const handleSubmitCompleto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onActualizarCarreraCompleta) {
      const pilaresLimpios = [pilar1.trim(), pilar2.trim(), pilar3.trim()].filter((p) => p.length > 0);
      const actualizada: Carrera = {
        ...carreraAdminSeleccionada,
        codigo_escuela: codigoEscuela.trim() || carreraAdminSeleccionada.codigo_escuela,
        subtitulo_bento: subtituloBento.trim(),
        pilares_bento: pilaresLimpios.length > 0 ? pilaresLimpios : defaultsBento.pilares,
        creditos_bento: Number(creditosBento) || defaultsBento.creditos,
        duracion_bento: duracionBento.trim() || "5 años • 10 ciclos",
        grado_academico: gradoAcademico.trim() || carreraAdminSeleccionada.grado_academico,
        titulo_profesional: tituloProfesional.trim() || carreraAdminSeleccionada.titulo_profesional,
        perfil_egreso: perfilEgreso.trim() || carreraAdminSeleccionada.perfil_egreso,
        descripcion: descripcion.trim() || carreraAdminSeleccionada.descripcion,
        vision_carrera: visionCarrera.trim() || carreraAdminSeleccionada.vision_carrera,
        campo_laboral: campoLaboral.trim() || carreraAdminSeleccionada.campo_laboral,
        por_que_estudiar: porQueEstudiar.trim() || carreraAdminSeleccionada.por_que_estudiar,
        imagen_referencial_url:
          urlImagenCarreraInput.trim() || carreraAdminSeleccionada.imagen_referencial_url,
        triptico_pdf_url: urlTripticoCarreraInput.trim(),
        poster_pdf_url: urlPosterCarreraInput.trim(),
      };
      await onActualizarCarreraCompleta(actualizada);
    } else {
      await handleGuardarDatosCarreraAdmin(e);
    }
  };

  if (mode === "carreras_cms") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 view-transition-gpu">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-[#002855] dark:text-white">
              Editor Integral de Escuela Profesional, Tarjeta Bento Home, Píldoras y PDFs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Personaliza las píldoras de especialización del póster, métricas del Bento Grid, textos institucionales, tríptico y póster en Supabase.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {carreras.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSeleccionarCarreraEnAdmin(c.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  adminCarreraEditId === c.id
                    ? "bg-[#002855] text-white border-[#002855] dark:bg-blue-600 dark:border-blue-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmitCompleto} className="space-y-5">
            {/* BLOQUE 1: BENTO GRID & PÍLDORAS DE ESPECIALIZACIÓN DEL PÓSTER */}
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-950/80 border-2 border-blue-200/80 dark:border-blue-900/50 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-700 dark:text-red-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#002855] dark:text-blue-300">
                    Configuración Bento Grid Home & Píldoras del Póster ({carreraAdminSeleccionada.nombre})
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={restaurarPildorasPoster}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:border-red-600 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Restaurar del Póster Oficial
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Código Oficial Escuela
                  </label>
                  <input
                    type="text"
                    value={codigoEscuela}
                    onChange={(e) => setCodigoEscuela(e.target.value)}
                    placeholder="Ej. E.P. 14.1"
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Duración en Bento
                  </label>
                  <input
                    type="text"
                    value={duracionBento}
                    onChange={(e) => setDuracionBento(e.target.value)}
                    placeholder="5 años • 10 ciclos"
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Créditos Totales (Póster)
                  </label>
                  <input
                    type="number"
                    value={creditosBento}
                    onChange={(e) => setCreditosBento(Number(e.target.value))}
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Subtítulo Superior de la Tarjeta Bento
                </label>
                <input
                  type="text"
                  value={subtituloBento}
                  onChange={(e) => setSubtituloBento(e.target.value)}
                  placeholder="Ej. Rigor Científico, Abstracción & Modelado Teórico"
                  className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#002855] dark:text-amber-300 block">
                  ✦ Las 3 Píldoras de Especialización (según Póster Oficial de {carreraAdminSeleccionada.nombre})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={pilar1}
                    onChange={(e) => setPilar1(e.target.value)}
                    placeholder="Especialización 1"
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border-2 border-blue-300 dark:border-blue-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={pilar2}
                    onChange={(e) => setPilar2(e.target.value)}
                    placeholder="Especialización 2"
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border-2 border-blue-300 dark:border-blue-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={pilar3}
                    onChange={(e) => setPilar3(e.target.value)}
                    placeholder="Especialización 3"
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border-2 border-blue-300 dark:border-blue-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* BLOQUE 2: GRADOS, PERFIL DE EGRESO Y TEXTOS DE LA ESCUELA */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#002855] dark:text-slate-200">
                Información Académica, Grados y Perfil de Egreso
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Grado Académico
                  </label>
                  <input
                    type="text"
                    value={gradoAcademico}
                    onChange={(e) => setGradoAcademico(e.target.value)}
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Título Profesional
                  </label>
                  <input
                    type="text"
                    value={tituloProfesional}
                    onChange={(e) => setTituloProfesional(e.target.value)}
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Perfil de Egreso (Texto visible en la Tarjeta Bento del Home y en la vista de Carrera)
                </label>
                <textarea
                  rows={2}
                  value={perfilEgreso}
                  onChange={(e) => setPerfilEgreso(e.target.value)}
                  className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Descripción General de la Carrera
                </label>
                <textarea
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Campo Laboral
                  </label>
                  <textarea
                    rows={2}
                    value={campoLaboral}
                    onChange={(e) => setCampoLaboral(e.target.value)}
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Visión de la Escuela
                  </label>
                  <textarea
                    rows={2}
                    value={visionCarrera}
                    onChange={(e) => setVisionCarrera(e.target.value)}
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* BLOQUE 3: ARCHIVOS MULTIMEDIA (IMAGEN, TRÍPTICO Y PÓSTER) */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#002855] dark:text-slate-200">
                  Imagen Referencial de {carreraAdminSeleccionada.nombre}
                </label>
                <button
                  type="button"
                  onClick={() => inputImagenCarreraRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#002855] hover:bg-blue-900 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />{" "}
                  {subiendoAssetCarrera ? "Subiendo..." : "Subir Imagen (Storage)"}
                </button>
                <input
                  ref={inputImagenCarreraRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSubirImagenCarreraStorage}
                  className="hidden"
                />
              </div>
              <input
                type="url"
                value={urlImagenCarreraInput}
                onChange={(e) => setUrlImagenCarreraInput(e.target.value)}
                placeholder="URL pública de la imagen referencial..."
                className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-red-50/40 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-red-800 dark:text-red-300">
                    Tríptico Oficial (PDF)
                  </label>
                  <button
                    type="button"
                    onClick={() => inputTripticoPdfRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-red-700 hover:bg-red-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" /> Subir PDF
                  </button>
                  <input
                    ref={inputTripticoPdfRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleSubirTripticoPdfStorage}
                    className="hidden"
                  />
                </div>
                <input
                  type="url"
                  value={urlTripticoCarreraInput}
                  onChange={(e) => setUrlTripticoCarreraInput(e.target.value)}
                  placeholder="URL del Tríptico en Storage..."
                  className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-blue-900 dark:text-blue-300">
                    Póster de Estudios (PDF)
                  </label>
                  <button
                    type="button"
                    onClick={() => inputPosterPdfRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-[#002855] hover:bg-blue-900 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" /> Subir PDF
                  </button>
                  <input
                    ref={inputPosterPdfRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleSubirPosterPdfStorage}
                    className="hidden"
                  />
                </div>
                <input
                  type="url"
                  value={urlPosterCarreraInput}
                  onChange={(e) => setUrlPosterCarreraInput(e.target.value)}
                  placeholder="URL del Póster en Storage..."
                  className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="gpu-btn flex-1 py-3 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Cambios en Supabase ({carreraAdminSeleccionada.nombre})</span>
              </button>
              <button
                type="button"
                onClick={() => navegarACarrera(adminCarreraEditId)}
                className="gpu-btn px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#002855] dark:text-blue-300 cursor-pointer"
              >
                Ver Carrera →
              </button>
            </div>
          </form>
        </div>

        {/* VISTA PREVIA EN TIEMPO REAL DE LA TARJETA BENTO */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 h-fit sticky top-24">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              Vista Previa en Vivo • Celda Bento ({carreraAdminSeleccionada.nombre})
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
              En Vivo
            </span>
          </div>

          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/60 dark:bg-slate-950/60">
            <div className="bg-[#002855] text-white px-4 py-3 flex items-center justify-between text-xs">
              <span className="font-mono font-bold bg-black/30 px-2 py-0.5 rounded border border-white/20">
                {codigoEscuela || carreraAdminSeleccionada.codigo_escuela}
              </span>
              <div className="flex items-center gap-2 text-[11px] font-bold">
                <span>{duracionBento}</span>
                <span className="bg-black/30 px-2 py-0.5 rounded font-mono">{creditosBento} cr.</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-400">
                  {subtituloBento}
                </p>
                <h5 className="text-lg font-bold text-[#002855] dark:text-white">
                  E.P. de {carreraAdminSeleccionada.nombre}
                </h5>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[pilar1, pilar2, pilar3]
                  .filter((p) => p.trim().length > 0)
                  .map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-cyan-300 border border-blue-200 dark:border-blue-800"
                    >
                      ✦ {p}
                    </span>
                  ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                {perfilEgreso || descripcion}
              </p>
            </div>
          </div>

          <img
            src={urlImagenCarreraInput || carreraAdminSeleccionada.imagen_referencial_url}
            alt={carreraAdminSeleccionada.nombre}
            className="w-full h-48 object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-800"
          />
          <p className="text-xs text-slate-600 dark:text-slate-300 italic">
            {visionCarrera}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 view-transition-gpu">
      <form
        onSubmit={handleGuardarCursoMalla}
        className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 h-fit"
      >
        <h3 className="font-bold text-sm text-[#002855] dark:text-white">
          Añadir Asignatura a la Malla
        </h3>
        <select
          value={formCursoMalla.carrera_id}
          onChange={(e) =>
            setFormCursoMalla({ ...formCursoMalla, carrera_id: e.target.value as CarreraId })
          }
          className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs"
        >
          {carreras.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={1}
            max={10}
            value={formCursoMalla.ciclo}
            onChange={(e) => setFormCursoMalla({ ...formCursoMalla, ciclo: Number(e.target.value) })}
            className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs"
          />
          <input
            type="text"
            required
            value={formCursoMalla.codigo}
            onChange={(e) => setFormCursoMalla({ ...formCursoMalla, codigo: e.target.value })}
            placeholder="Código (ej. CS399)"
            className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs"
          />
        </div>
        <input
          type="text"
          required
          value={formCursoMalla.nombre_curso}
          onChange={(e) => setFormCursoMalla({ ...formCursoMalla, nombre_curso: e.target.value })}
          placeholder="Nombre de la asignatura *"
          className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={1}
            max={12}
            value={formCursoMalla.creditos}
            onChange={(e) => setFormCursoMalla({ ...formCursoMalla, creditos: Number(e.target.value) })}
            placeholder="Créditos"
            className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs"
          />
          <select
            value={formCursoMalla.tipo_curso}
            onChange={(e) =>
              setFormCursoMalla({ ...formCursoMalla, tipo_curso: e.target.value as "O" | "E" })
            }
            className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs"
          >
            <option value="O">Obligatorio (O)</option>
            <option value="E">Electivo (E)</option>
          </select>
        </div>
        <input
          type="text"
          value={formCursoMalla.prerequisitosTexto}
          onChange={(e) =>
            setFormCursoMalla({ ...formCursoMalla, prerequisitosTexto: e.target.value })
          }
          placeholder="Prerrequisitos separados por coma (ej. CS111, MA100)"
          className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 text-xs"
        />
        <button
          type="submit"
          className="gpu-btn w-full py-2.5 rounded-xl bg-[#002855] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer"
        >
          Guardar en la Malla
        </button>
      </form>

      <div className="lg:col-span-8 space-y-3">
        <div className="flex flex-wrap gap-2">
          {carreras.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setAdminFiltroCarreraMalla(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                adminFiltroCarreraMalla === c.id
                  ? "bg-[#002855] text-white"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
              }`}
            >
              {c.nombre}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden max-h-96 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#002855] dark:bg-slate-950 text-white border-b dark:border-slate-800">
                <th className="py-2.5 px-4">Ciclo</th>
                <th className="py-2.5 px-4">Código</th>
                <th className="py-2.5 px-4">Asignatura</th>
                <th className="py-2.5 px-4">Créd.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {malla
                .filter((c) => c.carrera_id === adminFiltroCarreraMalla)
                .map((cur) => (
                  <tr
                    key={cur.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 text-slate-900 dark:text-slate-200"
                  >
                    <td className="py-2.5 px-4">Ciclo {cur.ciclo}</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-red-700 dark:text-red-400">
                      {cur.codigo}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {cur.nombre_curso}
                    </td>
                    <td className="py-2.5 px-4">{cur.creditos}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
