"use client"

import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { gsap } from "gsap"
import { useRef, type RefObject } from "react"
import type { Music } from "@/types/entry"

gsap.registerPlugin(ScrollTrigger, useGSAP)

declare global {
  interface Window {
    __musicPlayer?: {
      playTrack?: (music: Music) => void
      fadeOut?: (ms: number) => void
      fadeIn?: (ms: number) => void
    }
  }
}

export function useSectionMusicCue(sectionRef: RefObject<HTMLElement | null>, music?: Music | null) {
  const didTrigger = useRef(false)

  useGSAP(
    () => {
      if (!sectionRef.current || !music) return

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 65%",
        end: "bottom 35%",
        onEnter: () => {
          window.__musicPlayer?.playTrack?.(music)
          didTrigger.current = true
        },
        onEnterBack: () => {
          window.__musicPlayer?.playTrack?.(music)
          didTrigger.current = true
        },
      })

      return () => {
        trigger.kill()
      }
    },
    { scope: sectionRef }
  )
}
