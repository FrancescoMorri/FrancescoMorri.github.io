(function () {
  const root = document;
  const nav = root.getElementById('primary-nav');
  const toggle = root.querySelector('.nav-toggle');

  // Mobile open/close
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Dropdowns
  root.querySelectorAll('.has-dropdown').forEach((li) => {
    const btn = li.querySelector('.dropdown-toggle');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      // close others
      if (open) {
        root.querySelectorAll('.has-dropdown').forEach((other) => {
          if (other !== li) {
            other.classList.remove('open');
            const b = other.querySelector('.dropdown-toggle');
            b && b.setAttribute('aria-expanded', 'false');
          }
        });
      }
    });
  });

  // Close on outside click / Esc
  root.addEventListener('click', () => {
    root.querySelectorAll('.has-dropdown.open').forEach((li) => {
      li.classList.remove('open');
      const b = li.querySelector('.dropdown-toggle');
      b && b.setAttribute('aria-expanded', 'false');
    });
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      root.querySelectorAll('.has-dropdown.open').forEach((li) => {
        li.classList.remove('open');
        const b = li.querySelector('.dropdown-toggle');
        b && b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Mark current page.
try {
  const currentFile = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.links a[aria-current="page"]')
    .forEach(a => a.removeAttribute('aria-current'));

  document.querySelectorAll('.links a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || /^https?:\/\//i.test(href)) return;

    const linkFile = href.split('#')[0].split('?')[0].split('/').pop() || 'index.html';
    if (linkFile === currentFile) a.setAttribute('aria-current', 'page');
  });

  if (currentFile === 'blog-post.html') {
    const blogLink = document.querySelector('.links a[href$="/blog.html"], .links a[href="blog.html"]');
    if (blogLink) {
      document.querySelectorAll('.links a[aria-current="page"]')
        .forEach(a => a.removeAttribute('aria-current'));
      blogLink.setAttribute('aria-current', 'page');
    }
  }
} catch {}

}());
