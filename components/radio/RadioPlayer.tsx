"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { RadioChannel, RadioTrack } from "@/lib/radio/types";
import ChannelSelector from "./ChannelSelector";
import PlayerControls from "./PlayerControls";
import NowPlaying from "./NowPlaying";

export default function RadioPlayer() {
  const [channel, setChannel] = useState<RadioChannel>("gym-energy");
  const [tracks, setTracks] = useState<RadioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentIndex] ?? null;

  const fetchTracks = useCallback(async (ch: RadioChannel) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/radio/tracks?channel=${ch}`);
      const data = await res.json();
      setTracks(data.tracks ?? []);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Error fetching tracks:", err);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tracks when channel changes
  useEffect(() => {
    fetchTracks(channel);
  }, [channel, fetchTracks]);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlay = useCallback(() => {
    if (tracks.length === 0) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("ended", () => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          return next < tracks.length ? next : 0;
        });
      });
    }

    const track = tracks[currentIndex];
    if (!track) return;

    audioRef.current.src = track.file_url;
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current.play().catch(console.error);
    setIsPlaying(true);
  }, [tracks, currentIndex, volume, isMuted]);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentIndex(nextIndex);

    if (isPlaying && audioRef.current) {
      const track = tracks[nextIndex];
      if (track) {
        audioRef.current.src = track.file_url;
        audioRef.current.play().catch(console.error);
      }
    }
  }, [tracks, currentIndex, isPlaying]);

  // Auto-play next track when currentIndex changes and already playing
  useEffect(() => {
    if (isPlaying && audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.file_url;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().catch(console.error);
    }
    // Only trigger on currentIndex change from "ended" event
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChannelChange = useCallback(
    (ch: RadioChannel) => {
      if (ch === channel) return;
      handleStop();
      setChannel(ch);
    },
    [channel, handleStop]
  );

  return (
    <div className="space-y-8">
      {/* Channel Selector */}
      <div>
        <h2 className="text-white text-lg font-semibold mb-4">
          Scegli il tuo canale
        </h2>
        <ChannelSelector selected={channel} onSelect={handleChannelChange} />
      </div>

      {/* Player Bar */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-6">
        <NowPlaying track={currentTrack} isPlaying={isPlaying} />

        <PlayerControls
          isPlaying={isPlaying}
          volume={volume}
          isMuted={isMuted}
          onPlay={handlePlay}
          onStop={handleStop}
          onNext={handleNext}
          onVolumeChange={setVolume}
          onToggleMute={() => setIsMuted((m) => !m)}
        />

        {loading && (
          <p className="text-gray-500 text-sm">Caricamento tracce...</p>
        )}

        {!loading && tracks.length === 0 && (
          <p className="text-gray-500 text-sm">
            Nessuna traccia disponibile per questo canale.
          </p>
        )}

        {tracks.length > 0 && (
          <p className="text-gray-500 text-xs">
            {tracks.length} tracce disponibili · Traccia {currentIndex + 1} di{" "}
            {tracks.length}
          </p>
        )}
      </div>
    </div>
  );
}
