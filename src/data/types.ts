// src/data/types.ts
// Static data types — no database needed

import type { Music as RuntimeMusic } from "@/types/entry"

export type MediaType = "PHOTO" | "VIDEO"
export type MusicSource = "ITUNES" | "UPLOAD"
export type PageCategory = "friends" | "me" | "together"

export interface MediaItem {
  url: string
  type: MediaType
  caption?: string
}

export interface MusicItem {
  source: MusicSource
  trackName?: string
  artistName?: string
  albumArtUrl?: string
  previewUrl?: string   // iTunes 30s preview URL
  fileUrl?: string      // self-uploaded audio URL
  startTime?: number
  duration?: 15 | 30 | 60
}

export interface SectionMusicItem {
  sectionKey: string
  music?: RuntimeMusic
}

export interface Entry {
  slug: string
  title: string
  date: string          // ISO string e.g. "2024-03-15"
  location?: string     // display name e.g. "Bromo, East Java"
  description?: string
  category: PageCategory
  cover: string         // URL of cover image (first media)
  media: MediaItem[]
  music?: MusicItem
  sectionMusic?: SectionMusicItem[]
}
