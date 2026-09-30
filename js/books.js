/**
 * BUKU ISPARMO - Data Katalog Buku
 * https://buku.isparmo.com
 *
 * File ini adalah sumber data tunggal untuk seluruh buku karya Isparmo.
 * Menambah buku baru di masa depan cukup dengan menambahkan object ke dalam array `books`.
 */

const books = [
  {
    id: "generasi-tanpa-arah",
    googlePlayId: "7VQUEgAAQBAJ",
    googlePlayUrl: "https://play.google.com/store/books/details?id=7VQUEgAAQBAJ",
    lynkUrl: "",
    title: "Generasi Tanpa Arah",
    subtitle: "Panduan Keluarga Menghadapi Perubahan Zaman dalam Pernikahan, Agama, dan Pendidikan Karakter Anak",
    author: "Isparmo",
    pages: 120,
    year: 2026,
    publication: "September 2026",
    category: "Pengembangan Diri",
    publisher: "Isparmo",
    cover: "images/covers/generasi-tanpa-arah.webp",
    featured: false,
    priceType: "free",
    status: "FREE",
    resume: "Banyak orang tua dan guru hari ini merasa bingung menghadapi anak-anak dan remaja: mudah cemas, kecanduan layar ponsel, malas bergaul, dan seolah kehilangan tujuan hidup. Namun, menyalahkan mereka bukanlah solusi. Buku ini hadir untuk mengajak kita melihat akar masalah yang sebenarnya: perubahan zaman yang serba cepat, tekanan ekonomi keluarga, dan kurangnya rasa aman serta arah dalam tumbuh kembang mereka. Lewat bahasa yang hangat dan mudah dipraktikkan, buku ini memberikan panduan nyata bagi orang tua, guru, calon pengantin, hingga pengurus lingkungan/masjid dalam merangkul generasi muda menuju masa depan penuh harapan.",
    tags: [
      "Parenting",
      "Keluarga",
      "Pendidikan Karakter",
      "Generasi Muda",
      "Pengembangan Diri"
    ],
    audience: [
      "Orang Tua & Pendidik",
      "Calon Pengantin & Pemuda",
      "Pengurus Masjid & Komunitas"
    ]
  },
  {
    id: "guru-cyborg",
    googlePlayId: "Bgr4EQAAQBAJ",
    googlePlayUrl: "https://play.google.com/store/books/details?id=Bgr4EQAAQBAJ",
    lynkUrl: "",
    title: "GURU CYBORG: Menguasai AI untuk Mendidik Manusia Seutuhnya",
    subtitle: "Buku Panduan AI untuk Para Guru Sekolah",
    author: "Isparmo",
    pages: 183,
    year: 2026,
    publication: "Juli 2026",
    category: "AI & Teknologi",
    publisher: "KAIS (Komunitas AI untuk Semua)",
    cover: "images/covers/guru-cyborg.webp",
    featured: true,
    priceType: "paid",
    status: "AVAILABLE",
    resume: "Guru Cyborg adalah panduan praktis bagi guru untuk memahami dan menggunakan AI dalam kegiatan pendidikan. Buku membahas Generative AI dan Large Language Model dengan bahasa sederhana, formula CRAFT, lebih dari 40 prompt untuk kebutuhan pembelajaran, RPP, modul ajar, bahan bacaan, slide, soal ujian, feedback siswa, proyek kreatif, administrasi, hingga pemanfaatan Gemini Notebook. Buku juga membahas etika, plagiarisme, privasi data siswa, dan konsep pendidik cyborg yang tetap humanis.",
    tags: [
      "AI",
      "Pendidikan",
      "Guru",
      "Gemini",
      "ChatGPT",
      "Claude",
      "Prompt Engineering",
      "Generative AI",
      "Gemini Notebook"
    ],
    audience: [
      "Guru PAUD/TK",
      "Guru SD/MI",
      "Guru SMP/MTs",
      "Guru SMA/MA",
      "Guru Madrasah",
      "Kepala Sekolah",
      "Koordinator Kurikulum",
      "Pendidik"
    ]
  },
  {
    id: "prompt-engineering",
    googlePlayId: "ga8NEgAAQBAJ",
    googlePlayUrl: "https://play.google.com/store/books/details?id=ga8NEgAAQBAJ",
    lynkUrl: "",
    title: "Panduan Lengkap Prompt Engineering: Revolusi Cara Kita Bicara kepada AI",
    subtitle: null,
    author: "Isparmo",
    pages: 158,
    year: 2026,
    publication: "2026",
    category: "AI & Teknologi",
    publisher: "KAIS (Komunitas AI untuk Semua)",
    cover: "images/covers/prompt-engineering.webp",
    featured: false,
    priceType: "paid",
    status: "AVAILABLE",
    resume: "Buku ini membahas bagaimana mengubah cara berkomunikasi dengan AI melalui prompt engineering yang terstruktur. Materinya mencakup framework CRAFT, Context Engineering, delapan lapisan konteks, teknik prompt gambar dan video, Vibe Coding, hingga Agentic AI. Buku ini juga dilengkapi studi kasus, template siap pakai, dan kuis evaluasi.",
    tags: [
      "AI",
      "Prompt Engineering",
      "Context Engineering",
      "Vibe Coding",
      "Agentic AI",
      "Produktivitas"
    ],
    audience: [
      "Pemula AI",
      "Profesional",
      "UMKM",
      "Content Creator",
      "Pelaku Bisnis",
      "Pengguna ChatGPT",
      "Pengguna Gemini"
    ]
  },
  {
    id: "website-profesional-ai",
    googlePlayId: "NSkOEgAAQBAJ",
    googlePlayUrl: "https://play.google.com/store/books/details?id=NSkOEgAAQBAJ",
    lynkUrl: "",
    title: "Panduan Cepat & Mudah Membuat Website Profesional dengan AI: Modal Ketik Prompt - Tanpa Coding, Tanpa Ribet",
    subtitle: null,
    author: "Isparmo",
    pages: 69,
    year: 2026,
    publication: "2026",
    category: "AI & Teknologi",
    publisher: "KAIS (Komunitas AI untuk Semua)",
    cover: "images/covers/website-profesional-ai.webp",
    featured: false,
    priceType: "paid",
    status: "AVAILABLE",
    resume: "Ebook ini ditujukan bagi pemula non-IT yang ingin membuat website profesional dengan bantuan AI tanpa harus menguasai coding secara mendalam. Buku membahas proses dari menyiapkan konten dan aset visual, menggunakan Gemini Canvas untuk menghasilkan HTML/CSS/JS, mengoptimalkan gambar, hingga melakukan deployment website secara gratis. Dilengkapi 21 contoh prompt untuk berbagai kebutuhan website.",
    tags: [
      "AI",
      "Website",
      "HTML",
      "CSS",
      "JavaScript",
      "No-Code",
      "Vibe Coding",
      "Gemini Canvas"
    ],
    audience: [
      "Pemula non-IT",
      "UMKM",
      "Mahasiswa",
      "Guru",
      "Profesional",
      "Freelancer",
      "Pengurus Yayasan",
      "Pengurus Masjid"
    ]
  },
  {
    id: "seni-menemukan-tenang",
    googlePlayId: "GAX-EQAAQBAJ",
    googlePlayUrl: "https://play.google.com/store/books/details?id=GAX-EQAAQBAJ",
    lynkUrl: "",
    title: "Seni Menemukan Tenang di Tengah Badai: Rahasia Menghadapi Ujian Hidup Tanpa Kehilangan Diri",
    subtitle: null,
    author: "Isparmo",
    pages: 86,
    year: 2026,
    publication: "Juli 2026",
    category: "Spiritualitas",
    publisher: null,
    cover: "images/covers/seni-menemukan-tenang.webp",
    featured: false,
    priceType: "free",
    status: "FREE",
    resume: "Buku ini mengajak pembaca menemukan ketenangan batin ketika menghadapi berbagai ujian kehidupan. Buku memadukan refleksi spiritual Islam dengan pembahasan tentang ketenangan, ketahanan diri, muhasabah, kisah ketabahan, serta latihan praktis seperti jurnal syukur, jurnal doa, dan tracker evaluasi ketenangan.",
    tags: [
      "Spiritualitas",
      "Islam",
      "Ketenangan",
      "Muhasabah",
      "Refleksi",
      "Pengembangan Diri"
    ],
    audience: [
      "Pembaca yang menghadapi ujian hidup",
      "Pencari ketenangan batin",
      "Pembaca buku spiritual",
      "Muslim"
    ]
  },
  {
    id: "resep-bahagia",
    googlePlayId: "VP8JEgAAQBAJ",
    googlePlayUrl: "https://play.google.com/store/books/details?id=VP8JEgAAQBAJ",
    lynkUrl: "",
    title: "Resep Bahagia Orang Biasa: Ketika Riset Harvard Bertemu Hikmah Al-Ghazali",
    subtitle: null,
    author: "Isparmo",
    pages: 62,
    year: 2026,
    publication: "2026",
    category: "Pengembangan Diri",
    publisher: null,
    cover: "images/covers/resep-bahagia.webp",
    featured: false,
    priceType: "free",
    status: "FREE",
    resume: "Buku ini mempertemukan perspektif Harvard Study of Adult Development dengan hikmah Imam Al-Ghazali tentang kehidupan yang baik. Buku membahas pentingnya hubungan yang hangat, keluarga, persahabatan, perhatian, pengelolaan emosi, serta penataan kehidupan batin. Dilengkapi lembar kerja praktis agar pembaca dapat menerapkan gagasannya dalam kehidupan sehari-hari.",
    tags: [
      "Kebahagiaan",
      "Harvard",
      "Al-Ghazali",
      "Pengembangan Diri",
      "Relasi",
      "Kehidupan"
    ],
    audience: []
  },
  {
    id: "sepenggal-hikmah",
    googlePlayId: "zMGHDwAAQBAJ",
    googlePlayUrl: "https://play.google.com/store/books/details?id=zMGHDwAAQBAJ",
    lynkUrl: "",
    title: "Sepenggal Hikmah: Kumpulan Catatan Ringan Fenomena Keseharian",
    subtitle: null,
    author: "Isparmo",
    pages: 43,
    year: 2012,
    publication: "Januari 2012",
    category: "Refleksi Kehidupan",
    publisher: "PNBB (Proyek Nulis Buku Bareng)",
    cover: "images/covers/sepenggal-hikmah.webp",
    featured: false,
    priceType: "check_availability",
    status: "CHECK_AVAILABILITY",
    resume: "Sepenggal Hikmah merupakan kumpulan catatan ringan mengenai berbagai fenomena keseharian, isu, berita, ide, dan pemikiran yang pernah ditulis oleh Isparmo. Setiap peristiwa tidak hanya diceritakan, tetapi juga dicoba ditarik hikmah atau pelajaran positifnya. Buku ini mengajak pembaca melihat kehidupan sehari-hari dengan sudut pandang reflektif.",
    tags: [
      "Hikmah",
      "Refleksi",
      "Kehidupan",
      "Catatan",
      "Inspirasi"
    ],
    audience: []
  }
];

