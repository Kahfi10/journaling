# Coding Rules & Standards
## Personal Travel Journal

---

## 1. Prinsip Utama

1. **Clarity over cleverness** — kode yang mudah dibaca lebih baik dari kode yang pintar tapi sulit dimengerti
2. **Server first** — default ke Server Component, client hanya kalau benar-benar perlu
3. **Type everything** — tidak ada `any`, semua punya tipe yang jelas
4. **Fail loudly** — error harus terlihat jelas, jangan diam-diam gagal
5. **Consistent over perfect** — ikuti pola yang sudah ada, bukan temukan pola baru setiap kali

---

## 2. TypeScript

### 2.1 Aturan Dasar

```typescript
// ❌ DILARANG
const data: any = response.data
function process(input: any): any { ... }

// ✅ BENAR
const data: Entry = response.data
function process(input: CreateEntryPayload): Promise<Entry> { ... }
```

### 2.2 Interface vs Type

```typescript
// Gunakan interface untuk object shapes (props, model)
interface EntryCardProps {
  slug: string
  title: string
  coverUrl: string
  location?: string
  date: Date
}

// Gunakan type untuk union, intersection, utility types
type MediaType = "PHOTO" | "VIDEO"
type MusicSource = "UPLOAD" | "ITUNES"
type MusicDuration = 15 | 30 | 60

// Gunakan satisfies untuk object literal validation
const config = {
  maxMedia: 5,
  maxPhotoSize: 20 * 1024 * 1024,
  maxVideoSize: 500 * 1024 * 1024,
} satisfies Record<string, number>
```

### 2.3 Enum → String Union

```typescript
// ❌ Jangan pakai TypeScript enum
enum Status { DRAFT = "DRAFT", PUBLISHED = "PUBLISHED" }

// ✅ Gunakan string union atau const object
type Status = "DRAFT" | "PUBLISHED"

const STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
} as const
type Status = typeof STATUS[keyof typeof STATUS]
```

### 2.4 Null vs Undefined

```typescript
// Prisma return null untuk optional fields
// React props menggunakan optional (undefined)
// Konsisten: gunakan optional chaining dan nullish coalescing

const name = entry.location?.display_name ?? "Lokasi tidak diketahui"
const caption = media.caption ?? ""
```

### 2.5 Non-null Assertion

```typescript
// ❌ Hindari non-null assertion kecuali yakin 100%
const el = document.getElementById("app")!

// ✅ Guard dengan check
const el = document.getElementById("app")
if (!el) throw new Error("Element #app tidak ditemukan")
```

---

## 3. React & Next.js

### 3.1 Server Component vs Client Component

**Default: Server Component** (tidak perlu `"use client"`)

Tambahkan `"use client"` HANYA jika komponen membutuhkan:
- GSAP, Lenis, atau library animasi browser
- Howler.js, WaveSurfer.js, atau Web Audio API
- `useState`, `useEffect`, `useRef`, `useCallback`
- Event handler langsung: `onClick`, `onChange`, `onSubmit`
- Browser APIs: `window`, `document`, `navigator`
- `useRouter`, `usePathname`, `useSearchParams`

```typescript
// ✅ Server Component — tidak perlu "use client"
// src/app/(public)/page.tsx
async function FeedPage() {
  const entries = await getPublishedEntries({ page: 1 })
  return <FeedGrid entries={entries} />
}

// ✅ Client Component — butuh GSAP
// src/components/feed/FeedGrid.tsx
"use client"
import { useGSAP } from "@gsap/react"

export function FeedGrid({ entries }: FeedGridProps) {
  useGSAP(() => {
    // animasi
  })
  return <div>...</div>
}
```

### 3.2 Data Fetching

```typescript
// ✅ Fetch di Server Component langsung (bukan lewat API route)
async function EntryDetailPage({ params }: { params: { slug: string } }) {
  const entry = await prisma.entry.findUnique({
    where: { slug: params.slug, published: true },
    include: { media: { orderBy: { order: "asc" } }, music: true, location: true }
  })
  if (!entry) notFound()
  return <EntryDetail entry={entry} />
}

// ✅ API Routes hanya untuk: mutasi dari client, upload, external API proxy
// ❌ Jangan fetch ke /api/entries dari Server Component — langsung ke DB
```

### 3.3 Image

