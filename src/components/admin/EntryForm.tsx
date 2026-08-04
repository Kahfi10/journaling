"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Globe } from "lucide-react"
import { MediaUploader } from "./MediaUploader"
import { MusicPicker } from "./MusicPicker"
import { LocationPicker } from "./LocationPicker"
import type { EntryFull } from "@/types/entry"

interface MediaFormItem {
  id?: string
  url: string
  public_id: string
  type: "PHOTO" | "VIDEO"
  caption: string
  order: number
}

interface MusicFormItem {
  source: "UPLOAD" | "ITUNES"
  file_url?: string | null
  file_public_id?: string | null
  itunes_track_id?: string | null
  preview_url?: string | null
  track_name?: string | null
  artist_name?: string | null
  album_name?: string | null
  album_art_url?: string | null
  start_time: number
  duration: "FIFTEEN" | "THIRTY" | "SIXTY"
}

interface LocationFormItem {
  display_name: string
  place_id: string
  lat: number
  lng: number
}

interface EntryFormProps {
  entry?: EntryFull
}

export function EntryForm({ entry }: EntryFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Form fields
  const [title, setTitle] = useState(entry?.title ?? "")
  const [description, setDescription] = useState(entry?.description ?? "")
  const [dateTaken, setDateTaken] = useState(
    entry?.date_taken
      ? new Date(entry.date_taken).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  )
  const [published, setPublished] = useState(entry?.published ?? false)

  const [media, setMedia] = useState<MediaFormItem[]>(
    entry?.media.map((m) => ({
      id: m.id,
      url: m.url,
      public_id: m.public_id,
      type: m.type,
      caption: m.caption ?? "",
      order: m.order,
    })) ?? []
  )
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([])

  const [music, setMusic] = useState<MusicFormItem | null>(
    entry?.music
      ? {
          source: entry.music.source,
          file_url: entry.music.file_url,
          file_public_id: entry.music.file_public_id,
          itunes_track_id: entry.music.itunes_track_id,
          preview_url: entry.music.preview_url,
          track_name: entry.music.track_name,
          artist_name: entry.music.artist_name,
          album_name: entry.music.album_name,
          album_art_url: entry.music.album_art_url,
          start_time: entry.music.start_time,
          duration: entry.music.duration,
        }
      : null
  )

  const [location, setLocation] = useState<LocationFormItem | null>(
    entry?.location
      ? {
          display_name: entry.location.display_name,
          place_id: entry.location.place_id,
          lat: entry.location.lat,
          lng: entry.location.lng,
        }
      : null
  )

  const handleMediaDelete = useCallback((index: number) => {
    setMedia((prev) => {
      const item = prev[index]
      if (item.id) {
        setDeletedMediaIds((ids) => [...ids, item.id!])
      }
      return prev
        .filter((_, i) => i !== index)
        .map((m, i) => ({ ...m, order: i }))
    })
  }, [])

  const handleMediaReorder = useCallback((from: number, to: number) => {
    setMedia((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next.map((m, i) => ({ ...m, order: i }))
    })
  }, [])

  const handleMediaAdd = useCallback((items: Omit<MediaFormItem, "order">[]) => {
    setMedia((prev) => {
      const next = [...prev, ...items.map((item, i) => ({ ...item, order: prev.length + i }))]
      return next.slice(0, 5)
    })
  }, [])

  const handleCaptionChange = useCallback((index: number, caption: string) => {
    setMedia((prev) => prev.map((m, i) => (i === index ? { ...m, caption } : m)))
  }, [])

  async function handleSubmit(publishNow?: boolean) {
    if (!title.trim()) { setError("Judul wajib diisi"); return }
    if (media.length === 0) { setError("Minimal 1 foto atau video"); return }

    setError("")
    setSaving(true)

    const payload = {
      title: title.trim(),
      description: description || null,
      date_taken: new Date(dateTaken).toISOString(),
      published: publishNow !== undefined ? publishNow : published,
      media: media.map((m) => ({
        id: m.id,
        url: m.url,
        public_id: m.public_id,
        type: m.type,
        caption: m.caption || null,
        order: m.order,
      })),
      music: music || null,
      location: location || null,
      deletedMediaIds,
    }

    try {
      const url = entry ? `/api/entries/${entry.id}` : "/api/entries"
      const method = entry ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Terjadi kesalahan")
      }

      router.push("/admin")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      setSaving(false)
    }
  }

  return (
    <div className="max-w-[820px] space-y-6">

      {/* ── Informasi Dasar ── */}
      <section className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-8">
        <h2 className="text-[#888888] text-xs font-sans tracking-widest uppercase mb-6">
          Informasi Dasar
        </h2>

        <div className="space-y-5">
          {/* Judul */}
          <div>
            <label className="block text-[#888888] text-xs font-sans tracking-widest uppercase mb-2">
              Judul *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nama perjalanan atau momen..."
              maxLength={200}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#F0EDE8] text-sm px-4 py-3 focus:outline-none focus:border-[#C8A96E] transition-colors font-sans placeholder:text-[#333333]"
            />
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-[#888888] text-xs font-sans tracking-widest uppercase mb-2">
              Tanggal *
            </label>
            <input
              type="date"
              value={dateTaken}
              onChange={(e) => setDateTaken(e.target.value)}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#F0EDE8] text-sm px-4 py-3 focus:outline-none focus:border-[#C8A96E] transition-colors font-mono-custom [color-scheme:dark]"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-[#888888] text-xs font-sans tracking-widest uppercase mb-2">
              Cerita / Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Ceritakan momen ini..."
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#F0EDE8] text-sm px-4 py-3 focus:outline-none focus:border-[#C8A96E] transition-colors font-sans placeholder:text-[#333333] resize-none"
            />
          </div>
        </div>
      </section>

      {/* ── Media ── */}
      <section className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-8">
        <h2 className="text-[#888888] text-xs font-sans tracking-widest uppercase mb-6">
          Foto & Video <span className="text-[#555555] normal-case tracking-normal ml-1">(maks 5)</span>
        </h2>
        <MediaUploader
          items={media}
          onAdd={handleMediaAdd}
          onDelete={handleMediaDelete}
          onReorder={handleMediaReorder}
          onCaptionChange={handleCaptionChange}
        />
      </section>

      {/* ── Musik ── */}
      <section className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-8">
        <h2 className="text-[#888888] text-xs font-sans tracking-widest uppercase mb-6">
          Musik
        </h2>
        <MusicPicker value={music} onChange={setMusic} />
      </section>

      {/* ── Lokasi ── */}
      <section className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-8">
        <h2 className="text-[#888888] text-xs font-sans tracking-widest uppercase mb-6">
          Lokasi
        </h2>
        <LocationPicker value={location} onChange={setLocation} />
      </section>

      {/* ── Error ── */}
      {error && (
        <p className="text-[#FF4D4D] text-sm font-sans px-1">{error}</p>
      )}

      {/* ── Actions ── */}
      <div className="flex items-center gap-3 pb-10">
        <button
          onClick={() => handleSubmit(false)}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F0EDE8] font-sans font-medium text-sm px-6 py-3 rounded hover:border-[#3A3A3A] transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" />
          Simpan Draft
        </button>

        <button
          onClick={() => handleSubmit(true)}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#C8A96E] text-[#0A0A0A] font-sans font-semibold text-sm px-6 py-3 rounded hover:bg-[#D4B87A] transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <Globe className="w-4 h-4" />
          Publish
        </button>
      </div>
    </div>
  )
}
