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
      "High-energy electronic workout anthem with powerful male vocals, driving bass, massive drops, and intense synth leads. Motivational lyrics about pushing limits and never giving up. Fast tempo, aggressive beats, builds and drops.",
      "Energetic EDM track with catchy female vocal hooks, pounding kick drums, rising synths, and euphoric drops. Sing-along chorus about strength and power. Heavy bass, crisp hi-hats, stadium-filling sound.",
      "Intense dubstep-influenced track with raw vocal chants and shouts, deep wobble bass, sharp snares, powerful build-ups leading to massive drops. Aggressive vocal energy for weightlifting.",
      "Upbeat dance-pop song with catchy sung melodies, anthemic chorus, four-on-the-floor beats, and energetic breakdowns. High tempo workout anthem with positive uplifting lyrics.",
      "Hard-hitting drum and bass track with soulful vocal samples and sung hooks, fast breakbeats, rolling basslines, and soaring pads. Relentless vocal energy for high-intensity training.",
    ],
  },
  {
    channel: "coffee-chill",
    genre: "Lo-fi / Chill",
    bpmRange: [70, 95],
    energy: 3,
    forceInstrumental: false,
    prompts: [
      "Warm lo-fi hip hop song with soft whispered vocals, jazzy piano chords, vinyl crackle, soft kick and snare, mellow Rhodes keys. Dreamy singing about lazy mornings and cozy moments.",
      "Gentle acoustic chill song with soft female vocals, fingerpicked guitar, brushed drums, subtle bass. Intimate singing about simple pleasures and quiet moments in a cafe.",
      "Smooth jazz-influenced lo-fi track with breathy vocal melodies, saxophone, muted trumpet, walking bass. Sophisticated singing with a relaxed coffeehouse vibe.",
      "Indie folk song with tender male vocals, ukulele, soft piano, gentle strings. Warm organic singing about comfort and morning rituals, like a cup of coffee.",
      "Bossa nova inspired chill song with soft Portuguese-style vocals, nylon guitar, gentle percussion, warm bass. Elegant and intimate singing for an afternoon break.",
    ],
  },
  {
    channel: "beauty-relax",
    genre: "Ambient / Spa",
    bpmRange: [60, 80],
    energy: 2,
    forceInstrumental: false,
    prompts: [
      "Peaceful spa song with ethereal female vocals humming and singing softly, gentle flowing water sounds, delicate piano notes, and subtle wind chimes. Angelic voice, deeply relaxing.",
      "Serene ambient track with soft wordless vocal harmonies, crystal singing bowls, gentle drone pads, and occasional harp arpeggios. Heavenly choir-like singing for spa treatments.",
      "Calming new age song with whispered female vocals, slow evolving synth textures, soft bell tones, and gentle rain. Soothing voice floating over ambient spa atmosphere.",
      "Tranquil meditation song with gentle vocal mantras and humming, Tibetan bowls, soft flute melody, ambient pads. Sacred and peaceful singing for wellness treatments.",
      "Ethereal ambient song with layered angelic vocals, shimmering textures, soft celeste, gentle strings. Floating, weightless vocal harmonies for deep relaxation and renewal.",
    ],
  },
  {
    channel: "lounge-bar",
    genre: "Lounge / Deep House",
    bpmRange: [110, 125],
    energy: 5,
    forceInstrumental: false,
    prompts: [
      "Sophisticated deep house track with sultry female vocals, smooth bassline, subtle hi-hats, warm chord stabs. Seductive singing about nightlife and desire, perfect for cocktail bars.",
      "Chilled nu-disco groove with soulful male vocals, funky guitar riffs, analog synth bass, crisp drums. Smooth singing with a stylish groovy lounge atmosphere.",
      "Jazzy house song with smooth vocal scatting and singing, Rhodes piano chords, walking bass, shuffled drums. Classy vocal performance with sophisticated lounge bar vibe.",
      "Downtempo electronic track with breathy whispered vocals, deep sub bass, atmospheric pads, ethnic percussion. Mysterious and seductive singing for a cocktail bar mood.",
      "Smooth soulful house song with rich R&B vocals, warm organ chords, funky bass guitar, lush strings. Elegant singing that's sultry yet danceable for late-night lounges.",
    ],
  },
  {
    channel: "retail-background",
    genre: "Pop / Easy Listening",
    bpmRange: [95, 115],
    energy: 4,
    forceInstrumental: false,
    prompts: [
      "Light pop song with cheerful female vocals, catchy melody, acoustic guitar, gentle piano, soft drums. Feel-good lyrics about happy days and good vibes, pleasant for retail shopping.",
      "Bright indie pop song with sweet male vocals, jangly guitars, light synth pads, bouncy bass. Catchy sing-along chorus with positive upbeat energy for shopping.",
      "Modern easy listening song with smooth soulful vocals, electric piano, light funk guitar, gentle bass groove. Warm welcoming voice for a retail environment.",
      "Uplifting pop track with bright vocal harmonies, acoustic guitars, light strings, gentle piano. Positive lyrics about new beginnings, clean modern sound for fashion retail.",
      "Mellow tropical pop song with relaxed vocals, steel drum hints, light reggae groove, sunny guitar melodies. Laid-back singing about summer and good times for shopping.",
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
