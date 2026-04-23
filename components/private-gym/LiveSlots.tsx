// components/private-gym/LiveSlots.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  parseISO,
  startOfWeek,
  addDays,
  addWeeks,
  isSameDay,
} from "date-fns";
import { it } from "date-fns/locale";

type ComputedSlot = {
  date: string;
  start_time: string;
  end_time: string;
  starts_at_rome: string;
  ends_at_rome: string;
  status: "available" | "request-whatsapp" | "booked";
  price: number;
  whatsapp_url?: string;
};

const HOUR_HEIGHT = 56;
const START_HOUR = 6;
const END_HOUR = 22;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

const WEEKDAY_SHORT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

function slotKey(s: ComputedSlot): string {
  return `${s.date}|${s.start_time}|${s.end_time}`;
}

function formatItalianDate(dateISO: string): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return format(date, "EEEE d MMMM yyyy", { locale: it });
}

export default function LiveSlots() {
  const router = useRouter();
  const [slots, setSlots] = useState<ComputedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [reservingKey, setReservingKey] = useState<string | null>(null);
  const [reserveError, setReserveError] = useState<string | null>(null);

  // Modal state for amber "request" flow
  const [requestSlot, setRequestSlot] = useState<ComputedSlot | null>(null);
  const [reqName, setReqName] = useState("");
  const [reqPhone, setReqPhone] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqSubmitting, setReqSubmitting] = useState(false);
  const [reqError, setReqError] = useState<string | null>(null);
  const [reqSuccess, setReqSuccess] = useState<{ whatsapp_url: string } | null>(null);

  useEffect(() => {
    fetch("/api/private-gym/slots/computed", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const visible = (data.slots || []).filter(
          (s: ComputedSlot) => s.status !== "booked"
        );
        setSlots(visible);
      })
      .catch(() => setError("Errore nel caricamento degli slot"))
      .finally(() => setLoading(false));
  }, []);

  const weekStart = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    return addWeeks(start, weekOffset);
  }, [weekOffset]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const weekLabel = useMemo(() => {
    const from = format(weekDays[0], "d MMM", { locale: it });
    const to = format(weekDays[6], "d MMM yyyy", { locale: it });
    return `${from} — ${to}`;
  }, [weekDays]);

  const slotsByDay = useMemo(() => {
    const map: Record<number, ComputedSlot[]> = {};
    for (let i = 0; i < 7; i++) map[i] = [];
    for (const slot of slots) {
      const d = parseISO(slot.starts_at_rome);
      for (let i = 0; i < 7; i++) {
        if (isSameDay(d, weekDays[i])) {
          map[i].push(slot);
          break;
        }
      }
    }
    return map;
  }, [slots, weekDays]);

  const weekHasSlots = useMemo(() => {
    return Object.values(slotsByDay).some((arr) => arr.length > 0);
  }, [slotsByDay]);

  async function reserveAndRedirect(slot: ComputedSlot) {
    setReserveError(null);
    const key = slotKey(slot);
    setReservingKey(key);
    try {
      const res = await fetch("/api/private-gym/slots/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: slot.date,
          start_time: slot.start_time,
          end_time: slot.end_time,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.id) {
        throw new Error(data.error || "Slot non più disponibile. Riprova.");
      }
      router.push(`/private-gym/booking?slot=${data.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore imprevisto.";
      setReserveError(message);
      setReservingKey(null);
    }
  }

  function openRequestModal(slot: ComputedSlot) {
    setRequestSlot(slot);
    setReqName("");
    setReqPhone("");
    setReqEmail("");
    setReqError(null);
    setReqSuccess(null);
  }

  function closeRequestModal() {
    setRequestSlot(null);
    setReqName("");
    setReqPhone("");
    setReqEmail("");
    setReqError(null);
    setReqSuccess(null);
  }

  async function submitRequest() {
    if (!requestSlot) return;
    setReqError(null);

    if (reqName.trim().length < 2) {
      setReqError("Inserisci il tuo nome.");
      return;
    }
    if (reqPhone.trim().length < 5) {
      setReqError("Inserisci un numero di telefono valido.");
      return;
    }
    if (!reqEmail.includes("@")) {
      setReqError("Inserisci una email valida.");
      return;
    }

    setReqSubmitting(true);
    try {
      const res = await fetch("/api/private-gym/slot-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: requestSlot.date,
          start_time: requestSlot.start_time,
          end_time: requestSlot.end_time,
          customer_name: reqName.trim(),
          customer_phone: reqPhone.trim(),
          customer_email: reqEmail.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Errore nell'invio della richiesta.");
      }
      setReqSuccess({ whatsapp_url: data.whatsapp_url });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore imprevisto.";
      setReqError(message);
    } finally {
      setReqSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <p className="py-8 text-center text-sm text-red-400">{error}</p>;
  }

  if (slots.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-white/70">
          Nessuno slot disponibile al momento
        </p>
        <p className="mt-2 text-sm text-white/50">
          Gli orari si aggiornano automaticamente in base al calendario dello studio.
        </p>
      </div>
    );
  }

  const today = new Date();

  return (
    <div>
      {reserveError && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
          {reserveError}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <div className="text-sm font-semibold text-white capitalize">{weekLabel}</div>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="mt-1 text-xs text-orange-400 hover:text-orange-300"
            >
              Torna a questa settimana
            </button>
          )}
        </div>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-xs text-white/60">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />
          Prenotabile online
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" />
          Su richiesta
        </span>
      </div>

      {/* MOBILE */}
      <div className="block lg:hidden">
        {!weekHasSlots ? (
          <div className="py-8 text-center text-white/40 text-sm">
            Nessuno slot in questa settimana
          </div>
        ) : (
          <div className="space-y-4">
            {weekDays.map((day, dayIdx) => {
              const daySlots = slotsByDay[dayIdx];
              if (daySlots.length === 0) return null;
              const isToday = isSameDay(day, today);
              return (
                <div key={dayIdx}>
                  <div className={`text-sm font-semibold capitalize mb-2 ${isToday ? "text-orange-400" : "text-white/60"}`}>
                    {format(day, "EEEE d MMMM", { locale: it })}
                    {isToday && <span className="ml-2 text-[10px] uppercase tracking-wider bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">Oggi</span>}
                  </div>
                  <div className="space-y-2">
                    {daySlots
                      .slice()
                      .sort((a, b) => a.starts_at_rome.localeCompare(b.starts_at_rome))
                      .map((slot) => {
                        const startTime = slot.start_time.slice(0, 5);
                        const endTime = slot.end_time.slice(0, 5);
                        const key = slotKey(slot);
                        const isReserving = reservingKey === key;
                        if (slot.status === "available") {
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => reserveAndRedirect(slot)}
                              disabled={isReserving}
                              className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3 hover:border-orange-500/30 hover:bg-orange-500/5 transition disabled:opacity-60 disabled:cursor-wait text-left"
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-base font-semibold text-white">{startTime} — {endTime}</div>
                                <span className="text-xs text-white/50">{slot.price}€</span>
                              </div>
                              <span className="rounded-full bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white">
                                {isReserving ? "…" : "Prenota"}
                              </span>
                            </button>
                          );
                        }
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => openRequestModal(slot)}
                            className="w-full flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 hover:border-amber-400/40 hover:bg-amber-400/10 transition text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-base font-semibold text-white">{startTime} — {endTime}</div>
                              <span className="text-xs text-white/50">{slot.price}€</span>
                            </div>
                            <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-1.5 text-xs font-semibold text-amber-300">
                              Richiedi
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-[48px_repeat(7,1fr)] border-b border-white/10">
          <div />
          {weekDays.map((day, i) => {
            const isToday = isSameDay(day, today);
            return (
              <div key={i} className="py-2 text-center">
                <div className={`text-[11px] font-medium uppercase tracking-wider ${isToday ? "text-orange-400" : "text-white/40"}`}>
                  {WEEKDAY_SHORT[i]}
                </div>
                <div className={`mt-0.5 text-lg font-bold ${
                  isToday
                    ? "mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white"
                    : "text-white/80"
                }`}>
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative grid grid-cols-[48px_repeat(7,1fr)]" style={{ height: `${(END_HOUR - START_HOUR) * HOUR_HEIGHT}px` }}>
          {HOURS.map((hour) => {
            const top = (hour - START_HOUR) * HOUR_HEIGHT;
            return (
              <div key={hour} className="contents">
                <div
                  className="absolute left-0 w-[48px] text-right pr-2 text-[11px] text-white/30 -translate-y-1/2"
                  style={{ top: `${top}px` }}
                >
                  {String(hour).padStart(2, "0")}:00
                </div>
                <div
                  className="absolute left-[48px] right-0 border-t border-white/5"
                  style={{ top: `${top}px` }}
                />
              </div>
            );
          })}

          {weekDays.map((day, dayIdx) => {
            const daySlots = slotsByDay[dayIdx];
            return daySlots.map((slot) => {
              const [sh, sm] = slot.start_time.split(":").map(Number);
              const [eh, em] = slot.end_time.split(":").map(Number);
              const startHour = sh + (sm || 0) / 60;
              const durationMin = (eh * 60 + (em || 0)) - (sh * 60 + (sm || 0));
              const top = (startHour - START_HOUR) * HOUR_HEIGHT;
              const height = (durationMin / 60) * HOUR_HEIGHT;
              const startLabel = slot.start_time.slice(0, 5);
              const endLabel = slot.end_time.slice(0, 5);
              const key = slotKey(slot);
              const isReserving = reservingKey === key;

              if (slot.status === "available") {
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => reserveAndRedirect(slot)}
                    disabled={isReserving}
                    className="absolute rounded-lg bg-orange-500/20 border border-orange-500/40 px-1.5 py-1 hover:bg-orange-500/30 hover:border-orange-500/60 transition cursor-pointer overflow-hidden group disabled:opacity-60 disabled:cursor-wait text-left"
                    style={{
                      top: `${top}px`,
                      height: `${Math.max(height, 28)}px`,
                      left: `calc(${(dayIdx / 7) * 100}% + 48px + 2px)`,
                      width: `calc(${100 / 7}% - 4px)`,
                    }}
                    title={`${startLabel}-${endLabel} · ${slot.price}€ · Clicca per prenotare`}
                  >
                    <div className="text-[11px] font-bold text-orange-300 leading-tight">
                      {startLabel} - {endLabel}
                    </div>
                    {height >= 40 && (
                      <div className="text-[10px] text-orange-400/70 mt-0.5">
                        {isReserving ? "…" : `${slot.price}€ · Prenota`}
                      </div>
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => openRequestModal(slot)}
                  className="absolute rounded-lg bg-amber-400/10 border border-amber-400/30 px-1.5 py-1 hover:bg-amber-400/20 hover:border-amber-400/50 transition cursor-pointer overflow-hidden group text-left"
                  style={{
                    top: `${top}px`,
                    height: `${Math.max(height, 28)}px`,
                    left: `calc(${(dayIdx / 7) * 100}% + 48px + 2px)`,
                    width: `calc(${100 / 7}% - 4px)`,
                  }}
                  title={`${startLabel}-${endLabel} · Richiedi slot`}
                >
                  <div className="text-[11px] font-bold text-amber-300 leading-tight">
                    {startLabel} - {endLabel}
                  </div>
                  {height >= 40 && (
                    <div className="text-[10px] text-amber-400/70 mt-0.5">
                      Richiedi
                    </div>
                  )}
                </button>
              );
            });
          })}
        </div>

        {!weekHasSlots && (
          <div className="py-12 text-center text-white/40 text-sm">
            Nessuno slot disponibile in questa settimana
          </div>
        )}
      </div>

      {/* MODAL — Request slot */}
      {requestSlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !reqSubmitting) closeRequestModal();
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 text-white shadow-2xl">
            {!reqSuccess ? (
              <>
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-white">Richiedi questo slot</h2>
                  <p className="mt-1 text-sm text-white/60 capitalize">
                    {formatItalianDate(requestSlot.date)} · {requestSlot.start_time.slice(0, 5)}-{requestSlot.end_time.slice(0, 5)}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/60">Nome e Cognome</label>
                    <input
                      type="text"
                      value={reqName}
                      onChange={(e) => setReqName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-white placeholder:text-white/30 focus:border-orange-500 focus:outline-none"
                      placeholder="Mario Rossi"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/60">Telefono</label>
                    <input
                      type="tel"
                      value={reqPhone}
                      onChange={(e) => setReqPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-white placeholder:text-white/30 focus:border-orange-500 focus:outline-none"
                      placeholder="+39 347 888 1515"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/60">Email</label>
                    <input
                      type="email"
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-white placeholder:text-white/30 focus:border-orange-500 focus:outline-none"
                      placeholder="mario@email.it"
                    />
                  </div>
                </div>

                {reqError && (
                  <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    {reqError}
                  </div>
                )}

                <p className="mt-4 text-xs text-white/40">
                  Dopo aver inviato la richiesta riceverai una email con il link di pagamento appena la confermiamo. Ti arriverà anche la notifica WhatsApp di avvenuta richiesta.
                </p>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={closeRequestModal}
                    disabled={reqSubmitting}
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10 transition disabled:opacity-40"
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
                    onClick={submitRequest}
                    disabled={reqSubmitting}
                    className="flex-1 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-wait"
                  >
                    {reqSubmitting ? "Invio..." : "Invia richiesta"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Richiesta inviata!</h2>
                  <p className="mt-2 text-sm text-white/60">
                    Riceverai a breve una email con il link di pagamento non appena approveremo la tua richiesta.
                  </p>
                </div>
                <a
                  href={reqSuccess.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block w-full rounded-full bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-700 transition"
                >
                  Mandaci un avviso su WhatsApp
                </a>
                <button
                  type="button"
                  onClick={closeRequestModal}
                  className="mt-2 block w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10 transition"
                >
                  Chiudi
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
