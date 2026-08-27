import fs from "node:fs"
import path from "node:path"
import type { Entry, MusicSource, MusicDuration, Music } from "@/types/entry"

export interface EntrySettingsPatch {
  title?: string
  date?: string
  location?: string | null
  category?: Entry["category"]
  cover?: string
  description?: string
  music?: Entry["music"] | null
  sectionMusic?: Entry["sectionMusic"] | null
}

export interface StoredEntrySettings {
  [slug: string]: EntrySettingsPatch
}

const storageDir = path.join(process.cwd(), "storage")
const settingsFile = path.join(storageDir, "entry-settings.json")

function ensureStorageFile() {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true })
  }

  if (!fs.existsSync(settingsFile)) {
    fs.writeFileSync(settingsFile, "{}\n", "utf8")
  }
}

export function readEntrySettings(): StoredEntrySettings {
  ensureStorageFile()
  const raw = fs.readFileSync(settingsFile, "utf8").trim()
  if (!raw) return {}

  return JSON.parse(raw) as StoredEntrySettings
}

export function writeEntrySettings(settings: StoredEntrySettings) {
  ensureStorageFile()
  fs.writeFileSync(settingsFile, `${JSON.stringify(settings, null, 2)}\n`, "utf8")
}

export function getEntrySettings(slug: string): EntrySettingsPatch {
  return readEntrySettings()[slug] ?? {}
}

export function updateEntrySettings(slug: string, patch: EntrySettingsPatch): EntrySettingsPatch {
  const current = readEntrySettings()
  const merged = {
    ...current,
    [slug]: {
      ...(current[slug] ?? {}),
      ...patch,
    },
  }

  writeEntrySettings(merged)
  return merged[slug]
}

export function removeEntrySettings(slug: string) {
  const current = readEntrySettings()
  if (slug in current) {
    delete current[slug]
    writeEntrySettings(current)
  }
}

export function mergeEntrySettings(entry: Entry): Entry {
  const settings = getEntrySettings(entry.slug)
  const merged: Entry = { ...entry }

  if (settings.title !== undefined) merged.title = settings.title
  if (settings.date !== undefined) merged.date = settings.date
  if (settings.location !== undefined) merged.location = settings.location ?? undefined
  if (settings.category !== undefined) merged.category = settings.category
  if (settings.cover !== undefined) merged.cover = settings.cover
  if (settings.description !== undefined) merged.description = settings.description
  if (settings.music !== undefined) merged.music = settings.music ?? undefined
  if (settings.sectionMusic !== undefined) merged.sectionMusic = settings.sectionMusic ?? undefined

  return merged
}

export function normalizeMusicSource(value: string): MusicSource {
  return value === "ITUNES" ? "ITUNES" : "UPLOAD"
}

export function normalizeMusicDuration(value: string): MusicDuration {
  if (value === "FIFTEEN") return "FIFTEEN"
  if (value === "SIXTY") return "SIXTY"
  return "THIRTY"
}

export interface MusicPayload {
  source?: string
  file_url?: string | null
  preview_url?: string | null
  track_name?: string | null
  artist_name?: string | null
  album_art_url?: string | null
  start_time?: number | string | null
  duration?: string | null
}

export interface SectionMusicPayload {
  sectionKey?: string
  music?: MusicPayload | null
}

export function normalizeMusicPayload(payload: MusicPayload | null | undefined, slug: string): Music | null {
  if (!payload) return null

  const source = normalizeMusicSource(String(payload.source ?? "UPLOAD"))
  const trackName = payload.track_name ?? null

  if (source === "ITUNES" && !payload.preview_url) {
    return null
  }

  if (source === "UPLOAD" && !payload.file_url) {
    return null
  }

  return {
    id: `${slug}-${trackName ?? "music"}`,
    source,
    file_url: payload.file_url ?? null,
    file_public_id: null,
    itunes_track_id: null,
    preview_url: payload.preview_url ?? null,
    track_name: trackName,
    artist_name: payload.artist_name ?? null,
    album_name: null,
    album_art_url: payload.album_art_url ?? null,
    start_time: Number(payload.start_time ?? 0),
    duration: normalizeMusicDuration(String(payload.duration ?? "THIRTY")),
    created_at: new Date(),
    entry_id: slug,
  }
}

export function normalizeSectionMusicPayload(slots: SectionMusicPayload[] | null | undefined, slug: string): Entry["sectionMusic"] {
  if (!slots || slots.length === 0) return undefined

  const normalized = slots
    .map((slot, index) => {
      const sectionKey = typeof slot.sectionKey === "string" ? slot.sectionKey.trim() : ""
      if (!sectionKey) return null

      const music = normalizeMusicPayload(slot.music, slug)
      if (!music) return null

      return {
        sectionKey,
        music: {
          ...music,
          id: `${slug}-${sectionKey}-${index}`,
        },
      }
    })
    .filter((slot): slot is NonNullable<typeof slot> => Boolean(slot))

  return normalized.length > 0 ? normalized : undefined
}
