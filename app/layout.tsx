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
  metadataBase: new URL("https://matematicas.unmsm.edu.pe"),
  title: {
    default: "Facultad de Ciencias Matemáticas | UNMSM - Portal Oficial",
    template: "%s | FCM - UNMSM",
  },
  description:
    "Portal Académico Oficial de la Facultad de Ciencias Matemáticas de la Universidad Nacional Mayor de San Marcos (UNMSM). Escuelas de Computación Científica, Matemática, Estadística e Investigación Operativa.",
  keywords: [
    "FCM UNMSM",
    "Facultad de Ciencias Matemáticas",
    "UNMSM",
    "Computación Científica",
    "Matemática UNMSM",
    "Estadística UNMSM",
    "Investigación Operativa UNMSM",
    "San Marcos",
  ],
  openGraph: {
    title: "Facultad de Ciencias Matemáticas | UNMSM - Portal Oficial",
    description:
      "Formando líderes científicos e investigadores en Computación Científica, Matemática, Estadística e Investigación Operativa en la Decana de América.",
    siteName: "Facultad de Ciencias Matemáticas - UNMSM",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Escudo Facultad de Ciencias Matemáticas - UNMSM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Facultad de Ciencias Matemáticas | UNMSM",
    description:
      "Portal Académico Oficial de la FCM - UNMSM: Mallas Curriculares 2026, Plana Docente, Repositorio Académico y Transparencia.",
    images: ["/icon.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png?v=3", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico?v=3", sizes: "any" },
    ],
    shortcut: "/icon.png?v=3",
    apple: "/apple-touch-icon.png?v=3",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" type="image/png" sizes="512x512" href="/icon.png?v=3" />
        <link rel="icon" sizes="any" href="/favicon.ico?v=3" />
        <link rel="shortcut icon" href="/icon.png?v=3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
