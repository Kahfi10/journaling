"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { EntryCard } from "./EntryCard"
import type { EntryCard as EntryCardType } from "@/types/entry"

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface FeedGridProps {
  entries: EntryCardType[]
}

export function FeedGrid({ entries }: FeedGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll(".feed-card")
      if (!cards || cards.length === 0) return

      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 0.75,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-3 gap-6 max-w-[1440px] mx-auto"
    >
      {entries.map((entry) => (
        <div key={entry.slug} className="feed-card">
          <EntryCard entry={entry} />
        </div>
      ))}
    </div>
  )
}
