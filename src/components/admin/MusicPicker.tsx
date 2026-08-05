"use client"

import { useState, useCallback } from "react"
import { Music, Upload, X, Search, Loader2 } from "lucide-react"
import { ItunesSearch } from "./ItunesSearch"
import type { ItunesTrack } from "@/types/itunes"

interface MusicValue {
  source: "UPLOAD" | "ITUNES"
  file_url?: string | null; file_public_id?: string | null
  itunes_track_id?: string | null; preview_url?: string | null
  track_name?: string | null; artist_name?: string | null
  album_name?: string | null; album_art_url?: string | null
  start_time: number; duration: "FIFTEEN" | "THIRTY" | "SIXTY"
}
interface MusicPickerProps { value: MusicValue | null; onChange: (val: MusicValue | null) => void }

export function MusicPicker({ value, onChange }: MusicPickerProps) {
  const [mode, setMode] = useState<"idle" | "itunes" | "upload">("idle")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const handleItunesSelect = useCallback((track: ItunesTrack) => {
    onChange({ source: "ITUNES", itunes_track_id: String(track.trackId), preview_url: track.previewUrl, track_name: track.trackName, artist_name: track.artistName, album_name: track.collectionName, album_art_url: track.artworkUrl100, start_time: 0, duration: "THIRTY" })
  }, [onChange])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true); setUploadError("")
    const formData = new FormData(); formData.append("file", file)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Upload gagal")
      onChange({ source: "UPLOAD", file_url: data.url, file_public_id: data.public_id, track_name: file.name.replace(/\.[^/.]+$/, ""), start_time: 0, duration: "THIRTY" })
    } catch (err) { setUploadError(err instanceof Error ? err.message : "Upload gagal") }
    finally { setUploading(false); e.target.value = "" }
  }

  const handleClear = () => { onChange(null); setMode("idle"); setUploadError("") }

  const btnStyle = { border: "1px solid var(--j-border)", color: "var(--j-text-2)", background: "var(--j-surface)" }

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: "var(--j-bg-alt)", border: "1px solid var(--j-border)" }}>
        {value.album_art_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value.album_art_url} alt={value.track_name ?? ""} className="w-10 h-10 rounded object-cover flex-shrink-0" style={{ border: "1px solid var(--j-border)" }} />
        ) : (
          <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ background: "var(--j-border)", }}>
            <Music className="w-4 h-4" style={{ color: "var(--j-text-3)" }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "var(--j-text-1)" }}>{value.track_name ?? "File Audio"}</p>
          <p className="text-xs truncate mt-0.5" style={{ color: "var(--j-text-3)" }}>
            {value.source === "ITUNES" ? `iTunes Preview · 30 detik` : `Upload`}
            {value.artist_name ? ` · ${value.artist_name}` : ""}
          </p>
          {value.source === "UPLOAD" && (
            <select value={value.duration} onChange={e => onChange({ ...value, duration: e.target.value as "FIFTEEN" | "THIRTY" | "SIXTY" })}
              className="mt-1.5 text-[10px] rounded px-2 py-1 input-base">
              <option value="FIFTEEN">15 detik</option>
              <option value="THIRTY">30 detik</option>
              <option value="SIXTY">60 detik</option>
            </select>
          )}
        </div>
        <button onClick={handleClear} className="w-7 h-7 flex items-center justify-center rounded flex-shrink-0 hover:opacity-50 transition-opacity" style={{ color: "var(--j-text-3)" }}>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  if (mode === "idle") {
    return (
      <div className="flex gap-2">
        <button onClick={() => setMode("itunes")} className="flex-1 flex items-center justify-center gap-2 rounded-lg py-3.5 text-sm transition-opacity hover:opacity-60" style={btnStyle}>
          <Search className="w-4 h-4" /> Cari di iTunes
        </button>
        <button onClick={() => setMode("upload")} className="flex-1 flex items-center justify-center gap-2 rounded-lg py-3.5 text-sm transition-opacity hover:opacity-60" style={btnStyle}>
          <Upload className="w-4 h-4" /> Upload File
        </button>
      </div>
    )
  }

  if (mode === "itunes") {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "var(--j-text-3)" }}>Cari Lagu</p>
          <button onClick={() => setMode("idle")} className="hover:opacity-50 transition-opacity" style={{ color: "var(--j-text-3)" }}><X className="w-4 h-4" /></button>
        </div>
        <ItunesSearch onSelect={handleItunesSelect} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "var(--j-text-3)" }}>Upload File Audio</p>
        <button onClick={() => setMode("idle")} className="hover:opacity-50 transition-opacity" style={{ color: "var(--j-text-3)" }}><X className="w-4 h-4" /></button>
      </div>
      <label className="flex flex-col items-center gap-2.5 rounded-lg p-7 cursor-pointer transition-all" style={{ border: "1.5px dashed var(--j-border-dark)" }}>
        <input type="file" accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/m4a" className="hidden" onChange={handleFileUpload} disabled={uploading} />
        {uploading ? (
          <><Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--j-text-3)" }} /><p className="text-sm" style={{ color: "var(--j-text-3)" }}>Mengupload...</p></>
        ) : (
          <><Upload className="w-5 h-5" style={{ color: "var(--j-text-4)" }} /><p className="text-sm" style={{ color: "var(--j-text-2)" }}>Klik untuk pilih file MP3 atau M4A</p><p className="text-xs" style={{ color: "var(--j-text-4)" }}>Maks 50MB</p></>
        )}
      </label>
      {uploadError && <p className="text-xs mt-2" style={{ color: "var(--destructive)" }}>{uploadError}</p>}
    </div>
  )
}
