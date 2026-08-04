# Database Schema
## Personal Travel Journal — Prisma Schema & Data Dictionary

---

## 1. Full Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────

enum MediaType {
  PHOTO   // Foto: JPEG, PNG, HEIC, WebP
  VIDEO   // Video: MP4, MOV
}

enum MusicSource {
  UPLOAD  // File MP3/M4A yang di-upload admin sendiri ke Cloudinary
  ITUNES  // Preview 30 detik dari iTunes Search API (Apple CDN)
}

enum MusicDuration {
  FIFTEEN // 15 detik — hanya untuk mode UPLOAD
  THIRTY  // 30 detik — default untuk ITUNES, bisa untuk UPLOAD
  SIXTY   // 60 detik — hanya untuk mode UPLOAD
}

// ─────────────────────────────────────────────────────────────
// MODELS
// ─────────────────────────────────────────────────────────────

model Entry {
  id          String   @id @default(cuid())
  slug        String   @unique
  // Contoh slug: "bromo-trip-maret-2024"
  // Di-generate otomatis dari title saat create
  // Digunakan sebagai URL: /entry/bromo-trip-maret-2024

  title       String   @db.VarChar(200)
  description String?  @db.Text
  // Rich text dalam format HTML string
  // Null jika admin tidak mengisi deskripsi

  date_taken  DateTime
  // Tanggal foto/video diambil (bukan tanggal upload)
  // Digunakan untuk sorting chronological

  published   Boolean  @default(false)
  // false = draft (hanya admin yang bisa lihat)
  // true  = tampil di feed publik

  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  // ─── Relations ───
  media       Media[]
  location    Location?
  music       Music?

  // ─── Indexes ───
  @@index([published])           // Filter feed publik
  @@index([date_taken])          // Sort chronological
  @@index([created_at])          // Sort admin dashboard (terbaru)
  @@index([published, date_taken]) // Composite: feed publik terurut
}

model Media {
  id         String    @id @default(cuid())

  url        String
  // Full Cloudinary URL dengan transformasi
  // Contoh: https://res.cloudinary.com/xxx/image/upload/f_auto,q_auto/v1/journaling/abc123

  public_id  String
  // Cloudinary public_id untuk keperluan delete
  // Contoh: journaling/abc123
  // Diperlukan karena URL saja tidak cukup untuk delete dari Cloudinary

  type       MediaType
  // PHOTO atau VIDEO

  caption    String?   @db.VarChar(500)
  // Caption individual per foto/video
  // Null jika tidak diisi admin
  // Ditampilkan sebagai overlay saat media di viewport

  order      Int
  // Urutan tampil: 0, 1, 2, 3, 4
  // 0 = media pertama (digunakan sebagai cover di feed card)
  // Bisa diubah admin via drag & drop

  created_at DateTime  @default(now())

  // ─── Relations ───
  entry_id   String
  entry      Entry     @relation(fields: [entry_id], references: [id], onDelete: Cascade)
  // onDelete: Cascade → hapus entry = hapus semua media otomatis

  // ─── Indexes ───
  @@index([entry_id])            // Join query entry → media
  @@index([entry_id, order])     // Ordered media per entry (paling sering dipakai)
}

