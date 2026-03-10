// bookmarks.js — Bookmark system using localStorage

const BOOKMARK_KEY = 'avp-bookmarks';

function getBookmarks() {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || []; }
  catch { return []; }
}

function saveBookmarks(bm) {
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bm));
}

function isBookmarked(slug) {
  return getBookmarks().includes(slug);
}

function toggleBookmark(slug, title) {
  let bm = getBookmarks();
  if (bm.includes(slug)) {
    bm = bm.filter(s => s !== slug);
    window.APP.showToast('बुकमार्क हटाया गया');
  } else {
    bm.push(slug);
    window.APP.showToast('बुकमार्क किया गया! 🔖');
  }
  saveBookmarks(bm);

  // Update button state
  document.querySelectorAll('[data-bookmark]').forEach(btn => {
    btn.classList.toggle('active', isBookmarked(slug));
    btn.innerHTML = isBookmarked(slug) ? '🔖 सेव किया' : '🔖 सेव करें';
  });
}

// Initialize bookmark buttons on story pages
function initBookmarkBtn(slug, title) {
  const btns = document.querySelectorAll('[data-bookmark]');
  btns.forEach(btn => {
    btn.innerHTML = isBookmarked(slug) ? '🔖 सेव किया' : '🔖 सेव करें';
    btn.classList.toggle('active', isBookmarked(slug));
    btn.addEventListener('click', () => toggleBookmark(slug, title));
  });
}

// Build bookmarks page
async function buildBookmarksPage() {
  const el = document.getElementById('bookmarks-list');
  if (!el) return;
  const bm = getBookmarks();
  if (!bm.length) {
    el.innerHTML = `<div class="bookmarks-empty"><div class="icon">🔖</div><p>आपने अभी तक कोई कहानी सेव नहीं की है।</p></div>`;
    return;
  }
  const data = await window.APP.loadStories();
  const saved = data.stories.filter(s => bm.includes(s.slug));
  if (!saved.length) {
    el.innerHTML = `<div class="bookmarks-empty"><div class="icon">🔖</div><p>सेव की गई कहानियाँ नहीं मिलीं।</p></div>`;
    return;
  }
  el.innerHTML = `<div class="stories-grid">${saved.map(s => window.APP.storyCardHTML(s)).join('')}</div>`;
}

window.APP_BOOKMARKS = { initBookmarkBtn, buildBookmarksPage, isBookmarked, toggleBookmark };
