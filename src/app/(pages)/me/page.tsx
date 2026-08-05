// src/app/(pages)/me/page.tsx
import Link from "next/link"

export default function MePage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--j-bg)" }}>
      <div className="text-center">
        <p className="text-xs tracking-widest uppercase font-mono-custom mb-4" style={{ color: "var(--j-text-3)" }}>
          Coming soon
        </p>
        <h1 className="font-light mb-6" style={{ fontSize: "3rem", letterSpacing: "-0.04em", color: "var(--j-text-1)" }}>
          Me.
        </h1>
        <Link href="/friends" className="text-sm" style={{ color: "var(--j-text-3)" }}>
          ← Back to Friends
        </Link>
      </div>
    </div>
  )
}
