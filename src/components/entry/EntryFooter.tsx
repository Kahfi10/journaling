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
    <footer className="bg-[#0A0A0A] py-24 px-32 border-t border-[#2A2A2A]">
      <div className="max-w-2xl">
        {/* Location */}
        {location && (
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-4 h-4 text-[#C8A96E]" />
            <span className="text-[#C8A96E] text-sm font-medium tracking-wider">
              {location.display_name}
            </span>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 mb-12">
          <Calendar className="w-4 h-4 text-[#555555]" />
          <span className="font-mono-custom text-[#555555] text-sm tracking-wider">
            {formatDate(dateTaken)}
          </span>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-[#2A2A2A] mb-12" />

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#888888] hover:text-[#F0EDE8] transition-colors duration-200 text-sm font-sans tracking-wider group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Kembali ke semua cerita
        </Link>
      </div>
    </footer>
  )
}
