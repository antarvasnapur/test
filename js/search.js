/* search.js */
document.addEventListener('DOMContentLoaded', async () => {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');
  const countEl = document.getElementById('search-count');
  if (!searchForm || !resultsEl) return;

  const stories = await window.SITE.loadStories();

  function doSearch(q) {
    if (!q) { resultsEl.innerHTML=''; if(countEl) countEl.textContent=''; return; }
    const ql = q.toLowerCase();
    const scored = stories.map(s => {
      let score = 0;
      if (s.title.toLowerCase().includes(ql)) score += 10;
      if ((s.excerpt||'').toLowerCase().includes(ql)) score += 3;
      if ((s.categories||[]).some(c=>c.toLowerCase().includes(ql))) score += 2;
      if ((s.tags||[]).some(t=>t.toLowerCase().includes(ql))) score += 2;
      return { s, score };
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    if (countEl) countEl.innerHTML = `Found <strong>${scored.length}</strong> result${scored.length!==1?'s':''} for <strong>"${q}"</strong>`;
    resultsEl.innerHTML = scored.length
      ? `<div class="stories-grid">${scored.map(x=>window.SITE.buildStoryCard(x.s)).join('')}</div>`
      : `<div class="no-results"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><h3>No stories found for "${q}"</h3><p>Try different keywords or browse categories.</p></div>`;
  }

  const params = new URLSearchParams(window.location.search);
  const initial = params.get('q') || '';
  if (initial && searchInput) { searchInput.value = initial; doSearch(initial); }

  searchForm.addEventListener('submit', e => { e.preventDefault(); doSearch(searchInput.value.trim()); });
  let timer;
  searchInput?.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(()=>doSearch(searchInput.value.trim()), 300); });
});
