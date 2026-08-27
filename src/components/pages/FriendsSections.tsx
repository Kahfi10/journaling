"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import type { Entry } from "@/data/types"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

// ─── Section 1: Large Typography ───────────────────────────────────────────

export function FriendsMarqueeText() {
  const ref = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useGSAP(() => {
    if (!textRef.current) return

    const split = new SplitText(textRef.current, { type: "lines" })

    gsap.from(split.lines, {
      y: 60,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    })
  }, { scope: ref })

  return (
    <section
      ref={ref}
      className="px-5 sm:px-8 lg:px-16 py-16 md:py-24"
      style={{ background: "var(--j-bg)", borderTop: "1px solid var(--j-border)" }}
    >
      <div className="max-w-[1440px] mx-auto overflow-hidden">
        <p
          ref={textRef}
          className="font-light"
          style={{
            fontFamily: "var(--font-apple)",
            fontSize: "clamp(1.8rem, 5vw, 6rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: "var(--j-text-1)",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Late nights, long drives,
          shared meals, empty wallets,
          inside jokes, and the kind
          of silence that never feels
          awkward.
        </p>
      </div>
    </section>
  )
}

// ─── Section 2: From X to Y ────────────────────────────────────────────────

export function FriendsFromTo() {
  const ref = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const leadRef = useRef<HTMLParagraphElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Title — fade in + slide up
    if (titleRef.current) {
      const split = new SplitText(titleRef.current, { type: "lines" })
      gsap.from(split.lines, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    }

    gsap.from([leadRef.current, metaRef.current], {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    })

    if (imgRef.current) {
      gsap.from(imgRef.current, {
        y: 30,
        scale: 0.98,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    }
  }, { scope: ref })

  return (
    <section
      ref={ref}
      className="relative isolate"
      style={{ background: "var(--j-bg)", borderTop: "1px solid var(--j-border)", overflow: "hidden" }}
    >
      <div
        ref={imgRef}
        className="relative w-screen"
        style={{
          height: "100vh",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          background: "var(--j-bg-alt)",
        }}
      >
        <Image
          src="/images/hero-image/IMG_6175.JPG.jpeg"
          alt="friends latest"
          fill
          className="object-cover"
          quality={90}
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.12) 35%, transparent 68%)",
          }}
        />
        <div className="absolute left-5 right-5 bottom-5 sm:left-8 sm:right-8 sm:bottom-8">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.32em] uppercase text-white/70 mb-3">
              Archive / 01
            </p>
            <h2
              ref={titleRef}
              className="font-light leading-[0.92] text-white mb-4"
              style={{
                fontFamily: "var(--font-apple)",
                fontSize: "clamp(2.4rem, 5vw, 6rem)",
                letterSpacing: "-0.05em",
              }}
            >
              From Strangers
              <br />
              to Everything
            </h2>
            <p
              ref={leadRef}
              className="text-sm sm:text-base max-w-xl leading-relaxed text-white/80 mb-4"
              style={{ fontFamily: "var(--font-apple)" }}
            >
              Every great friendship begins with something small — a glance, a laugh,
              a shared direction. The rest is built over time.
            </p>
            <div ref={metaRef} className="flex flex-wrap gap-2">
              {["Since 2023", "Late drives", "Shared tables"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] tracking-[0.22em] uppercase text-white/75"
                  style={{
                    borderColor: "rgba(255,255,255,0.26)",
                    fontFamily: "var(--font-apple)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Section 3: Large Centered Headline + Two Sub-texts ────────────────────

export function FriendsClaritySection() {
  const ref = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    // Headline — SplitText lines dari bawah
    if (headlineRef.current) {
      const split = new SplitText(headlineRef.current, { type: "lines" })
      gsap.from(split.lines, {
        y: 80,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      })
    }

    // Sub-texts fade in
    gsap.from(".clarity-sub", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15,
      delay: 0.3,
      scrollTrigger: {
        trigger: ".clarity-sub",
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    })
  }, { scope: ref })

  return (
    <section
      ref={ref}
      className="px-5 sm:px-8 lg:px-16 py-16 md:py-28 overflow-hidden"
      style={{ background: "var(--j-bg)", borderTop: "1px solid var(--j-border)" }}
    >
      <div className="max-w-[1440px] mx-auto">

        <h2
          ref={headlineRef}
          className="text-center font-light leading-none mb-12 md:mb-20"
          style={{
            fontFamily: "var(--font-apple)",
            fontSize: "clamp(2.5rem, 7vw, 9rem)",
            letterSpacing: "-0.04em",
            color: "var(--j-text-1)",
            lineHeight: 1.0,
          }}
        >
          Unplanned &<br />
          Unforgettable
        </h2>

        {/* Two sub-texts — stack on mobile */}
        <div className="flex flex-col gap-5 sm:grid sm:grid-cols-2 sm:gap-12 max-w-3xl mx-auto">
          <p className="clarity-sub text-sm leading-relaxed" style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)" }}>
            Late-night drives, random stops, forgotten plans,
            and every detour that somehow became the best part of the trip.
          </p>
          <p className="clarity-sub text-sm leading-relaxed" style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)" }}>
            The kind of days that look ordinary from the outside —
            but you know exactly how rare and special they really are.
          </p>
        </div>

      </div>
    </section>
  )
}

// ─── Section 4: Full-width new image ───────────────────────────────────────

