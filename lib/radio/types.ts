// lib/radio/types.ts

export type RadioChannel =
  | "gym-energy"
  | "coffee-chill"
  | "beauty-relax"
  | "lounge-bar"
  | "retail-background";

export type RadioTrack = {
  id: string;
  title: string;
  genre: string | null;
  channel: RadioChannel;
  bpm: number | null;
  energy: number | null;
  duration_sec: number | null;
  file_url: string;
  is_published: boolean;
  quality_score: number | null;
  created_at: string;
};

export type RadioSubscriberPlan = "starter" | "business";

export type RadioSubscriber = {
  id: string;
  email: string;
  business_name: string | null;
  plan: RadioSubscriberPlan;
  is_active: boolean;
  created_at: string;
};

export type ChannelInfo = {
  id: RadioChannel;
  label: string;
  description: string;
  icon: string;
};
