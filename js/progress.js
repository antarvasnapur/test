/* ===== PROGRESS.JS - Reading progress bar ===== */
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  const update = () => {
    const el = document.documentElement;
    const scrolled = el.scrollTop || document.body.scrollTop;
    const total = el.scrollHeight - el.clientHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
});
