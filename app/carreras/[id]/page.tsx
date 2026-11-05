import type { Metadata } from "next";
import PortalFCM from "../../page";
import { CARRERAS_INICIALES } from "../../data/portalInitialData";

export function generateStaticParams() {
  return CARRERAS_INICIALES.map((c) => ({ id: c.id }));
}

export const metadata: Metadata = {
  title: "Escuelas Profesionales y Mallas Curriculares (Plan 2026)",
  description:
    "Explora las 4 escuelas profesionales de la Facultad de Ciencias Matemáticas de la UNMSM: Matemática, Estadística, Investigación Operativa y Computación Científica.",
  openGraph: {
    title: "Escuelas Profesionales y Mallas Curriculares | FCM - UNMSM",
    description:
      "Plan de estudios 2026, malla curricular interactiva con resaltado de prerrequisitos, trípticos oficiales y perfil del graduado en la FCM - UNMSM.",
  },
};

export default function CarreraRoutePage() {
  return <PortalFCM />;
}
