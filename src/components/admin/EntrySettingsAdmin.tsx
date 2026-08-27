"use client"

import { useEffect, useMemo, useState } from "react"
import type { Entry } from "@/data/types"
import { TrackSearchPicker, type ItunesTrack } from "./TrackSearchPicker"
import type { PageMusicScope } from "@/lib/page-settings"

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
}

type AdminEntry = Entry
type AdminTab = "home" | "friends" | "entries"

const PAGE_TAB_ITEMS: Array<{ key: AdminTab; label: string; description: string }> = [
  { key: "home", label: "Home", description: "Music on the landing page" },
  { key: "friends", label: "Friends", description: "Music on the friends page" },
  { key: "entries", label: "Entry Detail", description: "Per-entry metadata and music" },
]

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

function createMusicFormState(music: AdminEntry["music"] | null | undefined): MusicFormState {
  if (!music) return createEmptyMusic()

  return {
    enabled: true,
    source: music.source ?? "ITUNES",
    file_url: music.file_url ?? "",
    preview_url: music.preview_url ?? "",
    track_name: music.track_name ?? "",
    artist_name: music.artist_name ?? "",
    album_art_url: music.album_art_url ?? "",
    start_time: String(music.start_time ?? 0),
    duration: music.duration ?? "THIRTY",
  }
}

function createFormState(entry: AdminEntry): EntryFormState {
  return {
    title: entry.title,
    date: entry.date,
    location: entry.location ?? "",
    category: entry.category,
    cover: entry.cover,
    description: entry.description ?? "",
    music: createMusicFormState(entry.music),
  }
}

function createMusicPayload(form: MusicFormState) {
  return form.enabled
    ? {
        source: form.source,
        file_url: form.file_url.trim() || null,
        preview_url: form.preview_url.trim() || null,
        track_name: form.track_name.trim() || null,
        artist_name: form.artist_name.trim() || null,
        album_art_url: form.album_art_url.trim() || null,
        start_time: Number(form.start_time || 0),
        duration: form.duration,
      }
    : null
}

