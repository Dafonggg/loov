(() => {
  "use strict";

  const data = window.WRAPPED_DATA;
  if (!data) return;

  const SLIDE_META = [
    { index: 0, label: "Sampul", theme: "espresso" },
    { index: 1, label: "1.461 Hari", theme: "cream" },
    { index: 2, label: "Tahun 1 (2022 - 2023)", theme: "mahogany" },
    { index: 3, label: "Tahun 2 (2023 - 2024)", theme: "cream" },
    { index: 4, label: "Tahun 3 (2024 - 2025)", theme: "crimson" },
    { index: 5, label: "Tahun 4 (2025 - 2026)", theme: "espresso" },
    { index: 6, label: "4 Kupon Untukmu", theme: "cream" },
    { index: 7, label: "Galeri Kenangan", theme: "charcoal" },
    { index: 8, label: "Surat Untukmu", theme: "cream" },
  ];

  const VOUCHER_STORAGE_KEY = "loov_claimed_vouchers_v1";

  function loadClaimedVouchers() {
    try {
      const raw = window.localStorage.getItem(VOUCHER_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_err) {
      return [];
    }
  }

  function saveClaimedVouchers(list) {
    try {
      window.localStorage.setItem(VOUCHER_STORAGE_KEY, JSON.stringify(list));
    } catch (_err) {
      // ignore storage errors
    }
  }

  const state = {
    currentSlide: 0,
    hasInitialized: false,
    introOpen: true,
    audioState: "idle",
    counterPlayed: false,
    letterOpened: false,
    letterTimer: null,
    lightboxIndex: 0,
    claimedVouchers: loadClaimedVouchers(),
    lastTriggerEl: null,
  };

  const els = {
    shell: document.getElementById("story-shell"),
    introGate: document.getElementById("intro-gate"),
    introOpenBtn: document.getElementById("intro-open-btn"),
    introSilentBtn: document.getElementById("intro-silent-btn"),
    introRecipient: document.getElementById("intro-recipient"),
    introSender: document.getElementById("intro-sender"),
    stage: document.getElementById("story-stage"),
    slides: Array.from(document.querySelectorAll(".story-slide")),
    progressTrack: document.getElementById("progress-track"),
    slideCounter: document.getElementById("slide-counter"),
    prevBtn: document.getElementById("prev-slide-btn"),
    nextBtn: document.getElementById("next-slide-btn"),
    desktopPrevBtn: document.getElementById("desktop-prev-btn"),
    desktopNextBtn: document.getElementById("desktop-next-btn"),
    musicToggleBtn: document.getElementById("music-toggle-btn"),
    musicBtnText: document.getElementById("music-btn-text"),
    audioStatusLabel: document.getElementById("audio-status-label"),
    audioToast: document.getElementById("audio-toast"),
    audio: document.getElementById("bg-audio"),
    vinylSlideWrap: document.getElementById("vinyl-slide-wrap"),
    vinylDisc: document.getElementById("vinyl-disc"),
    eqBars: document.getElementById("eq-bars"),
    startMusicBtn: document.getElementById("start-with-music-btn"),
    startSilentBtn: document.getElementById("start-silent-btn"),
    drawerOpenBtn: document.getElementById("drawer-open-btn"),
    drawerCloseBtn: document.getElementById("drawer-close-btn"),
    drawer: document.getElementById("chapter-drawer"),
    drawerList: document.getElementById("drawer-list"),
    lightboxModal: document.getElementById("lightbox-modal"),
    lightboxCloseBtn: document.getElementById("lightbox-close-btn"),
    lightboxFrame: document.getElementById("lightbox-frame"),
    lightboxImg: document.getElementById("lightbox-img"),
    lightboxRoll: document.getElementById("lightbox-roll"),
    lightboxCaption: document.getElementById("lightbox-caption"),
    lightboxFileHint: document.getElementById("lightbox-file-hint"),
    lightboxPrevBtn: document.getElementById("lightbox-prev-btn"),
    lightboxNextBtn: document.getElementById("lightbox-next-btn"),
    lightboxCounter: document.getElementById("lightbox-counter"),
    openLetterBtn: document.getElementById("open-letter-btn"),
    envelopeStage: document.getElementById("envelope-stage"),
    envelopeSealedCard: document.getElementById("envelope-sealed-card"),
    letterPaper: document.getElementById("letter-paper"),
    letterBurstLayer: document.getElementById("letter-burst-layer"),
    restartBtn: document.getElementById("restart-story-btn"),
    letterMusicBtn: document.getElementById("letter-music-btn"),
  };

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function formatIdNumber(num) {
    return new Intl.NumberFormat("id-ID").format(num);
  }

  function computeCalendarStats(startIso, endIso) {
    const start = new Date(`${startIso}T00:00:00Z`);
    const end = new Date(`${endIso}T00:00:00Z`);
    const diffMs = Math.max(0, end.getTime() - start.getTime());
    const days = Math.round(diffMs / 86400000);
    const years = Math.max(1, end.getUTCFullYear() - start.getUTCFullYear());
    const months = years * 12;
    const weeks = Math.floor(days / 7);
    const hours = days * 24;
    return { days, years, months, weeks, hours };
  }

  function bindPhotoLoader(frameEl, imgEl, src, alt, objectPosition) {
    frameEl.classList.remove("is-loaded", "is-placeholder");
    frameEl.classList.add("is-loading");
    imgEl.alt = alt || "";
    imgEl.style.objectPosition = objectPosition || "";

    imgEl.onload = () => {
      frameEl.classList.remove("is-loading", "is-placeholder");
      frameEl.classList.add("is-loaded");
    };

    imgEl.onerror = () => {
      frameEl.classList.remove("is-loading", "is-loaded");
      frameEl.classList.add("is-placeholder");
    };

    imgEl.src = encodeURI(src);
  }

  function showToast(message) {
    els.audioToast.textContent = message;
    els.audioToast.hidden = false;
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      els.audioToast.hidden = true;
    }, 3200);
  }

  function updateAudioUI(nextState) {
    state.audioState = nextState;
    const playing = nextState === "playing";
    const loading = nextState === "loading";

    els.musicToggleBtn.setAttribute("aria-pressed", String(playing));
    els.musicToggleBtn.setAttribute(
      "aria-label",
      playing ? "Jeda lagu latar" : "Putar lagu latar"
    );
    els.musicBtnText.textContent = loading ? "Memuat" : playing ? "Jeda" : "Putar";
    els.letterMusicBtn.textContent = playing ? "Jeda Lagu" : "Putar Lagu";

    if (nextState === "playing") {
      els.audioStatusLabel.textContent = `${data.audio.title} - Diputar`;
    } else if (nextState === "loading") {
      els.audioStatusLabel.textContent = "Memuat lagu...";
    } else if (nextState === "error") {
      els.audioStatusLabel.textContent = "Audio gagal dimuat";
    } else if (nextState === "paused") {
      els.audioStatusLabel.textContent = "Lagu dijeda";
    } else {
      els.audioStatusLabel.textContent = "Lagu siap";
    }

    els.vinylSlideWrap.classList.toggle("is-out", playing);
    els.vinylDisc.classList.toggle("is-spinning", playing);
    els.eqBars.classList.toggle("is-active", playing);
    els.startMusicBtn.textContent = playing ? "Mulai Cerita" : "Mulai & Putar Lagu";
    els.startSilentBtn.hidden = playing;
  }

  async function playAudio() {
    if (!els.audio.paused && state.audioState === "playing") return;
    if (!els.audio.src) {
      els.audio.src = encodeURI(data.audio.src);
      els.audio.loop = true;
    }
    try {
      updateAudioUI("loading");
      await els.audio.play();
      updateAudioUI("playing");
    } catch (_err) {
      updateAudioUI("paused");
      showToast("Ketuk tombol Putar di atas untuk menyalakan lagu.");
    }
  }

  function toggleAudio() {
    if (state.audioState === "playing") {
      els.audio.pause();
      updateAudioUI("paused");
    } else {
      playAudio();
    }
  }

  function setupAudioListeners() {
    els.audio.src = encodeURI(data.audio.src);
    els.audio.loop = true;

    els.audio.addEventListener("error", () => {
      updateAudioUI("error");
      showToast("File lagu tidak bisa diputar di browser ini.");
    });

    els.audio.addEventListener("pause", () => {
      if (state.audioState === "playing") {
        updateAudioUI("paused");
      }
    });

    els.audio.addEventListener("play", () => {
      updateAudioUI("playing");
    });
  }

  function hydrateContent() {
    // Intro Gate
    if (els.introRecipient) {
      els.introRecipient.textContent = `Khusus untuk ${data.couple.herName}`;
    }
    if (els.introSender) {
      els.introSender.textContent = `Dari ${data.couple.myName}`;
    }

    // Cover
    document.getElementById("cover-eyebrow").textContent = data.cover.eyebrow;
    document.getElementById("cover-title").textContent = data.cover.title;
    document.getElementById("cover-subtitle").textContent = data.cover.subtitle;
    document.getElementById("vinyl-artist").textContent = data.audio.artist;
    document.getElementById("vinyl-song").textContent = data.audio.title;
    document.getElementById("now-playing-text").textContent =
      `${data.audio.artist} - ${data.audio.title}`;
    bindPhotoLoader(
      document.getElementById("cover-photo-frame"),
      document.getElementById("cover-photo-img"),
      data.cover.photo,
      data.cover.photoAlt
    );

    // Big Number (real calendar math)
    const stats = computeCalendarStats(data.couple.startDate, data.couple.anniversaryDate);
    state.totalDays = stats.days;
    document.getElementById("number-eyebrow").textContent = data.reflection.eyebrow;
    document.getElementById("mega-days").textContent = formatIdNumber(stats.days);
    document.getElementById("mega-label").textContent = data.reflection.headline;
    document.getElementById("stat-years").textContent = formatIdNumber(stats.years);
    document.getElementById("stat-months").textContent = formatIdNumber(stats.months);
    document.getElementById("stat-weeks").textContent = formatIdNumber(stats.weeks);
    document.getElementById("stat-hours").textContent = formatIdNumber(stats.hours);
    document.getElementById("number-note").textContent = data.reflection.note;

    // Chapters (Slides 2 - 5)
    document.querySelectorAll("[data-chapter-slot]").forEach((container) => {
      const idx = Number(container.getAttribute("data-chapter-slot"));
      const ch = data.chapters[idx];
      if (!ch) return;

      const isCream = ch.theme === "cream";
      const isCrimson = ch.theme === "crimson";
      const headingClass = isCream ? "section-heading-dark" : "section-heading-light";
      const eyebrowClass = isCream ? "eyebrow eyebrow-dark" : "eyebrow";
      const aspectClass = isCrimson
        ? "chapter-photo-aspect-cinema"
        : ch.theme === "espresso"
        ? "chapter-photo-aspect-square"
        : "chapter-photo-aspect-portrait";

      const cleanPath = ch.photo.replace("./", "");

      const cardStageHtml = `
        <div class="chapter-card-stage">
          <button
            type="button"
            class="flip-card-trigger"
            data-flip-target="${ch.id}"
            aria-expanded="false"
            aria-controls="back-${ch.id}"
            aria-label="Ketuk foto ${ch.title} untuk balik kartu"
          >
            <span class="flip-card-scene">
              <span class="flip-card-inner ${aspectClass}" id="flip-${ch.id}">
                <span class="photo-frame flip-face flip-face-front is-loading" id="frame-${ch.id}" aria-hidden="false">
                  <img id="img-${ch.id}" alt="" width="400" height="500" />
                  <span class="photo-placeholder" aria-hidden="true">
                    <span class="placeholder-tag">FOTO TAHUN ${ch.number}</span>
                    <span class="placeholder-hint">Taruh file di:</span>
                    <code>${cleanPath}</code>
                  </span>
                </span>
                <span class="chapter-back-card flip-face flip-face-back" id="back-${ch.id}" aria-hidden="true">
                  <span class="chapter-back-label">Catatan di Balik Foto</span>
                  <span class="chapter-back-text">${ch.backNote}</span>
                  <span class="chapter-location">${ch.yearRange}</span>
                </span>
              </span>
            </span>
          </button>
          <p class="flip-hint" id="hint-${ch.id}">Ketuk foto untuk membaca catatan di baliknya</p>
        </div>
      `;

      const locationHtml = ch.location
        ? `<p class="chapter-location">${ch.location}</p>`
        : "";
      const storyHtml = ch.story
        ? `<p class="chapter-story-text">${ch.story}</p>`
        : "";

      if (isCream) {
        container.innerHTML = `
          <div class="chapter-split-top">
            <span class="chapter-numeral">${ch.number}</span>
            <div>
              <p class="${eyebrowClass}">${ch.yearRange}</p>
              <h2 class="${headingClass}">${ch.title}</h2>
              ${locationHtml}
            </div>
          </div>
          ${cardStageHtml}
          ${storyHtml}
        `;
      } else {
        container.innerHTML = `
          <div class="chapter-header-row">
            <div>
              <p class="${eyebrowClass}">${ch.yearRange}</p>
              <h2 class="${headingClass}">${ch.title}</h2>
              ${locationHtml}
            </div>
            <span class="chapter-numeral">${ch.number}</span>
          </div>
          ${cardStageHtml}
          ${storyHtml}
        `;
      }

      bindPhotoLoader(
        document.getElementById(`frame-${ch.id}`),
        document.getElementById(`img-${ch.id}`),
        ch.photo,
        ch.alt,
        ch.photoPosition
      );
    });

    // 4 Kupon Untukmu (Slide 6)
    document.getElementById("vouchers-eyebrow").textContent = data.vouchers.eyebrow;
    document.getElementById("vouchers-title").textContent = data.vouchers.title;
    document.getElementById("vouchers-subtitle").textContent = data.vouchers.subtitle;
    renderVouchers();

    // Gallery Contact Sheet (ROLL 01 - ROLL 08)
    document.getElementById("gallery-eyebrow").textContent = data.gallery.eyebrow;
    document.getElementById("gallery-title").textContent = data.gallery.title;
    document.getElementById("gallery-subtitle").textContent = data.gallery.subtitle;

    const grid = document.getElementById("contact-sheet-grid");
    grid.innerHTML = "";
    data.gallery.items.forEach((item, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "contact-card-btn";
      btn.setAttribute("data-gallery-index", String(idx));
      btn.setAttribute("aria-label", `Buka foto ${item.dateLabel}`);
      const cleanPath = item.photo.replace("./", "");
      btn.innerHTML = `
        <figure class="photo-frame contact-thumb is-loading" id="thumb-frame-${item.id}">
          <img id="thumb-img-${item.id}" alt="" width="240" height="240" />
          <div class="photo-placeholder" aria-hidden="true">
            <span class="placeholder-tag">${item.dateLabel}</span>
            <code>${cleanPath}</code>
          </div>
        </figure>
        <span class="contact-roll-tag">${item.dateLabel}</span>
      `;
      grid.appendChild(btn);

      bindPhotoLoader(
        document.getElementById(`thumb-frame-${item.id}`),
        document.getElementById(`thumb-img-${item.id}`),
        item.photo,
        item.alt,
        item.photoPosition
      );
    });

    // Letter
    document.getElementById("letter-eyebrow").textContent = data.letter.eyebrow;
    document.getElementById("letter-title").textContent = data.letter.title;
    document.getElementById("envelope-to").textContent = `Untuk ${data.couple.herName}`;
    document.getElementById("letter-greeting").textContent = data.letter.greeting;
    document.getElementById("letter-closing").textContent = data.letter.closing;
    document.getElementById("letter-signature").textContent = data.letter.signature;

    const letterBody = document.getElementById("letter-body");
    letterBody.innerHTML = "";
    data.letter.paragraphs.forEach((pText) => {
      const p = document.createElement("p");
      p.textContent = pText;
      letterBody.appendChild(p);
    });
  }

  function buildProgressAndDrawer() {
    els.progressTrack.innerHTML = "";
    els.drawerList.innerHTML = "";

    SLIDE_META.forEach((meta) => {
      const seg = document.createElement("button");
      seg.type = "button";
      seg.className = "progress-seg";
      seg.setAttribute("role", "tab");
      seg.setAttribute("aria-label", `Buka slide ${meta.index + 1}: ${meta.label}`);
      seg.addEventListener("click", () => goToSlide(meta.index));
      els.progressTrack.appendChild(seg);

      const li = document.createElement("li");
      const itemBtn = document.createElement("button");
      itemBtn.type = "button";
      itemBtn.className = "drawer-item-btn";
      itemBtn.setAttribute("data-jump-slide", String(meta.index));
      itemBtn.innerHTML = `<span>${meta.index + 1}. ${meta.label}</span><span>Buka</span>`;
      itemBtn.addEventListener("click", () => {
        closeDrawer();
        goToSlide(meta.index);
      });
      li.appendChild(itemBtn);
      els.drawerList.appendChild(li);
    });
  }

  function animateDayCounter() {
    if (state.counterPlayed) return;
    state.counterPlayed = true;
    const target = state.totalDays || 1461;
    const daysEl = document.getElementById("mega-days");

    if (prefersReducedMotion()) {
      daysEl.textContent = formatIdNumber(target);
      return;
    }

    const duration = 900;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(target * eased);
      daysEl.textContent = formatIdNumber(val);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        daysEl.textContent = formatIdNumber(target);
      }
    }

    requestAnimationFrame(step);
  }

  function goToSlide(nextIndex) {
    const clamped = Math.max(0, Math.min(SLIDE_META.length - 1, nextIndex));
    const prevSlide = state.currentSlide;
    const isFirstInit = !state.hasInitialized;
    state.currentSlide = clamped;
    state.hasInitialized = true;

    const dirClass = isFirstInit
      ? ""
      : clamped > prevSlide
      ? "enter-from-right"
      : clamped < prevSlide
      ? "enter-from-left"
      : "";

    els.slides.forEach((slide, idx) => {
      const active = idx === clamped;
      slide.classList.remove("enter-from-right", "enter-from-left");
      slide.hidden = !active;
      slide.classList.toggle("is-active", active);
      if (active) {
        if (dirClass && !prefersReducedMotion()) {
          void slide.offsetWidth;
          slide.classList.add(dirClass);
        }
        const scroller = slide.querySelector(".slide-scroll");
        if (scroller) scroller.scrollTop = 0;
      }
    });

    const theme = SLIDE_META[clamped].theme;
    els.shell.setAttribute("data-theme", theme);
    els.slideCounter.textContent = `${clamped + 1} / ${SLIDE_META.length}`;

    // Progress bars
    Array.from(els.progressTrack.children).forEach((seg, idx) => {
      seg.classList.toggle("is-done", idx < clamped);
      seg.classList.toggle("is-current", idx === clamped);
      seg.setAttribute("aria-selected", String(idx === clamped));
    });

    // Drawer current indicator
    els.drawerList.querySelectorAll(".drawer-item-btn").forEach((btn, idx) => {
      btn.classList.toggle("is-current", idx === clamped);
    });

    // Nav disabled states
    const isFirst = clamped === 0;
    const isLast = clamped === SLIDE_META.length - 1;
    els.prevBtn.disabled = isFirst;
    els.desktopPrevBtn.disabled = isFirst;
    els.nextBtn.disabled = isLast;
    els.desktopNextBtn.disabled = isLast;
    els.nextBtn.setAttribute("aria-label", isLast ? "Halaman terakhir" : "Slide berikutnya");

    if (clamped === 1) {
      animateDayCounter();
    }
  }

  function toggleChapterFlip(btn) {
    const id = btn.getAttribute("data-flip-target");
    const inner = document.getElementById(`flip-${id}`);
    const frame = document.getElementById(`frame-${id}`);
    const back = document.getElementById(`back-${id}`);
    const hint = document.getElementById(`hint-${id}`);
    if (!inner || !frame || !back) return;

    const willFlip = !inner.classList.contains("is-flipped");
    inner.classList.toggle("is-flipped", willFlip);
    frame.setAttribute("aria-hidden", String(willFlip));
    back.setAttribute("aria-hidden", String(!willFlip));
    btn.setAttribute("aria-expanded", String(willFlip));
    if (hint) {
      hint.textContent = willFlip
        ? "Ketuk kartu untuk melihat foto kembali"
        : "Ketuk foto untuk membaca catatan di baliknya";
    }
  }

  function openDrawer(triggerEl) {
    state.lastTriggerEl = triggerEl || els.drawerOpenBtn;
    els.drawer.hidden = false;
    els.drawerOpenBtn.setAttribute("aria-expanded", "true");
    els.drawerCloseBtn.focus();
  }

  function closeDrawer() {
    els.drawer.hidden = true;
    els.drawerOpenBtn.setAttribute("aria-expanded", "false");
    if (state.lastTriggerEl) state.lastTriggerEl.focus();
  }

  function renderVouchers() {
    const listEl = document.getElementById("voucher-list");
    const countEl = document.getElementById("vouchers-count");
    if (!listEl || !countEl) return;

    const items = data.vouchers.items || [];
    listEl.innerHTML = "";

    items.forEach((v) => {
      const claimed = state.claimedVouchers.includes(v.id);
      const card = document.createElement("article");
      card.className = `voucher-card${claimed ? " is-claimed" : ""}`;
      card.innerHTML = `
        <div class="voucher-top">
          <span class="voucher-code">${v.code}</span>
          <span class="voucher-status-tag">${claimed ? "Sudah diklaim" : "Siap dipakai"}</span>
        </div>
        <h3 class="voucher-title"></h3>
        <p class="voucher-desc"></p>
        <button
          type="button"
          class="voucher-claim-btn"
          data-voucher-id="${v.id}"
          aria-pressed="${String(claimed)}"
        >
          ${claimed ? "Diklaim (Batal)" : "Klaim Kupon"}
        </button>
      `;
      card.querySelector(".voucher-title").textContent = v.title;
      card.querySelector(".voucher-desc").textContent = v.desc;
      listEl.appendChild(card);
    });

    const claimedCount = items.filter((v) => state.claimedVouchers.includes(v.id)).length;
    countEl.textContent = `${claimedCount} / ${items.length} diklaim`;
  }

  function toggleVoucher(id) {
    if (!id) return;
    const idx = state.claimedVouchers.indexOf(id);
    if (idx >= 0) {
      state.claimedVouchers.splice(idx, 1);
    } else {
      state.claimedVouchers.push(id);
    }
    saveClaimedVouchers(state.claimedVouchers);
    renderVouchers();
  }

  function renderLightboxSlide(index) {
    const items = data.gallery.items;
    if (!items.length) return;
    const wrappedIndex = ((index % items.length) + items.length) % items.length;
    state.lightboxIndex = wrappedIndex;
    const item = items[wrappedIndex];

    els.lightboxRoll.textContent = item.dateLabel;
    const hasCaption = Boolean(item.caption && item.caption.trim());
    els.lightboxCaption.textContent = hasCaption ? item.caption : "";
    els.lightboxCaption.hidden = !hasCaption;
    els.lightboxFileHint.textContent = item.photo.replace("./", "");
    els.lightboxCounter.textContent = `${wrappedIndex + 1} / ${items.length}`;
    bindPhotoLoader(els.lightboxFrame, els.lightboxImg, item.photo, item.alt);
  }

  function stepLightbox(delta) {
    renderLightboxSlide(state.lightboxIndex + delta);
  }

  function openLightbox(index, triggerEl) {
    if (!data.gallery.items[index]) return;
    state.lastTriggerEl = triggerEl;
    renderLightboxSlide(index);
    els.lightboxModal.hidden = false;
    els.lightboxCloseBtn.focus();
  }

  function closeLightbox() {
    els.lightboxModal.hidden = true;
    if (state.lastTriggerEl) state.lastTriggerEl.focus();
  }

  function spawnLetterCelebration() {
    if (prefersReducedMotion()) return;
    els.letterBurstLayer.innerHTML = "";
    const colors = ["#B33A2C", "#F0B85A", "#1C1512"];
    for (let i = 0; i < 16; i += 1) {
      const dot = document.createElement("span");
      dot.className = "burst-dot";
      dot.style.left = `${20 + Math.random() * 60}%`;
      dot.style.top = `${45 + Math.random() * 20}%`;
      dot.style.background = colors[i % colors.length];
      dot.style.setProperty("--dx", `${Math.round((Math.random() - 0.5) * 140)}px`);
      dot.style.setProperty("--dy", `${Math.round(-40 - Math.random() * 110)}px`);
      els.letterBurstLayer.appendChild(dot);
    }
    window.setTimeout(() => {
      els.letterBurstLayer.innerHTML = "";
    }, 1200);
  }

  function openLetter() {
    if (state.letterOpened) return;
    state.letterOpened = true;
    els.openLetterBtn.setAttribute("aria-expanded", "true");

    if (prefersReducedMotion()) {
      els.envelopeStage.setAttribute("data-open", "true");
      els.envelopeSealedCard.hidden = true;
      els.letterPaper.hidden = false;
      els.letterPaper.classList.add("is-revealed");
      return;
    }

    els.envelopeStage.classList.add("is-opening");
    window.clearTimeout(state.letterTimer);
    state.letterTimer = window.setTimeout(() => {
      els.envelopeStage.classList.remove("is-opening");
      els.envelopeStage.setAttribute("data-open", "true");
      els.envelopeSealedCard.hidden = true;
      els.letterPaper.hidden = false;
      els.letterPaper.classList.remove("is-revealed");
      void els.letterPaper.offsetWidth;
      els.letterPaper.classList.add("is-revealed");
      spawnLetterCelebration();
    }, 420);
  }

  function restartStory() {
    window.clearTimeout(state.letterTimer);
    state.letterOpened = false;
    els.envelopeStage.classList.remove("is-opening");
    els.envelopeStage.setAttribute("data-open", "false");
    els.envelopeSealedCard.hidden = false;
    els.letterPaper.hidden = true;
    els.letterPaper.classList.remove("is-revealed");
    els.openLetterBtn.setAttribute("aria-expanded", "false");
    goToSlide(0);
  }

  function openIntroGate(withMusic) {
    if (!state.introOpen || !els.introGate) return;
    state.introOpen = false;

    if (withMusic) {
      playAudio();
    }

    if (prefersReducedMotion()) {
      els.introGate.hidden = true;
      els.startMusicBtn.focus();
      return;
    }

    els.introGate.classList.add("is-opening");
    window.setTimeout(() => {
      els.introGate.hidden = true;
      els.introGate.classList.remove("is-opening");
      els.startMusicBtn.focus();
    }, 860);
  }

  function bindEvents() {
    els.introOpenBtn.addEventListener("click", () => openIntroGate(true));
    els.introSilentBtn.addEventListener("click", () => openIntroGate(false));

    els.startMusicBtn.addEventListener("click", () => {
      playAudio();
      goToSlide(1);
    });

    els.startSilentBtn.addEventListener("click", () => {
      goToSlide(1);
    });

    els.musicToggleBtn.addEventListener("click", toggleAudio);
    els.letterMusicBtn.addEventListener("click", toggleAudio);

    els.prevBtn.addEventListener("click", () => goToSlide(state.currentSlide - 1));
    els.nextBtn.addEventListener("click", () => goToSlide(state.currentSlide + 1));
    els.desktopPrevBtn.addEventListener("click", () => goToSlide(state.currentSlide - 1));
    els.desktopNextBtn.addEventListener("click", () => goToSlide(state.currentSlide + 1));

    els.drawerOpenBtn.addEventListener("click", (e) => openDrawer(e.currentTarget));
    els.drawerCloseBtn.addEventListener("click", closeDrawer);
    els.drawer.addEventListener("click", (e) => {
      if (e.target === els.drawer) closeDrawer();
    });

    els.lightboxCloseBtn.addEventListener("click", closeLightbox);
    els.lightboxPrevBtn.addEventListener("click", () => stepLightbox(-1));
    els.lightboxNextBtn.addEventListener("click", () => stepLightbox(1));
    els.lightboxModal.addEventListener("click", (e) => {
      if (e.target === els.lightboxModal) closeLightbox();
    });

    els.stage.addEventListener("click", (e) => {
      const flipBtn = e.target.closest("[data-flip-target]");
      if (flipBtn) {
        toggleChapterFlip(flipBtn);
        return;
      }
      const voucherBtn = e.target.closest("[data-voucher-id]");
      if (voucherBtn) {
        toggleVoucher(voucherBtn.getAttribute("data-voucher-id"));
        return;
      }
      const galleryBtn = e.target.closest("[data-gallery-index]");
      if (galleryBtn) {
        openLightbox(Number(galleryBtn.getAttribute("data-gallery-index")), galleryBtn);
      }
    });

    els.openLetterBtn.addEventListener("click", openLetter);
    els.restartBtn.addEventListener("click", restartStory);

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!els.lightboxModal.hidden) {
          closeLightbox();
          return;
        }
        if (!els.drawer.hidden) {
          closeDrawer();
          return;
        }
      }

      if (!els.lightboxModal.hidden) {
        if (e.key === "ArrowRight") stepLightbox(1);
        if (e.key === "ArrowLeft") stepLightbox(-1);
        return;
      }

      if (!els.introGate.hidden || !els.drawer.hidden) return;
      if (e.key === "ArrowRight") goToSlide(state.currentSlide + 1);
      if (e.key === "ArrowLeft") goToSlide(state.currentSlide - 1);
    });

    // Touch swipe inside lightbox
    let lbTouchX = 0;
    let lbTouchY = 0;
    els.lightboxModal.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1) return;
        lbTouchX = e.touches[0].clientX;
        lbTouchY = e.touches[0].clientY;
      },
      { passive: true }
    );
    els.lightboxModal.addEventListener(
      "touchend",
      (e) => {
        if (!e.changedTouches.length) return;
        const dx = e.changedTouches[0].clientX - lbTouchX;
        const dy = e.changedTouches[0].clientY - lbTouchY;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
          stepLightbox(dx < 0 ? 1 : -1);
        }
      },
      { passive: true }
    );

    // Touch swipe (horizontal only, ignores vertical scrolling)
    let touchStartX = 0;
    let touchStartY = 0;
    els.stage.addEventListener(
      "touchstart",
      (e) => {
        if (!els.introGate.hidden || e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );
    els.stage.addEventListener(
      "touchend",
      (e) => {
        if (!els.introGate.hidden || !e.changedTouches.length) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 54 && Math.abs(dx) > Math.abs(dy) * 1.4) {
          if (dx < 0) goToSlide(state.currentSlide + 1);
          else goToSlide(state.currentSlide - 1);
        }
      },
      { passive: true }
    );
  }

  function init() {
    hydrateContent();
    buildProgressAndDrawer();
    setupAudioListeners();
    bindEvents();
    goToSlide(0);
  }

  init();
})();
