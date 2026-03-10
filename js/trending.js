/* ===== TRENDING.JS ===== */

async function initTrendingSection() {
  const container = document.getElementById('trending-stories');
  if (!container) return;
  const stories = await window.SITE.loadStories();
  const base = window.SITE.getBasePath();
  const trending = window.SITE.getTrending(stories, 6);
  container.innerHTML = `<div class="stories-grid">${trending.map(s => window.SITE.buildStoryCard(s, base)).join('')}</div>`;
}

async function initMostViewed() {
  const container = document.getElementById('most-viewed');
  if (!container) return;
  const stories = await window.SITE.loadStories();
  const base = window.SITE.getBasePath();
  const viewed = [...stories].sort((a, b) => b.views - a.views).slice(0, 6);
  container.innerHTML = `<div class="stories-grid">${viewed.map(s => window.SITE.buildStoryCard(s, base)).join('')}</div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  initTrendingSection();
  initMostViewed();
  window.SITE.renderTrendingWidget('sidebar-trending');
  window.SITE.renderTagsWidget('sidebar-tags');
});
