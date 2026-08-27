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

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, value))
}

function encodeWav(samples: Float32Array, sampleRate: number) {
  const bytesPerSample = 2
  const blockAlign = bytesPerSample
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
  const view = new DataView(buffer)
  const writeString = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i))
    }
  }

  writeString(0, "RIFF")
  view.setUint32(4, 36 + samples.length * bytesPerSample, true)
  writeString(8, "WAVE")
  writeString(12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true)
  writeString(36, "data")
  view.setUint32(40, samples.length * bytesPerSample, true)

  let offset = 44
  for (let i = 0; i < samples.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
    offset += 2
  }

  return buffer
}

function createAmbientLoopUrl() {
  const sampleRate = 22050
  const durationSeconds = 12
  const totalSamples = sampleRate * durationSeconds
  const samples = new Float32Array(totalSamples)
  const freqs = [196, 246.94, 293.66, 392]

  for (let i = 0; i < totalSamples; i += 1) {
    const t = i / sampleRate
    const phase = t / durationSeconds
    const envelope = Math.sin(Math.PI * Math.min(phase, 1 - phase))
    const pad =
      Math.sin(2 * Math.PI * freqs[0] * t) * 0.16 +
      Math.sin(2 * Math.PI * freqs[1] * t * 0.5) * 0.14 +
      Math.sin(2 * Math.PI * freqs[2] * t * 0.25) * 0.12 +
      Math.sin(2 * Math.PI * freqs[3] * t * 0.125) * 0.08
    const texture = Math.sin(2 * Math.PI * 2.5 * t) * 0.03
    samples[i] = (pad + texture) * envelope
  }

  const wavBuffer = encodeWav(samples, sampleRate)
  return URL.createObjectURL(new Blob([wavBuffer], { type: "audio/wav" }))
}

export function MusicPlayer({ music, autoplay = true, loop = true }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeFrameRef = useRef<number | null>(null)
  const armedAutoplayRef = useRef(autoplay)
  const userInteractedRef = useRef(false)
  const loopUrlRef = useRef<string>("")
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "playing" | "paused" | "error">(
    music ? "loading" : "idle"
  )
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)

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
        audio.volume = clampVolume(fromVolume + (toVolume - fromVolume) * progress)

        if (progress < 1) {
          fadeFrameRef.current = window.requestAnimationFrame(step)
        }
      }

      fadeFrameRef.current = window.requestAnimationFrame(step)
    },
    [clearFade]
  )

  useEffect(() => {
    const url = createAmbientLoopUrl()
    loopUrlRef.current = url
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = muted ? 0 : clampVolume(DEFAULT_VOLUME)
  }, [muted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !loopUrlRef.current) return

    const handlePlay = () => {
      setPlaying(true)
      setStatus("playing")
    }

    const handlePlaying = () => {
      setPlaying(true)
      setStatus("playing")

      if (armedAutoplayRef.current) {
        armedAutoplayRef.current = false
        audio.muted = false
        audio.volume = 0
        if (!muted) {
          fadeVolume(DEFAULT_VOLUME, FADE_IN_MS)
        }
      }
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

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("playing", handlePlaying)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      clearFade()
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("playing", handlePlaying)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [clearFade, fadeVolume, muted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !loopUrlRef.current) return

    audio.src = loopUrlRef.current
    audio.loop = loop
    audio.preload = "auto"
    audio.muted = autoplay && !userInteractedRef.current
    audio.volume = muted ? 0 : clampVolume(DEFAULT_VOLUME)
    audio.load()
    setStatus("loading")
    setPlaying(false)

    const onCanPlay = () => {
      setStatus("ready")
      if (autoplay && !userInteractedRef.current) {
        armedAutoplayRef.current = true
        audio.play().catch(() => {
          setStatus("ready")
        })
      }
    }

    audio.addEventListener("canplay", onCanPlay)

    return () => {
      audio.removeEventListener("canplay", onCanPlay)
    }
  }, [autoplay, loop, muted])

  const startPlayback = () => {
    const audio = audioRef.current
    if (!audio) return

    userInteractedRef.current = true
    armedAutoplayRef.current = false
    audio.muted = false
    audio.volume = muted ? 0 : clampVolume(DEFAULT_VOLUME)
    const result = audio.play()
    if (result) {
      result.catch(() => {
        setStatus("ready")
      })
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (muted) {
      audio.muted = false
      audio.volume = clampVolume(DEFAULT_VOLUME)
      if (playing) {
        fadeVolume(clampVolume(DEFAULT_VOLUME), 220)
      }
    } else {
      audio.muted = true
      audio.volume = 0
    }

    setMuted((value) => !value)
  }

  if (!music) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] flex justify-center pointer-events-none">
      <audio ref={audioRef} className="hidden" />
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
          onClick={startPlayback}
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
            {music.track_name ?? "Background loop"}
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
