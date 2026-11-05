import type { Metadata } from "next";
import PortalFCM from "../page";

export const metadata: Metadata = {
  title: "Directorio de Plana Docente e Investigadores",
  description:
    "Conoce a los catedráticos e investigadores RENACYT de Matemática, Estadística, Investigación Operativa y Computación Científica de la UNMSM.",
  openGraph: {
    title: "Plana Docente e Investigadores | FCM - UNMSM",
    description:
      "Directorio oficial de profesores principales, asociados y auxiliares de la Facultad de Ciencias Matemáticas — UNMSM.",
  },
};

export default function DocentesRoutePage() {
  return <PortalFCM />;
}
