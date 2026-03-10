/* ===== BOOKMARKS.JS ===== */

function getBookmarks() {
  try { return JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch { return []; }
}

function saveBookmarks(bm) {
  localStorage.setItem('bookmarks', JSON.stringify(bm));
}

function isBookmarked(id) {
  return getBookmarks().includes(String(id));
}

function toggleBookmark(id) {
  const bm = getBookmarks();
  const sid = String(id);
  const idx = bm.indexOf(sid);
  if (idx === -1) bm.push(sid);
  else bm.splice(idx, 1);
  saveBookmarks(bm);
  return idx === -1;
}

function initBookmarkButton(storyId) {
  const btn = document.getElementById('bookmark-btn');
  if (!btn) return;
  const update = () => {
    const marked = isBookmarked(storyId);
    btn.classList.toggle('bookmarked', marked);
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${marked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
    ${marked ? 'Bookmarked' : 'Bookmark'}`;
  };
  update();
  btn.addEventListener('click', () => {
    toggleBookmark(storyId);
    update();
  });
}

window.Bookmarks = { getBookmarks, isBookmarked, toggleBookmark, initBookmarkButton };
