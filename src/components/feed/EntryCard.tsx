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
      <article className="entry-card overflow-hidden rounded-lg" style={{ background: "var(--j-surface)" }}>
        {/* Cover Image */}
        <div className="relative aspect-[3/2] overflow-hidden" style={{ background: "var(--j-bg-alt)" }}>
          {cover ? (
            <Image
              src={cover.url}
              alt={entry.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 1440px) 33vw, 480px"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: "var(--j-bg-alt)" }} />
          )}
          {/* Gradient overlay tetap gelap agar teks terbaca di atas foto */}
          <div className="absolute inset-0 overlay-card" />

          {/* Info di atas foto */}
          <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-200 group-hover:-translate-y-0.5">
            {entry.location && (
              <div className="flex items-center gap-1.5 mb-2">
                <MapPin className="w-2.5 h-2.5" style={{ color: "rgba(255,255,255,0.7)" }} />
                <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {entry.location.display_name}
                </span>
              </div>
            )}
            <h2 className="text-white text-lg font-light leading-tight mb-1" style={{ letterSpacing: "-0.02em" }}>
              {entry.title}
            </h2>
            <p className="font-mono-custom text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              {formatDate(entry.date_taken)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  )
}
