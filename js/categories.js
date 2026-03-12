/* categories.js */
document.addEventListener('DOMContentLoaded', async () => {
  if (typeof window.SITE === 'undefined') return;

  // Homepage category sections
  const homeCatsEl = document.getElementById('homepage-categories');
  if (homeCatsEl) {
    const stories = await window.SITE.loadStories();
    const cats = window.SITE.extractCategories(stories);
    homeCatsEl.innerHTML = cats.map(([cat]) => {
      const catStories = stories.filter(s=>(s.categories||[]).includes(cat)).slice(0,6);
      if (!catStories.length) return '';
      return `<section class="section">
        <div class="section-header">
          <h2 class="section-title">${cat}</h2>
          <a href="/category.html?c=${encodeURIComponent(cat)}" class="view-all">View All →</a>
        </div>
        <div class="stories-grid">${catStories.map(s=>window.SITE.buildStoryCard(s)).join('')}</div>
      </section>`;
    }).join('');
  }

  // Category page
  const catPageEl = document.getElementById('category-page-content');
  if (catPageEl) {
    const stories = await window.SITE.loadStories();
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('c');
    if (cat) {
      const filtered = stories.filter(s=>(s.categories||[]).includes(cat));
      document.title = cat + ' — Antarvasnapur';
      const banner = document.getElementById('page-banner-title');
      const bannerSub = document.getElementById('page-banner-sub');
      if (banner) banner.textContent = cat;
      if (bannerSub) bannerSub.textContent = filtered.length + ' stories';
      catPageEl.innerHTML = `<div class="stories-grid">${filtered.map(s=>window.SITE.buildStoryCard(s)).join('')}</div>`;
    } else {
      const cats = window.SITE.extractCategories(stories);
      catPageEl.innerHTML = `<div class="categories-grid">${cats.map(([c,count])=>`
        <a href="/category.html?c=${encodeURIComponent(c)}" class="category-card">
          <div class="category-icon">📖</div>
          <div class="category-name">${c}</div>
          <div class="category-count">${count} stories</div>
        </a>`).join('')}</div>`;
    }
  }
});
