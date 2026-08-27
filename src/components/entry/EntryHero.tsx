"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import { formatDate } from "@/lib/utils"
import { useSectionMusicCue } from "@/hooks/useSectionMusicCue"
import type { Location, Music } from "@/types/entry"

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

interface EntryHeroProps {
  title: string
  dateTaken: Date
  location: Location | null
  coverUrl?: string
  description?: string
  music?: Music | null
}

export function EntryHero({ title, dateTaken, location, coverUrl, description, music }: EntryHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)

  useSectionMusicCue(containerRef, music)

  useGSAP(
    () => {
      let titleSplit: SplitText | null = null

      if (coverRef.current) {
        gsap.fromTo(
          coverRef.current,
          { scale: 1.08, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
          }
        )
      }

      if (titleRef.current) {
        titleSplit = new SplitText(titleRef.current, { type: "lines" })
        gsap.from(titleSplit.lines, {
          y: 70,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.15,
        })
      }

      const bodyItems = bodyRef.current?.querySelectorAll(".hero-meta-item")
      if (bodyItems && bodyItems.length > 0) {
        gsap.from(bodyItems, {
          y: 18,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          delay: 0.4,
        })
      }

      gsap.to(coverRef.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      })

      return () => {
        titleSplit?.revert()
      }
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative isolate h-[100svh] overflow-hidden bg-black"
    >
      {coverUrl && (
        <div className="absolute inset-0">
          <div ref={coverRef} className="relative h-full w-full">
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover"
              style={{ objectPosition: "center center" }}
              priority
              sizes="100vw"
            />
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.18) 42%, transparent 70%)",
        }}
      />

      <div className="absolute inset-0 z-10 p-5 sm:p-8 flex items-end">
        <div ref={bodyRef} className="max-w-[940px] w-full">
          <p className="hero-meta-item text-[10px] sm:text-xs tracking-[0.34em] uppercase text-white/75 mb-4">
            Archive / 01
          </p>

          <div className="max-w-[860px]">
            <h1
              ref={titleRef}
              className="text-white font-light leading-[0.88] mb-5"
              style={{
                fontFamily: "var(--font-apple)",
                fontSize: "clamp(4rem, 11vw, 8.75rem)",
                letterSpacing: "-0.05em",
              }}
            >
              {title}
            </h1>

            <p
              className="hero-meta-item max-w-2xl text-sm sm:text-lg leading-relaxed text-white/86"
              style={{ fontFamily: "var(--font-apple)" }}
            >
              {description ?? "A collection of moments that felt simple while they happened, but stayed longer than expected."}
            </p>
          </div>

          <div className="hero-meta-item mt-6 flex flex-wrap gap-2">
            {[
              `Since ${dateTaken.getFullYear()}`,
              location?.display_name ?? "Samalona",
              "Friends",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] tracking-[0.26em] uppercase text-white/80"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  fontFamily: "var(--font-apple)",
                }}
              >
                {item}
              </span>
            ))}
            <span
              className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] tracking-[0.26em] uppercase text-white/80"
              style={{
                borderColor: "rgba(255,255,255,0.18)",
                fontFamily: "var(--font-apple)",
              }}
            >
              {formatDate(dateTaken)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
