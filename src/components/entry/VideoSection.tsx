"use client"

import { useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { EntryCaption } from "./EntryCaption"
import { useMusicPlayer } from "@/hooks/useMusicPlayer"
import type { Media, Music } from "@/types/entry"

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface VideoSectionProps {
  media: Media
  index: number
  music: Music | null
}

export function VideoSection({ media, index, music }: VideoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  const { fadeOut, fadeIn } = useMusicPlayer()

  useGSAP(
    () => {
      if (!sectionRef.current) return

      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      if (captionRef.current && media.caption) {
        gsap.from(captionRef.current, {
          opacity: 0,
          y: 14,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        })
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        end: "bottom 40%",

        onEnter: () => {
          // Fade out music, play video
          if (music) {
            fadeOut(300)
            setTimeout(() => videoRef.current?.play(), 350)
          } else {
            videoRef.current?.play()
          }
          // Show caption
          if (captionRef.current && media.caption) {
            gsap.to(captionRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
          }
        },

        onLeave: () => {
          videoRef.current?.pause()
          if (videoRef.current) videoRef.current.currentTime = 0
          if (music) fadeIn(500)
        },

        onEnterBack: () => {
          if (music) {
            fadeOut(300)
            setTimeout(() => videoRef.current?.play(), 350)
          } else {
            videoRef.current?.play()
          }
        },

        onLeaveBack: () => {
          videoRef.current?.pause()
          if (videoRef.current) videoRef.current.currentTime = 0
          if (music) fadeIn(500)
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        src={media.url}
        className="absolute inset-0 w-full h-full object-cover"
        muted={false}
        playsInline
        loop={false}
        preload="metadata"
      />

      <div className="absolute inset-0 bg-black/10" />

      {media.caption && (
        <div ref={captionRef} className="absolute left-5 sm:left-8 md:left-16 bottom-6 sm:bottom-10">
          <EntryCaption caption={media.caption} />
        </div>
      )}
    </section>
  )
}
