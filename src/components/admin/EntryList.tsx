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
    if (!confirm(`Hapus "${title}"?`)) return
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
      <div className="text-center py-20 rounded-lg" style={{ border: "1px solid var(--j-border)" }}>
        <p className="text-sm font-mono-custom tracking-wider" style={{ color: "var(--j-text-3)" }}>
          Belum ada entry
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {entries.map(entry => (
        <div
          key={entry.id}
          className="flex items-center gap-4 px-4 py-3.5 rounded-lg transition-colors"
          style={{
            background: "var(--j-surface)",
            border: "1px solid var(--j-border)",
          }}
        >
          {/* Thumbnail */}
          <div className="relative w-14 h-14 flex-shrink-0 rounded overflow-hidden" style={{ background: "var(--j-bg-alt)" }}>
            {entry.media[0]?.url && (
              <Image src={entry.media[0].url} alt={entry.title} fill className="object-cover" sizes="56px" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate" style={{ color: "var(--j-text-1)" }}>
              {entry.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono-custom text-[10px]" style={{ color: "var(--j-text-3)" }}>
                {formatDate(entry.date_taken)}
              </span>
              <span style={{ color: "var(--j-border-dark)" }}>·</span>
              <span className="text-[10px]" style={{ color: "var(--j-text-3)" }}>
                {entry._count.media} media
              </span>
            </div>
          </div>

          {/* Status */}
          <span className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase flex-shrink-0" style={{
            background: entry.published ? "rgba(0,0,0,0.06)" : "var(--j-bg-alt)",
            color: entry.published ? "var(--j-text-1)" : "var(--j-text-3)",
            border: `1px solid ${entry.published ? "var(--j-border-dark)" : "var(--j-border)"}`,
          }}>
            {entry.published ? "Live" : "Draft"}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={() => handleTogglePublish(entry.id, entry.published)}
              title={entry.published ? "Jadikan draft" : "Publish"}
              className="w-8 h-8 flex items-center justify-center rounded transition-opacity hover:opacity-50"
              style={{ color: "var(--j-text-3)" }}
            >
              {entry.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <Link
              href={`/admin/entries/${entry.id}/edit`}
              className="w-8 h-8 flex items-center justify-center rounded transition-opacity hover:opacity-50"
              style={{ color: "var(--j-text-2)" }}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => handleDelete(entry.id, entry.title)}
              disabled={deleting === entry.id}
              className="w-8 h-8 flex items-center justify-center rounded transition-opacity hover:opacity-50 disabled:opacity-30"
              style={{ color: "var(--j-text-3)" }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
