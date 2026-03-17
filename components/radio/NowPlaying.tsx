"use client";

import { RadioTrack } from "@/lib/radio/types";
import { Music } from "lucide-react";

type Props = {
  track: RadioTrack | null;
  isPlaying: boolean;
};

export default function NowPlaying({ track, isPlaying }: Props) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center ${
          isPlaying ? "animate-pulse" : ""
        }`}
      >
        <Music className="w-6 h-6 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        {track ? (
          <>
            <p className="text-white font-semibold truncate">{track.title}</p>
            <p className="text-gray-400 text-sm truncate">
              {track.genre ?? "Tribù Radio"}
              {track.bpm ? ` · ${track.bpm} BPM` : ""}
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-400 font-medium">Nessuna traccia</p>
            <p className="text-gray-500 text-sm">
              Seleziona un canale e premi play
            </p>
          </>
        )}
      </div>
    </div>
  );
}
