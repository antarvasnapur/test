/* ===== RECOMMENDATIONS.JS ===== */
// Extended recommendations shown after story ends
async function initRecommendations() {
  const el = document.getElementById('recommendations');
  if (!el) return;
  const slug = document.body.dataset.slug;
  const stories = await window.SITE.loadStories();
  const base = window.SITE.getBasePath();
  const current = stories.find(s => s.slug === slug);
  const recs = window.SITE.getRelated(stories, current, 6);
  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">You May Also Like</h2>
    </div>
    <div class="stories-grid">${recs.map(s => window.SITE.buildStoryCard(s, base)).join('')}</div>`;
}

document.addEventListener('DOMContentLoaded', initRecommendations);
