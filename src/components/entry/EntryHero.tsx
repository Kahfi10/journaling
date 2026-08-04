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
      // Title reveal
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "words" })
        gsap.from(split.words, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.3,
        })
      }

      // Fade in location + date
      gsap.from(".hero-meta", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.6,
      })

      // Scroll arrow bounce
      if (arrowRef.current) {
        gsap.to(arrowRef.current, {
          y: 8,
          repeat: -1,
          yoyo: true,
          duration: 0.9,
          ease: "power1.inOut",
          delay: 1.2,
        })

        // Hide arrow on scroll
        ScrollTrigger.create({
          trigger: document.body,
          start: "80px top",
          onEnter: () => gsap.to(arrowRef.current, { opacity: 0, duration: 0.3 }),
          onLeaveBack: () => gsap.to(arrowRef.current, { opacity: 1, duration: 0.3 }),
        })
      }

      // Hero image parallax
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

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">
        {/* Location badge */}
        {location && (
          <div className="hero-meta inline-flex items-center gap-1.5 mb-8 px-3 py-1.5 rounded-full border border-[#C8A96E]/30 bg-[#C8A96E]/12">
            <MapPin className="w-3 h-3 text-[#C8A96E]" />
            <span className="text-[#C8A96E] text-[11px] font-medium tracking-widest uppercase font-sans">
              {location.display_name}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-display-xl text-[#F0EDE8] mb-6"
        >
          {title}
        </h1>

        {/* Date */}
        <p className="hero-meta font-mono-custom text-[#888888] text-sm tracking-widest">
          {formatDate(dateTaken)}
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={arrowRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#555555] text-[10px] tracking-widest uppercase font-sans">Scroll</span>
        <ChevronDown className="w-4 h-4 text-[#555555]" />
      </div>
    </section>
  )
}
