/* ============================================================
   main.js — Core site engine
   All paths are ABSOLUTE (/data/stories.json) so this works
   from any page depth: /, /stories/, 404, etc.
   ============================================================ */
'use strict';

window.APP = { stories: [], loaded: false };

async function loadStories() {
  if (window.APP.loaded) return window.APP.stories;
  try {
    const res = await fetch('/data/stories.json');
    const data = await res.json();
    window.APP.stories = data.stories || [];
    window.APP.loaded = true;
    return window.APP.stories;
  } catch (e) {
    console.error('Failed to load stories:', e);
    return [];
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('hi-IN', { year:'numeric', month:'long', day:'numeric' });
}
function formatViews(n) {
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
  return String(n);
}
function renderStars(r) {
  const f = Math.floor(r), h = r % 1 >= 0.5;
  let s = '';
  for (let i = 1; i <= 5; i++) s += i<=f ? '★' : (i===f+1&&h ? '½' : '☆');
  return `<span class="story-rating" title="${r}/5">${s} ${r.toFixed(1)}</span>`;
}
function slugify(str) {
  return str.toLowerCase().replace(/[\s_]+/g,'-').replace(/[^\w\-\u0900-\u097F]+/g,'-').replace(/--+/g,'-').replace(/^-+|-+$/g,'');
}

function buildStoryCard(story) {
  const cats = (story.categories||[]).map(c =>
    `<a href="/category.html?c=${encodeURIComponent(c)}" class="cat-badge">${c}</a>`).join('');
  const tags = (story.tags||[]).slice(0,4).map(t =>
    `<a href="/tag.html?t=${encodeURIComponent(t)}" class="tag-chip">${t}</a>`).join('');
  return `<article class="story-card">
    <div class="story-card-cats">${cats}</div>
    <h3 class="story-card-title"><a href="/stories/${story.slug}.html">${story.title}</a></h3>
    <p class="story-card-excerpt">${story.excerpt}</p>
    <div class="story-card-meta">
      <span class="meta-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${story.readingTime||5} min read</span>
      <span class="meta-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>${formatViews(story.views)}</span>
      ${renderStars(story.rating)}
    </div>
    <div class="story-card-tags">${tags}</div>
  </article>`;
}

function renderSkeletons(container, count=6) {
  container.innerHTML = Array(count).fill(`<div class="skeleton-card">
    <div class="skeleton" style="width:30%;height:10px;margin-bottom:12px;border-radius:4px"></div>
    <div class="skeleton" style="height:20px;margin-bottom:12px;border-radius:4px"></div>
    <div class="skeleton" style="height:12px;margin-bottom:8px;border-radius:4px"></div>
    <div class="skeleton" style="height:12px;width:60%;border-radius:4px"></div>
  </div>`).join('');
}

function extractCategories(stories) {
  const m={};
  stories.forEach(s=>(s.categories||[]).forEach(c=>m[c]=(m[c]||0)+1));
  return Object.entries(m).sort((a,b)=>b[1]-a[1]);
}
function extractTags(stories) {
  const m={};
  stories.forEach(s=>(s.tags||[]).forEach(t=>m[t]=(m[t]||0)+1));
  return Object.entries(m).sort((a,b)=>b[1]-a[1]);
}
function getTrending(stories, limit=5) { return [...stories].sort((a,b)=>b.views-a.views).slice(0,limit); }
function getLatest(stories, limit=10)  { return [...stories].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,limit); }
function getRandomStory(stories)       { return stories[Math.floor(Math.random()*stories.length)]; }
function getRelated(stories, current, limit=6) {
  if (!current) return [];
  const tags = new Set(current.tags||[]);
  const scored = stories.filter(s=>s.id!==current.id)
    .map(s=>({story:s, score:(s.tags||[]).filter(t=>tags.has(t)).length}))
    .filter(x=>x.score>0).sort((a,b)=>b.score-a.score||b.story.views-a.story.views);
  const rel = scored.slice(0,limit).map(x=>x.story);
  if (rel.length<limit) {
    const ids=new Set([current.id,...rel.map(s=>s.id)]);
    rel.push(...stories.filter(s=>!ids.has(s.id)).sort(()=>Math.random()-.5).slice(0,limit-rel.length));
  }
  return rel;
}

async function renderTrendingWidget(containerId) {
  const el=document.getElementById(containerId); if(!el) return;
  const stories=await loadStories();
  el.innerHTML=getTrending(stories,8).map((s,i)=>`
    <div class="trending-item">
      <div class="trending-num">${i+1}</div>
      <div>
        <div class="trending-title"><a href="/stories/${s.slug}.html">${s.title}</a></div>
        <div class="trending-meta">${formatViews(s.views)} views · ${renderStars(s.rating)}</div>
      </div>
    </div>`).join('');
}

async function renderTagsWidget(containerId) {
  const el=document.getElementById(containerId); if(!el) return;
  const stories=await loadStories();
  const tags=extractTags(stories).slice(0,20);
  el.innerHTML=`<div class="tags-cloud">${tags.map(([t])=>
    `<a href="/tag.html?t=${encodeURIComponent(t)}" class="tag-cloud-item">${t}</a>`).join('')}</div>`;
}

function trackView(id) {
  const k='views_'+id;
  localStorage.setItem(k, parseInt(localStorage.getItem(k)||0)+1);
}

document.addEventListener('DOMContentLoaded', () => {
  // Hero search
  const heroForm = document.getElementById('hero-search-form');
  if (heroForm) heroForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = heroForm.querySelector('input').value.trim();
    if (q) window.location.href = '/search.html?q=' + encodeURIComponent(q);
  });
  // [data-random-story] buttons
  document.querySelectorAll('[data-random-story]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const stories = await loadStories();
      const s = getRandomStory(stories);
      if (s) window.location.href = '/stories/' + s.slug + '.html';
    });
  });
});

window.SITE = {
  loadStories, buildStoryCard, renderSkeletons, extractCategories, extractTags,
  getTrending, getLatest, getRandomStory, getRelated, formatDate, formatViews,
  renderStars, slugify, renderTrendingWidget, renderTagsWidget, trackView
};
