/* ===== RATING.JS ===== */

function getUserRating(storyId) {
  return parseInt(localStorage.getItem('rating_' + storyId) || '0');
}

function saveRating(storyId, rating) {
  localStorage.setItem('rating_' + storyId, rating);
}

function initRating(storyId, baseRating) {
  const container = document.getElementById('rating-widget');
  if (!container) return;
  const userRating = getUserRating(storyId);
  const display = document.getElementById('rating-display');

  const render = (hovered = 0, saved = userRating) => {
    container.querySelectorAll('.star-btn').forEach((btn, i) => {
      const val = i + 1;
      btn.classList.toggle('rated', val <= (hovered || saved));
      btn.textContent = val <= (hovered || saved) ? '★' : '☆';
    });
    if (display) display.textContent = saved ? `You rated: ${saved}/5` : `Rate this story`;
  };

  container.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement('button');
    btn.className = 'star-btn';
    btn.dataset.val = i;
    btn.title = `Rate ${i} out of 5`;
    btn.addEventListener('mouseover', () => render(i));
    btn.addEventListener('mouseleave', () => render(0));
    btn.addEventListener('click', () => {
      saveRating(storyId, i);
      render(0, i);
    });
    container.appendChild(btn);
  }

  const label = document.createElement('span');
  label.id = 'rating-display';
  label.style.cssText = 'font-size:0.82rem;color:var(--text-light);margin-left:8px';
  container.appendChild(label);
  render(0, userRating);
}

window.Rating = { initRating, getUserRating };