// Validasi Internal Data Buku
function validateBooksData(data) {
  if (!Array.isArray(data)) {
    console.error("BOOK DATA MISMATCH: books is not an array");
    return false;
  }

  const requiredFields = ["id", "title", "author", "cover", "googlePlayUrl", "category", "resume"];
  let isValid = true;

  data.forEach((book, index) => {
    requiredFields.forEach(field => {
      if (!book[field]) {
        console.error(`BOOK DATA MISMATCH: Missing field "${field}" at index ${index} (ID: ${book.id || "unknown"})`);
        isValid = false;
      }
    });

    if (book.googlePlayId && book.googlePlayUrl) {
      if (!book.googlePlayUrl.includes(book.googlePlayId)) {
        console.error(`BOOK DATA MISMATCH: googlePlayUrl (${book.googlePlayUrl}) does not match googlePlayId (${book.googlePlayId}) for book "${book.title}"`);
        isValid = false;
      }
    } else {
      console.error(`BOOK DATA MISMATCH: Missing googlePlayId or googlePlayUrl for book "${book.title}"`);
      isValid = false;
    }
  });

  return isValid;
}

// Jalankan validasi
validateBooksData(books);

// Ekspor ke window agar dapat diakses oleh browser script
if (typeof window !== "undefined") {
  window.BOOKS_DATA = books;
}

// Ekspor untuk Node jika digunakan dalam testing/build
if (typeof module !== "undefined" && module.exports) {
  module.exports = { books, validateBooksData };
}
