"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import { MapPin } from "lucide-react"
import { FriendsInfoSection } from "./FriendsInfoSection"
import { FriendsMarqueeText, FriendsFromTo, FriendsClaritySection, FriendsFullImage, FriendsSelectedMemories } from "./FriendsSections"
import { formatDate } from "@/lib/utils"
import type { Entry } from "@/data/types"

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

const NAV_LINKS = [
  { href: "/friends", label: "Friends" },
  { href: "/me", label: "Me" },
  { href: "/together", label: "Together" },
]

interface FriendsPageProps {
  entries: Entry[]
}

export function FriendsPage({ entries }: FriendsPageProps) {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // ── Hero title reveal ──
    if (titleRef.current) {
      const split = new SplitText(titleRef.current, { type: "lines" })
      gsap.from(split.lines, {
        y: 80,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.2,
      })
    }

    // ── Navbar fade in ──
    gsap.from(".page-nav-item", {
      opacity: 0,
      y: -8,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.08,
      delay: 0.1,
    })

    gsap.from(".page-logo", {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.1,
    })

    // ── Hero image parallax ──
    gsap.to(".hero-bg-img", {
      y: -100,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 2,
      },
    })

    // ── Grid cards reveal ──
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".grid-card")
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      })
    }
  }, { scope: heroRef })

  return (
    <div style={{ background: "var(--j-bg)" }}>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative isolate h-screen overflow-hidden"
        style={{ isolation: "isolate" }}
      >
        {/* Full-screen background image */}
        <div className="hero-bg-img absolute z-0" style={{ top: "-150px", bottom: "-150px", left: 0, right: 0 }}>
          <Image
            src="/images/hero-image/IMG_5337.JPG.jpeg"
            alt="With Friends"
            fill
            className="object-cover"
            priority
            quality={100}
            sizes="100vw"
          />
        </div>

        {/* Very subtle dark vignette — bottom only for text readability */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.10) 40%, transparent 70%)",
          }}
        />

        {/* Subtle overall dark overlay ~20% */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: "rgba(0,0,0,0.20)" }}
        />

        {/* ── Top-left logo ── */}
        <div className="page-logo absolute top-5 left-5 sm:top-7 sm:left-8 z-10">
          <Link href="/" className="block">
            <p className="text-white text-xs font-medium leading-snug tracking-wider" style={{ fontFamily: "var(--font-apple)" }}>
              Journal<br />
              <span className="opacity-60">with friends</span>
            </p>
          </Link>
        </div>

        {/* ── Top-right navigation ── */}
        <nav className="absolute top-5 right-5 sm:top-7 sm:right-8 z-10 flex items-center gap-4 sm:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`page-nav-item text-[10px] sm:text-xs tracking-wider transition-opacity ${link.href === "/friends" ? "text-white" : "text-white/50 hover:text-white/80"}`}
              style={{
                fontFamily: "var(--font-apple)",
                textDecoration: link.href === "/friends" ? "underline" : "none",
                textUnderlineOffset: "4px",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Bottom-left large title ── */}
        <div className="absolute bottom-8 left-5 sm:bottom-10 sm:left-8 z-10 max-w-[85vw] sm:max-w-[65vw]">
          <h1
            ref={titleRef}
            className="text-white font-light leading-none"
            style={{
              fontFamily: "var(--font-apple)",
              fontSize: "clamp(2.8rem, 8vw, 7rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
            }}
          >
            With<br />
            Friends.
          </h1>
        </div>
      </section>

      {/* ── CLARITY HEADLINE ── */}
      <FriendsClaritySection />

      {/* ── FULL IMAGE ── */}
      <FriendsFullImage />

      {/* ── INFO SECTION ── */}
      <FriendsInfoSection />

      {/* ── LARGE TYPOGRAPHY ── */}
      <FriendsMarqueeText />

      {/* ── FROM X TO Y ── */}
      <FriendsFromTo />

      {/* ── SELECTED MEMORIES ── */}
      <FriendsSelectedMemories entries={entries} />

      {/* ── ENTRY GRID ── */}
      <section className="px-5 sm:px-8 lg:px-16 py-12 md:py-16" style={{ background: "var(--j-bg)" }}>
        <div className="flex items-end justify-between mb-8 md:mb-10 max-w-[1440px] mx-auto">
          <div>
            <p className="text-xs tracking-widest uppercase font-mono-custom mb-1.5" style={{ color: "var(--j-text-3)" }}>
              {entries.length} moment{entries.length !== 1 ? "s" : ""}
            </p>
            <h2
              className="font-light"
              style={{ fontFamily: "var(--font-apple)", fontSize: "clamp(1.3rem, 2vw, 1.75rem)", letterSpacing: "-0.03em", color: "var(--j-text-1)" }}
            >
              All Memories
            </h2>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-sm font-mono-custom tracking-widest" style={{ color: "var(--j-text-4)" }}>
              No entries yet
            </p>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1440px] mx-auto"
          >
            {entries.map((entry) => (
              <EntryGridCard key={entry.slug} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// ── Individual entry card ──
function EntryGridCard({ entry }: { entry: Entry }) {
  const cover = entry.media[0]

  return (
    <Link href={`/entry/${entry.slug}`} className="block group grid-card">
      <article
        className="overflow-hidden rounded-lg"
        style={{ background: "var(--j-surface)" }}
      >
        {/* Cover */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "3/2", background: "var(--j-bg-alt)" }}
        >
          {cover ? (
            <Image
              src={cover.url}
              alt={entry.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 1440px) 33vw, 480px"
            />
          ) : entry.cover ? (
            <Image
              src={entry.cover}
              alt={entry.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 1440px) 33vw, 480px"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: "var(--j-bg-alt)" }} />
          )}
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.08) 45%, transparent 100%)",
            }}
          />

          {/* Info over photo */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {entry.location && (
              <div className="flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-2.5 h-2.5 text-white/60" />
                <span className="text-[10px] tracking-widest uppercase text-white/60">
                  {entry.location}
                </span>
              </div>
            )}
            <h3
              className="text-white font-light leading-tight"
              style={{ fontSize: "1.05rem", letterSpacing: "-0.02em" }}
            >
              {entry.title}
            </h3>
            <p className="font-mono-custom text-[10px] text-white/40 mt-1">
              {formatDate(entry.date)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  )
}
