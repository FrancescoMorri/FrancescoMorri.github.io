(function () {
  const feed = document.getElementById('project-feed');
  if (!feed) return;

  const src = feed.getAttribute('data-src') || 'data/projects.json';
  const searchInput = document.getElementById('project-search');
  const tagsRow = document.getElementById('tags-row');
  const resultCount = document.getElementById('result-count');

  let all = [];
  let activeTags = new Set();

  // Helpers
  const norm = (s) => (s || '').toString().toLowerCase().normalize('NFKD');
  const uniq = (arr) => Array.from(new Set(arr));

  const getAllTags = (list) =>
    uniq(list.flatMap(p => Array.isArray(p.tags) ? p.tags.map(norm) : [])).sort();

  const cardFor = (item) => {
    const {
      title = 'Untitled Project',
      description = '',
      image = '',
      imageAlt = '',
      link = '#',
      tags = [],
      date = ''
    } = item || {};

    // create anchor card
    const a = document.createElement('a');
    a.className = 'project-card';
    a.href = link;
    a.setAttribute('aria-label', title);

    // media
    const media = document.createElement('div');
    media.className = 'project-media';
    if (image) {
      const img = document.createElement('img');
      img.src = image;
      img.alt = imageAlt || title;
      img.loading = 'lazy';
      media.appendChild(img);
    }
    a.appendChild(media);

    // body
    const body = document.createElement('div');
    body.className = 'project-body';
    const h = document.createElement('h2');
    h.className = 'project-title';
    h.textContent = title;
    const p = document.createElement('p');
    p.className = 'project-desc';
    p.textContent = description;
    body.append(h, p);
    a.appendChild(body);

    // meta
    if ((tags && tags.length) || date) {
      const meta = document.createElement('div');
      meta.className = 'project-meta';
      if (date) {
        const span = document.createElement('span');
        span.textContent = date;
        meta.appendChild(span);
      }
      if (tags && tags.length) {
        tags.slice(0, 3).forEach(t => {
          const chip = document.createElement('span');
          chip.className = 'project-tag';
          chip.textContent = t;
          meta.appendChild(chip);
        });
      }
      a.appendChild(meta);
    }
    return a;
  };

  const renderFeed = (list) => {
    const frag = document.createDocumentFragment();
    list.forEach(item => frag.appendChild(cardFor(item)));
    feed.textContent = '';
    feed.appendChild(frag);
  };

  const renderTags = (tags, preselected = []) => {
    tagsRow.textContent = '';
    const frag = document.createDocumentFragment();

    tags.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'tag-chip';
      btn.type = 'button';
      btn.textContent = tag;
      const isOn = preselected.includes(tag);
      btn.setAttribute('aria-pressed', String(isOn));
      if (isOn) activeTags.add(tag);

      btn.addEventListener('click', () => {
        const now = btn.getAttribute('aria-pressed') !== 'true';
        btn.setAttribute('aria-pressed', String(now));
        if (now) activeTags.add(tag); else activeTags.delete(tag);
        applyFilters();
        updateURL();
      });

      btn.setAttribute('role', 'listitem');
      frag.appendChild(btn);
    });

    tagsRow.appendChild(frag);
  };

  const applyFilters = () => {
    const q = norm(searchInput?.value || '');
    const tags = Array.from(activeTags);

    const filtered = all.filter(p => {
      // text filter on title/description
      const t = norm(p.title);
      const d = norm(p.description);
      const passText = !q || t.includes(q) || d.includes(q);

      // tag filter: if none selected, pass; else project must include all selected
      if (!tags.length) return passText;
      const projTags = (p.tags || []).map(norm);
      return passText && tags.every(tag => projTags.includes(tag));
    });

    renderFeed(filtered);
    resultCount.textContent = `${filtered.length} project${filtered.length === 1 ? '' : 's'} shown`;
  };

  // URL sync (so you can share filters)
  const updateURL = () => {
    const params = new URLSearchParams(location.search);
    const q = searchInput?.value?.trim();
    if (q) params.set('q', q); else params.delete('q');
    if (activeTags.size) params.set('tags', Array.from(activeTags).join(',')); else params.delete('tags');
    const url = `${location.pathname}?${params.toString()}`;
    history.replaceState(null, '', url);
  };

  const initFromURL = (tagsAvailable) => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    const tags = (params.get('tags') || '').split(',').map(norm).filter(Boolean);
    if (searchInput) searchInput.value = q;
    // preselect only tags that exist
    const validPre = tags.filter(t => tagsAvailable.includes(t));
    renderTags(tagsAvailable, validPre);
  };

  // Fetch + init
  fetch(src, { cache: 'no-cache' })
    .then(r => {
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      return r.json();
    })
    .then(list => {
      all = Array.isArray(list) ? list : [];
      const tags = getAllTags(all);
      initFromURL(tags);
      renderFeed(all);
      applyFilters();

      // search events (debounced)
      if (searchInput) {
        let t;
        const onInput = () => {
          clearTimeout(t);
          t = setTimeout(() => {
            applyFilters();
            updateURL();
          }, 120);
        };
        searchInput.addEventListener('input', onInput);
      }
    })
    .catch(err => {
      console.error('Project feed error:', err);
      feed.innerHTML = `<p>Couldn’t load projects right now.</p>`;
    });
}());
