// main.js — Core utilities and data loader

let storiesData = null;

// Load stories.json once and cache
async function loadStories() {
  if (storiesData) return storiesData;
  try {
    const res = await fetch('/data/stories.json');
    storiesData = await res.json();
    return storiesData;
  } catch (e) {
    console.error('Failed to load stories.json', e);
    return { stories: [], categories: [], tags: [] };
  }
}

// Format date
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Format view count
function formatViews(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n;
}

// Render star rating
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= full) html += '★';
    else if (i === full + 1 && half) html += '☆';
    else html += '☆';
  }
  return `<span class="stars">${html}</span>`;
}

// Story card HTML
function storyCardHTML(story) {
  const cats = (story.categories || []).map(c =>
    `<a class="cat-badge" href="/category.html?cat=${c}">${c}</a>`
  ).join('');
  const tags = (story.tags || []).slice(0, 3).map(t =>
    `<a class="tag-pill" href="/tag.html?tag=${t}">#${t}</a>`
  ).join('');

  return `
    <article class="story-card">
      <div class="story-card-meta">
        ${cats}
        <div class="meta-info">
          <span>👁 ${formatViews(story.views)}</span>
          <span>${renderStars(story.rating)}</span>
          <span>${formatDate(story.date)}</span>
        </div>
      </div>
      <h2><a href="/stories/${story.slug}.html">${story.title}</a></h2>
      <p>${story.excerpt}</p>
      <div class="story-card-footer">
        <div class="story-tags">${tags}</div>
        <a class="read-btn" href="/stories/${story.slug}.html">पढ़ें →</a>
      </div>
    </article>`;
}

// Small card HTML
function smallCardHTML(story) {
  return `
    <div class="card-sm">
      <h3><a href="/stories/${story.slug}.html">${story.title}</a></h3>
      <p>${renderStars(story.rating)} · 👁 ${formatViews(story.views)}</p>
    </div>`;
}

// Trending item HTML
function trendingItemHTML(story, index) {
  return `
    <div class="trending-item">
      <span class="trending-num">${index + 1}</span>
      <div class="trending-info">
        <h4><a href="/stories/${story.slug}.html">${story.title}</a></h4>
        <span>👁 ${formatViews(story.views)} · ${renderStars(story.rating)}</span>
      </div>
    </div>`;
}

// Show toast notification
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Export for use in other scripts
window.APP = {
  loadStories, formatDate, formatViews, renderStars,
  storyCardHTML, smallCardHTML, trendingItemHTML, showToast
};
