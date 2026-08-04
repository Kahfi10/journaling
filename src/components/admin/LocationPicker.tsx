"use client"

import { useState, useCallback } from "react"
import { MapPin, X } from "lucide-react"

interface LocationValue {
  display_name: string
  place_id: string
  lat: number
  lng: number
}

interface LocationPickerProps {
  value: LocationValue | null
  onChange: (val: LocationValue | null) => void
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [input, setInput] = useState(value?.display_name ?? "")

  // Simple text input for Phase 1
  // Phase 2: replace with Google Maps Autocomplete
  const handleSet = useCallback(() => {
    if (!input.trim()) return
    onChange({
      display_name: input.trim(),
      place_id: `manual-${Date.now()}`,
      lat: 0,
      lng: 0,
    })
  }, [input, onChange])

  const handleClear = () => {
    onChange(null)
    setInput("")
  }

  if (value) {
    return (
      <div className="flex items-center gap-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3">
        <MapPin className="w-4 h-4 text-[#C8A96E] flex-shrink-0" />
        <span className="flex-1 text-[#F0EDE8] text-sm font-sans truncate">
          {value.display_name}
        </span>
        <button
          onClick={handleClear}
          className="w-7 h-7 flex items-center justify-center rounded text-[#555555] hover:text-[#FF4D4D] hover:bg-white/5 transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSet()}
          placeholder="Nama lokasi, kota, negara..."
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#F0EDE8] text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#C8A96E] transition-colors font-sans placeholder:text-[#333333]"
        />
      </div>
      <button
        onClick={handleSet}
        disabled={!input.trim()}
        className="px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#888888] text-sm font-sans hover:text-[#F0EDE8] hover:border-[#3A3A3A] transition-colors disabled:opacity-40"
      >
        Set
      </button>
    </div>
  )
}
