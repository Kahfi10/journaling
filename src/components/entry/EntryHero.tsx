"use client"

import { useRef } from "react"
import Image from "next/image"
import { MapPin, ChevronDown } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import { formatDate } from "@/lib/utils"
import type { Location } from "@/types/entry"

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

interface EntryHeroProps {
  title: string
  dateTaken: Date
  location: Location | null
  coverUrl?: string
}

export function EntryHero({ title, dateTaken, location, coverUrl }: EntryHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "words" })
        gsap.from(split.words, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.3,
        })
      }

      gsap.from(".hero-meta", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.65,
      })

      if (arrowRef.current) {
        gsap.to(arrowRef.current, {
          y: 7,
          repeat: -1,
          yoyo: true,
          duration: 0.9,
          ease: "power1.inOut",
          delay: 1.2,
        })
        ScrollTrigger.create({
          trigger: document.body,
          start: "80px top",
          onEnter: () => gsap.to(arrowRef.current, { opacity: 0, duration: 0.3 }),
          onLeaveBack: () => gsap.to(arrowRef.current, { opacity: 1, duration: 0.3 }),
        })
      }

      const img = containerRef.current?.querySelector(".hero-img")
      if (img) {
        gsap.to(img, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        })
      }
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      {coverUrl && (
        <div className="hero-img absolute inset-0 scale-110">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Overlay — tetap gelap untuk readability */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.42)" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-5 sm:px-8 max-w-5xl mx-auto">
        {location && (
          <div className="hero-meta inline-flex items-center gap-1.5 mb-5 sm:mb-7 px-3 py-1.5 rounded-full border" style={{ borderColor: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)" }}>
            <MapPin className="w-3 h-3" style={{ color: "rgba(255,255,255,0.8)" }} />
            <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.8)" }}>
              {location.display_name}
            </span>
          </div>
        )}

        <h1
          ref={titleRef}
          className="text-white font-light mb-4 sm:mb-5"
          style={{
            fontFamily: "var(--font-apple)",
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
          }}
        >
          {title}
        </h1>

        <p className="hero-meta font-mono-custom text-xs sm:text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
          {formatDate(dateTaken)}
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={arrowRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono-custom text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>Scroll</span>
        <ChevronDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
      </div>
    </section>
  )
}
