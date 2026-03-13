// components/private-gym/LiveSlots.tsx
"use client";

import { useEffect, useState } from "react";
import { format, parseISO, isAfter } from "date-fns";
import { it } from "date-fns/locale";

interface Slot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  price: number;
  status: string;
}

interface GroupedSlots {
  [dateKey: string]: Slot[];
}

export default function LiveSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // API route sotto /api/private-gym/slots
    fetch("/api/private-gym/slots", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const now = new Date();
        const futureSlots = (data.slots || []).filter((s: Slot) => {
          const slotDateTime = parseISO(`${s.date}T${s.end_time}`);
          return isAfter(slotDateTime, now);
        });
        setSlots(futureSlots);
      })
      .catch(() => setError("Errore nel caricamento degli slot"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-8 text-center text-sm text-red-400">{error}</p>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-white/70">
          Nessuno slot disponibile al momento
        </p>
        <p className="mt-2 text-sm text-white/50">
          Nuovi slot vengono pubblicati regolarmente. Torna a controllare!
        </p>
      </div>
    );
  }

  // Raggruppa per data
  const grouped: GroupedSlots = {};
  for (const slot of slots) {
    if (!grouped[slot.date]) grouped[slot.date] = [];
    grouped[slot.date].push(slot);
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([dateKey, dateSlots]) => {
        const dateObj = parseISO(dateKey);
        const dayLabel = format(dateObj, "EEEE d MMMM", { locale: it });

        return (
          <div key={dateKey}>
            <h4 className="mb-3 text-sm font-semibold capitalize text-orange-400">
              {dayLabel}
            </h4>
            <div className="space-y-3">
              {dateSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="mt-1 text-lg font-semibold">
                      {slot.start_time.slice(0, 5)} — {slot.end_time.slice(0, 5)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-sm text-white/70">
                      {slot.price}€
                    </span>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-400">
                      Disponibile
                    </span>
                    <a
                      href={`/private-gym/booking?slot=${slot.id}`}
                      className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      Prenota
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
