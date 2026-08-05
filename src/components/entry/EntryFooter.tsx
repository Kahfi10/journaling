import Link from "next/link"
import { MapPin, ArrowLeft, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Location } from "@/types/entry"

interface EntryFooterProps {
  dateTaken: Date
  location: Location | null
}

export function EntryFooter({ dateTaken, location }: EntryFooterProps) {
  return (
    <footer className="py-16 md:py-24 px-5 sm:px-12 md:px-24 lg:px-32" style={{ background: "var(--j-bg)", borderTop: "1px solid var(--j-border)" }}>
      <div className="max-w-2xl">
        {location && (
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-3.5 h-3.5" style={{ color: "var(--j-text-2)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--j-text-1)" }}>
              {location.display_name}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-10">
          <Calendar className="w-3.5 h-3.5" style={{ color: "var(--j-text-3)" }} />
          <span className="font-mono-custom text-xs tracking-wider" style={{ color: "var(--j-text-3)" }}>
            {formatDate(dateTaken)}
          </span>
        </div>

        <div className="w-8 h-px mb-10" style={{ background: "var(--j-border-dark)" }} />

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm transition-colors duration-200 group"
          style={{ color: "var(--j-text-2)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          Kembali ke semua cerita
        </Link>
      </div>
    </footer>
  )
}
