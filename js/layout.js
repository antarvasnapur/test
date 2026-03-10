/**
 * layout.js — Single source of truth for Header & Footer
 * Works like WordPress header.php / footer.php
 * Include this script on every page BEFORE closing </body>
 * It auto-injects header, mobile nav, footer, back-to-top, and
 * loads all shared scripts (darkmode, progress, random, analytics).
 */

(function () {

  /* ─────────────────────────────────────────
     HEADER HTML
  ───────────────────────────────────────── */
  const HEADER_HTML = `
<div id="progress-bar"></div>

<header>
  <div class="header-inner">
    <a class="logo" href="/"><span class="logo-main">अंतरवासना</span><span class="logo-accent">पुर</span></a>

    <nav id="desktop-nav">
      <a href="/">होम</a>
      <a href="/all-stories.html">सभी कहानियाँ</a>
      <a href="/category.html?cat=desi">देसी</a>
      <a href="/category.html?cat=romance">रोमांस</a>
      <a href="/category.html?cat=family">परिवार</a>
      <a href="/category.html?cat=village">गाँव</a>
    </nav>

    <div class="header-actions">
      <button id="darkmode-btn" class="btn-icon" title="डार्क मोड">🌙</button>
      <button class="hamburger" id="hamburger" aria-label="मेनू" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<nav class="mobile-nav" id="mobile-nav" aria-hidden="true">
  <a href="/">🏠 होम</a>
  <a href="/all-stories.html">📚 सभी कहानियाँ</a>
  <a href="/category.html?cat=desi">🌾 देसी</a>
  <a href="/category.html?cat=romance">❤️ रोमांस</a>
  <a href="/category.html?cat=family">👨‍👩‍👧 परिवार</a>
  <a href="/category.html?cat=village">🏡 गाँव</a>
  <a href="/category.html?cat=college">🎓 कॉलेज</a>
  <a href="/category.html?cat=festival">🎉 त्योहार</a>
  <a href="/search.html">🔍 खोजें</a>
  <hr style="border:none;border-top:1px solid var(--border);margin:6px 0;">
  <a href="/about.html">हमारे बारे में</a>
  <a href="/contact.html">संपर्क</a>
  <a href="/privacy-policy.html">गोपनीयता नीति</a>
</nav>`;

  /* ─────────────────────────────────────────
     FOOTER HTML
  ───────────────────────────────────────── */
  const FOOTER_HTML = `
<footer class="footer-v2">
  <div class="footer-bottom-bar footer-only-bar">
    <div class="footer-bottom-inner">
      <span class="footer-copy">© 2026 AntarVasna Pur</span>
      <div class="footer-legal">
        <a href="/">Home</a>
        <a href="/all-stories.html">Stories</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
        <a href="/privacy-policy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
        <a href="/disclaimer.html">Disclaimer</a>
        <a href="/dmca.html">DMCA</a>
      </div>
    </div>
  </div>
</footer>

<button id="back-to-top" title="ऊपर जाएं">↑</button>`;

  /* ─────────────────────────────────────────
     INJECT INTO DOM
  ───────────────────────────────────────── */
  function inject() {
    // Insert header before first child of body
    const headerWrap = document.createElement('div');
    headerWrap.innerHTML = HEADER_HTML;
    // Prepend all nodes at the very top of body
    const body = document.body;
    const firstChild = body.firstChild;
    Array.from(headerWrap.childNodes).reverse().forEach(node => {
      body.insertBefore(node, firstChild);
    });

    // Append footer before </body>
    const footerWrap = document.createElement('div');
    footerWrap.innerHTML = FOOTER_HTML;
    Array.from(footerWrap.childNodes).forEach(node => {
      body.appendChild(node);
    });
  }

  /* ─────────────────────────────────────────
     HAMBURGER LOGIC
  ───────────────────────────────────────── */
  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });

    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ─────────────────────────────────────────
     ACTIVE NAV LINK
  ───────────────────────────────────────── */
  function setActiveNav() {
    const path = window.location.pathname;
    const params = window.location.search;
    document.querySelectorAll('header nav a, .mobile-nav a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      // Exact match or query match
      const fullHref = href.split('?')[0];
      const fullPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
      if (
        href === path ||
        href === path + params ||
        (fullHref !== '/' && fullPath.includes(fullHref))
      ) {
        a.classList.add('active');
      }
    });
    // Homepage special case
    if (path === '/' || path === '/index.html') {
      document.querySelectorAll('header nav a[href="/"], .mobile-nav a[href="/"]').forEach(a => a.classList.add('active'));
    }
  }

  /* ─────────────────────────────────────────
     BACK TO TOP
  ───────────────────────────────────────── */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─────────────────────────────────────────
     PROGRESS BAR
  ───────────────────────────────────────── */
  function initProgressBar() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     DARK MODE
  ───────────────────────────────────────── */
  function initDarkMode() {
    const KEY = 'avp-theme';
    const btn = document.getElementById('darkmode-btn');

    function setTheme(dark) {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      localStorage.setItem(KEY, dark ? 'dark' : 'light');
      if (btn) btn.textContent = dark ? '☀️' : '🌙';
    }

    // Apply saved preference immediately
    const saved = localStorage.getItem(KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved === 'dark' || (!saved && prefersDark));

    if (btn) {
      btn.addEventListener('click', () => {
        setTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
      });
    }
  }

  /* ─────────────────────────────────────────
     RANDOM STORY BUTTONS
  ───────────────────────────────────────── */
  function initRandomButtons() {
    async function goRandom() {
      if (!window.APP) return;
      const data = await window.APP.loadStories();
      if (!data.stories.length) return;
      const rand = data.stories[Math.floor(Math.random() * data.stories.length)];
      window.location.href = '/stories/' + rand.slug + '.html';
    }
    document.querySelectorAll('[data-random]').forEach(btn => {
      btn.addEventListener('click', e => { e.preventDefault(); goRandom(); });
    });
  }

  /* ─────────────────────────────────────────
     BOOT
  ───────────────────────────────────────── */
  // Inject markup synchronously so it appears before paint
  inject();

  // Init all behaviours after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    initDarkMode();
    initHamburger();
    setActiveNav();
    initProgressBar();
    initBackToTop();
    // Random buttons may be added dynamically, so init after a tick too
    initRandomButtons();
    document.addEventListener('DOMContentLoaded', initRandomButtons);
  }

})();
