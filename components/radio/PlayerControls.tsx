"use client";

import { Play, Square, Volume2, VolumeX, SkipForward } from "lucide-react";

type Props = {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onPlay: () => void;
  onStop: () => void;
  onNext: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
};

export default function PlayerControls({
  isPlaying,
  volume,
  isMuted,
  onPlay,
  onStop,
  onNext,
  onVolumeChange,
  onToggleMute,
}: Props) {
  return (
    <div className="flex items-center gap-6">
      {/* Play / Stop */}
      <div className="flex items-center gap-3">
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

        <button
          onClick={onNext}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
          aria-label="Prossima traccia"
        >
          <SkipForward className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 flex-1 max-w-xs">
        <button
          onClick={onToggleMute}
          className="text-gray-400 hover:text-white transition-colors"
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
  );
}
