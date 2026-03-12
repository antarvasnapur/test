/* trending.js */
document.addEventListener('DOMContentLoaded', async () => {
  if (typeof window.SITE === 'undefined') return;
  const stories = await window.SITE.loadStories();

  const trendingEl = document.getElementById('trending-stories');
  if (trendingEl) {
    const t = window.SITE.getTrending(stories, 6);
    trendingEl.innerHTML = `<div class="stories-grid">${t.map(s=>window.SITE.buildStoryCard(s)).join('')}</div>`;
  }

  const mostViewedEl = document.getElementById('most-viewed');
  if (mostViewedEl) {
    const mv = [...stories].sort((a,b)=>b.views-a.views).slice(0,6);
    mostViewedEl.innerHTML = `<div class="stories-grid">${mv.map(s=>window.SITE.buildStoryCard(s)).join('')}</div>`;
  }

  window.SITE.renderTrendingWidget('sidebar-trending');
  window.SITE.renderTagsWidget('sidebar-tags');
});
