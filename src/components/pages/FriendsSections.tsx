"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

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
      className="px-8 py-24"
      style={{
        background: "var(--j-bg)",
        borderTop: "1px solid var(--j-border)",
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        <p
          ref={textRef}
          className="font-bold"
          style={{
            fontFamily: "var(--font-apple)",
            fontSize: "clamp(2.8rem, 6.5vw, 6rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            color: "var(--j-text-1)",
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
      className="px-8 py-24"
      style={{
        background: "var(--j-bg)",
        borderTop: "1px solid var(--j-border)",
      }}
    >
      <div className="max-w-[1440px] mx-auto">

        {/* Title — center aligned like reference */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="font-semibold leading-tight"
            style={{
              fontFamily: "var(--font-apple)",
              fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
              letterSpacing: "-0.025em",
              color: "var(--j-text-1)",
            }}
          >
            From Strangers<br />
            to Everything
          </h2>
        </div>

        {/* Image with sketch effect — two layer color-dodge technique */}
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
          {/* Layer 1 — grayscale base */}
          <div className="absolute inset-0" style={{ filter: "grayscale(1) contrast(1.1)" }}>
            <Image
              src="/images/hero-image/IMG_5337.JPG.jpeg"
              alt="sketch base"
              fill
              className="object-cover"
              quality={90}
              sizes="(max-width: 900px) 100vw, 900px"
            />
          </div>

          {/* Layer 2 — inverted + blurred, color-dodge blend = pencil lines */}
          <div
            className="absolute inset-0"
            style={{
              filter: "grayscale(1) invert(1) blur(6px)",
              mixBlendMode: "color-dodge",
            }}
          >
            <Image
              src="/images/hero-image/IMG_5337.JPG.jpeg"
              alt="sketch layer"
              fill
              className="object-cover"
              quality={90}
              sizes="(max-width: 900px) 100vw, 900px"
              aria-hidden="true"
            />
          </div>

          {/* Layer 3 — slight contrast boost on top */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backdropFilter: "contrast(1.4) brightness(0.95)", mixBlendMode: "multiply" }}
          />
        </div>

        {/* Caption body */}
        <p
          ref={bodyRef}
          className="text-center mt-10 text-sm max-w-xl mx-auto leading-relaxed"
          style={{
            color: "var(--j-text-3)",
            fontFamily: "var(--font-apple)",
            letterSpacing: "0.01em",
          }}
        >
          Every great friendship starts with a first moment —
          a glance, a word, a shared laugh.
          What comes after is everything.
        </p>

      </div>
    </section>
  )
}
