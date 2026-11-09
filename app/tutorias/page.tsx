import type { Metadata } from "next";
import PortalFCM from "../page";

export const metadata: Metadata = {
  title: "Sistema Automatizado de Tutorías Académicas con IA",
  description:
    "Plataforma de emparejamiento algorítmico de horarios y asignación de profesores consejeros para estudiantes de la Facultad de Ciencias Matemáticas — UNMSM.",
  openGraph: {
    title: "Sistema de Tutorías con IA | FCM - UNMSM",
    description:
      "Organización inteligente de tutorías académicas mediante IA con validación institucional (@unmsm.edu.pe).",
  },
};

export default function TutoriasRoutePage() {
  return <PortalFCM />;
}
