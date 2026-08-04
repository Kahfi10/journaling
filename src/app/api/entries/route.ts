// src/app/api/entries/route.ts
import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createEntrySchema } from "@/types/api"
import { generateUniqueSlug } from "@/lib/slugify"

// GET — public feed
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = parseInt(searchParams.get("limit") ?? "12")
    const skip = (page - 1) * limit

    const [entries, total] = await prisma.$transaction([
      prisma.entry.findMany({
        where: { published: true },
        orderBy: { date_taken: "desc" },
        take: limit,
        skip,
        select: {
          slug: true,
          title: true,
          date_taken: true,
          media: { where: { order: 0 }, select: { url: true, type: true }, take: 1 },
          location: { select: { display_name: true } },
        },
      }),
      prisma.entry.count({ where: { published: true } }),
    ])

    return Response.json({ entries, total, hasMore: page * limit < total })
  } catch (error) {
    console.error("[GET /api/entries]", error)
    return Response.json({ error: "Gagal memuat entries" }, { status: 500 })
  }
}

// POST — create (admin only)
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const result = createEntrySchema.safeParse(body)

    if (!result.success) {
      return Response.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 })
    }

    const data = result.data
    const slug = await generateUniqueSlug(data.title)

    const entry = await prisma.entry.create({
      data: {
        slug,
        title: data.title,
        description: data.description,
        date_taken: new Date(data.date_taken),
        published: data.published,
        media: {
          create: data.media.map((m) => ({
            url: m.url,
            public_id: m.public_id,
            type: m.type,
            caption: m.caption,
            order: m.order,
          })),
        },
        ...(data.music && {
          music: {
            create: {
              source: data.music.source,
              file_url: data.music.file_url,
              file_public_id: data.music.file_public_id,
              itunes_track_id: data.music.itunes_track_id,
              preview_url: data.music.preview_url,
              track_name: data.music.track_name,
              artist_name: data.music.artist_name,
              album_name: data.music.album_name,
              album_art_url: data.music.album_art_url,
              start_time: data.music.start_time,
              duration: data.music.duration,
            },
          },
        }),
        ...(data.location && {
          location: {
            create: {
              display_name: data.location.display_name,
              place_id: data.location.place_id,
              lat: data.location.lat,
              lng: data.location.lng,
            },
          },
        }),
      },
      include: { media: true, music: true, location: true },
    })

    return Response.json({ entry }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/entries]", error)
    return Response.json({ error: "Gagal membuat entry" }, { status: 500 })
  }
}
