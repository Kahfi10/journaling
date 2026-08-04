# Product Requirements Document
## Personal Travel Journal — "Journaling"

---

## 1. Product Overview

Website journaling personal yang berfungsi sebagai arsip perjalanan dan momen pribadi.
Dirancang dengan estetika sinematik dan editorial, menggabungkan foto, video, musik,
dan lokasi menjadi satu pengalaman scroll yang imersif.

Bukan blog. Bukan media sosial. Ini adalah **digital memoir** — hanya satu pemilik,
satu sudut pandang, dibangun untuk dinikmati, bukan dikonsumsi.

---

## 2. Pengguna

### 2.1 Admin (Pemilik Website)
- Satu user tunggal — tidak ada registrasi publik
- Akses penuh: create, read, update, delete semua konten
- Login via email + password (NextAuth.js Credentials)

### 2.2 Visitor (Publik)
- Siapapun yang membuka URL website
- Hanya bisa membaca/melihat konten yang sudah dipublish
- Tidak ada akun, tidak ada interaksi (no comments, no likes, no share)

---

## 3. Problem Statement

Platform yang ada (Instagram, Google Photos, travel blog) tidak cukup untuk
menangkap pengalaman perjalanan secara mendalam dan personal.

- **Instagram** — terlalu cepat, terlalu sosial, hilang di feed
- **Travel blog** — terlalu teks-heavy, tidak visual-first
- **Google Photos** — tidak ada cerita, tidak ada konteks emosional

Website ini dibuat untuk:
- Mendokumentasikan perjalanan dengan konteks yang kaya (lokasi, musik, cerita)
- Memberikan pengalaman membaca yang sinematik dan immersive
- Menjadi arsip pribadi yang indah, bukan sekadar backup foto

---

## 4. Features

### 4.1 Public — Feed Page (`/`)
- Grid editorial layout foto-foto cover entry
- Scroll reveal animation per card (GSAP ScrollTrigger + stagger)
- Informasi per card: cover photo, judul, lokasi, tanggal
- Load more / infinite scroll
- Hanya menampilkan entry berstatus `published`

### 4.2 Public — Entry Detail Page (`/entry/[slug]`)
- **Hero section**: judul entry + lokasi badge + tanggal
- Musik mulai play otomatis saat halaman dimuat (fade in 500ms)
- Setiap media (foto/video) ditampilkan **full-screen (100vh)**
- Scroll murni vertikal — tidak ada tombol navigasi, skip, atau dot indicator
- Pengalaman linear seperti membaca cerita
- **Foto**: parallax scrub effect, caption muncul di bawah saat foto di viewport center
- **Video**: musik fade out otomatis → video play dengan audio-nya sendiri →
  setelah video selesai/keluar viewport, musik fade in kembali
- Footer entry: preview peta lokasi kecil (Google Maps static embed), tanggal lengkap, link kembali ke feed
- Maksimal 5 media per entry

### 4.3 Admin — Authentication (`/login`)
- Form email + password
- Session JWT cookie (expires 7 hari)
- Redirect ke dashboard setelah login berhasil
- Semua route `/admin/*` dilindungi `middleware.ts`
- Redirect ke `/login` jika tidak ada session valid

### 4.4 Admin — Dashboard (`/admin`)
- Daftar semua entry (published + draft)
- Filter tabs: Semua / Published / Draft
- Sorting: terbaru (default), terlama
- Action per entry: Edit, Delete, Toggle publish/unpublish
- Preview cover thumbnail per entry
- Badge jumlah media per entry
- Tombol "Buat Entry Baru" di header

### 4.5 Admin — Create/Edit Entry (`/admin/entries/new` | `/admin/entries/[id]/edit`)

**Informasi Dasar:**
- Judul (required, max 200 karakter)
- Deskripsi / cerita panjang (rich text HTML, optional)
- Tanggal diambil (date picker, required)
- Status: Draft / Published (toggle)

**Media Upload:**
- Drag & drop atau file picker (klik)
- Format yang diterima: JPEG, HEIC, PNG (foto) | MP4, MOV (video)
- Maksimal 5 file per entry
- Maksimal 20 MB per foto, 500 MB per video
- Preview thumbnail setelah upload berhasil
- Drag untuk reorder urutan tampil
- Caption per media (text input di bawah setiap thumbnail, max 500 karakter)
- Delete per media (dengan konfirmasi)
- Progress upload indicator

**Musik:**
- **Mode 1 — iTunes Search**: ketik nama lagu/artis → hasil dari iTunes Search API →
  pilih lagu → otomatis dapat preview URL 30 detik + album art + metadata
- **Mode 2 — Upload File**: upload MP3/M4A → pilih start time (slider) + durasi (15/30/60 detik)
- Tampilkan: album art, nama lagu, nama artis setelah dipilih/upload
- Bisa hapus pilihan musik

