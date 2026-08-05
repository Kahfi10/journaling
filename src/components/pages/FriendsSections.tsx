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
          className="font-light"
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
            className="font-light leading-tight"
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
      className="px-8 py-28"
      style={{
        background: "var(--j-bg)",
        borderTop: "1px solid var(--j-border)",
      }}
    >
      <div className="max-w-[1440px] mx-auto">

        {/* Large centered headline */}
        <h2
          ref={headlineRef}
          className="text-center font-light leading-none mb-20"
          style={{
            fontFamily: "var(--font-apple)",
            fontSize: "clamp(3.5rem, 9vw, 9rem)",
            letterSpacing: "-0.04em",
            color: "var(--j-text-1)",
            lineHeight: 1.0,
          }}
        >
          Unplanned &<br />
          Unforgettable
        </h2>

        {/* Two sub-texts below — like reference */}
        <div className="grid gap-12" style={{ gridTemplateColumns: "1fr 1fr", maxWidth: "900px", margin: "0 auto" }}>
          <p
            className="clarity-sub text-sm leading-relaxed"
            style={{
              color: "var(--j-text-3)",
              fontFamily: "var(--font-apple)",
              letterSpacing: "0.01em",
            }}
          >
            Late-night drives, random stops, forgotten plans,
            and every detour that somehow became the best part of the trip.
          </p>
          <p
            className="clarity-sub text-sm leading-relaxed"
            style={{
              color: "var(--j-text-3)",
              fontFamily: "var(--font-apple)",
              letterSpacing: "0.01em",
            }}
          >
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
      className="relative"
      style={{
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
          height: "100vh",     // full screen
          background: "var(--j-bg-alt)",
        }}
      >
        {/* Inner image dengan scale lebih besar untuk buffer parallax */}
        <div
          className="full-img-inner absolute"
          style={{
            inset: "-10% 0",   // buffer atas-bawah agar tidak ada gap
            transform: "scale(1)",
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
