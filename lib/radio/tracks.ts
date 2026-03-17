// lib/radio/tracks.ts
import { supabase } from "../supabase";
import { RadioChannel, RadioTrack } from "./types";

export async function getTracksByChannel(
  channel: RadioChannel,
  limit = 50
): Promise<RadioTrack[]> {
  const { data, error } = await supabase
    .from("tribu_radio_tracks")
    .select("*")
    .eq("channel", channel)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching tracks:", error);
    return [];
  }

  return data ?? [];
}

export async function getRandomTracksByChannel(
  channel: RadioChannel,
  limit = 20
): Promise<RadioTrack[]> {
  // Fetch more tracks and shuffle client-side since Supabase
  // doesn't support random ordering natively
  const tracks = await getTracksByChannel(channel, 200);

  // Fisher-Yates shuffle
  for (let i = tracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
  }

  return tracks.slice(0, limit);
}

export async function getChannelTrackCount(): Promise<
  Record<string, number>
> {
  const { data, error } = await supabase
    .from("tribu_radio_tracks")
    .select("channel")
    .eq("is_published", true);

  if (error) {
    console.error("Error fetching track counts:", error);
    return {};
  }

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.channel] = (counts[row.channel] ?? 0) + 1;
  }
  return counts;
}
