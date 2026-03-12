/* tags.js */
document.addEventListener('DOMContentLoaded', async () => {
  if (typeof window.SITE === 'undefined') return;
  const tagPageEl = document.getElementById('tag-page-content');
  if (!tagPageEl) return;
  const stories = await window.SITE.loadStories();
  const params = new URLSearchParams(window.location.search);
  const tag = params.get('t');
  if (tag) {
    const filtered = stories.filter(s=>(s.tags||[]).includes(tag));
    document.title = '#' + tag + ' — Antarvasnapur';
    const banner = document.getElementById('page-banner-title');
    const bannerSub = document.getElementById('page-banner-sub');
    if (banner) banner.textContent = '#' + tag;
    if (bannerSub) bannerSub.textContent = filtered.length + ' stories';
    tagPageEl.innerHTML = `<div class="stories-grid">${filtered.map(s=>window.SITE.buildStoryCard(s)).join('')}</div>`;
  } else {
    const tags = window.SITE.extractTags(stories);
    const max = tags[0]?.[1] || 1;
    tagPageEl.innerHTML = `<div class="tags-cloud" style="gap:10px">${tags.map(([t,count])=>{
      const size = 0.8 + (count/max)*0.9;
      return `<a href="/tag.html?t=${encodeURIComponent(t)}" class="tag-cloud-item" style="font-size:${size.toFixed(2)}rem">${t} <sup>${count}</sup></a>`;
    }).join('')}</div>`;
  }
});
