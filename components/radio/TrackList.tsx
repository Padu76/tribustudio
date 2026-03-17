"use client";

import { RadioTrack } from "@/lib/radio/types";
import { Music, Play } from "lucide-react";

type Props = {
  tracks: RadioTrack[];
  currentIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number) => void;
};

function formatDuration(sec: number | null): string {
  if (!sec) return "--:--";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackList({
  tracks,
  currentIndex,
  isPlaying,
  onSelectTrack,
}: Props) {
  if (tracks.length === 0) return null;

  return (
    <div className="space-y-1">
      <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">
        Tracce disponibili
      </h3>
      <div className="max-h-64 overflow-y-auto space-y-0.5 scrollbar-thin">
        {tracks.map((track, index) => {
          const isCurrent = index === currentIndex;
          return (
            <button
              key={track.id}
              onClick={() => onSelectTrack(index)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left group ${
                isCurrent
                  ? "bg-primary/15 border border-primary/30"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              {/* Track number / play icon */}
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                {isCurrent && isPlaying ? (
                  <div className="flex items-center gap-0.5">
                    <span className="w-0.5 h-3 bg-primary rounded-full animate-pulse" />
                    <span className="w-0.5 h-4 bg-primary rounded-full animate-pulse [animation-delay:150ms]" />
                    <span className="w-0.5 h-2.5 bg-primary rounded-full animate-pulse [animation-delay:300ms]" />
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm group-hover:hidden">
                    {index + 1}
                  </span>
                )}
                {!(isCurrent && isPlaying) && (
                  <Play className="w-4 h-4 text-white hidden group-hover:block" fill="white" />
                )}
              </div>

              {/* Track info */}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium truncate ${
                    isCurrent ? "text-primary" : "text-white"
                  }`}
                >
                  {track.title}
                </p>
                <p className="text-gray-500 text-xs truncate">
                  {track.genre ?? "Tribù Radio"}
                  {track.bpm ? ` · ${track.bpm} BPM` : ""}
                </p>
              </div>

              {/* Duration */}
              <span className="text-gray-500 text-xs tabular-nums flex-shrink-0">
                {formatDuration(track.duration_sec)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