```typescript
// ✅ Selalu gunakan next/image
import Image from "next/image"

// Untuk gambar dengan ukuran diketahui
<Image
  src={media.url}
  width={1920}
  height={1280}
  alt={media.caption ?? ""}
  className="object-cover w-full h-full"
/>

// Untuk gambar fill container
<div className="relative w-full aspect-[3/2]">
  <Image
    src={coverUrl}
    fill
    alt={title}
    className="object-cover"
    sizes="(max-width: 1280px) 33vw, 400px"
  />
</div>

// Priority HANYA untuk above-the-fold
<Image src={heroUrl} fill priority alt="" />
```

### 3.4 Loading & Error States

```typescript
// Setiap page yang async harus punya loading.tsx dan error.tsx
// src/app/(public)/entry/[slug]/loading.tsx
export default function Loading() {
  return <EntryDetailSkeleton />
}

// src/app/(public)/entry/[slug]/error.tsx
"use client"
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Terjadi kesalahan</p>
      <button onClick={reset}>Coba lagi</button>
    </div>
  )
}
```

---

## 4. GSAP

### 4.1 Setup & Registration

```typescript
// Selalu register plugin di level module, BUKAN di dalam komponen
// src/lib/gsap.ts — import file ini di komponen yang perlu GSAP

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { SplitText } from "gsap/SplitText"
import { Flip } from "gsap/Flip"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Flip)

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, Flip }
```

### 4.2 Cleanup dengan useGSAP

```typescript
"use client"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

export function AnimatedComponent() {
  const containerRef = useRef<HTMLDivElement>(null)

  // ✅ useGSAP menangani cleanup otomatis saat unmount
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from(".card", {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      })
    }, containerRef)

    return () => ctx.revert() // cleanup eksplisit jika perlu
  }, { scope: containerRef, dependencies: [] })

  return <div ref={containerRef}>...</div>
}
```

### 4.3 Properti yang Boleh dan Tidak Boleh Dianimasikan

```typescript
// ✅ Gunakan transform properties — tidak trigger reflow
gsap.to(el, { x: 100, y: -50, scale: 1.05, rotation: 5 })

// ❌ Jangan animasikan layout properties — trigger reflow, lambat
gsap.to(el, { left: 100, top: -50, width: 300 })

// ✅ Opacity selalu aman
gsap.to(el, { opacity: 0 })

// ✅ Clip-path untuk reveal animation — GPU accelerated
gsap.from(el, { clipPath: "inset(0 100% 0 0)", ease: "power2.inOut" })
```

### 4.4 ScrollTrigger Best Practices

```typescript
// ✅ Selalu set start/end secara eksplisit
ScrollTrigger.create({
  trigger: element,
  start: "top 80%",   // trigger top mencapai 80% dari viewport
  end: "bottom 20%",
  toggleActions: "play none none reverse",
})

// ✅ Gunakan scrub: true untuk parallax (smooth)
// Gunakan scrub: 1.5 untuk lag yang lebih sinematik
ScrollTrigger.create({
  trigger: section,
  start: "top bottom",
  end: "bottom top",
  scrub: 1.5,
})

// ✅ Refresh setelah layout berubah
ScrollTrigger.refresh()

// ✅ Kill semua saat komponen unmount
return () => {
  ScrollTrigger.getAll().forEach(t => t.kill())
}
```

---

## 5. File & Folder Naming

### 5.1 Konvensi

| Jenis File | Konvensi | Contoh |
|---|---|---|
| React Component | PascalCase | `EntryCard.tsx` |
| Page (Next.js) | lowercase | `page.tsx`, `layout.tsx` |
| Custom Hook | camelCase + prefix `use` | `useMusicPlayer.ts` |
| Utility function | camelCase | `formatDate.ts`, `slugify.ts` |
| Type definition | camelCase | `entry.ts`, `api.ts` |
| Config file | camelCase | `auth.ts`, `prisma.ts` |
| Constant | SCREAMING_SNAKE dalam file, camelCase file | `MAX_MEDIA_COUNT` |
| CSS variable | kebab-case | `--color-accent` |
| Tailwind class | kebab-case (Tailwind convention) | `bg-surface text-primary` |

### 5.2 Struktur Komponen Kompleks

Komponen yang memiliki sub-komponen atau types banyak → buat folder:

```
components/entry/
  ├── MusicPlayer/
  │   ├── index.tsx             ← export: export { MusicPlayer } from "./MusicPlayer"
  │   ├── MusicPlayer.tsx       ← implementasi
  │   └── MusicPlayer.types.ts  ← interface MusicPlayerProps, MusicState, dll
  └── EntryHero.tsx             ← komponen sederhana, satu file saja
```

