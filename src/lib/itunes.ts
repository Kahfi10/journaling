export interface ItunesTrack {
  trackId: number
  trackName: string
  artistName: string
  collectionName: string
  artworkUrl100: string
  previewUrl: string | null
  trackTimeMillis: number
  primaryGenreName: string
}

export interface ItunesSearchResponse {
  resultCount: number
  results: ItunesTrack[]
}

export async function searchItunes(query: string, limit = 10): Promise<ItunesTrack[]> {
  if (!query.trim()) return []

  const url = new URL("https://itunes.apple.com/search")
  url.searchParams.set("term", query)
  url.searchParams.set("media", "music")
  url.searchParams.set("entity", "song")
  url.searchParams.set("limit", String(limit))
  url.searchParams.set("country", "US")

  const res = await fetch(url.toString(), { next: { revalidate: 300 } })
  if (!res.ok) return []

  const data: ItunesSearchResponse = await res.json()
  return data.results.filter((t) => t.previewUrl !== null)
}
