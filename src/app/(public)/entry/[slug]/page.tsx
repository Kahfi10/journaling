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
import { unstable_noStore as noStore } from "next/cache"
import { createDefaultBackgroundMusic } from "@/lib/background-music"

export const dynamic = "force-dynamic"

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
  noStore()

  const { slug } = await params
  const entry = getEntryBySlug(slug)
  if (!entry) notFound()

  const music = entry.music ?? createDefaultBackgroundMusic(entry.slug)

  // Build location shape
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
          music={null}
        />

        <EntryStory 
          location={entry.location || null} 
          dateTaken={new Date(entry.date)} 
          category={entry.category} 
          description={entry.description || "A collection of fragments and memories from this particular day, captured exactly as they happened."} 
          music={null}
        />

        <EntryMemoryIntro
          title={entry.title}
          dateTaken={new Date(entry.date)}
          location={location}
          media={entry.media.map((media) => ({
            id: media.url,
            url: media.url,
            public_id: "",
            type: media.type as "PHOTO" | "VIDEO",
            caption: media.caption ?? null,
            order: 0,
            created_at: new Date(),
            entry_id: entry.slug,
          }))}
          music={null}
        />

        {entry.media.map((media, index) => {
          const mediaShape = {
            id: `${entry.slug}-${index}`,
            url: media.url,
            public_id: "",
            type: media.type as "PHOTO" | "VIDEO",
            caption: media.caption ?? null,
            order: index,
            created_at: new Date(),
            entry_id: entry.slug,
          }
          if (media.type === "VIDEO") {
            return <VideoSection key={index} media={mediaShape} index={index} music={null} />
          }
          return <PhotoSection key={index} media={mediaShape} index={index} music={null} />
        })}

        <EntryFooter dateTaken={new Date(entry.date)} location={location} />
      </main>

      <MusicPlayer music={music} autoplay loop />
    </>
  )
}
