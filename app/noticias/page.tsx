import type { Metadata } from "next";
import PortalFCM from "../page";

export const metadata: Metadata = {
  title: "Hemeroteca y Archivo Oficial de Noticias",
  description:
    "Consulta todos los comunicados oficiales, eventos académicos, seminarios y convocatorias de la Facultad de Ciencias Matemáticas — UNMSM.",
  openGraph: {
    title: "Hemeroteca y Archivo Oficial de Noticias | FCM - UNMSM",
    description:
      "Archivo histórico de noticias, eventos, congresos y comunicados oficiales de la FCM - UNMSM.",
  },
};

export default function NoticiasRoutePage() {
  return <PortalFCM />;
}
