# Design Document
## Personal Travel Journal — Visual & Interaction Design

---

## 1. Filosofi Visual

**"Cinematic Editorial"** — website ini bukan feed foto biasa.
Setiap halaman terasa seperti halaman majalah travel premium yang bergerak.

Tiga kata kunci desain:
- **Dark** — hitam/gelap sebagai kanvas, foto menjadi sumber cahaya utama
- **Editorial** — tipografi berpasangan serif + sans, layout asimetris, white space intentional
- **Cinematic** — setiap foto diberi ruang dan waktu untuk dinikmati sepenuhnya

### Referensi Visual
| Aspek | Referensi Site | URL |
|---|---|---|
| Layout & grid | Kononenko Architectural Bureau | kononenkogroup.com |
| Tone & dark aesthetic | Square43 Studio | square43.com |
| Parallax & depth | Bombon | bombon.rs |

---

## 2. Color Palette

```css
/* ─── Base ─── */
--color-bg:           #0A0A0A;   /* Background utama — hampir hitam */
--color-surface:      #111111;   /* Card, panel, form container */
--color-surface-2:    #1A1A1A;   /* Elevated surface, hover state */
--color-border:       #2A2A2A;   /* Border tipis, divider */
--color-border-light: #333333;   /* Border lebih terang */

/* ─── Text ─── */
--color-text-primary:   #F0EDE8; /* Teks utama — warm white (bukan pure white) */
--color-text-secondary: #888888; /* Teks sekunder, metadata, label */
--color-text-muted:     #555555; /* Disabled, placeholder */

/* ─── Accent ─── */
--color-accent:         #C8A96E; /* Warm gold — lokasi badge, highlight, link */
--color-accent-dim:     #8B7340; /* Accent redup — hover state accent */
--color-accent-subtle:  rgba(200, 169, 110, 0.12); /* Background accent subtle */

/* ─── Overlay ─── */
--overlay-card:   linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
--overlay-hero:   rgba(0, 0, 0, 0.45);
--overlay-photo:  rgba(0, 0, 0, 0.25);

/* ─── System ─── */
--color-error:    #FF4D4D;
--color-success:  #4CAF50;
--color-warning:  #F59E0B;
```

### Penggunaan Warna per Konteks
| Elemen | Warna |
|---|---|
| Background halaman | `--color-bg` |
| Card entry di feed | `--color-surface` |
| Form admin | `--color-surface` dengan border `--color-border` |
| Teks judul | `--color-text-primary` |
| Tanggal, metadata | `--color-text-secondary` |
| Lokasi badge | `--color-accent` dengan bg `--color-accent-subtle` |
| Tombol primary | `--color-accent` bg, `--color-bg` text |
| Tombol secondary | Transparent, border `--color-border-light` |
| Gradient overlay foto | `--overlay-card` |

---

## 3. Typography

### Font Families

```css
/* Display / Heading — serif editorial, untuk judul besar */
font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
/* Google Fonts: https://fonts.google.com/specimen/Cormorant+Garamond */
/* Weight yang digunakan: 400, 500, 600 */

/* Body / UI — clean modern sans-serif */
font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
/* Google Fonts: https://fonts.google.com/specimen/DM+Sans */
/* Weight yang digunakan: 300, 400, 500, 600 */

/* Monospace — untuk data, tanggal, koordinat */
font-family: 'JetBrains Mono', 'Courier New', monospace;
/* Google Fonts: https://fonts.google.com/specimen/JetBrains+Mono */
/* Weight yang digunakan: 400 */
```

### Type Scale

| Token | Font | Size | Weight | Line Height | Letter Spacing | Penggunaan |
|---|---|---|---|---|---|---|
| `display-xl` | Cormorant | 96px | 600 | 1.0 | -0.02em | Hero title di entry detail |
| `display-lg` | Cormorant | 72px | 600 | 1.05 | -0.02em | Judul entry di feed card hover |
| `display-md` | Cormorant | 48px | 500 | 1.15 | -0.01em | Section title |
| `heading-lg` | DM Sans | 32px | 600 | 1.3 | 0 | Card title, admin heading |
| `heading-md` | DM Sans | 24px | 600 | 1.35 | 0 | Sub heading |
| `heading-sm` | DM Sans | 20px | 500 | 1.4 | 0 | Form section title |
| `body-lg` | DM Sans | 18px | 400 | 1.7 | 0 | Deskripsi entry |
| `body-md` | DM Sans | 16px | 400 | 1.65 | 0 | Body teks umum |
| `body-sm` | DM Sans | 14px | 400 | 1.6 | 0 | Secondary info, label |
| `caption` | DM Sans | 15px | 400 | 1.5 | 0.01em | Caption foto (harus mudah dibaca) |
| `label` | DM Sans | 12px | 500 | 1 | 0.08em | Label form, badge text (uppercase) |
| `mono-md` | JetBrains | 14px | 400 | 1.5 | 0 | Tanggal, durasi musik |
| `mono-sm` | JetBrains | 12px | 400 | 1.4 | 0 | Koordinat, metadata teknis |

