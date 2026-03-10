/* ===== RELATED.JS - Related Stories & Infinite Scroll ===== */

let relatedLoaded = 0;
let relatedBatch = [];
let loadingMore = false;

async function initRelatedStories(currentSlug) {
  const container = document.getElementById('related-stories');
  if (!container) return;
  const stories = await window.SITE.loadStories();
  const base = window.SITE.getBasePath();
  const current = stories.find(s => s.slug === currentSlug);
  relatedBatch = window.SITE.getRelated(stories, current, 20);
  relatedLoaded = 0;
  renderNextRelatedBatch(container, base);
  initInfiniteScroll(container, base);
}

function renderNextRelatedBatch(container, base) {
  const batch = relatedBatch.slice(relatedLoaded, relatedLoaded + 6);
  if (batch.length === 0) return;
  batch.forEach(story => {
    const div = document.createElement('div');
    div.innerHTML = window.SITE.buildStoryCard(story, base);
    container.appendChild(div.firstElementChild);
  });
  relatedLoaded += batch.length;
}

function initInfiniteScroll(container, base) {
  const sentinel = document.getElementById('related-sentinel');
  if (!sentinel) return;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !loadingMore && relatedLoaded < relatedBatch.length) {
      loadingMore = true;
      setTimeout(() => {
        renderNextRelatedBatch(container, base);
        loadingMore = false;
      }, 300);
    }
  }, { rootMargin: '200px' });
  observer.observe(sentinel);
}

document.addEventListener('DOMContentLoaded', () => {
  const slug = document.body.dataset.slug;
  if (slug) initRelatedStories(slug);
});
