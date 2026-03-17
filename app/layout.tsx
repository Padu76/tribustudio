// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tribù Radio – Musica per il tuo locale",
  description:
    "Streaming musicale per locali commerciali. Musica originale AI-generated, niente pubblicità, player semplice. Premi play e funziona.",
  openGraph: {
    title: "Tribù Radio – Musica per il tuo locale",
    description:
      "Musica per il tuo locale pronta in 30 secondi. Niente pubblicità, nessuna playlist da gestire.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={inter.variable}>
      <body className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]">
        {children}
      </body>
    </html>
  );
}
