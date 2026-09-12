/**
 * e-Portofolio Seminar PPG - Muhammad Iqbal Nugroho, S.Kom.
 * Interactive Application Engine & Presentation Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Global State & Elements ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.navbar');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  
  // Presenter Mode HUD Elements
  const presenterToggleBtn = document.getElementById('presenterToggleBtn');
  const presenterHud = document.getElementById('presenterHud');
  const hudSlideCurrent = document.getElementById('hudSlideCurrent');
  const hudSlideTotal = document.getElementById('hudSlideTotal');
  const hudPrevBtn = document.getElementById('hudPrevBtn');
  const hudNextBtn = document.getElementById('hudNextBtn');
  const hudCloseBtn = document.getElementById('hudCloseBtn');

  // Modals & Backdrops
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalActionBtn = document.getElementById('modalActionBtn');

  // Upload Modal Elements
  const uploadModalBackdrop = document.getElementById('uploadModalBackdrop');
  const openUploadModalBtn = document.getElementById('openUploadModalBtn');
  const uploadModalCloseBtn = document.getElementById('uploadModalCloseBtn');
  const cancelUploadBtn = document.getElementById('cancelUploadBtn');
  const uploadDocForm = document.getElementById('uploadDocForm');
  const uploadDropzone = document.getElementById('uploadDropzone');
  const docFileInput = document.getElementById('docFileInput');
  const selectedFileInfo = document.getElementById('selectedFileInfo');
  const selectedFileName = document.getElementById('selectedFileName');
  const selectedFileSize = document.getElementById('selectedFileSize');
  const removeSelectedFileBtn = document.getElementById('removeSelectedFileBtn');
  const uploadProgressContainer = document.getElementById('uploadProgressContainer');
  const uploadProgressBar = document.getElementById('uploadProgressBar');
  const uploadProgressPercent = document.getElementById('uploadProgressPercent');
  const uploadProgressText = document.getElementById('uploadProgressText');
  const submitUploadBtn = document.getElementById('submitUploadBtn');

  // Repository & Search Elements
  const repoSearchInput = document.getElementById('repoSearchInput');
  const repoTagBtns = document.querySelectorAll('.repo-tag-btn');
  const repoTableBody = document.getElementById('repoTableBody');

  // Innovation Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const innovationCards = document.querySelectorAll('.innovation-card');

  // Selected file cache for upload
  let currentUploadedFile = null;

  // Presentation State
  let isPresenterMode = false;
  let currentSlideIndex = 0;
  const slideSections = Array.from(sections);
  if (hudSlideTotal) hudSlideTotal.textContent = slideSections.length;

  /* ==========================================================================
     1. THEME CONTROLLER (Dark / Light Mode)
     ========================================================================== */
  const savedTheme = localStorage.getItem('seminar_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('seminar_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast('Tema Diperbarui', `Beralih ke mode ${newTheme === 'dark' ? 'Gelap' : 'Terang'}`, 'info');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
      themeToggleBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
      themeToggleBtn.title = "Ganti ke Mode Terang";
    } else {
      themeToggleBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
      themeToggleBtn.title = "Ganti ke Mode Gelap";
    }
  }

  /* ==========================================================================
     2. NAVBAR SCROLLSPY & STICKY EFFECTS
     ========================================================================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });

    if (isPresenterMode && currentId) {
      const idx = slideSections.findIndex(sec => sec.getAttribute('id') === currentId);
      if (idx !== -1) {
        currentSlideIndex = idx;
        updateSlideHUD();
      }
    }
  });

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
      });
    });

    // Close mobile menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
      }
    });

    // Automatically close mobile menu on screen resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     3. SEMINAR PRESENTER MODE CONTROLLER
     ========================================================================== */
  function togglePresenterMode(forceState) {
    isPresenterMode = typeof forceState === 'boolean' ? forceState : !isPresenterMode;
    
    if (isPresenterMode) {
      presenterHud.classList.add('active');
      document.body.classList.add('presenter-active');
      updateSlideHUD();
      showToast('Mode Presentasi Aktif', 'Gunakan tombol Panah Atas / Bawah atau spasi untuk navigasi slide', 'info');
      goToSlide(currentSlideIndex);
    } else {
      presenterHud.classList.remove('active');
      document.body.classList.remove('presenter-active');
      showToast('Mode Normal', 'Kembali ke tampilan gulir biasa', 'info');
    }
  }

  if (presenterToggleBtn) {
    presenterToggleBtn.addEventListener('click', () => togglePresenterMode());
  }
  if (hudCloseBtn) {
    hudCloseBtn.addEventListener('click', () => togglePresenterMode(false));
  }

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= slideSections.length) index = slideSections.length - 1;
    currentSlideIndex = index;
    
    const targetSection = slideSections[currentSlideIndex];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateSlideHUD();
    }
  }

  function updateSlideHUD() {
    if (hudSlideCurrent) {
      hudSlideCurrent.textContent = currentSlideIndex + 1;
    }
  }

  if (hudPrevBtn) {
    hudPrevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
  }
  if (hudNextBtn) {
    hudNextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (modalBackdrop && modalBackdrop.classList.contains('open')) {
      if (e.key === 'Escape') closeModal();
      return;
    }
    if (uploadModalBackdrop && uploadModalBackdrop.classList.contains('open')) {
      if (e.key === 'Escape') closeUploadModal();
      return;
    }
    if (editModalBackdrop && editModalBackdrop.classList.contains('open')) {
      if (e.key === 'Escape') closeEditModal();
      return;
    }
    if (deleteConfirmModalBackdrop && deleteConfirmModalBackdrop.classList.contains('open')) {
      if (e.key === 'Escape') closeDeleteModal();
      return;
    }
    if (addInovasiModalBackdrop && addInovasiModalBackdrop.classList.contains('open')) {
      if (e.key === 'Escape') closeAddInovasiModal();
      return;
    }
    if (deleteInovasiConfirmModalBackdrop && deleteInovasiConfirmModalBackdrop.classList.contains('open')) {
      if (e.key === 'Escape') closeDeleteInovasiModal();
      return;
    }

    if ((e.key === 'p' || e.key === 'P' || e.key === 'm' || e.key === 'M') && !e.target.matches('input, textarea, select')) {
      togglePresenterMode();
      return;
    }

    if (isPresenterMode) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToSlide(currentSlideIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToSlide(currentSlideIndex - 1);
      } else if (e.key === 'Escape') {
        togglePresenterMode(false);
      }
    }
  });

  /* ==========================================================================
     4. INTERACTIVE TIMELINE REFLECTION MODAL DATA & HANDLERS
     ========================================================================== */
  const reflectionData = {
    sem1: {
      title: "Refleksi Mendalam: Semester I (Fondasi, Teori & Lembar Kerja)",
      subtitle: "Transformasi Paradigma dari 'Ahli Coding' Menjadi 'Pendidik Berjiwa Pedagogik'",
      category: "jurnal",
      docId: "doc-lk2",
      docName: "Lembar Kerja 2 (LK 2) - Desain Refleksi Kritis Mata Kuliah Semester 1",
      content: `
        <div class="modal-section">
          <h4 class="modal-section-title">Mata Kuliah Esensial yang Ditempuh</h4>
          <p>Filosofi Pendidikan Indonesia, Pemahaman tentang Peserta Didik & Pembelajarannya, Prinsip Pengajaran dan Asesmen I, serta <em>Computational Thinking</em> dalam Pendidikan.</p>
        </div>
        <div class="modal-section">
          <h4 class="modal-section-title">Momen 'Aha!' (Pergeseran Paradigma)</h4>
          <p>Awalnya saya meyakini bahwa guru informatika yang hebat adalah yang paling mahir menulis kode rumit. Namun, konsep <strong>"Sistem Among" Ki Hadjar Dewantara</strong> dan <strong>Zone of Proximal Development (ZPD)</strong> menyadarkan saya bahwa mengajar komputasi adalah seni membimbing logika berpikir manusia, bukan sekadar memprogram mesin.</p>
        </div>
        <div class="modal-section">
          <h4 class="modal-section-title">Refleksi Model 4F (Facts, Feelings, Findings, Future)</h4>
          <ul style="padding-left: 20px; color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
            <li><strong>Facts:</strong> Mengkaji teori pendidikan progresif, menyelesaikan <strong>Lembar Kerja 2 (LK 2)</strong> refleksi mata kuliah inti/selektif, dan merancang asesmen diagnostik non-kognitif.</li>
            <li><strong>Feelings:</strong> Sempat merasa tertantang saat menyederhanakan konsep algoritma abstrak untuk siswa pemula.</li>
            <li><strong>Findings:</strong> Pendekatan visual dan analogi dunia nyata (SAVI) mempercepat pemahaman logika siswa hingga 40%.</li>
            <li><strong>Future:</strong> Selalu mengintegrasikan studi kasus autentik sebelum mengenalkan sintaks kode.</li>
          </ul>
        </div>
        <div class="modal-section" style="background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.12)); padding: 16px; border-radius: 10px; border-left: 4px solid var(--primary); margin-top: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div>
              <h4 class="modal-section-title" style="margin-bottom: 2px;">📄 Berkas Lembar Kerja Refleksi Terlampir:</h4>
              <p style="margin: 0; color: var(--text-main); font-weight: 700;">LEMBAR KERJA 2 (LK 2).docx • 2.68 MB</p>
              <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: var(--text-muted);">Dokumen refleksi komprehensif mata kuliah Semester 1 PPG Calon Guru Informatika.</p>
            </div>
            <a href="LEMBAR%20KERJA%202%20(LK%202).docx" download="LEMBAR KERJA 2 (LK 2).docx" class="btn btn-primary btn-sm" style="text-decoration: none;">
              <span>📥 Unduh Lembar Kerja 2 (DOCX)</span>
            </a>
          </div>
        </div>
      `,
      actionText: "📂 Buka Dokumen di Arsip"
    },
    sem2: {
      title: "Refleksi Mendalam: Semester II (PPL & Aplikasi Nyata)",
      subtitle: "Ujian Lapangan di Sekolah Mitra & Implementasi Pembelajaran Berdiferensiasi",
      category: "ppl",
      docId: "doc-3",
      docName: "Laporan Akhir Praktik Pengalaman Lapangan (PPL I & PPL II)",
      content: `
        <div class="modal-section">
          <h4 class="modal-section-title">Pengalaman Praktik Pengalaman Lapangan (PPL)</h4>
          <p>Melaksanakan 700+ jam praktik terbimbing dan mandiri di SMA/SMK mitra. Menghadapi kelas heterogen dengan rentang literasi digital yang sangat lebar (sebagian siswa mahir gawai, sebagian belum pernah menyentuh komputer desktop).</p>
        </div>
        <div class="modal-section">
          <h4 class="modal-section-title">Tantangan Nyata & Solusi Aksi</h4>
          <p>Siswa sering mengalami demotivasi saat menemui <em>error code</em> sintaks. Saya merancang modul ajar berdiferensiasi dengan 3 tingkat tiering (Novice, Intermediate, Hacker) serta memanfaatkan gamifikasi logika sehingga seluruh siswa merasakan pencapaian (*Mastery Experience*).</p>
        </div>
        <div class="modal-section">
          <h4 class="modal-section-title">Bukti Evaluasi Pembelajaran</h4>
          <p>Peningkatan ketuntasan asesmen formatif dari 58% menjadi 89% pada materi Berpikir Komputasional & Algoritma Percabangan setelah diterapkannya media interaktif <em>CodeLearn Hub</em>.</p>
        </div>
        <div class="modal-section" style="background: rgba(6,182,212,0.08); padding: 12px; border-radius: 8px; border-left: 3px solid var(--secondary); margin-top: 14px;">
          <h4 class="modal-section-title" style="margin-bottom: 2px;">Dokumen Terkait di Gudang Arsip:</h4>
          <p style="margin: 0; color: var(--text-main); font-weight: 600;">🏫 Laporan Akhir Praktik Pengalaman Lapangan (PPL I & II • 6.2 MB)</p>
        </div>
      `,
      actionText: "📂 Buka Berkas di Gudang Arsip"
    },
    trans: {
      title: "Refleksi Sintesis: Transformasi Guru Profesional",
      subtitle: "Integrasi Kompetensi Pedagogik, Kepribadian, Sosial, dan Profesional",
      category: "ptk",
      docId: "doc-5",
      docName: "Dokumen Rencana Tindak Lanjut (RTL) Guru Profesional Lengkap",
      content: `
        <div class="modal-section">
          <h4 class="modal-section-title">Evolusi Kompetensi Diri Selama PPG</h4>
          <p>Dari seorang lulusan Ilmu Komputer teknis menjadi pendidik humanis yang adaptif. Saya memahami bahwa teknologi di dalam kelas hanyalah pengungkit (*amplifier*), sedangkan kunci utama tetaplah relasi bermakna antara guru dan peserta didik.</p>
        </div>
        <div class="modal-section">
          <h4 class="modal-section-title">Prinsip Komitmen Mengajar</h4>
          <ul style="padding-left: 20px; color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
            <li><strong>Inklusif & Berkeadilan:</strong> Memastikan akses dan pemahaman komputasi setara bagi seluruh siswa.</li>
            <li><strong>Growth Mindset:</strong> Memposisikan kesalahan logika/error sebagai peluang belajar paling berharga.</li>
            <li><strong>Pembelajar Sepanjang Hayat:</strong> Terus memperbarui kompetensi kecerdasan buatan (AI) etis dan tren pedagogi modern.</li>
          </ul>
        </div>
        <div class="modal-section" style="background: rgba(139,92,246,0.08); padding: 12px; border-radius: 8px; border-left: 3px solid var(--accent); margin-top: 14px;">
          <h4 class="modal-section-title" style="margin-bottom: 2px;">Dokumen Terkait di Gudang Arsip:</h4>
          <p style="margin: 0; color: var(--text-main); font-weight: 600;">🚀 Dokumen Rencana Tindak Lanjut (RTL) Guru Profesional (Format PDF • 1.9 MB)</p>
        </div>
      `,
      actionText: "📂 Buka Berkas di Gudang Arsip"
    }
  };

  function navigateToArchiveDoc(category, docId, docTitle = '') {
    closeModal();
    const arsipSection = document.getElementById('arsip');
    if (!arsipSection) return;

    // Set active category tag in repository
    if (category) {
      repoTagBtns.forEach(b => {
        if (b.getAttribute('data-tag') === category) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    }

    if (repoSearchInput) {
      repoSearchInput.value = '';
    }

    renderRepository();

    // Smooth scroll to archive section
    arsipSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Highlight the target row with pulsing glow animation
    if (docId) {
      setTimeout(() => {
        const targetRow = document.querySelector(`.repo-row[data-doc-id="${docId}"]`);
        if (targetRow) {
          targetRow.classList.remove('highlight-row');
          void targetRow.offsetWidth; // Trigger reflow
          targetRow.classList.add('highlight-row');
          targetRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 550);
    }

    showToast('Membuka Gudang Arsip', docTitle ? `Menampilkan dokumen: ${docTitle}` : 'Menavigasi ke arsip dokumen portofolio', 'success');
  }

  const timelineCards = document.querySelectorAll('.timeline-card');
  timelineCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicked on archive button, ignore card modal open
      if (e.target.closest('.btn-refleksi-archive')) return;

      const stage = card.getAttribute('data-stage');
      const data = reflectionData[stage];
      if (data) {
        openModal(data.title, data.subtitle, data.content, data.actionText, () => {
          navigateToArchiveDoc(data.category, data.docId, data.docName);
        });
      }
    });
  });

  // Direct Archive Buttons on Reflection Cards
  document.querySelectorAll('.btn-refleksi-archive').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cat = btn.getAttribute('data-category');
      const docId = btn.getAttribute('data-doc-id');
      const stage = btn.closest('.timeline-card')?.getAttribute('data-stage');
      const docTitle = stage && reflectionData[stage] ? reflectionData[stage].docName : 'Dokumen Refleksi';
      navigateToArchiveDoc(cat, docId, docTitle);
    });
  });

  // Section CTA link to archive
  const btnAllRefleksiArchive = document.getElementById('btnAllRefleksiArchive');
  if (btnAllRefleksiArchive) {
    btnAllRefleksiArchive.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToArchiveDoc('all', null, 'Seluruh Dokumen Portofolio');
    });
  }

  /* ==========================================================================
     5. SISTEM CRUD GALERI KARYA INOVASI PENDIDIKAN (CREATE, READ, DELETE)
     ========================================================================== */
  const STORAGE_INOVASI_KEY = 'seminar_crud_innovations_v2';

  const defaultOfficialInnovations = [
    {
      id: 'proj-codelearn',
      title: "CodeLearn Hub: Web Gamifikasi Algoritma",
      category: "web",
      categoryName: "Web & Aplikasi Pembelajaran",
      desc: "Platform web interaktif yang mengubah pembelajaran algoritma dan flowchart menjadi petualangan bertahap dengan visual feedback seketika.",
      problem: "Tingginya tingkat kecemasan siswa (coding anxiety) saat mempelajari konsep pemrograman dasar dan sintaksis bahasa komputer.",
      solution: "Menggabungkan visual block parser dengan latihan pemrograman kontekstual kehidupan sehari-hari (resep memasak, lampu lalu lintas, kasir sederhana).",
      tech: "HTML5 Canvas, Vanilla JS, CSS Glassmorphism, LocalStorage State, Web Speech API",
      impact: "Diuji coba pada 72 siswa kelas X: 91% siswa menyatakan lebih berani mencoba dan tingkat retensi pemahaman materi naik sebesar 38%.",
      icon: "💻",
      badge: "Web Pembelajaran"
    },
    {
      id: 'proj-modul',
      title: "Modul Ajar Berdiferensiasi Informatika Fase E",
      category: "modul",
      categoryName: "Modul Ajar Digital",
      desc: "Paket perangkat ajar komprehensif terintegrasi Profil Pelajar Pancasila, asesmen diagnostik, LKPD interaktif, dan lembar refleksi diri.",
      problem: "Keberagaman latar belakang kompetensi digital siswa baru SMA yang belum terakomodasi oleh lembar kerja konvensional yang seragam.",
      solution: "Penyusunan modul berbasis 3 pilar diferensiasi: Konten (teks/video/audio), Proses (scaffolding bertingkat), dan Produk (pilihan proyek presentasi/aplikasi).",
      tech: "Canva Pro Interactive, Google Docs Interaktif, GeoGebra Logic, Embed QR Code",
      impact: "Mendapat predikat 'Sangat Baik' dalam uji validasi dosen pembimbing lapangan dan guru pamong PPL.",
      icon: "📘",
      badge: "Modul Digital"
    },
    {
      id: 'proj-logiquest',
      title: "LogiQuest: Simulator Berpikir Komputasional",
      category: "evaluasi",
      categoryName: "Asesmen & Gamifikasi",
      desc: "Koleksi tantangan logika Bebras & pengenalan pola (pattern recognition) berbasis kuis interaktif dengan timer dan leaderboard lokal.",
      problem: "Siswa sering menganggap berpikir komputasional (Computational Thinking) hanya berlaku saat berada di depan komputer.",
      solution: "Menyediakan 30 skenario teka-teki logika un-plugged dan plugged-in yang melatih 4 pilar CT: Dekomposisi, Pola, Abstraksi, dan Algoritma.",
      tech: "JavaScript ES6, SVG Interactive Nodes, Web Audio API Sound Effects, CSS Grid",
      impact: "Rata-rata skor computational thinking siswa meningkat 42% pada post-test PPL siklus II.",
      icon: "🎮",
      badge: "Gamifikasi & Logika"
    },
    {
      id: 'proj-dashboard',
      title: "Dashboard Evaluasi Asesmen Formatif Real-Time",
      category: "web",
      categoryName: "Web & Aplikasi Pembelajaran",
      desc: "Aplikasi analitik guru untuk memantau pemahaman siswa per Tujuan Pembelajaran (TP) secara instan guna merancang intervensi kilat.",
      problem: "Guru kesulitan mendeteksi miskonsepsi siswa secara cepat sebelum melangkah ke materi berikutnya pada jam pelajaran yang sama.",
      solution: "Dashboard live telemetry yang mengelompokkan siswa secara otomatis ke dalam kelompok 'Perlu Bimbingan', 'Cakap', dan 'Mahir'.",
      tech: "HTML5, Chart.js, Vanilla CSS, JSON Data Store, Realtime WebSockets Mock",
      impact: "Efisiensi waktu pemberian umpan balik guru meningkat 65% dalam kegiatan refleksi penutup kelas.",
      icon: "📊",
      badge: "Analitik Asesmen"
    }
  ];

  function getStoredInnovations() {
    try {
      const stored = localStorage.getItem(STORAGE_INOVASI_KEY);
      if (stored) return JSON.parse(stored);
      saveStoredInnovations(defaultOfficialInnovations);
      return defaultOfficialInnovations;
    } catch (e) {
      console.error("Gagal membaca inovasi dari localStorage:", e);
      return defaultOfficialInnovations;
    }
  }

  function saveStoredInnovations(items) {
    try {
      localStorage.setItem(STORAGE_INOVASI_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Gagal menyimpan inovasi ke localStorage:", e);
    }
  }

  const galleryGrid = document.getElementById('galleryGrid');
  let currentInovasiFilter = 'all';

  function renderInnovationGallery() {
    if (!galleryGrid) return;
    const items = getStoredInnovations();
    const filtered = items.filter(item => currentInovasiFilter === 'all' || item.category === currentInovasiFilter);

    if (filtered.length === 0) {
      galleryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">💡</div>
          <h5>Belum ada karya untuk kategori ini.</h5>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Gunakan tombol "+ Tambah Karya" di atas untuk menambahkan karya inovasi baru.</p>
        </div>
      `;
      return;
    }

    galleryGrid.innerHTML = filtered.map(item => `
      <div class="innovation-card" data-category="${item.category}" data-project="${item.id}">
        <div class="innovation-preview">
          <span class="innovation-category-tag">${item.categoryName || item.category}</span>
          <div style="font-size: 3.5rem;">${item.icon || '💡'}</div>
        </div>
        <div class="innovation-body">
          <h3 class="innovation-title">${item.title}</h3>
          <p class="innovation-desc">${item.desc}</p>
          <div class="innovation-tech-stack">
            <span class="tech-tag">${item.badge || 'Inovasi Digital'}</span>
            <span class="tech-tag">${item.tech ? item.tech.split(',')[0] : 'Informatika'}</span>
          </div>
          <div class="innovation-footer">
            <span class="link-detail">
              <span>Lihat Studi Kasus & Demo</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
            <button class="btn-delete-inovasi-card" data-inovasi-id="${item.id}" title="Hapus Karya">🗑️ Hapus</button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach Event Handlers
    galleryGrid.querySelectorAll('.innovation-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-inovasi-card')) return;
        const projId = card.getAttribute('data-project');
        const proj = getStoredInnovations().find(p => p.id === projId);
        if (proj) showInnovationDetailModal(proj);
      });
    });

    galleryGrid.querySelectorAll('.btn-delete-inovasi-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-inovasi-id');
        const proj = getStoredInnovations().find(p => p.id === id);
        if (proj) openDeleteInovasiModal(proj.id, proj.title);
      });
    });
  }

  function showInnovationDetailModal(proj) {
    const content = `
      <div class="modal-section">
        <h4 class="modal-section-title">Latar Belakang & Urgensi Masalah</h4>
        <p>${proj.problem || 'Belum diisi.'}</p>
      </div>
      <div class="modal-section">
        <h4 class="modal-section-title">Solusi Inovatif & Pendekatan Pedagogik</h4>
        <p>${proj.solution || 'Belum diisi.'}</p>
      </div>
      <div class="modal-section">
        <h4 class="modal-section-title">Teknologi & Tumpukan Sistem</h4>
        <p><code style="background: rgba(99,102,241,0.15); color: var(--primary); padding: 4px 8px; border-radius: 4px;">${proj.tech || 'Web / Digital'}</code></p>
      </div>
      <div class="modal-section">
        <h4 class="modal-section-title">Hasil Uji Coba & Dampak Nyata</h4>
        <p>${proj.impact || 'Diimplementasikan pada peserta didik dan divalidasi dengan predikat Sangat Baik.'}</p>
      </div>
    `;

    openModal(proj.title, proj.categoryName || proj.category, content, "Uji Coba Demo Karya", () => {
      showToast('Membuka Demo', `Menghubungkan ke server demo karya: ${proj.title}`, 'info');
    });
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentInovasiFilter = btn.getAttribute('data-filter') || 'all';
      renderInnovationGallery();
    });
  });

  // Modal Tambah Karya Inovasi Handlers
  const addInovasiModalBackdrop = document.getElementById('addInovasiModalBackdrop');
  const openAddInovasiModalBtn = document.getElementById('openAddInovasiModalBtn');
  const addInovasiCloseBtn = document.getElementById('addInovasiCloseBtn');
  const cancelAddInovasiBtn = document.getElementById('cancelAddInovasiBtn');
  const addInovasiForm = document.getElementById('addInovasiForm');

  function openAddInovasiModal() {
    if (!addInovasiModalBackdrop) return;
    if (addInovasiForm) addInovasiForm.reset();
    addInovasiModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeAddInovasiModal() {
    if (!addInovasiModalBackdrop) return;
    addInovasiModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openAddInovasiModalBtn) openAddInovasiModalBtn.addEventListener('click', openAddInovasiModal);
  if (addInovasiCloseBtn) addInovasiCloseBtn.addEventListener('click', closeAddInovasiModal);
  if (cancelAddInovasiBtn) cancelAddInovasiBtn.addEventListener('click', closeAddInovasiModal);
  if (addInovasiModalBackdrop) {
    addInovasiModalBackdrop.addEventListener('click', (e) => {
      if (e.target === addInovasiModalBackdrop) closeAddInovasiModal();
    });
  }

  if (addInovasiForm) {
    addInovasiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('inovasiTitle').value.trim();
      const category = document.getElementById('inovasiCategory').value;
      const icon = document.getElementById('inovasiIcon').value;
      const desc = document.getElementById('inovasiDesc').value.trim();
      const problem = document.getElementById('inovasiProblem').value.trim();
      const solution = document.getElementById('inovasiSolution').value.trim();
      const tech = document.getElementById('inovasiTech').value.trim();
      const badge = document.getElementById('inovasiBadge').value.trim();
      const impact = document.getElementById('inovasiImpact').value.trim();

      if (!title) {
        alert("Judul karya inovasi harus diisi.");
        return;
      }

      const catNames = {
        'web': 'Web & Aplikasi Pembelajaran',
        'modul': 'Modul Ajar Digital',
        'evaluasi': 'Asesmen & Gamifikasi'
      };

      const newItem = {
        id: 'proj-' + Date.now(),
        title: title,
        category: category,
        categoryName: catNames[category] || 'Inovasi Digital',
        desc: desc,
        problem: problem || 'Tantangan pemahaman konsep komputasi peserta didik.',
        solution: solution || 'Penyusunan media digital inovatif dan kontekstual.',
        tech: tech || 'HTML5, CSS, JS',
        badge: badge || 'Inovasi Baru',
        impact: impact || 'Meningkatkan keterlibatan aktif dan nalar kritis siswa.',
        icon: icon || '💡'
      };

      const items = getStoredInnovations();
      items.unshift(newItem);
      saveStoredInnovations(items);

      renderInnovationGallery();
      closeAddInovasiModal();
      showToast('Karya Inovasi Ditambahkan!', `"${title}" berhasil dimasukkan ke galeri.`, 'success');
    });
  }

  // Modal Delete Inovasi Handlers
  const deleteInovasiConfirmModalBackdrop = document.getElementById('deleteInovasiConfirmModalBackdrop');
  const deleteInovasiCloseBtn = document.getElementById('deleteInovasiCloseBtn');
  const cancelDeleteInovasiBtn = document.getElementById('cancelDeleteInovasiBtn');
  const confirmDeleteInovasiBtn = document.getElementById('confirmDeleteInovasiBtn');
  const deleteInovasiTitleSpan = document.getElementById('deleteInovasiTitleSpan');

  let pendingDeleteInovasiId = null;

  function openDeleteInovasiModal(id, title) {
    if (!deleteInovasiConfirmModalBackdrop) return;
    pendingDeleteInovasiId = id;
    if (deleteInovasiTitleSpan) deleteInovasiTitleSpan.textContent = `"${title}"`;
    deleteInovasiConfirmModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDeleteInovasiModal() {
    if (!deleteInovasiConfirmModalBackdrop) return;
    deleteInovasiConfirmModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    pendingDeleteInovasiId = null;
  }

  if (deleteInovasiCloseBtn) deleteInovasiCloseBtn.addEventListener('click', closeDeleteInovasiModal);
  if (cancelDeleteInovasiBtn) cancelDeleteInovasiBtn.addEventListener('click', closeDeleteInovasiModal);
  if (deleteInovasiConfirmModalBackdrop) {
    deleteInovasiConfirmModalBackdrop.addEventListener('click', (e) => {
      if (e.target === deleteInovasiConfirmModalBackdrop) closeDeleteInovasiModal();
    });
  }

  if (confirmDeleteInovasiBtn) {
    confirmDeleteInovasiBtn.addEventListener('click', () => {
      if (!pendingDeleteInovasiId) return;
      let items = getStoredInnovations();
      const target = items.find(p => p.id === pendingDeleteInovasiId);
      const title = target ? target.title : 'Karya Inovasi';
      items = items.filter(p => p.id !== pendingDeleteInovasiId);
      saveStoredInnovations(items);

      renderInnovationGallery();
      closeDeleteInovasiModal();
      showToast('Karya Dihapus', `"${title}" telah dihapus dari galeri.`, 'info');
    });
  }

  // Initial render of innovation gallery
  renderInnovationGallery();

  /* ==========================================================================
     6. DYNAMIC REPOSITORY & UPLOAD ENGINE
     ========================================================================== */
  
  /* ==========================================================================
     6. PERSISTENT STORAGE ENGINE: INDEXEDDB + LOCALSTORAGE METADATA SYNC
     ========================================================================== */
  
  const DB_NAME = 'PPG_Seminar_Portfolio_DB';
  const DB_VERSION = 1;
  const DOCS_STORE = 'documents';
  const FILES_STORE = 'files';
  const STORAGE_KEY = 'seminar_crud_documents_v5';

  // Base default official PPG documents for Muhammad Iqbal Nugroho, S.Kom.
  const defaultOfficialDocuments = [
    {
      id: 'doc-lk2',
      title: "Lembar Kerja 2 (LK 2) - Desain Refleksi Kritis Mata Kuliah Semester 1",
      desc: "Dokumen refleksi komprehensif mata kuliah inti & selektif Semester 1 PPG Prajabatan Informatika.",
      category: "jurnal",
      categoryName: "Jurnal Refleksi",
      format: "DOCX",
      size: "2.68 MB",
      status: "✓ Terverifikasi",
      icon: "📝",
      fileName: "LEMBAR KERJA 2 (LK 2).docx",
      fileUrl: "LEMBAR KERJA 2 (LK 2).docx",
      isUserUploaded: false,
      hasFileBlob: false
    },
    {
      id: 'doc-1',
      title: "Jurnal Refleksi Kritis Semester I & II (Model Gibbs & 4F)",
      desc: "Dokumentasi perjalanan mingguan, evaluasi perkuliahan, dan refleksi diri.",
      category: "jurnal",
      categoryName: "Jurnal Refleksi",
      format: "PDF",
      size: "2.8 MB",
      status: "✓ Terverifikasi",
      icon: "📄",
      fileName: "Jurnal_Refleksi_Kritis_Iqbal.pdf",
      isUserUploaded: false,
      hasFileBlob: false
    },
    {
      id: 'doc-2',
      title: "Modul Ajar Berdiferensiasi Informatika Fase E (Lengkap dengan LKPD)",
      desc: "Perangkat ajar 3 siklus: ATP, CP, Rubrik Asesmen Diagnostik & Formatif.",
      category: "modul",
      categoryName: "Modul & Perangkat",
      format: "PDF",
      size: "4.5 MB",
      status: "✓ Terverifikasi",
      icon: "📘",
      fileName: "Modul_Ajar_Informatika_Fase_E.pdf",
      isUserUploaded: false,
      hasFileBlob: false
    },
    {
      id: 'doc-3',
      title: "Laporan Akhir Praktik Pengalaman Lapangan (PPL I & PPL II)",
      desc: "Laporan komprehensif 700 jam mengajar mandiri di sekolah mitra penugasan.",
      category: "ppl",
      categoryName: "Laporan PPL",
      format: "PDF",
      size: "6.2 MB",
      status: "✓ Disetujui DPL",
      icon: "🏫",
      fileName: "Laporan_Akhir_PPL_I_II_Iqbal.pdf",
      isUserUploaded: false,
      hasFileBlob: false
    },
    {
      id: 'doc-4',
      title: "Laporan Penelitian Tindakan Kelas (PTK): Gamifikasi Algoritma",
      desc: "Studi peningkatan nalar komputasi siswa melalui media CodeLearn Hub.",
      category: "ptk",
      categoryName: "PTK & RTL",
      format: "PDF",
      size: "3.4 MB",
      status: "✓ Terverifikasi",
      icon: "📊",
      fileName: "Laporan_PTK_Gamifikasi_Algoritma.pdf",
      isUserUploaded: false,
      hasFileBlob: false
    },
    {
      id: 'doc-5',
      title: "Dokumen Rencana Tindak Lanjut (RTL) Guru Profesional Lengkap",
      desc: "Matriks program kerja, timeline implementasi, dan target pengembangan keprofesian.",
      category: "ptk",
      categoryName: "PTK & RTL",
      format: "PDF",
      size: "1.9 MB",
      status: "✓ Final",
      icon: "🚀",
      fileName: "Rencana_Tindak_Lanjut_RTL_Iqbal.pdf",
      isUserUploaded: false,
      hasFileBlob: false
    }
  ];

  class SeminarStorageEngine {
    constructor() {
      this.db = null;
      this.isReady = false;
      this.initPromise = this.initDB();
    }

    initDB() {
      return new Promise((resolve) => {
        if (!window.indexedDB) {
          console.warn("IndexedDB tidak didukung pada browser ini. Menggunakan localStorage fallback.");
          this.isReady = true;
          this.updateStatusBadge(false);
          resolve(null);
          return;
        }

        try {
          const request = window.indexedDB.open(DB_NAME, DB_VERSION);

          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(DOCS_STORE)) {
              db.createObjectStore(DOCS_STORE, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(FILES_STORE)) {
              db.createObjectStore(FILES_STORE, { keyPath: 'id' });
            }
          };

          request.onsuccess = (event) => {
            this.db = event.target.result;
            this.isReady = true;
            this.updateStatusBadge(true);
            this.syncInitialDefaults().then(() => resolve(this.db));
          };

          request.onerror = (event) => {
            console.error("IndexedDB open error:", event.target.error);
            this.isReady = true;
            this.updateStatusBadge(false);
            resolve(null);
          };
        } catch (err) {
          console.error("IndexedDB initialization exception:", err);
          this.isReady = true;
          this.updateStatusBadge(false);
          resolve(null);
        }
      });
    }

    updateStatusBadge(isIndexedDBActive) {
      const badgeText = document.getElementById('repoStorageStatusText');
      if (badgeText) {
        badgeText.textContent = isIndexedDBActive 
          ? 'Penyimpanan Berkas Offline Aktif (IndexedDB)' 
          : 'Penyimpanan Lokal Aktif (Web Storage)';
      }
    }

    async syncInitialDefaults() {
      if (!this.db) return;
      try {
        const docs = await this.getAllDocumentsFromDB();
        if (!docs || docs.length === 0) {
          const tx = this.db.transaction([DOCS_STORE], 'readwrite');
          const store = tx.objectStore(DOCS_STORE);
          defaultOfficialDocuments.forEach(doc => store.put(doc));
          this.saveToLocalCache(defaultOfficialDocuments);
        } else {
          // Check if doc-lk2 is present, if not sync it
          const hasLk2 = docs.some(d => d.id === 'doc-lk2' || d.fileName === 'LEMBAR KERJA 2 (LK 2).docx');
          if (!hasLk2) {
            const tx = this.db.transaction([DOCS_STORE], 'readwrite');
            const store = tx.objectStore(DOCS_STORE);
            const lk2Doc = defaultOfficialDocuments.find(d => d.id === 'doc-lk2');
            if (lk2Doc) {
              store.put(lk2Doc);
              docs.unshift(lk2Doc);
            }
          }
          this.saveToLocalCache(docs);
        }
      } catch (e) {
        console.warn("syncInitialDefaults error:", e);
      }
    }

    saveToLocalCache(docs) {
      try {
        const cleanDocs = docs.map(d => {
          const copy = { ...d };
          delete copy.fileData; // Clean metadata only, avoiding localStorage quota overflow
          return copy;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanDocs));
      } catch (e) {
        console.warn("LocalStorage cache save error:", e);
      }
    }

    getLocalCache() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn("LocalStorage read error:", e);
      }
      return null;
    }

    async getAllDocumentsFromDB() {
      if (!this.db) return null;
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction([DOCS_STORE], 'readonly');
          const store = tx.objectStore(DOCS_STORE);
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }

    async getAllDocuments() {
      await this.initPromise;
      if (this.db) {
        const docs = await this.getAllDocumentsFromDB();
        if (docs && docs.length > 0) {
          this.saveToLocalCache(docs);
          return docs;
        }
      }
      const cached = this.getLocalCache();
      if (cached && cached.length > 0) return cached;
      return defaultOfficialDocuments;
    }

    async saveDocument(docData, fileBlob = null) {
      await this.initPromise;
      const doc = {
        ...docData,
        hasFileBlob: !!fileBlob || !!docData.hasFileBlob,
        updatedAt: new Date().toISOString()
      };

      if (this.db) {
        try {
          const tx = this.db.transaction([DOCS_STORE, FILES_STORE], 'readwrite');
          const docStore = tx.objectStore(DOCS_STORE);
          docStore.put(doc);

          if (fileBlob) {
            const fileStore = tx.objectStore(FILES_STORE);
            fileStore.put({
              id: doc.id,
              blob: fileBlob,
              fileName: doc.fileName || fileBlob.name || `${doc.title}.pdf`,
              fileType: fileBlob.type || 'application/octet-stream',
              fileSize: fileBlob.size || 0,
              lastModified: fileBlob.lastModified || Date.now()
            });
          }

          await new Promise((resolve) => {
            tx.oncomplete = resolve;
            tx.onerror = () => resolve();
          });
        } catch (e) {
          console.error("IndexedDB saveDocument transaction error:", e);
        }
      }

      // Update local storage cache
      const all = await this.getAllDocuments();
      const existingIdx = all.findIndex(d => d.id === doc.id);
      if (existingIdx !== -1) {
        all[existingIdx] = doc;
      } else {
        all.unshift(doc);
      }
      this.saveToLocalCache(all);
      return doc;
    }

    async getFileBlob(docId) {
      await this.initPromise;
      if (!this.db) return null;
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction([FILES_STORE], 'readonly');
          const store = tx.objectStore(FILES_STORE);
          const req = store.get(docId);
          req.onsuccess = () => {
            if (req.result && req.result.blob) {
              resolve(req.result.blob);
            } else {
              resolve(null);
            }
          };
          req.onerror = () => resolve(null);
        } catch (e) {
          console.error("Error reading file blob from IndexedDB:", e);
          resolve(null);
        }
      });
    }

    async deleteDocument(docId) {
      await this.initPromise;
      if (this.db) {
        try {
          const tx = this.db.transaction([DOCS_STORE, FILES_STORE], 'readwrite');
          tx.objectStore(DOCS_STORE).delete(docId);
          tx.objectStore(FILES_STORE).delete(docId);
          await new Promise((resolve) => {
            tx.oncomplete = resolve;
            tx.onerror = () => resolve();
          });
        } catch (e) {
          console.error("IndexedDB deleteDocument error:", e);
        }
      }

      const all = (await this.getAllDocuments()).filter(d => d.id !== docId);
      this.saveToLocalCache(all);
      return all;
    }

    async resetToDefaults() {
      await this.initPromise;
      if (this.db) {
        try {
          const tx = this.db.transaction([DOCS_STORE, FILES_STORE], 'readwrite');
          tx.objectStore(DOCS_STORE).clear();
          tx.objectStore(FILES_STORE).clear();
          defaultOfficialDocuments.forEach(doc => tx.objectStore(DOCS_STORE).put(doc));
          await new Promise((resolve) => {
            tx.oncomplete = resolve;
            tx.onerror = () => resolve();
          });
        } catch (e) {
          console.error("IndexedDB resetToDefaults error:", e);
        }
      }
      this.saveToLocalCache(defaultOfficialDocuments);
      return defaultOfficialDocuments;
    }
  }

  const SeminarStorage = new SeminarStorageEngine();

  function getCategoryName(categoryKey) {
    const map = {
      'jurnal': 'Jurnal Refleksi',
      'modul': 'Modul & Perangkat',
      'ppl': 'Laporan PPL',
      'ptk': 'PTK & RTL',
      'tambahan': 'Karya Tambahan'
    };
    return map[categoryKey] || 'Dokumen Portofolio';
  }

  function getFileIcon(format, category) {
    const fmt = (format || '').toLowerCase();
    if (fmt.includes('pdf')) return '📕';
    if (fmt.includes('doc')) return '📘';
    if (fmt.includes('ppt')) return '📙';
    if (fmt.includes('xls')) return '📗';
    if (fmt.includes('zip') || fmt.includes('rar')) return '🗂️';
    if (fmt.includes('png') || fmt.includes('jpg') || fmt.includes('jpeg')) return '🖼️';
    if (category === 'ppl') return '🏫';
    if (category === 'ptk') return '📊';
    if (category === 'modul') return '📘';
    return '📄';
  }

  /* --------------------------------------------------------------------------
     R - READ / RENDER REPOSITORY TABLE
     -------------------------------------------------------------------------- */
  async function renderRepository() {
    if (!repoTableBody) return;
    const query = repoSearchInput ? repoSearchInput.value.toLowerCase().trim() : '';
    const activeTag = getActiveRepoTag();

    const allDocs = await SeminarStorage.getAllDocuments();
    const filtered = allDocs.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(query) || (doc.desc && doc.desc.toLowerCase().includes(query));
      const matchesTag = activeTag === 'all' || doc.category === activeTag;
      return matchesSearch && matchesTag;
    });

    if (filtered.length === 0) {
      repoTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 8px;">📭</div>
            <h5>Tidak ada dokumen yang sesuai kriteria pencarian.</h5>
            <p style="font-size: 0.85rem; margin-top: 4px;">Coba gunakan kata kunci lain atau unggah dokumen baru melalui tombol "Unggah Dokumen".</p>
          </td>
        </tr>
      `;
      return;
    }

    repoTableBody.innerHTML = filtered.map(doc => `
      <tr class="repo-row" data-category="${doc.category}" data-doc-id="${doc.id}">
        <td>
          <div class="doc-info">
            <div class="doc-icon">${doc.icon || getFileIcon(doc.format, doc.category)}</div>
            <div class="doc-title-box">
              <h5>
                ${doc.title}
                ${doc.hasFileBlob ? '<span class="badge-stored-local" title="Berkas asli tersimpan di IndexedDB browser">💾 Tersimpan Lokal</span>' : ''}
                ${doc.isUserUploaded && !doc.hasFileBlob ? '<span class="badge-uploaded" style="font-size: 0.685rem; padding: 2px 7px; border-radius: 4px; margin-left: 6px;">Baru Diunggah</span>' : ''}
              </h5>
              <p>${doc.desc || 'Berkas dokumen terlampir dalam portofolio seminar PPG.'}</p>
            </div>
          </div>
        </td>
        <td><span class="badge-category">${doc.categoryName || getCategoryName(doc.category)}</span></td>
        <td style="color: var(--text-muted); font-size: 0.825rem;">
          <strong>${doc.format || 'PDF'}</strong> • ${doc.size || 'Berkas'}
        </td>
        <td><span style="color: var(--success); font-weight: 700;">${doc.status || '✓ Terverifikasi'}</span></td>
        <td>
          <div class="doc-actions" style="justify-content: flex-end;">
            <button class="btn btn-secondary btn-sm btn-preview-doc-dynamic" data-doc-id="${doc.id}" title="Pratinjau Dokumen">👁️ Pratinjau</button>
            <button class="btn btn-primary btn-sm btn-download-doc-dynamic" data-doc-id="${doc.id}" title="Unduh Berkas">📥 Unduh</button>
            <button class="btn-edit-doc btn-edit-doc-dynamic" data-doc-id="${doc.id}" title="Edit Data Dokumen">✏️ Edit</button>
            <button class="btn-delete-doc btn-delete-doc-dynamic" data-doc-id="${doc.id}" title="Hapus Dokumen">🗑️ Hapus</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Attach Event Handlers
    document.querySelectorAll('.btn-preview-doc-dynamic').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const docId = btn.getAttribute('data-doc-id');
        const docs = await SeminarStorage.getAllDocuments();
        const doc = docs.find(d => d.id === docId);
        if (doc) showDocPreviewModal(doc);
      });
    });

    document.querySelectorAll('.btn-download-doc-dynamic').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const docId = btn.getAttribute('data-doc-id');
        const docs = await SeminarStorage.getAllDocuments();
        const doc = docs.find(d => d.id === docId);
        if (doc) triggerDocDownload(doc);
      });
    });

    document.querySelectorAll('.btn-edit-doc-dynamic').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const docId = btn.getAttribute('data-doc-id');
        const docs = await SeminarStorage.getAllDocuments();
        const doc = docs.find(d => d.id === docId);
        if (doc) openEditModal(doc);
      });
    });

    document.querySelectorAll('.btn-delete-doc-dynamic').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const docId = btn.getAttribute('data-doc-id');
        const docs = await SeminarStorage.getAllDocuments();
        const doc = docs.find(d => d.id === docId);
        if (doc) openDeleteModal(doc.id, doc.title);
      });
    });
  }

  function getActiveRepoTag() {
    const active = document.querySelector('.repo-tag-btn.active');
    return active ? active.getAttribute('data-tag') : 'all';
  }

  if (repoSearchInput) {
    repoSearchInput.addEventListener('input', () => renderRepository());
  }

  repoTagBtns.forEach(tagBtn => {
    tagBtn.addEventListener('click', () => {
      repoTagBtns.forEach(b => b.classList.remove('active'));
      tagBtn.classList.add('active');
      renderRepository();
    });
  });

  // Reset to default documents
  const resetDocsBtn = document.getElementById('resetDocsBtn');
  if (resetDocsBtn) {
    resetDocsBtn.addEventListener('click', async () => {
      if (confirm("Kembalikan seluruh dokumen ke daftar standar resmi PPG Muhammad Iqbal Nugroho, S.Kom.? Dokumen yang diunggah secara lokal akan dibersihkan.")) {
        await SeminarStorage.resetToDefaults();
        await renderRepository();
        showToast('Dokumen Direset', 'Daftar dokumen telah dikembalikan ke standar awal.', 'info');
      }
    });
  }

  /* --------------------------------------------------------------------------
     R - READ / PREVIEW & DOWNLOAD
     -------------------------------------------------------------------------- */
  async function showDocPreviewModal(doc) {
    const fileBlob = await SeminarStorage.getFileBlob(doc.id);
    let blobUrl = fileBlob ? URL.createObjectURL(fileBlob) : null;
    const format = (doc.format || '').toLowerCase();
    const isPdf = format.includes('pdf') || (doc.fileName && doc.fileName.toLowerCase().endsWith('.pdf'));
    const isImage = format.includes('png') || format.includes('jpg') || format.includes('jpeg') || format.includes('webp') || format.includes('svg');

    let previewHtml = '';

    if (fileBlob && isPdf) {
      previewHtml = `
        <div class="modal-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h4 class="modal-section-title" style="margin-bottom: 0;">Pratinjau Dokumen PDF</h4>
            <a href="${blobUrl}" target="_blank" class="btn-preview-link" title="Buka PDF di Tab Browser Baru">
              <span>Buka di Tab Baru</span> ↗️
            </a>
          </div>
          <iframe src="${blobUrl}#toolbar=1" class="pdf-preview-frame" title="Pratinjau PDF ${doc.title}"></iframe>
        </div>
      `;
    } else if (fileBlob && isImage) {
      previewHtml = `
        <div class="modal-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h4 class="modal-section-title" style="margin-bottom: 0;">Pratinjau Gambar / Sertifikat</h4>
            <a href="${blobUrl}" target="_blank" class="btn-preview-link" title="Buka Gambar Ukuran Penuh">
              <span>Ukuran Penuh</span> ↗️
            </a>
          </div>
          <div class="image-preview-box">
            <img src="${blobUrl}" alt="${doc.title}">
          </div>
        </div>
      `;
    } else if (doc.fileName === 'LEMBAR KERJA 2 (LK 2).docx' || (doc.format || '').toUpperCase() === 'DOCX') {
      previewHtml = `
        <div class="modal-section" style="background: var(--bg-surface-raised); padding: 24px; border-radius: var(--radius-md); border: 1px dashed var(--border-color); text-align: center;">
          <div style="font-size: 3.5rem; margin-bottom: 12px;">📝</div>
          <h5 style="font-size: 1.15rem; color: var(--text-main); margin-bottom: 8px;">${doc.title}</h5>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; max-width: 520px; margin: 0 auto 16px auto;">
            Dokumen asli Microsoft Word (.docx) yang memuat refleksi kritis mendalam mata kuliah Semester 1 PPG Prajabatan Informatika.
          </p>
          <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
            <a href="LEMBAR%20KERJA%202%20(LK%202).docx" download="LEMBAR KERJA 2 (LK 2).docx" class="btn btn-primary" style="text-decoration: none;">
              <span>📥 Unduh Berkas DOCX (2.68 MB)</span>
            </a>
          </div>
        </div>
      `;
    } else {
      previewHtml = `
        <div class="modal-section" style="background: var(--bg-surface-raised); padding: 24px; border-radius: var(--radius-md); border: 1px dashed var(--border-color); text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 10px;">${doc.icon || getFileIcon(doc.format, doc.category)}</div>
          <h5 style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 6px;">${doc.title}</h5>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; max-width: 500px; margin: 0 auto 12px auto;">${doc.desc || 'Berkas dokumen telah tervalidasi dan siap untuk dipresentasikan dalam seminar e-portofolio PPG.'}</p>
          <div style="display: inline-flex; gap: 8px; align-items: center; font-size: 0.75rem; background: rgba(99, 102, 241, 0.1); color: var(--primary); padding: 5px 12px; border-radius: var(--radius-full); font-weight: 600;">
            <span>📁 ${doc.fileName || doc.title}</span> • <span>${doc.format || 'PDF'}</span> • <span>${doc.size || 'Berkas'}</span>
          </div>
        </div>
      `;
    }

    const content = `
      <div class="modal-section">
        <h4 class="modal-section-title">Metadata & Rincian Berkas</h4>
        <div style="background: var(--bg-surface-raised); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 14px 18px; margin-bottom: 12px; font-size: 0.85rem; line-height: 1.7;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div><strong>Judul Dokumen:</strong> ${doc.title}</div>
            <div><strong>Kategori:</strong> ${doc.categoryName || getCategoryName(doc.category)}</div>
            <div><strong>Format & Ukuran:</strong> ${doc.format || 'PDF'} (${doc.size || 'N/A'})</div>
            <div><strong>Status Validasi:</strong> <span style="color: var(--success); font-weight: 700;">${doc.status}</span></div>
            <div><strong>Nama File Asli:</strong> ${doc.fileName || doc.title}</div>
            <div><strong>Status Simpan:</strong> <span style="color: var(--success); font-weight: 600;">${fileBlob ? '💾 Tersimpan Permanen (IndexedDB)' : '🏛️ Berkas Standar Resmi PPG'}</span></div>
            <div style="grid-column: span 2;"><strong>Penyusun:</strong> Muhammad Iqbal Nugroho, S.Kom. (NIM PPG: 2301092048)</div>
          </div>
        </div>
      </div>
      ${previewHtml}
    `;

    openModal(`Pratinjau: ${doc.title}`, doc.categoryName || getCategoryName(doc.category), content, `📥 Unduh Berkas (${doc.format || 'PDF'})`, () => {
      triggerDocDownload(doc);
    });
  }

  async function triggerDocDownload(doc) {
    showToast('Menyiapkan Berkas', `Sedang mengambil berkas: ${doc.title}...`, 'info');
    
    // Direct static download for LEMBAR KERJA 2
    if (doc.fileName === 'LEMBAR KERJA 2 (LK 2).docx' || doc.fileUrl) {
      const a = document.createElement('a');
      a.href = doc.fileUrl || 'LEMBAR%20KERJA%202%20(LK%202).docx';
      a.download = doc.fileName || 'LEMBAR KERJA 2 (LK 2).docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Unduhan Berhasil', 'Berkas LEMBAR KERJA 2 (LK 2).docx berhasil diunduh.', 'success');
      return;
    }

    const blob = await SeminarStorage.getFileBlob(doc.id);

    if (blob) {
      // Real uploaded binary file stored in IndexedDB
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName || `${doc.title.replace(/[^a-z0-9]/gi, '_')}.${(doc.format || 'pdf').toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('Unduhan Berhasil', `Berkas asli "${doc.fileName || doc.title}" berhasil diunduh.`, 'success');
    } else {
      // Authentic formatted document blob for PPG Portofolio
      setTimeout(() => {
        const textContent = `================================================================================\nPORTOFOLIO RESMI SEMINAR PPG PRAJABATAN\nUniversitas Negeri / LPTK Mitra\n================================================================================\n\nPENYUSUN      : Muhammad Iqbal Nugroho, S.Kom.\nNIM PPG       : 2301092048\nBIDANG STUDI  : Pendidikan Informatika\nJUDUL DOKUMEN : ${doc.title}\nKATEGORI      : ${doc.categoryName || getCategoryName(doc.category)}\nFORMAT/UKURAN : ${doc.format || 'PDF'} (${doc.size || 'Terarsip'})\nSTATUS        : ${doc.status}\nNAMA BERKAS   : ${doc.fileName || doc.title + '.pdf'}\n\nRINGKASAN & DESKRIPSI DOKUMEN:\n${doc.desc}\n\n--------------------------------------------------------------------------------\nDokumen ini merupakan arsip autentik yang diverifikasi untuk memenuhi standar\nkelulusan Sertifikasi Pendidik PPG Calon Guru.\n================================================================================`;
        const textBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(textBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_')}_Arsip_PPG.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast('Unduhan Selesai', `Arsip resmi "${doc.title}" berhasil diunduh.`, 'success');
      }, 300);
    }
  }

  /* --------------------------------------------------------------------------
     C - CREATE / UPLOAD NEW DOCUMENT (INDEXEDDB SAVED)
     -------------------------------------------------------------------------- */
  function openUploadModal() {
    if (!uploadModalBackdrop) return;
    uploadModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    resetUploadForm();
  }

  function closeUploadModal() {
    if (!uploadModalBackdrop) return;
    uploadModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    resetUploadForm();
  }

  function resetUploadForm() {
    if (uploadDocForm) uploadDocForm.reset();
    currentUploadedFile = null;
    if (docFileInput) docFileInput.value = '';
    if (selectedFileInfo) selectedFileInfo.classList.remove('show');
    if (uploadProgressContainer) uploadProgressContainer.classList.remove('show');
    if (uploadProgressBar) uploadProgressBar.style.width = '0%';
    if (submitUploadBtn) submitUploadBtn.disabled = false;
  }

  if (openUploadModalBtn) openUploadModalBtn.addEventListener('click', openUploadModal);
  if (uploadModalCloseBtn) uploadModalCloseBtn.addEventListener('click', closeUploadModal);
  if (cancelUploadBtn) cancelUploadBtn.addEventListener('click', closeUploadModal);

  if (uploadModalBackdrop) {
    uploadModalBackdrop.addEventListener('click', (e) => {
      if (e.target === uploadModalBackdrop) closeUploadModal();
    });
  }

  // Dropzone drag & drop events
  if (uploadDropzone && docFileInput) {
    uploadDropzone.addEventListener('click', () => docFileInput.click());

    uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropzone.classList.add('dragover');
    });

    uploadDropzone.addEventListener('dragleave', () => {
      uploadDropzone.classList.remove('dragover');
    });

    uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });

    docFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  function handleFileSelection(file) {
    currentUploadedFile = file;
    if (selectedFileInfo && selectedFileName && selectedFileSize) {
      selectedFileName.textContent = file.name;
      selectedFileSize.textContent = formatBytes(file.size);
      selectedFileInfo.classList.add('show');

      const titleInput = document.getElementById('uploadDocTitle');
      if (titleInput && !titleInput.value) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        titleInput.value = cleanName;
      }
    }
  }

  if (removeSelectedFileBtn) {
    removeSelectedFileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentUploadedFile = null;
      if (docFileInput) docFileInput.value = '';
      if (selectedFileInfo) selectedFileInfo.classList.remove('show');
    });
  }

  function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  if (uploadDocForm) {
    uploadDocForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('uploadDocTitle').value.trim();
      const category = document.getElementById('uploadDocCategory').value;
      const desc = document.getElementById('uploadDocDesc').value.trim();
      const status = document.getElementById('uploadDocStatus').value;

      if (!title) {
        alert("Harap masukkan judul dokumen.");
        return;
      }

      if (uploadProgressContainer && uploadProgressBar && uploadProgressPercent && submitUploadBtn) {
        uploadProgressContainer.classList.add('show');
        submitUploadBtn.disabled = true;

        let progress = 0;
        const interval = setInterval(async () => {
          progress += 25;
          uploadProgressBar.style.width = `${progress}%`;
          uploadProgressPercent.textContent = `${progress}%`;

          if (progress >= 100) {
            clearInterval(interval);

            const fileFormat = currentUploadedFile 
              ? currentUploadedFile.name.split('.').pop().toUpperCase() 
              : 'PDF';
            const fileSize = currentUploadedFile 
              ? formatBytes(currentUploadedFile.size) 
              : '1.5 MB';

            const newDoc = {
              id: 'doc-' + Date.now(),
              title: title,
              desc: desc || 'Dokumen otentik diunggah untuk kelengkapan portofolio seminar PPG.',
              category: category,
              categoryName: getCategoryName(category),
              format: fileFormat,
              size: fileSize,
              status: status,
              icon: getFileIcon(fileFormat, category),
              fileName: currentUploadedFile ? currentUploadedFile.name : `${title}.pdf`,
              date: new Date().toLocaleDateString('id-ID'),
              isUserUploaded: true,
              hasFileBlob: !!currentUploadedFile
            };

            // Save document metadata and binary blob directly into IndexedDB
            await SeminarStorage.saveDocument(newDoc, currentUploadedFile);

            await renderRepository();
            closeUploadModal();
            showToast('Dokumen Berhasil Disimpan!', `"${newDoc.title}" tersimpan permanen di Gudang Arsip lokal.`, 'success');
          }
        }, 120);
      }
    });
  }

  /* --------------------------------------------------------------------------
     U - UPDATE / EDIT DOCUMENT METADATA & REPLACEMENT FILE
     -------------------------------------------------------------------------- */
  const editModalBackdrop = document.getElementById('editModalBackdrop');
  const editModalCloseBtn = document.getElementById('editModalCloseBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const editDocForm = document.getElementById('editDocForm');
  const editDocId = document.getElementById('editDocId');
  const editDocTitle = document.getElementById('editDocTitle');
  const editDocCategory = document.getElementById('editDocCategory');
  const editDocDesc = document.getElementById('editDocDesc');
  const editDocStatus = document.getElementById('editDocStatus');
  const editCurrentFileName = document.getElementById('editCurrentFileName');
  const editCurrentFileSize = document.getElementById('editCurrentFileSize');
  const editCurrentFileIcon = document.getElementById('editCurrentFileIcon');
  const editStorageTag = document.getElementById('editStorageTag');
  const editTriggerReplaceFileBtn = document.getElementById('editTriggerReplaceFileBtn');
  const editDocFileInput = document.getElementById('editDocFileInput');
  const editNewSelectedFileInfo = document.getElementById('editNewSelectedFileInfo');
  const editNewSelectedFileName = document.getElementById('editNewSelectedFileName');
  const editNewSelectedFileSize = document.getElementById('editNewSelectedFileSize');
  const removeEditSelectedFileBtn = document.getElementById('removeEditSelectedFileBtn');

  let currentEditReplacementFile = null;

  function openEditModal(doc) {
    if (!editModalBackdrop) return;
    editDocId.value = doc.id;
    editDocTitle.value = doc.title;
    editDocCategory.value = doc.category;
    editDocDesc.value = doc.desc || '';
    editDocStatus.value = doc.status || '✓ Terverifikasi';
    
    if (editCurrentFileName) editCurrentFileName.textContent = doc.fileName || `${doc.title}.${(doc.format || 'pdf').toLowerCase()}`;
    if (editCurrentFileSize) editCurrentFileSize.textContent = `${doc.format || 'PDF'} • ${doc.size || 'Berkas'}`;
    if (editCurrentFileIcon) editCurrentFileIcon.textContent = doc.icon || getFileIcon(doc.format, doc.category);
    if (editStorageTag) {
      editStorageTag.textContent = doc.hasFileBlob ? 'IndexedDB' : 'Standar PPG';
      editStorageTag.style.background = doc.hasFileBlob ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)';
      editStorageTag.style.color = doc.hasFileBlob ? 'var(--success)' : 'var(--primary)';
    }

    // Reset replacement file state
    currentEditReplacementFile = null;
    if (editDocFileInput) editDocFileInput.value = '';
    if (editNewSelectedFileInfo) editNewSelectedFileInfo.classList.remove('show');

    editModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeEditModal() {
    if (!editModalBackdrop) return;
    editModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    currentEditReplacementFile = null;
  }

  if (editModalCloseBtn) editModalCloseBtn.addEventListener('click', closeEditModal);
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);
  if (editModalBackdrop) {
    editModalBackdrop.addEventListener('click', (e) => {
      if (e.target === editModalBackdrop) closeEditModal();
    });
  }

  if (editTriggerReplaceFileBtn && editDocFileInput) {
    editTriggerReplaceFileBtn.addEventListener('click', () => {
      editDocFileInput.click();
    });

    editDocFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        currentEditReplacementFile = file;
        if (editNewSelectedFileName && editNewSelectedFileSize && editNewSelectedFileInfo) {
          editNewSelectedFileName.textContent = file.name;
          editNewSelectedFileSize.textContent = `${formatBytes(file.size)} (Siap menggantikan berkas lama)`;
          editNewSelectedFileInfo.classList.add('show');
        }
      }
    });
  }

  if (removeEditSelectedFileBtn) {
    removeEditSelectedFileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentEditReplacementFile = null;
      if (editDocFileInput) editDocFileInput.value = '';
      if (editNewSelectedFileInfo) editNewSelectedFileInfo.classList.remove('show');
    });
  }

  if (editDocForm) {
    editDocForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = editDocId.value;
      const title = editDocTitle.value.trim();
      const category = editDocCategory.value;
      const desc = editDocDesc.value.trim();
      const status = editDocStatus.value;

      if (!title) {
        alert("Judul dokumen tidak boleh kosong.");
        return;
      }

      const docs = await SeminarStorage.getAllDocuments();
      const index = docs.findIndex(d => d.id === id);
      if (index !== -1) {
        const updatedDoc = { ...docs[index] };
        updatedDoc.title = title;
        updatedDoc.category = category;
        updatedDoc.categoryName = getCategoryName(category);
        updatedDoc.desc = desc;
        updatedDoc.status = status;

        if (currentEditReplacementFile) {
          const fileFormat = currentEditReplacementFile.name.split('.').pop().toUpperCase();
          updatedDoc.format = fileFormat;
          updatedDoc.size = formatBytes(currentEditReplacementFile.size);
          updatedDoc.fileName = currentEditReplacementFile.name;
          updatedDoc.icon = getFileIcon(fileFormat, category);
          updatedDoc.hasFileBlob = true;
          updatedDoc.isUserUploaded = true;
        } else {
          updatedDoc.icon = getFileIcon(updatedDoc.format, category);
        }

        await SeminarStorage.saveDocument(updatedDoc, currentEditReplacementFile);
        await renderRepository();
        closeEditModal();
        showToast('Dokumen Diperbarui!', `Perubahan pada "${title}" berhasil disimpan ke sistem.`, 'success');
      }
    });
  }

  /* --------------------------------------------------------------------------
     D - DELETE / REMOVE DOCUMENT WITH CONFIRMATION
     -------------------------------------------------------------------------- */
  const deleteConfirmModalBackdrop = document.getElementById('deleteConfirmModalBackdrop');
  const deleteConfirmCloseBtn = document.getElementById('deleteConfirmCloseBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteDocBtn = document.getElementById('confirmDeleteDocBtn');
  const deleteDocTitleSpan = document.getElementById('deleteDocTitleSpan');

  let pendingDeleteDocId = null;

  function openDeleteModal(docId, docTitle) {
    if (!deleteConfirmModalBackdrop) return;
    pendingDeleteDocId = docId;
    if (deleteDocTitleSpan) deleteDocTitleSpan.textContent = `"${docTitle}"`;
    deleteConfirmModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDeleteModal() {
    if (!deleteConfirmModalBackdrop) return;
    deleteConfirmModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    pendingDeleteDocId = null;
  }

  if (deleteConfirmCloseBtn) deleteConfirmCloseBtn.addEventListener('click', closeDeleteModal);
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  if (deleteConfirmModalBackdrop) {
    deleteConfirmModalBackdrop.addEventListener('click', (e) => {
      if (e.target === deleteConfirmModalBackdrop) closeDeleteModal();
    });
  }

  if (confirmDeleteDocBtn) {
    confirmDeleteDocBtn.addEventListener('click', async () => {
      if (!pendingDeleteDocId) return;
      const docs = await SeminarStorage.getAllDocuments();
      const targetDoc = docs.find(d => d.id === pendingDeleteDocId);
      const title = targetDoc ? targetDoc.title : 'Dokumen';
      
      await SeminarStorage.deleteDocument(pendingDeleteDocId);

      await renderRepository();
      closeDeleteModal();
      showToast('Dokumen Dihapus', `"${title}" telah dihapus dari repositori dan penyimpanan.`, 'info');
    });
  }

  // Initial render of repository
  renderRepository();

  /* ==========================================================================
     7. MODAL ENGINE HELPERS
     ========================================================================== */
  function openModal(title, subtitle, htmlContent, actionBtnText, actionCallback) {
    if (!modalBackdrop) return;
    modalTitle.textContent = title;
    modalSubtitle.textContent = subtitle;
    modalContent.innerHTML = htmlContent;

    if (actionBtnText && actionCallback) {
      modalActionBtn.style.display = 'inline-flex';
      modalActionBtn.textContent = actionBtnText;
      modalActionBtn.onclick = actionCallback;
    } else {
      modalActionBtn.style.display = 'none';
    }

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     8. TOAST NOTIFICATION ENGINE
     ========================================================================== */
  function showToast(title, message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <h6>${title}</h6>
        <p>${message}</p>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* ==========================================================================
     9. INTERACTIVE EXTENSIONS & POLISH (SCROLL PROGRESS, 3D TILT, COUNTERS)
     ========================================================================== */
  
  // 1. Scroll Progress Bar
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollProgressBar && height > 0) {
      const scrolled = (winScroll / height) * 100;
      scrollProgressBar.style.width = scrolled + '%';
    }
  });

  // 2. Back To Top Floating Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  window.addEventListener('scroll', () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 280) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Interactive 3D Avatar Perspective Tilt
  const avatarWrapper = document.querySelector('.avatar-card-wrapper');
  const avatarCard = document.querySelector('.avatar-card');
  if (avatarWrapper && avatarCard) {
    avatarWrapper.addEventListener('mousemove', (e) => {
      const rect = avatarWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 14;
      const rotateY = (x / rect.width) * 14;
      avatarCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    avatarWrapper.addEventListener('mouseleave', () => {
      avatarCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  // 4. Metric Number Counting Animation
  let countersAnimated = false;
  const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const heroMetrics = document.querySelector('.hero-metrics');
  if (heroMetrics) metricObserver.observe(heroMetrics);

  function animateCounters() {
    const metricItems = document.querySelectorAll('.metric-number');
    metricItems.forEach(item => {
      const rawText = item.textContent.trim();
      if (rawText.includes('700')) {
        animateValue(item, 100, 700, 1000, 'Jam');
      } else if (rawText.includes('100')) {
        animateValue(item, 10, 100, 900, 'Siap');
      }
    });
  }

  function animateValue(obj, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const val = Math.floor(progress * (end - start) + start);
      obj.innerHTML = `${val}+ <span class="metric-unit">${suffix}</span>`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Smooth scroll for all CTA anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

