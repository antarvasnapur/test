// darkmode.js — Dark mode toggle

(function () {
  const KEY = 'avp-theme';
  const btn = document.getElementById('darkmode-btn');

  function setTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(KEY, dark ? 'dark' : 'light');
    if (btn) btn.textContent = dark ? '☀️' : '🌙';
  }

  function init() {
    const saved = localStorage.getItem(KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved === 'dark' || (!saved && prefersDark));
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(!isDark);
    });
  }

  init();
})();