model Music {
  id            String        @id @default(cuid())
  source        MusicSource

  // ─── Mode UPLOAD (source = UPLOAD) ───
  file_url      String?
  // Cloudinary audio URL
  // Null jika source = ITUNES

  file_public_id String?
  // Cloudinary public_id untuk delete
  // Null jika source = ITUNES

  // ─── Mode ITUNES (source = ITUNES) ───
  itunes_track_id String?
  // ID lagu dari iTunes catalog
  // Null jika source = UPLOAD

  preview_url   String?
  // 30 detik preview URL dari Apple CDN
  // Format: https://audio-ssl.itunes.apple.com/...
  // Null jika source = UPLOAD

  // ─── Shared Fields (kedua mode) ───
  track_name    String?       @db.VarChar(200)
  // Nama lagu — dari iTunes API atau input admin

  artist_name   String?       @db.VarChar(200)
  // Nama artis — dari iTunes API atau input admin

  album_name    String?       @db.VarChar(200)
  // Nama album — dari iTunes API, null untuk UPLOAD

  album_art_url String?
  // URL cover art album dari iTunes API
  // Ditampilkan di music player bar

  start_time    Int           @default(0)
  // Detik mulai playback
  // Untuk ITUNES: selalu 0 (preview sudah di-trim Apple)
  // Untuk UPLOAD: admin bisa set mulai dari detik berapa

  duration      MusicDuration @default(THIRTY)
  // Durasi clip yang diputar
  // Untuk ITUNES: selalu THIRTY (preview Apple = 30 detik)
  // Untuk UPLOAD: admin pilih 15/30/60 detik

  created_at    DateTime      @default(now())

  // ─── Relations ───
  entry_id      String        @unique
  // @unique → satu entry hanya boleh punya satu musik
  entry         Entry         @relation(fields: [entry_id], references: [id], onDelete: Cascade)
}

model Location {
  id            String   @id @default(cuid())

  display_name  String   @db.VarChar(300)
  // Nama lokasi yang ditampilkan ke user
  // Contoh: "Kawah Ijen, Banyuwangi, Jawa Timur, Indonesia"
  // Di-generate dari Google Maps place detail atau input admin

  place_id      String
  // Google Maps Place ID — persistent identifier
  // Contoh: "ChIJN1t_tDeuEmsRUsoyG83frY4"
  // Digunakan untuk: Google Maps embed link, static map URL

  lat           Float
  // Latitude — contoh: -8.0584
  // Presisi 4 desimal cukup untuk tampilan (~11 meter akurasi)

  lng           Float
  // Longitude — contoh: 114.2422

  created_at    DateTime @default(now())

  // ─── Relations ───
  entry_id      String   @unique
  // @unique → satu entry hanya boleh punya satu lokasi
  entry         Entry    @relation(fields: [entry_id], references: [id], onDelete: Cascade)

  // ─── Indexes ───
  @@index([place_id])            // Lookup by place (untuk Phase 2: group by location)
}
```

---

## 2. Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────┐
│                       Entry                         │
│─────────────────────────────────────────────────────│
│ id          String  @id                             │
│ slug        String  @unique                         │
│ title       String                                  │
│ description String?                                 │
│ date_taken  DateTime                                │
│ published   Boolean                                 │
│ created_at  DateTime                                │
│ updated_at  DateTime                                │
└──────────┬──────────────┬──────────────┬────────────┘
           │              │              │
           │ 1:N          │ 1:0..1       │ 1:0..1
           ▼              ▼              ▼
┌──────────────┐  ┌─────────────┐  ┌────────────────┐
│    Media     │  │    Music    │  │    Location    │
│──────────────│  │─────────────│  │────────────────│
│ id           │  │ id          │  │ id             │
│ url          │  │ source      │  │ display_name   │
│ public_id    │  │ file_url?   │  │ place_id       │
│ type         │  │ file_pub_id?│  │ lat            │
│ caption?     │  │ track_id?   │  │ lng            │
│ order        │  │ preview_url?│  │ created_at     │
│ created_at   │  │ track_name? │  │ entry_id       │
│ entry_id     │  │ artist_name?│  └────────────────┘
└──────────────┘  │ album_name? │
                  │ album_art?  │
                  │ start_time  │
                  │ duration    │
                  │ created_at  │
                  │ entry_id    │
                  └─────────────┘
```

---

## 3. Data Dictionary

### 3.1 Entry