---

## 4. Spacing System

Base unit: **8px**

```
2px  → 0.25  — border width, divider
4px  → 0.5   — gap sangat kecil
8px  → 1     — xs: gap antar elemen inline
12px → 1.5   — sm: padding kecil
16px → 2     — md: padding standar, gap card
24px → 3     — lg: section padding kecil
32px → 4     — xl: gap antar section
48px → 6     — 2xl: padding section
64px → 8     — 3xl: gap besar
96px → 12    — 4xl: padding section besar
128px → 16   — 5xl: padding hero section
```

### Grid Sistem Feed

```
Container max-width: 1440px
Padding horizontal:  64px (kiri & kanan)
Grid columns:        3
Gap:                 24px
Card aspect ratio:   3:2
```

---

## 5. Component Specifications

### 5.1 Entry Card (Feed Page)

```
Ukuran:        Grid kolom (auto, aspect-ratio 3:2)
Border-radius: 6px
Overflow:      hidden
Cursor:        pointer

Struktur HTML:
  <article>                      ← card container
    <div class="media-wrapper">  ← foto/thumbnail
      <img />                    ← cover foto
      <div class="overlay" />    ← gradient overlay dari bawah
    </div>
    <div class="info">           ← info di atas foto (bottom)
      <LocationBadge />
      <h2 class="title" />       ← judul (heading-lg, Cormorant)
      <span class="date" />      ← tanggal (mono-sm)
    </div>
  </article>

State Default:
  - Overlay gradient: rgba(0,0,0,0.75) → transparent (dari bawah ke 50%)
  - Info terlihat jelas di atas overlay

State Hover (200ms ease-out):
  - transform: scale(1.015)
  - Overlay sedikit lebih terang: rgba(0,0,0,0.55)
  - Title: transform translateY(-4px)
  - Transisi semua: 200ms ease-out
```

### 5.2 Music Player Bar (Entry Detail)

```
Position:   fixed, bottom: 0, left: 0, width: 100%
Height:     68px
Background: rgba(10, 10, 10, 0.92) blur(20px) — frosted glass effect
Border-top: 1px solid rgba(255,255,255,0.06)
Padding:    0 40px
Z-index:    100

Layout (flex, align-center, gap 20px):
  [Album Art]      40×40px, border-radius 4px, object-fit cover
  [Track Info]     flex-col
    .track-name    body-sm, text-primary, max 200px truncate
    .artist-name   label, text-secondary
  [Waveform]       flex-1, center, height 32px, WaveSurfer.js
                   waveColor: #3A3A3A, progressColor: #C8A96E
  [Duration]       mono-sm, text-muted, e.g. "0:30"
  [Mute Toggle]    icon button, 36×36px

Tampilan:
  - Hanya muncul di halaman entry detail
  - Tidak tampil di feed page
  - Masuk dengan slide up (translateY(100%) → translateY(0)) saat mount
```

### 5.3 Location Badge

```
Display:       inline-flex, align-items center, gap 6px
Padding:       5px 12px
Border-radius: 999px (pill)
Background:    rgba(200, 169, 110, 0.12)
Border:        1px solid rgba(200, 169, 110, 0.3)
Color:         #C8A96E (--color-accent)
Font:          DM Sans 12px, weight 500, letter-spacing 0.05em, uppercase

Konten:
  [Pin Icon 12px] [NAMA LOKASI]

Contoh: ◉ BROMO, JAWA TIMUR
```

### 5.4 Caption Overlay (Entry Detail)

