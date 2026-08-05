// src/types/entry.ts
// Simplified types — no Prisma dependency

export type MediaType = "PHOTO" | "VIDEO"
export type MusicSource = "UPLOAD" | "ITUNES"
export type MusicDuration = "FIFTEEN" | "THIRTY" | "SIXTY"

export interface Media {
  id: string
  url: string
  public_id: string
  type: MediaType
  caption: string | null
  order: number
  created_at: Date
  entry_id: string
}

export interface Music {
  id: string
  source: MusicSource
  file_url: string | null
  file_public_id: string | null
  itunes_track_id: string | null
  preview_url: string | null
  track_name: string | null
  artist_name: string | null
  album_name: string | null
  album_art_url: string | null
  start_time: number
  duration: MusicDuration
  created_at: Date
  entry_id: string
}

export interface Location {
  id: string
  display_name: string
  place_id: string
  lat: number
  lng: number
  created_at: Date
  entry_id: string
}

export interface EntryCard {
  slug: string
  title: string
  date_taken: Date
  media: Pick<Media, "url" | "type">[]
  location: Pick<Location, "display_name"> | null
}
