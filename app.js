/* ==========================================================================
   TENDE ARCHITECTURAL CATALOG 2026
   White Modern Luxury Online Catalog Application Engine (app.js)
   ========================================================================== */

(function () {
  'use strict';

  const IS_GITHUB_PAGES = typeof window !== 'undefined' && window.location && window.location.hostname.includes('github.io');
  const GITHUB_PAGES_BASE = 'https://diyorbekashurbekov.github.io/tende.jalyuzi/';

  function resolveImgUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const clean = String(url).replace(/^\/+/, '');
    const encoded = encodeURI(clean);
    if (IS_GITHUB_PAGES) {
      return GITHUB_PAGES_BASE + encoded;
    }
    return encoded;
  }

  /** Always returns absolute URL for external links (WhatsApp messages etc.) */
  function getFullPhotoUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const clean = String(url).replace(/^\/+/, '');
    return GITHUB_PAGES_BASE + encodeURI(clean);
  }

  function getSafeOnError(rel) {
    if (!rel) return 'this.onerror=null;';
    const clean = String(rel).replace(/^\/+/, '');
    const fallback = GITHUB_PAGES_BASE + encodeURI(clean);
    return "this.onerror=null; this.src='" + fallback + "';";
  }

  // ==========================================================================
  // 1. WATERMARK SWITCHER (ROSE GOLD / WHITE / HIDDEN)
  // ==========================================================================
  const WM_MODES = ['pink', 'white', 'hidden'];
  let currentWmIndex = 0;

  function setWatermarkMode(mode) {
    document.body.classList.remove('wm-mode-white', 'wm-mode-hidden');
    const wmIcon = document.getElementById('wmStateIcon');
    const viewerWmIcon = document.getElementById('viewerWmStateIcon');
    const mDockWmIcon = document.getElementById('mDockWmIcon');

    let iconChar = '🌸';
    if (mode === 'white') {
      document.body.classList.add('wm-mode-white');
      iconChar = '⚪';
    } else if (mode === 'hidden') {
      document.body.classList.add('wm-mode-hidden');
      iconChar = '👁️';
    }
    if (wmIcon) wmIcon.textContent = iconChar;
    if (viewerWmIcon) viewerWmIcon.textContent = iconChar;
    if (mDockWmIcon) mDockWmIcon.textContent = iconChar;
    localStorage.setItem('tende_wm_mode', mode);
  }

  function cycleWatermark() {
    currentWmIndex = (currentWmIndex + 1) % WM_MODES.length;
    setWatermarkMode(WM_MODES[currentWmIndex]);
  }

  // ==========================================================================
  // TOUCH SWIPE GESTURE ENGINE (MOBILE ULTRA-SMOOTH TOUCH GESTURES)
  // ==========================================================================
  function attachSwipeGesture(element, onSwipeLeft, onSwipeRight) {
    if (!element) return;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isSwiping = false;

    element.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startTime = Date.now();
      isSwiping = true;
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
      if (!isSwiping || e.changedTouches.length !== 1) return;
      isSwiping = false;
      const t = e.changedTouches[0];
      const deltaX = t.clientX - startX;
      const deltaY = t.clientY - startY;
      const elapsed = Date.now() - startTime;

      // Ensure horizontal swipe is dominant and above 35px threshold
      if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && elapsed < 800) {
        if (deltaX < 0) {
          if (typeof onSwipeLeft === 'function') onSwipeLeft();
        } else {
          if (typeof onSwipeRight === 'function') onSwipeRight();
        }
      }
    }, { passive: true });
  }

  // ==========================================================================
  // HERO ARCHITECTURAL SLIDER (WIDE ANGLE LUXURY HERO PHOTOS)
  // ==========================================================================
  const HERO_SLIDES = [
    {
      img: 'images/zal/20240106_204902.jpg',
      badge: 'ЗАЛ / ҚОНАҚ БӨЛМЕ • ГОСТИНАЯ',
      title: 'TENDE',
      sub: 'СӘУЛЕТТІК ЖАРЫҚ ПЕН АВТОРЛЫҚ ПЕРДЕЛЕР / ДИЗАЙНЕРСКИЕ ШТОРЫ'
    },
    {
      img: 'images/zal/20230913_014509.jpg',
      badge: 'ПРЕМИУМ КЛАССИКА • ЖАРЫҚ ОЙЫНЫ',
      title: 'TENDE',
      sub: 'ИТАЛЬЯНДЫҚ ЗЫҒЫР МЕН ТАБИҒИ ТЕКСТУРАЛАР / НАТУРАЛЬНЫЙ ТЕКСТИЛЬ'
    },
    {
      img: 'images/holl/20221223_193122.jpg',
      badge: 'ХОЛЛ / ПРИХОЖАЯ • БИІК ВИТРАЖДАР',
      title: 'TENDE',
      sub: 'ЕКІНШІ ЖАРЫҚТЫ КЕҢІСТІКТЕРГЕ АРНАЛҒАН ЖҮЙЕЛЕР / ВТОРОЙ СВЕТ'
    }
  ];
  let currentHeroSlide = 0;
  let heroAutoTimer = null;

  function setHeroSlide(index) {
    if (index < 0) index = HERO_SLIDES.length - 1;
    if (index >= HERO_SLIDES.length) index = 0;
    currentHeroSlide = index;

    const data = HERO_SLIDES[currentHeroSlide];
    const heroImg = document.getElementById('heroPureImg');
    const heroBadge = document.getElementById('heroBadgeText');
    const heroSub = document.getElementById('heroSubCaption');
    const dots = document.querySelectorAll('#heroSliderDots .hero-dot');

    if (heroImg) {
      heroImg.style.opacity = '0.35';
      heroImg.src = resolveImgUrl(data.img);
      heroImg.setAttribute('data-rel', data.img);
      setTimeout(() => { heroImg.style.opacity = '1'; }, 120);
    }
    if (heroBadge) heroBadge.textContent = data.badge;
    if (heroSub) heroSub.textContent = data.sub;

    dots.forEach((dot, dIdx) => {
      dot.classList.toggle('active', dIdx === currentHeroSlide);
    });
  }

  function startHeroAutoPlay() {
    stopHeroAutoPlay();
    heroAutoTimer = setInterval(() => {
      setHeroSlide(currentHeroSlide + 1);
    }, 6000);
  }

  function stopHeroAutoPlay() {
    if (heroAutoTimer) clearInterval(heroAutoTimer);
  }

  function initHeroSlider() {
    const heroMediaFrame = document.getElementById('heroMediaFrame');
    const heroPrevBtn = document.getElementById('heroPrevBtn');
    const heroNextBtn = document.getElementById('heroNextBtn');
    const dots = document.querySelectorAll('#heroSliderDots .hero-dot');

    if (heroPrevBtn) {
      heroPrevBtn.addEventListener('click', () => {
        stopHeroAutoPlay();
        setHeroSlide(currentHeroSlide - 1);
        startHeroAutoPlay();
      });
    }

    if (heroNextBtn) {
      heroNextBtn.addEventListener('click', () => {
        stopHeroAutoPlay();
        setHeroSlide(currentHeroSlide + 1);
        startHeroAutoPlay();
      });
    }

    dots.forEach((dot, dIdx) => {
      dot.addEventListener('click', () => {
        stopHeroAutoPlay();
        setHeroSlide(dIdx);
        startHeroAutoPlay();
      });
    });

    if (heroMediaFrame) {
      attachSwipeGesture(
        heroMediaFrame,
        () => {
          stopHeroAutoPlay();
          setHeroSlide(currentHeroSlide + 1);
          startHeroAutoPlay();
        },
        () => {
          stopHeroAutoPlay();
          setHeroSlide(currentHeroSlide - 1);
          startHeroAutoPlay();
        }
      );
    }

    setHeroSlide(0);
    startHeroAutoPlay();
  }

  // ==========================================================================
  // 2. CURATED 500+ PHOTO DATABASE
  // ==========================================================================
  let ALL_PROJECT_CASES = [];
  let FILTERED_CASES = [];
  let currentCategory = 'all';
  let displayedCount = 24;

  function buildDatabase() {
    const cases = [];

    // 1. ЗАЛ / ҚОНАҚ БӨЛМЕ (Grand Salon & Living cases - 70 cases + 35 tarazList photos = 105 cases, 220 photos)
    if (window.CURTAIN_CASES_DATA && window.CURTAIN_CASES_DATA.cases) {
      window.CURTAIN_CASES_DATA.cases.forEach((c, idx) => {
        const rawList = [c.mainPhoto, ...(c.sidePhotos || []), ...(c.allPhotos || [])].filter(Boolean);
        const photos = Array.from(new Set(rawList));
        const numStr = String(idx + 1).padStart(2, '0');
        const title = (c.title ? c.title.replace(/^ЗАЛ/, 'ЗАЛ / ҚОНАҚ БӨЛМЕ') : '') || `ЗАЛ / ҚОНАҚ БӨЛМЕ • НЫСАН ${numStr}`;
        cases.push({
          id: `zal-${c.id || idx + 1}`,
          category: 'zal',
          title: title,
          mainPhoto: photos[0] || c.mainPhoto,
          sidePhotos: photos.slice(1),
          allPhotos: photos,
          count: photos.length,
          tag: '01 / ЗАЛ • ҚОНАҚ БӨЛМЕ'
        });
      });
    }

    // Include all remaining зал photos (35 photos in images/zal) directly into ЗАЛ
    if (window.CURTAIN_CASES_DATA && window.CURTAIN_CASES_DATA.tarazList) {
      const offset = (window.CURTAIN_CASES_DATA.cases || []).length;
      window.CURTAIN_CASES_DATA.tarazList.forEach((photo, idx) => {
        const numStr = String(offset + idx + 1).padStart(2, '0');
        cases.push({
          id: `zal-${offset + idx + 1}`,
          category: 'zal',
          title: `ЗАЛ / ҚОНАҚ БӨЛМЕ • НЫСАН ${numStr}`,
          mainPhoto: photo,
          sidePhotos: [],
          allPhotos: [photo],
          count: 1,
          tag: '01 / ЗАЛ • ҚОНАҚ БӨЛМЕ'
        });
      });
    }

    // 2. ХОЛЛ / ПРИХОЖАЯ (Grand Foyer & Hall - 61 cases, 123 photos)
    if (window.HOLL_CASES_DATA && window.HOLL_CASES_DATA.stacks) {
      let hCount = 0;
      window.HOLL_CASES_DATA.stacks.forEach((stack, sIdx) => {
        (stack.cases || []).forEach((c, cIdx) => {
          hCount++;
          const main = c.mainPhoto || c.photo;
          const rawList = [main, ...(c.sidePhotos || []), ...(c.allPhotos || [])].filter(Boolean);
          const photos = Array.from(new Set(rawList));
          const numStr = String(hCount).padStart(2, '0');
          const title = (c.title ? c.title.replace(/^ХОЛЛ/, 'ХОЛЛ / ПРИХОЖАЯ') : '') || `ХОЛЛ / ПРИХОЖАЯ • НЫСАН ${numStr}`;
          cases.push({
            id: `holl-${c.id || hCount}`,
            category: 'holl',
            title: title,
            mainPhoto: photos[0] || main,
            sidePhotos: photos.slice(1),
            allPhotos: photos,
            count: photos.length,
            tag: '02 / ХОЛЛ • ПРИХОЖАЯ'
          });
        });
      });
    }

    // 3. ЖАТЫН БӨЛМЕ / СПАЛЬНЯ (Master Bedroom - 79 cases, 176 photos)
    if (window.BEDROOM_CASES_DATA && window.BEDROOM_CASES_DATA.cases) {
      window.BEDROOM_CASES_DATA.cases.forEach((c, idx) => {
        const rawList = [c.mainPhoto, ...(c.sidePhotos || []), ...(c.allPhotos || [])].filter(Boolean);
        const photos = Array.from(new Set(rawList));
        const numStr = String(idx + 1).padStart(2, '0');
        const title = (c.title ? c.title.replace(/^ЖАТЫН/, 'ЖАТЫН / СПАЛЬНЯ') : '') || `ЖАТЫН / СПАЛЬНЯ • НЫСАН ${numStr}`;
        cases.push({
          id: `bedroom-${c.id || idx + 1}`,
          category: 'bedroom',
          title: title,
          mainPhoto: photos[0] || c.mainPhoto,
          sidePhotos: photos.slice(1),
          allPhotos: photos,
          count: photos.length,
          tag: '03 / ЖАТЫН • СПАЛЬНЯ'
        });
      });
    }

    // 4. АС ҮЙ / КУХНЯ (Bespoke Kitchen - 43 cases, 77 photos)
    if (window.KITCHEN_CASES_DATA && window.KITCHEN_CASES_DATA.cases) {
      window.KITCHEN_CASES_DATA.cases.forEach((c, idx) => {
        const rawList = [c.mainPhoto, ...(c.sidePhotos || []), ...(c.allPhotos || [])].filter(Boolean);
        const photos = Array.from(new Set(rawList));
        const numStr = String(idx + 1).padStart(2, '0');
        const title = (c.title ? c.title.replace(/^АС ҮЙ/, 'АС ҮЙ / КУХНЯ') : '') || `АС ҮЙ / КУХНЯ • НЫСАН ${numStr}`;
        cases.push({
          id: `kitchen-${c.id || idx + 1}`,
          category: 'asui',
          title: title,
          mainPhoto: photos[0] || c.mainPhoto,
          sidePhotos: photos.slice(1),
          allPhotos: photos,
          count: photos.length,
          tag: '04 / АС ҮЙ • КУХНЯ'
        });
      });
    }

    // 5. РИМ ШТОРЛАРЫ / ЖАЛЮЗИ (Roman Shades & Blinds - 90 cases, 218 photos)
    if (window.RIM_CASES_DATA && window.RIM_CASES_DATA.stacks) {
      let rCount = 0;
      window.RIM_CASES_DATA.stacks.forEach((stack, sIdx) => {
        (stack.cases || []).forEach((c, cIdx) => {
          rCount++;
          const main = c.mainPhoto || c.photo;
          const rawList = [main, ...(c.sidePhotos || []), ...(c.allPhotos || [])].filter(Boolean);
          const photos = Array.from(new Set(rawList));
          const numStr = String(rCount).padStart(2, '0');
          const title = (c.title ? c.title.replace(/^РИМ/, 'РИМ / ЖАЛЮЗИ') : '') || `РИМ / ЖАЛЮЗИ • НЫСАН ${numStr}`;
          cases.push({
            id: `rim-${c.id || rCount}`,
            category: 'rim',
            title: title,
            mainPhoto: photos[0] || main,
            sidePhotos: photos.slice(1),
            allPhotos: photos,
            count: photos.length,
            tag: '05 / РИМ • ЖАЛЮЗИ'
          });
        });
      });
    }

    // 6. БАСПАЛДАҚ / ЛЕСТНИЦА (Staircase - 13 cases, 39 photos)
    if (window.STAIRS_CASES_DATA && window.STAIRS_CASES_DATA.cases) {
      window.STAIRS_CASES_DATA.cases.forEach((c, idx) => {
        const rawList = [c.mainPhoto, ...(c.sidePhotos || []), ...(c.allPhotos || [])].filter(Boolean);
        const photos = Array.from(new Set(rawList));
        const numStr = String(idx + 1).padStart(2, '0');
        cases.push({
          id: `stairs-${c.id || idx + 1}`,
          category: 'stairs',
          title: c.title || `БАСПАЛДАҚ / ЛЕСТНИЦА • НЫСАН ${numStr}`,
          mainPhoto: photos[0] || c.mainPhoto,
          sidePhotos: photos.slice(1),
          allPhotos: photos,
          count: photos.length,
          tag: '06 / БАСПАЛДАҚ • ЛЕСТНИЦА'
        });
      });
    }

    // 7. ПОКРЫВАЛА / ТӨСЕК ЖАПҚЫШ (Bedspreads - 98 cases, 180 photos)
    if (window.POKRYVALA_CASES_DATA && window.POKRYVALA_CASES_DATA.cases) {
      window.POKRYVALA_CASES_DATA.cases.forEach((c, idx) => {
        const rawList = [c.mainPhoto, ...(c.sidePhotos || []), ...(c.allPhotos || [])].filter(Boolean);
        const photos = Array.from(new Set(rawList));
        const numStr = String(idx + 1).padStart(2, '0');
        const title = c.title || `ПОКРЫВАЛА / ТӨСЕК ЖАПҚЫШ • НЫСАН ${numStr}`;
        cases.push({
          id: `pokryvala-${c.id || idx + 1}`,
          category: 'pokryvala',
          title: title,
          mainPhoto: photos[0] || c.mainPhoto,
          sidePhotos: photos.slice(1),
          allPhotos: photos,
          count: photos.length,
          tag: '07 / ПОКРЫВАЛА • ТӨСЕК ЖАПҚЫШ'
        });
      });
    }

    // Fallbacks
    if (cases.length === 0) {
      const fallbacks = [
        { id: 'z1', category: 'zal', title: 'ЗАЛ • 01', mainPhoto: 'images/zal/20220505_223134.jpg', tag: '01 / ЗАЛ', count: 2 },
        { id: 'h1', category: 'holl', title: 'ХОЛЛ • 02', mainPhoto: 'images/holl/02a8dc5268de5c37373368b763175d69.jpg', tag: '02 / ХОЛЛ', count: 3 },
        { id: 'b1', category: 'bedroom', title: 'ЖАТЫН • 03', mainPhoto: 'images/bedroom/20221222_212022.jpg', tag: '03 / ЖАТЫН', count: 2 },
        { id: 'r1', category: 'asui', title: 'АС ҮЙ • 04', mainPhoto: 'images/kitchen/20221019_220107.jpg', tag: '04 / АС ҮЙ', count: 3 },
        { id: 'rm1', category: 'rim', title: 'РИМ • 05', mainPhoto: 'images/rim/0A9kZ0tC_2weNTqIEmdENY5onRQmu6cRW5QwJDXwZgmlSY69ECYnzlmG8JCk5c_Z.jpg', tag: '05 / РИМ', count: 1 },
        { id: 's1', category: 'stairs', title: 'БАСПАЛДАҚ • 06', mainPhoto: 'images/stairs/IMG-20260424-WA0053.jpg', tag: '06 / БАСПАЛДАҚ', count: 1 },
        { id: 'p1', category: 'pokryvala', title: 'ПОКРЫВАЛА • 07', mainPhoto: 'images/pokryvala/IMG-20250627-WA0018.jpg', tag: '07 / ПОКРЫВАЛА', count: 1 }
      ];
      fallbacks.forEach(f => cases.push({ ...f, allPhotos: [f.mainPhoto], sidePhotos: [] }));
    }

    return cases;
  }

  function updateCategoryBadges() {
    const counts = {
      all: ALL_PROJECT_CASES.length,
      zal: ALL_PROJECT_CASES.filter(c => c.category === 'zal').length,
      holl: ALL_PROJECT_CASES.filter(c => c.category === 'holl').length,
      bedroom: ALL_PROJECT_CASES.filter(c => c.category === 'bedroom').length,
      asui: ALL_PROJECT_CASES.filter(c => c.category === 'asui').length,
      rim: ALL_PROJECT_CASES.filter(c => c.category === 'rim').length,
      stairs: ALL_PROJECT_CASES.filter(c => c.category === 'stairs').length,
      pokryvala: ALL_PROJECT_CASES.filter(c => c.category === 'pokryvala').length
    };
    const map = {
      badgeAll: counts.all,
      badgeZal: counts.zal,
      badgeHoll: counts.holl,
      badgeBedroom: counts.bedroom,
      badgeAsui: counts.asui,
      badgeRim: counts.rim,
      badgeStairs: counts.stairs,
      badgePokryvala: counts.pokryvala
    };
    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });

    const desktopButtons = document.querySelectorAll('#desktopNav .nav-pill');
    desktopButtons.forEach(btn => {
      const cat = btn.getAttribute('data-category');
      const label = btn.querySelector('span');
      if (label && counts[cat] !== undefined) {
        if (cat === 'all') label.textContent = 'БАРЛЫҒЫ / ВСЕ';
        else if (cat === 'zal') label.textContent = `ЗАЛ / ҚОНАҚ БӨЛМЕ (${counts.zal})`;
        else if (cat === 'holl') label.textContent = `ХОЛЛ / ПРИХОЖАЯ (${counts.holl})`;
        else if (cat === 'bedroom') label.textContent = `ЖАТЫН / СПАЛЬНЯ (${counts.bedroom})`;
        else if (cat === 'asui') label.textContent = `АС ҮЙ / КУХНЯ (${counts.asui})`;
        else if (cat === 'rim') label.textContent = `РИМ / ЖАЛЮЗИ (${counts.rim})`;
        else if (cat === 'stairs') label.textContent = `БАСПАЛДАҚ / ЛЕСТНИЦА (${counts.stairs})`;
        else if (cat === 'pokryvala') label.textContent = `ПОКРЫВАЛА (${counts.pokryvala})`;
      }
    });
  }

  function renderProjectsGrid() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const visibleItems = FILTERED_CASES.slice(0, displayedCount);

    if (visibleItems.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--text-secondary);">
          <p style="margin-bottom: 1rem; font-size: 1.05rem;">Бұл санат бойынша нәтиже табылмады / Ничего не найдено.</p>
          <button class="btn-luxe-dark" id="resetFilterBtn">БАРЛЫҒЫН КӨРСЕТУ / ПОКАЗАТЬ ВСЕ</button>
        </div>
      `;
      const btn = document.getElementById('resetFilterBtn');
      if (btn) btn.addEventListener('click', () => filterCases('all', ''));
      return;
    }

    grid.innerHTML = visibleItems.map(item => {
      const photos = (item.allPhotos && item.allPhotos.length > 0) ? item.allPhotos : [item.mainPhoto];
      const hasMultiple = photos.length > 1;
      const initialImg = photos[0];

      return `
        <article class="case-card" data-case-id="${item.id}">
          <div class="case-card-media" title="Үлкейтіп көру / Открыть на весь экран">
            ${hasMultiple ? `
              <div class="card-story-segments">
                ${photos.map((_, i) => `<div class="story-segment-bar ${i === 0 ? 'active' : ''}" data-segment-idx="${i}"></div>`).join('')}
              </div>
              <button class="card-angle-arrow prev" data-dir="-1" title="Алдыңғы ракурс / Назад" aria-label="Предыдущий ракурс">‹</button>
              <button class="card-angle-arrow next" data-dir="1" title="Келесі ракурс / Вперед" aria-label="Следующий ракурс">›</button>
              <span class="swipe-hint-badge">‹ сырғытыңыз / свайп ›</span>
            ` : ''}
            <img src="${resolveImgUrl(initialImg)}" data-rel="${(initialImg || '').replace(/^\/+/, '')}" onerror="${getSafeOnError(initialImg)}" alt="${item.title}" class="case-card-img" loading="lazy" decoding="async">
            <div class="photo-watermark">
              <img src="assets/tende-logo-pink-512.png" alt="TENDE">
            </div>
            <span class="case-card-badge">${item.tag}</span>
            <span class="case-photo-count">${hasMultiple ? `${photos.length} КАДР / ФОТО` : '1 ФОТО'}</span>
          </div>

          ${hasMultiple ? `
            <div class="card-angle-thumbs-strip" title="Ракурсты таңдау / Выбрать ракурс">
              <span class="angle-label-note">РАКУРСТАР / КАДРЫ:</span>
              ${photos.map((p, pIdx) => `
                <img src="${resolveImgUrl(p)}" data-rel="${(p || '').replace(/^\/+/, '')}" onerror="${getSafeOnError(p)}" class="angle-thumb-item ${pIdx === 0 ? 'active' : ''}" data-angle-idx="${pIdx}" title="${pIdx + 1}-кадр" alt="Кадр ${pIdx + 1}" loading="lazy" decoding="async">
              `).join('')}
            </div>
          ` : ''}

          <div class="case-card-body">
            <h3 class="case-title">${item.title}</h3>
            <a href="https://wa.me/77078458493?text=${encodeURIComponent(`Сәлеметсіз бе / Здравствуйте! TENDE онлайн каталогындағы мына жоба бойынша есептегім келеді: ${item.title} (${getFullPhotoUrl(initialImg)})`)}" target="_blank" class="case-wa-direct-btn">
              ЕСЕПТЕУ / РАСЧЕТ ↗
            </a>
          </div>
        </article>
      `;
    }).join('');

    // Attach card interactive angle switching and click handlers
    grid.querySelectorAll('.case-card').forEach(card => {
      const cid = card.getAttribute('data-case-id');
      const item = ALL_PROJECT_CASES.find(c => c.id === cid);
      if (!item) return;

      const photos = (item.allPhotos && item.allPhotos.length > 0) ? item.allPhotos : [item.mainPhoto];
      let currentAngle = 0;

      const mainImg = card.querySelector('.case-card-img');
      const storyBars = card.querySelectorAll('.story-segment-bar');
      const angleThumbs = card.querySelectorAll('.angle-thumb-item');
      const waBtn = card.querySelector('.case-wa-direct-btn');
      const mediaBox = card.querySelector('.case-card-media');
      const titleEl = card.querySelector('.case-title');

      // Preload photos immediately on user pointer/touch anticipation
      card.addEventListener('pointerenter', () => {
        photos.forEach(pUrl => {
          const pImg = new Image();
          pImg.src = resolveImgUrl(pUrl);
        });
      }, { once: true, passive: true });

      card.addEventListener('touchstart', () => {
        photos.forEach(pUrl => {
          const pImg = new Image();
          pImg.src = resolveImgUrl(pUrl);
        });
      }, { once: true, passive: true });

      // Preload secondary frames so switching to the 2nd photo is instantaneous
      if (photos.length > 1) {
        photos.slice(1).forEach(pUrl => {
          const pImg = new Image();
          pImg.src = resolveImgUrl(pUrl);
        });
      }

      function switchAngle(idx) {
        if (photos.length <= 1) return;
        if (idx < 0) idx = photos.length - 1;
        if (idx >= photos.length) idx = 0;
        currentAngle = idx;

        const photoUrl = photos[currentAngle];

        if (mainImg) {
          const cleanRel = (photoUrl || '').replace(/^\/+/, '');
          const targetUrl = resolveImgUrl(photoUrl);

          mainImg.style.opacity = '0.4';
          const pTemp = new Image();
          pTemp.onload = function() {
            mainImg.src = targetUrl;
            mainImg.style.opacity = '1';
          };
          pTemp.onerror = function() {
            mainImg.src = GITHUB_PAGES_BASE + encodeURI(cleanRel);
            mainImg.style.opacity = '1';
          };
          pTemp.src = targetUrl;

          if (pTemp.complete) {
            mainImg.src = targetUrl;
            mainImg.style.opacity = '1';
          }
        }

        storyBars.forEach((bar, bIdx) => {
          bar.classList.toggle('active', bIdx === currentAngle);
        });

        angleThumbs.forEach((th, tIdx) => {
          th.classList.toggle('active', tIdx === currentAngle);
          if (tIdx === currentAngle) {
            th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        });

        if (waBtn) {
          const msg = `Сәлеметсіз бе! TENDE онлайн каталогындағы мына перде бойынша есептегім келеді: ${item.title} (Кадр ${currentAngle + 1}: ${getFullPhotoUrl(photoUrl)})`;
          waBtn.href = `https://wa.me/77078458493?text=${encodeURIComponent(msg)}`;
        }
      }

      // Prev / Next arrow buttons
      card.querySelectorAll('.card-angle-arrow').forEach(arr => {
        arr.addEventListener('click', (e) => {
          e.stopPropagation();
          const dir = parseInt(arr.getAttribute('data-dir'), 10) || 1;
          switchAngle(currentAngle + dir);
        });
      });

      // Mini-thumbnails click, touch and hover
      angleThumbs.forEach((th, tIdx) => {
        th.addEventListener('click', (e) => {
          e.stopPropagation();
          switchAngle(tIdx);
        });
        th.addEventListener('touchend', (e) => {
          e.preventDefault();
          e.stopPropagation();
          switchAngle(tIdx);
        });
        th.addEventListener('mouseenter', () => {
          switchAngle(tIdx);
        });
      });

      // Touch swipe on card media for phone users!
      if (mediaBox && photos.length > 1) {
        attachSwipeGesture(
          mediaBox,
          () => switchAngle(currentAngle + 1), // Swipe left -> Next frame
          () => switchAngle(currentAngle - 1)  // Swipe right -> Prev frame
        );
      }

      // Clicking main media opens Fullscreen Viewer directly at current angle
      if (mediaBox) {
        mediaBox.addEventListener('click', (e) => {
          if (e.target.closest('.card-angle-arrow')) return;
          openViewer(item, currentAngle);
        });
      }

      if (titleEl) {
        titleEl.addEventListener('click', (e) => {
          e.stopPropagation();
          openViewer(item, currentAngle);
        });
      }

      if (waBtn) {
        waBtn.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    });
  }

  function filterCases(category = 'all', searchQuery = '') {
    currentCategory = category;
    displayedCount = 24;

    FILTERED_CASES = ALL_PROJECT_CASES.filter(c => {
      const matchCat = (category === 'all') || (c.category === category);
      const matchSearch = !searchQuery || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    // Update active tab buttons in header & toolbar
    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-category') === category);
    });

    renderProjectsGrid();
  }

  function initCatalogEvents() {
    // Category clicks (both header pills and toolbar pills)
    document.querySelectorAll('[data-category]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const cat = pill.getAttribute('data-category');
        const searchInput = document.getElementById('caseSearchInput');
        const query = searchInput ? searchInput.value.trim() : '';
        filterCases(cat, query);
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    });

    // Search input
    const searchInput = document.getElementById('caseSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterCases(currentCategory, e.target.value.trim());
      });
    }

    // Load more
    const loadMoreCasesBtn = document.getElementById('loadMoreCasesBtn');
    if (loadMoreCasesBtn) {
      loadMoreCasesBtn.addEventListener('click', () => {
        displayedCount += 12;
        renderProjectsGrid();
        if (displayedCount >= FILTERED_CASES.length) {
          loadMoreCasesBtn.style.display = 'none';
        }
      });
    }

    // Infinite smooth scroll
    let isScrollLoading = false;
    window.addEventListener('scroll', () => {
      if (displayedCount >= FILTERED_CASES.length || isScrollLoading) return;
      const scrollPos = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 650;
      if (scrollPos >= threshold) {
        isScrollLoading = true;
        displayedCount += 12;
        renderProjectsGrid();
        if (loadMoreCasesBtn && displayedCount >= FILTERED_CASES.length) {
          loadMoreCasesBtn.style.display = 'none';
        }
        setTimeout(() => { isScrollLoading = false; }, 250);
      }
    }, { passive: true });

    // View switch (Grid vs Stacks)
    const viewModeGridBtn = document.getElementById('viewModeGridBtn');
    const viewModeStacksBtn = document.getElementById('viewModeStacksBtn');
    const projectsGrid = document.getElementById('projectsGrid');
    const projectsStacksView = document.getElementById('projectsStacksView');

    if (viewModeGridBtn && viewModeStacksBtn) {
      viewModeGridBtn.addEventListener('click', () => {
        viewModeGridBtn.classList.add('active');
        viewModeStacksBtn.classList.remove('active');
        if (projectsGrid) projectsGrid.style.display = 'grid';
        if (projectsStacksView) projectsStacksView.style.display = 'none';
        renderProjectsGrid();
      });

      viewModeStacksBtn.addEventListener('click', () => {
        viewModeStacksBtn.classList.add('active');
        viewModeGridBtn.classList.remove('active');
        if (projectsGrid) projectsGrid.style.display = 'none';
        if (projectsStacksView) {
          projectsStacksView.style.display = 'block';
          renderStacksView();
        }
      });
    }
  }

  function renderStacksView() {
    const stacksGrid = document.getElementById('stacksGrid');
    if (!stacksGrid) return;

    const stackGroups = [
      { title: 'ЗАЛ / ҚОНАҚ БӨЛМЕ (ГОСТИНАЯ)', cat: 'zal' },
      { title: 'ХОЛЛ / ПРИХОЖАЯ (ВИТРАЖДАР)', cat: 'holl' },
      { title: 'ЖАТЫН БӨЛМЕ (СПАЛЬНЯ)', cat: 'bedroom' },
      { title: 'АС ҮЙ (КУХНЯ)', cat: 'asui' },
      { title: 'РИМ ШТОРЛАРЫ / ЖАЛЮЗИ', cat: 'rim' },
      { title: 'БАСПАЛДАҚ / ЛЕСТНИЦА (ВИТРАЖДАР)', cat: 'stairs' },
      { title: 'ПОКРЫВАЛА / ТӨСЕК ЖАПҚЫШ (ДИЗАЙНЕРЛІК)', cat: 'pokryvala' }
    ];

    stacksGrid.innerHTML = stackGroups.map(sg => {
      const items = ALL_PROJECT_CASES.filter(c => c.category === sg.cat);
      const slice = items.slice(0, 3);
      const img1 = slice[0] ? resolveImgUrl(slice[0].mainPhoto) : '';
      const img2 = slice[1] ? resolveImgUrl(slice[1].mainPhoto) : img1;
      const img3 = slice[2] ? resolveImgUrl(slice[2].mainPhoto) : img1;

      return `
        <div class="stack-card" data-stack-cat="${sg.cat}">
          <div class="stack-media-fan">
            <img src="${img1}" class="stack-img-item" alt="Stack">
            <img src="${img2}" class="stack-img-item" alt="Stack">
            <img src="${img3}" class="stack-img-item" alt="Stack">
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem;">
            <h4 style="font-family: var(--font-serif); font-size: 1.02rem; color: var(--text-primary);">${sg.title}</h4>
            <span style="font-size: 0.72rem; color: var(--gold-dark); font-weight: 700;">${items.length} ЖОБА / ПРОЕКТ ✦</span>
          </div>
        </div>
      `;
    }).join('');

    stacksGrid.querySelectorAll('.stack-card').forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.getAttribute('data-stack-cat');
        const viewModeGridBtn = document.getElementById('viewModeGridBtn');
        if (viewModeGridBtn) viewModeGridBtn.click();
        filterCases(cat);
      });
    });
  }

  // ==========================================================================
  // 3. FULLSCREEN VIEWER / LIGHTBOX
  // ==========================================================================
  let activeCase = null;
  let activePhotoIndex = 0;

  function openViewer(caseItem, startIdx = 0) {
    activeCase = caseItem;
    activePhotoIndex = (typeof startIdx === 'number' && startIdx >= 0) ? startIdx : 0;

    const viewer = document.getElementById('dhFullscreenViewer');
    if (!viewer) return;

    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateViewerContent();
  }

  function closeViewer() {
    const viewer = document.getElementById('dhFullscreenViewer');
    if (viewer) viewer.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateViewerContent() {
    if (!activeCase) return;

    const photos = activeCase.allPhotos && activeCase.allPhotos.length > 0
      ? activeCase.allPhotos
      : [activeCase.mainPhoto];

    const currentPhoto = photos[activePhotoIndex];

    const viewerImg = document.getElementById('viewerImg');
    const viewerLoader = document.getElementById('viewerLoader');
    const viewerTag = document.getElementById('viewerTag');
    const viewerCounter = document.getElementById('viewerCounter');
    const viewerWaLink = document.getElementById('viewerWaLink');
    const viewerFilmstrip = document.getElementById('viewerFilmstrip');

    if (viewerImg) {
      const cleanRel = (currentPhoto || '').replace(/^\/+/, '');
      const targetSrc = resolveImgUrl(currentPhoto);

      // Smooth loading state
      if (viewerLoader) viewerLoader.classList.add('active');
      viewerImg.classList.remove('loaded');

      const tempImg = new Image();
      tempImg.onload = function() {
        viewerImg.src = targetSrc;
        viewerImg.classList.add('loaded');
        if (viewerLoader) viewerLoader.classList.remove('active');
      };
      tempImg.onerror = function() {
        viewerImg.src = GITHUB_PAGES_BASE + encodeURI(cleanRel);
        viewerImg.classList.add('loaded');
        if (viewerLoader) viewerLoader.classList.remove('active');
      };
      tempImg.src = targetSrc;

      if (tempImg.complete) {
        viewerImg.src = targetSrc;
        viewerImg.classList.add('loaded');
        if (viewerLoader) viewerLoader.classList.remove('active');
      }

      // Preload adjacent frames for instant response when user navigates
      if (photos.length > 1) {
        const nextIdx = (activePhotoIndex + 1) % photos.length;
        const prevIdx = (activePhotoIndex - 1 + photos.length) % photos.length;
        const pNext = new Image();
        pNext.src = resolveImgUrl(photos[nextIdx]);
        const pPrev = new Image();
        pPrev.src = resolveImgUrl(photos[prevIdx]);
      }
    }
    if (viewerTag) viewerTag.textContent = activeCase.tag || 'TENDE';
    if (viewerCounter) viewerCounter.textContent = `${activePhotoIndex + 1} / ${photos.length}`;

    if (viewerWaLink) {
      const msg = `Сәлеметсіз бе / Здравствуйте! Мені мына жоба қызықтырды / Интересует проект: ${activeCase.title} (${getFullPhotoUrl(currentPhoto)}). Бағасын білгім келеді / Подскажите стоимость?`;
      viewerWaLink.href = `https://wa.me/77078458493?text=${encodeURIComponent(msg)}`;
    }

    if (viewerFilmstrip) {
      viewerFilmstrip.innerHTML = photos.map((p, idx) => `
        <img src="${resolveImgUrl(p)}" onerror="${getSafeOnError(p)}" class="filmstrip-thumb ${idx === activePhotoIndex ? 'active' : ''}" data-idx="${idx}" alt="Thumb" loading="lazy" decoding="async">
      `).join('');

      viewerFilmstrip.querySelectorAll('.filmstrip-thumb').forEach(th => {
        th.addEventListener('click', () => {
          activePhotoIndex = parseInt(th.getAttribute('data-idx'), 10);
          updateViewerContent();
        });
      });
    }
  }

  function initViewerEvents() {
    const viewerCloseBtn = document.getElementById('viewerCloseBtn');
    const viewerNextBtn = document.getElementById('viewerNextBtn');
    const viewerPrevBtn = document.getElementById('viewerPrevBtn');
    const viewerWmToggleBtn = document.getElementById('viewerWmToggleBtn');
    const viewerStage = document.querySelector('.viewer-stage');

    if (viewerCloseBtn) viewerCloseBtn.addEventListener('click', closeViewer);
    if (viewerNextBtn) viewerNextBtn.addEventListener('click', () => {
      if (!activeCase) return;
      const photos = activeCase.allPhotos || [activeCase.mainPhoto];
      activePhotoIndex = (activePhotoIndex + 1) % photos.length;
      updateViewerContent();
    });
    if (viewerPrevBtn) viewerPrevBtn.addEventListener('click', () => {
      if (!activeCase) return;
      const photos = activeCase.allPhotos || [activeCase.mainPhoto];
      activePhotoIndex = (activePhotoIndex - 1 + photos.length) % photos.length;
      updateViewerContent();
    });
    if (viewerWmToggleBtn) viewerWmToggleBtn.addEventListener('click', cycleWatermark);

    // Mobile touch swipe inside Fullscreen Lightbox
    if (viewerStage) {
      attachSwipeGesture(
        viewerStage,
        () => { if (viewerNextBtn) viewerNextBtn.click(); }, // Swipe left -> Next
        () => { if (viewerPrevBtn) viewerPrevBtn.click(); }  // Swipe right -> Prev
      );
    }

    window.addEventListener('keydown', (e) => {
      const viewer = document.getElementById('dhFullscreenViewer');
      if (!viewer || !viewer.classList.contains('open')) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight' && viewerNextBtn) viewerNextBtn.click();
      if (e.key === 'ArrowLeft' && viewerPrevBtn) viewerPrevBtn.click();
    });
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();

    ALL_PROJECT_CASES = buildDatabase();
    FILTERED_CASES = [...ALL_PROJECT_CASES];
    updateCategoryBadges();

    const scrollProgressBar = document.getElementById('scrollProgressBar');
    window.addEventListener('scroll', () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      if (scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;
    });

    const wmToggleBtn = document.getElementById('wmToggleBtn');
    const mDockWmToggle = document.getElementById('mDockWmToggle');
    if (wmToggleBtn) wmToggleBtn.addEventListener('click', cycleWatermark);
    if (mDockWmToggle) mDockWmToggle.addEventListener('click', cycleWatermark);

    initCatalogEvents();
    initViewerEvents();

    renderProjectsGrid();

    const savedWm = localStorage.getItem('tende_wm_mode') || 'pink';
    setWatermarkMode(savedWm);
  });

})();
