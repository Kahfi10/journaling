"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { EntryCaption } from "./EntryCaption"
import type { Media } from "@/types/entry"

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface PhotoSectionProps {
  media: Media
  index: number
}

export function PhotoSection({ media, index }: PhotoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Parallax scrub on photo
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        })
      }

      // Caption reveal when section hits center
      if (captionRef.current && media.caption) {
        gsap.set(captionRef.current, { opacity: 0, y: 16 })

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          onEnter: () =>
            gsap.to(captionRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            }),
          onLeave: () =>
            gsap.to(captionRef.current, { opacity: 0, duration: 0.3 }),
          onEnterBack: () =>
            gsap.to(captionRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out",
            }),
          onLeaveBack: () =>
            gsap.to(captionRef.current, { opacity: 0, duration: 0.3 }),
        })
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
    >
      {/* Photo with parallax wrapper */}
      <div ref={imgRef} className="absolute inset-0 scale-110">
        <Image
          src={media.url}
          alt={media.caption ?? `Foto ${index + 1}`}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Caption */}
      {media.caption && (
        <div ref={captionRef} className="absolute bottom-20 sm:bottom-24 left-0 right-0 px-5 sm:px-12 md:px-20">
          <EntryCaption caption={media.caption} />
        </div>
      )}
    </section>
  )
}
