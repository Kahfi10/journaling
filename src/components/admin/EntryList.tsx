"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { EntryListItem } from "@/types/entry"

interface EntryListProps {
  entries: EntryListItem[]
}

export function EntryList({ entries }: EntryListProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/entries/${id}`, { method: "DELETE" })
      router.refresh()
    } catch {
      alert("Gagal menghapus entry")
    } finally {
      setDeleting(null)
    }
  }

  async function handleTogglePublish(id: string, published: boolean) {
    try {
      await fetch(`/api/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      })
      router.refresh()
    } catch {
      alert("Gagal mengubah status")
    }
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 border border-[#2A2A2A] rounded-lg">
        <p className="text-[#555555] text-sm font-sans tracking-wider">
          Belum ada entry. Buat yang pertama!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center gap-5 bg-[#111111] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#3A3A3A] transition-colors"
        >
          {/* Thumbnail */}
          <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-[#1A1A1A]">
            {entry.media[0]?.url && (
              <Image
                src={entry.media[0].url}
                alt={entry.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-sans font-medium text-[#F0EDE8] text-sm truncate">
              {entry.title}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-mono-custom text-[#555555] text-[11px]">
                {formatDate(entry.date_taken)}
              </span>
              <span className="text-[#2A2A2A]">·</span>
              <span className="text-[#555555] text-[11px] font-sans">
                {entry._count.media} media
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-medium tracking-widest uppercase flex-shrink-0 ${
            entry.published
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-[#1A1A1A] text-[#555555] border border-[#2A2A2A]"
          }`}>
            {entry.published ? "Published" : "Draft"}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => handleTogglePublish(entry.id, entry.published)}
              title={entry.published ? "Jadikan draft" : "Publish"}
              className="w-8 h-8 flex items-center justify-center rounded text-[#555555] hover:text-[#F0EDE8] hover:bg-white/5 transition-colors"
            >
              {entry.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            <Link
              href={`/admin/entries/${entry.id}/edit`}
              className="w-8 h-8 flex items-center justify-center rounded text-[#555555] hover:text-[#C8A96E] hover:bg-white/5 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </Link>

            <button
              onClick={() => handleDelete(entry.id, entry.title)}
              disabled={deleting === entry.id}
              className="w-8 h-8 flex items-center justify-center rounded text-[#555555] hover:text-[#FF4D4D] hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