```
Position:   absolute, bottom: 80px (di atas music bar), left: 0
Width:      100%
Padding:    0 80px

Inner container:
  max-width:    560px
  background:   rgba(0, 0, 0, 0.6)
  blur:         backdrop-filter blur(8px)
  border-left:  3px solid rgba(200, 169, 110, 0.6)
  padding:      16px 20px
  border-radius: 0 6px 6px 0

Text:
  font: DM Sans 15px (caption token)
  color: rgba(240, 237, 232, 0.9)
  line-height: 1.6

Animasi:
  Mount:   opacity 0 + translateY(12px) → opacity 1 + translateY(0), 500ms ease-out
  Unmount: opacity 1 → opacity 0, 250ms
```

### 5.5 Scroll Progress Indicator

```
Position:  fixed, top: 0, left: 0, width: 100%
Height:    2px
Background: transparent
Z-index:   200

Inner bar:
  height:     2px
  background: linear-gradient(to right, #C8A96E, #E8C98E)
  width:      berubah sesuai scroll progress (0% → 100%)
  transition: none (update real-time via JS)

Hanya tampil di halaman entry detail.
```

### 5.6 Admin Form Layout

```
Max-width:      820px
Margin:         0 auto
Padding:        48px 40px

Section card:
  background:    #111111
  border:        1px solid #2A2A2A
  border-radius: 8px
  padding:       32px
  margin-bottom: 24px

Form input style:
  background:    #1A1A1A
  border:        1px solid #2A2A2A
  border-radius: 6px
  color:         #F0EDE8
  padding:       10px 14px
  font:          DM Sans 15px
  
  Focus:
    border-color: #C8A96E
    outline:      none
    box-shadow:   0 0 0 2px rgba(200,169,110,0.15)
```

### 5.7 Media Upload Item (Admin)

```
Container:
  aspect-ratio:  1:1
  background:    #1A1A1A
  border:        1px dashed #2A2A2A
  border-radius: 6px
  overflow:      hidden
  position:      relative
  cursor:        grab

Thumbnail:
  width: 100%, height: 100%
  object-fit: cover

Overlay (muncul saat hover):
  background: rgba(0,0,0,0.5)
  
Controls di atas thumbnail:
  [Drag handle]   top-left, 28×28px, gripper icon
  [Delete btn]    top-right, 28×28px, X icon, background merah saat hover
  [Order badge]   bottom-left, circle 20px, nomor urut

Caption input:
  di bawah thumbnail
  width: 100%
  placeholder: "Tambahkan caption..."
  style: input standar form
```

---

## 6. Page Layouts

### 6.1 Feed Page (`/`)

```
┌──────────────────────────────────────────────────────┐
│ NAVBAR (sticky, 64px)                                │
│ [Logo / Nama]                        [Admin link?]   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  FEED GRID (padding 64px kiri-kanan)                 │
│  ┌────────┐  ┌────────┐  ┌────────┐                  │
│  │ Card 1 │  │ Card 2 │  │ Card 3 │                  │
│  │        │  │        │  │        │                  │
│  │ 3:2    │  │ 3:2    │  │ 3:2    │                  │
│  └────────┘  └────────┘  └────────┘                  │
│  ┌────────┐  ┌────────┐  ┌────────┐                  │
│  │ Card 4 │  │ Card 5 │  │ Card 6 │                  │
│  └────────┘  └────────┘  └────────┘                  │
│                                                      │
│  [Load More / auto infinite scroll]                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 6.2 Entry Detail (`/entry/[slug]`)

```
┌──────────────────────────────────────────────────────┐
│  SECTION 1 — HERO (100vh)                            │
│  Background: cover foto + overlay gelap              │
│  ┌────────────────────────────────────────────────┐  │
│  │              (center content)                   │  │
│  │  [Location Badge]                               │  │
│  │                                                 │  │
│  │  Judul Entry                                    │  │
│  │  (display-xl, Cormorant, white)                 │  │
│  │                                                 │  │
│  │  [Tanggal - mono font]                          │  │
│  │                                                 │  │
│  │  ↓ (scroll indicator, bounce animation)         │  │
│  └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  SECTION 2 — FOTO 1 (100vh)                          │
│  Full-bleed foto + parallax                          │
│  ┌────────────────────────────────────────────────┐  │
│  │                                                 │  │
│  │          [FOTO FULL SCREEN]                     │  │
│  │          (object-fit: cover)                    │  │
│  │          (parallax: bergerak -80px saat scroll) │  │
│  │                                                 │  │
│  │  ┌─────────────────────────────────────────┐   │  │
│  │  │ Caption Foto 1 (fade in di viewport)    │   │  │
│  │  └─────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  SECTION 3 — FOTO 2 (100vh)                          │
│  ... (repeat untuk setiap media)                     │
├──────────────────────────────────────────────────────┤
│  SECTION N+1 — FOOTER ENTRY                          │
│  padding: 96px 128px                                 │
│  ┌────────────────────────────────────────────────┐  │
│  │  [Google Maps Static Embed — 400×250px]         │  │
│  │  Nama Lokasi Lengkap                            │  │
│  │  Tanggal                                        │  │
│  │  ← Kembali ke semua cerita                      │  │
│  └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  MUSIC PLAYER BAR (fixed bottom, 68px)               │
│  [Art][Nama Lagu / Artis][~Waveform~][0:30][Mute]   │
└──────────────────────────────────────────────────────┘

