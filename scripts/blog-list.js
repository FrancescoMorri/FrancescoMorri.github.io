(() => {
  const DATA_URL = "data/blog/index.json";

  const listEl = document.getElementById("blogList");
  const emptyEl = document.getElementById("blogEmpty");
  const errorEl = document.getElementById("blogError");
  const searchEl = document.getElementById("blogSearch");
  const sortEl = document.getElementById("blogSort");
  const tagsEl = document.getElementById("blogTags");
  const countEl = document.getElementById("blogResultCount");
  const tpl = document.getElementById("blogCardTemplate");

  if (!listEl || !tpl) return;

  let allPosts = [];
  let activeTags = new Set();

  const safeText = (v) => (v ?? "").toString().trim();
  const norm = (v) => safeText(v).toLowerCase().normalize("NFKD");

  function parseDate(value) {
    const raw = safeText(value);
    if (!raw) return null;
    const time = Date.parse(raw);
    return Number.isFinite(time) ? new Date(time) : null;
  }

  function formatDate(raw, date) {
    if (!date) return raw;
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  function clearList() {
    while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
  }

  function postUrl(post) {
    return `blog-post.html?post=${encodeURIComponent(post.slug)}`;
  }

  function matchesSearch(post, q) {
    if (!q) return true;
    const hay = [post.title, post.summary, post.dateRaw, post.tags.join(" ")]
      .join(" ")
      .toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function matchesTags(post) {
    if (!activeTags.size) return true;
    const tags = post.tags.map(norm);
    return Array.from(activeTags).every((tag) => tags.includes(tag));
  }

  function sortPosts(posts, mode) {
    const dir = mode === "oldest" ? 1 : -1;
    return [...posts].sort((a, b) => {
      if (!a.date && !b.date) return a.title.localeCompare(b.title);
      if (!a.date) return 1;
      if (!b.date) return -1;
      return (a.date.getTime() - b.date.getTime()) * dir;
    });
  }

  function renderTags() {
    if (!tagsEl) return;
    tagsEl.textContent = "";

    const tags = Array.from(new Set(allPosts.flatMap((post) => post.tags.map(norm))))
      .filter(Boolean)
      .sort();

    const frag = document.createDocumentFragment();
    for (const tag of tags) {
      const btn = document.createElement("button");
      btn.className = "blog-tag";
      btn.type = "button";
      btn.textContent = tag;
      btn.setAttribute("aria-pressed", String(activeTags.has(tag)));
      btn.setAttribute("role", "listitem");
      btn.addEventListener("click", () => {
        if (activeTags.has(tag)) activeTags.delete(tag);
        else activeTags.add(tag);
        btn.setAttribute("aria-pressed", String(activeTags.has(tag)));
        applyAndRender();
      });
      frag.appendChild(btn);
    }

    tagsEl.appendChild(frag);
  }

  function render(posts) {
    clearList();

    if (!posts.length) {
      if (emptyEl) {
        emptyEl.textContent = allPosts.length
          ? "No blog posts match your search."
          : "No blog posts have been published yet.";
        emptyEl.removeAttribute("hidden");
      }
      if (countEl) countEl.textContent = "";
      return;
    }

    emptyEl?.setAttribute("hidden", "");
    if (countEl) {
      countEl.textContent = `${posts.length} post${posts.length === 1 ? "" : "s"} shown`;
    }

    const frag = document.createDocumentFragment();
    for (const post of posts) {
      const node = tpl.content.cloneNode(true);
      const linkEl = node.querySelector(".blog-card__link");
      const titleEl = node.querySelector(".blog-card__title");
      const summaryEl = node.querySelector(".blog-card__summary");
      const dateEl = node.querySelector(".blog-card__date");
      const tagsElInCard = node.querySelector(".blog-card__tags");

      if (linkEl) linkEl.href = postUrl(post);
      if (titleEl) titleEl.textContent = post.title || "Untitled";
      if (summaryEl) summaryEl.textContent = post.summary || "";
      if (dateEl) {
        dateEl.textContent = post.displayDate;
        if (post.dateRaw) dateEl.dateTime = post.dateRaw;
      }
      if (tagsElInCard) tagsElInCard.textContent = post.tags.join(", ");

      frag.appendChild(node);
    }

    listEl.appendChild(frag);
  }

  function applyAndRender() {
    const q = safeText(searchEl?.value);
    const mode = sortEl?.value || "newest";
    const filtered = allPosts.filter((post) => matchesSearch(post, q) && matchesTags(post));
    render(sortPosts(filtered, mode));
  }

  async function load() {
    emptyEl?.setAttribute("hidden", "");
    errorEl?.setAttribute("hidden", "");

    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch ${DATA_URL} (${res.status})`);

      const raw = await res.json();
      if (!Array.isArray(raw)) throw new Error("data/blog/index.json must be an array");

      const showDrafts = new URLSearchParams(location.search).get("drafts") === "1";
      allPosts = raw
        .filter((post) => showDrafts || !post.draft)
        .map((post) => {
          const dateRaw = safeText(post.date);
          const date = parseDate(dateRaw);
          return {
            title: safeText(post.title),
            slug: safeText(post.slug),
            summary: safeText(post.summary),
            file: safeText(post.file),
            dateRaw,
            date,
            displayDate: formatDate(dateRaw, date),
            tags: Array.isArray(post.tags) ? post.tags.map(safeText).filter(Boolean) : [],
          };
        })
        .filter((post) => post.slug && post.file);

      renderTags();
      applyAndRender();

      searchEl?.addEventListener("input", applyAndRender);
      sortEl?.addEventListener("change", applyAndRender);
    } catch (err) {
      console.error(err);
      clearList();
      errorEl?.removeAttribute("hidden");
      if (countEl) countEl.textContent = "";
    }
  }

  load();
})();
