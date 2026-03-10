/* ===== RANDOM.JS ===== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-random-story]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const stories = await window.SITE.loadStories();
      const s = window.SITE.getRandomStory(stories);
      if (s) window.location.href = window.SITE.getBasePath() + 'stories/' + s.slug + '.html';
    });
  });
});
