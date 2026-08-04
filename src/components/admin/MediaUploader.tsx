"use client"

import { useCallback, useRef, useState } from "react"
import { ImagePlus, Loader2 } from "lucide-react"
import { MediaItem } from "./MediaItem"
import { MAX_MEDIA_COUNT } from "@/lib/constants"

interface MediaFormItem {
  id?: string
  url: string
  public_id: string
  type: "PHOTO" | "VIDEO"
  caption: string
  order: number
}

interface MediaUploaderProps {
  items: MediaFormItem[]
  onAdd: (items: Omit<MediaFormItem, "order">[]) => void
  onDelete: (index: number) => void
  onReorder: (from: number, to: number) => void
  onCaptionChange: (index: number, caption: string) => void
}

export function MediaUploader({
  items,
  onAdd,
  onDelete,
  onReorder,
  onCaptionChange,
}: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const dragOverRef = useRef<number | null>(null)

  const canAdd = items.length < MAX_MEDIA_COUNT

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return
      const available = MAX_MEDIA_COUNT - items.length
      const toUpload = files.slice(0, available)

      setUploading(true)
      setUploadError("")

      const results: Omit<MediaFormItem, "order">[] = []

      for (const file of toUpload) {
        const formData = new FormData()
        formData.append("file", file)

        try {
          const res = await fetch("/api/upload", { method: "POST", body: formData })
          const data = await res.json()

          if (!res.ok) throw new Error(data.error ?? "Upload gagal")

          const isVideo = file.type.startsWith("video/")
          results.push({
            url: data.url,
            public_id: data.public_id,
            type: isVideo ? "VIDEO" : "PHOTO",
            caption: "",
          })
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : "Upload gagal")
        }
      }

      if (results.length > 0) onAdd(results)
      setUploading(false)
    },
    [items.length, onAdd]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
      e.target.value = ""
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    )
    handleFiles(files)
  }

  // Card drag-to-reorder
  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", String(index))
  }

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault()
    dragOverRef.current = index
  }

  const handleDropCard = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault()
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"))
    if (!isNaN(fromIndex) && fromIndex !== toIndex) {
      onReorder(fromIndex, toIndex)
    }
    dragOverRef.current = null
  }

  return (
    <div>
      {/* Upload Zone */}
      {canAdd && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#2A2A2A] rounded-lg p-8 text-center cursor-pointer hover:border-[#C8A96E]/40 hover:bg-[#C8A96E]/5 transition-colors mb-6 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/webp,video/mp4,video/quicktime"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-[#C8A96E] animate-spin" />
              <p className="text-[#888888] text-sm font-sans">Mengupload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <ImagePlus className="w-8 h-8 text-[#333333] group-hover:text-[#C8A96E]/60 transition-colors" />
              <div>
                <p className="text-[#888888] text-sm font-sans">
                  Klik atau drag & drop foto / video
                </p>
                <p className="text-[#444444] text-xs font-sans mt-1">
                  JPEG, PNG, HEIC, MP4, MOV · Maks {MAX_MEDIA_COUNT - items.length} lagi
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-[#FF4D4D] text-sm font-sans mb-4">{uploadError}</p>
      )}

      {/* Media Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={`${item.public_id}-${index}`}
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver(index)}
              onDrop={handleDropCard(index)}
            >
              <MediaItem
                item={item}
                index={index}
                onDelete={() => onDelete(index)}
                onCaptionChange={(caption) => onCaptionChange(index, caption)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
