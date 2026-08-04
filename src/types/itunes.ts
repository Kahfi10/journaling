// src/types/itunes.ts
export interface ItunesTrack {
  trackId: number
  trackName: string
  artistName: string
  collectionName: string
  artworkUrl100: string
  artworkUrl60: string
  previewUrl: string | null
  trackTimeMillis: number
  primaryGenreName: string
  releaseDate: string
}
