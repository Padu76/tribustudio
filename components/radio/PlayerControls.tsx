"use client";

import { Play, Square, Volume2, VolumeX, SkipForward, SkipBack, Repeat, Repeat1 } from "lucide-react";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Props = {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  loop: "none" | "all" | "one";
  onPlay: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleLoop: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onSeek: (time: number) => void;
};

export default function PlayerControls({
  isPlaying,
  volume,
  isMuted,
  currentTime,
  duration,
  loop,
  onPlay,
  onStop,
  onNext,
  onPrev,
  onToggleLoop,
  onVolumeChange,
  onToggleMute,
  onSeek,
}: Props) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Seek Bar */}
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-xs tabular-nums w-10 text-right">
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 relative group">
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3.5
              [&::-webkit-slider-thumb]:h-3.5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:opacity-0
              [&::-webkit-slider-thumb]:group-hover:opacity-100
              [&::-webkit-slider-thumb]:transition-opacity"
            style={{
              background: `linear-gradient(to right, var(--color-primary, #e85d2a) ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
            }}
          />
        </div>
        <span className="text-gray-400 text-xs tabular-nums w-10">
          {formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Loop */}
        <button
          onClick={onToggleLoop}
          className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center ${
            loop === "none"
              ? "bg-white/10 hover:bg-white/20 text-gray-400"
              : "bg-primary/20 hover:bg-primary/30 text-primary"
          }`}
          aria-label={`Loop: ${loop}`}
          title={loop === "none" ? "Loop disattivo" : loop === "all" ? "Loop playlist" : "Loop traccia singola"}
        >
          {loop === "one" ? (
            <Repeat1 className="w-5 h-5" />
          ) : (
            <Repeat className="w-5 h-5" />
          )}
        </button>

        {/* Prev */}
        <button
          onClick={onPrev}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
          aria-label="Traccia precedente"
        >
          <SkipBack className="w-5 h-5 text-white" />
        </button>

        {/* Play / Stop */}
        {!isPlaying ? (
          <button
            onClick={onPlay}
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary-dark transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
            aria-label="Play"
          >
            <Play className="w-7 h-7 text-white ml-1" fill="white" />
          </button>
        ) : (
          <button
            onClick={onStop}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
            aria-label="Stop"
          >
            <Square className="w-6 h-6 text-white" fill="white" />
          </button>
        )}

        {/* Next */}
        <button
          onClick={onNext}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
          aria-label="Prossima traccia"
        >
          <SkipForward className="w-5 h-5 text-white" />
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2 flex-1 max-w-[180px]">
          <button
            onClick={onToggleMute}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
            aria-label={isMuted ? "Attiva audio" : "Disattiva audio"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
