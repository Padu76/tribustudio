// lib/radio/elevenlabs-tts.ts
// Client per generazione annunci vocali DJ via ElevenLabs TTS API

import { RadioChannel } from "./types";
import { getDJAnnouncement } from "./dj-prompts";

const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";

// Voci consigliate ElevenLabs (pre-made)
// Puoi cambiare l'ID con una voce personalizzata o clonata
export const DJ_VOICES = {
  male_deep: "pNInz6obpgDQGcFmaJgB", // Adam - deep male
  female_warm: "EXAVITQu4vr4xnSDxMaL", // Bella - warm female
  male_energetic: "VR6AewLTigWG4xSOukaG", // Arnold - energetic male
  female_smooth: "jBpfuIE2acCO8z3wKNLl", // Gigi - smooth female
} as const;

export type DJVoiceId = keyof typeof DJ_VOICES;

type GenerateAnnouncementResult = {
  audioBuffer: Buffer;
  text: string;
  channel: RadioChannel;
  voiceId: string;
  durationEstimateSec: number;
};

/**
 * Genera un annuncio vocale DJ via ElevenLabs TTS
 */
export async function generateDJAnnouncement(
  channel: RadioChannel,
  options?: {
    voiceId?: string;
    voicePreset?: DJVoiceId;
    customText?: string;
    nextTrackTitle?: string;
  }
): Promise<GenerateAnnouncementResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY mancante in .env.local");

  const voiceId =
    options?.voiceId ??
    DJ_VOICES[options?.voicePreset ?? "male_deep"];

  const text =
    options?.customText ??
    getDJAnnouncement(channel, options?.nextTrackTitle);

  console.log(`[TTS] Generazione annuncio DJ per ${channel}...`);
  console.log(`[TTS] Testo: "${text.substring(0, 80)}..."`);

  const response = await fetch(`${ELEVENLABS_TTS_URL}/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.6,
        similarity_boost: 0.75,
        style: 0.4,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs TTS error ${response.status}: ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = Buffer.from(arrayBuffer);

  // Stima durata: ~150 parole/minuto per TTS = ~2.5 parole/secondo
  const wordCount = text.split(/\s+/).length;
  const durationEstimateSec = Math.max(2, Math.ceil(wordCount / 2.5));

  return {
    audioBuffer,
    text,
    channel,
    voiceId,
    durationEstimateSec,
  };
}

/**
 * Genera annunci per tutti i canali (batch)
 */
export async function generateAllChannelAnnouncements(
  voicePreset: DJVoiceId = "male_deep"
): Promise<GenerateAnnouncementResult[]> {
  const channels: RadioChannel[] = [
    "gym-energy",
    "coffee-chill",
    "beauty-relax",
    "lounge-bar",
    "retail-background",
  ];

  const results: GenerateAnnouncementResult[] = [];

  for (const channel of channels) {
    const result = await generateDJAnnouncement(channel, { voicePreset });
    results.push(result);
    // Pausa per rate limiting
    await new Promise((r) => setTimeout(r, 1000));
  }

  return results;
}
