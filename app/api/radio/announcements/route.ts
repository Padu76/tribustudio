// app/api/radio/announcements/route.ts
// GET /api/radio/announcements?channel=gym-energy
// Restituisce annunci DJ per il canale specificato

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { RadioChannel } from "@/lib/radio/types";

const VALID_CHANNELS: RadioChannel[] = [
  "gym-energy",
  "coffee-chill",
  "beauty-relax",
  "lounge-bar",
  "retail-background",
];

export async function GET(req: NextRequest) {
  const channel = req.nextUrl.searchParams.get("channel") as RadioChannel;

  if (!channel || !VALID_CHANNELS.includes(channel)) {
    return NextResponse.json(
      { error: "Canale non valido" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("tribu_radio_announcements")
    .select("id, channel, text, file_url, duration_sec")
    .eq("channel", channel)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ announcements: data ?? [], channel });
}
