// app/api/radio/announcements/generate/route.ts
// API per generare annunci vocali DJ via ElevenLabs TTS e salvarli su Supabase
// POST /api/radio/announcements/generate

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  generateDJAnnouncement,
  DJ_VOICES,
  DJVoiceId,
} from "@/lib/radio/elevenlabs-tts";
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

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("x-admin-key");
    if (authHeader !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const body = await request.json();
    const {
      channel,
      count = 1,
      voice_preset = "male_deep",
      custom_text,
      next_track_title,
    } = body;

    if (!channel || !VALID_CHANNELS.includes(channel)) {
      return NextResponse.json(
        { error: `Canale non valido. Usa: ${VALID_CHANNELS.join(", ")}` },
        { status: 400 }
      );
    }

    if (count < 1 || count > 10) {
      return NextResponse.json(
        { error: "count deve essere tra 1 e 10" },
        { status: 400 }
      );
    }

    if (!(voice_preset in DJ_VOICES)) {
      return NextResponse.json(
        {
          error: `voice_preset non valido. Usa: ${Object.keys(DJ_VOICES).join(", ")}`,
        },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();
    const results = [];

    for (let i = 0; i < count; i++) {
      console.log(
        `[Announcements] Annuncio ${i + 1}/${count} per ${channel}`
      );

      const announcement = await generateDJAnnouncement(channel, {
        voicePreset: voice_preset as DJVoiceId,
        customText: custom_text,
        nextTrackTitle: next_track_title,
      });

      // Upload su Supabase Storage
      const fileName = `announcements/${channel}/${Date.now()}_dj-announcement.mp3`;

      const { error: uploadError } = await supabase.storage
        .from("radio-tracks")
        .upload(fileName, announcement.audioBuffer, {
          contentType: "audio/mpeg",
          cacheControl: "31536000",
        });

      if (uploadError) {
        console.error("[Announcements] Upload error:", uploadError);
        throw new Error(`Upload fallito: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from("radio-tracks")
        .getPublicUrl(fileName);

      // Inserisci nel database annunci
      const { data: dbData, error: dbError } = await supabase
        .from("tribu_radio_announcements")
        .insert({
          channel: announcement.channel,
          text: announcement.text,
          voice_id: announcement.voiceId,
          file_url: urlData.publicUrl,
          duration_sec: announcement.durationEstimateSec,
          is_active: true,
        })
        .select()
        .single();

      if (dbError) {
        console.error("[Announcements] DB error:", dbError);
        throw new Error(`Inserimento DB fallito: ${dbError.message}`);
      }

      results.push({
        id: dbData.id,
        channel: announcement.channel,
        text: announcement.text,
        duration_sec: announcement.durationEstimateSec,
        file_url: urlData.publicUrl,
      });

      if (i < count - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    return NextResponse.json({
      success: true,
      generated: results.length,
      announcements: results,
    });
  } catch (error) {
    console.error("[Announcements] Error:", error);
    const message =
      error instanceof Error ? error.message : "Errore sconosciuto";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
