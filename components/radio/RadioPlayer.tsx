"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { RadioChannel, RadioTrack } from "@/lib/radio/types";
import ChannelSelector from "./ChannelSelector";
import PlayerControls from "./PlayerControls";
import NowPlaying from "./NowPlaying";

type Announcement = {
  id: string;
  file_url: string;
  text: string;
  duration_sec: number;
};

// Ogni quante tracce inserire un annuncio DJ
const ANNOUNCE_EVERY_N_TRACKS = 3;

export default function RadioPlayer() {
  const [channel, setChannel] = useState<RadioChannel>("gym-energy");
  const [tracks, setTracks] = useState<RadioTrack[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tracksSinceAnnouncement = useRef(0);

  const currentTrack = tracks[currentIndex] ?? null;

  const fetchTracks = useCallback(async (ch: RadioChannel) => {
    setLoading(true);
    try {
      const [tracksRes, announcementsRes] = await Promise.all([
        fetch(`/api/radio/tracks?channel=${ch}`),
        fetch(`/api/radio/announcements?channel=${ch}`),
      ]);
      const tracksData = await tracksRes.json();
      const announcementsData = await announcementsRes.json();
      setTracks(tracksData.tracks ?? []);
      setAnnouncements(announcementsData.announcements ?? []);
      setCurrentIndex(0);
      tracksSinceAnnouncement.current = 0;
    } catch (err) {
      console.error("Error fetching tracks:", err);
      setTracks([]);
      setAnnouncements([]);
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

  /**
   * Riproduce un annuncio DJ random, poi chiama il callback
   */
  const playAnnouncement = useCallback(
    (onComplete: () => void) => {
      if (announcements.length === 0) {
        onComplete();
        return;
      }

      const randomAnnouncement =
        announcements[Math.floor(Math.random() * announcements.length)];

      if (!audioRef.current) return;

      setIsAnnouncing(true);

      const handleAnnouncementEnd = () => {
        audioRef.current?.removeEventListener("ended", handleAnnouncementEnd);
        setIsAnnouncing(false);
        tracksSinceAnnouncement.current = 0;
        onComplete();
      };

      audioRef.current.addEventListener("ended", handleAnnouncementEnd);
      audioRef.current.src = randomAnnouncement.file_url;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().catch((err) => {
        console.error("Announcement play error:", err);
        audioRef.current?.removeEventListener("ended", handleAnnouncementEnd);
        setIsAnnouncing(false);
        onComplete();
      });
    },
    [announcements, volume, isMuted]
  );

  /**
   * Riproduce la traccia all'indice specificato
   */
  const playTrackAtIndex = useCallback(
    (index: number) => {
      const track = tracks[index];
      if (!track || !audioRef.current) return;

      audioRef.current.src = track.file_url;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().catch(console.error);
    },
    [tracks, volume, isMuted]
  );

  /**
   * Avanza alla prossima traccia, eventualmente con annuncio DJ
   */
  const advanceToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1 < tracks.length ? prev + 1 : 0;

      tracksSinceAnnouncement.current++;

      // Inserisci annuncio DJ ogni N tracce
      if (
        announcements.length > 0 &&
        tracksSinceAnnouncement.current >= ANNOUNCE_EVERY_N_TRACKS
      ) {
        playAnnouncement(() => playTrackAtIndex(next));
      } else {
        playTrackAtIndex(next);
      }

      return next;
    });
  }, [tracks, announcements, playAnnouncement, playTrackAtIndex]);

  const handlePlay = useCallback(() => {
    if (tracks.length === 0) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("ended", () => {
        // Non avanzare se stiamo suonando un annuncio
        if (!isAnnouncing) {
          advanceToNext();
        }
      });
    }

    const track = tracks[currentIndex];
    if (!track) return;

    audioRef.current.src = track.file_url;
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current.play().catch(console.error);
    setIsPlaying(true);
  }, [tracks, currentIndex, volume, isMuted, advanceToNext, isAnnouncing]);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsAnnouncing(false);
  }, []);

  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;

    if (isPlaying) {
      advanceToNext();
    } else {
      const nextIndex = (currentIndex + 1) % tracks.length;
      setCurrentIndex(nextIndex);
    }
  }, [tracks, currentIndex, isPlaying, advanceToNext]);

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
        <NowPlaying
          track={currentTrack}
          isPlaying={isPlaying}
          isAnnouncing={isAnnouncing}
        />

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
            {announcements.length > 0 && ` · ${announcements.length} annunci DJ`}
          </p>
        )}
      </div>
    </div>
  );
}
