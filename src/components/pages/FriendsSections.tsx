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
  const imgRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)

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

    // Image — scale up dari 0.92 + fade
    if (imgRef.current) {
      gsap.from(imgRef.current, {
        scale: 0.93,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    }

    // Body text
    if (bodyRef.current) {
      gsap.from(bodyRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: bodyRef.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      })
    }
  }, { scope: ref })

  return (
    <section
      ref={ref}
      className="px-5 sm:px-8 lg:px-16 py-16 md:py-24"
      style={{ background: "var(--j-bg)", borderTop: "1px solid var(--j-border)" }}
    >
      <div className="max-w-[1440px] mx-auto">

        <div className="text-center mb-10 md:mb-16">
          <h2
            ref={titleRef}
            className="font-light leading-tight"
            style={{
              fontFamily: "var(--font-apple)",
              fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)",
              letterSpacing: "-0.025em",
              color: "var(--j-text-1)",
            }}
          >
            From Strangers<br />
            to Everything
          </h2>
        </div>

        {/* Sketch image — full width on mobile */}
        <div
          ref={imgRef}
          className="relative w-full overflow-hidden rounded-lg"
          style={{
            aspectRatio: "16/9",
            background: "#F8F7F4",
            border: "1px solid var(--j-border)",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <div className="absolute inset-0" style={{ filter: "grayscale(1) contrast(1.1)" }}>
            <Image src="/images/hero-image/IMG_5337.JPG.jpeg" alt="sketch base" fill className="object-cover" quality={90} sizes="(max-width: 900px) 100vw, 900px" />
          </div>
          <div className="absolute inset-0" style={{ filter: "grayscale(1) invert(1) blur(6px)", mixBlendMode: "color-dodge" }}>
            <Image src="/images/hero-image/IMG_5337.JPG.jpeg" alt="sketch layer" fill className="object-cover" quality={90} sizes="(max-width: 900px) 100vw, 900px" aria-hidden="true" />
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ backdropFilter: "contrast(1.4) brightness(0.95)", mixBlendMode: "multiply" }} />
        </div>

        <p
          ref={bodyRef}
          className="text-center mt-8 text-sm max-w-xl mx-auto leading-relaxed px-4"
          style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)", letterSpacing: "0.01em" }}
        >
          Every great friendship starts with a first moment —
          a glance, a word, a shared laugh.
          What comes after is everything.
        </p>

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

    // Reveal fade in
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
        // overflow hidden di section agar parallax tidak bocor ke section lain
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
        {/* Inner image dengan scale lebih besar untuk buffer parallax */}
        <div
          className="full-img-inner absolute"
          style={{
            top: "-150px", bottom: "-150px", left: 0, right: 0, // buffer atas-bawah agar tidak ada gap
          }}
        >
          <Image
            src="/images/hero-image/IMG_6175.JPG.jpeg"
            alt="Friends"
            fill
            className="object-cover"
            quality={100}
            sizes="100vw"
          />
        </div>
        {/* Subtle dark overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(0,0,0,0.12)", zIndex: 1 }}
        />
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
      y: 40, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".selected-heading", start: "top 85%" }
    })

    // Reveal items and add inner parallax
    const items = gsap.utils.toArray(".selected-item")
    items.forEach((item: any, i) => {
      // Fade in card
      gsap.from(item, {
        y: 60, opacity: 0, duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: item, start: "top 85%" }
      })
      
      // Image parallax
      const img = item.querySelector(".selected-img-inner")
      if (img) {
        gsap.to(img, {
          y: -40, // Move up as we scroll down
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        })
      }
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="px-5 sm:px-8 lg:px-16 py-20 md:py-32" style={{ background: "var(--j-bg)" }}>
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6" style={{ borderColor: "var(--j-border-dark)" }}>
          <h2 className="selected-heading font-light leading-none" style={{ fontFamily: "var(--font-apple)", fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.03em", color: "var(--j-text-1)" }}>
            All Memories.
          </h2>
          <p className="selected-heading text-xs font-mono-custom tracking-widest uppercase" style={{ color: "var(--j-text-3)" }}>
            {entries.length === 0 ? "Empty State Preview" : `${entries.length} moment${entries.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Asymmetric Grid */}
        <div className="flex flex-col gap-16 md:gap-32">
          {displayEntries.map((entry, index) => {
            const patternIndex = index % 3;
            
            if (patternIndex === 0) {
              return (
                <div key={entry.slug} className="selected-item group relative w-full md:w-[80%]">
                  <Link href={`/entry/${entry.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-md" style={{ aspectRatio: "16/9", background: "var(--j-bg-alt)" }}>
                      <div className="selected-img-inner absolute inset-0" style={{ height: "120%", top: "-10%" }}>
                        <Image src={entry.cover || (entry.media[0]?.url) || ""} alt={entry.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 1440px) 100vw, 1200px" />
                        <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-between items-start">
                      <div>
                        <h3 className="text-xl md:text-2xl font-light" style={{ fontFamily: "var(--font-apple)", letterSpacing: "-0.02em" }}>{entry.title}</h3>
                        <p className="text-sm mt-1" style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)" }}>{entry.location}</p>
                      </div>
                      <p className="text-xs font-mono-custom" style={{ color: "var(--j-text-4)" }}>{formatDate(entry.date)}</p>
                    </div>
                  </Link>
                </div>
              )
            }
            
            if (patternIndex === 1) {
              return (
                <div key={entry.slug} className="selected-item group relative w-full md:w-[45%] self-end">
                  <Link href={`/entry/${entry.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-md" style={{ aspectRatio: "3/4", background: "var(--j-bg-alt)" }}>
                      <div className="selected-img-inner absolute inset-0" style={{ height: "115%", top: "-7.5%" }}>
                        <Image src={entry.cover || (entry.media[0]?.url) || ""} alt={entry.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 600px" />
                        <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-light" style={{ fontFamily: "var(--font-apple)", letterSpacing: "-0.02em" }}>{entry.title}</h3>
                        <p className="text-sm mt-1" style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)" }}>{entry.location}</p>
                      </div>
                      <p className="text-xs font-mono-custom" style={{ color: "var(--j-text-4)" }}>{formatDate(entry.date)}</p>
                    </div>
                  </Link>
                </div>
              )
            }

            return (
              <div key={entry.slug} className="selected-item group relative w-full md:w-[60%] ml-[5%]">
                <Link href={`/entry/${entry.slug}`} className="block">
                  <div className="relative overflow-hidden rounded-md" style={{ aspectRatio: "4/3", background: "var(--j-bg-alt)" }}>
                    <div className="selected-img-inner absolute inset-0" style={{ height: "120%", top: "-10%" }}>
                      <Image src={entry.cover || (entry.media[0]?.url) || ""} alt={entry.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 800px" />
                      <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />
                    </div>
                  </div>
                  <div className="mt-5 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl md:text-2xl font-light" style={{ fontFamily: "var(--font-apple)", letterSpacing: "-0.02em" }}>{entry.title}</h3>
                      <p className="text-sm mt-1" style={{ color: "var(--j-text-3)", fontFamily: "var(--font-apple)" }}>{entry.location}</p>
                    </div>
                    <p className="text-xs font-mono-custom" style={{ color: "var(--j-text-4)" }}>{formatDate(entry.date)}</p>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
