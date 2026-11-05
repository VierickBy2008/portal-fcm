import type { Metadata } from "next";
import PortalFCM from "../page";

export const metadata: Metadata = {
  title: "Panel de Administración CMS",
  description:
    "Sistema de Gestión de Contenidos (CMS) de la Facultad de Ciencias Matemáticas — UNMSM.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRoutePage() {
  return <PortalFCM />;
}