| Field | Type | Nullable | Constraint | Deskripsi |
|---|---|---|---|---|
| id | String | No | PK, CUID | Primary key auto-generated |
| slug | String | No | UNIQUE | URL identifier, slugified dari title |
| title | String | No | max 200 | Judul entry, ditampilkan di feed & hero |
| description | String | Yes | TEXT | Rich text HTML, cerita panjang |
| date_taken | DateTime | No | - | Tanggal foto/video diambil |
| published | Boolean | No | default false | Status publikasi |
| created_at | DateTime | No | default now() | Waktu record dibuat |
| updated_at | DateTime | No | auto-update | Waktu record terakhir diubah |

### 3.2 Media

| Field | Type | Nullable | Constraint | Deskripsi |
|---|---|---|---|---|
| id | String | No | PK, CUID | Primary key |
| url | String | No | - | Full Cloudinary URL |
| public_id | String | No | - | Cloudinary public_id untuk delete |
| type | MediaType | No | ENUM | PHOTO atau VIDEO |
| caption | String | Yes | max 500 | Caption individual per media |
| order | Int | No | 0-4 | Urutan tampil, 0 = cover |
| created_at | DateTime | No | default now() | Waktu upload |
| entry_id | String | No | FK → Entry | Entry yang memiliki media ini |

### 3.3 Music

| Field | Type | Nullable | Constraint | Deskripsi |
|---|---|---|---|---|
| id | String | No | PK, CUID | Primary key |
| source | MusicSource | No | ENUM | UPLOAD atau ITUNES |
| file_url | String | Yes | - | Cloudinary audio URL (UPLOAD saja) |
| file_public_id | String | Yes | - | Cloudinary public_id (UPLOAD saja) |
| itunes_track_id | String | Yes | - | iTunes track ID (ITUNES saja) |
| preview_url | String | Yes | - | Apple CDN preview URL (ITUNES saja) |
| track_name | String | Yes | max 200 | Nama lagu |
| artist_name | String | Yes | max 200 | Nama artis |
| album_name | String | Yes | max 200 | Nama album |
| album_art_url | String | Yes | - | URL cover art album |
| start_time | Int | No | default 0 | Detik mulai playback |
| duration | MusicDuration | No | default THIRTY | Durasi clip |
| created_at | DateTime | No | default now() | Waktu dibuat |
| entry_id | String | No | FK UNIQUE → Entry | Entry pemilik, one-to-one |

### 3.4 Location

| Field | Type | Nullable | Constraint | Deskripsi |
|---|---|---|---|---|
| id | String | No | PK, CUID | Primary key |
| display_name | String | No | max 300 | Nama lokasi untuk tampilan |
| place_id | String | No | - | Google Maps Place ID |
| lat | Float | No | - | Latitude koordinat |
| lng | Float | No | - | Longitude koordinat |
| created_at | DateTime | No | default now() | Waktu dibuat |
| entry_id | String | No | FK UNIQUE → Entry | Entry pemilik, one-to-one |

---

## 4. Slug Generation Logic

```typescript
// src/lib/slugify.ts

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")     // hapus karakter special
    .replace(/[\s_-]+/g, "-")      // spasi/underscore → hyphen
    .replace(/^-+|-+$/g, "")       // trim hyphen di ujung
}

export async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title)

  // Cek apakah slug sudah ada
  const existing = await prisma.entry.count({ where: { slug: base } })
  if (existing === 0) return base

  // Cari suffix yang tersedia
  let suffix = 2
  while (true) {
    const candidate = `${base}-${suffix}`
    const count = await prisma.entry.count({ where: { slug: candidate } })
    if (count === 0) return candidate
    suffix++
  }
}

// Contoh:
// "Bromo Trip Maret 2024"  → "bromo-trip-maret-2024"
// "Bromo Trip Maret 2024"  → "bromo-trip-maret-2024-2"  (jika sudah ada)
// "Café de Paris ☕"       → "caf-de-paris"
```

---

## 5. Common Queries

### 5.1 Feed Publik (dengan pagination)

