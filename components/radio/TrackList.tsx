"use client";

import { RadioTrack } from "@/lib/radio/types";
import { Music, Play, Pause } from "lucide-react";

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
    <div className="mt-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-semibold flex items-center gap-2">
          <Music className="w-4 h-4 text-primary" />
          Playlist · {tracks.length} tracce
        </h3>
      </div>

      <div className="bg-white/[0.03] rounded-xl border border-white/5 divide-y divide-white/5">
        {tracks.map((track, index) => {
          const isCurrent = index === currentIndex;
          const isCurrentPlaying = isCurrent && isPlaying;

          return (
            <button
              key={track.id}
              onClick={() => onSelectTrack(index)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 text-left group first:rounded-t-xl last:rounded-b-xl ${
                isCurrent
                  ? "bg-primary/10"
                  : "hover:bg-white/5"
              }`}
            >
              {/* Track number / play icon */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5 group-hover:bg-primary/20 transition-colors">
                {isCurrentPlaying ? (
                  <div className="flex items-center gap-0.5">
                    <span className="w-0.5 h-3 bg-primary rounded-full animate-pulse" />
                    <span className="w-0.5 h-4 bg-primary rounded-full animate-pulse [animation-delay:150ms]" />
                    <span className="w-0.5 h-2.5 bg-primary rounded-full animate-pulse [animation-delay:300ms]" />
                  </div>
                ) : isCurrent ? (
                  <Pause className="w-4 h-4 text-primary" />
                ) : (
                  <>
                    <span className="text-gray-500 text-sm group-hover:hidden">
                      {index + 1}
                    </span>
                    <Play className="w-4 h-4 text-white hidden group-hover:block" fill="white" />
                  </>
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
