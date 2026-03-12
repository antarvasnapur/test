/* ============================================================
   layout.js — Single source of truth for Header & Footer
   Injected into every page via <script src="/js/layout.js">
   Uses absolute paths so it works at ANY depth (/stories/, /, etc.)
   ============================================================ */

(function () {
  'use strict';

  /* ── Active link detection ── */
  function isActive(href) {
    const p = window.location.pathname;
    if (href === '/index.html' || href === '/') return p === '/' || p === '/index.html';
    return p.startsWith(href.replace('.html', ''));
  }

  /* ── Inject header ── */
  function injectHeader() {
    const existing = document.querySelector('.site-header');
    if (existing) return; // already in HTML (fallback)

    const links = [
      { href: '/index.html',      label: 'Home' },
      { href: '/all-stories.html', label: 'All Stories' },
      { href: '/category.html',    label: 'Categories' },
      { href: '/tag.html',         label: 'Tags' },
      { href: '/about.html',       label: 'About' },
    ];

    const navHTML = links.map(l =>
      `<a href="${l.href}"${isActive(l.href) ? ' class="active"' : ''}>${l.label}</a>`
    ).join('');

    const mobileNavHTML = [
      { href: '/index.html',       icon: '🏠', label: 'Home' },
      { href: '/all-stories.html', icon: '📚', label: 'All Stories' },
      { href: '/category.html',    icon: '🗂️', label: 'Categories' },
      { href: '/tag.html',         icon: '🏷️', label: 'Tags' },
      { href: '/search.html',      icon: '🔍', label: 'Search' },
    ].map(l => `<a href="${l.href}">${l.icon} ${l.label}</a>`).join('') +
    `<div class="mobile-nav-divider"></div>
     <a href="/about.html">ℹ️ About</a>
     <a href="/contact.html">✉️ Contact</a>`;

    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <div class="header-inner">
        <a href="/index.html" class="site-logo" aria-label="Antarvasnapur Home">
          <span class="logo-icon">📖</span>
          <span class="logo-text"><span class="logo-a">Antarvas</span><span class="logo-b">napur</span></span>
        </a>
        <nav class="header-nav" aria-label="Main navigation">${navHTML}</nav>
        <div class="header-search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" id="header-search-input" placeholder="Search stories..." autocomplete="off" aria-label="Search">
        </div>
        <div class="header-actions">
          <button class="btn-icon" id="dark-toggle" title="Toggle dark mode" aria-label="Toggle dark mode">
            <svg id="dm-moon" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg id="dm-sun" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
          <button class="btn-icon hamburger" id="mobile-menu-open" aria-label="Open menu" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>`;

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.id = 'mobile-menu';
    mobileMenu.setAttribute('role', 'dialog');
    mobileMenu.setAttribute('aria-modal', 'true');
    mobileMenu.innerHTML = `
      <div class="mobile-menu-overlay"></div>
      <div class="mobile-menu-panel">
        <div class="mobile-menu-header">
          <a href="/index.html" class="site-logo" aria-label="Antarvasnapur Home">
            <span class="logo-icon">📖</span>
            <span class="logo-text"><span class="logo-a">Antarvas</span><span class="logo-b">napur</span></span>
          </a>
          <button class="mobile-menu-close" id="mobile-menu-close" aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="mobile-search-wrap" style="margin-bottom:14px;position:relative">
          <svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-l);width:14px;height:14px;pointer-events:none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input id="mobile-search-input" type="search" placeholder="Search stories..." autocomplete="off"
            style="width:100%;padding:9px 13px 9px 32px;border:1px solid var(--border);border-radius:20px;background:var(--bg-sec);color:var(--text);font-size:0.88rem;outline:none;font-family:var(--fh)"
        </div>
        <nav class="mobile-nav" aria-label="Mobile navigation">${mobileNavHTML}</nav>
      </div>`;

    /* Insert notice bar + header + mobile menu at top of body */
    const noticeBar = document.querySelector('.notice-bar');
    const progressBar = document.getElementById('reading-progress');
    const insertAfter = noticeBar || progressBar;

    if (insertAfter && insertAfter.nextSibling) {
      insertAfter.parentNode.insertBefore(header, insertAfter.nextSibling);
      header.parentNode.insertBefore(mobileMenu, header.nextSibling);
    } else {
      document.body.prepend(mobileMenu);
      document.body.prepend(header);
    }
  }

  /* ── Inject footer ── */
  function injectFooter() {
    const existing = document.querySelector('.site-footer');
    if (existing) return;

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="footer-main">
        <div class="footer-brand">
          <a href="/index.html" class="site-logo footer-logo" aria-label="Antarvasnapur Home">
            <span class="logo-icon">📖</span>
            <span class="logo-text"><span class="logo-a">Antarvas</span><span class="logo-b">napur</span></span>
          </a>
          <p class="footer-tagline">हिंदी कहानियों का सबसे बड़ा संग्रह</p>
          <p class="footer-desc">Read the best romantic, desi, village, bhabhi, and college stories in Hindi. New stories added daily.</p>
          <div class="footer-badges">
            <span class="footer-badge">🔞 Adults 18+ Only</span>
            <span class="footer-badge">📖 1000+ Stories</span>
            <span class="footer-badge">🆓 Free Forever</span>
          </div>
        </div>
        <div class="footer-col">
          <h4>Stories</h4>
          <ul>
            <li><a href="/all-stories.html">All Stories</a></li>
            <li><a href="/category.html">Categories</a></li>
            <li><a href="/tag.html">Tags</a></li>
            <li><a href="/search.html">Search</a></li>
            <li><a href="/sitemap.html">Sitemap</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a href="/category.html?c=Romantic+Stories">Romantic</a></li>
            <li><a href="/category.html?c=Desi+Stories">Desi</a></li>
            <li><a href="/category.html?c=Bhabhi+Stories">Bhabhi</a></li>
            <li><a href="/category.html?c=Village+Stories">Village</a></li>
            <li><a href="/category.html?c=College+Stories">College</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Info</h4>
          <ul>
            <li><a href="/about.html">About Us</a></li>
            <li><a href="/contact.html">Contact</a></li>
            <li><a href="/privacy-policy.html">Privacy Policy</a></li>
            <li><a href="/disclaimer.html">Disclaimer</a></li>
            <li><a href="/terms.html">Terms</a></li>
            <li><a href="/dmca.html">DMCA</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">© 2024 Antarvasnapur. All rights reserved. For adults 18+ only.</p>
        <div class="footer-legal">
          <a href="/privacy-policy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
          <a href="/dmca.html">DMCA</a>
          <a href="/disclaimer.html">Disclaimer</a>
        </div>
      </div>`;

    document.body.appendChild(footer);
  }

  /* ── Inject back-to-top button ── */
  function injectBackToTop() {
    if (document.getElementById('back-to-top')) return;
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.title = 'Back to top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 15-6-6-6 6"/></svg>`;
    document.body.appendChild(btn);
  }

  /* ── Dark mode ── */
  function initDarkMode() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      updateDarkIcons(true);
    }

    document.addEventListener('click', e => {
      const btn = e.target.closest('#dark-toggle, [data-dark-toggle]');
      if (!btn) return;
      const nowDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', nowDark ? 'light' : 'dark');
      localStorage.setItem('theme', nowDark ? 'light' : 'dark');
      updateDarkIcons(!nowDark);
    });
  }

  function updateDarkIcons(isDark) {
    const moon = document.getElementById('dm-moon');
    const sun  = document.getElementById('dm-sun');
    if (moon) moon.style.display = isDark ? 'none' : 'block';
    if (sun)  sun.style.display  = isDark ? 'block' : 'none';
  }

  /* ── Mobile menu ── */
  function initMobileMenu() {
    document.addEventListener('click', e => {
      const menu = document.getElementById('mobile-menu');
      if (!menu) return;
      if (e.target.closest('#mobile-menu-open'))  { menu.classList.add('open'); return; }
      if (e.target.closest('#mobile-menu-close')) { menu.classList.remove('open'); return; }
      if (e.target.closest('.mobile-menu-overlay')) { menu.classList.remove('open'); }
    });
  }

  /* ── Search handlers ── */
  function initSearch() {
    document.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const t = e.target;
      if (t.id === 'header-search-input' || t.id === 'mobile-search-input') {
        const q = t.value.trim();
        if (q) window.location.href = '/search.html?q=' + encodeURIComponent(q);
      }
    });
  }

  /* ── Back to top ── */
  function initBackToTop() {
    window.addEventListener('scroll', () => {
      const btn = document.getElementById('back-to-top');
      if (btn) btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    document.addEventListener('click', e => {
      if (e.target.closest('#back-to-top')) window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Run ── */
  function init() {
    injectHeader();
    injectFooter();
    injectBackToTop();
    initDarkMode();
    initMobileMenu();
    initSearch();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
