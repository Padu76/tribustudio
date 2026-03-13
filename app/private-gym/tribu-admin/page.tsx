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

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateKey(dateStr: string) {
  return new Date(dateStr).toISOString().slice(0, 10);
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

  async function loadSlots() {
    if (!adminKey) return;
    setLoading(true);

    const res = await fetch("/api/private-gym/admin/slots", {
      headers: {
        "x-admin-key": adminKey,
      },
    });

    const data = await res.json();
    setSlots(data.slots || []);
    setLoading(false);
  }

  async function createSlot() {
    if (!date || !startTime || !endTime) {
      alert("Compila data, ora inizio e ora fine.");
      return;
    }

    const starts_at = `${date}T${startTime}:00`;
    const ends_at = `${date}T${endTime}:00`;

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
      headers: {
        "x-admin-key": adminKey,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Errore eliminazione");
      return;
    }

    loadSlots();
  }

  useEffect(() => {
    if (isUnlocked) {
      loadSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnlocked]);

  const groupedSlots = useMemo(() => {
    const map: Record<string, Slot[]> = {};
    for (const slot of slots) {
      const key = getDateKey(slot.starts_at);
      if (!map[key]) map[key] = [];
      map[key].push(slot);
    }
    return map;
  }, [slots]);

  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-12 text-white">
        <div className="mx-auto max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-bold text-white">Tribù Admin</h1>
          <p className="mt-3 text-white/70">
            Inserisci la chiave admin per gestire gli slot prenotabili.
          </p>

          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Chiave admin"
            className="mt-6 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
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
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
              Pannello admin
            </div>
            <h1 className="mt-4 text-4xl font-bold text-white">Gestione slot Tribù Private Gym</h1>
            <p className="mt-3 text-white/70">
              Apri, chiudi o elimina gli slot senza entrare in Supabase.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadSlots}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Aggiorna elenco
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

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">Apri nuovo slot</h2>
            <p className="mt-2 text-white/70">
              Scegli data e orario. Lo slot comparirà sul sito.
            </p>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="mb-2 block text-sm text-white/70">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/70">Ora inizio</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">Ora fine</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Prezzo (€)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                />
              </div>

              <button
                onClick={createSlot}
                className="mt-2 rounded-full bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
              >
                Apri slot
              </button>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">Slot creati</h2>
            <p className="mt-2 text-white/70">
              Qui vedi tutti gli slot. Puoi bloccarli, riattivarli o eliminarli.
            </p>

            {loading ? (
              <div className="mt-6 text-white/60">Caricamento...</div>
            ) : Object.keys(groupedSlots).length === 0 ? (
              <div className="mt-6 text-white/60">Nessuno slot creato.</div>
            ) : (
              <div className="mt-6 space-y-6">
                {Object.entries(groupedSlots).map(([dateKey, daySlots]) => (
                  <div key={dateKey}>
                    <h3 className="mb-3 text-lg font-semibold capitalize text-white">
                      {formatDate(dateKey)}
                    </h3>

                    <div className="space-y-3">
                      {daySlots.map((slot) => {
                        const isBooked = slot.status === "booked";
                        const isBlocked = slot.status === "blocked";
                        const isAvailable = slot.status === "available";

                        return (
                        <div
                          key={slot.id}
                          className={`flex flex-col gap-4 rounded-2xl border p-4 lg:flex-row lg:items-center lg:justify-between ${
                            isBooked
                              ? "border-emerald-500/40 bg-emerald-500/10"
                              : isBlocked
                              ? "border-yellow-500/30 bg-yellow-500/5"
                              : "border-white/10 bg-black/30"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-3">
                              <div className="text-lg font-semibold text-white">
                                {formatTime(slot.starts_at)} — {formatTime(slot.ends_at)}
                              </div>
                              {isBooked && (
                                <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                                  ✓ Prenotato
                                </span>
                              )}
                              {isBlocked && (
                                <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow-400">
                                  Bloccato
                                </span>
                              )}
                              {isAvailable && (
                                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/50">
                                  Disponibile
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-sm text-white/55">
                              Prezzo: {slot.price_eur}€
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {!isAvailable && (
                              <button
                                onClick={() => updateStatus(slot.id, "available")}
                                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                              >
                                Attiva
                              </button>
                            )}

                            {!isBlocked && !isBooked && (
                              <button
                                onClick={() => updateStatus(slot.id, "blocked")}
                                className="rounded-full bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
                              >
                                Blocca
                              </button>
                            )}

                            {!isBooked && (
                              <button
                                onClick={() => deleteSlot(slot.id)}
                                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
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
