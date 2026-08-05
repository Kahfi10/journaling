// src/app/(pages)/friends/page.tsx
import { getEntriesByCategory } from "@/data/entries"
import { FriendsPage } from "@/components/pages/FriendsPage"

export default function Page() {
  const entries = getEntriesByCategory("friends")
  return <FriendsPage entries={entries} />
}
