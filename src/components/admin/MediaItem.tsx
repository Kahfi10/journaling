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
      {/* Thumbnail */}
      <div className="relative aspect-square rounded-md overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A]">
        {item.type === "VIDEO" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Film className="w-8 h-8 text-[#444444]" />
            <span className="text-[#444444] text-[10px] font-sans tracking-wider uppercase">Video</span>
          </div>
        ) : (
          <Image
            src={item.url}
            alt={item.caption || `Media ${index + 1}`}
            fill
            className="object-cover"
            sizes="200px"
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

        {/* Order badge */}
        <div className="absolute bottom-2 left-2 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center">
          <span className="text-[#F0EDE8] text-[9px] font-mono-custom font-medium">
            {index + 1}
          </span>
        </div>

        {/* Drag handle */}
        <div className="absolute top-2 left-2 w-6 h-6 rounded flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
          <GripVertical className="w-3 h-3 text-[#888888]" />
        </div>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 w-6 h-6 rounded flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 hover:bg-[#FF4D4D]/80 transition-all"
          aria-label="Hapus media"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* Caption input */}
      <input
        type="text"
        value={item.caption}
        onChange={(e) => onCaptionChange(e.target.value)}
        placeholder="Caption..."
        maxLength={500}
        className="w-full mt-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#F0EDE8] text-xs px-3 py-2 focus:outline-none focus:border-[#C8A96E] transition-colors font-sans placeholder:text-[#333333]"
      />
    </div>
  )
}
