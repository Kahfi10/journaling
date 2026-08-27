"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { formatDate } from "@/lib/utils"
import type { Media, Location } from "@/types/entry"

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface EntryMemoryIntroProps {
  title: string
  dateTaken: Date
  location: Location | null
  media: Media[]
}

export function EntryMemoryIntro({ title, dateTaken, location, media }: EntryMemoryIntroProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const previewMedia = media.slice(0, 4)

  useGSAP(() => {
    gsap.from(".memory-intro-item", {
      opacity: 0,
      y: 22,
      duration: 0.75,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="px-5 sm:px-8 lg:px-16 py-16 md:py-24"
      style={{ background: "var(--j-bg)", borderTop: "1px solid var(--j-border)" }}
    >
      <div className="max-w-[1440px] mx-auto grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div className="memory-intro-item">
          <p className="text-[10px] tracking-[0.34em] uppercase mb-3 font-mono-custom" style={{ color: "var(--j-text-4)" }}>
            Memories / {String(media.length).padStart(2, "0")} frames
          </p>
          <h2
            className="font-light leading-[0.9] mb-5"
            style={{
              fontFamily: "var(--font-apple)",
              fontSize: "clamp(2.4rem, 6vw, 6.5rem)",
              letterSpacing: "-0.05em",
              color: "var(--j-text-1)",
            }}
          >
            {title}
          </h2>
          <p
            className="max-w-xl text-sm sm:text-base leading-relaxed mb-6"
            style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)" }}
          >
            {location?.display_name ?? "Somewhere warm"} — {formatDate(dateTaken)}.
            A small set of frames that hold the whole day together.
          </p>

          <div className="flex flex-wrap gap-2">
            {[location?.display_name ?? "Island day", formatDate(dateTaken), `${media.length} photos`].map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] tracking-[0.26em] uppercase"
                style={{
                  borderColor: "var(--j-border-dark)",
                  color: "var(--j-text-3)",
                  fontFamily: "var(--font-apple)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="memory-intro-item grid grid-cols-2 gap-3 sm:gap-4">
          {previewMedia.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              className="relative overflow-hidden rounded-[22px] border bg-black"
              style={{ aspectRatio: index === 0 ? "1 / 1.12" : "1 / 1", borderColor: "var(--j-border)" }}
            >
              <Image
                src={item.url}
                alt={item.caption ?? `${title} preview ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.38) 0%, transparent 55%)",
                }}
              />
              <div className="absolute left-3 right-3 bottom-3">
                <p className="text-[9px] tracking-[0.28em] uppercase text-white/60 mb-1">Preview</p>
                <p className="text-[11px] sm:text-xs text-white/92 leading-snug">
                  {item.caption ?? `Frame ${index + 1}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
