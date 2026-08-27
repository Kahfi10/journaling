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

      {/* Very subtle gradient overlay just to ensure bottom corners text readability */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 20%, transparent 85%, rgba(0,0,0,0.3) 100%)" }} />

      {/* Content - Spread to corners */}
      <div className="absolute inset-0 z-10 p-5 sm:p-8 flex flex-col justify-between">
        
        {/* Top bar */}
        <div className="flex justify-between items-start w-full">
          {/* We can put breadcrumbs or back button here later */}
          <div /> 
        </div>

        {/* Bottom bar */}
        <div className="flex items-end justify-between w-full">
          {/* Left: Huge Title */}
          <div className="max-w-[70vw]">
            <h1
              ref={titleRef}
              className="text-white font-light"
              style={{
                fontFamily: "var(--font-apple)",
                fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Right: Meta Info */}
          <div className="hero-meta text-right flex flex-col items-end gap-2 pb-2">
            <p className="font-mono-custom text-sm sm:text-base md:text-xl" style={{ color: "rgba(255,255,255,0.9)" }}>
              {formatDate(dateTaken)}
            </p>
            {location && (
              <p className="text-[10px] md:text-xs font-medium tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.7)", maxWidth: "200px", lineHeight: 1.4 }}>
                {location.display_name}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
