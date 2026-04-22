// lib/private-gym/slot-availability.ts
import { google } from "googleapis";
import { env, isGoogleCalendarEnabled } from "@/lib/private-gym/config";

export type ComputedSlotStatus = "available" | "request-whatsapp" | "booked";

export type ComputedSlot = {
  date: string;
  start_time: string;
  end_time: string;
  starts_at_rome: string;
  ends_at_rome: string;
  status: ComputedSlotStatus;
  price: number;
  coverage?: "during" | "contiguous" | "class-contiguous";
};

export type CalendarEventLite = {
  id: string;
  summary: string;
  starts_at_rome: string;
  ends_at_rome: string;
  isClass: boolean;
};

const DEFAULT_CLASS_KEYWORDS = ["MINICLASS", "POSTURALE", "STRAFIT", "CLASSE"];

const DEFAULT_OPENING_HOURS: Record<number, { start: number; end: number } | null> = {
  0: null,
  1: { start: 8, end: 20 },
  2: { start: 8, end: 20 },
  3: { start: 8, end: 20 },
  4: { start: 8, end: 20 },
  5: { start: 8, end: 20 },
  6: { start: 9, end: 13 },
};

const DEFAULT_BLACKLIST: Array<{ weekday: number; start: number; end: number }> = [
  { weekday: 3, start: 18, end: 19 },
  { weekday: 4, start: 13, end: 14 },
];

const CONTIGUOUS_WINDOW_MS = 60 * 60 * 1000;

function getClassKeywords(): string[] {
  const raw = env.CALENDAR_CLASS_KEYWORDS;
  if (!raw) return DEFAULT_CLASS_KEYWORDS;
  return raw
    .split(",")
    .map((k) => k.trim().toUpperCase())
    .filter(Boolean);
}

function isClassSummary(summary: string | null | undefined, keywords: string[]): boolean {
  if (!summary) return false;
  const upper = summary.toUpperCase();
  return keywords.some((kw) => upper.includes(kw));
}

