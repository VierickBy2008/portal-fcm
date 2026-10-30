import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Facultad de Ciencias Matemáticas | UNMSM - Portal Oficial",
  description:
    "Portal Académico Oficial de la Facultad de Ciencias Matemáticas de la Universidad Nacional Mayor de San Marcos (UNMSM). Computación Científica, Matemática, Estadística e Investigación Operativa.",
  icons: {
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UNMSM_coatofarms_seal.svg/240px-UNMSM_coatofarms_seal.svg.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
