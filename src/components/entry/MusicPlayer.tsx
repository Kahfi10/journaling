"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Howl, Howler } from "howler"
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react"
import { getMusicDurationSeconds } from "@/lib/utils"
import type { Music as MusicType } from "@/types/entry"

interface MusicPlayerProps {
  music: MusicType | null
}

function getTrackUrl(track: MusicType) {
  if (track.source === "ITUNES") {
    return track.preview_url ? `/api/audio/proxy?url=${encodeURIComponent(track.preview_url)}` : ""
  }

  return track.file_url
}

export function MusicPlayer({ music }: MusicPlayerProps) {
  const soundRef = useRef<Howl | null>(null)
  const [activeMusic, setActiveMusic] = useState<MusicType | null>(music)
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "playing" | "paused" | "error">(
    music ? "loading" : "idle"
  )
  const [muted, setMuted] = useState(false)
  const volumeRef = useRef(0.72)
  const mutedRef = useRef(false)
  const pendingAutoplayRef = useRef(true)
  const userInteractedRef = useRef(false)
  const durationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const audioUrl = useMemo(() => (activeMusic ? getTrackUrl(activeMusic) : ""), [activeMusic])
  const durationSec = useMemo(() => (activeMusic ? getMusicDurationSeconds(activeMusic.duration) : 0), [activeMusic])

  const clearCurrentSound = useCallback(() => {
    if (durationTimerRef.current) {
      clearTimeout(durationTimerRef.current)
      durationTimerRef.current = null
    }

    if (soundRef.current) {
      soundRef.current.stop()
      soundRef.current.unload()
      soundRef.current = null
    }
  }, [])

  const playCurrentSound = useCallback(() => {
    const sound = soundRef.current
    if (!sound || !activeMusic) return

    sound.seek(activeMusic.start_time ?? 0)
    sound.volume(mutedRef.current ? 0 : volumeRef.current)
    sound.play()
  }, [activeMusic])

  const allowPlaybackIfReady = useCallback(() => {
    if (!userInteractedRef.current) return
    if (!pendingAutoplayRef.current) return
    if (status !== "ready") return

    pendingAutoplayRef.current = false
    playCurrentSound()
  }, [playCurrentSound, status])

  const switchTrack = useCallback(
    (nextMusic: MusicType) => {
      const nextUrl = getTrackUrl(nextMusic)
      const currentUrl = activeMusic ? getTrackUrl(activeMusic) : ""
      const sameTrack = currentUrl === nextUrl

      pendingAutoplayRef.current = true

      if (sameTrack && soundRef.current) {
        setActiveMusic(nextMusic)
        setStatus(soundRef.current.playing() ? "playing" : "ready")
        soundRef.current.seek(nextMusic.start_time ?? 0)
        soundRef.current.volume(mutedRef.current ? 0 : volumeRef.current)
        if (!soundRef.current.playing()) {
          soundRef.current.play()
        }
        return
      }

      clearCurrentSound()
      setMuted(false)
      setStatus("loading")
      setActiveMusic(nextMusic)
    },
    [activeMusic, clearCurrentSound]
  )

  useEffect(() => {
    ;(window as unknown as Record<string, unknown>).__musicPlayer = {
      playTrack: switchTrack,
      fadeOut: (ms: number) => {
        const sound = soundRef.current
        if (sound?.playing()) {
          sound.fade(sound.volume(), 0, ms)
        }
      },
      fadeIn: (ms: number) => {
        const sound = soundRef.current
        if (sound && !sound.playing()) {
          sound.play()
        }
        if (sound) {
          sound.fade(sound.volume(), mutedRef.current ? 0 : volumeRef.current, ms)
        }
      },
    }

    const markInteraction = () => {
      userInteractedRef.current = true
      allowPlaybackIfReady()
    }

    window.addEventListener("pointerdown", markInteraction, { passive: true, once: true })
    window.addEventListener("keydown", markInteraction, { passive: true, once: true })
    window.addEventListener("touchstart", markInteraction, { passive: true, once: true })

    return () => {
      delete (window as unknown as Record<string, unknown>).__musicPlayer
      window.removeEventListener("pointerdown", markInteraction)
      window.removeEventListener("keydown", markInteraction)
      window.removeEventListener("touchstart", markInteraction)
    }
  }, [allowPlaybackIfReady, switchTrack])

  useEffect(() => {
    if (!activeMusic || !audioUrl) {
      setStatus("idle")
      return
    }

    Howler.autoUnlock = true

    const sound = new Howl({
      src: [audioUrl],
      html5: true,
      format: ["mp3", "aac", "mp4", "m4a"],
      volume: mutedRef.current ? 0 : volumeRef.current,
      preload: true,
      onload: () => {
        setStatus("ready")
        allowPlaybackIfReady()
      },
      onloaderror: (_id, err) => {
        console.error("[Music] load error:", err)
        setStatus("error")
      },
      onplay: () => setStatus("playing"),
      onpause: () => setStatus("paused"),
      onstop: () => setStatus("paused"),
      onend: () => {
        setStatus("paused")
        if (durationTimerRef.current) {
          clearTimeout(durationTimerRef.current)
          durationTimerRef.current = null
        }
      },
      onplayerror: (_id, err) => {
        console.warn("[Music] play blocked:", err)
        setStatus("ready")
      },
    })

    soundRef.current = sound

    return () => {
      clearCurrentSound()
    }
  }, [activeMusic, audioUrl, allowPlaybackIfReady, clearCurrentSound, playCurrentSound])

  useEffect(() => {
    const sound = soundRef.current
    if (!sound) return
    sound.volume(muted ? 0 : volumeRef.current)
  }, [muted])

  useEffect(() => {
    const sound = soundRef.current
    if (!sound || status !== "playing" || !durationSec) return

    if (durationTimerRef.current) {
      clearTimeout(durationTimerRef.current)
    }

    durationTimerRef.current = setTimeout(() => {
      if (soundRef.current?.playing()) {
        soundRef.current.fade(soundRef.current.volume(), 0, 220)
        window.setTimeout(() => soundRef.current?.stop(), 250)
      }
    }, durationSec * 1000)
  }, [durationSec, status])

  const toggleMute = () => {
    const sound = soundRef.current
    if (!sound) return

    if (muted) {
      sound.volume(volumeRef.current)
    } else {
      sound.volume(0)
    }

    mutedRef.current = !muted
    setMuted((value) => !value)
  }

  const togglePlayback = () => {
    const sound = soundRef.current
    if (!sound || !activeMusic) return
    userInteractedRef.current = true

    if (sound.playing()) {
      sound.pause()
      return
    }

    if (sound.state() === "loaded") {
      sound.seek(activeMusic.start_time ?? 0)
      sound.volume(mutedRef.current ? 0 : volumeRef.current)
      sound.play()
      return
    }

    if (sound.state() === "unloaded") {
      sound.load()
      return
    }

    sound.play()
  }

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
          aria-label={status === "playing" ? "Pause" : "Play"}
          disabled={!activeMusic || status === "idle" || status === "error"}
        >
          {status === "playing" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        {activeMusic?.album_art_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeMusic.album_art_url} alt={activeMusic.track_name ?? ""} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full border" style={{ borderColor: "var(--j-border)" }}>
            <Music className="h-4 w-4" style={{ color: "var(--j-text-3)" }} />
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-medium leading-tight">
            {activeMusic?.track_name ?? "Music ready"}
          </p>
          <p className="truncate text-[10px] tracking-[0.22em] uppercase" style={{ color: "var(--j-text-3)" }}>
            {status === "loading" && "Loading"}
            {status === "ready" && "Autoplay"}
            {status === "playing" && (activeMusic?.artist_name ?? "Playing")}
            {status === "paused" && "Paused"}
            {status === "idle" && "Waiting"}
            {status === "error" && "Unavailable"}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
          style={{ borderColor: "var(--j-border)", background: "var(--j-bg)", color: "var(--j-text-1)" }}
          aria-label={muted ? "Unmute" : "Mute"}
          disabled={!soundRef.current}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
