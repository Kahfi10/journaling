// src/data/entries.ts
// Semua entries disimpan di sini
// Tambah entry baru dengan menambah object ke array ini

import type { Entry } from "./types"

export const entries: Entry[] = [
  // ── FRIENDS ──────────────────────────────────────────────────────────────
  // Tambahkan entries friends di sini
  // Contoh:
  // {
  //   slug: "bromo-trip-2023",
  //   title: "Bromo Trip",
  //   date: "2023-12-15",
  //   location: "Bromo, East Java",
  //   category: "friends",
  //   cover: "https://res.cloudinary.com/azl3dxah/image/upload/...",
  //   media: [
  //     { url: "https://res.cloudinary.com/...", type: "PHOTO", caption: "Sunrise at the crater" },
  //     { url: "https://res.cloudinary.com/...", type: "PHOTO", caption: "Sea of sand" },
  //   ],
  //   music: {
  //     source: "ITUNES",
  //     trackName: "nama lagu",
  //     artistName: "nama artis",
  //     previewUrl: "https://audio-ssl.itunes.apple.com/...",
  //     albumArtUrl: "https://is1-ssl.mzstatic.com/...",
  //   }
  // },

  // ── ME ───────────────────────────────────────────────────────────────────
  // Tambahkan entries personal di sini

  // ── TOGETHER ─────────────────────────────────────────────────────────────
  // Tambahkan entries together di sini
]

// Helper — get by slug
export function getEntryBySlug(slug: string): Entry | undefined {
  return entries.find((e) => e.slug === slug)
}

// Helper — get by category
export function getEntriesByCategory(category: Entry["category"]): Entry[] {
  return entries.filter((e) => e.category === category)
}

// Helper — get all slugs (for generateStaticParams)
export function getAllSlugs(): string[] {
  return entries.map((e) => e.slug)
}
