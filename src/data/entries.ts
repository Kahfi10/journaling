// src/data/entries.ts
// Semua entries disimpan di sini
// Tambah entry baru dengan menambah object ke array ini

import type { Entry } from "./types"
import { mergeEntrySettings } from "@/lib/entry-settings"

export const entries: Entry[] = [
  // ── FRIENDS ──────────────────────────────────────────────────────────────
  {
    slug: "samalona-2026",
    title: "Samalona",
    date: "2026-08-16",
    location: "Samalona, Makassar",
    category: "friends",
    cover: "/images/memories-samalona/DSC00577.JPG",
    description: "A slow island day that turned into one of those memories you keep replaying later — warm water, loud laughter, and the kind of escape that makes everything feel lighter.",
    media: [
      { url: "/images/memories-samalona/DSC00577.JPG", type: "PHOTO", caption: "Leaving with salt on our skin" },
      { url: "/images/memories-samalona/DSC01305.JPG", type: "PHOTO", caption: "Arrival and open water" },
      { url: "/images/memories-samalona/DSC01303.JPG", type: "PHOTO", caption: "Before the swim" },
      { url: "/images/memories-samalona/DSC01298.JPG", type: "PHOTO", caption: "Small moments, big mood" },
      { url: "/images/memories-samalona/DSC01297.JPG", type: "PHOTO", caption: "Together on the shore" },
      { url: "/images/memories-samalona/DSC00623.JPG", type: "PHOTO", caption: "The island view" },
    ],
  },
  {
    slug: "demo-1",
    title: "Late Night Drive",
    date: "2023-10-14",
    location: "Jakarta, Indonesia",
    category: "friends",
    cover: "/images/hero-image/IMG_5337.JPG.jpeg",
    description: "Sometimes the best plan is having no plan at all. Just driving through the empty city streets, looking for a place to eat at 2 AM, and talking about everything and nothing.",
    media: [
      { url: "/images/hero-image/IMG_5337.JPG.jpeg", type: "PHOTO", caption: "Empty streets" },
      { url: "/images/hero-image/IMG_6175.JPG.jpeg", type: "PHOTO", caption: "The crew" },
    ]
  },
  {
    slug: "demo-2",
    title: "Coffee & Conversations",
    date: "2024-01-22",
    location: "Bandung, West Java",
    category: "friends",
    cover: "/images/hero-image/IMG_6175.JPG.jpeg",
    description: "A quick weekend escape. Three coffee shops in one day, too much caffeine, and endless stories.",
    media: [
      { url: "/images/hero-image/IMG_6175.JPG.jpeg", type: "PHOTO" }
    ]
  },
  {
    slug: "demo-3",
    title: "Random Stops",
    date: "2024-03-05",
    location: "Bogor, West Java",
    category: "friends",
    cover: "/images/hero-image/IMG_5337.JPG.jpeg",
    description: "We were supposed to go hiking, but it rained. Ended up finding this random spot that became our favorite place.",
    media: [
      { url: "/images/hero-image/IMG_5337.JPG.jpeg", type: "PHOTO" }
    ]
  }

  // ── ME ───────────────────────────────────────────────────────────────────
  // Tambahkan entries personal di sini

  // ── TOGETHER ─────────────────────────────────────────────────────────────
  // Tambahkan entries together di sini
]

// Helper — get by slug
export function getEntryBySlug(slug: string): Entry | undefined {
  const entry = entries.find((e) => e.slug === slug)
  return entry ? mergeEntrySettings(entry) : undefined
}

// Helper — get by category
export function getEntriesByCategory(category: Entry["category"]): Entry[] {
  return entries.map(mergeEntrySettings).filter((e) => e.category === category)
}

// Helper — get all slugs (for generateStaticParams)
export function getAllSlugs(): string[] {
  return entries.map((e) => e.slug)
}
