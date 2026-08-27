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
  totalCount?: number
  music?: Music | null
}

export function PhotoSection({ media, index, totalCount, music }: PhotoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef<HTMLDivElement>(null)

  useSectionMusicCue(sectionRef, music)

  useGSAP(
    () => {
      const section = sectionRef.current
      const img = imgRef.current
      if (!section || !img) return

      // Section reveal — subtle fade+lift as it enters from below
      gsap.fromTo(
        section,
        { opacity: 0.7 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        }
      )

      // Parallax — image drifts up as user scrolls through section
      gsap.fromTo(
        img,
        { y: "4%" },
        {
          y: "-6%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.6,
          },
        }
      )

      // Caption scrub-in — fades in after section is 40% visible
      if (captionRef.current && media.caption) {
        gsap.fromTo(
          captionRef.current,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 55%",
              toggleActions: "play none none reverse",
            },
          }
        )
      }

      // Index counter fade-in
      if (indexRef.current) {
        gsap.fromTo(
          indexRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        )
      }
    },
    { scope: sectionRef }
  )

  const displayIndex = String(index + 1).padStart(2, "0")
  const displayTotal = totalCount ? String(totalCount).padStart(2, "0") : undefined

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-black"
    >
      {/* Parallax image container — slightly oversized for parallax headroom */}
      <div ref={imgRef} className="absolute inset-[-6%]">
        <Image
          src={media.url}
          alt={media.caption ?? `Foto ${index + 1}`}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Top gradient — blends from black above */}
      <div
        className="absolute inset-x-0 top-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.22) 60%, transparent 100%)",
        }}
      />

      {/* Bottom gradient — fades to black below */}
      <div
        className="absolute inset-x-0 bottom-0 h-56 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
        }}
      />

      {/* Photo index */}
      {displayTotal && (
        <div
          ref={indexRef}
          className="absolute top-6 right-5 sm:right-8 md:right-12 flex items-center gap-1.5 opacity-0"
        >
          <span
            className="font-mono-custom text-[11px] tracking-[0.28em] uppercase"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            {displayIndex}
          </span>
          <span
            className="font-mono-custom text-[11px] tracking-[0.28em]"
            style={{ color: "rgba(255,255,255,0.34)" }}
          >
            / {displayTotal}
          </span>
        </div>
      )}

      {/* Caption */}
      {media.caption && (
        <div ref={captionRef} className="absolute left-5 sm:left-8 md:left-16 bottom-6 sm:bottom-10" style={{ opacity: 0 }}>
          <EntryCaption caption={media.caption} />
        </div>
      )}
    </section>
  )
}
