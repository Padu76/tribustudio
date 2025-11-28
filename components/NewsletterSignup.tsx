"use client";

import React, { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const NewsletterSignup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const isDisabled = status === "loading" || status === "success";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Inserisci un indirizzo email valido.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
        }),
      });

      if (!res.ok) {
        let errorMessage = "Errore durante l’iscrizione.";
        try {
          const data = await res.json();
          if (data?.error) errorMessage = data.error;
        } catch {
          // ignore
        }
        throw new Error(errorMessage);
      }

      setStatus("success");
      setMessage(
        "Iscrizione completata! Ti invieremo i nuovi articoli direttamente via email."
      );
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Si è verificato un errore. Riprova tra qualche minuto.");
    }
  };

  return (
    <div className="max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover-lift">
      <h2 className="text-xl md:text-2xl font-extrabold mb-2">
        Iscriviti alla newsletter Tribù
      </h2>
      <p className="text-sm md:text-base text-gray-600 mb-4">
        Una volta a settimana ricevi il{" "}
        <span className="font-semibold">nuovo articolo</span> su allenamento,
        alimentazione e motivazione. Niente spam, solo contenuti utili.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:gap-3">
          <div className="flex-1 mb-3 md:mb-0">
            <label
              htmlFor="newsletter-name"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              Nome (opzionale)
            </label>
            <input
              id="newsletter-name"
              type="text"
              className="w-full rounded-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary"
              placeholder="Come vuoi che ti chiamiamo?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isDisabled}
            />
          </div>

          <div className="flex-1 mb-3 md:mb-0">
            <label
              htmlFor="newsletter-email"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              Email *
            </label>
            <input
              id="newsletter-email"
              type="email"
              className="w-full rounded-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary"
              placeholder="es. nome@email.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isDisabled}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full md:w-auto text-sm md:text-base"
          disabled={isDisabled}
        >
          {status === "loading"
            ? "Iscrizione in corso..."
            : status === "success"
            ? "Iscritto ✔"
            : "Iscriviti alla newsletter"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-xs md:text-sm ${
            status === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      <p className="mt-2 text-[10px] md:text-xs text-gray-400">
        Puoi disiscriverti in qualsiasi momento con il link presente in ogni
        email.
      </p>
    </div>
  );
};

export default NewsletterSignup;
