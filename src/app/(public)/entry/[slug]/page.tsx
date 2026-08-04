// src/app/(public)/entry/[slug]/page.tsx
export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EntryHero } from "@/components/entry/EntryHero"
import { MediaSection } from "@/components/entry/MediaSection"
import { EntryFooter } from "@/components/entry/EntryFooter"
import { MusicPlayer } from "@/components/entry/MusicPlayer"
import { ScrollProgress } from "@/components/entry/ScrollProgress"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getEntry(slug: string) {
  return prisma.entry.findUnique({
    where: { slug, published: true },
    include: {
      media: { orderBy: { order: "asc" } },
      music: true,
      location: true,
    },
  })
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const entry = await getEntry(slug)
  if (!entry) return {}
  return {
    title: `${entry.title} — Journal`,
    description: entry.description?.replace(/<[^>]*>/g, "").slice(0, 160) ?? "",
  }
}

export default async function EntryDetailPage({ params }: PageProps) {
  const { slug } = await params
  const entry = await getEntry(slug)

  if (!entry) notFound()

  return (
    <>
      <ScrollProgress />
      <main className="bg-[#0A0A0A]">
        {/* Hero Section */}
        <EntryHero
          title={entry.title}
          dateTaken={entry.date_taken}
          location={entry.location}
          coverUrl={entry.media[0]?.url}
        />

        {/* Media Sections */}
        {entry.media.map((media, index) => (
          <MediaSection
            key={media.id}
            media={media}
            index={index}
            music={entry.music}
          />
        ))}

        {/* Footer */}
        <EntryFooter
          dateTaken={entry.date_taken}
          location={entry.location}
        />
      </main>

      {/* Fixed Music Player */}
      {entry.music && <MusicPlayer music={entry.music} />}
    </>
  )
}
