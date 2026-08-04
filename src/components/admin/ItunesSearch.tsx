"use client"

import { useState, useRef, useCallback } from "react"
import { Search, Loader2, Music } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"
import type { ItunesTrack } from "@/types/itunes"

interface ItunesSearchProps {
  onSelect: (track: ItunesTrack) => void
}

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
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, 400)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    search(e.target.value)
  }

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Nama lagu atau artis..."
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#F0EDE8] text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#C8A96E] transition-colors font-sans placeholder:text-[#333333]"
          autoFocus
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555] animate-spin" />
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-1 max-h-72 overflow-y-auto rounded-lg border border-[#2A2A2A] bg-[#111111]">
          {results.map((track) => (
            <button
              key={track.trackId}
              onClick={() => onSelect(track)}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#1A1A1A] transition-colors text-left group"
            >
              {/* Art */}
              {track.artworkUrl100 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.artworkUrl60 ?? track.artworkUrl100}
                  alt={track.collectionName}
                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                  <Music className="w-4 h-4 text-[#555555]" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[#F0EDE8] text-sm font-sans truncate group-hover:text-[#C8A96E] transition-colors">
                  {track.trackName}
                </p>
                <p className="text-[#555555] text-xs font-sans truncate mt-0.5">
                  {track.artistName} · {track.collectionName}
                </p>
              </div>

              {/* Preview badge */}
              {track.previewUrl && (
                <span className="text-[#555555] text-[10px] font-sans tracking-wider flex-shrink-0">
                  30s
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <p className="text-[#555555] text-sm font-sans text-center py-4">
          Tidak ditemukan untuk &ldquo;{query}&rdquo;
        </p>
      )}
    </div>
  )
}
