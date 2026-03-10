/* ===== DARKMODE.JS ===== */
// Dark mode is handled in main.js; this file exports helpers
window.DarkMode = {
  toggle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  },
  isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
};
