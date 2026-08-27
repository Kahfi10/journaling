import { NextResponse } from "next/server"
import { normalizePageMusicPayload, getPageMusicSettings, removePageMusicSettings, updatePageMusicSettings } from "@/lib/page-settings"
import type { PageMusicScope } from "@/lib/page-settings"

export const runtime = "nodejs"

interface RouteContext {
  params: Promise<{ scope: string }>
}

function parseScope(scope: string): PageMusicScope | null {
  return scope === "home" || scope === "friends" ? scope : null
}

export async function GET(_request: Request, context: RouteContext) {
  const { scope } = await context.params
  const pageScope = parseScope(scope)
  if (!pageScope) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 })
  }

  return NextResponse.json({
    settings: getPageMusicSettings(pageScope),
  })
}

export async function PATCH(request: Request, context: RouteContext) {
  const { scope } = await context.params
  const pageScope = parseScope(scope)
  if (!pageScope) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 })
  }

  const body = await request.json()
  const music = body.music === null ? null : normalizePageMusicPayload(body.music, pageScope)

  updatePageMusicSettings(pageScope, { music })

  return NextResponse.json({
    settings: getPageMusicSettings(pageScope),
  })
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { scope } = await context.params
  const pageScope = parseScope(scope)
  if (!pageScope) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 })
  }

  removePageMusicSettings(pageScope)
  return NextResponse.json({
    settings: getPageMusicSettings(pageScope),
  })
}
