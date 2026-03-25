// app/private-gym/tribu-admin/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Slot = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  price_eur: number;
  capacity: number;
};

// Genera opzioni orario: ore piene e mezz'ore (06:00 - 23:30)
const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 23; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:00`);
  if (h < 23) TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:30`);
}
TIME_OPTIONS.push("23:30");

const WEEKDAYS_IT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const MONTHS_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

function formatDateLong(dateStr: string) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateKey(dateStr: string) {
  // Converte in ora locale italiana (CET/CEST) per evitare discrepanze UTC
  const d = new Date(dateStr);
  const parts = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Rome" }).format(d);
  return parts; // formato YYYY-MM-DD
}

function toYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Calendario visuale
function Calendar({
  selected,
  onSelect,
  slotDates,
}: {
  selected: string;
  onSelect: (d: string) => void;
  slotDates: Record<string, number>;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  // lunedi = 0
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayStr = toYMD(today);

  function prev() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }
  function next() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prev} className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="text-lg font-semibold text-white">
          {MONTHS_IT[viewMonth]} {viewYear}
        </div>
        <button onClick={next} className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-white/50">
        {WEEKDAYS_IT.map((w) => (
          <div key={w} className="py-1">{w}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSelected = dateStr === selected;
          const isToday = dateStr === todayStr;
          const isPast = dateStr < todayStr;
          const slotCount = slotDates[dateStr] || 0;

          return (
            <button
              key={dateStr}
              onClick={() => !isPast && onSelect(dateStr)}
              disabled={isPast}
              className={`relative flex h-10 items-center justify-center rounded-xl text-sm font-medium transition ${
                isPast
                  ? "cursor-not-allowed text-white/20"
                  : isSelected
                  ? "bg-orange-500 text-white"
                  : isToday
                  ? "border border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              {day}
              {slotCount > 0 && (
                <span className={`absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                  isSelected ? "bg-white text-orange-500" : "bg-orange-500 text-white"
                }`}>
                  {slotCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TribuAdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("tribu-admin-key");
    if (saved) {
      setAdminKey(saved);
      setIsUnlocked(true);
    }
  }, []);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("13:00");
  const [endTime, setEndTime] = useState("14:00");
  const [price, setPrice] = useState("25");

  // Quando cambia startTime, aggiorna endTime a +1h
  function handleStartChange(val: string) {
    setStartTime(val);
    const [h, m] = val.split(":").map(Number);
    const endH = h + 1;
    if (endH <= 23) {
      setEndTime(`${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }

  async function loadSlots() {
    if (!adminKey) return;
    setLoading(true);

    const res = await fetch("/api/private-gym/admin/slots", {
      headers: { "x-admin-key": adminKey },
    });

    const data = await res.json();
    setSlots(data.slots || []);
    setLoading(false);
  }

  async function createSlot() {
    if (!date || !startTime || !endTime) {
      alert("Seleziona data e orari dal calendario.");
      return;
    }

    if (startTime >= endTime) {
      alert("L'ora di fine deve essere dopo l'ora di inizio.");
      return;
    }

    // Calcola offset locale del browser per gestire CET/CEST automaticamente
    // Questo evita che Supabase/Vercel interpretino l'orario in UTC
    const localStart = new Date(`${date}T${startTime}:00`);
    const localEnd = new Date(`${date}T${endTime}:00`);
    const offsetMin = localStart.getTimezoneOffset(); // es. -60 per CET, -120 per CEST
    const sign = offsetMin <= 0 ? "+" : "-";
    const absH = String(Math.floor(Math.abs(offsetMin) / 60)).padStart(2, "0");
    const absM = String(Math.abs(offsetMin) % 60).padStart(2, "0");
    const tz = `${sign}${absH}:${absM}`;
    const starts_at = `${date}T${startTime}:00${tz}`;
    const ends_at = `${date}T${endTime}:00${tz}`;
    // Verifica: il browser deve mostrare lo stesso giorno/ora che l'admin ha scelto
    console.log("[Admin] Creazione slot:", { date, startTime, endTime, tz, starts_at, ends_at, localStart: localStart.toISOString(), localEnd: localEnd.toISOString() });

    const res = await fetch("/api/private-gym/admin/slots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({
        starts_at,
        ends_at,
        price_eur: Number(price),
        status: "available",
        capacity: 1,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Errore nella creazione slot");
      return;
    }

    setDate("");
    setStartTime("13:00");
    setEndTime("14:00");
    setPrice("25");
    loadSlots();
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/private-gym/admin/slots/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Errore aggiornamento");
      return;
    }
    loadSlots();
  }

  async function deleteSlot(id: string) {
    const ok = window.confirm("Eliminare questo slot?");
    if (!ok) return;

    const res = await fetch(`/api/private-gym/admin/slots/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Errore eliminazione");
      return;
    }
    loadSlots();
  }

  useEffect(() => {
    if (isUnlocked) loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnlocked]);

  // Conta slot per data (per badge calendario)
  const slotDates = useMemo(() => {
    const map: Record<string, number> = {};
    for (const slot of slots) {
      const key = getDateKey(slot.starts_at);
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }, [slots]);

  // Slot raggruppati per data
  const groupedSlots = useMemo(() => {
    const map: Record<string, Slot[]> = {};
    for (const slot of slots) {
      const key = getDateKey(slot.starts_at);
      if (!map[key]) map[key] = [];
      map[key].push(slot);
    }
    return map;
  }, [slots]);

  // Filtra slot del giorno selezionato (se selezionato)
  const filteredGrouped = useMemo(() => {
    if (!date) return groupedSlots;
    const daySlots = groupedSlots[date];
    if (!daySlots) return {};
    return { [date]: daySlots };
  }, [date, groupedSlots]);

  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-12 text-white">
        <div className="mx-auto max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-bold text-white">Tribu Admin</h1>
          <p className="mt-3 text-white/70">
            Inserisci la chiave admin per gestire gli slot prenotabili.
          </p>

          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && adminKey) {
                sessionStorage.setItem("tribu-admin-key", adminKey);
                setIsUnlocked(true);
              }
            }}
            placeholder="Chiave admin"
            className="mt-6 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/30"
          />

          <button
            onClick={() => {
              if (!adminKey) {
                alert("Inserisci la chiave admin");
                return;
              }
              sessionStorage.setItem("tribu-admin-key", adminKey);
              setIsUnlocked(true);
            }}
            className="mt-4 w-full rounded-full bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Entra
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
              Pannello admin
            </div>
            <h1 className="mt-4 text-4xl font-bold text-white">Gestione slot</h1>
            <p className="mt-2 text-sm text-white/50">
              Crea slot &rarr; visibili sul sito &rarr; acquisto PayPal &rarr; evento su Google Calendar
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/private-gym#calendario"
              className="rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-sm font-semibold text-orange-400 hover:bg-orange-500/20"
            >
              Vedi sul sito
            </a>
            <button
              onClick={loadSlots}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Aggiorna
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("tribu-admin-key");
                setAdminKey("");
                setIsUnlocked(false);
                setSlots([]);
              }}
              className="rounded-full border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/20"
            >
              Esci
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Colonna sinistra: Calendario + Form */}
          <div className="space-y-6">
            {/* Calendario */}
            <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-lg font-bold text-white">Seleziona giorno</h2>
              <Calendar selected={date} onSelect={setDate} slotDates={slotDates} />
            </section>

            {/* Form creazione slot */}
            <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-bold text-white">Nuovo slot</h2>

              {date ? (
                <p className="mt-1 text-sm text-orange-400 capitalize">
                  {formatDateLong(date)}
                </p>
              ) : (
                <p className="mt-1 text-sm text-white/40">
                  Seleziona un giorno dal calendario
                </p>
              )}

              <div className="mt-5 grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">Inizio</label>
                    <select
                      value={startTime}
                      onChange={(e) => handleStartChange(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">Fine</label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none"
                    >
                      {TIME_OPTIONS.filter((t) => t > startTime).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/60">Prezzo (€)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <button
                  onClick={createSlot}
                  disabled={!date}
                  className="mt-1 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Apri slot
                </button>
              </div>
            </section>
          </div>

          {/* Colonna destra: Slot creati */}
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {date ? `Slot del ${formatDateLong(date)}` : "Tutti gli slot"}
              </h2>
              {date && (
                <button
                  onClick={() => setDate("")}
                  className="text-xs text-white/40 hover:text-white/70"
                >
                  Mostra tutti
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-12 text-center text-white/40">Caricamento...</div>
            ) : Object.keys(filteredGrouped).length === 0 ? (
              <div className="py-12 text-center text-white/40">
                {date ? "Nessuno slot per questa data." : "Nessuno slot creato."}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(filteredGrouped)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([dateKey, daySlots]) => (
                  <div key={dateKey}>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-orange-400/80">
                      {formatDateLong(dateKey)}
                    </h3>

                    <div className="space-y-2">
                      {daySlots
                        .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
                        .map((slot) => {
                        const isBooked = slot.status === "booked";
                        const isBlocked = slot.status === "blocked";
                        const isAvailable = slot.status === "available";

                        return (
                          <div
                            key={slot.id}
                            className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                              isBooked
                                ? "border-emerald-500/40 bg-emerald-500/10"
                                : isBlocked
                                ? "border-yellow-500/30 bg-yellow-500/5"
                                : "border-white/10 bg-black/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-base font-semibold text-white">
                                {formatTime(slot.starts_at)} — {formatTime(slot.ends_at)}
                              </div>
                              <div className="text-xs text-white/40">{slot.price_eur}€</div>
                              {isBooked && (
                                <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                  Prenotato
                                </span>
                              )}
                              {isBlocked && (
                                <span className="rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yellow-400">
                                  Bloccato
                                </span>
                              )}
                              {isAvailable && (
                                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                                  Disponibile
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {!isAvailable && (
                                <button
                                  onClick={() => updateStatus(slot.id, "available")}
                                  className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                >
                                  Attiva
                                </button>
                              )}
                              {!isBlocked && !isBooked && (
                                <button
                                  onClick={() => updateStatus(slot.id, "blocked")}
                                  className="rounded-full bg-yellow-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-yellow-700"
                                >
                                  Blocca
                                </button>
                              )}
                              {!isBooked && (
                                <button
                                  onClick={() => deleteSlot(slot.id)}
                                  className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                >
                                  Elimina
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
