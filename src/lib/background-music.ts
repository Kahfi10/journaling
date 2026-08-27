import type { Music } from "@/types/entry"

const HOME_PREVIEW_URL =
  "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/93/22/22/93222271-8d55-d923-e0ff-b2964a5abefe/mzaf_3513742103157153222.plus.aac.p.m4a"
const HOME_ART_URL =
  "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/08/8c/24/088c2405-2e33-801b-5c38-e967f2c01e69/191404113974.png/100x100bb.jpg"

export function createDefaultBackgroundMusic(entryId: string): Music {
  return {
    id: `${entryId}-background`,
    source: "ITUNES",
    file_url: null,
    file_public_id: null,
    itunes_track_id: null,
    preview_url: HOME_PREVIEW_URL,
    track_name: "Hello",
    artist_name: "Adele",
    album_name: null,
    album_art_url: HOME_ART_URL,
    start_time: 0,
    duration: "THIRTY",
    created_at: new Date(),
    entry_id: entryId,
  }
}
