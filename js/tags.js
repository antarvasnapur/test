/* ===== TAGS.JS ===== */

async function initTagPage() {
  const params = new URLSearchParams(window.location.search);
  const tag = decodeURIComponent(params.get('t') || '');
  const bannerEl = document.getElementById('page-banner');
  const resultsEl = document.getElementById('tag-results');
  if (!resultsEl) return;

  const stories = await window.SITE.loadStories();
  const base = window.SITE.getBasePath();

  if (tag) {
    if (bannerEl) {
      bannerEl.querySelector('h1').textContent = '#' + tag;
      bannerEl.querySelector('p').textContent = `Stories tagged with "${tag}"`;
    }
    document.title = `${tag} Stories - Antarvasnapur`;
    const filtered = stories.filter(s => (s.tags || []).includes(tag));
    if (filtered.length === 0) {
      resultsEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🏷️</div><h3>No stories found</h3><p>No stories with this tag yet.</p></div>`;
      return;
    }
    const pager = new Paginator({
      containerId: 'tag-results',
      paginationId: 'tag-pagination',
      items: filtered,
      perPage: 12,
      renderFn: s => window.SITE.buildStoryCard(s, base)
    });
    pager.render();
  } else {
    // All tags listing
    if (bannerEl) {
      bannerEl.querySelector('h1').textContent = 'All Tags';
      bannerEl.querySelector('p').textContent = 'Browse stories by tags';
    }
    document.title = 'Tags - Antarvasnapur';
    const tags = window.SITE.extractTags(stories);
    resultsEl.innerHTML = `<div class="tags-cloud" style="gap:10px">${
      tags.map(([t, count]) => `
        <a href="tag.html?t=${encodeURIComponent(t)}" class="tag-cloud-item" style="font-size:${Math.min(1.1, 0.8 + count * 0.04)}rem">
          ${t} <span style="opacity:0.6;font-size:0.8em">(${count})</span>
        </a>`).join('')
    }</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'tag') initTagPage();
});
