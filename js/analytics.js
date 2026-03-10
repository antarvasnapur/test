/* ===== ANALYTICS.JS - Google Analytics placeholder ===== */
// Replace GA_MEASUREMENT_ID with your actual Google Analytics 4 ID
// e.g., 'G-XXXXXXXXXX'
const GA_ID = 'GA_MEASUREMENT_ID';

if (GA_ID !== 'GA_MEASUREMENT_ID') {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_ID);
  window.gtag = gtag;
}

// Track page views for story pages
document.addEventListener('DOMContentLoaded', () => {
  const slug = document.body.dataset.slug;
  if (slug) window.SITE.trackView(slug);
});
