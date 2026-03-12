/* related.js */
document.addEventListener('DOMContentLoaded', async () => {
  const el = document.getElementById('related-stories');
  if (!el || typeof window.SITE === 'undefined') return;
  const storyId = parseInt(document.body.dataset.storyId);
  const stories = await window.SITE.loadStories();
  const current = stories.find(s=>s.id===storyId);
  const related = window.SITE.getRelated(stories, current, 6);
  el.innerHTML = `<div class="stories-grid">${related.map(s=>window.SITE.buildStoryCard(s)).join('')}</div>`;
});
