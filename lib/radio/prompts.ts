// lib/radio/prompts.ts
// Prompt templates per la generazione musicale AI per ogni canale Tribù Radio

import { RadioChannel } from "./types";

export type ChannelPromptConfig = {
  channel: RadioChannel;
  prompts: string[];
  bpmRange: [number, number];
  energy: number;
  genre: string;
  forceInstrumental: boolean;
};

// Ogni canale ha multipli prompt per varietà
export const CHANNEL_PROMPTS: ChannelPromptConfig[] = [
  {
    channel: "gym-energy",
    genre: "Electronic / EDM",
    bpmRange: [128, 150],
    energy: 9,
    forceInstrumental: true,
    prompts: [
      "High-energy electronic workout music with driving bass, powerful drops, and intense synth leads. Perfect for intense gym sessions and cardio workouts. Fast tempo, aggressive beats, builds and drops.",
      "Energetic EDM track with pounding kick drums, rising synths, and euphoric drops. Motivational gym music with relentless energy. Heavy bass, crisp hi-hats, stadium-filling sound.",
      "Intense dubstep-influenced electronic track for weightlifting. Deep wobble bass, sharp snares, powerful build-ups leading to massive drops. Dark and aggressive atmosphere.",
      "Upbeat dance-pop instrumental with catchy synth hooks, four-on-the-floor beats, and energetic breakdowns. High tempo workout anthem with positive uplifting energy.",
      "Hard-hitting drum and bass inspired track with fast breakbeats, rolling basslines, and soaring pads. Relentless energy for high-intensity training sessions.",
    ],
  },
  {
    channel: "coffee-chill",
    genre: "Lo-fi / Chill",
    bpmRange: [70, 95],
    energy: 3,
    forceInstrumental: true,
    prompts: [
      "Warm lo-fi hip hop beat with jazzy piano chords, vinyl crackle, soft kick and snare, mellow Rhodes keys. Cozy coffee shop atmosphere, relaxed and inviting.",
      "Gentle acoustic chill track with fingerpicked guitar, soft brushed drums, subtle bass, and warm ambient pads. Perfect background for reading and conversation in a cafe.",
      "Smooth jazz-influenced lo-fi beat with saxophone melody, muted trumpet, walking bass, and soft drum machine. Sophisticated yet relaxed coffeehouse vibe.",
      "Indie folk-inspired ambient piece with ukulele, soft piano, gentle strings, and nature sounds. Warm, organic, and comforting like a morning cup of coffee.",
      "Bossa nova inspired chill beat with nylon guitar, soft percussion, gentle bass, and airy synth pads. Elegant and relaxed, perfect for an afternoon coffee break.",
    ],
  },
  {
    channel: "beauty-relax",
    genre: "Ambient / Spa",
    bpmRange: [60, 80],
    energy: 2,
    forceInstrumental: true,
    prompts: [
      "Peaceful spa ambient music with gentle flowing water sounds, soft ethereal pads, delicate piano notes, and subtle wind chimes. Deeply relaxing and meditative.",
      "Serene ambient soundscape with crystal singing bowls, gentle drone pads, soft nature sounds, and occasional harp arpeggios. Perfect for massage and relaxation treatments.",
      "Calming new age composition with slow evolving synth textures, soft bell tones, whispered breaths of sound, and gentle rain. Deeply soothing spa atmosphere.",
      "Tranquil meditation music with Tibetan bowls, soft flute melody, ambient pads, and gentle heartbeat rhythm. Creates a sacred, peaceful space for wellness treatments.",
      "Ethereal ambient piece with shimmering textures, soft celeste, gentle strings, and ocean wave sounds. Floating, weightless atmosphere for deep relaxation and renewal.",
    ],
  },
  {
    channel: "lounge-bar",
    genre: "Lounge / Deep House",
    bpmRange: [110, 125],
    energy: 5,
    forceInstrumental: true,
    prompts: [
      "Sophisticated deep house track with smooth bassline, subtle hi-hats, warm chord stabs, and silky pad textures. Perfect for upscale cocktail bars and late-night lounges.",
      "Chilled nu-disco groove with funky guitar riffs, analog synth bass, crisp drums, and dreamy vocal chops. Stylish and groovy lounge atmosphere.",
      "Jazzy house track with Rhodes piano chords, walking bass, shuffled drums, and muted trumpet samples. Classy lounge bar vibe with sophisticated groove.",
      "Downtempo electronic track with deep sub bass, atmospheric pads, ethnic percussion, and subtle acid synth lines. Mysterious and seductive cocktail bar mood.",
      "Smooth soulful house with warm organ chords, funky bass guitar, crisp breakbeat drums, and lush string arrangements. Elegant yet danceable lounge groove.",
    ],
  },
  {
    channel: "retail-background",
    genre: "Pop / Easy Listening",
    bpmRange: [95, 115],
    energy: 4,
    forceInstrumental: true,
    prompts: [
      "Light pop instrumental with cheerful acoustic guitar, gentle piano, soft drums, and upbeat bass. Pleasant and unobtrusive background music for retail shopping.",
      "Bright and airy indie pop track with jangly guitars, light synth pads, bouncy bass, and crisp snare. Feel-good shopping atmosphere without being intrusive.",
      "Modern easy listening track with smooth electric piano, light funk guitar, gentle bass groove, and soft brushed drums. Warm and welcoming retail environment.",
      "Uplifting corporate-style instrumental with acoustic guitars, light strings, gentle piano, and positive energy. Clean, modern sound perfect for fashion retail.",
      "Mellow tropical pop instrumental with steel drum hints, light reggae groove, warm pads, and sunny guitar melodies. Relaxed yet engaging shopping background.",
    ],
  },
];

