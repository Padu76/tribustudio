"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { RadioChannel, RadioTrack } from "@/lib/radio/types";
import ChannelSelector from "./ChannelSelector";
import PlayerControls from "./PlayerControls";
import NowPlaying from "./NowPlaying";
import TrackList from "./TrackList";

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loop, setLoop] = useState<"none" | "all" | "one">("all");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tracksSinceAnnouncement = useRef(0);
  const animFrameRef = useRef<number>(0);

  const currentTrack = tracks[currentIndex] ?? null;

  // Aggiorna currentTime tramite requestAnimationFrame
  const startTimeUpdate = useCallback(() => {
    const update = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
      animFrameRef.current = requestAnimationFrame(update);
    };
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(update);
  }, []);

  const stopTimeUpdate = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
  }, []);

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

  // Cleanup animFrame on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

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
      startTimeUpdate();
    },
    [tracks, volume, isMuted, startTimeUpdate]
  );

  /**
   * Avanza alla prossima traccia, eventualmente con annuncio DJ
   */
  const advanceToNext = useCallback(() => {
    // Loop singola traccia: ri-riproduce la stessa
    if (loop === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
      return;
    }

    setCurrentIndex((prev) => {
      const isLast = prev + 1 >= tracks.length;

      // Se non c'è loop e siamo all'ultima traccia, fermati
      if (isLast && loop === "none") {
        setIsPlaying(false);
        return prev;
      }

      const next = isLast ? 0 : prev + 1;

      tracksSinceAnnouncement.current++;

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
  }, [tracks, announcements, playAnnouncement, playTrackAtIndex, loop]);

  const ensureAudioElement = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("ended", () => {
        advanceToNext();
      });
    }
  }, [advanceToNext]);

  const handlePlay = useCallback(() => {
    if (tracks.length === 0) return;

    ensureAudioElement();

    const track = tracks[currentIndex];
    if (!track) return;

    audioRef.current!.src = track.file_url;
    audioRef.current!.volume = isMuted ? 0 : volume;
    audioRef.current!.play().catch(console.error);
    setIsPlaying(true);
    startTimeUpdate();
  }, [tracks, currentIndex, volume, isMuted, ensureAudioElement, startTimeUpdate]);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsAnnouncing(false);
    setCurrentTime(0);
    stopTimeUpdate();
  }, [stopTimeUpdate]);

  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;

    if (isPlaying) {
      advanceToNext();
    } else {
      const nextIndex = (currentIndex + 1) % tracks.length;
      setCurrentIndex(nextIndex);
    }
  }, [tracks, currentIndex, isPlaying, advanceToNext]);

  const handlePrev = useCallback(() => {
    if (tracks.length === 0) return;

    // Se siamo oltre i 3 secondi, ricomincia la traccia corrente
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    setCurrentIndex(prevIndex);

    if (isPlaying) {
      ensureAudioElement();
      const track = tracks[prevIndex];
      if (track && audioRef.current) {
        audioRef.current.src = track.file_url;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.play().catch(console.error);
        startTimeUpdate();
      }
    }
  }, [tracks, currentIndex, isPlaying, volume, isMuted, ensureAudioElement, startTimeUpdate]);

  const handleToggleLoop = useCallback(() => {
    setLoop((prev) => {
      if (prev === "none") return "all";
      if (prev === "all") return "one";
      return "none";
    });
  }, []);

  const handleSeek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleSelectTrack = useCallback(
    (index: number) => {
      setCurrentIndex(index);

      if (isPlaying) {
        ensureAudioElement();
        const track = tracks[index];
        if (track && audioRef.current) {
          audioRef.current.src = track.file_url;
          audioRef.current.volume = isMuted ? 0 : volume;
          audioRef.current.play().catch(console.error);
          startTimeUpdate();
        }
      }
    },
    [isPlaying, tracks, volume, isMuted, ensureAudioElement, startTimeUpdate]
  );

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
          currentTime={currentTime}
          duration={duration}
          loop={loop}
          onPlay={handlePlay}
          onStop={handleStop}
          onNext={handleNext}
          onPrev={handlePrev}
          onToggleLoop={handleToggleLoop}
          onVolumeChange={setVolume}
          onToggleMute={() => setIsMuted((m) => !m)}
          onSeek={handleSeek}
        />

        {loading && (
          <p className="text-gray-500 text-sm">Caricamento tracce...</p>
        )}

        {!loading && tracks.length === 0 && (
          <p className="text-gray-500 text-sm">
            Nessuna traccia disponibile per questo canale.
          </p>
        )}
      </div>

      {/* Track List - Separata e ben visibile */}
      {tracks.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <TrackList
            tracks={tracks}
            currentIndex={currentIndex}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
          />

          {announcements.length > 0 && (
            <p className="text-gray-500 text-xs mt-3">
              {announcements.length} annunci DJ attivi
            </p>
          )}
        </div>
      )}
    </div>
  );
}
