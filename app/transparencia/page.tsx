import type { Metadata } from "next";
import PortalFCM from "../page";

export const metadata: Metadata = {
  title: "Portal de Transparencia y Documentos Oficiales",
  description:
    "Consulta Resoluciones Decanales, Resoluciones Rectorales, Plan Operativo Institucional (POI), Memorias de Gestión y Actas de Consejo de la FCM - UNMSM.",
  openGraph: {
    title: "Portal de Transparencia Institucional | FCM - UNMSM",
    description:
      "Repositorio normativo de Resoluciones Decanales, POI, Memorias y Presupuesto de la Facultad de Ciencias Matemáticas — UNMSM.",
  },
};

export default function TransparenciaRoutePage() {
  return <PortalFCM />;
}
