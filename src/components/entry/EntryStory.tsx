"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import { formatDate } from "@/lib/utils"
import { useSectionMusicCue } from "@/hooks/useSectionMusicCue"
import type { Music } from "@/types/entry"

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

interface EntryStoryProps {
  location: string | null
  dateTaken: Date
  category: string
  description?: string
  music?: Music | null
}

export function EntryStory({ location, dateTaken, category, description, music }: EntryStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)

  useSectionMusicCue(containerRef, music)

  useGSAP(() => {
    const metaItems = metaRef.current?.querySelectorAll(".story-meta-item")
    if (metaItems && metaItems.length > 0) {
      gsap.from(metaItems, {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      })
    }

    let split: SplitText | null = null
    if (paragraphRef.current && description) {
      split = new SplitText(paragraphRef.current, { type: "lines" })
      gsap.from(split.lines, {
        opacity: 0,
        y: 32,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: paragraphRef.current,
          start: "top 85%",
        }
      })
    }

    return () => {
      split?.revert()
    }
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="px-5 sm:px-8 lg:px-16 py-20 md:py-28 relative z-10"
      style={{ background: "var(--j-bg)" }} // Using light theme background
    >
      <div className="max-w-[1440px] mx-auto grid gap-10 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div ref={metaRef} className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-5 md:gap-8">
          {location && (
            <div className="story-meta-item rounded-2xl border px-4 py-4" style={{ borderColor: "var(--j-border)" }}>
              <p className="text-[10px] tracking-widest uppercase mb-2 font-mono-custom" style={{ color: "var(--j-text-3)" }}>
                Location
              </p>
              <p className="text-sm font-light leading-snug" style={{ color: "var(--j-text-1)", fontFamily: "var(--font-apple)" }}>
                {location}
              </p>
            </div>
          )}
          
          <div className="story-meta-item rounded-2xl border px-4 py-4" style={{ borderColor: "var(--j-border)" }}>
            <p className="text-[10px] tracking-widest uppercase mb-2 font-mono-custom" style={{ color: "var(--j-text-3)" }}>
              Date
            </p>
            <p className="text-sm font-light" style={{ color: "var(--j-text-1)", fontFamily: "var(--font-apple)" }}>
              {formatDate(dateTaken)}
            </p>
          </div>

          <div className="story-meta-item rounded-2xl border px-4 py-4" style={{ borderColor: "var(--j-border)" }}>
            <p className="text-[10px] tracking-widest uppercase mb-2 font-mono-custom" style={{ color: "var(--j-text-3)" }}>
              Category
            </p>
            <p className="text-sm font-light uppercase" style={{ color: "var(--j-text-1)", fontFamily: "var(--font-apple)" }}>
              {category}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-6 left-0 text-[10px] tracking-[0.32em] uppercase font-mono-custom" style={{ color: "var(--j-text-4)" }}>
            Story
          </div>
          {description ? (
            <p
              ref={paragraphRef}
              className="font-light leading-snug max-w-4xl"
              style={{
                fontFamily: "var(--font-apple)",
                fontSize: "clamp(1.4rem, 3vw, 2.3rem)",
                letterSpacing: "-0.025em",
                color: "var(--j-text-1)",
              }}
            >
              {description}
            </p>
          ) : (
            <p className="font-mono-custom text-xs uppercase tracking-widest" style={{ color: "var(--j-text-3)" }}>
              No description added.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}