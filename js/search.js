// search.js — Search with Hindi + English support

// English keyword → Hindi/Slug mappings for cross-language search
const SEARCH_MAP = {
  // Categories in English
  'desi': ['desi', 'देसी', 'देस'],
  'village': ['village', 'gaon', 'गाँव', 'गाव'],
  'romance': ['romance', 'prem', 'pyar', 'प्रेम', 'रोमांस', 'प्यार'],
  'family': ['family', 'parivar', 'परिवार'],
  'college': ['college', 'कॉलेज'],
  'urban': ['urban', 'shehar', 'city', 'शहर', 'मॉडर्न'],
  'modern': ['modern', 'urban', 'शहर', 'मॉडर्न'],
  'adventure': ['adventure', 'pahad', 'पहाड़'],
  'festival': ['festival', 'holi', 'त्योहार', 'होली', 'diwali'],
  'office': ['office', 'daftar', 'ऑफिस', 'दफ्तर'],
  'rajasthani': ['rajasthani', 'rajasthan', 'राजस्थान', 'राजस्थानी'],
  'nature': ['nature', 'nature', 'prakriti', 'प्रकृति'],
  'marriage': ['marriage', 'shaadi', 'vivah', 'शादी', 'विवाह'],
  'youth': ['youth', 'yuva', 'युवा'],
  // Common Hindi-to-English search terms
  'गाँव': ['village', 'gaon', 'desi'],
  'गांव': ['village', 'gaon', 'desi'],
  'प्रेम': ['romance', 'prem', 'love', 'pyar'],
  'प्यार': ['romance', 'prem', 'love', 'pyar'],
  'रोमांस': ['romance', 'prem'],
  'परिवार': ['family', 'parivar'],
  'शहर': ['urban', 'city', 'shehar', 'modern'],
  'देसी': ['desi'],
  'रात': ['raat', 'night', 'gaon'],
  'कॉलेज': ['college'],
  'होली': ['holi', 'festival'],
  'राजस्थान': ['rajasthani', 'rajasthan'],
};

function expandQuery(q) {
  const lower = q.toLowerCase().trim();
  const terms = new Set([lower]);
  // Check if query matches any key in SEARCH_MAP
  for (const [key, vals] of Object.entries(SEARCH_MAP)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase())) {
      vals.forEach(v => terms.add(v.toLowerCase()));
    }
    // Reverse: if query matches a value, add the key
    if (vals.some(v => v.toLowerCase() === lower || lower.includes(v.toLowerCase()))) {
      terms.add(key.toLowerCase());
      vals.forEach(v => terms.add(v.toLowerCase()));
    }
  }
  return Array.from(terms);
}

function storyMatchesTerms(story, terms) {
  const fields = [
    story.title,
    story.slug,
    story.excerpt || '',
    ...(story.tags || []),
    ...(story.categories || []),
  ].map(f => f.toLowerCase());

  return terms.some(term =>
    fields.some(field => field.includes(term))
  );
}

async function initSearch() {
  const data = await window.APP.loadStories();
  const q = new URLSearchParams(window.location.search).get('q') || '';
  const input = document.getElementById('search-input');
  if (input) input.value = q;

  const resultsEl = document.getElementById('search-results');
  const countEl   = document.getElementById('result-count');
  const queryEl   = document.getElementById('search-query');
  const headingEl = document.getElementById('results-heading');

  if (queryEl) queryEl.textContent = q;

  if (!q.trim()) {
    if (resultsEl) resultsEl.innerHTML = '<p class="text-muted" style="padding:60px 0;text-align:center;font-size:1.05rem;">🔍 ऊपर कुछ खोजें...</p>';
    return;
  }

  if (headingEl) headingEl.style.display = 'block';

  // Expand query to cover both Hindi and English terms
  const terms = expandQuery(q);

  const results = data.stories.filter(s => storyMatchesTerms(s, terms));

  if (countEl) countEl.textContent = results.length;

  if (!resultsEl) return;

  if (results.length === 0) {
    resultsEl.innerHTML = `<div class="bookmarks-empty"><div class="icon">🔍</div><p>"${q}" के लिए कोई परिणाम नहीं मिला।<br><small style="color:var(--text-light)">अलग शब्द या हिंदी में खोजें</small></p></div>`;
    return;
  }

  createPagination(results, 10, window.APP.storyCardHTML, 'search-results', 'search-pagination');
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('search-results')) {
    initSearch();
  }
});
