import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  const parsedUrl = new URL(url)
  if (parsedUrl.hostname !== "audio-ssl.itunes.apple.com") {
    return NextResponse.json({ error: "Unsupported host" }, { status: 400 })
  }

  const response = await fetch(parsedUrl.toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "audio/*",
    },
  })

  if (!response.ok || !response.body) {
    return NextResponse.json({ error: "Failed to fetch audio" }, { status: 502 })
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "audio/mp4",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
