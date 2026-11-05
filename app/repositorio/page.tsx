import type { Metadata } from "next";
import PortalFCM from "../page";

export const metadata: Metadata = {
  title: "Repositorio Académico Comunitario",
  description:
    "Repositorio estudiantil y académico de sílabos, exámenes pasados, apuntes de clase, libros y código fuente por escuela y ciclo en la FCM - UNMSM.",
  openGraph: {
    title: "Repositorio Académico Comunitario | FCM - UNMSM",
    description:
      "Descarga y comparte material académico verificado para las 4 escuelas profesionales de la FCM - UNMSM.",
  },
};

export default function RepositorioRoutePage() {
  return <PortalFCM />;
}
