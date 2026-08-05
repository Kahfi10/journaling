"use client"

import Image from "next/image"
import { X, GripVertical, Film } from "lucide-react"

interface MediaFormItem {
  id?: string
  url: string
  public_id: string
  type: "PHOTO" | "VIDEO"
  caption: string
  order: number
}
interface MediaItemProps {
  item: MediaFormItem
  index: number
  onDelete: () => void
  onCaptionChange: (caption: string) => void
}

export function MediaItem({ item, index, onDelete, onCaptionChange }: MediaItemProps) {
  return (
    <div className="group">
      <div className="relative aspect-square rounded-md overflow-hidden" style={{ background: "var(--j-bg-alt)", border: "1px solid var(--j-border)" }}>
        {item.type === "VIDEO" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <Film className="w-6 h-6" style={{ color: "var(--j-text-4)" }} />
            <span className="text-[9px] tracking-widest uppercase font-mono-custom" style={{ color: "var(--j-text-4)" }}>Video</span>
          </div>
        ) : (
          <Image src={item.url} alt={item.caption || `Media ${index + 1}`} fill className="object-cover" sizes="180px" />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.25)" }} />

        {/* Order */}
        <div className="absolute bottom-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <span className="text-white text-[9px] font-mono-custom">{index + 1}</span>
        </div>

        {/* Drag */}
        <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" style={{ background: "rgba(0,0,0,0.4)" }}>
          <GripVertical className="w-3 h-3 text-white" />
        </div>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <X className="w-3 h-3 text-white" />
        </button>
      </div>

      <input
        type="text"
        value={item.caption}
        onChange={e => onCaptionChange(e.target.value)}
        placeholder="Caption..."
        maxLength={500}
        className="w-full mt-1.5 input-base text-xs py-1.5"
      />
    </div>
  )
}
