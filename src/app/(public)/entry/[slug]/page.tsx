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

  const sectionMusicMap = Object.fromEntries(
    (entry.sectionMusic ?? []).map((slot) => [slot.sectionKey, slot.music])
  ) as Record<string, Music>

  // Build music shape for MusicPlayer
  const initialSectionMusic = sectionMusicMap.hero
    ?? sectionMusicMap.story
    ?? sectionMusicMap["memory-intro"]
    ?? sectionMusicMap.gallery
    ?? Object.values(sectionMusicMap)[0]
    ?? null

  const music = entry.music
    ? {
        id: entry.slug,
        source: entry.music.source as "ITUNES" | "UPLOAD",
        file_url: entry.music.fileUrl ?? null,
        file_public_id: null,
        itunes_track_id: null,
        preview_url: entry.music.previewUrl ?? null,
        track_name: entry.music.trackName ?? null,
        artist_name: entry.music.artistName ?? null,
        album_name: null,
        album_art_url: entry.music.albumArtUrl ?? null,
        start_time: entry.music.startTime ?? 0,
        duration: (entry.music.duration === 15
          ? "FIFTEEN"
          : entry.music.duration === 60
          ? "SIXTY"
          : "THIRTY") as "FIFTEEN" | "THIRTY" | "SIXTY",
        created_at: new Date(),
        entry_id: entry.slug,
      }
    : initialSectionMusic

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
          music={sectionMusicMap["memory-intro"] ?? null}
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
            return <VideoSection key={index} media={mediaShape} index={index} music={sectionMusicMap[`media-${index}`] ?? sectionMusicMap.gallery ?? null} />
          }
          return <PhotoSection key={index} media={mediaShape} index={index} music={sectionMusicMap[`media-${index}`] ?? sectionMusicMap.gallery ?? null} />
        })}

        <EntryFooter dateTaken={new Date(entry.date)} location={location} />
      </main>

      <MusicPlayer music={music} />
    </>
  )
}
