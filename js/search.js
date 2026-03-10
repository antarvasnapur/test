// search.js — Search functionality

async function initSearch() {
  const data = await window.APP.loadStories();
  const q = new URLSearchParams(window.location.search).get('q') || '';
  const input = document.getElementById('search-input');
  if (input) input.value = q;

  const resultsEl = document.getElementById('search-results');
  const countEl = document.getElementById('result-count');
  const queryEl = document.getElementById('search-query');

  if (queryEl) queryEl.textContent = q;

  if (!q.trim()) {
    if (resultsEl) resultsEl.innerHTML = '<p class="text-muted" style="padding:40px 0;text-align:center">कोई खोज शब्द दर्ज करें...</p>';
    return;
  }

  const term = q.toLowerCase();
  const results = data.stories.filter(s => {
    return (
      s.title.toLowerCase().includes(term) ||
      (s.tags || []).some(t => t.toLowerCase().includes(term)) ||
      (s.categories || []).some(c => c.toLowerCase().includes(term)) ||
      (s.excerpt || '').toLowerCase().includes(term)
    );
  });

  if (countEl) countEl.textContent = results.length;

  if (!resultsEl) return;

  if (results.length === 0) {
    resultsEl.innerHTML = `<div class="bookmarks-empty"><div class="icon">🔍</div><p>"${q}" के लिए कोई परिणाम नहीं मिला।</p></div>`;
    return;
  }

  createPagination(results, 10, window.APP.storyCardHTML, 'search-results', 'search-pagination');
}

// Header search form handler
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.search-form');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const q = form.querySelector('input').value.trim();
      if (q) window.location.href = `/search.html?q=${encodeURIComponent(q)}`;
    });
  });

  // Init search page
  if (document.getElementById('search-results')) {
    initSearch();
  }
});
