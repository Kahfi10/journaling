# Architecture Document
## Personal Travel Journal — Technical Architecture

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Oracle Cloud ARM VM                      │
│                  (4 vCPU, 24GB RAM — Free)                  │
│                                                             │
│  ┌──────────┐    ┌──────────────────────────────────────┐  │
│  │  Nginx   │───▶│         Docker Compose               │  │
│  │ :80/:443 │    │  ┌────────────┐  ┌────────────────┐  │  │
│  └──────────┘    │  │  Next.js   │  │  PostgreSQL 16  │  │  │
│       ▲          │  │  :3000     │◀─│  :5432         │  │  │
│       │          │  └────────────┘  └────────────────┘  │  │
│  Let's Encrypt   └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         ▲                        ▲
         │                        │
   [Visitor / Admin]       [Cloudinary CDN]
      (Browser)            (media storage)

External APIs:
  ├── iTunes Search API   (musik search, gratis, no key)
  └── Google Maps JS API  (location picker + embed)
```

---

## 2. Tech Stack

### 2.1 Frontend

| Layer | Library | Versi | Alasan Dipilih |
|---|---|---|---|
| Framework | Next.js | 14 (App Router) | SSR, RSC, image optimization, routing |
| Language | TypeScript | 5.x | Type safety, maintainability |
| Styling | Tailwind CSS | 3.x | Utility-first, cepat, no runtime |
| Components | shadcn/ui | latest | Headless, customizable, aksesibel |
| Scroll Animation | GSAP + ScrollTrigger | 3.x | Gold standard scroll animation |
| Smooth Scroll | Lenis | latest | Inertia scrolling natural |
| Page Transition | Framer Motion | latest | AnimatePresence, spring physics |
| Audio Playback | Howler.js | 2.x | Cross-browser, fade API, reliable |
| Audio Visualizer | WaveSurfer.js | 7.x | Waveform render dari audio URL |
| Icons | Lucide React | latest | Konsisten, minimal, tree-shakeable |
| Form | React Hook Form | latest | Performant, uncontrolled by default |
| Validation | Zod | latest | Runtime type-safe validation |

### 2.2 Backend

| Layer | Library | Versi | Alasan Dipilih |
|---|---|---|---|
| API Layer | Next.js API Routes | 14 | Co-located, no extra server |
| ORM | Prisma | 5.x | Type-safe queries, migration support |
| Database | PostgreSQL | 16 | Relasional, reliable, free self-host |
| Auth | NextAuth.js (Auth.js) | 5.x | Credentials provider, session JWT |
| Media Storage | Cloudinary | SDK v2 | CDN, auto-optimize, free 25GB |
| Password Hash | bcryptjs | latest | Industry standard |

### 2.3 Infrastructure

| Layer | Pilihan | Alasan |
|---|---|---|
| Server | Oracle Cloud ARM VM (Ampere A1) | Free tier: 4 OCPU, 24GB RAM, permanent |
| Container | Docker + Docker Compose | Reproducible, mudah deploy ulang |
| Reverse Proxy | Nginx | SSL termination, static file serving |
| SSL | Let's Encrypt + Certbot | HTTPS gratis, auto-renewal |
| Media CDN | Cloudinary | Global CDN, transformasi otomatis |

### 2.4 External APIs

| API | Kegunaan | Auth | Cost |
|---|---|---|---|
| iTunes Search API | Cari lagu, dapat preview URL 30s | Tidak perlu API key | Gratis |
| Google Maps JS API | Location picker (admin), Static Map embed | API Key (free quota) | Gratis (dalam quota) |

---

## 3. Folder Structure

```
D:\journaling\
│
├── docs/                              ← Dokumentasi proyek
│   ├── prd.md
│   ├── design.md
│   ├── architecture.md
│   ├── rules.md
│   └── schema.md
│
├── src/
│   │
│   ├── app/                           ← Next.js App Router
│   │   │
│   │   ├── (public)/                  ← Route group: halaman publik
│   │   │   ├── layout.tsx             ← Public layout (navbar minimal)
│   │   │   ├── page.tsx               ← Feed page (/)
│   │   │   └── entry/
│   │   │       └── [slug]/
│   │   │           ├── page.tsx       ← Entry detail (/entry/[slug])
│   │   │           └── loading.tsx    ← Skeleton loading state
│   │   │
│   │   ├── (admin)/                   ← Route group: admin (protected)
│   │   │   ├── layout.tsx             ← Admin layout (sidebar)
│   │   │   ├── login/
│   │   │   │   └── page.tsx           ← Login page (/login)
│   │   │   └── admin/
│   │   │       ├── page.tsx           ← Dashboard (/admin)
│   │   │       └── entries/
│   │   │           ├── new/
│   │   │           │   └── page.tsx   ← Create entry (/admin/entries/new)
│   │   │           └── [id]/
│   │   │               └── edit/
│   │   │                   └── page.tsx ← Edit entry
│   │   │
│   │   ├── api/                       ← API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts       ← NextAuth handler
│   │   │   ├── entries/
│   │   │   │   ├── route.ts           ← GET list, POST create
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts       ← GET one, PUT update, DELETE
│   │   │   ├── upload/
│   │   │   │   └── route.ts           ← Cloudinary upload handler
│   │   │   └── music/
│   │   │       └── search/
│   │   │           └── route.ts       ← iTunes Search API proxy
│   │   │
│   │   ├── globals.css                ← Global styles + CSS variables
│   │   └── layout.tsx                 ← Root layout (fonts, providers)
│   │
│   ├── components/
│   │   │
│   │   ├── feed/                      ← Feed page components
│   │   │   ├── FeedGrid.tsx           ← Grid container + GSAP stagger reveal
│   │   │   ├── FeedGrid.types.ts
│   │   │   ├── EntryCard.tsx          ← Single entry card
│   │   │   └── EntryCard.types.ts
│   │   │
│   │   ├── entry/                     ← Entry detail components
│   │   │   ├── EntryHero.tsx          ← Hero section (100vh, judul + lokasi)
│   │   │   ├── PhotoSection.tsx       ← Foto 100vh + parallax + caption
│   │   │   ├── VideoSection.tsx       ← Video 100vh + audio switch logic
│   │   │   ├── EntryCaption.tsx       ← Caption overlay dengan reveal animation
│   │   │   ├── EntryFooter.tsx        ← Footer: mini map + back link
│   │   │   ├── MusicPlayer.tsx        ← Fixed bottom music bar (Howler + WaveSurfer)
│   │   │   └── ScrollProgress.tsx     ← Fixed top progress bar
│   │   │
│   │   ├── admin/                     ← Admin panel components
│   │   │   ├── EntryForm.tsx          ← Form create/edit entry (master)
│   │   │   ├── MediaUploader.tsx      ← Drag & drop upload area
│   │   │   ├── MediaItem.tsx          ← Satu item: thumbnail + caption + controls
│   │   │   ├── MusicPicker.tsx        ← iTunes search + file upload music
│   │   │   ├── ItunesSearch.tsx       ← Search input + results list
│   │   │   ├── LocationPicker.tsx     ← Google Maps autocomplete input
│   │   │   ├── AdminSidebar.tsx       ← Sidebar navigasi admin
│   │   │   └── EntryList.tsx          ← Tabel/list entries di dashboard
│   │   │
│   │   ├── animations/                ← GSAP wrapper components
│   │   │   ├── ScrollReveal.tsx       ← Generic scroll reveal wrapper
│   │   │   ├── SplitTitle.tsx         ← SplitText hero title animation
│   │   │   └── PageTransition.tsx     ← Framer Motion page wrapper
│   │   │
│   │   └── ui/                        ← shadcn/ui base components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── textarea.tsx
│   │       ├── badge.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       └── ...
│   │
│   ├── lib/                           ← Utility & config
│   │   ├── prisma.ts                  ← Prisma client singleton
│   │   ├── cloudinary.ts              ← Cloudinary SDK config + upload helper
│   │   ├── auth.ts                    ← NextAuth config (options)
│   │   ├── itunes.ts                  ← iTunes Search API helper
│   │   ├── slugify.ts                 ← Slug generator dari judul
│   │   └── utils.ts                   ← cn(), formatDate(), dll
│   │
│   ├── hooks/                         ← Custom React hooks
│   │   ├── useGSAP.ts                 ← GSAP context + cleanup
│   │   ├── useMusicPlayer.ts          ← Howler.js state (play, pause, fade, mute)
│   │   ├── useScrollProgress.ts       ← Track scroll % untuk progress bar
│   │   └── useMediaQuery.ts           ← Breakpoint detection (Phase 3)
│   │
│   ├── types/                         ← TypeScript type definitions
│   │   ├── entry.ts                   ← Entry, Media, Music, Location types
│   │   ├── api.ts                     ← API request/response types
│   │   └── itunes.ts                  ← iTunes API response types
│   │
│   └── middleware.ts                  ← Protect /admin/* routes
│
├── prisma/
│   ├── schema.prisma                  ← Database schema
│   └── seed.ts                        ← Seed script (admin user setup info)
│
├── public/
│   └── images/
│       └── placeholder.jpg            ← Fallback image
│
├── .env.example                       ← Template env variables
├── .env.local                         ← Local dev secrets (gitignored)
├── .gitignore
├── docker-compose.yml                 ← Production: app + db + nginx
├── docker-compose.dev.yml             ← Development: db saja
├── Dockerfile                         ← Next.js production image
├── nginx.conf                         ← Nginx reverse proxy config
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 4. API Routes

### Public (No Authentication)

```
GET  /api/entries
     Query params: page (int), limit (int, default 12)
     Returns: { entries: EntryCard[], total: number, hasMore: boolean }

GET  /api/entries/[id]
     Returns: Entry dengan semua relasi (media, music, location)
     404 jika tidak ditemukan atau belum published

GET  /api/music/search
     Query params: q (string, nama lagu/artis)
     Proxy ke iTunes Search API
     Returns: { results: ItunesTrack[] }
```

### Admin (Requires Valid Session)

```
POST   /api/entries
       Body: CreateEntryPayload (Zod validated)
       Returns: { entry: Entry }

PUT    /api/entries/[id]
       Body: UpdateEntryPayload (Zod validated)
       Returns: { entry: Entry }

DELETE /api/entries/[id]
       Side effect: hapus media dari Cloudinary
       Returns: { success: true }

POST   /api/upload
       Body: FormData { file: File, type: "photo"|"video"|"audio" }
       Validates: MIME type, file size
       Uploads ke Cloudinary
       Returns: { url: string, public_id: string }
```

---

## 5. Data Flow

### 5.1 Public Feed Load

```
1. Browser request GET /
2. Next.js RSC: fetch entries dari DB via Prisma
   SELECT slug, title, date_taken, first media URL, location display_name
   WHERE published = true ORDER BY date_taken DESC LIMIT 12
3. HTML di-render server-side + dikirim ke browser
4. Client: Lenis init, GSAP ScrollTrigger init
5. GSAP: cards reveal animation saat scroll
6. Load more: client request GET /api/entries?page=2
7. Next.js ISR: revalidate setiap 60 detik
```

### 5.2 Entry Detail Load

```
1. Browser request GET /entry/[slug]
2. Next.js RSC: fetch entry lengkap via Prisma
   SELECT entry + all media (ordered) + music + location
   WHERE slug = [slug] AND published = true
3. HTML di-render server-side
4. Client mount:
   a. Lenis init (smooth scroll)
   b. GSAP ScrollSmoother init
   c. SplitText pada hero title
   d. Howler.js: load music URL, play(), fade in
   e. WaveSurfer.js: init pada music bar
   f. ScrollTrigger setup per foto section:
      - Parallax pada foto
      - Caption reveal trigger
   g. ScrollTrigger setup per video section:
      - onEnter: Howler fade out → video.play()
      - onLeave: video.pause() → Howler fade in
5. Scroll progress bar: update real-time via scroll event
```

### 5.3 Admin Upload Flow

```
1. Admin pilih file (drag & drop atau file picker)
2. Client: validasi awal (MIME type, ukuran)
3. Client: tampilkan preview thumbnail
4. Client: POST /api/upload (FormData)
5. Server:
   a. Verifikasi session → 401 jika tidak ada
   b. Validasi MIME type (whitelist)
   c. Validasi ukuran file
   d. Upload ke Cloudinary via SDK
   e. Return { url, public_id }
6. Client: simpan { url, public_id } di form state
7. Admin isi caption, lanjut form
8. Admin submit form → POST /api/entries
9. Server:
   a. Verifikasi session
   b. Zod validate payload
   c. Generate slug dari judul
   d. Prisma create: Entry + Media[] + Music? + Location?
   e. Return created entry
10. Client: redirect ke /admin atau entry baru
```

### 5.4 Music Auto-Switch Logic

```
[Halaman Detail Mount]
  → Howler load music.url
  → sound.play()
  → sound.fade(0, 0.75, 500)  ← fade in

[ScrollTrigger per VideoSection]
  onEnter: (video masuk viewport)
    → sound.fade(currentVol, 0, 300)
    → setTimeout(() => videoRef.current.play(), 300)

  onLeave: (video keluar bawah)
    → videoRef.current.pause()
    → videoRef.current.currentTime = 0
    → sound.fade(0, 0.75, 500)

  onEnterBack: (kembali scroll naik ke video)
    → sound.fade(currentVol, 0, 300)
    → setTimeout(() => videoRef.current.play(), 300)

  onLeaveBack: (scroll naik melewati video)
    → videoRef.current.pause()
    → sound.fade(0, 0.75, 500)

[Halaman Unmount / Navigate away]
  → sound.fade(currentVol, 0, 400)
  → setTimeout(() => sound.unload(), 400)
  → ScrollTrigger.getAll().forEach(t => t.kill())
```

---

## 6. Authentication Flow

```
Admin Configuration:
  - ADMIN_EMAIL dan ADMIN_PASSWORD_HASH disimpan di .env
  - Tidak ada User table di database
  - Password di-hash dengan bcryptjs saat setup

Login Flow:
  1. Admin POST /api/auth/callback/credentials
     { email, password }
  2. NextAuth: cek email === ADMIN_EMAIL
  3. NextAuth: bcrypt.compare(password, ADMIN_PASSWORD_HASH)
  4. Jika valid: buat JWT session, set cookie
  5. Redirect ke /admin

Session Check (middleware.ts):
  - Semua request ke /admin/* → getToken() dari cookie
  - Jika tidak ada token valid → redirect ke /login

API Route Protection:
  - Setiap admin API route: const session = await getServerSession(authOptions)
  - Jika session null → return Response({ status: 401 })
```

---

## 7. Deployment Architecture

### 7.1 Docker Compose (Production)

```yaml
# docker-compose.yml

services:
  app:
    build: .
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://journaling:password@db:5432/journaling
      - NODE_ENV=production
      # + semua env vars lainnya
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=journaling
      - POSTGRES_USER=journaling
      - POSTGRES_PASSWORD=<strong-password>
    # Port tidak di-expose ke luar, hanya accessible dari container app

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - app

volumes:
  postgres_data:
```

### 7.2 Nginx Config

```nginx
# nginx.conf

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    # Upload size limit
    client_max_body_size 520M;

    location / {
        proxy_pass         http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7.3 Dockerfile

```dockerfile
# Multi-stage build untuk image yang lebih kecil

FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "server.js"]
```

### 7.4 Environment Variables

```bash
# .env.example (commit ini, tanpa nilai asli)

# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/journaling"

# NextAuth
NEXTAUTH_SECRET="generate-dengan-openssl-rand-base64-32"
NEXTAUTH_URL="https://yourdomain.com"

# Admin credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH="bcrypt-hash-of-your-password"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-maps-api-key"

# App
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

---

## 8. Performance Strategies

| Strategi | Implementasi | Dampak |
|---|---|---|
| SSR / RSC | Feed & detail render di server | FCP lebih cepat |
| ISR | Feed revalidate 60 detik | Cache + fresh data |
| Image optimization | `next/image` + Cloudinary `f_auto,q_auto,w_auto` | 60-80% ukuran lebih kecil |
| Lazy loading foto | Default Next.js Image (`loading="lazy"`) | Tidak load semua sekaligus |
| Video lazy | Hanya load thumbnail, video src diset saat play | Hemat bandwidth awal |
| Code splitting | Next.js per-route otomatis | Bundle lebih kecil |
| GSAP lazy init | Init setelah component mount, bukan SSR | Tidak block rendering |
| Font optimization | `next/font` Google Fonts | Tidak flash, no CLS |
| DB query select | Hanya field yang dibutuhkan, tidak `SELECT *` | Query lebih ringan |
| Prisma connection | Singleton pattern (`lib/prisma.ts`) | Tidak buat koneksi baru tiap request |

---

## 9. Security Checklist

- [ ] Semua `/admin/*` routes dilindungi `middleware.ts`
- [ ] Semua admin API routes verifikasi session server-side
- [ ] Upload: whitelist MIME type (jpeg, png, heic, mp4, mov, mp3, m4a)
- [ ] Upload: limit ukuran file (foto 20MB, video 500MB)
- [ ] Upload: Cloudinary `allowed_formats` config
- [ ] Password: bcrypt hash, tidak pernah store plain text
- [ ] Secrets: semua di `.env`, tidak di-hardcode
- [ ] `.env` di `.gitignore`
- [ ] Nginx: security headers
- [ ] PostgreSQL: tidak expose port ke internet (hanya internal Docker network)
- [ ] HTTPS: enforced via Nginx redirect HTTP → HTTPS
- [ ] Zod: validasi semua input API sebelum ke database

---

## 10. Development Setup

```bash
# 1. Clone & install
git clone <repo>
cd journaling
npm install

# 2. Setup database local (Docker)
docker-compose -f docker-compose.dev.yml up -d
# Atau gunakan PostgreSQL lokal

# 3. Setup env
cp .env.example .env.local
# Edit .env.local dengan nilai lokal

# 4. Database migration
npx prisma migrate dev
npx prisma db seed

# 5. Jalankan dev server
npm run dev
# http://localhost:3000
```
