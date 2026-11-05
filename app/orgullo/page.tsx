import type { Metadata } from "next";
import PortalFCM from "../page";

export const metadata: Metadata = {
  title: "Orgullo San Marquino • Galería de Excelencia Estudiantil",
  description:
    "Conoce los logros internacionales, becas, hackatones y publicaciones científicas de los estudiantes y egresados de la Facultad de Ciencias Matemáticas — UNMSM.",
  openGraph: {
    title: "Orgullo San Marquino | FCM - UNMSM",
    description:
      "Galería oficial de reconocimientos y logros estudiantiles de la Facultad de Ciencias Matemáticas — UNMSM.",
  },
};

export default function OrgulloRoutePage() {
  return <PortalFCM />;
}
