"use client";

import React, { useState } from "react";

type Sesso = "uomo" | "donna";
type Obiettivo = "dimagrire" | "tonificare" | "mettere_massa";

interface FormState {
  sesso: Sesso;
  eta: string;
  altezza: string;
  pesoAttuale: string;
  pesoObiettivo: string;
  livelloAttivita: "basso" | "medio" | "alto";
  obiettivo: Obiettivo;
}

interface Risultato {
  deficitCaloricoGiornaliero: number;
  chiliDaPerdere: number;
  tempoStimatoSettimane: number;
  nota: string;
}

const iniziale: FormState = {
  sesso: "uomo",
  eta: "",
  altezza: "",
  pesoAttuale: "",
  pesoObiettivo: "",
  livelloAttivita: "medio",
  obiettivo: "dimagrire",
};

const CalcolatoreTrasformazione: React.FC = () => {
  const [form, setForm] = useState<FormState>(iniziale);
  const [risultato, setRisultato] = useState<Risultato | null>(null);
  const [errore, setErrore] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calcola = (e: React.FormEvent) => {
    e.preventDefault();
    setErrore(null);
    setRisultato(null);

    const pesoAttuale = parseFloat(form.pesoAttuale.replace(",", "."));
    const pesoObiettivo = parseFloat(form.pesoObiettivo.replace(",", "."));
    const altezza = parseFloat(form.altezza.replace(",", "."));
    const eta = parseInt(form.eta, 10);

    if (!pesoAttuale || !pesoObiettivo || !altezza || !eta) {
      setErrore("Compila tutti i campi principali con valori validi.");
      return;
    }

    if (pesoObiettivo >= pesoAttuale && form.obiettivo === "dimagrire") {
      setErrore(
        "Per dimagrire il peso obiettivo deve essere inferiore al peso attuale."
      );
      return;
    }

    const differenzaKg = Math.abs(pesoAttuale - pesoObiettivo);

    // Stima semplice del deficit/surplus
    let deficit = 0;
    if (form.obiettivo === "dimagrire") deficit = 500;
    if (form.obiettivo === "tonificare") deficit = 250;
    if (form.obiettivo === "mettere_massa") deficit = -250;

    // Stimiamo la velocità del cambiamento
    // Formula semplice: 7000 kcal = 1 kg
    const kcalTotali = differenzaKg * 7000;
    const giorniStimati =
      deficit === 0 ? 0 : Math.abs(Math.round(kcalTotali / deficit));
    const settimane =
      deficit === 0 ? 0 : Math.max(1, Math.round(giorniStimati / 7));

    let nota = "";

    if (form.obiettivo === "dimagrire") {
      nota =
        settimane <= 4
          ? "Con un percorso mirato puoi vedere un cambiamento netto già nel primo mese."
          : "Con costanza e un piano strutturato il cambiamento sarà evidente nelle prossime settimane.";
    }

    if (form.obiettivo === "tonificare") {
      nota =
        "La tonificazione visibile richiede progressione sui carichi: i risultati arrivano tra 6 e 12 settimane.";
    }

    if (form.obiettivo === "mettere_massa") {
      nota =
        "Aumentare massa muscolare richiede tempo e continuità. I progressi sono graduali ma costanti.";
    }

    setRisultato({
      deficitCaloricoGiornaliero: deficit,
      chiliDaPerdere: differenzaKg,
      tempoStimatoSettimane: settimane,
      nota,
    });
  };

  const reset = () => {
    setForm(iniziale);
    setRisultato(null);
    setErrore(null);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 mt-12">
      <h2 className="text-2xl font-semibold mb-2 text-gray-900">
        In quanto tempo puoi trasformarti?
      </h2>
      <p className="text-gray-600 mb-6">
        Inserisci i tuoi dati reali e scopri una stima onesta dei tempi di
        trasformazione.
      </p>

      <form onSubmit={calcola} className="space-y-4">
        {/* Riga 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sesso</label>
            <select
              name="sesso"
              value={form.sesso}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="uomo">Uomo</option>
              <option value="donna">Donna</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Età</label>
            <input
              type="number"
              name="eta"
              value={form.eta}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="es. 38"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Altezza (cm)</label>
            <input
              type="number"
              name="altezza"
              value={form.altezza}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="es. 175"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Livello attività
            </label>
            <select
              name="livelloAttivita"
              value={form.livelloAttivita}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="basso">Basso</option>
              <option value="medio">Medio</option>
              <option value="alto">Alto</option>
            </select>
          </div>
        </div>

        {/* Riga 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Peso attuale (kg)
            </label>
            <input
              type="number"
              name="pesoAttuale"
              value={form.pesoAttuale}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="es. 82"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Peso obiettivo (kg)
            </label>
            <input
              type="number"
              name="pesoObiettivo"
              value={form.pesoObiettivo}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="es. 74"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Obiettivo
            </label>
            <select
              name="obiettivo"
              value={form.obiettivo}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="dimagrire">Dimagrire</option>
              <option value="tonificare">Tonificare</option>
              <option value="mettere_massa">Mettere massa</option>
            </select>
          </div>
        </div>

        {errore && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
            {errore}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-[#ff7a21] text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition"
          >
            Calcola la mia trasformazione
          </button>
          <button
            type="button"
            onClick={reset}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-50 transition"
          >
            Reset
          </button>
        </div>
      </form>

      {risultato && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">
            La stima per il tuo caso
          </h3>

          <p className="text-gray-700 mb-2">
            <strong>Chili di differenza:</strong>{" "}
            {risultato.chiliDaPerdere.toFixed(1)} kg
          </p>

          <p className="text-gray-700 mb-2">
            <strong>Deficit/surplus:</strong>{" "}
            {risultato.deficitCaloricoGiornaliero > 0
              ? `-${risultato.deficitCaloricoGiornaliero} kcal/giorno`
              : `+${Math.abs(
                  risultato.deficitCaloricoGiornaliero
                )} kcal/giorno`}
          </p>

          <p className="text-gray-700 mb-2">
            <strong>Tempo stimato:</strong>{" "}
            {risultato.tempoStimatoSettimane} settimane circa
          </p>

          <p className="text-gray-700 mt-3">{risultato.nota}</p>
        </div>
      )}
    </div>
  );
};

export default CalcolatoreTrasformazione;
