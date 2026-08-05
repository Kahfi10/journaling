// src/app/(pages)/friends/page.tsx
export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { FriendsPage } from "@/components/pages/FriendsPage"

async function getEntries() {
  return prisma.entry.findMany({
    where: { published: true },
    orderBy: { date_taken: "desc" },
    select: {
      slug: true,
      title: true,
      date_taken: true,
      media: { where: { order: 0 }, select: { url: true, type: true }, take: 1 },
      location: { select: { display_name: true } },
    },
  })
}

export default async function Page() {
  const entries = await getEntries()
  return <FriendsPage entries={entries} />
}
