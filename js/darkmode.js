/* darkmode.js — lightweight dark mode (layout.js handles the full init) */
(function(){
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.setAttribute('data-theme','dark');
  }
})();
