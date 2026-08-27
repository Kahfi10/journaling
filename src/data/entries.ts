// src/data/entries.ts
// Semua entries disimpan di sini

import type { Entry as DataEntry } from "./types"
import type { Entry, Media, Music } from "@/types/entry"
import { mergeEntrySettings } from "@/lib/entry-settings"

// ─── Raw static entries ────────────────────────────────────────────────────
const rawEntries: DataEntry[] = [
  // ── FRIENDS ────────────────────────────────────────────────────────────
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
    ],
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
      { url: "/images/hero-image/IMG_6175.JPG.jpeg", type: "PHOTO" },
    ],
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
      { url: "/images/hero-image/IMG_5337.JPG.jpeg", type: "PHOTO" },
    ],
  },

  // ── ME ─────────────────────────────────────────────────────────────────
  // Tambahkan entries personal di sini

  // ── TOGETHER ───────────────────────────────────────────────────────────
  // Tambahkan entries together di sini
]

// ─── Convert simple data format to runtime format ──────────────────────────
function toRuntimeEntry(e: DataEntry): Entry {
  const media: Media[] = e.media.map((m, i) => ({
    id: `${e.slug}-media-${i}`,
    url: m.url,
    public_id: "",
    type: m.type,
    caption: m.caption ?? null,
    order: i,
    created_at: new Date(0),
    entry_id: e.slug,
  }))

  let music: Music | undefined = undefined
  if (e.music) {
    const dur = e.music.duration
    music = {
      id: `${e.slug}-music`,
      source: e.music.source,
      file_url: e.music.fileUrl ?? null,
      file_public_id: null,
      itunes_track_id: null,
      preview_url: e.music.previewUrl ?? null,
      track_name: e.music.trackName ?? null,
      artist_name: e.music.artistName ?? null,
      album_name: null,
      album_art_url: e.music.albumArtUrl ?? null,
      start_time: e.music.startTime ?? 0,
      duration: dur === 15 ? "FIFTEEN" : dur === 60 ? "SIXTY" : "THIRTY",
      created_at: new Date(0),
      entry_id: e.slug,
    }
  }

  return {
    slug: e.slug,
    title: e.title,
    date: e.date,
    location: e.location,
    description: e.description,
    category: e.category,
    cover: e.cover,
    media,
    music,
  }
}

// ─── Exported helpers ──────────────────────────────────────────────────────

export const entries: Entry[] = rawEntries.map(toRuntimeEntry)

export function getEntryBySlug(slug: string): Entry | undefined {
  const entry = entries.find((e) => e.slug === slug)
  return entry ? mergeEntrySettings(entry) : undefined
}

export function getEntriesByCategory(category: Entry["category"]): Entry[] {
  return entries
    .filter((e) => e.category === category)
    .map((e) => mergeEntrySettings(e))
}

export function getAllSlugs(): string[] {
  return entries.map((e) => e.slug)
}
