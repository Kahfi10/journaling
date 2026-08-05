"use client"

import { useState } from "react"
import { Search, Loader2, Music } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"
import type { ItunesTrack } from "@/types/itunes"

interface ItunesSearchProps { onSelect: (track: ItunesTrack) => void }

export function ItunesSearch({ onSelect }: ItunesSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ItunesTrack[]>([])
  const [loading, setLoading] = useState(false)

  const search = useDebouncedCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results ?? [])
    } catch { setResults([]) }
    finally { setLoading(false) }
  }, 400)

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--j-text-4)" }} />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); search(e.target.value) }}
          placeholder="Nama lagu atau artis..."
          className="input-base w-full pl-9"
          autoFocus
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin" style={{ color: "var(--j-text-4)" }} />}
      </div>

      {results.length > 0 && (
        <div className="rounded-lg overflow-hidden max-h-64 overflow-y-auto" style={{ border: "1px solid var(--j-border)" }}>
          {results.map(track => (
            <button
              key={track.trackId}
              onClick={() => onSelect(track)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors group"
              style={{ borderBottom: "1px solid var(--j-border)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--j-bg-alt)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {track.artworkUrl100 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={track.artworkUrl60 ?? track.artworkUrl100} alt="" className="w-9 h-9 rounded object-cover flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0" style={{ background: "var(--j-bg-alt)" }}>
                  <Music className="w-4 h-4" style={{ color: "var(--j-text-4)" }} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--j-text-1)" }}>{track.trackName}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: "var(--j-text-3)" }}>{track.artistName} · {track.collectionName}</p>
              </div>
              {track.previewUrl && <span className="text-[10px] font-mono-custom flex-shrink-0" style={{ color: "var(--j-text-4)" }}>30s</span>}
            </button>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <p className="text-sm text-center py-4" style={{ color: "var(--j-text-3)" }}>
          Tidak ditemukan untuk &ldquo;{query}&rdquo;
        </p>
      )}
    </div>
  )
}
