#!/usr/bin/env npx tsx
// scripts/test-generate.ts
// Test rapido della generazione musica ElevenLabs
// Uso: npx tsx scripts/test-generate.ts

import { config } from "dotenv";
config({ path: ".env.local" });

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/music";

async function testGenerate() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("❌ ELEVENLABS_API_KEY mancante in .env.local");
    process.exit(1);
  }

  console.log("🎵 Test generazione ElevenLabs Music API...");
  console.log("⏱️  Generazione traccia di 30 secondi (test breve)...\n");

  const prompt =
    "Warm lo-fi hip hop beat with jazzy piano chords, vinyl crackle, soft kick and snare. Cozy coffee shop atmosphere.";

  const start = Date.now();

  try {
    const response = await fetch(ELEVENLABS_API_URL, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        music_length_ms: 30_000, // 30 secondi per test veloce
        force_instrumental: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error ${response.status}: ${errorText}`);
      process.exit(1);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    console.log(`✅ Traccia generata con successo!`);
    console.log(`   Dimensione: ${(buffer.length / 1024).toFixed(0)} KB`);
    console.log(`   Tempo: ${elapsed}s`);
    console.log(`   Prompt: "${prompt.substring(0, 60)}..."`);

    // Salva file locale per test
    const fs = await import("fs");
    const outPath = "scripts/test-track.mp3";
    fs.writeFileSync(outPath, buffer);
    console.log(`   File salvato: ${outPath}`);
  } catch (err) {
    console.error("❌ Errore:", err);
    process.exit(1);
  }
}

testGenerate();
