"use client"

import { useEffect, useMemo, useState } from "react"
import type { Entry } from "@/data/types"
import { SectionTracksEditor, type SectionTrackForm } from "./SectionTracksEditor"
import { TrackSearchPicker, type ItunesTrack } from "./TrackSearchPicker"

type MusicFormState = {
  enabled: boolean
  source: "UPLOAD" | "ITUNES"
  file_url: string
  preview_url: string
  track_name: string
  artist_name: string
  album_art_url: string
  start_time: string
  duration: "FIFTEEN" | "THIRTY" | "SIXTY"
}

type EntryFormState = {
  title: string
  date: string
  location: string
  category: Entry["category"]
  cover: string
  description: string
  music: MusicFormState
  sectionMusic: SectionTrackForm[]
}

type AdminEntry = Entry

function createEmptyMusic(): MusicFormState {
  return {
    enabled: false,
    source: "UPLOAD",
    file_url: "",
    preview_url: "",
    track_name: "",
    artist_name: "",
    album_art_url: "",
    start_time: "0",
    duration: "THIRTY",
  }
}

function createDefaultSectionMusic(entry: AdminEntry): SectionTrackForm[] {
  const mediaDefaults = (entry.media ?? []).map((_, index) => ({
    sectionKey: `media-${index}`,
    source: "ITUNES" as const,
    file_url: "",
    preview_url: "",
    track_name: "",
    artist_name: "",
    album_art_url: "",
    start_time: "0",
    duration: "THIRTY" as const,
  }))

  return [
    {
      sectionKey: "hero",
      source: "ITUNES",
      file_url: "",
      preview_url: "",
      track_name: "",
      artist_name: "",
      album_art_url: "",
      start_time: "0",
      duration: "THIRTY",
    },
    {
      sectionKey: "story",
      source: "ITUNES",
      file_url: "",
      preview_url: "",
      track_name: "",
      artist_name: "",
      album_art_url: "",
      start_time: "0",
      duration: "THIRTY",
    },
    {
      sectionKey: "memory-intro",
      source: "ITUNES",
      file_url: "",
      preview_url: "",
      track_name: "",
      artist_name: "",
      album_art_url: "",
      start_time: "0",
      duration: "THIRTY",
    },
    {
      sectionKey: "gallery",
      source: "ITUNES",
      file_url: "",
      preview_url: "",
      track_name: "",
      artist_name: "",
      album_art_url: "",
      start_time: "0",
      duration: "THIRTY",
    },
    ...mediaDefaults,
  ]
}

function createFormState(entry: AdminEntry): EntryFormState {
  return {
    title: entry.title,
    date: entry.date,
    location: entry.location ?? "",
    category: entry.category,
    cover: entry.cover,
    description: entry.description ?? "",
    music: entry.music
      ? {
          enabled: true,
          source: entry.music.source,
          file_url: entry.music.file_url ?? "",
          preview_url: entry.music.preview_url ?? "",
          track_name: entry.music.track_name ?? "",
          artist_name: entry.music.artist_name ?? "",
          album_art_url: entry.music.album_art_url ?? "",
          start_time: String(entry.music.start_time ?? 0),
          duration: entry.music.duration,
        }
      : createEmptyMusic(),
    sectionMusic:
      entry.sectionMusic
        ?.map((slot) => {
          if (!slot.music) {
            return null
          }

          return {
            sectionKey: slot.sectionKey,
            source: slot.music.source,
            file_url: slot.music.file_url ?? "",
            preview_url: slot.music.preview_url ?? "",
            track_name: slot.music.track_name ?? "",
            artist_name: slot.music.artist_name ?? "",
            album_art_url: slot.music.album_art_url ?? "",
            start_time: String(slot.music.start_time ?? 0),
            duration: slot.music.duration,
          }
        })
        .filter((slot): slot is SectionTrackForm => Boolean(slot)) ?? createDefaultSectionMusic(entry),
  }
}

