// app/api/private-gym/slots/reserve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/private-gym/supabase-admin";
import {
  computeAvailableSlots,
  romeLocalToUtcISO,
} from "@/lib/private-gym/slot-availability";
import { env } from "@/lib/private-gym/config";

export const dynamic = "force-dynamic";

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
});

function normalizeTime(t: string): string {
  return t.length === 5 ? `${t}:00` : t;
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const date = body.date;
    const startTime = normalizeTime(body.start_time);
    const endTime = normalizeTime(body.end_time);

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Database non configurato." }, { status: 500 });
    }

    const computed = await computeAvailableSlots({ fromDateISO: date, toDateISO: date });
    const match = computed.find(
      (s) => s.start_time === startTime && s.end_time === endTime && s.status === "available"
    );
    if (!match) {
      return NextResponse.json(
        { error: "Slot non più disponibile. Aggiorna la pagina e riprova." },
        { status: 400 }
      );
    }

    const startsAtUtc = romeLocalToUtcISO(date, startTime);
    const endsAtUtc = romeLocalToUtcISO(date, endTime);

    const existing = await supabase
      .from("tribu_private_gym_slots")
      .select("id, status")
      .eq("starts_at", startsAtUtc)
      .eq("ends_at", endsAtUtc)
      .maybeSingle();

    if (existing.data?.id) {
      if (existing.data.status === "booked") {
        return NextResponse.json({ error: "Slot già prenotato." }, { status: 400 });
      }
      if (existing.data.status === "blocked") {
        return NextResponse.json({ error: "Slot non disponibile." }, { status: 400 });
      }
      return NextResponse.json({ id: existing.data.id });
    }

    const price = Number(env.NEXT_PUBLIC_DEFAULT_PRICE_EUR) || 25;
    const { data, error } = await supabase
      .from("tribu_private_gym_slots")
      .insert({
        starts_at: startsAtUtc,
        ends_at: endsAtUtc,
        price_eur: price,
        status: "available",
        capacity: 1,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[/api/private-gym/slots/reserve] insert error:", error);
      return NextResponse.json(
        { error: error?.message ?? "Errore creazione slot." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Errore imprevisto.";
    console.error("[/api/private-gym/slots/reserve] error:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