```typescript
// Digunakan di: GET /api/entries, src/app/(public)/page.tsx

const PAGE_SIZE = 12

async function getPublishedEntries(page: number = 1) {
  const [entries, total] = await prisma.$transaction([
    prisma.entry.findMany({
      where: { published: true },
      orderBy: { date_taken: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      select: {
        slug: true,
        title: true,
        date_taken: true,
        media: {
          where: { order: 0 },           // Hanya cover (media pertama)
          select: { url: true, type: true },
          take: 1,
        },
        location: {
          select: { display_name: true },
        },
      },
    }),
    prisma.entry.count({ where: { published: true } }),
  ])

  return {
    entries,
    total,
    hasMore: page * PAGE_SIZE < total,
    currentPage: page,
  }
}
```

### 5.2 Entry Detail Lengkap

```typescript
// Digunakan di: GET /api/entries/[id], src/app/(public)/entry/[slug]/page.tsx

async function getEntryBySlug(slug: string) {
  return prisma.entry.findUnique({
    where: { slug, published: true },
    include: {
      media: {
        orderBy: { order: "asc" },       // Urutan sesuai yang diset admin
      },
      music: true,                       // Semua field musik
      location: true,                    // Semua field lokasi
    },
  })
}
```

### 5.3 Admin Dashboard List

```typescript
// Digunakan di: src/app/(admin)/admin/page.tsx

async function getAllEntries(filter?: "published" | "draft") {
  return prisma.entry.findMany({
    where: filter === "published" ? { published: true }
         : filter === "draft"     ? { published: false }
         : undefined,
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      published: true,
      date_taken: true,
      created_at: true,
      media: {
        where: { order: 0 },
        select: { url: true },
        take: 1,
      },
      _count: {
        select: { media: true },          // Jumlah total media per entry
      },
    },
  })
}
```

### 5.4 Create Entry (Transaction)

```typescript
async function createEntry(data: CreateEntryPayload) {
  const slug = await generateUniqueSlug(data.title)

  return prisma.entry.create({
    data: {
      slug,
      title: data.title,
      description: data.description,
      date_taken: new Date(data.date_taken),
      published: data.published,

      // Media — dibuat bersamaan
      media: {
        create: data.media.map((m) => ({
          url: m.url,
          public_id: m.public_id,
          type: m.type,
          caption: m.caption,
          order: m.order,
        })),
      },

      // Musik — optional
      ...(data.music && {
        music: {
          create: {
            source: data.music.source,
            file_url: data.music.file_url,
            file_public_id: data.music.file_public_id,
            itunes_track_id: data.music.itunes_track_id,
            preview_url: data.music.preview_url,
            track_name: data.music.track_name,
            artist_name: data.music.artist_name,
            album_name: data.music.album_name,
            album_art_url: data.music.album_art_url,
            start_time: data.music.start_time,
            duration: data.music.duration,
          },
        },
      }),

      // Lokasi — optional
      ...(data.location && {
        location: {
          create: {
            display_name: data.location.display_name,
            place_id: data.location.place_id,
            lat: data.location.lat,
            lng: data.location.lng,
          },
        },
      }),
    },
    include: {
      media: true,
      music: true,
      location: true,
    },
  })
}
```

### 5.5 Update Entry (dengan reorder media)

```typescript
async function updateEntry(id: string, data: UpdateEntryPayload) {
  return prisma.$transaction(async (tx) => {
    // Update entry dasar
    const entry = await tx.entry.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        date_taken: new Date(data.date_taken),
        published: data.published,
        // Update slug jika title berubah
        ...(data.titleChanged && { slug: await generateUniqueSlug(data.title) }),
      },
    })

    // Update media orders (upsert per item)
    for (const m of data.media) {
      await tx.media.upsert({
        where: { id: m.id ?? "new" },
        create: {
          url: m.url,
          public_id: m.public_id,
          type: m.type,
          caption: m.caption,
          order: m.order,
          entry_id: id,
        },
        update: {
          caption: m.caption,
          order: m.order,
        },
      })
    }

    // Hapus media yang dihapus admin
    if (data.deletedMediaIds.length > 0) {
      await tx.media.deleteMany({
        where: { id: { in: data.deletedMediaIds } },
      })
    }

    return entry
  })
}
```

