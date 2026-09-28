/**
 * BUKU ISPARMO — Application Script
 * https://buku.isparmo.com
 *
 * Mengelola interaksi katalog, pencarian real-time, filter kategori,
 * sorting, dan rendering dinamis halaman detail buku.
 */

(function () {
  "use strict";

  // Utilitas keamanan HTML
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Fallback cover jika gambar gagal dimuat
  const PLACEHOLDER_COVER = "images/covers/PLACEHOLDER.jpg";

  // Periksa ketersediaan data buku
  function getBooksData() {
    if (typeof window !== "undefined" && Array.isArray(window.BOOKS_DATA)) {
      return window.BOOKS_DATA;
    }
    console.error("DATA ERROR: window.BOOKS_DATA tidak ditemukan.");
    return null;
  }

  // Label tombol Google Play berdasarkan status buku
  function getGooglePlayButtonLabel(book) {
    if (book.status === "FREE" || book.priceType === "free") {
      return "Gratis di Google Play";
    }
    if (book.status === "CHECK_AVAILABILITY" || book.priceType === "check_availability") {
      return "Google Play";
    }
    return "Beli / Baca di Google Play";
  }

  // Setup Global Header (Sticky effect & Mobile Menu)
  function setupHeader() {
    const header = document.querySelector(".site-header");
    const mobileToggle = document.querySelector(".mobile-toggle");
    const mobileDrawer = document.querySelector(".mobile-drawer");

    if (header) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }, { passive: true });
    }

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener("click", () => {
        const isOpen = mobileDrawer.classList.toggle("open");
        mobileToggle.setAttribute("aria-expanded", String(isOpen));
      });

      // Tutup drawer ketika link di klik
      const drawerLinks = mobileDrawer.querySelectorAll("a");
      drawerLinks.forEach(link => {
        link.addEventListener("click", () => {
          mobileDrawer.classList.remove("open");
          mobileToggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  // ==========================================================================
  // HALAMAN KATALOG UTAMA (index.html)
  // ==========================================================================
  function initHomePage(books) {
    const gridContainer = document.getElementById("books-grid");
    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("clear-search-btn");
    const filterContainer = document.getElementById("category-filters");
    const sortSelect = document.getElementById("sort-select");
    const resultsCountEl = document.getElementById("results-count");
    const featuredContainer = document.getElementById("featured-book-container");

    if (!gridContainer) return;

    let currentCategory = "Semua";
    let searchQuery = "";
    let currentSort = "terbaru";

    // 1. Render Featured Book
    if (featuredContainer) {
      const featuredBook = books.find(b => b.featured) || books[0];
      if (featuredBook) {
        const playBtnLabel = getGooglePlayButtonLabel(featuredBook);
        const lynkButtonHtml = (featuredBook.lynkUrl && featuredBook.lynkUrl.trim() !== "")
          ? `<a href="${escapeHtml(featuredBook.lynkUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-lynk">Beli via Lynk.id</a>`
          : "";

        featuredContainer.innerHTML = `
          <div class="featured-card">
            <div class="featured-cover-wrapper">
              <a href="book.html?id=${encodeURIComponent(featuredBook.id)}" class="featured-cover-link" aria-label="Lihat detail buku ${escapeHtml(featuredBook.title)}">
                <img src="${escapeHtml(featuredBook.cover)}" alt="Cover ${escapeHtml(featuredBook.title)}" width="300" height="450" onerror="this.src='${PLACEHOLDER_COVER}'" />
              </a>
            </div>
            <div class="featured-info">
              <div class="meta-row">
                <span class="badge badge-accent">${escapeHtml(featuredBook.category)}</span>
                <span class="badge badge-neutral">${featuredBook.pages} Halaman</span>
                ${featuredBook.status === "FREE" ? '<span class="badge badge-free">Gratis</span>' : ''}
              </div>
              <h3 class="featured-title">
                <a href="book.html?id=${encodeURIComponent(featuredBook.id)}">${escapeHtml(featuredBook.title)}</a>
              </h3>
              ${featuredBook.subtitle ? `<div class="featured-subtitle">${escapeHtml(featuredBook.subtitle)}</div>` : ''}
              <div class="book-author-meta">
                <span>Oleh <strong>${escapeHtml(featuredBook.author)}</strong></span>
                <span>•</span>
                <span>${escapeHtml(featuredBook.publication || String(featuredBook.year))}</span>
              </div>
              <p class="featured-resume">${escapeHtml(featuredBook.resume)}</p>
              <div class="featured-actions">
                <a href="${escapeHtml(featuredBook.googlePlayUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-accent">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.793 12 3.61 22.186c-.352-.338-.61-.926-.61-1.743V3.557c0-.817.258-1.405.61-1.743zm1.488-.951l11.08 6.398-2.384 2.384-8.696-8.782zm0 22.274l8.696-8.782 2.384 2.384-11.08 6.398zm12.39-7.155l3.86-2.228c.95-.548.95-1.446 0-1.994l-3.86-2.228-2.677 2.677 2.677 2.773z"/></svg>
                  ${escapeHtml(playBtnLabel)}
                </a>
                ${lynkButtonHtml}
                <a href="book.html?id=${encodeURIComponent(featuredBook.id)}" class="btn btn-outline">Lihat Detail</a>
              </div>
            </div>
          </div>
        `;
      }
    }

    // 2. Setup Category Filter Pills secara dinamis dari data
    if (filterContainer) {
      const categories = ["Semua"];
      books.forEach(b => {
        if (b.category && !categories.includes(b.category)) {
          categories.push(b.category);
        }
      });

      filterContainer.innerHTML = categories.map(cat => `
        <button type="button" class="filter-btn ${cat === "Semua" ? "active" : ""}" data-category="${escapeHtml(cat)}">
          ${escapeHtml(cat)}
        </button>
      `).join("");

      filterContainer.addEventListener("click", e => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        const selectedCat = btn.getAttribute("data-category");
        if (!selectedCat) return;

        currentCategory = selectedCat;
        filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        applyFilterAndRender();
      });
    }

    // 3. Search Real-time Event
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value.trim().toLowerCase();
        if (clearSearchBtn) {
          if (searchQuery.length > 0) {
            clearSearchBtn.classList.add("visible");
          } else {
            clearSearchBtn.classList.remove("visible");
          }
        }
        applyFilterAndRender();
      });
    }

    if (clearSearchBtn && searchInput) {
      clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        clearSearchBtn.classList.remove("visible");
        searchInput.focus();
        applyFilterAndRender();
      });
    }

    // 4. Sort Event
    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        currentSort = sortSelect.value;
        applyFilterAndRender();
      });
    }

    // Fungsi Filter & Sort
    function applyFilterAndRender() {
      let filtered = books.filter(book => {
        // Cek kategori
        if (currentCategory !== "Semua" && book.category !== currentCategory) {
          return false;
        }

        // Cek query pencarian
        if (searchQuery) {
          const title = (book.title || "").toLowerCase();
          const subtitle = (book.subtitle || "").toLowerCase();
          const author = (book.author || "").toLowerCase();
          const category = (book.category || "").toLowerCase();
          const resume = (book.resume || "").toLowerCase();
          const tags = Array.isArray(book.tags) ? book.tags.join(" ").toLowerCase() : "";

          const matched = title.includes(searchQuery) ||
                          subtitle.includes(searchQuery) ||
                          author.includes(searchQuery) ||
                          category.includes(searchQuery) ||
                          resume.includes(searchQuery) ||
                          tags.includes(searchQuery);

          if (!matched) return false;
        }

        return true;
      });

      // Sorting
      filtered.sort((a, b) => {
        if (currentSort === "terbaru") {
          return (b.year || 0) - (a.year || 0);
        } else if (currentSort === "terlama") {
          return (a.year || 0) - (b.year || 0);
        } else if (currentSort === "az") {
          return (a.title || "").localeCompare(b.title || "");
        } else if (currentSort === "za") {
          return (b.title || "").localeCompare(a.title || "");
        }
        return 0;
      });

      renderBooksGrid(filtered);
    }

    // Render Cards ke DOM
    function renderBooksGrid(items) {
      if (resultsCountEl) {
        resultsCountEl.textContent = `Menampilkan ${items.length} buku`;
      }

      if (items.length === 0) {
        gridContainer.innerHTML = `
          <div class="empty-state">
            <h3 class="empty-state-title">Tidak ada buku yang cocok</h3>
            <p class="empty-state-desc">Coba gunakan kata kunci lain atau pilih kategori "Semua".</p>
            <button type="button" class="btn btn-outline btn-sm" id="reset-filter-btn">Reset Pencarian & Filter</button>
          </div>
        `;
        const resetBtn = document.getElementById("reset-filter-btn");
        if (resetBtn) {
          resetBtn.addEventListener("click", () => {
            currentCategory = "Semua";
            searchQuery = "";
            if (searchInput) searchInput.value = "";
            if (clearSearchBtn) clearSearchBtn.classList.remove("visible");
            if (filterContainer) {
              filterContainer.querySelectorAll(".filter-btn").forEach(b => {
                b.classList.toggle("active", b.getAttribute("data-category") === "Semua");
              });
            }
            applyFilterAndRender();
          });
        }
        return;
      }

      gridContainer.innerHTML = items.map((book, index) => {
        const detailUrl = `book.html?id=${encodeURIComponent(book.id)}`;
        const loadingAttr = index < 4 ? 'loading="eager"' : 'loading="lazy"';
        return `
          <article class="book-card" data-id="${escapeHtml(book.id)}">
            <a href="${detailUrl}" class="card-cover-container" aria-label="Lihat detail buku ${escapeHtml(book.title)}">
              <img src="${escapeHtml(book.cover)}" alt="Cover ${escapeHtml(book.title)}" width="240" height="360" ${loadingAttr} onerror="this.src='${PLACEHOLDER_COVER}'" />
            </a>
            <div class="card-body">
              <div class="card-meta-top">
                <span class="card-category">${escapeHtml(book.category)}</span>
                <span class="card-pages">${book.pages} hlm</span>
              </div>
              <h3 class="card-title">
                <a href="${detailUrl}">${escapeHtml(book.title)}</a>
              </h3>
              <div class="card-author">${escapeHtml(book.author)}</div>
              <p class="card-resume">${escapeHtml(book.resume)}</p>
              <div class="card-footer">
                <a href="${detailUrl}" class="btn btn-outline btn-sm">Lihat Detail</a>
              </div>
            </div>
          </article>
        `;
      }).join("");
    }

    // Inisialisasi awal
    applyFilterAndRender();
  }

  // ==========================================================================
  // HALAMAN DETAIL BUKU (book.html)
  // ==========================================================================
  function initDetailPage(books) {
    const detailRoot = document.getElementById("book-detail-root");
    if (!detailRoot) return;

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    if (!bookId) {
      renderNotFound(detailRoot, "Parameter ID buku tidak ditemukan.");
      return;
    }

    const book = books.find(b => b.id === bookId);

    if (!book) {
      renderNotFound(detailRoot, `Buku dengan ID "${escapeHtml(bookId)}" tidak ditemukan dalam katalog.`);
      return;
    }

    // Update Metadata SEO & Title
    document.title = `${book.title} — Isparmo`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", book.resume);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", `${book.title} — Isparmo`);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", book.resume);

    // Inject JSON-LD Schema.org Structured Data
    injectJsonLd(book);

    // Render Konten Detail
    const playBtnLabel = getGooglePlayButtonLabel(book);
    const lynkButtonHtml = (book.lynkUrl && book.lynkUrl.trim() !== "")
      ? `<a href="${escapeHtml(book.lynkUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-lynk btn-lg">Beli via Lynk.id</a>`
      : "";

    // Target Audience List
    let audienceHtml = "";
    if (Array.isArray(book.audience) && book.audience.length > 0) {
      audienceHtml = `
        <div class="detail-block">
          <h2 class="detail-block-title">Untuk Siapa Buku Ini?</h2>
          <ul class="audience-list">
            ${book.audience.map(aud => `
              <li class="audience-item">
                <span class="audience-bullet">✓</span>
                <span>${escapeHtml(aud)}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      `;
    }

    // Tags / Yang Akan Anda Temukan
    let topicsHtml = "";
    if (Array.isArray(book.tags) && book.tags.length > 0) {
      topicsHtml = `
        <div class="detail-block">
          <h2 class="detail-block-title">Yang Akan Anda Temukan</h2>
          <ul class="topics-list">
            ${book.tags.map(tag => `
              <li class="topic-item">
                <span class="topic-bullet">✦</span>
                <span>${escapeHtml(tag)}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      `;
    }

    detailRoot.innerHTML = `
      <div class="breadcrumb-nav">
        <a href="index.html#katalog" class="breadcrumb-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Kembali ke Koleksi Buku
        </a>
      </div>

      <div class="book-detail-wrapper">
        <!-- Hero Detail Card -->
        <div class="detail-hero-card">
          <div class="detail-cover-col">
            <div class="detail-cover-wrapper">
              <img src="${escapeHtml(book.cover)}" alt="Cover ${escapeHtml(book.title)}" width="340" height="510" onerror="this.src='${PLACEHOLDER_COVER}'" />
            </div>
          </div>
          <div class="detail-info-col">
            <div class="detail-header-meta">
              <span class="badge badge-accent">${escapeHtml(book.category)}</span>
              <span class="badge badge-neutral">${book.pages} Halaman</span>
              ${book.status === "FREE" ? '<span class="badge badge-free">Gratis</span>' : ''}
            </div>
            <h1 class="detail-title">${escapeHtml(book.title)}</h1>
            ${book.subtitle ? `<div class="detail-subtitle">${escapeHtml(book.subtitle)}</div>` : ''}
            
            <div class="detail-author-row">
              <span>Penulis: <strong>${escapeHtml(book.author)}</strong></span>
              <span>Kategori: <strong>${escapeHtml(book.category)}</strong></span>
              <span>Tahun: <strong>${escapeHtml(book.publication || String(book.year))}</strong></span>
            </div>

            <p class="detail-resume-lead">${escapeHtml(book.resume)}</p>

            <div class="detail-actions">
              <a href="${escapeHtml(book.googlePlayUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.793 12 3.61 22.186c-.352-.338-.61-.926-.61-1.743V3.557c0-.817.258-1.405.61-1.743zm1.488-.951l11.08 6.398-2.384 2.384-8.696-8.782zm0 22.274l8.696-8.782 2.384 2.384-11.08 6.398zm12.39-7.155l3.86-2.228c.95-.548.95-1.446 0-1.994l-3.86-2.228-2.677 2.677 2.677 2.773z"/></svg>
                ${escapeHtml(playBtnLabel)}
              </a>
              ${lynkButtonHtml}
            </div>
          </div>
        </div>

        <!-- Sections Grid: Resume Lengkap + Sidebar Info -->
        <div class="detail-sections-grid">
          <div class="detail-main-col">
            <div class="detail-block">
              <h2 class="detail-block-title">Tentang Buku</h2>
              <p>${escapeHtml(book.resume)}</p>
            </div>

            ${audienceHtml}
            ${topicsHtml}

            <!-- CTA Temukan Buku Ini -->
            <div class="detail-block">
              <h2 class="detail-block-title">Temukan Buku Ini</h2>
              <p style="margin-bottom: 1.5rem;">Dapatkan akses resmi buku ini di platform Google Play Books dengan pengalaman membaca terbaik di tablet, smartphone, maupun browser komputer Anda.</p>
              <div class="detail-actions">
                <a href="${escapeHtml(book.googlePlayUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-accent">
                  ${escapeHtml(playBtnLabel)}
                </a>
                ${lynkButtonHtml}
              </div>
            </div>
          </div>

          <div class="detail-sidebar-col">
            <div class="detail-block">
              <h2 class="detail-block-title">Informasi Buku</h2>
              <table class="info-table">
                <tbody>
                  <tr>
                    <th>Penulis</th>
                    <td>${escapeHtml(book.author)}</td>
                  </tr>
                  <tr>
                    <th>Kategori</th>
                    <td>${escapeHtml(book.category)}</td>
                  </tr>
                  <tr>
                    <th>Jumlah Halaman</th>
                    <td>${book.pages} Halaman</td>
                  </tr>
                  <tr>
                    <th>Waktu Terbit</th>
                    <td>${escapeHtml(book.publication || String(book.year))}</td>
                  </tr>
                  ${book.publisher ? `
                  <tr>
                    <th>Penerbit</th>
                    <td>${escapeHtml(book.publisher)}</td>
                  </tr>` : ''}
                  <tr>
                    <th>Format</th>
                    <td>Ebook / Digital (Google Play)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Render Pesan Buku Tidak Ditemukan
  function renderNotFound(container, message) {
    document.title = "Buku Tidak Ditemukan — Isparmo";
    container.innerHTML = `
      <div class="not-found-card">
        <div class="not-found-icon">📖</div>
        <h1 class="not-found-title">Buku Tidak Ditemukan</h1>
        <p class="not-found-desc">${escapeHtml(message)}</p>
        <a href="index.html#katalog" class="btn btn-primary">Kembali ke Koleksi Buku</a>
      </div>
    `;
  }

  // Schema.org JSON-LD Generator
  function injectJsonLd(book) {
    const existing = document.getElementById("jsonld-book");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "jsonld-book";
    script.type = "application/ld+json";

    const schema = {
      "@context": "https://schema.org",
      "@type": "Book",
      "name": book.title,
      "author": {
        "@type": "Person",
        "name": book.author
      },
      "description": book.resume,
      "numberOfPages": book.pages,
      "genre": book.category,
      "inLanguage": "id",
      "url": book.googlePlayUrl
    };

    if (book.publication || book.year) {
      schema.datePublished = String(book.year || book.publication);
    }
    if (book.publisher) {
      schema.publisher = {
        "@type": "Organization",
        "name": book.publisher
      };
    }

    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  // Inisialisasi saat DOM siap
  document.addEventListener("DOMContentLoaded", () => {
    setupHeader();

    const books = getBooksData();
    if (!books) {
      const main = document.querySelector(".main-content");
      if (main) {
        main.innerHTML = `
          <div class="container" style="padding: 4rem 1.5rem; text-align: center;">
            <h2>Maaf, data katalog sedang tidak dapat dimuat.</h2>
            <p style="color: var(--muted); margin-top: 0.5rem;">Silakan muat ulang peramban Anda.</p>
          </div>
        `;
      }
      return;
    }

    // Jalankan logika sesuai halaman
    if (document.getElementById("books-grid")) {
      initHomePage(books);
    } else if (document.getElementById("book-detail-root")) {
      initDetailPage(books);
    }
  });
})();