export function EntrySettingsAdmin() {
  const [entries, setEntries] = useState<AdminEntry[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string>("")
  const [form, setForm] = useState<EntryFormState | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const response = await fetch("/api/admin/entry-settings", { cache: "no-store" })
      const data = await response.json()
      setEntries(data.entries ?? [])
      setLoading(false)
    }

    load().catch(() => {
      setMessage("Gagal memuat data.")
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!entries.length) return
    const current = entries.find((entry) => entry.slug === selectedSlug) ?? entries[0]
    setSelectedSlug(current.slug)
    setForm(createFormState(current))
  }, [entries, selectedSlug])

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.slug === selectedSlug) ?? entries[0] ?? null,
    [entries, selectedSlug]
  )

  const updateField = (key: keyof EntryFormState, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const updateMusicField = (key: keyof MusicFormState, value: string | boolean) => {
    setForm((prev) => {
      if (!prev) return prev
      return { ...prev, music: { ...prev.music, [key]: value } }
    })
  }

  const updateSectionMusic = (value: SectionTrackForm[]) => {
    setForm((prev) => (prev ? { ...prev, sectionMusic: value } : prev))
  }

  const applyItunesTrack = (track: ItunesTrack) => {
    setForm((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        music: {
          ...prev.music,
          enabled: true,
          source: "ITUNES",
          preview_url: track.previewUrl,
          track_name: track.trackName,
          artist_name: track.artistName,
          album_art_url: track.artworkUrl,
          file_url: "",
          start_time: "0",
          duration: "THIRTY",
        },
      }
    })
  }

  const saveEntry = async () => {
    if (!selectedSlug || !form) return
    setSaving(true)
    setMessage("")

    const payload = {
      title: form.title,
      date: form.date,
      location: form.location.trim() ? form.location.trim() : null,
      category: form.category,
      cover: form.cover,
      description: form.description,
      music: form.music.enabled
        ? {
            source: form.music.source,
            file_url: form.music.file_url.trim() || null,
            preview_url: form.music.preview_url.trim() || null,
            track_name: form.music.track_name.trim() || null,
            artist_name: form.music.artist_name.trim() || null,
            album_art_url: form.music.album_art_url.trim() || null,
            start_time: Number(form.music.start_time || 0),
            duration: form.music.duration,
          }
        : null,
      sectionMusic:
        form.sectionMusic.length > 0
          ? form.sectionMusic.map((slot) => ({
              sectionKey: slot.sectionKey,
              music: {
                source: slot.source,
                file_url: slot.file_url.trim() || null,
                preview_url: slot.preview_url.trim() || null,
                track_name: slot.track_name.trim() || null,
                artist_name: slot.artist_name.trim() || null,
                album_art_url: slot.album_art_url.trim() || null,
                start_time: Number(slot.start_time || 0),
                duration: slot.duration,
              },
            }))
          : null,
    }

    const response = await fetch(`/api/admin/entry-settings/${selectedSlug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      setMessage("Gagal menyimpan perubahan.")
      setSaving(false)
      return
    }

    const data = await response.json()
    setEntries((prev) => prev.map((entry) => (entry.slug === selectedSlug ? data.entry : entry)))
    setForm(createFormState(data.entry))
    setSaving(false)
    setMessage("Perubahan tersimpan.")
  }

  const resetEntry = async () => {
    if (!selectedSlug) return
    setSaving(true)
    const response = await fetch(`/api/admin/entry-settings/${selectedSlug}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      setMessage("Gagal reset.")
      setSaving(false)
      return
    }

    const data = await response.json()
    setEntries((prev) => prev.map((entry) => (entry.slug === selectedSlug ? data.entry : entry)))
    setForm(createFormState(data.entry))
    setSaving(false)
    setMessage("Override direset ke data dasar.")
  }

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12" style={{ background: "var(--j-bg)" }}>
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.34em] uppercase mb-2 font-mono-custom" style={{ color: "var(--j-text-3)" }}>
            Admin / Entry Settings
          </p>
          <h1 className="font-light" style={{ fontFamily: "var(--font-apple)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--j-text-1)" }}>
            Mengatur metadata dan music per entry
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: "var(--j-text-3)" }}>
            Fokusnya sekarang: metadata dasar, satu lagu utama, dan track berbeda untuk tiap section.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-sm font-mono-custom uppercase tracking-[0.26em]" style={{ color: "var(--j-text-3)" }}>
            Loading...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="rounded-2xl border p-4" style={{ borderColor: "var(--j-border)", background: "var(--j-surface)" }}>
              <p className="mb-4 text-xs tracking-[0.3em] uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
                Entries
              </p>
              <div className="space-y-2">
                {entries.map((entry) => (
                  <button
                    key={entry.slug}
                    onClick={() => {
                      setSelectedSlug(entry.slug)
                      setForm(createFormState(entry))
                    }}
                    className="w-full rounded-xl border px-4 py-3 text-left transition-colors"
                    style={{
                      borderColor: selectedSlug === entry.slug ? "var(--j-text-1)" : "var(--j-border)",
                      background: selectedSlug === entry.slug ? "rgba(0,0,0,0.04)" : "transparent",
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-light" style={{ fontFamily: "var(--font-apple)", color: "var(--j-text-1)" }}>
                          {entry.title}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.26em] mt-1" style={{ color: "var(--j-text-3)" }}>
                          {entry.category}
                        </p>
                      </div>
                      <span className="text-[10px] tracking-[0.22em] uppercase" style={{ color: "var(--j-text-4)" }}>
                        {entry.music ? "Music" : "No music"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <section className="rounded-2xl border p-5 sm:p-6 lg:p-8" style={{ borderColor: "var(--j-border)", background: "var(--j-surface)" }}>
              {!selectedEntry || !form ? (
                <p className="text-sm" style={{ color: "var(--j-text-3)" }}>
                  Pilih entry dulu.
                </p>
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.28em] uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
                        Editing
                      </p>
                      <h2 className="text-2xl font-light" style={{ fontFamily: "var(--font-apple)", color: "var(--j-text-1)" }}>
                        {selectedEntry.title}
                      </h2>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={resetEntry}
                        className="rounded-full border px-4 py-2 text-xs tracking-[0.22em] uppercase"
                        style={{ borderColor: "var(--j-border)", color: "var(--j-text-2)" }}
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={saveEntry}
                        disabled={saving}
                        className="rounded-full border px-4 py-2 text-xs tracking-[0.22em] uppercase"
                        style={{
                          borderColor: "var(--j-text-1)",
                          color: "var(--j-bg)",
                          background: "var(--j-text-1)",
                        }}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>

                  {message ? (
                    <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--j-text-3)" }}>
                      {message}
                    </p>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={form.title} onChange={(value) => updateField("title", value)} />
                    <Field label="Date" value={form.date} onChange={(value) => updateField("date", value)} />
                    <Field label="Location" value={form.location} onChange={(value) => updateField("location", value)} />
                    <Field label="Cover" value={form.cover} onChange={(value) => updateField("cover", value)} />
                    <div className="md:col-span-2">
                      <Label>Category</Label>
                      <select
                        value={form.category}
                        onChange={(event) => updateField("category", event.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none"
                        style={{ borderColor: "var(--j-border)", background: "var(--j-bg)", color: "var(--j-text-1)" }}
                      >
                        <option value="friends">friends</option>
                        <option value="me">me</option>
                        <option value="together">together</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <textarea
                        value={form.description}
                        onChange={(event) => updateField("description", event.target.value)}
                        rows={5}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none"
                        style={{ borderColor: "var(--j-border)", background: "var(--j-bg)", color: "var(--j-text-1)" }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border p-4" style={{ borderColor: "var(--j-border)" }}>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-[10px] tracking-[0.3em] uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
                          Background Music
                        </p>
                        <p className="text-sm" style={{ color: "var(--j-text-3)" }}>
                          Pilih lagu iTunes, lalu preview 30s akan dipakai otomatis.
                        </p>
                      </div>
                      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.22em]" style={{ color: "var(--j-text-2)" }}>
                        <input
                          type="checkbox"
                          checked={form.music.enabled}
                          onChange={(event) => updateMusicField("enabled", event.target.checked)}
                        />
                        Enabled
                      </label>
                    </div>

                    <TrackSearchPicker
                      label="Pilih lagu iTunes"
                      placeholder="Cari judul lagu atau artis"
                      onPick={applyItunesTrack}
                      initialQuery={form.music.track_name || form.music.artist_name}
                    />

                    {form.music.track_name ? (
                      <div className="mt-4 flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: "var(--j-border)", background: "rgba(0,0,0,0.02)" }}>
                        {form.music.album_art_url ? (
                          <img
                            src={form.music.album_art_url}
                            alt={form.music.track_name}
                            className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : null}
                        <div className="min-w-0">
                          <p className="truncate font-light" style={{ color: "var(--j-text-1)", fontFamily: "var(--font-apple)" }}>
                            {form.music.track_name}
                          </p>
                          <p className="truncate text-xs" style={{ color: "var(--j-text-3)" }}>
                            {form.music.artist_name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-4 text-xs" style={{ color: "var(--j-text-3)" }}>
                        Belum ada lagu dipilih.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border p-4" style={{ borderColor: "var(--j-border)" }}>
                    <SectionTracksEditor value={form.sectionMusic} onChange={updateSectionMusic} />
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

function Label({ children }: { children: string }) {
  return (
    <p className="text-[10px] tracking-[0.28em] uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
      {children}
    </p>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none"
        style={{ borderColor: "var(--j-border)", background: "var(--j-bg)", color: "var(--j-text-1)" }}
      />
    </div>
  )
}
