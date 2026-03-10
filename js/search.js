/* ===== SEARCH.JS ===== */

function normalizeText(str) {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

function searchStories(stories, query) {
  if (!query || !query.trim()) return stories;
  const q = normalizeText(query);
  const terms = q.split(' ').filter(Boolean);
  return stories
    .map(story => {
      const searchable = normalizeText([
        story.title,
        story.excerpt || '',
        ...(story.tags || []),
        ...(story.categories || [])
      ].join(' '));
      let score = 0;
      const titleNorm = normalizeText(story.title);
      terms.forEach(term => {
        if (titleNorm.includes(term)) score += 10;
        if (searchable.includes(term)) score += 1;
      });
      return { story, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.story);
}

// Initialize search page
async function initSearchPage() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  const resultsCount = document.getElementById('search-results-count');
  const paginationEl = document.getElementById('search-pagination');
  if (!resultsContainer) return;

  if (searchInput) searchInput.value = query;

  const stories = await window.SITE.loadStories();
  const base = window.SITE.getBasePath();

  const runSearch = (q) => {
    const results = searchStories(stories, q);
    if (resultsCount) {
      if (q) {
        resultsCount.innerHTML = results.length > 0
          ? `Found <strong>${results.length}</strong> stories for "<strong>${q}</strong>"`
          : `No results for "<strong>${q}</strong>"`;
      } else {
        resultsCount.innerHTML = `Showing all <strong>${results.length}</strong> stories`;
      }
    }
    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <h3>No stories found</h3>
          <p>Try different keywords or browse by category</p>
        </div>`;
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }
    const pager = new Paginator({
      containerId: 'search-results',
      paginationId: 'search-pagination',
      items: results,
      perPage: 10,
      renderFn: s => window.SITE.buildStoryCard(s, base)
    });
    pager.render();
  };

  runSearch(query);

  // Live search
  if (searchInput) {
    let timeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const q = searchInput.value.trim();
        const url = new URL(window.location);
        if (q) url.searchParams.set('q', q);
        else url.searchParams.delete('q');
        window.history.replaceState({}, '', url);
        runSearch(q);
      }, 300);
    });
  }

  // Search form
  const form = document.getElementById('search-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const q = searchInput?.value.trim() || '';
      runSearch(q);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'search') initSearchPage();
});

window.searchStories = searchStories;
window.initSearchPage = initSearchPage;
