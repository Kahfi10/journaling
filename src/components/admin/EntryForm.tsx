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
interface EntryFormProps { entry?: EntryFull }

const inputClass = "input-base w-full"
const labelClass = "block text-xs font-medium tracking-widest uppercase mb-1.5"

export function EntryForm({ entry }: EntryFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [title, setTitle] = useState(entry?.title ?? "")
  const [description, setDescription] = useState(entry?.description ?? "")
  const [dateTaken, setDateTaken] = useState(
    entry?.date_taken ? new Date(entry.date_taken).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  )
  const [published, setPublished] = useState(entry?.published ?? false)
  const [media, setMedia] = useState<MediaFormItem[]>(
    entry?.media.map(m => ({ id: m.id, url: m.url, public_id: m.public_id, type: m.type, caption: m.caption ?? "", order: m.order })) ?? []
  )
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([])
  const [music, setMusic] = useState<MusicFormItem | null>(
    entry?.music ? {
      source: entry.music.source, file_url: entry.music.file_url, file_public_id: entry.music.file_public_id,
      itunes_track_id: entry.music.itunes_track_id, preview_url: entry.music.preview_url,
      track_name: entry.music.track_name, artist_name: entry.music.artist_name,
      album_name: entry.music.album_name, album_art_url: entry.music.album_art_url,
      start_time: entry.music.start_time, duration: entry.music.duration,
    } : null
  )
  const [location, setLocation] = useState<LocationFormItem | null>(
    entry?.location ? { display_name: entry.location.display_name, place_id: entry.location.place_id, lat: entry.location.lat, lng: entry.location.lng } : null
  )

  const handleMediaDelete = useCallback((index: number) => {
    setMedia(prev => {
      const item = prev[index]
      if (item.id) setDeletedMediaIds(ids => [...ids, item.id!])
      return prev.filter((_, i) => i !== index).map((m, i) => ({ ...m, order: i }))
    })
  }, [])

  const handleMediaReorder = useCallback((from: number, to: number) => {
    setMedia(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next.map((m, i) => ({ ...m, order: i }))
    })
  }, [])

  const handleMediaAdd = useCallback((items: Omit<MediaFormItem, "order">[]) => {
    setMedia(prev => [...prev, ...items.map((item, i) => ({ ...item, order: prev.length + i }))].slice(0, 5))
  }, [])

  const handleCaptionChange = useCallback((index: number, caption: string) => {
    setMedia(prev => prev.map((m, i) => (i === index ? { ...m, caption } : m)))
  }, [])

  async function handleSubmit(publishNow?: boolean) {
    if (!title.trim()) { setError("Judul wajib diisi"); return }
    if (media.length === 0) { setError("Minimal 1 foto atau video"); return }
    setError("")
    setSaving(true)
    const payload = {
      title: title.trim(), description: description || null,
      date_taken: new Date(dateTaken).toISOString(),
      published: publishNow !== undefined ? publishNow : published,
      media: media.map(m => ({ id: m.id, url: m.url, public_id: m.public_id, type: m.type, caption: m.caption || null, order: m.order })),
      music: music || null, location: location || null, deletedMediaIds,
    }
    try {
      const url = entry ? `/api/entries/${entry.id}` : "/api/entries"
      const method = entry ? "PUT" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Terjadi kesalahan") }
      router.push("/admin"); router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      setSaving(false)
    }
  }

  const sectionClass = "rounded-lg p-7 mb-5"
  const sectionStyle = { background: "var(--j-surface)", border: "1px solid var(--j-border)" }

  return (
    <div className="max-w-[800px] space-y-0">

      {/* Info Dasar */}
      <div className={sectionClass} style={sectionStyle}>
        <p className={labelClass} style={{ color: "var(--j-text-3)" }}>Informasi Dasar</p>
        <div className="space-y-4 mt-4">
          <div>
            <label className={labelClass} style={{ color: "var(--j-text-2)" }}>Judul *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nama perjalanan atau momen..." maxLength={200} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--j-text-2)" }}>Tanggal *</label>
            <input type="date" value={dateTaken} onChange={e => setDateTaken(e.target.value)} className="input-base [color-scheme:light]" />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--j-text-2)" }}>Cerita / Deskripsi</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Ceritakan momen ini..." className={`${inputClass} resize-none`} />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className={sectionClass} style={sectionStyle}>
        <p className={labelClass} style={{ color: "var(--j-text-3)" }}>
          Foto & Video <span className="normal-case tracking-normal font-normal" style={{ color: "var(--j-text-4)" }}>(maks 5)</span>
        </p>
        <div className="mt-4">
          <MediaUploader items={media} onAdd={handleMediaAdd} onDelete={handleMediaDelete} onReorder={handleMediaReorder} onCaptionChange={handleCaptionChange} />
        </div>
      </div>

      {/* Musik */}
      <div className={sectionClass} style={sectionStyle}>
        <p className={labelClass} style={{ color: "var(--j-text-3)" }}>Musik</p>
        <div className="mt-4">
          <MusicPicker value={music} onChange={setMusic} />
        </div>
      </div>

      {/* Lokasi */}
      <div className={sectionClass} style={sectionStyle}>
        <p className={labelClass} style={{ color: "var(--j-text-3)" }}>Lokasi</p>
        <div className="mt-4">
          <LocationPicker value={location} onChange={setLocation} />
        </div>
      </div>

      {error && <p className="text-xs px-1" style={{ color: "var(--destructive)" }}>{error}</p>}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 pb-10">
        <button
          onClick={() => handleSubmit(false)}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-opacity disabled:opacity-40"
          style={{ background: "var(--j-bg-alt)", border: "1px solid var(--j-border)", color: "var(--j-text-1)" }}
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <Save className="w-3.5 h-3.5" />
          Simpan Draft
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{ background: "var(--j-text-1)", color: "var(--j-white)" }}
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <Globe className="w-3.5 h-3.5" />
          Publish
        </button>
      </div>
    </div>
  )
}
