// src/app/(pages)/friends/page.tsx
import { getEntriesByCategory } from "@/data/entries"
import { FriendsPage } from "@/components/pages/FriendsPage"
import { unstable_noStore as noStore } from "next/cache"

export const dynamic = "force-dynamic"

export default function Page() {
  noStore()

  const entries = getEntriesByCategory("friends")
  return <FriendsPage entries={entries} />
}
