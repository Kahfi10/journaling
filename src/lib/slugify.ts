export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

import { prisma } from "@/lib/prisma"

export async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || "entry"

  const existing = await prisma.entry.count({ where: { slug: base } })
  if (existing === 0) return base

  let suffix = 2
  while (true) {
    const candidate = `${base}-${suffix}`
    const count = await prisma.entry.count({ where: { slug: candidate } })
    if (count === 0) return candidate
    suffix++
  }
}
