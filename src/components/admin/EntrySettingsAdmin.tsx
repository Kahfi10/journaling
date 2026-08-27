"use client"

import { useEffect, useMemo, useState } from "react"
import type { Entry } from "@/types/entry"
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
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12" style={{ background: "var(--j-bg)" }}>
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8">
          <p className="mb-2 font-mono-custom text-[10px] uppercase tracking-[0.34em]" style={{ color: "var(--j-text-3)" }}>
            Admin / Settings
          </p>
          <h1
            className="font-light"
            style={{ fontFamily: "var(--font-apple)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--j-text-1)" }}
          >
            Mengatur Home, Friends, dan Entry Detail
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: "var(--j-text-3)" }}>
            Setiap page punya background music sendiri. Entry detail tetap bisa diubah per item.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {PAGE_TAB_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className="rounded-full border px-4 py-2 text-left transition-colors"
              style={{
                borderColor: activeTab === item.key ? "var(--j-text-1)" : "var(--j-border)",
                background: activeTab === item.key ? "rgba(0,0,0,0.05)" : "transparent",
                color: "var(--j-text-1)",
              }}
            >
              <div className="text-xs tracking-[0.22em] uppercase">{item.label}</div>
              <div className="mt-1 text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--j-text-3)" }}>
                {item.description}
              </div>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-sm font-mono-custom uppercase tracking-[0.26em]" style={{ color: "var(--j-text-3)" }}>
            Loading...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="rounded-2xl border p-4" style={{ borderColor: "var(--j-border)", background: "var(--j-surface)" }}>
              <p className="mb-4 text-xs tracking-[0.3em] uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
                Page summary
              </p>
              <div className="space-y-3 text-sm" style={{ color: "var(--j-text-2)" }}>
                <SummaryItem label="Home music" value={pageForms.home.enabled ? pageForms.home.track_name || "Selected" : "Fallback default"} />
                <SummaryItem
                  label="Friends music"
                  value={pageForms.friends.enabled ? pageForms.friends.track_name || "Selected" : "Fallback default"}
                />
                <SummaryItem label="Entries" value={`${entries.length} detail page(s)`} />
              </div>
            </aside>

            <section className="rounded-2xl border p-5 sm:p-6 lg:p-8" style={{ borderColor: "var(--j-border)", background: "var(--j-surface)" }}>
              {activeTab === "entries" ? (
                <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                  <aside className="rounded-2xl border p-4" style={{ borderColor: "var(--j-border)", background: "var(--j-bg)" }}>
                    <p className="mb-4 text-xs tracking-[0.3em] uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
                      Entries
                    </p>
                    <div className="space-y-2">
                      {entries.map((entry) => (
                        <button
                          key={entry.slug}
                          onClick={() => {
                            setSelectedSlug(entry.slug)
                            setEntryForm(createFormState(entry))
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
                              <p className="mt-1 text-[10px] uppercase tracking-[0.26em]" style={{ color: "var(--j-text-3)" }}>
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

                  <section className="rounded-2xl border p-5" style={{ borderColor: "var(--j-border)", background: "var(--j-surface)" }}>
                    {!selectedEntry || !entryForm ? (
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
                              disabled={saving === "entry"}
                              className="rounded-full border px-4 py-2 text-xs tracking-[0.22em] uppercase"
                              style={{
                                borderColor: "var(--j-text-1)",
                                color: "var(--j-bg)",
                                background: "var(--j-text-1)",
                              }}
                            >
                              {saving === "entry" ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </div>

                        {message ? (
                          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--j-text-3)" }}>
                            {message}
                          </p>
                        ) : null}

                        <div className="grid gap-4 md:grid-cols-2">
                          <Field label="Title" value={entryForm.title} onChange={(value) => updateEntryField("title", value)} />
                          <Field label="Date" value={entryForm.date} onChange={(value) => updateEntryField("date", value)} />
                          <Field label="Location" value={entryForm.location} onChange={(value) => updateEntryField("location", value)} />
                          <Field label="Cover" value={entryForm.cover} onChange={(value) => updateEntryField("cover", value)} />
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
                              rows={5}
                              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none"
                              style={{ borderColor: "var(--j-border)", background: "var(--j-bg)", color: "var(--j-text-1)" }}
                            />
                          </div>
                        </div>

                        <MusicEditorCard
                          title="Background music"
                          description="Pilih satu lagu untuk detail entry ini."
                          form={entryForm.music}
                          onChange={updateEntryMusicField}
                          onPick={applyItunesTrackToEntry}
                          onSave={saveEntry}
                          onReset={resetEntry}
                          saving={saving === "entry"}
                          showActions={false}
                        />
                      </div>
                    )}
                  </section>
                </div>
              ) : (
                <MusicPageEditor
                  scope={activeTab as PageMusicScope}
                  title={activeTab === "home" ? "Home" : "Friends"}
                  description={
                    activeTab === "home"
                      ? "Background music untuk halaman utama."
                      : "Background music untuk halaman friends."
                  }
                  form={pageForms[activeTab as PageMusicScope]}
                  onChange={updatePageMusicField}
                  onPick={applyItunesTrackToPage}
                  onSave={savePageMusic}
                  onReset={resetPageMusic}
                  saving={saving === activeTab}
                />
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

function MusicPageEditor({
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
    <div className="max-w-3xl space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.28em] uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
            Editing
          </p>
          <h2 className="text-2xl font-light" style={{ fontFamily: "var(--font-apple)", color: "var(--j-text-1)" }}>
            {title}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--j-text-3)" }}>
            {description}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onReset(scope)}
            className="rounded-full border px-4 py-2 text-xs tracking-[0.22em] uppercase"
            style={{ borderColor: "var(--j-border)", color: "var(--j-text-2)" }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => onSave(scope)}
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

      <div className="rounded-2xl border p-4" style={{ borderColor: "var(--j-border)" }}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
              Background Music
            </p>
            <p className="text-sm" style={{ color: "var(--j-text-3)" }}>
              Pilih lagu iTunes, lalu simpan untuk page ini.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.22em]" style={{ color: "var(--j-text-2)" }}>
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(event) => onChange(scope, "enabled", event.target.checked)}
            />
            Enabled
          </label>
        </div>

        <TrackSearchPicker
          label={`Pilih lagu untuk ${title}`}
          placeholder="Cari judul lagu atau artis"
          onPick={(track) => onPick(scope, track)}
          initialQuery={form.track_name || form.artist_name}
        />

        {form.track_name ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: "var(--j-border)", background: "rgba(0,0,0,0.02)" }}>
            {form.album_art_url ? (
              <img src={form.album_art_url} alt={form.track_name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
            ) : null}
            <div className="min-w-0">
              <p className="truncate font-light" style={{ color: "var(--j-text-1)", fontFamily: "var(--font-apple)" }}>
                {form.track_name}
              </p>
              <p className="truncate text-xs" style={{ color: "var(--j-text-3)" }}>
                {form.artist_name}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-xs" style={{ color: "var(--j-text-3)" }}>
            Belum ada lagu dipilih.
          </p>
        )}
      </div>
    </div>
  )
}

function MusicEditorCard({
  title,
  description,
  form,
  onChange,
  onPick,
  onSave,
  onReset,
  saving,
  showActions = true,
}: {
  title: string
  description: string
  form: MusicFormState
  onChange: (key: keyof MusicFormState, value: string | boolean) => void
  onPick: (track: ItunesTrack) => void
  onSave: () => Promise<void>
  onReset: () => Promise<void>
  saving: boolean
  showActions?: boolean
}) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--j-border)" }}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
            {title}
          </p>
          <p className="text-sm" style={{ color: "var(--j-text-3)" }}>
            {description}
          </p>
        </div>
        {showActions ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onReset()}
              className="rounded-full border px-4 py-2 text-xs tracking-[0.22em] uppercase"
              style={{ borderColor: "var(--j-border)", color: "var(--j-text-2)" }}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => onSave()}
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
        ) : null}
      </div>

      <div className="rounded-2xl border p-4" style={{ borderColor: "var(--j-border)" }}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
              Background Music
            </p>
            <p className="text-sm" style={{ color: "var(--j-text-3)" }}>
              Pilih lagu iTunes, lalu simpan.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.22em]" style={{ color: "var(--j-text-2)" }}>
            <input type="checkbox" checked={form.enabled} onChange={(event) => onChange("enabled", event.target.checked)} />
            Enabled
          </label>
        </div>

        <TrackSearchPicker
          label={title}
          placeholder="Cari judul lagu atau artis"
          onPick={onPick}
          initialQuery={form.track_name || form.artist_name}
        />

        {form.track_name ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: "var(--j-border)", background: "rgba(0,0,0,0.02)" }}>
            {form.album_art_url ? (
              <img src={form.album_art_url} alt={form.track_name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
            ) : null}
            <div className="min-w-0">
              <p className="truncate font-light" style={{ color: "var(--j-text-1)", fontFamily: "var(--font-apple)" }}>
                {form.track_name}
              </p>
              <p className="truncate text-xs" style={{ color: "var(--j-text-3)" }}>
                {form.artist_name}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-xs" style={{ color: "var(--j-text-3)" }}>
            Belum ada lagu dipilih.
          </p>
        )}
      </div>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border px-4 py-3" style={{ borderColor: "var(--j-border)" }}>
      <div className="text-[10px] tracking-[0.22em] uppercase" style={{ color: "var(--j-text-4)" }}>
        {label}
      </div>
      <div className="mt-1 text-sm" style={{ color: "var(--j-text-1)" }}>
        {value}
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
