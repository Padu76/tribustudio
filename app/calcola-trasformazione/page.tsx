// app/calcola-trasformazione/page.tsx

import React from "react";
import CalcolatoreTrasformazione from "@/components/CalcolatoreTrasformazione";

export const metadata = {
  title: "Calcola la tua Trasformazione | Tribù Personal Training Studio",
  description:
    "Scopri in quanto tempo puoi raggiungere il tuo obiettivo fisico con il metodo Tribù. Calcola tempi, impegno e percorso ideale.",
};

export default function CalcolaTrasformazionePage() {
  return (
    <main>
      {/* Hero / intestazione */}
      <section className="bg-[#ff7a21] text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Calcola la tua trasformazione
          </h1>
          <p className="text-lg md:text-xl">
            Inserisci pochi dati e scopri in quanto tempo puoi cambiare corpo e
            livello di energia con il metodo Tribù.
          </p>
        </div>
      </section>

      {/* Calcolatore */}
      <section className="bg-[#f7f7f7] py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <CalcolatoreTrasformazione />
        </div>
      </section>
    </main>
  );
}
