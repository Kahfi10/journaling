import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { EntryCard as EntryCardType } from "@/types/entry"

interface EntryCardProps {
  entry: EntryCardType
}

export function EntryCard({ entry }: EntryCardProps) {
  const cover = entry.media[0]

  return (
    <Link href={`/entry/${entry.slug}`} className="block group">
      <article className="entry-card relative overflow-hidden rounded-[6px] aspect-[3/2] bg-[#111111]">
        {/* Cover Image */}
        {cover ? (
          <Image
            src={cover.url}
            alt={entry.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1440px) 33vw, 480px"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1A1A1A]" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 overlay-card" />

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-200 group-hover:-translate-y-1">
          {/* Location */}
          {entry.location && (
            <div className="flex items-center gap-1.5 mb-3">
              <MapPin className="w-3 h-3 text-[#C8A96E]" />
              <span className="text-[#C8A96E] text-[11px] font-medium tracking-widest uppercase font-sans">
                {entry.location.display_name}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="font-display text-[#F0EDE8] text-2xl font-semibold leading-tight mb-2">
            {entry.title}
          </h2>

          {/* Date */}
          <p className="font-mono-custom text-[#888888] text-[11px] tracking-wider">
            {formatDate(entry.date_taken)}
          </p>
        </div>
      </article>
    </Link>
  )
}
