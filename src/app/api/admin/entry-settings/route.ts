import { NextResponse } from "next/server"
import { entries, getEntryBySlug } from "@/data/entries"

export const runtime = "nodejs"

export async function GET() {
  const mergedEntries = entries
    .map((entry) => getEntryBySlug(entry.slug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))

  return NextResponse.json({
    entries: mergedEntries,
  })
}
