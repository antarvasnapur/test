/* rating.js */
window.Rating = {
  get(id) { return parseInt(localStorage.getItem('rating_'+id)||0); },
  set(id,val) { localStorage.setItem('rating_'+id, val); }
};
document.addEventListener('DOMContentLoaded', () => {
  const widget = document.getElementById('rating-widget');
  if (!widget) return;
  const id = parseInt(widget.dataset.storyId);
  const current = window.Rating.get(id);
  const stars = widget.querySelectorAll('.star-btn');
  stars.forEach(s => { if (parseInt(s.dataset.val) <= current) s.classList.add('rated'); });
  stars.forEach(s => {
    s.addEventListener('click', () => {
      const val = parseInt(s.dataset.val);
      window.Rating.set(id, val);
      stars.forEach(s2 => s2.classList.toggle('rated', parseInt(s2.dataset.val) <= val));
    });
  });
});
