// app/radio/page.tsx
"use client";

import { useState } from "react";
import { Radio, Music, Headphones, Check } from "lucide-react";
import RadioPlayer from "@/components/radio/RadioPlayer";
import { RADIO_PLANS } from "@/lib/radio/constants";

export default function RadioPage() {
  const [showPlayer, setShowPlayer] = useState(false);

  if (showPlayer) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Radio className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Tribù Radio</h1>
                <p className="text-gray-500 text-xs">
                  Musica per il tuo locale
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPlayer(false)}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Torna alla home
            </button>
          </div>

          {/* Player */}
          <RadioPlayer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <Radio className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">
              Tribù Radio
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Musica per il tuo locale
            <br />
            <span className="gradient-text">pronta in 30 secondi</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Niente pubblicità. Nessuna playlist da gestire.
            <br />
            Premi play e funziona.
          </p>

          <button
            onClick={() => setShowPlayer(true)}
            className="btn-primary text-lg px-10 py-5 inline-flex items-center gap-3"
          >
            <Headphones className="w-5 h-5" />
            Ascolta ora
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
              <Music className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-white font-semibold mb-2">
                Catalogo originale
              </h3>
              <p className="text-gray-400 text-sm">
                Musica generata tramite AI, originale e royalty-free. Licenza
                inclusa.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
              <Radio className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-white font-semibold mb-2">
                Canali tematici
              </h3>
              <p className="text-gray-400 text-sm">
                Gym, Lounge, Coffee, Beauty, Retail. Scegli il mood giusto per
                il tuo locale.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
              <Headphones className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-white font-semibold mb-2">
                Semplicità totale
              </h3>
              <p className="text-gray-400 text-sm">
                Login, scegli canale, premi play. Musica continua senza
                interruzioni.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-10">
            Piani semplici, musica infinita
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(
              Object.entries(RADIO_PLANS) as [
                string,
                (typeof RADIO_PLANS)[keyof typeof RADIO_PLANS],
              ][]
            ).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-2xl p-6 border ${
                  key === "business"
                    ? "border-primary bg-primary/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {key === "business" && (
                  <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                    Consigliato
                  </span>
                )}
                <h3 className="text-white text-xl font-bold mt-2">
                  {plan.name}
                </h3>
                <p className="text-primary text-3xl font-bold mt-2">
                  {plan.price}€
                  <span className="text-gray-500 text-sm font-normal">
                    /mese
                  </span>
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-gray-300 text-sm"
                    >
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            Tribù Radio · Un progetto Tribù Studio
          </p>
          <p className="text-gray-600 text-xs">
            Musica AI-generated · Licenza inclusa
          </p>
        </div>
      </footer>
    </div>
  );
}
