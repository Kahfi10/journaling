// src/app/(public)/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Journal",
  description: "Arsip perjalanan personal",
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
