/* ===== CATEGORIES.JS ===== */

async function initCategoryPage() {
  const params = new URLSearchParams(window.location.search);
  const category = decodeURIComponent(params.get('c') || '');
  const titleEl = document.getElementById('cat-title');
  const descEl = document.getElementById('cat-desc');
  const bannerEl = document.getElementById('page-banner');
  const resultsEl = document.getElementById('cat-results');
  if (!resultsEl) return;

  const stories = await window.SITE.loadStories();
  const base = window.SITE.getBasePath();

  if (category) {
    // Single category view
    if (titleEl) titleEl.textContent = category;
    if (descEl) descEl.textContent = `Stories in ${category}`;
    if (bannerEl) {
      bannerEl.querySelector('h1').textContent = category;
      bannerEl.querySelector('p').textContent = `Browse all stories in this category`;
    }
    document.title = `${category} - Antarvasnapur`;
    const filtered = stories.filter(s => (s.categories || []).includes(category));
    if (filtered.length === 0) {
      resultsEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📚</div><h3>No stories found</h3><p>No stories in this category yet.</p></div>`;
      return;
    }
    const pager = new Paginator({
      containerId: 'cat-results',
      paginationId: 'cat-pagination',
      items: filtered,
      perPage: 12,
      renderFn: s => window.SITE.buildStoryCard(s, base)
    });
    pager.render();
  } else {
    // All categories listing
    if (titleEl) titleEl.textContent = 'All Categories';
    if (bannerEl) {
      bannerEl.querySelector('h1').textContent = 'All Categories';
      bannerEl.querySelector('p').textContent = 'Browse stories by category';
    }
    document.title = 'Categories - Antarvasnapur';
    const cats = window.SITE.extractCategories(stories);
    const icons = {
      'Bhabhi Stories': '💝', 'Desi Stories': '🏡', 'Village Stories': '🌾',
      'College Stories': '🎓', 'Romantic Stories': '💑', 'default': '📖'
    };
    resultsEl.innerHTML = `<div class="categories-grid">
      ${cats.map(([name, count]) => `
        <a href="category.html?c=${encodeURIComponent(name)}" class="category-card">
          <div class="category-icon">${icons[name] || icons.default}</div>
          <div class="category-name">${name}</div>
          <div class="category-count">${count} stories</div>
        </a>`).join('')}
    </div>`;
  }
}

async function renderHomepageCategories() {
  const container = document.getElementById('homepage-categories');
  if (!container) return;
  const stories = await window.SITE.loadStories();
  const base = window.SITE.getBasePath();
  const cats = window.SITE.extractCategories(stories);
  let html = '';
  cats.forEach(([catName]) => {
    const catStories = stories
      .filter(s => (s.categories || []).includes(catName))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
    if (catStories.length === 0) return;
    html += `
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">${catName}</h2>
          <a href="${base}category.html?c=${encodeURIComponent(catName)}" class="view-all">View All →</a>
        </div>
        <div class="stories-grid">
          ${catStories.map(s => window.SITE.buildStoryCard(s, base)).join('')}
        </div>
      </section>`;
  });
  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'category') initCategoryPage();
  if (document.body.dataset.page === 'home') renderHomepageCategories();
});
