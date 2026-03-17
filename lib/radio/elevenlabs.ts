// lib/radio/elevenlabs.ts
// Client per generazione musica via ElevenLabs API

import { RadioChannel } from "./types";
import { getRandomPrompt, generateTrackTitle } from "./prompts";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/music";

type GenerateTrackResult = {
  audioBuffer: Buffer;
  title: string;
  genre: string;
  channel: RadioChannel;
  bpm: number;
  energy: number;
  durationSec: number;
  promptUsed: string;
  forceInstrumental: boolean;
};

/**
 * Genera una traccia musicale via ElevenLabs API
 */
export async function generateTrack(
  channel: RadioChannel,
  options?: {
    durationMs?: number;
    forceInstrumental?: boolean;
    customPrompt?: string;
  }
): Promise<GenerateTrackResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY mancante in .env.local");

  const config = getRandomPrompt(channel);
  const prompt = options?.customPrompt || config.selectedPrompt;
  const forceInstrumental = options?.forceInstrumental ?? config.forceInstrumental;

  // Default: 3 minuti per traccia (180000ms)
  const durationMs = options?.durationMs ?? 180_000;

  console.log(`[ElevenLabs] Generazione traccia per ${channel}...`);
  console.log(`[ElevenLabs] Prompt: ${prompt.substring(0, 80)}...`);
  console.log(`[ElevenLabs] Durata: ${durationMs / 1000}s | Strumentale: ${forceInstrumental}`);

  const response = await fetch(ELEVENLABS_API_URL, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      music_length_ms: durationMs,
      force_instrumental: forceInstrumental,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `ElevenLabs API error ${response.status}: ${errorText}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = Buffer.from(arrayBuffer);

  // Calcola BPM random nel range del canale
  const [minBpm, maxBpm] = config.bpmRange;
  const bpm = Math.floor(Math.random() * (maxBpm - minBpm + 1)) + minBpm;

  const title = generateTrackTitle(channel);

  return {
    audioBuffer,
    title,
    genre: config.genre,
    channel,
    bpm,
    energy: config.energy,
    durationSec: Math.round(durationMs / 1000),
    promptUsed: prompt,
    forceInstrumental,
  };
}

/**
 * Genera più tracce per un canale (sequenziale per rispettare rate limits)
 */
export async function generateMultipleTracks(
  channel: RadioChannel,
  count: number,
  options?: {
    durationMs?: number;
    forceInstrumental?: boolean;
  }
): Promise<GenerateTrackResult[]> {
  const results: GenerateTrackResult[] = [];

  for (let i = 0; i < count; i++) {
    console.log(`[ElevenLabs] Traccia ${i + 1}/${count} per ${channel}`);
    const track = await generateTrack(channel, options);
    results.push(track);

    // Pausa tra generazioni per evitare rate limiting
    if (i < count - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  return results;
}
