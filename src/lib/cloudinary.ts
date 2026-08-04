// SERVER-ONLY — jangan import di client components
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

export const CLOUDINARY_FOLDER = "journaling"

export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/webp",
]
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"]
export const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/m4a"]

export const MAX_PHOTO_SIZE = 20 * 1024 * 1024
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024
export const MAX_AUDIO_SIZE = 50 * 1024 * 1024
