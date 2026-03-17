// lib/radio/dj-prompts.ts
// Testi per gli annunci vocali del DJ virtuale di Tribù Radio

import { RadioChannel } from "./types";

type DJAnnouncementSet = {
  channel: RadioChannel;
  // Annunci generici (tra una traccia e l'altra)
  generic: string[];
  // Annunci con nome della prossima traccia
  withTrackName: string[];
  // Jingle / identificazione canale
  stationId: string[];
};

const DJ_ANNOUNCEMENTS: DJAnnouncementSet[] = [
  {
    channel: "gym-energy",
    generic: [
      "Stai ascoltando Tribù Radio, canale Gym Energy. Non mollare, il prossimo brano ti darà ancora più carica!",
      "Tribù Radio Gym Energy! Tieni alto il ritmo, la musica non si ferma!",
      "Energia pura su Tribù Radio! Spingi al massimo con il prossimo pezzo!",
      "Questo è Tribù Radio, il tuo compagno di allenamento. Pronto per il prossimo round?",
      "Gym Energy su Tribù Radio. Niente pause, solo musica ad alta intensità!",
    ],
    withTrackName: [
      "Su Tribù Radio Gym Energy, in arrivo: {track}. Preparati!",
      "Il prossimo brano su Gym Energy è {track}. Dai tutto!",
      "Tribù Radio continua con {track}. Energia al massimo!",
    ],
    stationId: [
      "Tribù Radio. Gym Energy. La tua palestra, la tua musica.",
      "Stai ascoltando Tribù Radio, canale Gym Energy.",
    ],
  },
  {
    channel: "coffee-chill",
    generic: [
      "Stai ascoltando Tribù Radio, Coffee Chill. Rilassati e goditi il momento.",
      "Tribù Radio Coffee Chill. Il sottofondo perfetto per il tuo caffè.",
      "Musica chill su Tribù Radio. Lasciati trasportare dalle note.",
      "Coffee Chill su Tribù Radio. Ogni momento merita la sua colonna sonora.",
      "Tribù Radio ti accompagna con musica rilassante. Buon ascolto!",
    ],
    withTrackName: [
      "Su Tribù Radio Coffee Chill, il prossimo brano è {track}. Buon ascolto.",
      "Continuiamo con {track} su Coffee Chill. Rilassati e ascolta.",
      "In arrivo {track} su Tribù Radio. Perfetto per questo momento.",
    ],
    stationId: [
      "Tribù Radio. Coffee Chill. Il tuo angolo di relax.",
      "Stai ascoltando Tribù Radio, canale Coffee Chill.",
    ],
  },
  {
    channel: "beauty-relax",
    generic: [
      "Tribù Radio Beauty Relax. Lasciati avvolgere dalla tranquillità.",
      "Stai ascoltando Tribù Radio. Musica per il tuo benessere.",
      "Beauty Relax su Tribù Radio. Respira, rilassati, ascolta.",
      "Tribù Radio ti regala un momento di pace. Buon relax.",
      "Musica ambient su Tribù Radio. Il suono della serenità.",
    ],
    withTrackName: [
      "Su Tribù Radio Beauty Relax, in arrivo {track}. Lasciati trasportare.",
      "Il prossimo brano è {track}. Chiudi gli occhi e ascolta.",
      "Continuiamo con {track} su Beauty Relax. Puro relax.",
    ],
    stationId: [
      "Tribù Radio. Beauty Relax. Musica per mente e corpo.",
      "Stai ascoltando Tribù Radio, canale Beauty Relax.",
    ],
  },
  {
    channel: "lounge-bar",
    generic: [
      "Tribù Radio Lounge Bar. L'atmosfera giusta per la tua serata.",
      "Stai ascoltando Tribù Radio. Musica sofisticata per serate speciali.",
      "Lounge Bar su Tribù Radio. Il groove perfetto per ogni momento.",
      "Tribù Radio ti porta nel mood giusto. Buon ascolto!",
      "Musica lounge selezionata per te su Tribù Radio.",
    ],
    withTrackName: [
      "Su Tribù Radio Lounge Bar, ecco {track}. Buon ascolto.",
      "In arrivo {track} su Lounge Bar. L'atmosfera si accende.",
      "Il prossimo pezzo è {track}. Solo su Tribù Radio.",
    ],
    stationId: [
      "Tribù Radio. Lounge Bar. Stile e musica.",
      "Stai ascoltando Tribù Radio, canale Lounge Bar.",
    ],
  },
  {
    channel: "retail-background",
    generic: [
      "Tribù Radio Retail. La musica che rende unico il tuo spazio.",
      "Stai ascoltando Tribù Radio. Sottofondo musicale per il tuo business.",
      "Retail su Tribù Radio. Musica leggera per i tuoi clienti.",
      "Tribù Radio ti accompagna tutto il giorno. Buon ascolto!",
      "Musica selezionata per il tuo negozio su Tribù Radio.",
    ],
    withTrackName: [
      "Su Tribù Radio Retail, il prossimo brano è {track}.",
      "Continuiamo con {track} su Tribù Radio.",
      "In arrivo {track}. Buon ascolto su Tribù Radio.",
    ],
    stationId: [
      "Tribù Radio. Retail. La colonna sonora del tuo business.",
      "Stai ascoltando Tribù Radio, canale Retail.",
    ],
  },
];

/**
 * Restituisce un annuncio DJ random per il canale
 */
export function getDJAnnouncement(
  channel: RadioChannel,
  nextTrackTitle?: string
): string {
  const config = DJ_ANNOUNCEMENTS.find((a) => a.channel === channel);
  if (!config) throw new Error(`Channel ${channel} not found for DJ prompts`);

  // Se abbiamo il titolo della prossima traccia, 40% probabilità di usare l'annuncio con nome
  if (nextTrackTitle && Math.random() < 0.4) {
    const template =
      config.withTrackName[
        Math.floor(Math.random() * config.withTrackName.length)
      ];
    return template.replace("{track}", nextTrackTitle);
  }

  // 20% probabilità di station ID (jingle breve)
  if (Math.random() < 0.2) {
    return config.stationId[
      Math.floor(Math.random() * config.stationId.length)
    ];
  }

  // Default: annuncio generico
  return config.generic[Math.floor(Math.random() * config.generic.length)];
}
