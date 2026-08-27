import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const term = searchParams.get("term")?.trim()

  if (!term) {
    return NextResponse.json({ results: [] })
  }

  const url = new URL("https://itunes.apple.com/search")
  url.searchParams.set("term", term)
  url.searchParams.set("media", "music")
  url.searchParams.set("entity", "song")
  url.searchParams.set("limit", "12")

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    return NextResponse.json({ results: [] }, { status: 200 })
  }

  const data = await response.json()
  const results = Array.isArray(data.results)
    ? data.results.map((item: Record<string, unknown>) => ({
        trackId: Number(item.trackId ?? 0),
        trackName: String(item.trackName ?? ""),
        artistName: String(item.artistName ?? ""),
        collectionName: String(item.collectionName ?? ""),
        previewUrl: String(item.previewUrl ?? ""),
        artworkUrl: String(item.artworkUrl100 ?? item.artworkUrl60 ?? ""),
        trackViewUrl: String(item.trackViewUrl ?? ""),
        kind: String(item.kind ?? "song"),
      }))
    : []

  return NextResponse.json({ results })
}
