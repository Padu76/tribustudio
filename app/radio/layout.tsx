// app/radio/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tribù Radio – Musica per il tuo locale",
  description:
    "Streaming musicale per locali commerciali. Musica originale, niente pubblicità, player semplice. Premi play e funziona.",
};

export default function RadioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]">
      {children}
    </div>
  );
}
