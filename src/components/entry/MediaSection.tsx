"use client"

import { useRef } from "react"
import type { Media, Music } from "@/types/entry"
import { PhotoSection } from "./PhotoSection"
import { VideoSection } from "./VideoSection"

interface MediaSectionProps {
  media: Media
  index: number
  music: Music | null
}

export function MediaSection({ media, index, music }: MediaSectionProps) {
  if (media.type === "VIDEO") {
    return <VideoSection media={media} index={index} music={music} />
  }
  return <PhotoSection media={media} index={index} />
}
