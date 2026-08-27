"use client"

import { useEffect, useMemo, useState } from "react"

export interface ItunesTrack {
  trackId: number
  trackName: string
  artistName: string
  collectionName: string
  previewUrl: string
  artworkUrl: string
  trackViewUrl: string
  kind: string
}

interface TrackSearchPickerProps {
  label?: string
  placeholder?: string
  onPick: (track: ItunesTrack) => void
  initialQuery?: string
}

export function TrackSearchPicker({
  label = "Search iTunes",
  placeholder = "Search song or artist",
  onPick,
  initialQuery = "",
}: TrackSearchPickerProps) {
  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState<ItunesTrack[]>([])

  const canSearch = query.trim().length > 1

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const search = async () => {
    if (!canSearch) {
      setResults([])
      setError("")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/itunes/search?term=${encodeURIComponent(query.trim())}`, {
        cache: "no-store",
      })
      if (!response.ok) throw new Error("search failed")
      const data = await response.json()
      setResults(Array.isArray(data.results) ? data.results : [])
    } catch {
      setError("Tidak bisa mengambil hasil iTunes.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setError("")
      return
    }

    const timeout = setTimeout(() => {
      search().catch(() => undefined)
    }, 450)

    return () => clearTimeout(timeout)
  }, [query])

  const hasResults = useMemo(() => results.length > 0, [results])

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: "var(--j-border)", background: "var(--j-bg)", color: "var(--j-text-1)" }}
        />
        <button
          type="button"
          onClick={() => search().catch(() => undefined)}
          className="rounded-xl border px-4 py-3 text-xs tracking-[0.22em] uppercase"
          style={{ borderColor: "var(--j-border)", color: "var(--j-text-2)" }}
        >
          {loading ? "..." : "Search"}
        </button>
      </div>

      <p className="text-[10px] tracking-[0.28em] uppercase font-mono-custom" style={{ color: "var(--j-text-4)" }}>
        {label}
      </p>

      {error ? <p className="text-xs" style={{ color: "var(--j-text-3)" }}>{error}</p> : null}

      {hasResults ? (
        <div className="mt-2 grid gap-1.5 max-h-64 overflow-y-auto rounded-xl pr-1" style={{ scrollbarWidth: "thin" }}>
          {results.map((track) => (
            <button
              key={track.trackId}
              type="button"
              onClick={() => onPick(track)}
              className="flex items-center gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-black/[0.03]"
              style={{ borderColor: "var(--j-border)" }}
            >
              <img
                src={track.artworkUrl}
                alt={track.trackName}
                className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-light" style={{ color: "var(--j-text-1)", fontFamily: "var(--font-apple)" }}>
                  {track.trackName}
                </p>
                <p className="truncate text-xs" style={{ color: "var(--j-text-3)" }}>
                  {track.artistName} · {track.collectionName}
                </p>
              </div>
              <span className="text-[10px] tracking-[0.24em] uppercase" style={{ color: "var(--j-text-4)" }}>
                Select
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