### 5.6 Delete Entry (dengan cleanup Cloudinary)

```typescript
// src/app/api/entries/[id]/route.ts

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  // Ambil semua public_id media untuk cleanup Cloudinary
  const entry = await prisma.entry.findUnique({
    where: { id: params.id },
    include: {
      media: { select: { public_id: true } },
      music: { select: { file_public_id: true } },
    },
  })

  if (!entry) return Response.json({ error: "Not found" }, { status: 404 })

  // Hapus dari Cloudinary
  const publicIds = [
    ...entry.media.map(m => m.public_id),
    ...(entry.music?.file_public_id ? [entry.music.file_public_id] : []),
  ]

  if (publicIds.length > 0) {
    await cloudinary.api.delete_resources(publicIds)
  }

  // Hapus dari database (cascade akan hapus media/music/location)
  await prisma.entry.delete({ where: { id: params.id } })

  return Response.json({ success: true })
}
```

---

## 6. Migration Commands

```bash
# Development — buat migration baru setelah ubah schema
npx prisma migrate dev --name <nama-migration>
# Contoh: npx prisma migrate dev --name add-entry-model

# Production — apply migration yang sudah ada
npx prisma migrate deploy

# Reset database (HATI-HATI: hapus semua data)
npx prisma migrate reset

# Generate Prisma Client setelah ubah schema
npx prisma generate

# Lihat status migration
npx prisma migrate status

# Buka Prisma Studio (GUI database)
npx prisma studio
```

---

## 7. Seed Script

```typescript
// prisma/seed.ts
// Tujuan: print info setup admin, tidak menyimpan user ke DB

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("=".repeat(50))
  console.log("Database seeded successfully!")
  console.log("=".repeat(50))
  console.log("")
  console.log("Admin credentials dikonfigurasi via environment variables:")
  console.log("  ADMIN_EMAIL       =", process.env.ADMIN_EMAIL ?? "(belum diset)")
  console.log("  ADMIN_PASSWORD_HASH = (bcrypt hash dari password)")
  console.log("")
  console.log("Cara generate password hash:")
  console.log("  node -e \"const b=require('bcryptjs'); console.log(b.hashSync('PASSWORD_KAMU', 12))\"")
  console.log("=".repeat(50))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

```json
// package.json — tambahkan ini
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## 8. Indexes & Performance Notes

| Index | Table | Fields | Jenis | Tujuan |
|---|---|---|---|---|
| PK | Entry | id | B-tree | Lookup by primary key |
| UNIQUE | Entry | slug | B-tree | URL lookup `/entry/[slug]` |
| IDX | Entry | published | B-tree | Filter feed publik (`WHERE published = true`) |
| IDX | Entry | date_taken | B-tree | Sort chronological |
| IDX | Entry | created_at | B-tree | Sort admin dashboard |
| IDX | Entry | published, date_taken | B-tree | Composite: feed query paling umum |
| PK | Media | id | B-tree | Lookup by primary key |
| IDX | Media | entry_id | B-tree | Join Entry → Media |
| IDX | Media | entry_id, order | B-tree | Ordered media per entry |
| PK | Music | id | B-tree | Lookup by primary key |
| UNIQUE | Music | entry_id | B-tree | One-to-one constraint |
| PK | Location | id | B-tree | Lookup by primary key |
| UNIQUE | Location | entry_id | B-tree | One-to-one constraint |
| IDX | Location | place_id | B-tree | Phase 2: group by lokasi |

**Catatan Performa:**
- Dengan 50-100 entry, semua query akan sangat cepat tanpa optimasi apapun
- Index composite `(published, date_taken)` di Entry adalah yang paling penting
- Prisma otomatis menambahkan index pada field FK dan `@unique`
- Untuk Phase 2 (jika entry mencapai ribuan): pertimbangkan cursor-based pagination
