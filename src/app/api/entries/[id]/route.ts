// src/app/api/entries/[id]/route.ts
import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { cloudinary } from "@/lib/cloudinary"
import { updateEntrySchema } from "@/types/api"
import { generateUniqueSlug } from "@/lib/slugify"

type Params = { params: Promise<{ id: string }> }

// GET single entry
export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const entry = await prisma.entry.findUnique({
      where: { id },
      include: { media: { orderBy: { order: "asc" } }, music: true, location: true },
    })
    if (!entry) return Response.json({ error: "Not found" }, { status: 404 })
    return Response.json({ entry })
  } catch (error) {
    console.error("[GET /api/entries/:id]", error)
    return Response.json({ error: "Gagal memuat entry" }, { status: 500 })
  }
}

// PUT update (admin)
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const body = await req.json()
    const result = updateEntrySchema.safeParse(body)

    if (!result.success) {
      return Response.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 })
    }

    const data = result.data

    const entry = await prisma.$transaction(async (tx) => {
      // Update main entry
      const updated = await tx.entry.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title, slug: await generateUniqueSlug(data.title) }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.date_taken && { date_taken: new Date(data.date_taken) }),
          ...(data.published !== undefined && { published: data.published }),
        },
      })

      // Delete removed media
      if (data.deletedMediaIds && data.deletedMediaIds.length > 0) {
        const toDelete = await tx.media.findMany({
          where: { id: { in: data.deletedMediaIds } },
          select: { public_id: true },
        })
        await cloudinary.api.delete_resources(toDelete.map((m) => m.public_id))
        await tx.media.deleteMany({ where: { id: { in: data.deletedMediaIds } } })
      }

      // Upsert media
      if (data.media) {
        for (const m of data.media) {
          if (m.id) {
            await tx.media.update({
              where: { id: m.id },
              data: { caption: m.caption, order: m.order },
            })
          } else {
            await tx.media.create({
              data: {
                url: m.url,
                public_id: m.public_id,
                type: m.type,
                caption: m.caption,
                order: m.order,
                entry_id: id,
              },
            })
          }
        }
      }

      // Upsert music
      if (data.music) {
        await tx.music.upsert({
          where: { entry_id: id },
          create: { ...data.music, entry_id: id },
          update: { ...data.music },
        })
      }

      // Upsert location
      if (data.location) {
        await tx.location.upsert({
          where: { entry_id: id },
          create: { ...data.location, entry_id: id },
          update: { ...data.location },
        })
      }

      return updated
    })

    return Response.json({ entry })
  } catch (error) {
    console.error("[PUT /api/entries/:id]", error)
    return Response.json({ error: "Gagal update entry" }, { status: 500 })
  }
}

// DELETE (admin)
export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const entry = await prisma.entry.findUnique({
      where: { id },
      include: {
        media: { select: { public_id: true } },
        music: { select: { file_public_id: true } },
      },
    })

    if (!entry) return Response.json({ error: "Not found" }, { status: 404 })

    // Cleanup Cloudinary
    const publicIds = [
      ...entry.media.map((m) => m.public_id),
      ...(entry.music?.file_public_id ? [entry.music.file_public_id] : []),
    ].filter(Boolean)

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds).catch(console.error)
    }

    await prisma.entry.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/entries/:id]", error)
    return Response.json({ error: "Gagal hapus entry" }, { status: 500 })
  }
}
