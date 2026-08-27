import { NextResponse } from "next/server"
import { entries } from "@/data/entries"
import { getEntryBySlug } from "@/data/entries"
import {
  normalizeMusicPayload,
  normalizeSectionMusicPayload,
  removeEntrySettings,
  updateEntrySettings,
} from "@/lib/entry-settings"

export const runtime = "nodejs"

interface RouteContext {
  params: Promise<{ slug: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params
  const entry = getEntryBySlug(slug)
  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 })
  }

  return NextResponse.json({ entry })
}

export async function PATCH(request: Request, context: RouteContext) {
  const { slug } = await context.params
  const body = await request.json()
  const entry = entries.find((item) => item.slug === slug)

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 })
  }

  const music = body.music === null ? null : normalizeMusicPayload(body.music, slug)
  const sectionMusic = normalizeSectionMusicPayload(body.sectionMusic, slug)

  updateEntrySettings(slug, {
    title: typeof body.title === "string" ? body.title : undefined,
    date: typeof body.date === "string" ? body.date : undefined,
    location: body.location === null ? null : typeof body.location === "string" ? body.location : undefined,
    category:
      body.category === "friends" || body.category === "me" || body.category === "together"
        ? body.category
        : undefined,
    cover: typeof body.cover === "string" ? body.cover : undefined,
    description: typeof body.description === "string" ? body.description : undefined,
    music,
    sectionMusic,
  })

  const updated = getEntryBySlug(slug)
  return NextResponse.json({ entry: updated })
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { slug } = await context.params
  removeEntrySettings(slug)
  const updated = getEntryBySlug(slug)
  return NextResponse.json({ entry: updated })
}
