"use client"

import { TrackSearchPicker, type ItunesTrack } from "./TrackSearchPicker"

export type SectionTrackForm = {
  sectionKey: string
  source: "UPLOAD" | "ITUNES"
  file_url: string
  preview_url: string
  track_name: string
  artist_name: string
  album_art_url: string
  start_time: string
  duration: "FIFTEEN" | "THIRTY" | "SIXTY"
}

interface SectionTracksEditorProps {
  value: SectionTrackForm[]
  onChange: (value: SectionTrackForm[]) => void
}

function emptyTrack(sectionKey = ""): SectionTrackForm {
  return {
    sectionKey,
    source: "ITUNES",
    file_url: "",
    preview_url: "",
    track_name: "",
    artist_name: "",
    album_art_url: "",
    start_time: "0",
    duration: "THIRTY",
  }
}

export function SectionTracksEditor({ value, onChange }: SectionTracksEditorProps) {
  const rows = value.length > 0 ? value : [emptyTrack("hero"), emptyTrack("story"), emptyTrack("memory-intro"), emptyTrack("gallery")]

  const updateRow = (index: number, patch: Partial<SectionTrackForm>) => {
    const next = [...rows]
    next[index] = { ...next[index], ...patch }
    onChange(next)
  }

  const addRow = () => {
    onChange([...rows, emptyTrack(`media-${rows.length}`)])
  }

  const removeRow = (index: number) => {
    onChange(rows.filter((_, current) => current !== index))
  }

  const applyTrack = (index: number, track: ItunesTrack) => {
    updateRow(index, {
      source: "ITUNES",
      file_url: "",
      preview_url: track.previewUrl,
      track_name: track.trackName,
      artist_name: track.artistName,
      album_art_url: track.artworkUrl,
      start_time: "0",
      duration: "THIRTY",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
            Section music
          </p>
          <p className="text-sm" style={{ color: "var(--j-text-3)" }}>
            Pilih 1 track iTunes untuk tiap section. Otomatis preview 30s.
          </p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="rounded-full border px-4 py-2 text-xs tracking-[0.22em] uppercase"
          style={{ borderColor: "var(--j-border)", color: "var(--j-text-2)" }}
        >
          Add Section
        </button>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={`${row.sectionKey}-${index}`} className="rounded-2xl border p-4" style={{ borderColor: "var(--j-border)" }}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <input
                  value={row.sectionKey}
                  onChange={(event) => updateRow(index, { sectionKey: event.target.value })}
                  className="w-full max-w-[220px] rounded-xl border px-4 py-3 text-sm outline-none"
                  placeholder="section key"
                  style={{ borderColor: "var(--j-border)", background: "var(--j-bg)", color: "var(--j-text-1)" }}
                />
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="text-[10px] tracking-[0.22em] uppercase"
                  style={{ color: "var(--j-text-3)" }}
                >
                  Remove
                </button>
              </div>

              <TrackSearchPicker
                label="Cari lagu iTunes"
                placeholder="Search song / artist"
                onPick={(track) => applyTrack(index, track)}
                initialQuery={row.track_name || row.artist_name}
              />

              {row.track_name ? (
                <div className="flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: "var(--j-border)", background: "rgba(0,0,0,0.02)" }}>
                  <img
                    src={row.album_art_url}
                    alt={row.track_name}
                    className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-light" style={{ color: "var(--j-text-1)", fontFamily: "var(--font-apple)" }}>
                      {row.track_name}
                    </p>
                    <p className="truncate text-xs" style={{ color: "var(--j-text-3)" }}>
                      {row.artist_name}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs" style={{ color: "var(--j-text-3)" }}>
                  Belum ada lagu dipilih.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
