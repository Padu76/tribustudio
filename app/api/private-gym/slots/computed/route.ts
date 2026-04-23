// app/api/private-gym/slots/computed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
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

function normalizePrivateKey(raw: string): string {
  let k = raw.trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) {
    k = k.slice(1, -1).trim();
  }
  k = k.replace(/\\n/g, "\n");
  k = k.replace(/\r\n/g, "\n");
  return k;
}

async function deepDebug(): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {
    service_account_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? null,
    calendar_id_env: env.GOOGLE_CALENDAR_ID ?? null,
  };

  if (!env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    result.error = "Missing service account env vars";
    return result;
  }

  try {
    const auth = new google.auth.JWT({
      email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: normalizePrivateKey(env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY),
      scopes: [
        "https://www.googleapis.com/auth/calendar.readonly",
      ],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Step 1: list all calendars the service account can see
    try {
      const listRes = await calendar.calendarList.list({ maxResults: 50 });
      result.calendar_list = (listRes.data.items ?? []).map((c) => ({
        id: c.id,
        summary: c.summary,
        accessRole: c.accessRole,
        primary: c.primary,
      }));
      result.calendar_list_count = (listRes.data.items ?? []).length;
    } catch (err: unknown) {
      result.calendar_list_error = err instanceof Error ? err.message : String(err);
    }

    // Step 2: try to get the specific calendar by ID
    try {
      const getRes = await calendar.calendars.get({
        calendarId: env.GOOGLE_CALENDAR_ID ?? "primary",
      });
      result.calendar_get = {
        id: getRes.data.id,
        summary: getRes.data.summary,
        timeZone: getRes.data.timeZone,
      };
    } catch (err: unknown) {
      const errObj = err as { message?: string; code?: number; response?: { data?: unknown } };
      result.calendar_get_error = {
        message: errObj.message,
        code: errObj.code,
        response_data: errObj.response?.data,
      };
    }

    // Step 3: try events.list as the actual fetch would do
    try {
      const eventsRes = await calendar.events.list({
        calendarId: env.GOOGLE_CALENDAR_ID ?? "primary",
        timeMin: new Date().toISOString(),
        timeMax: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 10,
      });
      result.events_list_count = (eventsRes.data.items ?? []).length;
      result.events_list_sample = (eventsRes.data.items ?? []).slice(0, 5).map((e) => ({
        summary: e.summary,
        start: e.start,
        end: e.end,
      }));
    } catch (err: unknown) {
      const errObj = err as { message?: string; code?: number; response?: { data?: unknown } };
      result.events_list_error = {
        message: errObj.message,
        code: errObj.code,
        response_data: errObj.response?.data,
      };
    }
  } catch (err: unknown) {
    result.auth_error = err instanceof Error ? err.message : String(err);
  }

  return result;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const from = url.searchParams.get("from") ?? todayRomeISO();
    const to = url.searchParams.get("to") ?? addDaysISO(from, 14);
    const debug = url.searchParams.get("debug") === "1";
    const deep = url.searchParams.get("debug") === "deep";

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

    if (deep) {
      body._deep = await deepDebug();
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