export function EntrySettingsAdmin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("home")
  const [entries, setEntries] = useState<AdminEntry[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string>("")
  const [entryForm, setEntryForm] = useState<EntryFormState | null>(null)
  const [pageForms, setPageForms] = useState<Record<PageMusicScope, MusicFormState>>({
    home: createEmptyMusic(),
    friends: createEmptyMusic(),
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [entriesResponse, homeResponse, friendsResponse] = await Promise.all([
        fetch("/api/admin/entry-settings", { cache: "no-store" }),
        fetch("/api/admin/page-music/home", { cache: "no-store" }),
        fetch("/api/admin/page-music/friends", { cache: "no-store" }),
      ])

      const entriesData = await entriesResponse.json()
      const homeData = await homeResponse.json()
      const friendsData = await friendsResponse.json()

      setEntries(entriesData.entries ?? [])
      setPageForms({
        home: createMusicFormState(homeData.settings?.music),
        friends: createMusicFormState(friendsData.settings?.music),
      })
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
    if (current.slug !== selectedSlug) {
      setSelectedSlug(current.slug)
    }
    setEntryForm(createFormState(current))
  }, [entries, selectedSlug])

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.slug === selectedSlug) ?? entries[0] ?? null,
    [entries, selectedSlug]
  )

  const updateEntryField = (key: keyof EntryFormState, value: string) => {
    setEntryForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const updateEntryMusicField = (key: keyof MusicFormState, value: string | boolean) => {
    setEntryForm((prev) => {
      if (!prev) return prev
      return { ...prev, music: { ...prev.music, [key]: value } }
    })
  }

  const updatePageMusicField = (scope: PageMusicScope, key: keyof MusicFormState, value: string | boolean) => {
    setPageForms((prev) => ({
      ...prev,
      [scope]: { ...prev[scope], [key]: value },
    }))
  }

  const applyItunesTrackToEntry = (track: ItunesTrack) => {
    setEntryForm((prev) => {
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

  const applyItunesTrackToPage = (scope: PageMusicScope, track: ItunesTrack) => {
    setPageForms((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
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
    }))
  }

  const savePageMusic = async (scope: PageMusicScope) => {
    setSaving(scope)
    setMessage("")

    const response = await fetch(`/api/admin/page-music/${scope}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ music: createMusicPayload(pageForms[scope]) }),
    })

    if (!response.ok) {
      setMessage(`Gagal menyimpan ${scope}.`)
      setSaving("")
      return
    }

    const data = await response.json()
    setPageForms((prev) => ({
      ...prev,
      [scope]: createMusicFormState(data.settings?.music),
    }))
    setSaving("")
    setMessage(`${scope} tersimpan.`)
  }

  const resetPageMusic = async (scope: PageMusicScope) => {
    setSaving(scope)
    setMessage("")

    const response = await fetch(`/api/admin/page-music/${scope}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      setMessage(`Gagal reset ${scope}.`)
      setSaving("")
      return
    }

    const data = await response.json()
    setPageForms((prev) => ({
      ...prev,
      [scope]: createMusicFormState(data.settings?.music),
    }))
    setSaving("")
    setMessage(`${scope} direset.`)
  }

  const saveEntry = async () => {
    if (!selectedSlug || !entryForm) return
    setSaving("entry")
    setMessage("")

    const response = await fetch(`/api/admin/entry-settings/${selectedSlug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: entryForm.title,
        date: entryForm.date,
        location: entryForm.location.trim() ? entryForm.location.trim() : null,
        category: entryForm.category,
        cover: entryForm.cover,
        description: entryForm.description,
        music: createMusicPayload(entryForm.music),
        sectionMusic: null,
      }),
    })

    if (!response.ok) {
      setMessage("Gagal menyimpan entry.")
      setSaving("")
      return
    }

    const data = await response.json()
    setEntries((prev) => prev.map((entry) => (entry.slug === selectedSlug ? data.entry : entry)))
    setEntryForm(createFormState(data.entry))
    setSaving("")
    setMessage("Entry tersimpan.")
  }

  const resetEntry = async () => {
    if (!selectedSlug) return
    setSaving("entry")
    const response = await fetch(`/api/admin/entry-settings/${selectedSlug}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      setMessage("Gagal reset entry.")
      setSaving("")
      return
    }

    const data = await response.json()
    setEntries((prev) => prev.map((entry) => (entry.slug === selectedSlug ? data.entry : entry)))
    setEntryForm(createFormState(data.entry))
    setSaving("")
    setMessage("Override entry direset.")
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--j-bg)" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4"
        style={{ borderColor: "var(--j-border)", background: "var(--j-bg)" }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono-custom text-[10px] uppercase tracking-[0.32em]" style={{ color: "var(--j-text-3)" }}>
            Journal
          </span>
          <span style={{ color: "var(--j-border)" }}>/</span>
          <span className="font-mono-custom text-[10px] uppercase tracking-[0.32em]" style={{ color: "var(--j-text-1)" }}>
            Admin
          </span>
        </div>

        {/* Tab nav */}
        <nav className="flex items-center gap-1">
          {PAGE_TAB_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className="rounded-lg px-3 py-1.5 text-xs tracking-[0.18em] uppercase transition-colors"
              style={{
                background: activeTab === item.key ? "var(--j-text-1)" : "transparent",
                color: activeTab === item.key ? "var(--j-bg)" : "var(--j-text-3)",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {message ? (
          <span className="font-mono-custom text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--j-text-3)" }}>
            {message}
          </span>
        ) : (
          <span className="font-mono-custom text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--j-text-4)" }}>
            {entries.length} entries
          </span>
        )}
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-32 font-mono-custom text-xs uppercase tracking-[0.26em]" style={{ color: "var(--j-text-3)" }}>
          Loading…
        </div>
      ) : (
        <div className="mx-auto max-w-5xl px-6 py-8">
          {activeTab === "entries" ? (
            /* ── Entry Detail tab ── */
            <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
              {/* Entry list */}
              <aside className="space-y-1">
                <p className="mb-3 font-mono-custom text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--j-text-3)" }}>
                  Entries
                </p>
                {entries.map((entry) => (
                  <button
                    key={entry.slug}
                    type="button"
                    onClick={() => {
                      setSelectedSlug(entry.slug)
                      setEntryForm(createFormState(entry))
                    }}
                    className="w-full rounded-xl px-4 py-3 text-left transition-colors"
                    style={{
                      background: selectedSlug === entry.slug ? "var(--j-surface)" : "transparent",
                      border: `1px solid ${selectedSlug === entry.slug ? "var(--j-text-1)" : "transparent"}`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-light" style={{ fontFamily: "var(--font-apple)", color: "var(--j-text-1)" }}>
                        {entry.title}
                      </span>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 font-mono-custom text-[9px] uppercase tracking-[0.2em]"
                        style={{
                          background: entry.music ? "rgba(0,0,0,0.06)" : "transparent",
                          color: entry.music ? "var(--j-text-2)" : "var(--j-text-4)",
                        }}
                      >
                        {entry.music ? "♪" : "—"}
                      </span>
                    </div>
                    <span className="mt-0.5 text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--j-text-4)" }}>
                      {entry.category}
                    </span>
                  </button>
                ))}
              </aside>

              {/* Entry editor */}
              {!selectedEntry || !entryForm ? (
                <div className="flex items-center justify-center rounded-2xl border py-16" style={{ borderColor: "var(--j-border)" }}>
                  <p className="text-sm" style={{ color: "var(--j-text-3)" }}>Pilih entry.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Header bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono-custom text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--j-text-3)" }}>
                        Editing
                      </p>
                      <h2 className="mt-0.5 text-xl font-light" style={{ fontFamily: "var(--font-apple)", color: "var(--j-text-1)" }}>
                        {selectedEntry.title}
                      </h2>
                    </div>
                    <ActionButtons
                      onReset={resetEntry}
                      onSave={saveEntry}
                      saving={saving === "entry"}
                    />
                  </div>

                  {/* Metadata fields */}
                  <div className="rounded-2xl border p-5" style={{ borderColor: "var(--j-border)", background: "var(--j-surface)" }}>
                    <p className="mb-4 font-mono-custom text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--j-text-3)" }}>
                      Metadata
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title" value={entryForm.title} onChange={(value) => updateEntryField("title", value)} />
                      <Field label="Date" value={entryForm.date} onChange={(value) => updateEntryField("date", value)} />
                      <Field label="Location" value={entryForm.location} onChange={(value) => updateEntryField("location", value)} />
                      <Field label="Cover URL" value={entryForm.cover} onChange={(value) => updateEntryField("cover", value)} />
                      <div className="md:col-span-2">
                        <Label>Category</Label>
                        <select
                          value={entryForm.category}
                          onChange={(event) => updateEntryField("category", event.target.value)}
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
                          value={entryForm.description}
                          onChange={(event) => updateEntryField("description", event.target.value)}
                          rows={4}
                          className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none resize-none"
                          style={{ borderColor: "var(--j-border)", background: "var(--j-bg)", color: "var(--j-text-1)" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Music picker */}
                  <MusicPickerCard
                    form={entryForm.music}
                    onChange={updateEntryMusicField}
                    onPick={applyItunesTrackToEntry}
                  />
                </div>
              )}
            </div>
          ) : (
            /* ── Home / Friends tab ── */
            <PageMusicPanel
              scope={activeTab as PageMusicScope}
              title={activeTab === "home" ? "Home" : "Friends"}
              description={
                activeTab === "home"
                  ? "Background music yang autoplay saat halaman Home dibuka."
                  : "Background music yang autoplay saat halaman Friends dibuka."
              }
              form={pageForms[activeTab as PageMusicScope]}
              onChange={updatePageMusicField}
              onPick={applyItunesTrackToPage}
              onSave={savePageMusic}
              onReset={resetPageMusic}
              saving={saving === activeTab}
            />
          )}
        </div>
      )}
    </div>
  )
}

