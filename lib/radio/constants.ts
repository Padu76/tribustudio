// lib/radio/constants.ts
import { ChannelInfo } from "./types";

export const RADIO_CHANNELS: ChannelInfo[] = [
  {
    id: "gym-energy",
    label: "Gym Energy",
    description: "Musica energica per palestre e centri fitness",
    icon: "💪",
  },
  {
    id: "coffee-chill",
    label: "Coffee Chill",
    description: "Atmosfera rilassata per bar e caffetterie",
    icon: "☕",
  },
  {
    id: "beauty-relax",
    label: "Beauty Relax",
    description: "Suoni rilassanti per centri estetici e spa",
    icon: "✨",
  },
  {
    id: "lounge-bar",
    label: "Lounge Bar",
    description: "Vibes lounge per cocktail bar e ristoranti",
    icon: "🍸",
  },
  {
    id: "retail-background",
    label: "Retail Background",
    description: "Sottofondo musicale per negozi e showroom",
    icon: "🛍️",
  },
];

export const RADIO_PLANS = {
  starter: {
    name: "Starter",
    price: 9,
    features: [
      "Accesso ai canali principali",
      "Musica continua senza pubblicità",
      "Player web semplice",
    ],
  },
  business: {
    name: "Business",
    price: 19,
    features: [
      "Accesso completo a tutti i canali",
      "Qualità audio superiore",
      "Aggiornamenti musicali continui",
      "Supporto prioritario",
    ],
  },
} as const;
