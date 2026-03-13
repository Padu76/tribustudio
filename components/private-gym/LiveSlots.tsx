// components/private-gym/LiveSlots.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  format,
  parseISO,
  isAfter,
  startOfWeek,
  addDays,
  addWeeks,
  isSameDay,
  getHours,
  getMinutes,
  differenceInMinutes,
} from "date-fns";
import { it } from "date-fns/locale";

interface Slot {
  id: string;
  starts_at: string;
  ends_at: string;
  price_eur: number;
  status: string;
  capacity: number;
}

const HOUR_HEIGHT = 56; // px per ora
const START_HOUR = 6;
const END_HOUR = 22;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

const WEEKDAY_SHORT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

export default function LiveSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    fetch("/api/private-gym/slots", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const now = new Date();
        const futureSlots = (data.slots || []).filter((s: Slot) => {
          return isAfter(parseISO(s.ends_at), now);
        });
        setSlots(futureSlots);
      })
      .catch(() => setError("Errore nel caricamento degli slot"))
      .finally(() => setLoading(false));
  }, []);

  // Settimana corrente (lun-dom)
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

  // Slot della settimana corrente raggruppati per giorno
  const slotsByDay = useMemo(() => {
    const map: Record<number, Slot[]> = {};
    for (let i = 0; i < 7; i++) map[i] = [];
    for (const slot of slots) {
      const d = parseISO(slot.starts_at);
      for (let i = 0; i < 7; i++) {
        if (isSameDay(d, weekDays[i])) {
          map[i].push(slot);
          break;
        }
      }
    }
    return map;
  }, [slots, weekDays]);

  // Controlla se la settimana ha slot
  const weekHasSlots = useMemo(() => {
    return Object.values(slotsByDay).some((arr) => arr.length > 0);
  }, [slotsByDay]);

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
          Nuovi slot vengono pubblicati regolarmente. Torna a controllare!
        </p>
      </div>
    );
  }

  const today = new Date();

  return (
    <div>
      {/* Navigazione settimana */}
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

      {/* MOBILE: vista lista compatta */}
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
                      .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
                      .map((slot) => {
                        const startTime = format(parseISO(slot.starts_at), "HH:mm");
                        const endTime = format(parseISO(slot.ends_at), "HH:mm");
                        return (
                          <a
                            key={slot.id}
                            href={`/private-gym/booking?slot=${slot.id}`}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3 hover:border-orange-500/30 hover:bg-orange-500/5 transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-base font-semibold text-white">{startTime} — {endTime}</div>
                              <span className="text-xs text-white/50">{slot.price_eur}€</span>
                            </div>
                            <span className="rounded-full bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white">
                              Prenota
                            </span>
                          </a>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DESKTOP: vista calendario settimanale */}
      <div className="hidden lg:block">
        {/* Header giorni */}
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

        {/* Griglia oraria */}
        <div className="relative grid grid-cols-[48px_repeat(7,1fr)]" style={{ height: `${(END_HOUR - START_HOUR) * HOUR_HEIGHT}px` }}>
          {/* Righe orarie */}
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

          {/* Slot per ogni giorno */}
          {weekDays.map((day, dayIdx) => {
            const daySlots = slotsByDay[dayIdx];
            return daySlots.map((slot) => {
              const startDate = parseISO(slot.starts_at);
              const endDate = parseISO(slot.ends_at);
              const startHour = getHours(startDate) + getMinutes(startDate) / 60;
              const durationMin = differenceInMinutes(endDate, startDate);
              const top = (startHour - START_HOUR) * HOUR_HEIGHT;
              const height = (durationMin / 60) * HOUR_HEIGHT;
              const startLabel = format(startDate, "HH:mm");
              const endLabel = format(endDate, "HH:mm");

              // Posizione colonna: 48px label + colonna giorno
              const colStart = dayIdx + 2; // grid-cols parte da 1, +1 per la colonna label

              return (
                <a
                  key={slot.id}
                  href={`/private-gym/booking?slot=${slot.id}`}
                  className="absolute rounded-lg bg-orange-500/20 border border-orange-500/40 px-1.5 py-1 hover:bg-orange-500/30 hover:border-orange-500/60 transition cursor-pointer overflow-hidden group"
                  style={{
                    top: `${top}px`,
                    height: `${Math.max(height, 28)}px`,
                    gridColumn: `${colStart}`,
                    left: `calc(${((dayIdx) / 7) * 100}% + 48px + 2px)`,
                    width: `calc(${100 / 7}% - 4px)`,
                  }}
                  title={`${startLabel}-${endLabel} · ${slot.price_eur}€ · Clicca per prenotare`}
                >
                  <div className="text-[11px] font-bold text-orange-300 leading-tight">
                    {startLabel} - {endLabel}
                  </div>
                  {height >= 40 && (
                    <div className="text-[10px] text-orange-400/70 mt-0.5">
                      {slot.price_eur}€ · Prenota
                    </div>
                  )}
                  <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition rounded-lg" />
                </a>
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
    </div>
  );
}
