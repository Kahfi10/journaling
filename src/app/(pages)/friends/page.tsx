// src/app/(pages)/friends/page.tsx
import { getEntriesByCategory } from "@/data/entries"
import { FriendsPage } from "@/components/pages/FriendsPage"
import { unstable_noStore as noStore } from "next/cache"
import { MusicPlayer } from "@/components/entry/MusicPlayer"
import { createDefaultBackgroundMusic } from "@/lib/background-music"
import { getConfiguredPageMusic } from "@/lib/page-settings"

export const dynamic = "force-dynamic"

export default function Page() {
  noStore()

  const entries = getEntriesByCategory("friends")
  const music = getConfiguredPageMusic("friends", createDefaultBackgroundMusic("friends"))

  return (
    <>
      <FriendsPage entries={entries} />
      <MusicPlayer music={music} autoplay loop />
    </>
  )
}
