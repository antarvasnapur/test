/* ===== MAIN.JS - Core site functionality ===== */

// Global state
window.APP = {
  stories: [],
  loaded: false,
  currentPage: 1,
  storiesPerPage: 10
};

// Load stories data
async function loadStories() {
  if (window.APP.loaded) return window.APP.stories;
  try {
    const base = getBasePath();
    const res = await fetch(base + 'data/stories.json');
    const data = await res.json();
    window.APP.stories = data.stories || [];
    window.APP.loaded = true;
    return window.APP.stories;
  } catch (e) {
    console.error('Failed to load stories:', e);
    return [];
  }
}

// Determine base path for assets
function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/stories/')) return '../';
  return '';
}

// Format date in readable format
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Format view count
function formatViews(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Slugify a string (works for Hindi too)
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-\u0900-\u097F]+/g, '-')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Render star rating HTML
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= full) html += '★';
    else if (i === full + 1 && half) html += '½';
    else html += '☆';
  }
  return `<span class="story-rating" title="${rating}/5">${html} ${rating.toFixed(1)}</span>`;
}

// Build story card HTML
function buildStoryCard(story, base = '') {
  const cats = (story.categories || []).map(c =>
    `<a href="${base}category.html?c=${encodeURIComponent(c)}" class="cat-badge">${c}</a>`
  ).join('');
  const tags = (story.tags || []).slice(0, 4).map(t =>
    `<a href="${base}tag.html?t=${encodeURIComponent(t)}" class="tag-chip">${t}</a>`
  ).join('');
  return `
    <article class="story-card">
      <div class="story-card-cats">${cats}</div>
      <h3 class="story-card-title"><a href="${base}stories/${story.slug}.html">${story.title}</a></h3>
      <p class="story-card-excerpt">${story.excerpt}</p>
      <div class="story-card-meta">
        <span class="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${story.readingTime || 5} min read
        </span>
        <span class="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          ${formatViews(story.views)}
        </span>
        ${renderStars(story.rating)}
      </div>
      <div class="story-card-tags">${tags}</div>
    </article>`;
}

// Render skeleton cards while loading
function renderSkeletons(container, count = 6) {
  container.innerHTML = Array(count).fill(`
    <div class="skeleton-card">
      <div class="skeleton skeleton-line" style="width:30%;height:10px;margin-bottom:12px"></div>
      <div class="skeleton skeleton-title" style="height:20px;margin-bottom:12px"></div>
      <div class="skeleton skeleton-line" style="height:12px;margin-bottom:8px"></div>
      <div class="skeleton skeleton-text" style="height:12px;margin-bottom:8px"></div>
      <div class="skeleton skeleton-text" style="height:12px;width:60%"></div>
    </div>`).join('');
}

// Extract unique categories from stories
function extractCategories(stories) {
  const map = {};
  stories.forEach(s => {
    (s.categories || []).forEach(c => {
      map[c] = (map[c] || 0) + 1;
    });
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

// Extract unique tags from stories
function extractTags(stories) {
  const map = {};
  stories.forEach(s => {
    (s.tags || []).forEach(t => {
      map[t] = (map[t] || 0) + 1;
    });
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

// Get trending stories (by views)
function getTrending(stories, limit = 5) {
  return [...stories].sort((a, b) => b.views - a.views).slice(0, limit);
}

// Get latest stories
function getLatest(stories, limit = 10) {
  return [...stories].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
}

// Get random story
function getRandomStory(stories) {
  return stories[Math.floor(Math.random() * stories.length)];
}

// Get related stories by tags
function getRelated(stories, currentStory, limit = 6) {
  if (!currentStory) return [];
  const currentTags = new Set(currentStory.tags || []);
  const scored = stories
    .filter(s => s.id !== currentStory.id)
    .map(s => {
      const score = (s.tags || []).filter(t => currentTags.has(t)).length;
      return { story: s, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || b.story.views - a.story.views);
  const related = scored.slice(0, limit).map(x => x.story);
  if (related.length < limit) {
    const ids = new Set([currentStory.id, ...related.map(s => s.id)]);
    const fill = stories.filter(s => !ids.has(s.id)).sort(() => Math.random() - 0.5).slice(0, limit - related.length);
    related.push(...fill);
  }
  return related;
}

// Init dark mode
function initDarkMode() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  document.querySelectorAll('[data-dark-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
      btn.querySelector('.dm-icon-moon') && (btn.querySelector('.dm-icon-moon').style.display = isDark ? 'block' : 'none');
      btn.querySelector('.dm-icon-sun') && (btn.querySelector('.dm-icon-sun').style.display = isDark ? 'none' : 'block');
    });
  });
}

// Init back to top
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Init mobile menu
function initMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const overlay = menu?.querySelector('.mobile-menu-overlay');
  if (!menu) return;
  const open = () => menu.classList.add('open');
  const close = () => menu.classList.remove('open');
  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
}

// Init hero search
function initHeroSearch() {
  const form = document.getElementById('hero-search-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = form.querySelector('input').value.trim();
    if (q) window.location.href = (getBasePath() || '') + 'search.html?q=' + encodeURIComponent(q);
  });
}

// Init header search
function initHeaderSearch() {
  const input = document.getElementById('header-search-input');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) window.location.href = (getBasePath() || '') + 'search.html?q=' + encodeURIComponent(q);
    }
  });
}

// Render trending widget
async function renderTrendingWidget(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const stories = await loadStories();
  const trending = getTrending(stories, 8);
  const base = getBasePath();
  el.innerHTML = trending.map((s, i) => `
    <div class="trending-item">
      <div class="trending-num">${i + 1}</div>
      <div>
        <div class="trending-title"><a href="${base}stories/${s.slug}.html">${s.title}</a></div>
        <div class="trending-meta">${formatViews(s.views)} views · ${renderStars(s.rating)}</div>
      </div>
    </div>`).join('');
}

// Render tags cloud widget
async function renderTagsWidget(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const stories = await loadStories();
  const tags = extractTags(stories).slice(0, 20);
  const base = getBasePath();
  el.innerHTML = `<div class="tags-cloud">${tags.map(([t]) =>
    `<a href="${base}tag.html?t=${encodeURIComponent(t)}" class="tag-cloud-item">${t}</a>`
  ).join('')}</div>`;
}

// Random story button
async function initRandomStory(btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const stories = await loadStories();
    const story = getRandomStory(stories);
    if (story) window.location.href = getBasePath() + 'stories/' + story.slug + '.html';
  });
}

// Update view count (localStorage simulation)
function trackView(storyId) {
  const key = 'views_' + storyId;
  const count = parseInt(localStorage.getItem(key) || '0') + 1;
  localStorage.setItem(key, count);
}

// Page init
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initBackToTop();
  initMobileMenu();
  initHeroSearch();
  initHeaderSearch();
});

// Export for other modules
window.SITE = {
  loadStories, buildStoryCard, renderSkeletons, extractCategories, extractTags,
  getTrending, getLatest, getRandomStory, getRelated, formatDate, formatViews,
  renderStars, slugify, renderTrendingWidget, renderTagsWidget, initRandomStory,
  getBasePath, trackView
};
