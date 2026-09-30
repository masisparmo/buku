/**
 * Skrip Sinkronisasi Otomatis Google Play Books -> Buku Isparmo
 * https://buku.isparmo.com
 *
 * Mengambil metadata buku karya Isparmo dari Google Play Books,
 * mengunduh cover resmi, dan memperbarui js/books.js secara otomatis.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const booksJsPath = path.join(rootDir, 'js', 'books.js');
const coversDir = path.join(rootDir, 'images', 'covers');

if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

// Utilitas fetch HTTP(S) dengan penanganan redirect
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          buffer,
          text: buffer.toString('utf8')
        });
      });
    }).on('error', reject);
  });
}

// Decode HTML entities
function decodeHtml(html) {
  return (html || '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate URL slug ramah dari judul
function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 45);
}

// Dapatkan daftar Google Play ID dari halaman pencarian Google Play Store
async function discoverBookIds() {
  const searchUrl = 'https://play.google.com/store/search?q=isparmo&c=books&hl=id';
  console.log(`[SYNC] Mencari buku karya Isparmo di Google Play Store...`);
  
  try {
    const res = await fetchUrl(searchUrl);
    if (res.statusCode !== 200) {
      console.warn(`[SYNC] Peringatan: Status HTTP ${res.statusCode} saat mencari di Google Play`);
      return [];
    }
    
    const regex = /\["([A-Za-z0-9_-]{12})"/g;
    const matches = [...res.text.matchAll(regex)].map(m => m[1]);
    const uniqueIds = Array.from(new Set(matches));
    console.log(`[SYNC] Ditemukan ${uniqueIds.length} ID volume potensial di Google Play Store:`, uniqueIds);
    return uniqueIds;
  } catch (err) {
    console.error(`[SYNC] Gagal mengambil halaman pencarian:`, err.message);
    return [];
  }
}

// Ambil detail buku dari halaman detail Google Play Books
async function fetchBookDetail(bookId) {
  const detailUrl = `https://play.google.com/store/books/details?id=${bookId}&hl=id`;
  console.log(`[SYNC] Mengambil detail buku: ${bookId}...`);
  
  const res = await fetchUrl(detailUrl);
  if (res.statusCode !== 200) {
    console.warn(`[SYNC] Buku ${bookId} mengembalikan HTTP ${res.statusCode}`);
    return null;
  }
  
  const html = res.text;
  
  // Ekstrak tag OpenGraph Title
  const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
  const rawOgTitle = ogTitleMatch ? ogTitleMatch[1] : '';

  // Validasi apakah penulisnya adalah Isparmo
  // Format standar Google Play Books: "[Judul] oleh [Penulis] - Buku di Google Play"
  const authorMatch = rawOgTitle.match(/oleh\s+([^-]+)\s*-\s*Buku/i);
  const authorName = authorMatch ? authorMatch[1].trim() : '';
  
  const isAuthorIsparmo = authorName.toLowerCase().includes('isparmo');
  if (!isAuthorIsparmo) {
    console.log(`[SYNC] ID ${bookId} diabaikan (Penulis bukan Isparmo: "${authorName || rawOgTitle}")`);
    return null;
  }
  
  // Ekstrak Judul Bersih & Subjudul
  let cleanTitle = rawOgTitle
    .replace(/\s+oleh\s+.*$/i, '')
    .replace(/\s*-\s*Buku di Google Play.*$/i, '')
    .trim();
  let subtitle = null;
  
  const subtitleMatch = cleanTitle.match(/^([^(]+)\s*\(([^)]+)\)$/);
  if (subtitleMatch) {
    cleanTitle = subtitleMatch[1].trim();
    subtitle = subtitleMatch[2].trim();
  }
  
  // Ekstrak Deskripsi / Resume
  let resume = '';
  const descMatch = html.match(/<div[^>]*data-g-id="description"[^>]*>([\s\S]*?)<\/div>/) ||
                    html.match(/<meta property="og:description" content="([^"]+)"/);
  if (descMatch) {
    resume = decodeHtml(descMatch[1]);
  }
  
  // Ekstrak Cover Image
  const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
  let coverUrl = ogImageMatch ? ogImageMatch[1] : null;
  if (!coverUrl) {
    coverUrl = `https://play.google.com/books/publisher/content/images/frontcover/${bookId}?fife=w800`;
  } else {
    coverUrl = coverUrl.split('=')[0] + '=w800';
  }
  
  // Deteksi Halaman, Tahun & Kategori
  const pagesMatch = html.match(/(\d+)\s+halaman/i);
  const pages = pagesMatch ? parseInt(pagesMatch[1], 10) : 100;
  
  const now = new Date();
  const year = now.getFullYear();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const publication = `${months[now.getMonth()]} ${year}`;
  
  // Klasifikasi kategori otomatis cerdas
  let category = 'AI & Teknologi';
  const lowerContent = (cleanTitle + ' ' + (subtitle || '') + ' ' + resume).toLowerCase();
  if (lowerContent.includes('tenang') || lowerContent.includes('spiritual') || lowerContent.includes('doa') || lowerContent.includes('badai')) {
    category = 'Spiritualitas';
  } else if (lowerContent.includes('bahagia') || lowerContent.includes('pengembangan diri') || lowerContent.includes('kebiasaan')) {
    category = 'Pengembangan Diri';
  } else if (lowerContent.includes('hikmah') || lowerContent.includes('catatan') || lowerContent.includes('keseharian')) {
    category = 'Refleksi Kehidupan';
  } else if (lowerContent.includes('produktivitas') || lowerContent.includes('waktu') || lowerContent.includes('fokus')) {
    category = 'Produktivitas';
  }
  
  // Deteksi status harga (Free / Paid)
  const isFree = html.toLowerCase().includes('gratis') || html.includes('Rp 0');
  
  return {
    googlePlayId: bookId,
    googlePlayUrl: `https://play.google.com/store/books/details?id=${bookId}`,
    lynkUrl: '',
    title: cleanTitle,
    subtitle: subtitle,
    author: 'Isparmo',
    pages: pages,
    year: year,
    publication: publication,
    category: category,
    publisher: 'KAIS (Komunitas AI untuk Semua)',
    coverUrl: coverUrl,
    featured: false,
    priceType: isFree ? 'free' : 'paid',
    status: isFree ? 'FREE' : 'AVAILABLE',
    resume: resume || `Buku karya Isparmo berjudul ${cleanTitle}.`,
    tags: [category, 'Buku Isparmo', 'Google Play Books'],
    audience: ['Pembaca Umum', 'Profesional']
  };
}

// Main Runner
async function runSync() {
  console.log(`[SYNC] Memulai sinkronisasi katalog buku Isparmo...`);
  
  // 1. Baca data buku yang sudah ada di js/books.js
  const booksJsContent = fs.readFileSync(booksJsPath, 'utf8');
  const existingIdMatches = [...booksJsContent.matchAll(/googlePlayId:\s*["']([^"']+)["']/g)].map(m => m[1]);
  const existingIds = new Set(existingIdMatches);
  console.log(`[SYNC] Buku yang sudah terdaftar di website:`, Array.from(existingIds));
  
  // 2. Dapatkan ID buku dari argumen CLI jika ada (misal: node sync-books.mjs Bgr4EQAAQBAJ)
  const cliArgs = process.argv.slice(2);
  let candidateIds = [];
  
  if (cliArgs.length > 0 && cliArgs[0].length === 12) {
    console.log(`[SYNC] Menjalankan untuk ID dari parameter:`, cliArgs[0]);
    candidateIds = [cliArgs[0]];
  } else {
    candidateIds = await discoverBookIds();
  }
  
  // 3. Saring ID yang belum ada
  const newIds = candidateIds.filter(id => !existingIds.has(id));
  
  if (newIds.length === 0) {
    console.log(`[SYNC] Tidak ada buku baru yang ditemukan. Katalog sudah yang terbaru.`);
    return;
  }
  
  console.log(`[SYNC] Ditemukan ${newIds.length} buku baru untuk disinkronkan:`, newIds);
  
  const newBookObjects = [];
  
  for (const id of newIds) {
    try {
      const bookData = await fetchBookDetail(id);
      if (!bookData) continue;
      
      const slug = slugify(bookData.title) || `buku-${id.toLowerCase()}`;
      const coverFilename = `${slug}.webp`;
      const coverFilePath = path.join(coversDir, coverFilename);
      
      // Unduh cover buku resmi
      console.log(`[SYNC] Mengunduh cover untuk ${bookData.title} -> ${coverFilename}...`);
      try {
        const imgRes = await fetchUrl(bookData.coverUrl);
        if (imgRes.statusCode === 200 && imgRes.buffer.length > 500) {
          fs.writeFileSync(coverFilePath, imgRes.buffer);
          bookData.cover = `images/covers/${coverFilename}`;
        } else {
          bookData.cover = 'images/covers/PLACEHOLDER.jpg';
        }
      } catch (imgErr) {
        console.warn(`[SYNC] Gagal mengunduh cover untuk ${id}:`, imgErr.message);
        bookData.cover = 'images/covers/PLACEHOLDER.jpg';
      }
      
      delete bookData.coverUrl;
      bookData.id = slug;
      
      newBookObjects.push(bookData);
    } catch (err) {
      console.error(`[SYNC] Error memproses buku ${id}:`, err.message);
    }
  }
  
  if (newBookObjects.length === 0) {
    console.log(`[SYNC] Tidak ada buku baru yang valid untuk ditambahkan.`);
    return;
  }
  
  // 4. Perbarui js/books.js dengan menambahkan buku baru di awal daftar
  console.log(`[SYNC] Menambahkan ${newBookObjects.length} buku baru ke js/books.js...`);
  
  // Template JSON rapi
  const newEntriesString = newBookObjects.map(b => '  ' + JSON.stringify(b, null, 2).replace(/\n/g, '\n  ')).join(',\n') + ',\n';
  
  const updatedContent = booksJsContent.replace(/(const books\s*=\s*\[\s*\n)/, `$1${newEntriesString}`);
  
  fs.writeFileSync(booksJsPath, updatedContent, 'utf8');
  console.log(`[SYNC] Sukses! js/books.js telah diperbarui.`);
}

runSync().catch(err => {
  console.error('[SYNC] Fatal Error:', err);
  process.exit(1);
});
