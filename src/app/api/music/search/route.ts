// src/app/api/music/search/route.ts
import { NextRequest } from "next/server"
import { searchItunes } from "@/lib/itunes"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") ?? ""

  if (!q.trim()) {
    return Response.json({ results: [] })
  }

  try {
    const results = await searchItunes(q, 10)
    return Response.json({ results })
  } catch (error) {
    console.error("[GET /api/music/search]", error)
    return Response.json({ results: [] })
  }
}
