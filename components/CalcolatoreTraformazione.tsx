"use client";

import React, { useState } from 'react';
import { Activity, Dumbbell, Target } from 'lucide-react';

interface CalcolatoreTraformazioneProps {
  className?: string;
}

/**
 * Calcolatore molto semplice:
 * - input: età, settimane che vuoi essere costante, allenamenti/settimana
 * - output: "score trasformazione" + messaggio motivazionale
 */
const CalcolatoreTraformazione: React.FC<CalcolatoreTraformazioneProps> = ({
  className,
}) => {
  const [eta, setEta] = useState<number | ''>('');
  const [settimane, setSettimane] = useState<number | ''>('');
  const [allenamenti, setAllenamenti] = useState<number | ''>('');
  const [score, setScore] = useState<number | null>(null);

  const handleCalcola = (e: React.FormEvent) => {
    e.preventDefault();

    if (!eta || !settimane || !allenamenti) {
      setScore(null);
      return;
    }

    // formula grezza ma sensata: più settimane + più allenamenti = score più alto
    const base = Number(settimane) * Number(allenamenti);
    const ageFactor = Number(eta) >= 40 ? 0.9 : 1; // sopra i 40 è più impegnativo, ma valorizziamo comunque
    const result = Math.round(base * ageFactor);

    setScore(result);
  };

  const getMessaggio = () => {
    if (score === null) return '';

    if (score < 20) {
      return 'Partenza soft: va benissimo così, l’importante è iniziare. Da qui possiamo solo migliorare 💪';
    }
    if (score < 40) {
      return 'Buona base di costanza: con un percorso strutturato i risultati arrivano in modo regolare. 🔥';
    }
    return 'Impegno da vero Tribù: con questa costanza il cambiamento diventa inevitabile. Ora serve solo la direzione giusta. 🚀';
  };

  return (
    <div
      className={`w-full max-w-xl mx-auto rounded-xl border border-gray-200 bg-white/80 shadow-sm p-6 md:p-8 ${
        className || ''
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            Calcolatore Trasformazione Tribù
          </h2>
          <p className="text-sm text-gray-500">
            Inserisci pochi dati e scopri quanto sei vicino a una vera
            trasformazione.
          </p>
        </div>
      </div>

      <form onSubmit={handleCalcola} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Età
            </label>
            <input
              type="number"
              min={16}
              max={80}
              value={eta}
              onChange={(e) => setEta(e.target.value ? Number(e.target.value) : '')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="es. 38"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Settimane di impegno
            </label>
            <input
              type="number"
              min={1}
              max={52}
              value={settimane}
              onChange={(e) =>
                setSettimane(e.target.value ? Number(e.target.value) : '')
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="es. 12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allenamenti / settimana
            </label>
            <input
              type="number"
              min={1}
              max={7}
              value={allenamenti}
              onChange={(e) =>
                setAllenamenti(e.target.value ? Number(e.target.value) : '')
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="es. 3"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          <Dumbbell className="h-4 w-4" />
          Calcola il tuo score
        </button>
      </form>

      {score !== null && (
        <div className="mt-6 rounded-lg bg-blue-50 p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">
              Il tuo punteggio trasformazione:
            </span>
          </div>
          <div className="text-3xl font-bold text-blue-700 mb-2">
            {score} punti
          </div>
          <p className="text-sm text-blue-900">{getMessaggio()}</p>
        </div>
      )}
    </div>
  );
};

export default CalcolatoreTraformazione;
