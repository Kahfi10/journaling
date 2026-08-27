import Image from "next/image"
import Link from "next/link"
import { getEntriesByCategory } from "@/data/entries"

export const dynamic = "force-dynamic"

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export default function PreviewPage() {
  const entries = getEntriesByCategory("friends")

  return (
    <div style={{ background: "var(--j-bg)", fontFamily: "var(--font-apple)" }}>

      {/* ─── OPTION 1: Numbered List Magazine ─── */}
      <section className="px-8 lg:px-16 py-20" style={{ borderBottom: "2px solid var(--j-border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-3 text-xs tracking-[0.3em] uppercase font-mono-custom" style={{ color: "var(--j-text-4)" }}>
            Opsi 1
          </div>
          <h2 className="mb-3 font-light" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "-0.03em", color: "var(--j-text-1)" }}>
            Numbered List Magazine
          </h2>
          <p className="mb-10 text-sm" style={{ color: "var(--j-text-3)" }}>
            Nomor besar di kiri, thumbnail + info horizontal, separator line antar entry.
          </p>
          <div className="divide-y" style={{ borderColor: "var(--j-border)" }}>
            {entries.map((entry, i) => (
              <div key={entry.slug} className="py-8 flex items-start gap-8">
                <div className="shrink-0 w-10 font-mono-custom text-[2.2rem] leading-none font-light" style={{ color: "var(--j-border)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="relative w-48 shrink-0 overflow-hidden rounded-xl" style={{ aspectRatio: "4/3" }}>
                  <Image src={entry.cover} alt={entry.title} fill className="object-cover" sizes="200px" />
                </div>
                <div className="flex-1 flex items-start justify-between gap-4 pt-1">
                  <div>
                    <h3 className="text-lg font-light" style={{ letterSpacing: "-0.02em", color: "var(--j-text-1)" }}>
                      {entry.title}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: "var(--j-text-3)" }}>{entry.location}</p>
                    <p className="mt-3 text-[10px] tracking-[0.26em] uppercase font-mono-custom" style={{ color: "var(--j-text-4)" }}>
                      {entry.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono-custom" style={{ color: "var(--j-text-4)" }}>
                      {formatDate(entry.date)}
                    </span>
                    <span style={{ color: "var(--j-text-4)" }}>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OPTION 2: Hero + 2-Col Grid ─── */}
      <section className="px-8 lg:px-16 py-20" style={{ borderBottom: "2px solid var(--j-border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-3 text-xs tracking-[0.3em] uppercase font-mono-custom" style={{ color: "var(--j-text-4)" }}>
            Opsi 2 ← Recommended
          </div>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-light" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "-0.03em", color: "var(--j-text-1)" }}>
              Hero + 2-Col Grid
            </h2>
            <span className="text-xs font-mono-custom tracking-widest uppercase" style={{ color: "var(--j-text-3)" }}>
              {entries.length} moments
            </span>
          </div>
          <p className="mb-10 text-sm" style={{ color: "var(--j-text-3)" }}>
            Entry pertama sebagai hero full-width, sisanya grid 2 kolom. Caption overlay di atas foto.
          </p>

          {entries[0] && (
            <div className="block group mb-5">
              <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "21/9" }}>
                <Image src={entries[0].cover} alt={entries[0].title} fill className="object-cover" sizes="100vw" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
                <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="text-xs tracking-[0.26em] uppercase text-white/60 mb-1 font-mono-custom">01 / HERO</p>
                    <h3 className="text-2xl font-light text-white" style={{ letterSpacing: "-0.02em" }}>{entries[0].title}</h3>
                    <p className="text-sm text-white/60 mt-0.5">{entries[0].location}</p>
                  </div>
                  <span className="text-xs font-mono-custom text-white/40">{formatDate(entries[0].date)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            {entries.slice(1).map((entry, i) => (
              <div key={entry.slug} className="block group">
                <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: i % 2 === 0 ? "3/4" : "4/5" }}>
                  <Image src={entry.cover} alt={entry.title} fill className="object-cover" sizes="50vw" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] tracking-[0.26em] uppercase text-white/50 mb-1 font-mono-custom">
                      {String(i + 2).padStart(2, "0")}
                    </p>
                    <h3 className="text-base font-light text-white" style={{ letterSpacing: "-0.02em" }}>{entry.title}</h3>
                    <p className="text-xs text-white/50 mt-0.5">{entry.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OPTION 3: Horizontal Table ─── */}
      <section className="px-8 lg:px-16 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-3 text-xs tracking-[0.3em] uppercase font-mono-custom" style={{ color: "var(--j-text-4)" }}>
            Opsi 3
          </div>
          <h2 className="mb-3 font-light" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "-0.03em", color: "var(--j-text-1)" }}>
            Horizontal Table List
          </h2>
          <p className="mb-10 text-sm" style={{ color: "var(--j-text-3)" }}>
            Thumbnail kecil + info dalam baris horizontal. Compact, scannable, cocok banyak entries.
          </p>
          <div className="divide-y" style={{ borderColor: "var(--j-border)" }}>
            {entries.map((entry, i) => (
              <div key={entry.slug} className="flex items-center gap-5 py-5">
                <span className="w-7 shrink-0 text-[11px] font-mono-custom tracking-widest" style={{ color: "var(--j-text-4)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative w-16 h-12 shrink-0 overflow-hidden rounded-lg">
                  <Image src={entry.cover} alt={entry.title} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-light truncate" style={{ letterSpacing: "-0.01em", color: "var(--j-text-1)" }}>
                    {entry.title}
                  </h3>
                  <p className="text-xs truncate mt-0.5" style={{ color: "var(--j-text-3)" }}>{entry.location}</p>
                </div>
                <span className="shrink-0 text-xs font-mono-custom" style={{ color: "var(--j-text-4)" }}>
                  {formatDate(entry.date)}
                </span>
                <span className="shrink-0 text-sm" style={{ color: "var(--j-text-4)" }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
