// rating.js — Star rating system with localStorage

const RATING_KEY = 'avp-ratings';

function getRatings() {
  try { return JSON.parse(localStorage.getItem(RATING_KEY)) || {}; }
  catch { return {}; }
}

function saveRating(slug, rating) {
  const ratings = getRatings();
  ratings[slug] = rating;
  localStorage.setItem(RATING_KEY, JSON.stringify(ratings));
}

function initRating(slug) {
  const container = document.getElementById('rating-stars');
  if (!container) return;
  const saved = getRatings()[slug] || 0;

  const stars = container.querySelectorAll('span');

  function highlight(n) {
    stars.forEach((s, i) => {
      s.classList.toggle('active', i < n);
      s.textContent = i < n ? '★' : '☆';
    });
  }

  highlight(saved);

  stars.forEach((star, i) => {
    star.addEventListener('mouseenter', () => highlight(i + 1));
    star.addEventListener('mouseleave', () => highlight(getRatings()[slug] || 0));
    star.addEventListener('click', () => {
      saveRating(slug, i + 1);
      highlight(i + 1);
      window.APP.showToast(`${i + 1} स्टार दिए! धन्यवाद ⭐`);
    });
  });
}

window.initRating = initRating;