export function toRomeISO(utcDate: Date): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(utcDate);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}:${get("second")}`;
}

export function romeISOToMs(iso: string): number {
  const [datePart, timePart] = iso.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [h, mi, s] = timePart.split(":").map(Number);
  const utcGuess = Date.UTC(y, m - 1, d, h, mi, s);
  const asRome = toRomeISO(new Date(utcGuess));
  const [, asRomeTime] = asRome.split("T");
  const [rh] = asRomeTime.split(":").map(Number);
  const diffHours = h - rh;
  return utcGuess + diffHours * 60 * 60 * 1000;
}

export function romeLocalToUtcISO(date: string, time: string): string {
  const normalized = time.length === 5 ? `${time}:00` : time;
  const ms = romeISOToMs(`${date}T${normalized}`);
  return new Date(ms).toISOString();
}

export function utcISOToRomeKey(utcISO: string): {
  date: string;
  start_time: string;
} {
  const rome = toRomeISO(new Date(utcISO));
  const [date, time] = rome.split("T");
  return { date, start_time: time };
}

function weekdayRome(dateISO: string): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  const utcNoon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    weekday: "short",
  });
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[fmt.format(utcNoon)] ?? 0;
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function addDaysISO(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  utc.setUTCDate(utc.getUTCDate() + days);
  return `${utc.getUTCFullYear()}-${pad2(utc.getUTCMonth() + 1)}-${pad2(utc.getUTCDate())}`;
}

function todayRomeISO(): string {
  return toRomeISO(new Date()).split("T")[0];
}

export async function fetchCalendarEvents(
  fromDateISO: string,
  toDateISO: string
): Promise<CalendarEventLite[]> {
  if (!isGoogleCalendarEnabled || !env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    return [];
  }

  const auth = new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });

  const calendar = google.calendar({ version: "v3", auth });

  const timeMin = new Date(romeISOToMs(`${fromDateISO}T00:00:00`)).toISOString();
  const timeMax = new Date(romeISOToMs(`${addDaysISO(toDateISO, 1)}T00:00:00`)).toISOString();

  const response = await calendar.events.list({
    calendarId: env.GOOGLE_CALENDAR_ID,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 500,
  });

  const keywords = getClassKeywords();
  const items = response.data.items ?? [];
  const result: CalendarEventLite[] = [];

  for (const ev of items) {
    const startISO = ev.start?.dateTime ?? ev.start?.date;
    const endISO = ev.end?.dateTime ?? ev.end?.date;
    if (!startISO || !endISO) continue;

    const startRome = toRomeISO(new Date(startISO));
    const endRome = toRomeISO(new Date(endISO));

    result.push({
      id: ev.id ?? "",
      summary: ev.summary ?? "",
      starts_at_rome: startRome,
      ends_at_rome: endRome,
      isClass: isClassSummary(ev.summary, keywords),
    });
  }

  return result;
}

function isBlacklisted(dateISO: string, hour: number): boolean {
  const wd = weekdayRome(dateISO);
  return DEFAULT_BLACKLIST.some((b) => b.weekday === wd && hour >= b.start && hour < b.end);
}

function buildCandidateSlots(fromDateISO: string, toDateISO: string): Array<{
  date: string;
  start_time: string;
  end_time: string;
  starts_at_rome: string;
  ends_at_rome: string;
}> {
  const candidates: Array<{
    date: string;
    start_time: string;
    end_time: string;
    starts_at_rome: string;
    ends_at_rome: string;
  }> = [];

  let currentDate = fromDateISO;
  const guard = 60;
  let i = 0;
  while (currentDate <= toDateISO && i < guard) {
    const wd = weekdayRome(currentDate);
    const opening = DEFAULT_OPENING_HOURS[wd];
    if (opening) {
      for (let h = opening.start; h < opening.end; h++) {
        if (isBlacklisted(currentDate, h)) continue;
        const startTime = `${pad2(h)}:00:00`;
        const endTime = `${pad2(h + 1)}:00:00`;
        candidates.push({
          date: currentDate,
          start_time: startTime,
          end_time: endTime,
          starts_at_rome: `${currentDate}T${startTime}`,
          ends_at_rome: `${currentDate}T${endTime}`,
        });
      }
    }
    currentDate = addDaysISO(currentDate, 1);
    i++;
  }
  return candidates;
}

function intervalsOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function contiguousWithin(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  const aStartMs = romeISOToMs(aStart);
  const aEndMs = romeISOToMs(aEnd);
  const bStartMs = romeISOToMs(bStart);
  const bEndMs = romeISOToMs(bEnd);
  const windowStart = bStartMs - CONTIGUOUS_WINDOW_MS;
  const windowEnd = bEndMs + CONTIGUOUS_WINDOW_MS;
  return aStartMs >= windowStart && aEndMs <= windowEnd;
}

export type ComputeOptions = {
  fromDateISO?: string;
  toDateISO?: string;
  bookedKeys?: Set<string>;
  price?: number;
};

export async function computeAvailableSlots(options: ComputeOptions = {}): Promise<ComputedSlot[]> {
  const fromDateISO = options.fromDateISO ?? todayRomeISO();
  const toDateISO = options.toDateISO ?? addDaysISO(fromDateISO, 14);
  const price = options.price ?? Number(env.NEXT_PUBLIC_DEFAULT_PRICE_EUR) ?? 25;

  const events = await fetchCalendarEvents(fromDateISO, toDateISO);
  const classEvents = events.filter((e) => e.isClass);
  const ptEvents = events.filter((e) => !e.isClass);

  const candidates = buildCandidateSlots(fromDateISO, toDateISO);
  const nowRome = toRomeISO(new Date());
  const bookedKeys = options.bookedKeys ?? new Set<string>();

  const result: ComputedSlot[] = [];

  for (const c of candidates) {
    if (c.ends_at_rome <= nowRome) continue;

    const key = `${c.date}|${c.start_time}|${c.end_time}`;
    if (bookedKeys.has(key)) {
      result.push({
        date: c.date,
        start_time: c.start_time,
        end_time: c.end_time,
        starts_at_rome: c.starts_at_rome,
        ends_at_rome: c.ends_at_rome,
        status: "booked",
        price,
      });
      continue;
    }

    const overlapsClass = classEvents.some((e) =>
      intervalsOverlap(c.starts_at_rome, c.ends_at_rome, e.starts_at_rome, e.ends_at_rome)
    );
    if (overlapsClass) {
      continue;
    }

    const overlapsPT = ptEvents.some((e) =>
      intervalsOverlap(c.starts_at_rome, c.ends_at_rome, e.starts_at_rome, e.ends_at_rome)
    );

    const contiguousPT = ptEvents.some((e) =>
      contiguousWithin(c.starts_at_rome, c.ends_at_rome, e.starts_at_rome, e.ends_at_rome)
    );

    const contiguousClass = classEvents.some((e) =>
      contiguousWithin(c.starts_at_rome, c.ends_at_rome, e.starts_at_rome, e.ends_at_rome)
    );

    let status: ComputedSlotStatus = "request-whatsapp";
    let coverage: ComputedSlot["coverage"] | undefined;

    if (overlapsPT) {
      status = "available";
      coverage = "during";
    } else if (contiguousPT) {
      status = "available";
      coverage = "contiguous";
    } else if (contiguousClass) {
      status = "available";
      coverage = "class-contiguous";
    }

    result.push({
      date: c.date,
      start_time: c.start_time,
      end_time: c.end_time,
      starts_at_rome: c.starts_at_rome,
      ends_at_rome: c.ends_at_rome,
      status,
      price,
      coverage,
    });
  }

  return result;
}

export function buildWhatsAppRequestURL(slot: {
  date: string;
  start_time: string;
  end_time: string;
}): string {
  const [y, m, d] = slot.date.split("-").map(Number);
  const dateLabel = `${pad2(d)}/${pad2(m)}/${y}`;
  const timeLabel = `${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`;
  const message = `Ciao Tribù, vorrei richiedere uno slot Private Gym per il ${dateLabel} alle ${timeLabel}. Grazie!`;
  return `https://wa.me/393478881515?text=${encodeURIComponent(message)}`;
}
