"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { EntryCaption } from "./EntryCaption"
import { useSectionMusicCue } from "@/hooks/useSectionMusicCue"
import type { Media, Music } from "@/types/entry"

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface PhotoSectionProps {
  media: Media
  index: number
  music?: Music | null
}

export function PhotoSection({ media, index, music }: PhotoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)

  useSectionMusicCue(sectionRef, music)

  useGSAP(
    () => {
      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { scale: 1.06, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
          }
        )
      }

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
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-black"
    >
      <div ref={imgRef} className="absolute inset-0">
        <Image
          src={media.url}
          alt={media.caption ?? `Foto ${index + 1}`}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.1) 38%, transparent 70%)",
        }}
      />

      {/* Caption */}
      {media.caption && (
        <div ref={captionRef} className="absolute left-5 sm:left-8 md:left-16 bottom-6 sm:bottom-10">
          <EntryCaption caption={media.caption} />
        </div>
      )}
    </section>
  )
}
