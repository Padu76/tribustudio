"use client";

import { useState } from "react";
import { RadioTrack, RadioChannel } from "@/lib/radio/types";
import { RADIO_CHANNELS } from "@/lib/radio/constants";
import { Music, Play, Pause, Trash2, ArrowRightLeft } from "lucide-react";

type Props = {
  tracks: RadioTrack[];
  currentIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number) => void;
  adminMode?: boolean;
  onDeleteTrack?: (trackId: string) => void;
  onMoveTrack?: (trackId: string, newChannel: RadioChannel) => void;
  currentChannel?: RadioChannel;
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
  adminMode = false,
  onDeleteTrack,
  onMoveTrack,
  currentChannel,
}: Props) {
  const [movingTrackId, setMovingTrackId] = useState<string | null>(null);
  const [deletingTrackId, setDeletingTrackId] = useState<string | null>(null);

  if (tracks.length === 0) return null;

  const otherChannels = RADIO_CHANNELS.filter((c) => c.id !== currentChannel);

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
          const isMoving = movingTrackId === track.id;
          const isDeleting = deletingTrackId === track.id;

          return (
            <div key={track.id} className="relative">
              <div
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 text-left group first:rounded-t-xl last:rounded-b-xl ${
                  isCurrent ? "bg-primary/10" : "hover:bg-white/5"
                }`}
              >
                {/* Track number / play icon */}
                <button
                  onClick={() => onSelectTrack(index)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5 group-hover:bg-primary/20 transition-colors"
                >
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
                      <Play
                        className="w-4 h-4 text-white hidden group-hover:block"
                        fill="white"
                      />
                    </>
                  )}
                </button>

                {/* Track info */}
                <button
                  onClick={() => onSelectTrack(index)}
                  className="min-w-0 flex-1 text-left"
                >
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
                </button>

                {/* Duration */}
                <span className="text-gray-500 text-xs tabular-nums flex-shrink-0">
                  {formatDuration(track.duration_sec)}
                </span>

                {/* Admin controls */}
                {adminMode && (
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMovingTrackId(isMoving ? null : track.id);
                        setDeletingTrackId(null);
                      }}
                      title="Sposta in altro canale"
                      className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isDeleting) {
                          onDeleteTrack?.(track.id);
                          setDeletingTrackId(null);
                        } else {
                          setDeletingTrackId(track.id);
                          setMovingTrackId(null);
                        }
                      }}
                      title={isDeleting ? "Conferma eliminazione" : "Elimina traccia"}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDeleting
                          ? "bg-red-500/20 text-red-400"
                          : "hover:bg-white/10 text-gray-400 hover:text-red-400"
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Move channel dropdown */}
              {adminMode && isMoving && (
                <div className="px-4 py-2 bg-white/[0.06] border-t border-white/5">
                  <p className="text-gray-400 text-xs mb-2">Sposta in:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {otherChannels.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => {
                          onMoveTrack?.(track.id, ch.id);
                          setMovingTrackId(null);
                        }}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-primary/20 text-gray-300 hover:text-white transition-colors"
                      >
                        {ch.icon} {ch.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delete confirmation */}
              {adminMode && isDeleting && (
                <div className="px-4 py-2 bg-red-500/5 border-t border-red-500/10">
                  <p className="text-red-400 text-xs">
                    Clicca di nuovo il cestino per confermare l&apos;eliminazione
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
