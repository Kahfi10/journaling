export const dynamic = "force-dynamic"

import Link from "next/link"
import { MusicPlayer } from "@/components/entry/MusicPlayer"
import { createDefaultBackgroundMusic } from "@/lib/background-music"
import { getConfiguredPageMusic } from "@/lib/page-settings"

const PAGES = [
  { href: "/friends", label: "Friends", sub: "Moments with the crew" },
  { href: "/me", label: "Me", sub: "Personal captures" },
  { href: "/together", label: "Together", sub: "Just the two of us" },
]

export default function HomePage() {
  const music = getConfiguredPageMusic("home", createDefaultBackgroundMusic("home"))

  return (
    <>
      <main
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "var(--j-bg)" }}
      >
        <div className="mb-16 text-center">
          <h1
            className="font-light"
            style={{
              fontFamily: "var(--font-apple)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              letterSpacing: "-0.04em",
              color: "var(--j-text-1)",
              lineHeight: 0.95,
            }}
          >
            Journal
          </h1>
          <p
            className="text-xs tracking-widest uppercase font-mono-custom mt-3"
            style={{ color: "var(--j-text-3)" }}
          >
            A personal archive
          </p>
        </div>

        <nav className="flex flex-col items-center gap-0 w-full max-w-xs px-5 sm:px-0 sm:max-w-sm">
          {PAGES.map((page, i) => (
            <Link
              key={page.href}
              href={page.href}
              className="group flex items-center justify-between w-full py-4 transition-opacity hover:opacity-50"
              style={{
                borderTop: i === 0 ? "1px solid var(--j-border)" : "none",
                borderBottom: "1px solid var(--j-border)",
              }}
            >
              <span
                className="font-light text-base sm:text-lg"
                style={{ fontFamily: "var(--font-apple)", letterSpacing: "-0.02em", color: "var(--j-text-1)" }}
              >
                {page.label}
              </span>
              <span className="text-xs font-mono-custom" style={{ color: "var(--j-text-3)" }}>
                {page.sub}
              </span>
            </Link>
          ))}
        </nav>
      </main>
      <MusicPlayer music={music} autoplay loop />
    </>
  )
}
