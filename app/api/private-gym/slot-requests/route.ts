// app/api/private-gym/slot-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/private-gym/supabase-admin";
import { sendAdminNewRequestNotification } from "@/lib/private-gym/email";
import { env } from "@/lib/private-gym/config";

export const dynamic = "force-dynamic";

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  customer_name: z.string().min(2).max(100),
  customer_phone: z.string().min(5).max(30),
  customer_email: z.string().email(),
});

function normalizeTime(t: string): string {
  return t.length === 5 ? `${t}:00` : t;
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function buildWhatsAppNotificationUrl(body: z.infer<typeof schema>): string {
  const [y, m, d] = body.date.split("-").map(Number);
  const dateLabel = `${pad2(d)}/${pad2(m)}/${y}`;
  const timeLabel = `${body.start_time.slice(0, 5)}-${body.end_time.slice(0, 5)}`;
  const message =
    `Ciao Tribù, sono ${body.customer_name} (${body.customer_phone}).\n` +
    `Ho richiesto uno slot Private Gym per il ${dateLabel} alle ${timeLabel}.\n` +
    `Email: ${body.customer_email}\n` +
    `Attendo conferma via mail, grazie!`;
  return `https://wa.me/393478881515?text=${encodeURIComponent(message)}`;
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

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const body = schema.parse(raw);

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Database non configurato." }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("tribu_slot_requests")
      .insert({
        slot_date: body.date,
        slot_start_time: normalizeTime(body.start_time),
        slot_end_time: normalizeTime(body.end_time),
        customer_name: body.customer_name.trim(),
        customer_phone: body.customer_phone.trim(),
        customer_email: body.customer_email.trim().toLowerCase(),
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[/api/private-gym/slot-requests] insert error:", error);
      return NextResponse.json(
        { error: error?.message ?? "Errore creazione richiesta." },
        { status: 500 }
      );
    }

    const whatsappUrl = buildWhatsAppNotificationUrl(body);

    // Fire-and-forget admin notification email (don't block response)
    const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://www.tribustudio.it";
    const adminUrl = `${siteUrl}/private-gym/tribu-admin`;
    const dateLabel = formatItalianDate(body.date);
    const timeLabel = `${body.start_time.slice(0, 5)}-${body.end_time.slice(0, 5)}`;

    sendAdminNewRequestNotification({
      customerName: body.customer_name.trim(),
      customerPhone: body.customer_phone.trim(),
      customerEmail: body.customer_email.trim().toLowerCase(),
      dateLabel,
      timeLabel,
      adminUrl,
    }).catch((e) => {
      console.error("[slot-requests] admin notification error:", e);
    });

    return NextResponse.json({
      id: data.id,
      whatsapp_url: whatsappUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore imprevisto.";
    console.error("[/api/private-gym/slot-requests] error:", err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
