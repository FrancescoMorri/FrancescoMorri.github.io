(function() {
  function loadNav() {
    console.log('[nav] → attempting to fetch nav.html…');
    fetch('nav.html')            // adjust this path if needed
      .then(response => {
        console.log('[nav] ← response:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} – ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        const containers = document.querySelectorAll('[data-include="nav"]');
        console.log(`[nav] → found ${containers.length} placeholder(s)`);
        if (!containers.length) {
          console.warn('[nav] no placeholders: check your selector or that script is loaded after the DOM.');
        }
        containers.forEach(el => el.innerHTML = html);
        console.log('[nav] → injection complete');
      })
      .catch(err => console.error('[nav] ✕ failed to load:', err));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNav);
  } else {
    loadNav();
  }
})();