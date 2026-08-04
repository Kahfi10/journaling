// src/app/(public)/page.tsx
export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { FeedGrid } from "@/components/feed/FeedGrid"

async function getEntries(page = 1) {
  const PAGE_SIZE = 12
  const [entries, total] = await prisma.$transaction([
    prisma.entry.findMany({
      where: { published: true },
      orderBy: { date_taken: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      select: {
        slug: true,
        title: true,
        date_taken: true,
        media: {
          where: { order: 0 },
          select: { url: true, type: true },
          take: 1,
        },
        location: {
          select: { display_name: true },
        },
      },
    }),
    prisma.entry.count({ where: { published: true } }),
  ])
  return { entries, total, hasMore: page * PAGE_SIZE < total }
}

export default async function FeedPage() {
  const { entries } = await getEntries(1)

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-6">
        <span className="font-display text-xl font-medium tracking-wider text-[#F0EDE8]">
          Journal
        </span>
      </header>

      {/* Feed Grid */}
      <div className="pt-24 pb-24 px-16">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-[#555555] text-sm font-mono-custom tracking-widest uppercase">
              Belum ada cerita
            </p>
          </div>
        ) : (
          <FeedGrid entries={entries} />
        )}
      </div>
    </main>
  )
}
