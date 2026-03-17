// app/api/radio/channels/route.ts
import { NextResponse } from "next/server";
import { RADIO_CHANNELS } from "@/lib/radio/constants";
import { getChannelTrackCount } from "@/lib/radio/tracks";

export async function GET() {
  const counts = await getChannelTrackCount();

  const channels = RADIO_CHANNELS.map((ch) => ({
    ...ch,
    trackCount: counts[ch.id] ?? 0,
  }));

  return NextResponse.json({ channels });
}
