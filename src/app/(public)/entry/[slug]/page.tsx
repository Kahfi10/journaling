// src/app/(public)/entry/[slug]/page.tsx
import { notFound } from "next/navigation"
import { getEntryBySlug, getAllSlugs } from "@/data/entries"
import { EntryHero } from "@/components/entry/EntryHero"
import { EntryStory } from "@/components/entry/EntryStory"
import { EntryMemoryIntro } from "@/components/entry/EntryMemoryIntro"
import { PhotoSection } from "@/components/entry/PhotoSection"
import { VideoSection } from "@/components/entry/VideoSection"
import { EntryFooter } from "@/components/entry/EntryFooter"
import { MusicPlayer } from "@/components/entry/MusicPlayer"
import { ScrollProgress } from "@/components/entry/ScrollProgress"
import type { Music } from "@/types/entry"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const entry = getEntryBySlug(slug)
  if (!entry) return {}
  return {
    title: `${entry.title} — Journal`,
    description: entry.description ?? "",
  }
}

export default async function EntryDetailPage({ params }: PageProps) {
  const { slug } = await params
  const entry = getEntryBySlug(slug)
  if (!entry) notFound()

  // Music is already runtime type — no conversion needed
  const music = entry.music ?? null

  // Build location shape for hero/footer
  const location = entry.location
    ? {
        id: entry.slug,
        display_name: entry.location,
        place_id: "",
        lat: 0,
        lng: 0,
        created_at: new Date(),
        entry_id: entry.slug,
      }
    : null

  const sectionMusicMap = Object.fromEntries(
    (entry.sectionMusic ?? []).map((slot) => [slot.sectionKey, slot.music])
  ) as Record<string, Music>

  return (
    <>
      <ScrollProgress />
      <main style={{ background: "#0A0A0A" }}>
        <EntryHero
          title={entry.title}
          dateTaken={new Date(entry.date)}
          location={location}
          coverUrl={entry.cover}
          description={entry.description}
          music={sectionMusicMap.hero ?? null}
        />

        <EntryStory
          location={entry.location || null}
          dateTaken={new Date(entry.date)}
          category={entry.category}
          description={entry.description || "A collection of fragments and memories from this particular day, captured exactly as they happened."}
          music={sectionMusicMap.story ?? null}
        />

        <EntryMemoryIntro
          title={entry.title}
          dateTaken={new Date(entry.date)}
          location={location}
          media={entry.media}
          music={sectionMusicMap["memory-intro"] ?? null}
        />

        {entry.media.map((media, index) => {
          const sectionMusic = sectionMusicMap[`media-${index}`] ?? sectionMusicMap.gallery ?? null
          if (media.type === "VIDEO") {
            return <VideoSection key={index} media={media} index={index} music={sectionMusic} />
          }
          return <PhotoSection key={index} media={media} index={index} music={sectionMusic} />
        })}

        <EntryFooter dateTaken={new Date(entry.date)} location={location} />
      </main>

      <MusicPlayer music={music} />
    </>
  )
}
