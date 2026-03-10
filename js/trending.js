// trending.js — Trending and most-viewed sections

async function buildTrending(containerId, limit = 7) {
  const data = await window.APP.loadStories();
  const el = document.getElementById(containerId);
  if (!el) return;

  const sorted = [...data.stories]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);

  el.innerHTML = sorted.map((s, i) => window.APP.trendingItemHTML(s, i)).join('');
}

async function buildMostViewed(containerId, limit = 5) {
  const data = await window.APP.loadStories();
  const el = document.getElementById(containerId);
  if (!el) return;

  const sorted = [...data.stories]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);

  el.innerHTML = sorted.map(s => window.APP.smallCardHTML(s)).join('');
}

async function buildLatest(containerId, limit = 10) {
  const data = await window.APP.loadStories();
  const el = document.getElementById(containerId);
  if (!el) return;

  const sorted = [...data.stories]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);

  el.innerHTML = sorted.map(s => window.APP.storyCardHTML(s)).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('trending-list')) buildTrending('trending-list');
  if (document.getElementById('most-viewed-list')) buildMostViewed('most-viewed-list');
  if (document.getElementById('latest-stories')) buildLatest('latest-stories');
});

window.buildTrending = buildTrending;
window.buildMostViewed = buildMostViewed;
window.buildLatest = buildLatest;
