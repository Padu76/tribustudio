// app/api/private-gym/admin/slot-requests/[id]/authorize/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/private-gym/supabase-admin";
import { romeLocalToUtcISO } from "@/lib/private-gym/slot-availability";
import { env } from "@/lib/private-gym/config";
import { sendSlotRequestApprovedEmail } from "@/lib/private-gym/email";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_ACCESS_KEY;
}

function formatItalianDate(dateISO: string): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  const fmt = new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return fmt.format(date);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase non configurato" }, { status: 500 });
    }

    const { data: request, error: loadErr } = await supabase
      .from("tribu_slot_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (loadErr || !request) {
      return NextResponse.json(
        { error: "Richiesta non trovata" },
        { status: 404 }
      );
    }

    if (request.status !== "pending") {
      return NextResponse.json(
        { error: `Richiesta già ${request.status}` },
        { status: 400 }
      );
    }

    const startsAtUtc = romeLocalToUtcISO(
      request.slot_date,
      request.slot_start_time
    );
    const endsAtUtc = romeLocalToUtcISO(
      request.slot_date,
      request.slot_end_time
    );

    const existing = await supabase
      .from("tribu_private_gym_slots")
      .select("id, status")
      .eq("starts_at", startsAtUtc)
      .eq("ends_at", endsAtUtc)
      .maybeSingle();

    let slotId: string;

    if (existing.data?.id) {
      if (existing.data.status === "booked") {
        return NextResponse.json(
          { error: "Slot già prenotato da un altro cliente." },
          { status: 409 }
        );
      }
      slotId = existing.data.id;
    } else {
      const price = Number(env.NEXT_PUBLIC_DEFAULT_PRICE_EUR) || 25;
      const { data: newSlot, error: insertErr } = await supabase
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

      if (insertErr || !newSlot) {
        console.error("[authorize] insert slot error:", insertErr);
        return NextResponse.json(
          { error: insertErr?.message ?? "Errore creazione slot." },
          { status: 500 }
        );
      }
      slotId = newSlot.id;
    }

    const { error: updateErr } = await supabase
      .from("tribu_slot_requests")
      .update({
        status: "authorized",
        booking_slot_id: slotId,
        authorized_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateErr) {
      console.error("[authorize] update request error:", updateErr);
    }

    const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://www.tribustudio.it";
    const bookingUrl = `${siteUrl}/private-gym/booking?slot=${slotId}`;

    const dateLabel = formatItalianDate(request.slot_date);
    const timeLabel = `${request.slot_start_time.slice(0, 5)}-${request.slot_end_time.slice(0, 5)}`;

    const emailResult = await sendSlotRequestApprovedEmail({
      to: request.customer_email,
      fullName: request.customer_name,
      dateLabel,
      timeLabel,
      bookingUrl,
    });

    return NextResponse.json({
      ok: true,
      slot_id: slotId,
      booking_url: bookingUrl,
      email_provider: emailResult.provider,
      email_message_id: emailResult.messageId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Errore imprevisto.";
    console.error("[/api/private-gym/admin/slot-requests/authorize] error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
