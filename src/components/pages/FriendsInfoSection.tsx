"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

interface Highlight { title: string; sub?: string }
interface Place { name: string; region?: string }

const META = [
  { label: "Since",     value: "2023" },
  { label: "Name",      value: "Ashabul Kahfi" },
  { label: "What we do",value: "Eat, Drink, Sleep — and everything in between." },
]

const PARAGRAPH =
  "Friendships like this are rare — and once found, impossible to take for granted. " +
  "Built across shared tables, late-night drives, and the kind of sleep that only comes " +
  "after a full day with the right people. What started in 2023 has quietly become the " +
  "best version of what friendship can feel like."

const HIGHLIGHTS: Highlight[] = [
  { title: "Bromo Sunrise Trip",    sub: "2023 · First trip together" },
  { title: "Bali Long Weekend",     sub: "2023 · Sea, sun, and too much food" },
  { title: "Bandung Food Escape",   sub: "2024 · Three cities, one weekend" },
  { title: "Camping under the Stars", sub: "2024 · No signal, no problem" },
]

const PLACES: Place[] = [
  { name: "Bromo",    region: "East Java" },
  { name: "Canggu",   region: "Bali" },
  { name: "Bandung",  region: "West Java" },
  { name: "Lombok",   region: "NTB" },
  { name: "Jakarta",  region: "Special Capital Region" },
]

export function FriendsInfoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ease = "power3.out"

    // ── Meta items — stagger dari kiri ──
    gsap.from(".info-meta-item", {
      x: -24,
      opacity: 0,
      duration: 0.7,
      ease,
      stagger: 0.12,
      scrollTrigger: {
        trigger: ".info-meta-item",
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    })

    // ── Paragraph — SplitText lines reveal ──
    if (paragraphRef.current) {
      const split = new SplitText(paragraphRef.current, { type: "lines" })
      gsap.from(split.lines, {
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease,
        stagger: 0.1,
        scrollTrigger: {
          trigger: paragraphRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    }

    // ── Divider — scaleX expand dari kiri ──
    if (dividerRef.current) {
      gsap.from(dividerRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: dividerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      })
    }

    // ── "Memories" label ──
    gsap.from(".info-achievement-label", {
      opacity: 0,
      y: 12,
      duration: 0.6,
      ease,
      scrollTrigger: {
        trigger: ".info-achievement-label",
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    })

    // ── Highlights — stagger dari bawah ──
    gsap.from(".info-highlight-item", {
      y: 30,
      opacity: 0,
      duration: 0.65,
      ease,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".info-highlight-item",
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    })

    // ── Places — stagger dari bawah, delay sedikit ──
    gsap.from(".info-place-item", {
      y: 30,
      opacity: 0,
      duration: 0.65,
      ease,
      stagger: 0.08,
      delay: 0.1,
      scrollTrigger: {
        trigger: ".info-place-item",
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    })

    // ── Column headers ──
    gsap.from(".info-col-header", {
      opacity: 0,
      duration: 0.5,
      ease,
      stagger: 0.12,
      scrollTrigger: {
        trigger: ".info-col-header",
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    })

  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="px-8 pt-20 pb-24"
      style={{
        background: "var(--j-bg)",
        borderTop: "1px solid var(--j-border)",
        position: "relative",
        zIndex: 2,            // selalu di atas section gambar
      }}
    >
      <div className="max-w-[1440px] mx-auto">

        {/* ── Top: meta + paragraph ── */}
        <div className="grid gap-16" style={{ gridTemplateColumns: "280px 1fr" }}>

          {/* Left — metadata */}
          <div className="space-y-7 pt-1">
            {META.map(({ label, value }) => (
              <div key={label} className="info-meta-item">
                <p
                  className="text-xs font-medium tracking-widest uppercase mb-1.5"
                  style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)" }}
                >
                  {label}
                </p>
                <p
                  className="text-sm leading-snug"
                  style={{ color: "var(--j-text-2)", fontFamily: "var(--font-apple)" }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Right — large editorial paragraph */}
          <div>
            <p
              ref={paragraphRef}
              className="font-light leading-tight"
              style={{
                fontFamily: "var(--font-apple)",
                fontSize: "clamp(1.6rem, 2.8vw, 2.6rem)",
                letterSpacing: "-0.03em",
                color: "var(--j-text-1)",
                lineHeight: 1.18,
              }}
            >
              {PARAGRAPH}
            </p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          ref={dividerRef}
          className="my-20"
          style={{ height: "1px", background: "var(--j-border-dark)" }}
        />

        {/* ── Bottom: memories ── */}
        <div className="grid gap-12" style={{ gridTemplateColumns: "280px 1fr 1fr" }}>

          {/* Label */}
          <div>
            <p
              className="info-achievement-label text-xs font-medium tracking-widest uppercase"
              style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)" }}
            >
              Memories
            </p>
          </div>

          {/* Highlights */}
          <div>
            <p
              className="info-col-header text-xs font-medium tracking-widest uppercase mb-6"
              style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)" }}
            >
              Highlights
            </p>
            <div className="space-y-5">
              {HIGHLIGHTS.map(({ title, sub }) => (
                <div key={title} className="info-highlight-item">
                  <p
                    className="text-sm font-light"
                    style={{
                      color: "var(--j-text-1)",
                      fontFamily: "var(--font-apple)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {title}
                  </p>
                  {sub && (
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)" }}
                    >
                      {sub}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Places */}
          <div>
            <p
              className="info-col-header text-xs font-medium tracking-widest uppercase mb-6"
              style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)" }}
            >
              Places
            </p>
            <div className="space-y-4">
              {PLACES.map(({ name, region }) => (
                <div key={name} className="info-place-item">
                  <p
                    className="text-sm font-light"
                    style={{
                      color: "var(--j-text-1)",
                      fontFamily: "var(--font-apple)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {name}
                  </p>
                  {region && (
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)" }}
                    >
                      {region}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
