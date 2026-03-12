/* recommendations.js */
document.addEventListener('DOMContentLoaded', async () => {
  const el = document.getElementById('recommendations');
  if (!el || typeof window.SITE === 'undefined') return;
  const stories = await window.SITE.loadStories();
  const storyId = parseInt(document.body.dataset.storyId);
  const current = stories.find(s=>s.id===storyId);
  const recs = window.SITE.getRelated(stories, current, 3);
  el.innerHTML = `<div class="stories-grid">${recs.map(s=>window.SITE.buildStoryCard(s)).join('')}</div>`;
});