Komponen sederhana (< 100 baris, tidak ada sub-komponen): **satu file saja**.

---

## 6. Validation dengan Zod

### 6.1 Schema Definition

```typescript
// src/types/api.ts
import { z } from "zod"

export const createEntrySchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200),
  description: z.string().optional(),
  date_taken: z.string().datetime("Format tanggal tidak valid"),
  published: z.boolean().default(false),
  media: z.array(z.object({
    url: z.string().url("URL tidak valid"),
    public_id: z.string().min(1),
    type: z.enum(["PHOTO", "VIDEO"]),
    caption: z.string().max(500).optional(),
    order: z.number().int().min(0).max(4),
  })).min(1, "Minimal 1 media").max(5, "Maksimal 5 media"),
  music: z.object({
    source: z.enum(["UPLOAD", "ITUNES"]),
    file_url: z.string().url().optional(),
    file_public_id: z.string().optional(),
    itunes_track_id: z.string().optional(),
    preview_url: z.string().url().optional(),
    track_name: z.string().optional(),
    artist_name: z.string().optional(),
    album_art_url: z.string().url().optional(),
    start_time: z.number().int().min(0).default(0),
    duration: z.enum(["FIFTEEN", "THIRTY", "SIXTY"]).default("THIRTY"),
  }).optional(),
  location: z.object({
    display_name: z.string().min(1),
    place_id: z.string().min(1),
    lat: z.number(),
    lng: z.number(),
  }).optional(),
})

export type CreateEntryPayload = z.infer<typeof createEntrySchema>
```

### 6.2 Penggunaan di API Route

```typescript
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const result = createEntrySchema.safeParse(body)

  if (!result.success) {
    return Response.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 400 }
    )
  }

  const data = result.data // fully typed, sudah validated
  // ... proses ke database
}
```

---

## 7. Security Rules

### 7.1 Authentication Protection

```typescript
// src/middleware.ts — Protect semua /admin/* routes
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

export const config = {
  matcher: ["/admin/:path*"],
}
```

```typescript
// Setiap admin API route — HARUS ada ini di awal
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  // ... lanjut
}
```

### 7.2 Upload Validation

```typescript
// src/app/api/upload/route.ts
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/heic", "image/webp"]
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"]
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/x-m4a"]

const MAX_PHOTO_SIZE = 20 * 1024 * 1024   // 20 MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024  // 500 MB
const MAX_AUDIO_SIZE = 50 * 1024 * 1024   // 50 MB

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get("file") as File
  const type = formData.get("type") as string

  // Validasi MIME type
  const allAllowed = [...ALLOWED_PHOTO_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_AUDIO_TYPES]
  if (!allAllowed.includes(file.type)) {
    return Response.json({ error: "Format file tidak didukung" }, { status: 400 })
  }

  // Validasi ukuran
  const maxSize = ALLOWED_PHOTO_TYPES.includes(file.type) ? MAX_PHOTO_SIZE
    : ALLOWED_VIDEO_TYPES.includes(file.type) ? MAX_VIDEO_SIZE
    : MAX_AUDIO_SIZE

  if (file.size > maxSize) {
    return Response.json({ error: "File terlalu besar" }, { status: 400 })
  }

  // Upload ke Cloudinary
  // ...
}
```

### 7.3 Environment Variables

```typescript
// ❌ DILARANG hardcode secrets
const apiKey = "AIzaSyAbc123..."

// ✅ Selalu dari env
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

// Untuk server-only secrets (tidak NEXT_PUBLIC_)
const cloudinarySecret = process.env.CLOUDINARY_API_SECRET
```

---

## 8. Error Handling

### 8.1 API Routes

```typescript
// Selalu return error yang informatif
export async function GET(req: Request) {
  try {
    const entries = await prisma.entry.findMany(...)
    return Response.json({ entries })
  } catch (error) {
    console.error("[GET /api/entries]", error)
    return Response.json(
      { error: "Gagal memuat entries" },
      { status: 500 }
    )
  }
}
```

### 8.2 Cloudinary Upload Error

```typescript
try {
  const result = await cloudinary.uploader.upload(fileBuffer, {
    resource_type: "auto",
    folder: "journaling",
  })
  return Response.json({ url: result.secure_url, public_id: result.public_id })
} catch (error) {
  console.error("[Upload Cloudinary]", error)
  return Response.json({ error: "Upload gagal, coba lagi" }, { status: 500 })
}
```

