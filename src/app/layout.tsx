import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Journal",
  description: "Arsip perjalanan personal",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased journal-body">
        {children}
      </body>
    </html>
  )
}
