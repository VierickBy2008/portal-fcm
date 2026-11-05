import type { Metadata } from "next";
import PortalFCM from "../page";

export const metadata: Metadata = {
  title: "Mesa de Partes y Contacto Institucional",
  description:
    "Canales de atención estudiantil, teléfonos y anexos por escuela profesional, ubicación en Ciudad Universitaria y formulario de consultas FCM - UNMSM.",
  openGraph: {
    title: "Contacto y Atención Estudiantil | FCM - UNMSM",
    description:
      "Directorio telefónico, anexos y canal de atención en línea de la Facultad de Ciencias Matemáticas — UNMSM.",
  },
};

export default function ContactoRoutePage() {
  return <PortalFCM />;
}
