// analytics.js — Google Analytics placeholder

// Replace G-XXXXXXXXXX with your actual Google Analytics Measurement ID
(function() {
  var GA_ID = 'G-XXXXXXXXXX';

  // Load GA script
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  // Track story page views
  if (window.STORY_SLUG) {
    gtag('event', 'story_view', {
      story_slug: window.STORY_SLUG,
      story_title: window.STORY_TITLE || ''
    });
  }
})();