/**
 * Restituisce un prompt random per il canale specificato
 */
export function getRandomPrompt(channel: RadioChannel): ChannelPromptConfig & { selectedPrompt: string } {
  const config = CHANNEL_PROMPTS.find((c) => c.channel === channel);
  if (!config) throw new Error(`Channel ${channel} not found`);

  const selectedPrompt = config.prompts[Math.floor(Math.random() * config.prompts.length)];
  return { ...config, selectedPrompt };
}

/**
 * Genera un titolo per la traccia basandosi sul canale e un indice
 */
export function generateTrackTitle(channel: RadioChannel, index?: number): string {
  const titles: Record<RadioChannel, string[]> = {
    "gym-energy": ["Power Surge", "Iron Will", "Beast Mode", "Adrenaline Rush", "Maximum Overdrive", "Unstoppable", "Thunder Strike", "Full Throttle", "Titan Rise", "Nitro Boost"],
    "coffee-chill": ["Morning Brew", "Lazy Sunday", "Golden Hour", "Paper & Steam", "Quiet Corner", "Vanilla Cloud", "Gentle Rain", "Warm Thoughts", "Soft Focus", "Daydream"],
    "beauty-relax": ["Crystal Waters", "Inner Peace", "Lotus Bloom", "Silk & Sand", "Pure Harmony", "Velvet Touch", "Zen Garden", "Cloud Nine", "Moonstone", "Still Waters"],
    "lounge-bar": ["Midnight Velvet", "Neon Glow", "Smoky Jazz", "After Hours", "City Lights", "Martini Sunset", "Vinyl Dreams", "Silk Road", "Blue Mood", "Last Dance"],
    "retail-background": ["Bright Day", "Easy Breeze", "Happy Walk", "Sunlit Aisle", "Light Steps", "Fresh Start", "Positive Vibes", "Simple Joy", "Clear Sky", "Smooth Ride"],
  };

  const channelTitles = titles[channel];
  const i = index !== undefined ? index % channelTitles.length : Math.floor(Math.random() * channelTitles.length);
  return channelTitles[i];
}
