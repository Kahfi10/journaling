// src/app/(admin)/admin/entries/[id]/edit/page.tsx
export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EntryForm } from "@/components/admin/EntryForm"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditEntryPage({ params }: PageProps) {
  const { id } = await params
  const entry = await prisma.entry.findUnique({
    where: { id },
    include: { media: { orderBy: { order: "asc" } }, music: true, location: true },
  })

  if (!entry) notFound()

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-[#F0EDE8] mb-10">
        Edit Entry
      </h1>
      <EntryForm entry={entry} />
    </div>
  )
}