function ActionButtons({
  onReset,
  onSave,
  saving,
}: {
  onReset: () => void
  onSave: () => void
  saving: boolean
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onReset}
        className="rounded-lg border px-4 py-2 text-xs tracking-[0.2em] uppercase transition-colors hover:bg-black/[0.03]"
        style={{ borderColor: "var(--j-border)", color: "var(--j-text-2)" }}
      >
        Reset
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg px-4 py-2 text-xs tracking-[0.2em] uppercase transition-opacity disabled:opacity-50"
        style={{ background: "var(--j-text-1)", color: "var(--j-bg)" }}
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <span
        className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors"
        style={{ background: checked ? "var(--j-text-1)" : "var(--j-border)" }}
        onClick={() => onChange(!checked)}
      >
        <span
          className="pointer-events-none inline-block h-3.5 w-3.5 translate-x-0.5 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
        />
      </span>
      <span className="font-mono-custom text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--j-text-2)" }}>
        {label}
      </span>
    </label>
  )
}

function MusicPickerCard({
  form,
  onChange,
  onPick,
}: {
  form: MusicFormState
  onChange: (key: keyof MusicFormState, value: string | boolean) => void
  onPick: (track: ItunesTrack) => void
}) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: "var(--j-border)", background: "var(--j-surface)" }}>
      <div className="mb-5 flex items-center justify-between">
        <p className="font-mono-custom text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--j-text-3)" }}>
          Background Music
        </p>
        <Toggle checked={form.enabled} onChange={(val) => onChange("enabled", val)} label={form.enabled ? "On" : "Off"} />
      </div>

      {/* Selected track */}
      {form.track_name ? (
        <div
          className="mb-5 flex items-center gap-3 rounded-xl border px-4 py-3"
          style={{ borderColor: "var(--j-border)", background: "var(--j-bg)" }}
        >
          {form.album_art_url ? (
            <img src={form.album_art_url} alt={form.track_name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--j-border)" }}>
              <span className="text-lg">♪</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-light" style={{ fontFamily: "var(--font-apple)", color: "var(--j-text-1)" }}>
              {form.track_name}
            </p>
            <p className="truncate text-xs" style={{ color: "var(--j-text-3)" }}>
              {form.artist_name}
            </p>
          </div>
          <span className="font-mono-custom text-[9px] uppercase tracking-[0.22em]" style={{ color: "var(--j-text-4)" }}>
            Selected
          </span>
        </div>
      ) : null}

      <TrackSearchPicker
        label="Cari di iTunes"
        placeholder="Nama lagu atau artis…"
        onPick={onPick}
        initialQuery={form.track_name || form.artist_name}
      />
    </div>
  )
}

function PageMusicPanel({
  scope,
  title,
  description,
  form,
  onChange,
  onPick,
  onSave,
  onReset,
  saving,
}: {
  scope: PageMusicScope
  title: string
  description: string
  form: MusicFormState
  onChange: (scope: PageMusicScope, key: keyof MusicFormState, value: string | boolean) => void
  onPick: (scope: PageMusicScope, track: ItunesTrack) => void
  onSave: (scope: PageMusicScope) => Promise<void>
  onReset: (scope: PageMusicScope) => Promise<void>
  saving: boolean
}) {
  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-light" style={{ fontFamily: "var(--font-apple)", color: "var(--j-text-1)" }}>
            {title}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--j-text-3)" }}>
            {description}
          </p>
        </div>
        <ActionButtons
          onReset={() => onReset(scope)}
          onSave={() => onSave(scope)}
          saving={saving}
        />
      </div>

      <MusicPickerCard
        form={form}
        onChange={(key, value) => onChange(scope, key, value)}
        onPick={(track) => onPick(scope, track)}
      />
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
