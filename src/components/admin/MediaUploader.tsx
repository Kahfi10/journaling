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

export function MediaUploader({ items, onAdd, onDelete, onReorder, onCaptionChange }: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const canAdd = items.length < MAX_MEDIA_COUNT

  const handleFiles = useCallback(async (files: File[]) => {
    if (!files.length) return
    const toUpload = files.slice(0, MAX_MEDIA_COUNT - items.length)
    setUploading(true); setUploadError("")
    const results: Omit<MediaFormItem, "order">[] = []
    for (const file of toUpload) {
      const formData = new FormData()
      formData.append("file", file)
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? "Upload gagal")
        results.push({ url: data.url, public_id: data.public_id, type: file.type.startsWith("video/") ? "VIDEO" : "PHOTO", caption: "" })
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload gagal")
      }
    }
    if (results.length) onAdd(results)
    setUploading(false)
  }, [items.length, onAdd])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) { handleFiles(Array.from(e.target.files)); e.target.value = "" }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"))
    handleFiles(files)
  }

  const handleDragStart = (index: number) => (e: React.DragEvent) => e.dataTransfer.setData("text/plain", String(index))
  const handleDropCard = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault()
    const from = parseInt(e.dataTransfer.getData("text/plain"))
    if (!isNaN(from) && from !== toIndex) onReorder(from, toIndex)
  }

  return (
    <div>
      {canAdd && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg p-8 text-center cursor-pointer transition-all mb-5 group"
          style={{ border: "1.5px dashed var(--j-border-dark)" }}
        >
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/heic,image/webp,video/mp4,video/quicktime" multiple className="hidden" onChange={handleFileInput} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--j-text-3)" }} />
              <p className="text-sm" style={{ color: "var(--j-text-3)" }}>Mengupload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImagePlus className="w-6 h-6" style={{ color: "var(--j-text-4)" }} />
              <p className="text-sm" style={{ color: "var(--j-text-2)" }}>
                Klik atau drag & drop foto / video
              </p>
              <p className="text-xs" style={{ color: "var(--j-text-4)" }}>
                JPEG · PNG · HEIC · MP4 · MOV &nbsp;·&nbsp; Maks {MAX_MEDIA_COUNT - items.length} lagi
              </p>
            </div>
          )}
        </div>
      )}
      {uploadError && <p className="text-xs mb-3" style={{ color: "var(--destructive)" }}>{uploadError}</p>}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {items.map((item, index) => (
            <div key={`${item.public_id}-${index}`} draggable onDragStart={handleDragStart(index)} onDragOver={e => e.preventDefault()} onDrop={handleDropCard(index)}>
              <MediaItem item={item} index={index} onDelete={() => onDelete(index)} onCaptionChange={caption => onCaptionChange(index, caption)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
