// categories.js — Category page logic

async function initCategoryPage() {
  const data = await window.APP.loadStories();
  const cat = new URLSearchParams(window.location.search).get('cat') || '';

  const titleEl = document.getElementById('cat-title');
  const descEl = document.getElementById('cat-desc');
  if (titleEl) titleEl.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
  if (descEl) descEl.textContent = `"${cat}" श्रेणी की सभी कहानियाँ`;

  const filtered = data.stories.filter(s => (s.categories || []).includes(cat));

  const resultsEl = document.getElementById('category-results');
  if (!resultsEl) return;

  if (filtered.length === 0) {
    resultsEl.innerHTML = `<div class="bookmarks-empty"><div class="icon">📂</div><p>इस श्रेणी में कोई कहानी नहीं है।</p></div>`;
    return;
  }

  createPagination(filtered, 10, window.APP.storyCardHTML, 'category-results', 'cat-pagination');
}

// Build category list in sidebar
async function buildCategoryList(containerId) {
  const data = await window.APP.loadStories();
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = data.categories.slice(0, 12).map(c =>
    `<li><a href="/category.html?cat=${c.id}">${c.name} <span class="count">${c.count}</span></a></li>`
  ).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('category-results')) initCategoryPage();
  if (document.getElementById('sidebar-categories')) buildCategoryList('sidebar-categories');
});

window.buildCategoryList = buildCategoryList;