Scroll Progress Bar: fixed top, 2px, gold gradient
```

### 6.3 Admin Dashboard (`/admin`)

```
┌──────────────┬─────────────────────────────────────────┐
│ SIDEBAR      │ MAIN CONTENT                            │
│ 240px fixed  │                                         │
│              │  Header: "Semua Entry"  [+ Buat Baru]  │
│ [Logo]       │  Filter: [Semua] [Published] [Draft]   │
│              │  ─────────────────────────────────────  │
│ ─ Entries    │  Entry List / Table:                    │
│ ─ New Entry  │  [Thumb][Judul][Status][Tanggal][Aksi] │
│              │  ...                                     │
│ ─────────    │                                         │
│ [Logout]     │                                         │
└──────────────┴─────────────────────────────────────────┘
```

### 6.4 Admin Form Entry

```
┌──────────────┬─────────────────────────────────────────┐
│ SIDEBAR      │ FORM (max-width 820px, centered)        │
│              │                                         │
│              │  ┌─────────────────────────────────┐   │
│              │  │ INFORMASI DASAR                  │   │
│              │  │ Judul:       [_______________]   │   │
│              │  │ Tanggal:     [_______________]   │   │
│              │  │ Status:      [Draft ○ Published] │   │
│              │  │ Deskripsi:   [rich text editor]  │   │
│              │  └─────────────────────────────────┘   │
│              │                                         │
│              │  ┌─────────────────────────────────┐   │
│              │  │ MEDIA (maks 5)                   │   │
│              │  │ [+] [Foto1] [Foto2] [Foto3]      │   │
│              │  │ Caption: [___] Caption: [___]    │   │
│              │  └─────────────────────────────────┘   │
│              │                                         │
│              │  ┌─────────────────────────────────┐   │
│              │  │ MUSIK                            │   │
│              │  │ [iTunes Search] [Upload File]    │   │
│              │  │ [Album Art] Nama Lagu — Artis    │   │
│              │  └─────────────────────────────────┘   │
│              │                                         │
│              │  ┌─────────────────────────────────┐   │
│              │  │ LOKASI                           │   │
│              │  │ [Autocomplete Input Google Maps] │   │
│              │  │ [Mini Map Preview]               │   │
│              │  └─────────────────────────────────┘   │
│              │                                         │
│              │  [Simpan Draft]    [Publish & Simpan]  │
└──────────────┴─────────────────────────────────────────┘
```

---

## 7. Animation Specifications

### 7.1 Page Transition (Framer Motion)

```
Exit (halaman lama):
  overlay hitam masuk dari kanan
  x: "100%" → "0%", duration: 0.4s, ease: [0.25, 0.46, 0.45, 0.94]

Enter (halaman baru):
  overlay slide keluar ke kiri
  x: "0%" → "-100%", duration: 0.4s, delay: 0.1s
  konten halaman baru: opacity 0 → 1, duration: 0.3s, delay: 0.3s
