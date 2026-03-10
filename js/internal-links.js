/* ===== INTERNAL-LINKS.JS - Auto internal linking ===== */

async function autoInternalLinks(contentEl) {
  if (!contentEl) return;
  const stories = await window.SITE.loadStories();
  const base = window.SITE.getBasePath();

  // Build keyword map from tags and categories
  const keywordMap = {};
  const allTags = window.SITE.extractTags(stories);
  allTags.forEach(([tag]) => {
    keywordMap[tag] = base + 'tag.html?t=' + encodeURIComponent(tag);
  });

  const html = contentEl.innerHTML;
  const currentSlug = document.body.dataset.slug;

  // Find linkable keywords, max 7 links
  let linkCount = 0;
  const maxLinks = 7;
  const linked = new Set();
  let result = html;

  // Only link keywords that appear in content
  for (const [kw, url] of Object.entries(keywordMap)) {
    if (linkCount >= maxLinks) break;
    if (linked.has(kw)) continue;
    if (!result.includes(kw)) continue;
    // Don't link inside existing anchor tags
    const safe = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?<!<a[^>]*>)(?<!href="[^"]*)(${safe})(?![^<]*<\/a>)`, 'g');
    let replaced = false;
    result = result.replace(re, (match) => {
      if (replaced) return match; // only first occurrence
      replaced = true;
      linkCount++;
      linked.add(kw);
      return `<a href="${url}" class="auto-link">${match}</a>`;
    });
  }

  contentEl.innerHTML = result;
}

document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.story-content');
  if (content && document.body.dataset.slug) {
    autoInternalLinks(content);
  }
});
