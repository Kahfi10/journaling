"use client"

import { useState, useCallback } from "react"
import { MapPin, X } from "lucide-react"

interface LocationValue { display_name: string; place_id: string; lat: number; lng: number }
interface LocationPickerProps { value: LocationValue | null; onChange: (val: LocationValue | null) => void }

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [input, setInput] = useState(value?.display_name ?? "")

  const handleSet = useCallback(() => {
    if (!input.trim()) return
    onChange({ display_name: input.trim(), place_id: `manual-${Date.now()}`, lat: 0, lng: 0 })
  }, [input, onChange])

  const handleClear = () => { onChange(null); setInput("") }

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: "var(--j-bg-alt)", border: "1px solid var(--j-border)" }}>
        <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "var(--j-text-2)" }} />
        <span className="flex-1 text-sm" style={{ color: "var(--j-text-1)" }}>{value.display_name}</span>
        <button onClick={handleClear} className="w-6 h-6 flex items-center justify-center rounded flex-shrink-0 hover:opacity-50 transition-opacity" style={{ color: "var(--j-text-3)" }}>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--j-text-4)" }} />
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSet()}
          placeholder="Nama lokasi, kota, negara..."
          className="input-base w-full pl-9"
        />
      </div>
      <button
        onClick={handleSet}
        disabled={!input.trim()}
        className="px-4 py-2.5 rounded-md text-sm font-medium transition-opacity disabled:opacity-30"
        style={{ background: "var(--j-bg-alt)", border: "1px solid var(--j-border)", color: "var(--j-text-1)" }}
      >
        Set
      </button>
    </div>
  )
}
