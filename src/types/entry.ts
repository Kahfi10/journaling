// src/types/entry.ts
import type { Entry, Media, Music, Location, MediaType, MusicSource, MusicDuration } from "@prisma/client"

export type { MediaType, MusicSource, MusicDuration }

// Entry dengan semua relasi — untuk detail page
export type EntryFull = Entry & {
  media: Media[]
  music: Music | null
  location: Location | null
}

// Entry untuk feed card — data minimal
export type EntryCard = {
  slug: string
  title: string
  date_taken: Date
  media: Pick<Media, "url" | "type">[]
  location: Pick<Location, "display_name"> | null
}

// Entry untuk admin list
export type EntryListItem = {
  id: string
  slug: string
  title: string
  published: boolean
  date_taken: Date
  created_at: Date
  media: Pick<Media, "url">[]
  _count: { media: number }
}

// Media individual
export type { Media, Music, Location }
