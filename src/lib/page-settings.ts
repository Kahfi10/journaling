import fs from "node:fs"
import path from "node:path"
import type { Music } from "@/types/entry"
import { normalizeMusicPayload, type MusicPayload } from "@/lib/entry-settings"

export type PageMusicScope = "home" | "friends"

export interface PageMusicSettingsPatch {
  music?: Music | null
}

export interface StoredPageMusicSettings {
  home?: PageMusicSettingsPatch
  friends?: PageMusicSettingsPatch
}

const storageDir = path.join(process.cwd(), "storage")
const settingsFile = path.join(storageDir, "page-settings.json")

function ensureStorageFile() {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true })
  }

  if (!fs.existsSync(settingsFile)) {
    fs.writeFileSync(settingsFile, "{}\n", "utf8")
  }
}

export function readPageMusicSettings(): StoredPageMusicSettings {
  ensureStorageFile()
  const raw = fs.readFileSync(settingsFile, "utf8").trim()
  if (!raw) return {}

  return JSON.parse(raw) as StoredPageMusicSettings
}

export function writePageMusicSettings(settings: StoredPageMusicSettings) {
  ensureStorageFile()
  fs.writeFileSync(settingsFile, `${JSON.stringify(settings, null, 2)}\n`, "utf8")
}

export function getPageMusicSettings(scope: PageMusicScope): PageMusicSettingsPatch {
  return readPageMusicSettings()[scope] ?? {}
}

export function updatePageMusicSettings(scope: PageMusicScope, patch: PageMusicSettingsPatch): PageMusicSettingsPatch {
  const current = readPageMusicSettings()
  const merged = {
    ...current,
    [scope]: {
      ...(current[scope] ?? {}),
      ...patch,
    },
  }

  writePageMusicSettings(merged)
  return merged[scope] ?? patch
}

export function removePageMusicSettings(scope: PageMusicScope) {
  const current = readPageMusicSettings()
  if (scope in current) {
    delete current[scope]
    writePageMusicSettings(current)
  }
}

export function normalizePageMusicPayload(payload: MusicPayload | null | undefined, scope: PageMusicScope): Music | null {
  return normalizeMusicPayload(payload, scope)
}

export function getConfiguredPageMusic(scope: PageMusicScope, fallback: Music): Music {
  return getPageMusicSettings(scope).music ?? fallback
}