### 8.3 Not Found

```typescript
// Gunakan Next.js notFound() untuk 404
import { notFound } from "next/navigation"

const entry = await prisma.entry.findUnique({ where: { slug } })
if (!entry || !entry.published) notFound()
```

---

## 9. Styling Rules (Tailwind CSS)

### 9.1 Class Order (Prettier plugin akan handle ini)

```
1. Layout:     flex, grid, block, hidden
2. Position:   relative, absolute, fixed, sticky
3. Size:       w-, h-, max-w-, aspect-
4. Spacing:    p-, m-, gap-, space-
5. Typography: text-, font-, leading-, tracking-
6. Visual:     bg-, border-, rounded-, shadow-, opacity-
7. Transition: transition-, duration-, ease-
8. State:      hover:, focus:, group-hover:
```

### 9.2 Custom CSS Variables via Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg:         "var(--color-bg)",
        surface:    "var(--color-surface)",
        "surface-2":"var(--color-surface-2)",
        border:     "var(--color-border)",
        primary:    "var(--color-text-primary)",
        secondary:  "var(--color-text-secondary)",
        accent:     "var(--color-accent)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body:    ["DM Sans", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
    }
  }
}
```

### 9.3 Jangan Inline Style untuk Animasi

```typescript
// ❌ Jangan pakai inline style untuk nilai yang bisa pakai Tailwind
<div style={{ marginTop: "16px" }}>

// ✅ Pakai Tailwind
<div className="mt-4">

// ✅ Inline style HANYA untuk nilai dinamis dari JS (GSAP transform, dll)
<div style={{ transform: `translateY(${offset}px)` }}>
```

---

## 10. Git & Version Control

### 10.1 Branch Strategy

```
main     — production (deploy ke Oracle Cloud)
develop  — development aktif
feature/ — fitur baru: feature/music-player
fix/     — bug fix: fix/caption-not-showing
```

### 10.2 Commit Message Format (Conventional Commits)

```
<type>: <deskripsi singkat dalam bahasa Inggris>

Types:
  feat:     fitur baru
  fix:      bug fix
  style:    perubahan styling/CSS
  refactor: refactoring tanpa fitur/fix baru
  chore:    update deps, config, dll
  docs:     update dokumentasi
  perf:     optimasi performance

Contoh:
  feat: add music player with Howler.js fade
  fix: caption not visible when photo is dark
  style: update entry card hover animation
  refactor: extract MusicPlayer to separate component
  chore: update GSAP to 3.12
  docs: update architecture.md deployment section
```

### 10.3 Yang TIDAK Boleh Di-commit

```
.env
.env.local
.env.production
node_modules/
.next/
*.log
.DS_Store
Thumbs.db
*.mp4, *.jpg (media files — simpan di Cloudinary)
```

```gitignore
# .gitignore (minimal)
.env
.env.local
.env*.local
node_modules/
.next/
out/
*.log
.DS_Store
```

---

## 11. Prisma Rules

### 11.1 Client Singleton

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
})

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
```

### 11.2 Query Patterns

```typescript
// ✅ Select hanya field yang dibutuhkan
const entries = await prisma.entry.findMany({
  select: {
    slug: true,
    title: true,
    date_taken: true,
    media: {
      where: { order: 0 },
      select: { url: true, type: true },
    },
    location: { select: { display_name: true } },
  },
  where: { published: true },
  orderBy: { date_taken: "desc" },
  take: 12,
})

// ✅ Cascade delete sudah di-handle schema (onDelete: Cascade)
// Cukup delete entry, media/music/location ikut terhapus
await prisma.entry.delete({ where: { id } })

// ✅ Transaction untuk operasi yang harus atomic
await prisma.$transaction([
  prisma.entry.update({ where: { id }, data: { published: true } }),
  // operasi lain jika perlu
])
```

---

## 12. Checklist Sebelum Push ke Main

- [ ] Tidak ada `console.log` yang tertinggal (kecuali error logging)
- [ ] Tidak ada `any` baru yang ditambahkan
- [ ] Semua komponen baru sudah typed dengan interface
- [ ] API route admin sudah ada session check
- [ ] Upload handler sudah validasi MIME type dan ukuran
- [ ] GSAP animations punya cleanup (useGSAP atau manual kill)
- [ ] Tidak ada secrets di kode
- [ ] Image menggunakan next/image
- [ ] Loading state sudah ada untuk async operation
- [ ] Build berhasil: `npm run build` tidak error
