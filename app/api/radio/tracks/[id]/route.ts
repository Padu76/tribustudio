// app/api/radio/tracks/[id]/route.ts
// API per gestione singola traccia: DELETE e PATCH (cambio canale)

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

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase URL o Service Role Key mancanti");
  }
  return createClient(url, serviceKey);
}

// DELETE /api/radio/tracks/[id] — Elimina traccia (soft delete: is_published = false)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getAdminSupabase();

  // Soft delete: imposta is_published = false
  const { error } = await supabase
    .from("tribu_radio_tracks")
    .update({ is_published: false })
    .eq("id", id);

  if (error) {
    console.error("[Tracks] Delete error:", error);
    return NextResponse.json(
      { error: `Eliminazione fallita: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, id });
}

// PATCH /api/radio/tracks/[id] — Aggiorna canale traccia
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { channel } = body;

  if (!channel || !VALID_CHANNELS.includes(channel)) {
    return NextResponse.json(
      { error: `Canale non valido. Usa: ${VALID_CHANNELS.join(", ")}` },
      { status: 400 }
    );
  }

  const supabase = getAdminSupabase();

  const { data, error } = await supabase
    .from("tribu_radio_tracks")
    .update({ channel })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[Tracks] Update error:", error);
    return NextResponse.json(
      { error: `Aggiornamento fallito: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, track: data });
}
