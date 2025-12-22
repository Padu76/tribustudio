// E:\tribustudio\components\CalcolatoreTrasformazione.tsx
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

    let deficit = 0;
    if (form.obiettivo === "dimagrire") deficit = 500;
    if (form.obiettivo === "tonificare") deficit = 250;
    if (form.obiettivo === "mettere_massa") deficit = -250;

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
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-orange-50 overflow-hidden">
      {/* Pattern decorativo sfondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <span className="inline-block text-primary bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-primary/20">
              CALCOLATORE TRASFORMAZIONE
            </span>
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4 text-gray-900">
              In quanto tempo puoi trasformarti?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Inserisci i tuoi dati reali e scopri una stima onesta dei tempi di trasformazione
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white shadow-2xl rounded-3xl p-6 md:p-10 border border-gray-100">
            <form onSubmit={calcola} className="space-y-6">
              {/* Riga 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Sesso
                  </label>
                  <select
                    name="sesso"
                    value={form.sesso}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  >
                    <option value="uomo">Uomo</option>
                    <option value="donna">Donna</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Età
                  </label>
                  <input
                    type="number"
                    name="eta"
                    value={form.eta}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="es. 38"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Altezza (cm)
                  </label>
                  <input
                    type="number"
                    name="altezza"
                    value={form.altezza}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="es. 175"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Livello attività
                  </label>
                  <select
                    name="livelloAttivita"
                    value={form.livelloAttivita}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  >
                    <option value="basso">Basso</option>
                    <option value="medio">Medio</option>
                    <option value="alto">Alto</option>
                  </select>
                </div>
              </div>

              {/* Riga 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Peso attuale (kg)
                  </label>
                  <input
                    type="number"
                    name="pesoAttuale"
                    value={form.pesoAttuale}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="es. 82"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Peso obiettivo (kg)
                  </label>
                  <input
                    type="number"
                    name="pesoObiettivo"
                    value={form.pesoObiettivo}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="es. 74"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Obiettivo
                  </label>
                  <select
                    name="obiettivo"
                    value={form.obiettivo}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  >
                    <option value="dimagrire">Dimagrire</option>
                    <option value="tonificare">Tonificare</option>
                    <option value="mettere_massa">Mettere massa</option>
                  </select>
                </div>
              </div>

              {errore && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm font-medium">
                  ⚠️ {errore}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none group relative bg-primary text-white px-8 py-4 rounded-full text-base font-bold hover:scale-105 transition-all shadow-lg hover:shadow-xl overflow-hidden"
                >
                  <span className="relative z-10">Calcola la mia trasformazione</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-full text-base font-semibold hover:bg-gray-50 transition-all"
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Risultati */}
            {risultato && (
              <div className="mt-10 p-8 bg-gradient-to-br from-primary/5 to-orange-50 border-2 border-primary/20 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <span className="text-primary">📊</span>
                  La stima per il tuo caso
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-600 mb-1">Chili di differenza</p>
                    <p className="text-3xl font-bold text-primary">
                      {risultato.chiliDaPerdere.toFixed(1)} kg
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-600 mb-1">Deficit/Surplus giornaliero</p>
                    <p className="text-3xl font-bold text-primary">
                      {risultato.deficitCaloricoGiornaliero > 0
                        ? `-${risultato.deficitCaloricoGiornaliero}`
                        : `+${Math.abs(risultato.deficitCaloricoGiornaliero)}`}{" "}
                      <span className="text-base">kcal</span>
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-600 mb-1">Tempo stimato</p>
                    <p className="text-3xl font-bold text-primary">
                      {risultato.tempoStimatoSettimane}{" "}
                      <span className="text-base">settimane</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border-l-4 border-primary shadow-sm">
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-primary">💡 Nota importante:</strong>{" "}
                    {risultato.nota}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalcolatoreTrasformazione;