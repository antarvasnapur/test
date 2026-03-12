/* bookmarks.js */
window.Bookmarks = {
  getAll() { try { return JSON.parse(localStorage.getItem('bookmarks')||'[]'); } catch{ return []; } },
  isBookmarked(id) { return this.getAll().includes(id); },
  toggle(id) {
    const all = this.getAll();
    const idx = all.indexOf(id);
    if (idx === -1) all.push(id); else all.splice(idx,1);
    localStorage.setItem('bookmarks', JSON.stringify(all));
    return idx === -1;
  }
};
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-bookmark-btn]').forEach(btn => {
    const id = parseInt(btn.dataset.bookmarkBtn);
    if (window.Bookmarks.isBookmarked(id)) btn.classList.add('bookmarked');
    btn.addEventListener('click', () => {
      const added = window.Bookmarks.toggle(id);
      btn.classList.toggle('bookmarked', added);
      btn.querySelector('.bm-label') && (btn.querySelector('.bm-label').textContent = added ? 'Bookmarked' : 'Bookmark');
    });
  });
});
