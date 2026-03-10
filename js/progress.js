// progress.js — Reading progress bar & back-to-top

(function () {
  const bar = document.getElementById('progress-bar');
  const topBtn = document.getElementById('back-to-top');

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (bar) bar.style.width = pct + '%';
    if (topBtn) topBtn.classList.toggle('visible', scrollTop > 300);
  }

  window.addEventListener('scroll', update, { passive: true });

  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
