// tags.js — Tag page logic

async function initTagPage() {
  const data = await window.APP.loadStories();
  const tag = new URLSearchParams(window.location.search).get('tag') || '';

  const titleEl = document.getElementById('tag-title');
  const descEl = document.getElementById('tag-desc');
  if (titleEl) titleEl.textContent = '#' + tag;
  if (descEl) descEl.textContent = `"${tag}" टैग वाली सभी कहानियाँ`;

  const filtered = data.stories.filter(s => (s.tags || []).includes(tag));

  const resultsEl = document.getElementById('tag-results');
  if (!resultsEl) return;

  if (filtered.length === 0) {
    resultsEl.innerHTML = `<div class="bookmarks-empty"><div class="icon">🏷️</div><p>इस टैग में कोई कहानी नहीं है।</p></div>`;
    return;
  }

  createPagination(filtered, 10, window.APP.storyCardHTML, 'tag-results', 'tag-pagination');
}

// Build tags cloud
async function buildTagsCloud(containerId) {
  const data = await window.APP.loadStories();
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = data.tags.slice(0, 30).map(t =>
    `<a href="/tag.html?tag=${t}">#${t}</a>`
  ).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('tag-results')) initTagPage();
  if (document.getElementById('sidebar-tags')) buildTagsCloud('sidebar-tags');
});

window.buildTagsCloud = buildTagsCloud;
