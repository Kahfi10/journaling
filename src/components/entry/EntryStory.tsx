"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import { formatDate } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

interface EntryStoryProps {
  location: string | null
  dateTaken: Date
  category: string
  description?: string
}

export function EntryStory({ location, dateTaken, category, description }: EntryStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)

  useGSAP(() => {
    // Left meta columns animation
    gsap.from(".story-meta-item", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
      }
    })

    // Right description text split-lines reveal
    if (paragraphRef.current && description) {
      const split = new SplitText(paragraphRef.current, { type: "lines" })
      gsap.from(split.lines, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: paragraphRef.current,
          start: "top 85%",
        }
      })
    }
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="px-5 sm:px-8 lg:px-16 py-20 md:py-32 relative z-10"
      style={{ background: "var(--j-bg)" }} // Using light theme background
    >
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-16 md:gap-24 lg:gap-32">
        
        {/* Left Column: Meta Data */}
        <div className="flex flex-row md:flex-col gap-8 md:gap-12 w-full md:w-[300px] shrink-0 pt-2 flex-wrap">
          {location && (
            <div className="story-meta-item flex-1 min-w-[120px]">
              <p className="text-[10px] tracking-widest uppercase mb-2 font-mono-custom" style={{ color: "var(--j-text-3)" }}>
                Location
              </p>
              <p className="text-sm font-light leading-snug" style={{ color: "var(--j-text-1)", fontFamily: "var(--font-apple)" }}>
                {location}
              </p>
            </div>
          )}
          
          <div className="story-meta-item flex-1 min-w-[120px]">
            <p className="text-[10px] tracking-widest uppercase mb-2 font-mono-custom" style={{ color: "var(--j-text-3)" }}>
              Date
            </p>
            <p className="text-sm font-light" style={{ color: "var(--j-text-1)", fontFamily: "var(--font-apple)" }}>
              {formatDate(dateTaken)}
            </p>
          </div>

          <div className="story-meta-item flex-1 min-w-[120px]">
            <p className="text-[10px] tracking-widest uppercase mb-2 font-mono-custom" style={{ color: "var(--j-text-3)" }}>
              Category
            </p>
            <p className="text-sm font-light uppercase" style={{ color: "var(--j-text-1)", fontFamily: "var(--font-apple)" }}>
              {category}
            </p>
          </div>
        </div>

        {/* Right Column: Editorial Description */}
        <div className="flex-1 max-w-4xl">
          {description ? (
            <p
              ref={paragraphRef}
              className="font-light leading-snug"
              style={{
                fontFamily: "var(--font-apple)",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                letterSpacing: "-0.02em",
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