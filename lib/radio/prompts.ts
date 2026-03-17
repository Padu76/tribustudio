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
    forceInstrumental: false,
    prompts: [
      "A male singer performs a high-energy electronic workout anthem with powerful vocals singing motivational lyrics about pushing limits. Driving bass, massive drops, intense synth leads. The singer has a strong aggressive voice. Fast tempo, builds and drops.",
      "A female singer performs an energetic EDM pop song, singing a catchy chorus about strength and power. Pounding kick drums, rising synths, euphoric drops. Her voice is powerful and clear. Sing-along anthem.",
      "A male vocalist sings an intense workout song with raw vocal energy, chanting and singing over dubstep-influenced beats, deep wobble bass, sharp snares. Aggressive singing voice, powerful build-ups and drops.",
      "A female pop singer performs an upbeat dance-pop workout anthem, singing catchy melodies with an anthemic chorus. Four-on-the-floor beats, energetic breakdowns. Her voice is bright and powerful. Positive uplifting lyrics.",
      "A soulful singer performs a hard-hitting drum and bass track, singing powerful hooks over fast breakbeats, rolling basslines, and soaring pads. Strong vocal performance for high-intensity training.",
    ],
  },
  {
    channel: "coffee-chill",
    genre: "Lo-fi / Chill",
    bpmRange: [70, 95],
    energy: 3,
    forceInstrumental: false,
    prompts: [
      "A female singer with a soft whispery voice sings a warm lo-fi hip hop song about lazy mornings and cozy moments. Jazzy piano chords, vinyl crackle, soft kick and snare, mellow Rhodes keys. Dreamy intimate vocal performance.",
      "A woman sings gently over a chill acoustic song, her soft voice performing an intimate melody about simple pleasures. Fingerpicked guitar, brushed drums, subtle bass. Cafe atmosphere, she sings every word clearly.",
      "A male jazz singer croons smoothly over a lo-fi track with saxophone, muted trumpet, walking bass. His breathy voice sings a sophisticated melody. Relaxed coffeehouse vibe with clear vocals throughout.",
      "A male singer with a tender warm voice performs an indie folk song about comfort and morning rituals. Ukulele, soft piano, gentle strings. He sings with warmth and feeling, organic acoustic sound.",
      "A female vocalist sings a bossa nova inspired chill song with an elegant intimate voice. Nylon guitar, gentle percussion, warm bass. She sings softly but clearly, perfect for an afternoon break.",
    ],
  },
  {
    channel: "beauty-relax",
    genre: "Ambient / Spa",
    bpmRange: [60, 80],
    energy: 2,
    forceInstrumental: false,
    prompts: [
      "A woman with an angelic voice sings a peaceful spa song, her ethereal vocals floating softly over delicate piano notes, gentle flowing water sounds, and subtle wind chimes. She sings slowly and soothingly, deeply relaxing.",
      "A female vocalist sings serene wordless melodies and harmonies over crystal singing bowls, gentle drone pads, and occasional harp arpeggios. Her heavenly voice carries the song, perfect for spa treatments.",
      "A woman sings a calming new age song with a whispered soothing voice over slow evolving synth textures, soft bell tones, and gentle rain sounds. Her voice floats peacefully, ambient spa atmosphere.",
      "A female singer hums and sings gentle mantras in a tranquil meditation song. Tibetan bowls, soft flute melody, ambient pads. Her sacred peaceful voice guides relaxation and wellness.",
      "A choir of female voices sings layered angelic harmonies in an ethereal ambient song. Shimmering textures, soft celeste, gentle strings. Floating weightless vocal harmonies for deep relaxation.",
    ],
  },
  {
    channel: "lounge-bar",
    genre: "Lounge / Downtempo",
    bpmRange: [85, 105],
    energy: 4,
    forceInstrumental: false,
    prompts: [
      "Smooth lounge song, a singer with a sultry voice sings over warm jazz piano chords, soft upright bass, brushed drums, and gentle Rhodes keys. Relaxed elegant cocktail bar atmosphere, slow tempo, sophisticated and intimate.",
      "Downtempo bossa nova song, a female vocalist sings softly with a breathy intimate voice over nylon guitar, gentle percussion, warm bass. Refined lounge bar mood, smooth and mellow.",
      "Chill lounge jazz song, a male vocalist croons smoothly over muted trumpet, soft piano, walking bass, light brushed snare. Classic cocktail lounge feeling, relaxed and classy.",
      "Sultry downtempo song, a woman sings seductively over deep warm pads, soft Rhodes chords, gentle bass groove, subtle percussion. Intimate late-night lounge bar mood, slow and sensual.",
      "Elegant lounge song, soulful vocals singing a mellow melody over soft saxophone, gentle piano, warm strings, light percussion. Sophisticated and relaxing cocktail bar ambiance, smooth and slow.",
    ],
  },
  {
    channel: "retail-background",
    genre: "Pop / Easy Listening",
    bpmRange: [95, 115],
    energy: 4,
    forceInstrumental: false,
    prompts: [
      "A cheerful female singer performs a light pop song, singing a catchy melody with feel-good lyrics about happy days. Acoustic guitar, gentle piano, soft drums. Her voice is bright and pleasant, perfect background for shopping.",
      "A male singer with a sweet voice performs a bright indie pop song, singing a catchy chorus. Jangly guitars, light synth pads, bouncy bass. He sings with positive upbeat energy, sing-along feel.",
      "A smooth soulful vocalist sings a modern easy listening song over electric piano, light funk guitar, gentle bass groove. Warm welcoming voice singing clearly, pleasant for retail environments.",
      "A group of singers perform an uplifting pop track with bright vocal harmonies, singing about new beginnings. Acoustic guitars, light strings, gentle piano. Clear vocals, clean modern sound.",
      "A relaxed male vocalist sings a mellow tropical pop song about summer and good times. Steel drum hints, light reggae groove, sunny guitar melodies. Laid-back singing voice, cheerful mood.",
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
