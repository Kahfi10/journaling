"use client"

import { TrackSearchPicker, type ItunesTrack } from "./TrackSearchPicker"

export type SectionTrackForm = {
  sectionKey: string
  source: "ITUNES" | "UPLOAD"
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
    const next = rows.filter((_, current) => current !== index)
    onChange(next)
  }

  const applyTrack = (index: number, track: ItunesTrack) => {
    updateRow(index, {
      source: "ITUNES",
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
            Section music
          </p>
          <p className="text-sm" style={{ color: "var(--j-text-3)" }}>
            Isi track per section. Key yang dipakai: hero, story, memory-intro, media-0, media-1, dan seterusnya.
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

      <div className="space-y-4">
        {rows.map((row, index) => (
          <div key={`${row.sectionKey}-${index}`} className="rounded-2xl border p-4" style={{ borderColor: "var(--j-border)" }}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              <div className="grid gap-4 sm:grid-cols-2 lg:w-[320px]">
                <Field
                  label="Section key"
                  value={row.sectionKey}
                  onChange={(value) => updateRow(index, { sectionKey: value })}
                />
                <div>
                  <Label>Duration</Label>
                  <select
                    value={row.duration}
                    onChange={(event) => updateRow(index, { duration: event.target.value as SectionTrackForm["duration"] })}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none"
                    style={{ borderColor: "var(--j-border)", background: "var(--j-bg)", color: "var(--j-text-1)" }}
                  >
                    <option value="FIFTEEN">15s</option>
                    <option value="THIRTY">30s</option>
                    <option value="SIXTY">60s</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-light" style={{ color: "var(--j-text-1)", fontFamily: "var(--font-apple)" }}>
                    Track
                  </p>
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
                  label="Pilih lagu dari iTunes"
                  placeholder="Cari track"
                  onPick={(track) => applyTrack(index, track)}
                  initialQuery={row.track_name || row.artist_name}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Preview URL"
                    value={row.preview_url}
                    onChange={(value) => updateRow(index, { preview_url: value, source: "ITUNES" })}
                  />
                  <Field label="Track name" value={row.track_name} onChange={(value) => updateRow(index, { track_name: value })} />
                  <Field label="Artist name" value={row.artist_name} onChange={(value) => updateRow(index, { artist_name: value })} />
                  <Field label="Album art URL" value={row.album_art_url} onChange={(value) => updateRow(index, { album_art_url: value })} />
                  <Field label="Start time" value={row.start_time} onChange={(value) => updateRow(index, { start_time: value })} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[trackLabel(row)].filter(Boolean).map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] tracking-[0.22em] uppercase"
                      style={{ borderColor: "var(--j-border-dark)", color: "var(--j-text-3)" }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function trackLabel(row: SectionTrackForm) {
  return row.track_name ? `${row.sectionKey} · ${row.track_name}` : row.sectionKey
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
