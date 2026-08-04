"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Howl, Howler } from "howler"
import WaveSurfer from "wavesurfer.js"
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react"
import { getMusicDurationSeconds } from "@/lib/utils"
import type { Music as MusicType } from "@/types/entry"

interface MusicPlayerProps {
  music: MusicType
}

export function MusicPlayer({ music }: MusicPlayerProps) {
  const waveRef = useRef<HTMLDivElement>(null)
  const soundRef = useRef<Howl | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "playing" | "paused" | "error">("loading")
  const [muted, setMuted] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const hasStarted = useRef(false)
  const durationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const volumeRef = useRef(0.75)

  const audioUrl = music.source === "ITUNES" ? music.preview_url : music.file_url
  const durationSec = getMusicDurationSeconds(music.duration)

  // ── Init Howl ──
  useEffect(() => {
    if (!audioUrl) {
      setStatus("error")
      setErrorMsg("URL audio tidak tersedia")
      return
    }

    console.log("[MusicPlayer] Loading audio:", audioUrl)

    // Unlock AudioContext dulu
    Howler.autoUnlock = true
    Howler.html5PoolSize = 10

    const sound = new Howl({
      src: [audioUrl],
      html5: false, // Pakai Web Audio API
      format: ["mp3", "aac", "mp4"],
      volume: volumeRef.current,
      onload: () => {
        console.log("[MusicPlayer] Loaded OK, duration:", sound.duration())
        setStatus("ready")
      },
      onloaderror: (id, err) => {
        console.error("[MusicPlayer] Load error:", err)
        // Fallback ke html5
        setErrorMsg(`Load error: ${err}`)
        setStatus("error")
      },
      onplay: () => {
        console.log("[MusicPlayer] Playing")
        setStatus("playing")
      },
      onpause: () => setStatus("paused"),
      onstop: () => setStatus("paused"),
      onend: () => {
        setStatus("paused")
        hasStarted.current = false
      },
      onplayerror: (id, err) => {
        console.error("[MusicPlayer] Play error:", err)
        setErrorMsg(`Play error: ${err}`)
        // Try unlock
        Howler.ctx?.resume().then(() => {
          sound.play()
        })
      },
    })

    soundRef.current = sound

    // Expose untuk VideoSection
    ;(window as unknown as Record<string, unknown>).__musicPlayer = {
      fadeOut: (ms: number) => {
        if (sound.playing()) sound.fade(sound.volume(), 0, ms)
      },
      fadeIn: (ms: number) => {
        if (!sound.playing()) sound.play()
        sound.fade(sound.volume(), volumeRef.current, ms)
      },
    }

    return () => {
      if (durationTimerRef.current) clearTimeout(durationTimerRef.current)
      sound.stop()
      sound.unload()
      delete (window as unknown as Record<string, unknown>).__musicPlayer
    }
  }, [audioUrl])

  // ── Play function ──
  const doPlay = useCallback(() => {
    const sound = soundRef.current
    if (!sound) {
      console.warn("[MusicPlayer] sound is null")
      return
    }

    console.log("[MusicPlayer] doPlay called, state:", sound.state())

    if (sound.state() === "unloaded") {
      sound.load()
    }

    sound.seek(music.start_time ?? 0)
    sound.volume(volumeRef.current)
    sound.play()
    hasStarted.current = true

    if (durationTimerRef.current) clearTimeout(durationTimerRef.current)
    durationTimerRef.current = setTimeout(() => {
      if (soundRef.current?.playing()) {
        soundRef.current.fade(soundRef.current.volume(), 0, 500)
        setTimeout(() => {
          soundRef.current?.stop()
        }, 550)
      }
    }, durationSec * 1000)
  }, [music.start_time, durationSec])

  // ── Listen for first scroll → autoplay ──
  useEffect(() => {
    if (status !== "ready") return

    const onInteraction = () => {
      if (!hasStarted.current) {
        doPlay()
      }
      cleanup()
    }

    const cleanup = () => {
      window.removeEventListener("scroll", onInteraction)
      window.removeEventListener("wheel", onInteraction)
      window.removeEventListener("touchmove", onInteraction)
    }

    window.addEventListener("scroll", onInteraction, { passive: true, once: true })
    window.addEventListener("wheel", onInteraction, { passive: true, once: true })
    window.addEventListener("touchmove", onInteraction, { passive: true, once: true })

    return cleanup
  }, [status, doPlay])

  // ── Toggle play/pause ──
  const togglePlay = useCallback(() => {
    const sound = soundRef.current
    if (!sound) return

    if (sound.playing()) {
      sound.pause()
    } else {
      doPlay()
    }
  }, [doPlay])

  // ── WaveSurfer ──
  useEffect(() => {
    if (!waveRef.current || !audioUrl) return
    const ws = WaveSurfer.create({
      container: waveRef.current,
      waveColor: "#333333",
      progressColor: "#C8A96E",
      height: 26,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      interact: false,
      normalize: true,
      url: audioUrl,
    })
    return () => ws.destroy()
  }, [audioUrl])

  // ── Mute ──
  const toggleMute = () => {
    const sound = soundRef.current
    if (!sound) return
    if (muted) {
      sound.volume(volumeRef.current)
    } else {
      sound.volume(0)
    }
    setMuted((m) => !m)
  }

  if (!audioUrl) return null

  const isPlaying = status === "playing"
  const isLoading = status === "loading"

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] glass border-t border-white/[0.06]">
      <div className="flex items-center gap-4 px-10 h-[68px] max-w-screen-2xl mx-auto">

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#C8A96E]/15 hover:bg-[#C8A96E]/30 transition-all flex-shrink-0 relative"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <span className="w-3 h-3 rounded-full border-2 border-[#C8A96E] border-t-transparent animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 text-[#C8A96E]" />
          ) : (
            <Play className="w-4 h-4 text-[#C8A96E] translate-x-[1px]" />
          )}
          {/* Pulse ring saat ready tapi belum play */}
          {status === "ready" && (
            <span className="absolute inset-0 rounded-full border border-[#C8A96E]/50 animate-ping" />
          )}
        </button>

        {/* Album Art */}
        {music.album_art_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={music.album_art_url}
            alt={music.track_name ?? ""}
            className="w-9 h-9 rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-9 h-9 rounded bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
            <Music className="w-4 h-4 text-[#444]" />
          </div>
        )}

        {/* Track Info */}
        <div className="flex flex-col flex-shrink-0 min-w-0 w-44">
          <span className="text-[#F0EDE8] text-sm font-sans truncate leading-tight">
            {music.track_name ?? "Audio"}
          </span>
          <span className="text-[11px] font-sans tracking-wider truncate mt-0.5 text-[#555555]">
            {status === "loading" && "Memuat..."}
            {status === "ready" && "Scroll atau klik ▶ untuk mulai"}
            {status === "playing" && (music.artist_name ?? "Playing")}
            {status === "paused" && (music.artist_name ?? "Paused")}
            {status === "error" && `Error: ${errorMsg}`}
          </span>
        </div>

        {/* Waveform */}
        <div ref={waveRef} className="flex-1 opacity-70" />

        {/* Mute */}
        <button
          onClick={toggleMute}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors flex-shrink-0"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted
            ? <VolumeX className="w-4 h-4 text-[#444]" />
            : <Volume2 className="w-4 h-4 text-[#888]" />}
        </button>
      </div>
    </div>
  )
}
