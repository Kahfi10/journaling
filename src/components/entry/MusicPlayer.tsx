"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Howl, Howler } from "howler"
import WaveSurfer from "wavesurfer.js"
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react"
import { getMusicDurationSeconds } from "@/lib/utils"
import type { Music as MusicType } from "@/types/entry"

interface MusicPlayerProps {
  music: MusicType | null
}

export function MusicPlayer({ music }: MusicPlayerProps) {
  const waveRef = useRef<HTMLDivElement>(null)
  const soundRef = useRef<Howl | null>(null)
  const [activeMusic, setActiveMusic] = useState<MusicType | null>(music)
  const [status, setStatus] = useState<"loading" | "ready" | "playing" | "paused" | "error">("loading")
  const [muted, setMuted] = useState(false)
  const hasStarted = useRef(false)
  const durationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const volumeRef = useRef(0.75)
  const autoPlayRef = useRef(false)

  const audioUrl = activeMusic ? (activeMusic.source === "ITUNES" ? activeMusic.preview_url : activeMusic.file_url) : null
  const durationSec = activeMusic ? getMusicDurationSeconds(activeMusic.duration) : 0

  const stopCurrentSound = useCallback(() => {
    if (durationTimerRef.current) clearTimeout(durationTimerRef.current)
    if (soundRef.current) {
      soundRef.current.stop()
      soundRef.current.unload()
      soundRef.current = null
    }
  }, [])

  const doPlay = useCallback(() => {
    const sound = soundRef.current
    if (!sound || !activeMusic) return
    if (sound.state() === "unloaded") sound.load()
    sound.seek(activeMusic.start_time ?? 0)
    sound.volume(volumeRef.current)
    sound.play()
    hasStarted.current = true
    if (durationTimerRef.current) clearTimeout(durationTimerRef.current)
    durationTimerRef.current = setTimeout(() => {
      if (soundRef.current?.playing()) {
        soundRef.current.fade(soundRef.current.volume(), 0, 500)
        setTimeout(() => soundRef.current?.stop(), 550)
      }
    }, durationSec * 1000)
  }, [activeMusic, durationSec])

  const switchTrack = useCallback((nextMusic: MusicType) => {
    autoPlayRef.current = true
    hasStarted.current = false
    setStatus("loading")
    stopCurrentSound()
    setMuted(false)
    setActiveMusic(nextMusic)
  }, [stopCurrentSound])

  useEffect(() => {
    if (!activeMusic || !audioUrl) {
      setStatus("paused")
      ;(window as unknown as Record<string, unknown>).__musicPlayer = {
        fadeOut: () => undefined,
        fadeIn: () => undefined,
        playTrack: switchTrack,
      }
      return () => {
        delete (window as unknown as Record<string, unknown>).__musicPlayer
      }
    }
    Howler.autoUnlock = true
    const sound = new Howl({
      src: [audioUrl],
      html5: true,
      format: ["mp3", "aac", "mp4", "m4a"],
      volume: volumeRef.current,
      onload: () => setStatus("ready"),
      onloaderror: (_id, err) => { console.error("[Music] load error:", err); setStatus("error") },
      onplay: () => setStatus("playing"),
      onpause: () => setStatus("paused"),
      onstop: () => setStatus("paused"),
      onend: () => { setStatus("paused"); hasStarted.current = false },
      onplayerror: (_id, err) => {
        console.error("[Music] play error:", err)
        Howler.ctx?.resume().then(() => sound.play())
      },
    })
    soundRef.current = sound
    ;(window as unknown as Record<string, unknown>).__musicPlayer = {
      fadeOut: (ms: number) => { if (sound.playing()) sound.fade(sound.volume(), 0, ms) },
      fadeIn: (ms: number) => { if (!sound.playing()) sound.play(); sound.fade(sound.volume(), volumeRef.current, ms) },
      playTrack: switchTrack,
    }
    if (autoPlayRef.current) {
      autoPlayRef.current = false
      const startWhenReady = () => doPlay()
      sound.once("load", startWhenReady)
    }
    return () => {
      if (durationTimerRef.current) clearTimeout(durationTimerRef.current)
      sound.stop()
      sound.unload()
      delete (window as unknown as Record<string, unknown>).__musicPlayer
    }
  }, [activeMusic, audioUrl, doPlay, switchTrack])

  // Autoplay on first scroll
  useEffect(() => {
    if (status !== "ready") return
    const onInteraction = () => { if (!hasStarted.current) doPlay() }
    window.addEventListener("scroll", onInteraction, { passive: true, once: true })
    window.addEventListener("wheel", onInteraction, { passive: true, once: true })
    return () => { window.removeEventListener("scroll", onInteraction); window.removeEventListener("wheel", onInteraction) }
  }, [status, doPlay])

  const togglePlay = useCallback(() => {
    const sound = soundRef.current
    if (!sound) return
    if (sound.playing()) { sound.fade(sound.volume(), 0, 200); setTimeout(() => sound.pause(), 220) }
    else doPlay()
  }, [doPlay])

  const toggleMute = () => {
    const sound = soundRef.current
    if (!sound) return
    if (muted) { sound.volume(volumeRef.current) } else { sound.volume(0) }
    setMuted(m => !m)
  }

  useEffect(() => {
    if (!waveRef.current || !audioUrl) return
    const ws = WaveSurfer.create({
      container: waveRef.current,
      waveColor: "rgba(17,17,17,0.15)",
      progressColor: "rgba(17,17,17,0.6)",
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

  if (!audioUrl) return null

  const isPlaying = status === "playing"
  const isLoading = status === "loading"

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t" style={{
      background: "rgba(248,247,244,0.92)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderColor: "var(--j-border)",
    }}>
      <div className="flex items-center gap-3 px-4 sm:px-8 md:px-10 h-[56px] sm:h-[64px] max-w-screen-2xl mx-auto">

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 relative transition-colors"
          style={{ background: "var(--j-bg-alt)", border: "1px solid var(--j-border)" }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <span className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--j-text-3)" }} />
          ) : isPlaying ? (
            <Pause className="w-3.5 h-3.5" style={{ color: "var(--j-text-1)" }} />
          ) : (
            <Play className="w-3.5 h-3.5 translate-x-[1px]" style={{ color: "var(--j-text-1)" }} />
          )}
          {status === "ready" && (
            <span className="absolute inset-0 rounded-full border animate-ping opacity-50" style={{ borderColor: "var(--j-text-2)" }} />
          )}
        </button>

        {/* Album Art */}
        {music.album_art_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={music.album_art_url} alt={music.track_name ?? ""} className="w-8 h-8 rounded object-cover flex-shrink-0" style={{ border: "1px solid var(--j-border)" }} />
        ) : (
          <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: "var(--j-bg-alt)", border: "1px solid var(--j-border)" }}>
            <Music className="w-3.5 h-3.5" style={{ color: "var(--j-text-3)" }} />
          </div>
        )}

        {/* Track Info */}
        <div className="flex flex-col flex-shrink-0 min-w-0 w-44">
          <span className="text-sm font-medium truncate leading-tight" style={{ color: "var(--j-text-1)" }}>
          {activeMusic?.track_name ?? "Audio"}
          </span>
          <span className="text-[10px] tracking-wider truncate mt-0.5" style={{ color: "var(--j-text-3)" }}>
            {status === "loading" && "Memuat..."}
            {status === "ready" && "Scroll untuk mulai"}
          {status === "playing" && (activeMusic?.artist_name ?? "")}
          {status === "paused" && (activeMusic?.artist_name ?? "")}
            {status === "error" && "Tidak tersedia"}
          </span>
        </div>

        {/* Waveform — hide on mobile */}
        <div ref={waveRef} className="hidden sm:block flex-1" />

        {/* Mute */}
        <button onClick={toggleMute} className="w-7 h-7 flex items-center justify-center rounded flex-shrink-0 transition-colors hover:opacity-60" aria-label={muted ? "Unmute" : "Mute"}>
          {muted
            ? <VolumeX className="w-3.5 h-3.5" style={{ color: "var(--j-text-3)" }} />
            : <Volume2 className="w-3.5 h-3.5" style={{ color: "var(--j-text-2)" }} />}
        </button>
      </div>
    </div>
  )
}
