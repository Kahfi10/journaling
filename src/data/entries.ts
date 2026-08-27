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
    title: "Samalona Island",
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
    slug: "beach-sunset-2024",
    title: "Sunset at the Shore",
    date: "2024-10-09",
    location: "Makassar, Indonesia",
    category: "friends",
    cover: "/images/memories-beach-90ct2024/IMG-20241009-WA0026.jpg.jpeg",
    description: "One of those evenings that nobody planned but everybody remembered. Sitting on rocks by the sea, watching the sky turn orange, saying nothing and everything at the same time.",
    media: [
      { url: "/images/memories-beach-90ct2024/IMG-20241009-WA0011.jpg.jpeg", type: "PHOTO", caption: "Rocks and the horizon" },
      { url: "/images/memories-beach-90ct2024/IMG-20241009-WA0026.jpg.jpeg", type: "PHOTO", caption: "Catching the last light" },
      { url: "/images/memories-beach-90ct2024/IMG-20241009-WA0012.jpg.jpeg", type: "PHOTO", caption: "Before the sky went dark" },
      { url: "/images/memories-beach-90ct2024/IMG-20241009-WA0038(1).jpg.jpeg", type: "PHOTO", caption: "The usual crew" },
      { url: "/images/memories-beach-90ct2024/IMG-20241009-WA0047.jpg.jpeg", type: "PHOTO", caption: "End of the evening" },
    ],
  },
  {
    slug: "day-out-april-2025",
    title: "Just Another Day",
    date: "2025-04-09",
    location: "Makassar, Indonesia",
    category: "friends",
    cover: "/images/memories-another/IMG-20250409-WA0011(1).jpg.jpeg",
    description: "No itinerary, no plans — just a random day that turned into a full afternoon with the crew. The kind of day that's ordinary until it isn't.",
    media: [
      { url: "/images/memories-another/IMG-20250409-WA0011(1).jpg.jpeg", type: "PHOTO", caption: "The whole gang, all nine" },
      { url: "/images/memories-another/IMG-20250409-WA0020.jpg.jpeg", type: "PHOTO", caption: "Still going strong" },
      { url: "/images/memories-another/IMG-20250409-WA0021.jpg.jpeg", type: "PHOTO", caption: "Somewhere in between" },
      { url: "/images/memories-another/IMG-20250409-WA0023.jpg.jpeg", type: "PHOTO", caption: "Last stop of the day" },
    ],
  },
  {
    slug: "late-2024-memories",
    title: "Between November and February",
    date: "2024-11-01",
    location: "Makassar, Indonesia",
    category: "friends",
    cover: "/images/memories-another2/IMG-20241101-WA0042.jpg.jpeg",
    description: "A stretch of months that kept giving — hangouts at school, walks through the park, the kind of low-key time that quietly becomes your favorite season.",
    media: [
      { url: "/images/memories-another2/IMG-20241101-WA0042.jpg.jpeg", type: "PHOTO", caption: "Blue door, blue sky" },
      { url: "/images/memories-another2/IMG-20241106-WA0029(2).jpg.jpeg", type: "PHOTO", caption: "November afternoon" },
      { url: "/images/memories-another2/IMG-20241106-WA0063(1).jpg.jpeg", type: "PHOTO", caption: "Somewhere familiar" },
      { url: "/images/memories-another2/IMG-20250129-WA0008.jpg.jpeg", type: "PHOTO", caption: "January, briefly" },
      { url: "/images/memories-another2/IMG-20250202-WA0112(1).jpg.jpeg", type: "PHOTO", caption: "The bridge we keep coming back to" },
      { url: "/images/memories-another2/IMG-20250202-WA0114.jpg.jpeg", type: "PHOTO", caption: "February light" },
      { url: "/images/memories-another2/IMG-20250202-WA0116.jpg.jpeg", type: "PHOTO", caption: "Slow and easy" },
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
