// app/api/radio/generate/route.ts
// API per generare tracce musicali via ElevenLabs e salvarle su Supabase
// POST /api/radio/generate

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateTrack } from "@/lib/radio/elevenlabs";
import { RadioChannel } from "@/lib/radio/types";

const VALID_CHANNELS: RadioChannel[] = [
  "gym-energy",
  "coffee-chill",
  "beauty-relax",
  "lounge-bar",
  "retail-background",
];

// Client Supabase con service role per operazioni admin (storage + insert)
function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase URL o Service Role Key mancanti");
  }
  return createClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  try {
    // Protezione semplice via header (in produzione usare auth robusta)
    const authHeader = request.headers.get("x-admin-key");
    if (authHeader !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const body = await request.json();
    const {
      channel,
      count = 1,
      duration_ms = 180_000,
      force_instrumental = false,
    } = body;

    // Validazione
    if (!channel || !VALID_CHANNELS.includes(channel)) {
      return NextResponse.json(
        { error: `Canale non valido. Usa: ${VALID_CHANNELS.join(", ")}` },
        { status: 400 }
      );
    }

    if (count < 1 || count > 5) {
      return NextResponse.json(
        { error: "count deve essere tra 1 e 5" },
        { status: 400 }
      );
    }

    if (duration_ms < 3000 || duration_ms > 600_000) {
      return NextResponse.json(
        { error: "duration_ms deve essere tra 3000 e 600000 (3s - 10min)" },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();
    const results = [];

    for (let i = 0; i < count; i++) {
      console.log(`[Generate] Traccia ${i + 1}/${count} per ${channel}`);

      // 1. Genera audio via ElevenLabs
      const track = await generateTrack(channel, {
        durationMs: duration_ms,
        forceInstrumental: force_instrumental,
      });

      // 2. Upload su Supabase Storage
      const fileName = `${channel}/${Date.now()}_${track.title.replace(/\s+/g, "-").toLowerCase()}.mp3`;

      const { error: uploadError } = await supabase.storage
        .from("radio-tracks")
        .upload(fileName, track.audioBuffer, {
          contentType: "audio/mpeg",
          cacheControl: "31536000", // 1 anno di cache
        });

      if (uploadError) {
        console.error("[Generate] Upload error:", uploadError);
        throw new Error(`Upload fallito: ${uploadError.message}`);
      }

      // 3. Ottieni URL pubblico
      const { data: urlData } = supabase.storage
        .from("radio-tracks")
        .getPublicUrl(fileName);

      const fileUrl = urlData.publicUrl;

      // 4. Inserisci nel database
      const { data: dbData, error: dbError } = await supabase
        .from("tribu_radio_tracks")
        .insert({
          title: track.title,
          genre: track.genre,
          channel: track.channel,
          bpm: track.bpm,
          energy: track.energy,
          duration_sec: track.durationSec,
          file_url: fileUrl,
          prompt_used: track.promptUsed,
          is_published: true,
        })
        .select()
        .single();

      if (dbError) {
        console.error("[Generate] DB error:", dbError);
        throw new Error(`Inserimento DB fallito: ${dbError.message}`);
      }

      results.push({
        id: dbData.id,
        title: track.title,
        channel: track.channel,
        genre: track.genre,
        duration_sec: track.durationSec,
        file_url: fileUrl,
        instrumental: track.forceInstrumental,
      });

      // Pausa tra generazioni
      if (i < count - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    return NextResponse.json({
      success: true,
      generated: results.length,
      tracks: results,
    });
  } catch (error) {
    console.error("[Generate] Error:", error);
    const message = error instanceof Error ? error.message : "Errore sconosciuto";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
