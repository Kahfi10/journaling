// src/lib/constants.ts
// Safe to import anywhere (client + server)

export const MAX_MEDIA_COUNT = 5
export const MAX_PHOTO_SIZE_MB = 20
export const MAX_VIDEO_SIZE_MB = 500
export const MAX_AUDIO_SIZE_MB = 50

export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/webp",
]
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"]
export const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/m4a"]
