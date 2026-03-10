// related.js — Related stories for story pages

async function buildRelated(currentSlug, categories, containerId, limit = 4) {
  const data = await window.APP.loadStories();
  const el = document.getElementById(containerId);
  if (!el) return;

  const related = data.stories
    .filter(s => s.slug !== currentSlug && (s.categories || []).some(c => categories.includes(c)))
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);

  if (related.length === 0) {
    el.innerHTML = '<p class="text-muted">कोई संबंधित कहानी नहीं मिली।</p>';
    return;
  }

  el.innerHTML = `<div class="related-grid">${related.map(s => window.APP.smallCardHTML(s)).join('')}</div>`;
}

window.buildRelated = buildRelated;
