"use client"

import { useState, useCallback } from "react"
import { Music, Upload, X, Search, Loader2 } from "lucide-react"
import { ItunesSearch } from "./ItunesSearch"
import type { ItunesTrack } from "@/types/itunes"

interface MusicValue {
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

interface MusicPickerProps {
  value: MusicValue | null
  onChange: (val: MusicValue | null) => void
}

export function MusicPicker({ value, onChange }: MusicPickerProps) {
  const [mode, setMode] = useState<"idle" | "itunes" | "upload">(
    value ? (value.source === "ITUNES" ? "itunes" : "upload") : "idle"
  )
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const handleItunesSelect = useCallback(
    (track: ItunesTrack) => {
      onChange({
        source: "ITUNES",
        itunes_track_id: String(track.trackId),
        preview_url: track.previewUrl,
        track_name: track.trackName,
        artist_name: track.artistName,
        album_name: track.collectionName,
        album_art_url: track.artworkUrl100,
        start_time: 0,
        duration: "THIRTY",
      })
    },
    [onChange]
  )

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Upload gagal")

      onChange({
        source: "UPLOAD",
        file_url: data.url,
        file_public_id: data.public_id,
        track_name: file.name.replace(/\.[^/.]+$/, ""),
        start_time: 0,
        duration: "THIRTY",
      })
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload gagal")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleClear = () => {
    onChange(null)
    setMode("idle")
    setUploadError("")
  }

  // Show selected music
  if (value) {
    return (
      <div className="flex items-center gap-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
        {/* Album art */}
        {value.album_art_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.album_art_url}
            alt={value.track_name ?? ""}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-[#2A2A2A] flex items-center justify-center flex-shrink-0">
            <Music className="w-5 h-5 text-[#555555]" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[#F0EDE8] text-sm font-sans font-medium truncate">
            {value.track_name ?? "File Audio"}
          </p>
          <p className="text-[#555555] text-xs font-sans truncate mt-0.5">
            {value.artist_name ?? value.source === "UPLOAD" ? "Self upload" : ""}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[#C8A96E] text-[10px] font-sans tracking-widest uppercase">
              {value.source === "ITUNES" ? "iTunes Preview" : "Upload"}
            </span>
            {value.source === "UPLOAD" && (
              <select
                value={value.duration}
                onChange={(e) =>
                  onChange({ ...value, duration: e.target.value as "FIFTEEN" | "THIRTY" | "SIXTY" })
                }
                className="bg-[#2A2A2A] text-[#888888] text-[10px] font-sans px-2 py-1 rounded border border-[#333333] focus:outline-none"
              >
                <option value="FIFTEEN">15 detik</option>
                <option value="THIRTY">30 detik</option>
                <option value="SIXTY">60 detik</option>
              </select>
            )}
          </div>
        </div>

        {/* Remove */}
        <button
          onClick={handleClear}
          className="w-8 h-8 flex items-center justify-center rounded text-[#555555] hover:text-[#FF4D4D] hover:bg-white/5 transition-colors flex-shrink-0"
          aria-label="Hapus musik"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // Mode selection
  if (mode === "idle") {
    return (
      <div className="flex gap-3">
        <button
          onClick={() => setMode("itunes")}
          className="flex-1 flex items-center justify-center gap-2 border border-[#2A2A2A] rounded-lg py-4 text-[#888888] hover:text-[#F0EDE8] hover:border-[#3A3A3A] hover:bg-white/5 transition-colors text-sm font-sans"
        >
          <Search className="w-4 h-4" />
          Cari di iTunes
        </button>
        <button
          onClick={() => setMode("upload")}
          className="flex-1 flex items-center justify-center gap-2 border border-[#2A2A2A] rounded-lg py-4 text-[#888888] hover:text-[#F0EDE8] hover:border-[#3A3A3A] hover:bg-white/5 transition-colors text-sm font-sans"
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </div>
    )
  }

  // iTunes search mode
  if (mode === "itunes") {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[#888888] text-xs font-sans tracking-widest uppercase">
            Cari Lagu
          </p>
          <button
            onClick={() => setMode("idle")}
            className="text-[#555555] hover:text-[#F0EDE8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <ItunesSearch onSelect={handleItunesSelect} />
      </div>
    )
  }

  // Upload mode
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#888888] text-xs font-sans tracking-widest uppercase">
          Upload File Audio
        </p>
        <button
          onClick={() => setMode("idle")}
          className="text-[#555555] hover:text-[#F0EDE8] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <label className="flex flex-col items-center gap-3 border-2 border-dashed border-[#2A2A2A] rounded-lg p-8 cursor-pointer hover:border-[#C8A96E]/40 hover:bg-[#C8A96E]/5 transition-colors">
        <input
          type="file"
          accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/m4a"
          className="hidden"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        {uploading ? (
          <>
            <Loader2 className="w-6 h-6 text-[#C8A96E] animate-spin" />
            <p className="text-[#888888] text-sm font-sans">Mengupload...</p>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-[#444444]" />
            <p className="text-[#888888] text-sm font-sans">Klik untuk pilih file MP3 atau M4A</p>
            <p className="text-[#444444] text-xs font-sans">Maksimal 50MB</p>
          </>
        )}
      </label>

      {uploadError && (
        <p className="text-[#FF4D4D] text-sm font-sans mt-3">{uploadError}</p>
      )}
    </div>
  )
}
