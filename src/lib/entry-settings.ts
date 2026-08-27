import fs from "node:fs"
import path from "node:path"
import type { Entry, MusicSource, MusicDuration } from "@/types/entry"

export interface EntrySettingsPatch {
  title?: string
  date?: string
  location?: string | null
  category?: Entry["category"]
  cover?: string
  description?: string
  music?: Entry["music"] | null
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
