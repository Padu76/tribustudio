// app/api/private-gym/slots/computed/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  computeAvailableSlots,
  buildWhatsAppRequestURL,
  utcISOToRomeKey,
  fetchCalendarEvents,
} from "@/lib/private-gym/slot-availability";
import { getSupabaseAdmin } from "@/lib/private-gym/supabase-admin";
import { env, isGoogleCalendarEnabled } from "@/lib/private-gym/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function todayRomeISO(): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

function addDaysISO(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  utc.setUTCDate(utc.getUTCDate() + days);
  return `${utc.getUTCFullYear()}-${pad2(utc.getUTCMonth() + 1)}-${pad2(utc.getUTCDate())}`;
}

function endTimeFromStart(startTime: string): string {
  const [h, m, s] = startTime.split(":").map(Number);
  const next = (h + 1) % 24;
  return `${next.toString().padStart(2, "0")}:${(m ?? 0).toString().padStart(2, "0")}:${(s ?? 0).toString().padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const from = url.searchParams.get("from") ?? todayRomeISO();
    const to = url.searchParams.get("to") ?? addDaysISO(from, 14);
    const debug = url.searchParams.get("debug") === "1";

    const supabase = getSupabaseAdmin();
    const bookedKeys = new Set<string>();
    const blockedKeys = new Set<string>();

    if (supabase) {
      const { data } = await supabase
        .from("tribu_private_gym_slots")
        .select("starts_at, ends_at, status")
        .in("status", ["booked", "blocked"]);

      for (const row of data ?? []) {
        if (!row.starts_at) continue;
        const start = utcISOToRomeKey(row.starts_at);
        const endTime = row.ends_at
          ? utcISOToRomeKey(row.ends_at).start_time
          : endTimeFromStart(start.start_time);
        const key = `${start.date}|${start.start_time}|${endTime}`;
        if (row.status === "booked") bookedKeys.add(key);
        if (row.status === "blocked") blockedKeys.add(key);
      }
    }

    // When debug=1, fetch events separately so we can surface counts + sample in the response
    // without exposing any sensitive data.
    const debugEvents = debug ? await fetchCalendarEvents(from, to) : null;

    const slots = await computeAvailableSlots({
      fromDateISO: from,
      toDateISO: to,
      bookedKeys,
    });

    const filtered = slots.filter((s) => {
      const key = `${s.date}|${s.start_time}|${s.end_time}`;
      return !blockedKeys.has(key);
    });

    const enriched = filtered.map((s) => ({
      ...s,
      whatsapp_url: s.status === "request-whatsapp" ? buildWhatsAppRequestURL(s) : undefined,
    }));

    const body: Record<string, unknown> = { slots: enriched };

    if (debug) {
      const emailMasked = env.GOOGLE_SERVICE_ACCOUNT_EMAIL
        ? env.GOOGLE_SERVICE_ACCOUNT_EMAIL.slice(0, 30) + "..."
        : null;
      body._debug = {
        calendar_enabled: isGoogleCalendarEnabled,
        calendar_id: env.GOOGLE_CALENDAR_ID,
        service_account_email: emailMasked,
        from,
        to,
        events_fetched: debugEvents?.length ?? null,
        events_classes: debugEvents?.filter((e) => e.isClass).length ?? null,
        events_pt: debugEvents?.filter((e) => !e.isClass).length ?? null,
        events_sample: debugEvents?.slice(0, 10).map((e) => ({
          summary: e.summary,
          starts_at_rome: e.starts_at_rome,
          ends_at_rome: e.ends_at_rome,
          isClass: e.isClass,
        })) ?? null,
      };
    }

    const response = NextResponse.json(body);
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("CDN-Cache-Control", "no-store");
    response.headers.set("Vercel-CDN-Cache-Control", "no-store");
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Errore imprevisto.";
    console.error("[/api/private-gym/slots/computed] error:", error);
    return NextResponse.json({ error: message, slots: [] }, { status: 500 });
  }
}
