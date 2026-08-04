"use client"

import { useCallback } from "react"

interface MusicPlayerGlobal {
  fadeOut: (ms: number) => void
  fadeIn: (ms: number) => void
}

function getPlayer(): MusicPlayerGlobal | null {
  return (window as unknown as Record<string, unknown>).__musicPlayer as MusicPlayerGlobal | null
}

export function useMusicPlayer() {
  const fadeOut = useCallback((ms: number) => {
    getPlayer()?.fadeOut(ms)
  }, [])

  const fadeIn = useCallback((ms: number) => {
    getPlayer()?.fadeIn(ms)
  }, [])

  return { fadeOut, fadeIn }
}
