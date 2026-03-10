// random.js — Random story navigation

async function goToRandom() {
  const data = await window.APP.loadStories();
  const stories = data.stories;
  if (!stories.length) return;
  const rand = stories[Math.floor(Math.random() * stories.length)];
  window.location.href = `/stories/${rand.slug}.html`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-random]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      goToRandom();
    });
  });
});

window.goToRandom = goToRandom;