**Lokasi:**
- Google Maps Autocomplete input (ketik nama tempat)
- Tampilkan pin di mini-map setelah dipilih
- Simpan: display name, place_id, lat, lng

---

## 5. User Stories

### Visitor
| # | Story | Acceptance Criteria |
|---|---|---|
| V1 | Sebagai visitor, saya ingin melihat semua entry di halaman utama | Feed menampilkan grid card dengan cover foto, judul, lokasi, tanggal |
| V2 | Sebagai visitor, saya ingin mengklik entry untuk melihat detail | Halaman detail terbuka dengan page transition |
| V3 | Sebagai visitor, saya ingin scroll melalui foto-foto entry | Setiap foto tampil full-screen saat di-scroll, parallax aktif |
| V4 | Sebagai visitor, saya ingin mendengar musik saat membuka entry | Musik mulai otomatis (fade in) saat halaman detail dimuat |
| V5 | Sebagai visitor, saya ingin video tidak rebutan audio dengan musik | Musik pause saat video masuk viewport, resume setelah video selesai |
| V6 | Sebagai visitor, saya ingin tahu di mana foto diambil | Lokasi badge tampil di hero + mini map di footer entry |

### Admin
| # | Story | Acceptance Criteria |
|---|---|---|
| A1 | Sebagai admin, saya ingin login dengan aman | Form login dengan email+password, session tersimpan 7 hari |
| A2 | Sebagai admin, saya ingin membuat entry baru | Form lengkap: judul, deskripsi, tanggal, media, musik, lokasi |
| A3 | Sebagai admin, saya ingin upload hingga 5 foto/video | Drag & drop, preview thumbnail, validasi format & ukuran |
| A4 | Sebagai admin, saya ingin menambah caption per foto | Input teks di bawah setiap thumbnail, max 500 karakter |
| A5 | Sebagai admin, saya ingin mencari lagu dari iTunes | Search box, hasil daftar lagu, klik untuk pilih |
| A6 | Sebagai admin, saya ingin upload musik sendiri | File picker MP3/M4A, pilih start time dan durasi |
| A7 | Sebagai admin, saya ingin memilih lokasi dengan Google Maps | Autocomplete input, mini-map preview |
| A8 | Sebagai admin, saya ingin simpan sebagai draft | Toggle status Draft/Published di form |
| A9 | Sebagai admin, saya ingin mengedit entry yang sudah ada | Form edit terisi data yang sudah ada |
| A10 | Sebagai admin, saya ingin menghapus entry | Konfirmasi dialog, hapus beserta semua media di Cloudinary |
| A11 | Sebagai admin, saya ingin mengubah urutan foto | Drag & drop reorder di form upload |

---

## 6. Non-Functional Requirements

| Requirement | Target |
|---|---|
| First Contentful Paint (feed) | < 1.5 detik |
| Feed page load (6 cards pertama) | < 2 detik |
| Entry detail page load | < 2 detik |
| Foto format yang diterima | JPEG, HEIC, PNG |
| Video format yang diterima | MP4, MOV |
| Max ukuran file foto | 20 MB |
| Max ukuran file video | 500 MB |
| Max media per entry | 5 |
| Browser support | Chrome, Safari, Firefox (latest 2 versi) |
| Platform target | Desktop-first (min. 1280px width) |
| Deployment | Oracle Cloud ARM VM (free tier) |
| Media storage | Cloudinary free tier (25 GB storage, 25 GB bandwidth) |
| Database | PostgreSQL 16 (self-hosted di Oracle Cloud) |
| Uptime target | Best effort (personal project) |

---

## 7. Out of Scope (Phase 1)

- Mobile responsive design
- Komentar atau likes dari visitor
- Registrasi user publik
- Sharing ke media sosial
- Pencarian / filter di feed publik
- Map view global (semua lokasi di peta dunia)
- Cinematic mode / slideshow otomatis
- "On This Day" feature
- Apple Music API full playback (Phase 2)
- Video recording langsung dari browser
- Notifikasi
- Analytics / statistik pengunjung

---

## 8. Fase Pengembangan

### Phase 1 — MVP (Current)
Auth admin, CRUD entry lengkap, feed publik dengan GSAP animations,
entry detail dengan full-screen scroll, self-upload musik, lokasi text input,
deploy ke Oracle Cloud dengan Docker.

### Phase 2 — Enhanced
iTunes API integration, Google Maps location picker interaktif,
map view publik (semua pin di peta dunia), rich text editor (Tiptap),
video support dengan streaming HLS.

### Phase 3 — Polish
Mobile responsive, filter/search feed, cinematic mode (slideshow otomatis),
"On This Day" feature, advanced parallax depth, custom cursor,
Framer Motion page transitions, year-in-review page.
