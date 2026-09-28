# BUKU ISPARMO — Website Katalog Buku Pribadi

Website katalog buku pribadi resmi untuk **Isparmo** (dapat diakses di [https://buku.isparmo.com](https://buku.isparmo.com)).
Website ini menampilkan koleksi buku dan ebook karya Isparmo yang dipublikasikan secara resmi melalui **Google Play Books**, dengan arsitektur yang siap mendukung tautan alternatif (misalnya Lynk.id).

---

## 1. Filosofi & Konsep Desain

- **Gaya**: Personal publishing catalog, profesional, modern, bersih, elegan, dan credible.
- **Warna Identitas**:
  - Primary: `#111111`
  - Background: `#FAFAF7`
  - Accent: `#F97316` (Oranye elegan)
  - Text: `#171717`
  - Secondary Text / Muted: `#666666`
  - Border: `#E5E5E5`
  - Surface: `#FFFFFF`
- **Fokus Visual**: Memprioritaskan kenyamanan membaca dan rasio visual cover buku asli (2:3).

---

## 2. Arsitektur Teknologi

Dibuat murni menggunakan standar web modern tanpa ketergantungan library/framework eksternal:
- **HTML5**: Semantik penuh (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, mobile-first design system.
- **Vanilla JavaScript (ES6+)**:
  - Real-time instant search (mencari judul, subjudul, penulis, kategori, tags, dan resume).
  - Filter kategori dinamis (dibaca otomatis dari data buku).
  - Sorting real-time (Terbaru, Terlama, A-Z, Z-A).
  - Dynamic detail page via `URLSearchParams` (`book.html?id=...`).
  - Dynamic Schema.org JSON-LD structured data (`@type: Book`).
  - Validasi integritas data buku otomatis.

Tidak menggunakan React, Next.js, Vue, Tailwind, Bootstrap, jQuery, atau backend database.

---

## 3. Struktur Direktori

```text
/
├── index.html              # Halaman beranda (Hero, Featured Book, Katalog, Filter, Profil)
├── book.html               # Template dinamis untuk seluruh halaman detail buku
├── css/
│   └── style.css           # Desain sistem & styling lengkap (responsif & aksesibel)
├── js/
│   ├── books.js            # Single source of truth seluruh data buku & validasi
│   └── app.js              # Logika interaktif: pencarian, filter, sort, router detail
├── images/
│   └── covers/             # Cover buku resmi (format .webp) & placeholder
│       ├── guru-cyborg.webp
│       ├── prompt-engineering.webp
│       ├── website-profesional-ai.webp
│       ├── seni-menemukan-tenang.webp
│       ├── sepenggal-hikmah.webp
│       ├── resep-bahagia.webp
│       └── PLACEHOLDER.jpg
└── README.md
```

---

## 4. Cara Menambah Buku Baru (Future Editability)

Website ini dirancang secara *future-proof*. Untuk menambahkan buku ke-7 atau seterusnya di masa depan:

1. Buka file `js/books.js`.
2. Tambahkan object buku baru ke dalam array `books`:

```javascript
{
  id: "judul-buku-slug",
  googlePlayId: "ID_GOOGLE_PLAY",
  googlePlayUrl: "https://play.google.com/store/books/details?id=ID_GOOGLE_PLAY",
  lynkUrl: "", // Isi jika tersedia, kosongkan jika belum ada
  title: "Judul Buku Baru",
  subtitle: "Subjudul (opsional atau null)",
  author: "Isparmo",
  pages: 120,
  year: 2026,
  publication: "Bulan 2026",
  category: "AI & Teknologi",
  publisher: "KAIS (Komunitas AI untuk Semua)",
  cover: "images/covers/nama-cover.webp",
  featured: false,
  priceType: "paid", // "paid", "free", atau "check_availability"
  status: "AVAILABLE", // "AVAILABLE", "FREE", atau "CHECK_AVAILABILITY"
  resume: "Ringkasan lengkap mengenai buku ini...",
  tags: ["Topik 1", "Topik 2"],
  audience: ["Target 1", "Target 2"]
}
```

3. Simpan cover buku di folder `images/covers/nama-cover.webp`.

**Selesai!** Buku baru akan otomatis:
- Muncul di halaman beranda.
- Terkategori dalam filter kategori (jika ada kategori baru, tombol filter otomatis dibuat).
- Dapat dicari via search box.
- Dapat diurutkan via dropdown sort.
- Memiliki halaman detail di `book.html?id=judul-buku-slug`.

Tidak perlu mengubah `index.html`, `book.html`, `app.js`, atau `style.css`.

---

## 5. Pengelolaan Cover Buku & Fallback

Semua 6 buku telah memiliki cover resmi beresolusi tinggi yang diambil langsung dari Google Play Books.
Jika Anda menambahkan buku baru tetapi belum memiliki cover, gunakan:
```javascript
cover: "images/covers/PLACEHOLDER.jpg"
```
Gambar fallback `PLACEHOLDER.jpg` tersedia di direktori `images/covers/` dan tag `<img>` pada sistem telah dilengkapi listener `onerror` untuk mencegah broken image jika gambar tidak ditemukan.

---

## 6. Logika Tombol Pembelian & Tautan Eksternal

- **Google Play Books**:
  - Jika buku berstatus gratis: Menampilkan **"Gratis di Google Play"**.
  - Jika buku memerlukan pengecekan wilayah (*Sepenggal Hikmah*): Menampilkan **"Google Play"**.
  - Jika buku berbayar: Menampilkan **"Beli / Baca di Google Play"**.
- **Lynk.id**:
  - Tombol **"Beli via Lynk.id"** hanya muncul jika `lynkUrl` terisi (tidak kosong).
  - Jika `lynkUrl: ""`, tombol tidak akan pernah ditampilkan (tidak ada tombol kosong).

---

## 7. Panduan Deployment

Website ini 100% statis dan dapat langsung dihosting di berbagai penyedia layanan:

### GitHub Pages
1. Push repository ke GitHub.
2. Buka **Settings** > **Pages**.
3. Pilih branch `main` (atau `gh-pages`) dan root `/` sebagai source.
4. Pada bagian **Custom Domain**, masukkan `buku.isparmo.com`.
5. Aktifkan **Enforce HTTPS**.

### Vercel
1. Import repository ke Vercel.
2. Framework Preset: pilih **Other**.
3. Output Directory: `./`.
4. Deploy, lalu tambahkan custom domain `buku.isparmo.com` di Domain Settings.

### Hosting Statis / cPanel / Shared Hosting
1. Upload seluruh file (`index.html`, `book.html`, `css/`, `js/`, `images/`) ke folder `public_html` atau root domain `buku.isparmo.com`.

---

## 8. Hak Cipta & Informasi Penulis

- **Penulis**: Isparmo
- **Hak Cipta**: © 2026 Isparmo. All rights reserved.
- **Domain Resmi**: [https://buku.isparmo.com](https://buku.isparmo.com)
