// src/app/(admin)/admin/page.tsx
export const dynamic = "force-dynamic"

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { EntryList } from "@/components/admin/EntryList"
import { Plus } from "lucide-react"

async function getAllEntries() {
  return prisma.entry.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      published: true,
      date_taken: true,
      created_at: true,
      media: { where: { order: 0 }, select: { url: true }, take: 1 },
      _count: { select: { media: true } },
    },
  })
}

export default async function AdminDashboard() {
  const entries = await getAllEntries()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#F0EDE8]">
            Semua Entry
          </h1>
          <p className="text-[#555555] text-sm font-sans mt-1">
            {entries.length} entry total
          </p>
        </div>
        <Link
          href="/admin/entries/new"
          className="inline-flex items-center gap-2 bg-[#C8A96E] text-[#0A0A0A] font-sans font-semibold text-sm px-5 py-2.5 rounded hover:bg-[#D4B87A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Buat Entry Baru
        </Link>
      </div>

      {/* Entry List */}
      <EntryList entries={entries} />
    </div>
  )
}
