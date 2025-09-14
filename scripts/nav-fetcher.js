document.addEventListener('DOMContentLoaded', () => {
  const slots = document.querySelectorAll('[data-include]');
  slots.forEach(async (slot) => {
    let file = slot.getAttribute('data-include') || '';
    if (!/\.html?$/i.test(file)) file += '.html';
    try {
      const res = await fetch(file, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const html = await res.text();
      const tmp = document.createElement('div');
      tmp.innerHTML = html.trim();
      while (tmp.firstChild) slot.parentNode.insertBefore(tmp.firstChild, slot);
      slot.remove();

      // Load nav behavior exactly once
      if (!document.querySelector('script[data-nav-ready]')) {
        const s = document.createElement('script');
        s.src = '/scripts/nav.js';
        s.defer = true;
        s.setAttribute('data-nav-ready', '1');
        document.body.appendChild(s);
      }
    } catch (err) {
      console.error('Include failed for', file, err);
      slot.remove();
    }
  });
});
