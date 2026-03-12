/* internal-links.js — auto-link Hindi keywords to tag pages */
document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.story-content');
  if (!content) return;
  const keywords = {
    'रोमांटिक':'romantic','प्यार':'love','देसी':'desi',
    'भाभी':'bhabhi','गाँव':'village','कॉलेज':'college',
    'दोस्ती':'friendship','परिवार':'family','यादें':'memories'
  };
  let html = content.innerHTML;
  let count = 0;
  Object.entries(keywords).forEach(([kw, tag]) => {
    if (count >= 7) return;
    const re = new RegExp(kw,'g');
    let replaced = false;
    html = html.replace(re, match => {
      if (replaced || count >= 7) return match;
      replaced = true; count++;
      return `<a href="/tag.html?t=${encodeURIComponent(tag)}" class="story-inline-link">${match}</a>`;
    });
  });
  content.innerHTML = html;
});
