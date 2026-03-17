// app/api/radio/tracks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getRandomTracksByChannel } from "@/lib/radio/tracks";
import { RadioChannel } from "@/lib/radio/types";

const VALID_CHANNELS: RadioChannel[] = [
  "gym-energy",
  "coffee-chill",
  "beauty-relax",
  "lounge-bar",
  "retail-background",
];

export async function GET(req: NextRequest) {
  const channel = req.nextUrl.searchParams.get("channel") as RadioChannel;

  if (!channel || !VALID_CHANNELS.includes(channel)) {
    return NextResponse.json(
      { error: "Canale non valido" },
      { status: 400 }
    );
  }

  const limit = parseInt(
    req.nextUrl.searchParams.get("limit") ?? "30",
    10
  );

  const tracks = await getRandomTracksByChannel(
    channel,
    Math.min(limit, 100)
  );

  return NextResponse.json({ tracks, channel });
}