```

### 7.2 Feed Cards Scroll Reveal (GSAP ScrollTrigger)

```javascript
gsap.from(cards, {
  y: 60,
  opacity: 0,
  duration: 0.75,
  ease: "power2.out",
  stagger: 0.12,
  scrollTrigger: {
    trigger: gridContainer,
    start: "top 85%",
    toggleActions: "play none none reverse"
  }
})
```

### 7.3 Hero Title Reveal (GSAP SplitText)

```javascript
const split = new SplitText(titleEl, { type: "words,chars" })
gsap.from(split.chars, {
  y: 100,
  opacity: 0,
  rotationX: -90,
  duration: 0.8,
  ease: "power3.out",
  stagger: 0.02,
  delay: 0.4
})
```

### 7.4 Photo Parallax (GSAP ScrollTrigger Scrub)

```javascript
gsap.to(photoImg, {
  y: -80,
  ease: "none",
  scrollTrigger: {
    trigger: photoSection,
    start: "top bottom",
    end: "bottom top",
    scrub: 1.5  // smooth lag untuk feel sinematik
  }
})
```

### 7.5 Caption Reveal per Foto

```javascript
ScrollTrigger.create({
  trigger: photoSection,
  start: "top center",
  end: "bottom center",
  onEnter: () => gsap.to(caption, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out"
  }),
  onLeave: () => gsap.to(caption, { opacity: 0, duration: 0.3 }),
  onEnterBack: () => gsap.to(caption, { opacity: 1, y: 0, duration: 0.4 }),
  onLeaveBack: () => gsap.to(caption, { opacity: 0, duration: 0.3 })
})
// Initial state: opacity: 0, y: 16px
```

### 7.6 Music Player Slide Up (Mount)

```javascript
gsap.from(musicBar, {
  y: 80,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out",
  delay: 0.8  // tunggu setelah page load
})
```

### 7.7 Music Fade (Howler.js)

```javascript
// Fade in (masuk halaman)
sound.fade(0, 0.75, 500)

// Fade out (video masuk / keluar halaman)
sound.fade(currentVolume, 0, 300)

// Fade in kembali (setelah video selesai)
sound.fade(0, 0.75, 600)
```

### 7.8 Scroll Progress Bar

```javascript
// Update real-time, no transition
const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight)
progressBar.style.width = `${progress * 100}%`
```

### 7.9 Hover States

```css
/* Card entry */
.entry-card { transition: transform 200ms ease-out; }
.entry-card:hover { transform: scale(1.015); }

/* Tombol */
.btn { transition: background-color 150ms ease, opacity 150ms ease; }
.btn:hover { opacity: 0.85; }

/* Link */
a { transition: color 150ms ease; }
```

### 7.10 Scroll Indicator (Hero)

```javascript
// Bounce animation — scroll indicator panah di hero
gsap.to(scrollArrow, {
  y: 8,
  repeat: -1,
  yoyo: true,
  duration: 0.8,
  ease: "power1.inOut"
})
// Fade out saat user mulai scroll
ScrollTrigger.create({
  trigger: document.body,
  start: "top top",
  end: "100px top",
  onEnter: () => gsap.to(scrollArrow, { opacity: 0, duration: 0.3 })
})
```

---

## 8. Iconography

Gunakan **Lucide Icons** (React) — konsisten, minimal, open source.

```
Pin / lokasi:    MapPin
Musik play:      Play, Pause
Musik mute:      Volume2, VolumeX
Scroll down:     ChevronDown, ArrowDown
Back:            ArrowLeft
Edit:            Pencil
Delete:          Trash2
Upload:          Upload, ImagePlus
Drag:            GripVertical
Close:           X
Check:           Check
Calendar:        Calendar
```

---

## 9. Responsive Breakpoints (Catatan Phase 3)

Desktop-first. Breakpoint ini untuk referensi Phase 3:

```
Default (desktop):  1280px+   — 3 kolom feed
lg:                 1024px    — 3 kolom (lebih compact)
md:                 768px     — 2 kolom feed (Phase 3)
sm:                 640px     — 1 kolom feed (Phase 3)
```

---

## 10. Loading States

### Skeleton Screen (Feed)
```
Card skeleton:
  background: #1A1A1A
  shimmer animation: linear-gradient sweep kiri ke kanan
  animation: 1.5s infinite
```

### Upload Progress
```
Per file:
  Progress bar tipis di bawah thumbnail
  Color: #C8A96E
  Width: 0% → 100% sesuai upload progress
  Label: "Uploading... 45%"
```

### Page Loading
```
Preloader minimal:
  Full screen #0A0A0A
  Logo atau titik loading kecil di center
  Fade out saat konten siap
```
