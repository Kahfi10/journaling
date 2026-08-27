"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react"
import { getMusicDurationSeconds } from "@/lib/utils"
import type { Music as MusicType } from "@/types/entry"

interface MusicPlayerProps {
  music: MusicType | null
  autoplay?: boolean
  loop?: boolean
}

const DEFAULT_VOLUME = 0.72
const FADE_IN_MS = 900

function getTrackUrl(track: MusicType) {
  if (track.source === "ITUNES") {
    return track.preview_url ? `/api/audio/proxy?url=${encodeURIComponent(track.preview_url)}` : ""
  }

  return track.file_url ?? ""
}

export function MusicPlayer({ music, autoplay = true, loop = true }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const fadeFrameRef = useRef<number | null>(null)
  const interactionRef = useRef(false)
  const targetVolumeRef = useRef(DEFAULT_VOLUME)
  const mutedRef = useRef(false)
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "playing" | "paused" | "error">(
    music ? "loading" : "idle"
  )
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)

  const audioUrl = useMemo(() => (music ? getTrackUrl(music) : ""), [music])
  const durationSeconds = useMemo(() => (music ? getMusicDurationSeconds(music.duration) : 0), [music])

  const clearFade = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      window.cancelAnimationFrame(fadeFrameRef.current)
      fadeFrameRef.current = null
    }
  }, [])

  const fadeVolume = useCallback(
    (toVolume: number, durationMs: number) => {
      const audio = audioRef.current
      if (!audio) return

      clearFade()

      const fromVolume = audio.volume
      const start = window.performance.now()

      const step = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1)
        audio.volume = fromVolume + (toVolume - fromVolume) * progress

        if (progress < 1) {
          fadeFrameRef.current = window.requestAnimationFrame(step)
        }
      }

      fadeFrameRef.current = window.requestAnimationFrame(step)
    },
    [clearFade]
  )

  const startPlayback = useCallback(
    async (restart = false) => {
      const audio = audioRef.current
      if (!audio || !music) return false

      try {
        if (restart) {
          audio.currentTime = music.start_time ?? 0
        }

        audio.volume = mutedRef.current ? 0 : 0
        const playResult = audio.play()
        if (playResult) {
          await playResult
        }

        setPlaying(true)
        setStatus("playing")

        if (!mutedRef.current) {
          fadeVolume(targetVolumeRef.current, FADE_IN_MS)
        }

        return true
      } catch {
        setPlaying(false)
        setStatus("ready")
        return false
      }
    },
    [fadeVolume, music]
  )

  useEffect(() => {
    if (!audioUrl) {
      setStatus("idle")
      setPlaying(false)
      return
    }

    const controller = new AbortController()
    let audio: HTMLAudioElement | null = null
    let revokedObjectUrl: string | null = null
    setStatus("loading")
    setPlaying(false)

    const handlePlay = () => {
      setPlaying(true)
      setStatus("playing")
    }

    const handlePause = () => {
      setPlaying(false)
      setStatus("paused")
    }

    const handleEnded = () => {
      setPlaying(false)
      setStatus("paused")
    }

    const handleError = () => {
      setPlaying(false)
      setStatus("error")
    }

    const load = async () => {
      try {
        const response = await fetch(audioUrl, { cache: "no-store", signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Audio request failed: ${response.status}`)
        }

        const blob = await response.blob()
        if (controller.signal.aborted) return

        revokedObjectUrl = URL.createObjectURL(blob)
        objectUrlRef.current = revokedObjectUrl

        audio = new Audio(revokedObjectUrl)
        audioRef.current = audio
        audio.preload = "auto"
        audio.loop = loop
        audio.volume = mutedRef.current ? 0 : targetVolumeRef.current
        audio.addEventListener("play", handlePlay)
        audio.addEventListener("pause", handlePause)
        audio.addEventListener("ended", handleEnded)
        audio.addEventListener("error", handleError)
        audio.load()

        setStatus("ready")
        if (autoplay) {
          startPlayback(true).catch(() => undefined)
        }
      } catch {
        if (!controller.signal.aborted) {
          setPlaying(false)
          setStatus("error")
        }
      }
    }

    load().catch(() => undefined)

    const enableOnInteraction = () => {
      interactionRef.current = true
      if (autoplay) {
        startPlayback(true).catch(() => undefined)
      }
    }

    window.addEventListener("pointerdown", enableOnInteraction, { passive: true, once: true })
    window.addEventListener("keydown", enableOnInteraction, { passive: true, once: true })
    window.addEventListener("touchstart", enableOnInteraction, { passive: true, once: true })

    return () => {
      clearFade()
      controller.abort()
      if (audio) {
        audio.pause()
        audio.removeEventListener("play", handlePlay)
        audio.removeEventListener("pause", handlePause)
        audio.removeEventListener("ended", handleEnded)
        audio.removeEventListener("error", handleError)
      }
      window.removeEventListener("pointerdown", enableOnInteraction)
      window.removeEventListener("keydown", enableOnInteraction)
      window.removeEventListener("touchstart", enableOnInteraction)
      if (revokedObjectUrl) {
        URL.revokeObjectURL(revokedObjectUrl)
      }
      objectUrlRef.current = null
      audioRef.current = null
    }
  }, [audioUrl, autoplay, clearFade, loop, startPlayback])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = mutedRef.current ? 0 : targetVolumeRef.current
  }, [muted])

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio || !music) return

    interactionRef.current = true

    if (audio.paused) {
      startPlayback(false).catch(() => undefined)
      return
    }

    audio.pause()
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (muted) {
      audio.volume = 0
      if (playing) {
        fadeVolume(targetVolumeRef.current, 220)
      }
    } else {
      audio.volume = 0
    }

    mutedRef.current = !muted
    setMuted((value) => !value)
  }

  if (!music || !audioUrl) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] flex justify-center pointer-events-none">
      <div
        className="pointer-events-auto flex items-center gap-3 rounded-full border px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl"
        style={{
          background: "rgba(248,247,244,0.92)",
          borderColor: "var(--j-border)",
          color: "var(--j-text-1)",
        }}
      >
        <button
          type="button"
          onClick={togglePlayback}
          className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
          style={{ borderColor: "var(--j-border)", background: "var(--j-bg)", color: "var(--j-text-1)" }}
          aria-label={playing ? "Pause music" : "Play music"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        {music.album_art_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={music.album_art_url} alt={music.track_name ?? ""} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full border" style={{ borderColor: "var(--j-border)" }}>
            <Music className="h-4 w-4" style={{ color: "var(--j-text-3)" }} />
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-medium leading-tight">
            {music.track_name ?? "Background music"}
          </p>
          <p className="truncate text-[10px] tracking-[0.22em] uppercase" style={{ color: "var(--j-text-3)" }}>
            {status === "loading" && "Loading"}
            {status === "ready" && "Ready"}
            {status === "playing" && (music.artist_name ?? "Playing")}
            {status === "paused" && "Paused"}
            {status === "idle" && "Idle"}
            {status === "error" && "Unavailable"}
            {durationSeconds > 0 ? ` · ${Math.round(durationSeconds)}s loop` : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
          style={{ borderColor: "var(--j-border)", background: "var(--j-bg)", color: "var(--j-text-1)" }}
          aria-label={muted ? "Unmute music" : "Mute music"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
