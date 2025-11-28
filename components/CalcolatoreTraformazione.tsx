"use client";

import React, { useState } from "react";
import { Activity, Dumbbell, Target } from "lucide-react";

const CalcolatoreTraformazione: React.FC = () => {
  const [weeks, setWeeks] = useState<number>(12);
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(2);
  const [goal, setGoal] = useState<"dimagrimento" | "energia" | "tonicita">(
    "dimagrimento"
  );

  const totalSessions = weeks * sessionsPerWeek;

  let focusText = "";
  if (goal === "dimagrimento") {
    focusText =
      "Lavoreremo su deficit calorico sostenibile, allenamento metabolico e controllo dei parametri ogni 2 settimane.";
  } else if (goal === "energia") {
    focusText =
      "Useremo allenamenti brevi ma costanti, lavoro sulla postura e routine quotidiane per migliorare sonno ed energia.";
  } else {
    focusText =
      "Punteremo su forza, stabilità e qualità del movimento, con progressioni studiate in base al tuo livello.";
  }

  let risultatoSintesi = "";
  if (totalSessions <= 12) {
    risultatoSintesi =
      "Percorso breve: utile per sbloccarti e rimetterti in moto con le basi giuste.";
  } else if (totalSessions <= 24) {
    risultatoSintesi =
      "Percorso solido: tempo sufficiente per vedere cambiamenti chiari in corpo, energia e abitudini.";
  } else {
    risultatoSintesi =
      "Percorso completo: ideale per trasformare davvero il tuo stile di vita e consolidare i risultati nel tempo.";
  }

  return (
    <section
      id="calcolatore"
      className="section-padding bg-[var(--color-light-gray)] scroll-mt-24"
    >
      <div className="container-custom grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
        {/* Colonna testo */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Calcola il tuo percorso
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3 gradient-text">
            Quante settimane ti servono per vedere una vera trasformazione?
          </h2>
          <p className="text-gray-600 mb-4">
            Con questo calcolatore puoi farti un&apos;idea realistica di{" "}
            <span className="font-semibold">
              quante sessioni ti servono davvero
            </span>{" "}
            per iniziare a vedere risultati su corpo, energia e abitudini.
          </p>
          <p className="text-gray-600 mb-4">
            È uno strumento semplice, ma ti aiuta a uscire dalla logica del
            “provo per due settimane e vediamo” e a ragionare su un{" "}
            <span className="font-semibold">percorso strutturato</span>.
          </p>
          <p className="text-gray-600">
            Nella call conoscitiva useremo questi dati per disegnare un
            percorso su misura per te, in base al tuo lavoro, al tempo
            disponibile e al livello di partenza.
          </p>
        </div>

        {/* Colonna calcolatore */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 hover-lift">
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Calcolatore Trasformazione</h3>
          </div>

          <div className="space-y-4 text-sm">
            {/* settimane */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Durata percorso (settimane)
              </label>
              <input
                type="range"
                min={4}
                max={24}
                step={2}
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>{weeks} settimane</span>
                <span>24</span>
              </div>
            </div>

            {/* sessioni */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Allenamenti a settimana
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSessionsPerWeek(n)}
                    className={`flex-1 py-2 rounded-full border text-xs font-semibold transition-all ${
                      sessionsPerWeek === n
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                    }`}
                  >
                    {n}x settimana
                  </button>
                ))}
              </div>
            </div>

            {/* obiettivo */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Obiettivo principale
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setGoal("dimagrimento")}
                  className={`py-2 px-3 rounded-full border text-xs font-semibold transition-all ${
                    goal === "dimagrimento"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                  }`}
                >
                  Dimagrimento
                </button>
                <button
                  type="button"
                  onClick={() => setGoal("energia")}
                  className={`py-2 px-3 rounded-full border text-xs font-semibold transition-all ${
                    goal === "energia"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                  }`}
                >
                  Più energia
                </button>
                <button
                  type="button"
                  onClick={() => setGoal("tonicita")}
                  className={`py-2 px-3 rounded-full border text-xs font-semibold transition-all ${
                    goal === "tonicita"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                  }`}
                >
                  Tonicità/forza
                </button>
              </div>
            </div>

            {/* risultato */}
            <div className="mt-4 p-3 rounded-xl bg-orange-50 border border-orange-100 flex gap-3">
              <Activity className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-1">
                  Stima percorso
                </p>
                <p className="text-sm font-semibold mb-1">
                  Circa {totalSessions} sessioni in {weeks} settimane.
                </p>
                <p className="text-xs text-gray-700 mb-1">{risultatoSintesi}</p>
                <p className="text-xs text-gray-600">{focusText}</p>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-gray-400">
              Questa è una stima indicativa: la durata reale del percorso viene
              definita insieme a te dopo l’analisi iniziale.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalcolatoreTraformazione;
