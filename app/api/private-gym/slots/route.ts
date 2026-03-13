// app/api/private-gym/slots/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/private-gym/supabase-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ slots: [], debug: { mode: "no-supabase" } });
    }

    const { data, error } = await supabase
      .from("tribu_private_gym_slots")
      .select("*")
      .eq("status", "available")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message, slots: [] },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      slots: data ?? [],
      debug: {
        count: data?.length ?? 0,
        ts: Date.now(),
      },
    });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("CDN-Cache-Control", "no-store");
    response.headers.set("Vercel-CDN-Cache-Control", "no-store");
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Errore imprevisto.";
    return NextResponse.json(
      { error: message, slots: [] },
      { status: 500 }
    );
  }
}
