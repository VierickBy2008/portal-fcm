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
