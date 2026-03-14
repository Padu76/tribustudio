// app/private-gym/booking/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Link from "next/link";

interface SlotInfo {
  id: string;
  starts_at: string;
  ends_at: string;
  price_eur: number;
  status: string;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slotId = searchParams.get("slot");

  const [slot, setSlot] = useState<SlotInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [acceptedRules, setAcceptedRules] = useState(false);

  // Codice sconto
  const [discountCode, setDiscountCode] = useState("");
  const [discountStatus, setDiscountStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [discountMessage, setDiscountMessage] = useState("");

  const formValid = fullName.length >= 2 && email.includes("@") && phone.length >= 5 && acceptedRules;

  // Prezzo visualizzato
  const displayPrice = finalPrice ?? slot?.price_eur ?? 25;
  const hasDiscount = discountStatus === "valid" && finalPrice !== null && slot && finalPrice < slot.price_eur;

  // Carica lo slot
  useEffect(() => {
    if (!slotId) {
      setError("Nessuno slot selezionato.");
      setLoading(false);
      return;
    }
    fetch("/api/private-gym/slots")
      .then((r) => r.json())
      .then((data) => {
        const found = (data.slots || []).find((s: SlotInfo) => s.id === slotId);
        if (!found) {
          setError("Slot non trovato o non più disponibile.");
        } else {
          setSlot(found);
          setFinalPrice(found.price_eur);
        }
      })
      .catch(() => setError("Errore nel caricamento dello slot."))
      .finally(() => setLoading(false));
  }, [slotId]);

  // Valida codice sconto
  const validateCode = useCallback(async () => {
    if (!discountCode.trim() || !slot) {
      setDiscountStatus("idle");
      setFinalPrice(slot?.price_eur ?? 25);
      setDiscountMessage("");
      return;
    }

    setDiscountStatus("checking");
    try {
      const res = await fetch("/api/private-gym/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode, slotPrice: slot.price_eur }),
      });
      const data = await res.json();

      if (data.valid) {
        setDiscountStatus("valid");
        setFinalPrice(data.finalPrice);
        setDiscountMessage(data.message);
      } else {
        setDiscountStatus("invalid");
        setFinalPrice(slot.price_eur);
        setDiscountMessage(data.message || "Codice non valido.");
      }
    } catch {
      setDiscountStatus("invalid");
      setFinalPrice(slot.price_eur);
      setDiscountMessage("Errore nella verifica del codice.");
    }
  }, [discountCode, slot]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !slot) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-4 text-white">
        <p className="text-lg text-red-400">{error || "Slot non disponibile."}</p>
        <Link href="/private-gym#calendario" className="mt-6 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600">
          Torna al calendario
        </Link>
      </main>
    );
  }

  const dateLabel = format(parseISO(slot.starts_at), "EEEE d MMMM yyyy", { locale: it });
  const startTime = format(parseISO(slot.starts_at), "HH:mm");
  const endTime = format(parseISO(slot.ends_at), "HH:mm");
  const timeLabel = `${startTime} — ${endTime}`;
  const customer = { fullName, email, phone, notes, acceptedRules, discountCode: discountCode.trim() };

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-12 text-white">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <Link href="/private-gym" className="text-sm text-white/50 hover:text-white transition">
          &larr; Torna alla landing
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Prenota la tua sessione</h1>

        {/* Riepilogo slot */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold uppercase tracking-widest text-orange-400">Riepilogo</div>
          <div className="mt-3 text-lg font-semibold capitalize text-white">{dateLabel}</div>
          <div className="text-white/70">{timeLabel}</div>

          <div className="mt-3 flex items-center gap-3">
            {hasDiscount ? (
              <>
                <div className="text-lg text-white/40 line-through">{slot.price_eur}€</div>
                <div className="text-2xl font-bold text-green-400">{displayPrice}€</div>
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400 uppercase tracking-wider">
                  Cliente Tribù
                </span>
              </>
            ) : (
              <div className="text-2xl font-bold text-orange-400">{displayPrice}€</div>
            )}
          </div>
        </div>

        {/* Form dati */}
        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-white/60">Nome e Cognome *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-orange-500 focus:outline-none"
              placeholder="Mario Rossi"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/60">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-orange-500 focus:outline-none"
              placeholder="mario@email.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/60">Telefono *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-orange-500 focus:outline-none"
              placeholder="+39 347 888 1515"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/60">Note (opzionale)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-orange-500 focus:outline-none resize-none"
              placeholder="Eventuali richieste o info utili..."
            />
          </div>

          {/* Codice sconto cliente Tribù */}
          <div>
            <label className="mb-1 block text-sm text-white/60">
              Codice cliente Tribù (opzionale)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value.toUpperCase());
                  if (!e.target.value.trim()) {
                    setDiscountStatus("idle");
                    setFinalPrice(slot.price_eur);
                    setDiscountMessage("");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    validateCode();
                  }
                }}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white uppercase placeholder:text-white/30 focus:border-orange-500 focus:outline-none"
                placeholder="Es. TRIBU20"
              />
              <button
                type="button"
                onClick={validateCode}
                disabled={!discountCode.trim() || discountStatus === "checking"}
                className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {discountStatus === "checking" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Applica"
                )}
              </button>
            </div>

            {/* Messaggio validazione */}
            {discountStatus === "valid" && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                {discountMessage}
              </div>
            )}
            {discountStatus === "invalid" && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
                {discountMessage}
              </div>
            )}

            <p className="mt-1.5 text-xs text-white/30">
              Hai un pacchetto personal o miniclass attivo? Inserisci il codice per la tariffa agevolata a 20€.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedRules}
              onChange={(e) => setAcceptedRules(e.target.checked)}
              className="mt-1 h-4 w-4 accent-orange-500"
            />
            <span className="text-sm text-white/70">
              Accetto il{" "}
              <Link href="/private-gym#regole" target="_blank" className="text-orange-400 underline hover:text-orange-300">
                regolamento dello studio
              </Link>{" "}
              e confermo di allenarmi sotto la mia responsabilità. *
            </span>
          </label>
        </div>

        {/* PayPal */}
        <div className="mt-8">
          {!formValid ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/50">
              Compila tutti i campi obbligatori e accetta il regolamento per procedere al pagamento.
            </div>
          ) : (
            <>
              {payError && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  {payError}
                </div>
              )}
              {paying && (
                <div className="mb-4 flex items-center justify-center gap-2 text-sm text-white/60">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                  Elaborazione pagamento...
                </div>
              )}

              {/* Riepilogo prezzo prima del pagamento */}
              {hasDiscount && (
                <div className="mb-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
                  <div className="text-sm text-green-400 font-semibold">
                    Tariffa cliente Tribù applicata: {displayPrice}€ invece di {slot.price_eur}€
                  </div>
                  <div className="text-xs text-green-400/60 mt-1">
                    Risparmi {slot.price_eur - displayPrice}€ su questa sessione
                  </div>
                </div>
              )}

              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                  currency: "EUR",
                  intent: "capture",
                }}
              >
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "gold",
                    shape: "pill",
                    label: "pay",
                    height: 48,
                  }}
                  disabled={paying}
                  createOrder={async () => {
                    setPaying(true);
                    setPayError(null);
                    try {
                      const res = await fetch("/api/private-gym/bookings/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ slotId: slot.id, customer }),
                      });
                      const data = await res.json();
                      if (!res.ok || !data.orderId) {
                        throw new Error(data.error || "Errore creazione ordine.");
                      }
                      return data.orderId;
                    } catch (err: unknown) {
                      const message = err instanceof Error ? err.message : "Errore sconosciuto";
                      setPayError(message);
                      setPaying(false);
                      throw err;
                    }
                  }}
                  onApprove={async (data) => {
                    try {
                      const res = await fetch("/api/private-gym/bookings/capture-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          orderId: data.orderID,
                          slotId: slot.id,
                          customer,
                        }),
                      });
                      const result = await res.json();
                      if (!res.ok || !result.ok) {
                        throw new Error(result.error || "Errore conferma pagamento.");
                      }
                      router.push(`/private-gym/booking/success?bookingId=${result.bookingId}`);
                    } catch (err: unknown) {
                      const message = err instanceof Error ? err.message : "Errore sconosciuto";
                      setPayError(message);
                      setPaying(false);
                    }
                  }}
                  onError={(err) => {
                    setPayError("Errore durante il pagamento PayPal. Riprova.");
                    setPaying(false);
                    console.error("PayPal error:", err);
                  }}
                  onCancel={() => {
                    setPaying(false);
                  }}
                />
              </PayPalScriptProvider>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          Pagamento sicuro gestito da PayPal. I tuoi dati non vengono memorizzati.
        </p>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
