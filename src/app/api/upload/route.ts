// src/app/api/upload/route.ts
import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import {
  cloudinary,
  CLOUDINARY_FOLDER,
  ALLOWED_PHOTO_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_AUDIO_TYPES,
  MAX_PHOTO_SIZE,
  MAX_VIDEO_SIZE,
  MAX_AUDIO_SIZE,
} from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) return Response.json({ error: "File tidak ditemukan" }, { status: 400 })

    // Validate MIME type
    const allAllowed = [...ALLOWED_PHOTO_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_AUDIO_TYPES]
    if (!allAllowed.includes(file.type)) {
      return Response.json({ error: `Format file tidak didukung: ${file.type}` }, { status: 400 })
    }

    // Validate size
    const isPhoto = ALLOWED_PHOTO_TYPES.includes(file.type)
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
    const maxSize = isPhoto ? MAX_PHOTO_SIZE : isVideo ? MAX_VIDEO_SIZE : MAX_AUDIO_SIZE

    if (file.size > maxSize) {
      const maxMb = Math.round(maxSize / 1024 / 1024)
      return Response.json({ error: `File terlalu besar. Maksimal ${maxMb}MB` }, { status: 400 })
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const resourceType = isPhoto ? "image" : isVideo ? "video" : "raw"

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: CLOUDINARY_FOLDER,
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result as { secure_url: string; public_id: string })
          }
        )
        stream.end(buffer)
      }
    )

    return Response.json({ url: result.secure_url, public_id: result.public_id })
  } catch (error) {
    console.error("[POST /api/upload]", error)
    return Response.json({ error: "Upload gagal, coba lagi" }, { status: 500 })
  }
}