export function FriendsFullImage() {
  const ref = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!imgRef.current) return

    gsap.from(imgRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: imgRef.current,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    })

    // Parallax — hanya inner image bergerak, container tetap
    gsap.to(".full-img-inner", {
      y: -80,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    })
  }, { scope: ref })

  return (
    <section
      ref={ref}
      className="relative isolate"
      style={{
        isolation: "isolate",
        background: "var(--j-bg)",
        borderTop: "1px solid var(--j-border)",
        overflow: "hidden",
      }}
    >
      <div
        ref={imgRef}
        className="relative w-full"
        style={{
          height: "clamp(300px, 60vh, 100vh)",
          background: "var(--j-bg-alt)",
        }}
      >
        <div
          className="full-img-inner absolute"
          style={{
            top: "-150px", bottom: "-150px", left: 0, right: 0,
          }}
        >
          <Image
            src="/images/hero-image/WhatsApp Image 2026-08-27 at 10.19.25.jpeg"
            alt="friends latest"
            fill
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  )
}

// ─── Section 5: Selected Memories (Architectural Style) ───────────────────

export function FriendsSelectedMemories({ entries }: { entries: Entry[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  
  // Use real entries if available, otherwise show fallback for empty state preview
  const displayEntries = entries.length > 0 ? entries : [
    {
      slug: "demo-1",
      title: "Late Night Drive",
      date: "2023-10-14",
      location: "Jakarta",
      cover: "/images/hero-image/IMG_5337.JPG.jpeg", // Using existing images
      media: [],
      category: "friends"
    } as Entry,
    {
      slug: "demo-2",
      title: "Coffee & Conversations",
      date: "2024-01-22",
      location: "Bandung",
      cover: "/images/hero-image/IMG_6175.JPG.jpeg",
      media: [],
      category: "friends"
    } as Entry,
    {
      slug: "demo-3",
      title: "Random Stops",
      date: "2024-03-05",
      location: "Bogor",
      cover: "/images/hero-image/IMG_5337.JPG.jpeg", // Reuse for demo
      media: [],
      category: "friends"
    } as Entry
  ]

  useGSAP(() => {
    // Reveal heading
    gsap.from(".selected-heading", {
      y: 30, opacity: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".selected-heading", start: "top 88%" }
    })

    // Hero card
    const hero = document.querySelector(".mem-hero")
    if (hero) {
      gsap.from(hero, {
        y: 50, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: hero, start: "top 88%" }
      })
      const heroImg = hero.querySelector(".selected-img-inner")
      if (heroImg) {
        gsap.to(heroImg, {
          y: -50, ease: "none",
          scrollTrigger: { trigger: hero, start: "top bottom", end: "bottom top", scrub: true }
        })
      }
    }

    // Grid cards
    const cards = gsap.utils.toArray(".mem-card")
    cards.forEach((card: any, i) => {
      gsap.from(card, {
        y: 40, opacity: 0, duration: 0.8, ease: "power2.out", delay: i * 0.06,
        scrollTrigger: { trigger: card, start: "top 88%" }
      })
      const img = card.querySelector(".selected-img-inner")
      if (img) {
        gsap.to(img, {
          y: -30, ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true }
        })
      }
    })
  }, { scope: sectionRef })

  const hero = displayEntries[0] ?? null
  const rest = displayEntries.slice(1)

  return (
    <section ref={sectionRef} className="px-5 sm:px-8 lg:px-16 py-20 md:py-28" style={{ background: "var(--j-bg)" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="selected-heading mb-10 flex items-end justify-between border-b pb-5" style={{ borderColor: "var(--j-border)" }}>
          <h2 className="font-light leading-none" style={{ fontFamily: "var(--font-apple)", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", color: "var(--j-text-1)" }}>
            All Memories.
          </h2>
          <p className="text-xs font-mono-custom tracking-widest uppercase" style={{ color: "var(--j-text-3)" }}>
            {entries.length === 0 ? "—" : `${entries.length} moment${entries.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Hero entry */}
        {hero && (
          <Link href={`/entry/${hero.slug}`} className="mem-hero group block mb-5">
            <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "21/9", background: "var(--j-bg-alt)" }}>
              <div className="selected-img-inner absolute inset-[-8%]">
                <Image
                  src={hero.cover || hero.media[0]?.url || ""}
                  alt={hero.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="100vw"
                />
              </div>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)" }} />
              <div className="absolute bottom-6 left-7 right-7 flex items-end justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-white/55 mb-1.5 font-mono-custom">01 / Hero</p>
                  <h3 className="text-2xl md:text-3xl font-light text-white" style={{ fontFamily: "var(--font-apple)", letterSpacing: "-0.03em" }}>
                    {hero.title}
                  </h3>
                  <p className="text-sm text-white/55 mt-1">{hero.location}</p>
                </div>
                <span className="text-xs font-mono-custom text-white/35 shrink-0">{formatDate(hero.date)}</span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid — rest of entries */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((entry, i) => {
              const aspectRatios = ["3/4", "4/5", "3/4"]
              const ar = aspectRatios[i % aspectRatios.length]
              return (
                <Link key={entry.slug} href={`/entry/${entry.slug}`} className="mem-card group block">
                  <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: ar, background: "var(--j-bg-alt)" }}>
                    <div className="selected-img-inner absolute inset-[-8%]">
                      <Image
                        src={entry.cover || entry.media[0]?.url || ""}
                        alt={entry.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.04) 50%, transparent 100%)" }} />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[9px] tracking-[0.3em] uppercase text-white/50 mb-1 font-mono-custom">
                        {String(i + 2).padStart(2, "0")}
                      </p>
                      <h3 className="text-sm font-light text-white leading-snug" style={{ fontFamily: "var(--font-apple)", letterSpacing: "-0.02em" }}>
                        {entry.title}
                      </h3>
                      <p className="text-xs text-white/45 mt-0.5">{entry.location}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
