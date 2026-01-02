// ===== File: /js/articles.js =====
// Loads /data/articles.json (array of objects)
// Required fields: title, authors, date (year), "publication type", abstract, link, venue

(() => {
  const DATA_URL = "data/articles.json";

  const listEl = document.getElementById("articlesList");
  const emptyEl = document.getElementById("articlesEmpty");
  const errorEl = document.getElementById("articlesError");

  const searchEl = document.getElementById("articlesSearch");
  const typeEl = document.getElementById("articlesType");
  const sortEl = document.getElementById("articlesSort");

  const tpl = document.getElementById("articleCardTemplate");
  if (!listEl || !tpl) return;

  let allArticles = [];

  const safeText = (v) => (v ?? "").toString().trim();

  function normalizeType(t) {
    const v = safeText(t).toLowerCase();
    if (v === "conference" || v === "conf") return "conf";
    if (v === "journal") return "journal";
    if (v === "preprint" || v === "pre-print" || v === "pre print") return "pre-print";
    return v || "other";
  }

  function typeLabel(type) {
    switch (type) {
      case "conf":
        return "CONF";
      case "journal":
        return "JOURNAL";
      case "pre-print":
        return "PRE-PRINT";
      default:
        return (type || "OTHER").toUpperCase();
    }
  }

  function normalizeHref(raw) {
    const s = safeText(raw);
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;
    if (/^\/\//.test(s)) return `https:${s}`;
    if (/^www\./i.test(s)) return `https://${s}`;
    // If you ever use relative links, this will still work:
    return new URL(s, window.location.href).href;
  }

  function parseYear(y) {
    const year = parseInt(safeText(y), 10);
    return Number.isFinite(year) ? year : null;
  }

  function matchesSearch(a, q) {
    if (!q) return true;
    const qq = q.toLowerCase();
    const hay = [a.title, a.authors, a.abstract, a.publicationType, a.venue, a.link, a.yearRaw]
      .join(" ")
      .toLowerCase();
    return hay.includes(qq);
  }

  function matchesType(a, selected) {
    if (!selected || selected === "all") return true;
    return a.publicationType === selected;
  }

  function sortByYear(items, mode) {
    const dir = mode === "oldest" ? 1 : -1;
    return [...items].sort((a, b) => {
      if (a.year == null && b.year == null) return 0;
      if (a.year == null) return 1;
      if (b.year == null) return -1;
      return (a.year - b.year) * dir;
    });
  }

  function clearList() {
    while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
  }

  function render(items) {
    clearList();

    if (!items.length) {
      emptyEl?.removeAttribute("hidden");
      return;
    }
    emptyEl?.setAttribute("hidden", "");

    const frag = document.createDocumentFragment();

    for (const a of items) {
      const node = tpl.content.cloneNode(true);

      const titleLinkEl = node.querySelector(".article-card__title-link");
      const badgeEl = node.querySelector(".article-card__badge");
      const authorsEl = node.querySelector(".article-card__authors");
      const venueEl = node.querySelector(".article-card__venue");
      const timeEl = node.querySelector(".article-card__date");
      const abstractEl = node.querySelector(".article-card__abstract");

      // Title + Link
      if (titleLinkEl) {
        titleLinkEl.textContent = a.title || "Untitled";

        const href = normalizeHref(a.link);
        if (href) {
          titleLinkEl.setAttribute("href", href); // setAttribute avoids some odd edge cases
          titleLinkEl.target = "_blank";
          titleLinkEl.rel = "noopener noreferrer";
          titleLinkEl.removeAttribute("aria-disabled");
          titleLinkEl.tabIndex = 0;
        } else {
          titleLinkEl.removeAttribute("href");
          titleLinkEl.setAttribute("aria-disabled", "true");
          titleLinkEl.tabIndex = -1;
        }
      }

      // Badge
      if (badgeEl) {
        badgeEl.textContent = typeLabel(a.publicationType);
        badgeEl.dataset.type = a.publicationType;
      }

      // Authors
      if (authorsEl) authorsEl.textContent = a.authors || "";

      // Venue
      if (venueEl) {
        if (a.venue) {
          venueEl.textContent = a.venue;
          venueEl.style.display = "";
        } else {
          venueEl.textContent = "";
          venueEl.style.display = "none";
        }
      }

      // Year
      if (timeEl) {
        timeEl.textContent = a.year ? String(a.year) : "";
        timeEl.removeAttribute("datetime");
      }

      // Abstract
      if (abstractEl) abstractEl.textContent = a.abstract || "";

      frag.appendChild(node);
    }

    listEl.appendChild(frag);
  }

  function applyAndRender() {
    const q = safeText(searchEl?.value);
    const selectedType = typeEl?.value || "all";
    const sortMode = sortEl?.value || "newest";

    let filtered = allArticles.filter((a) => matchesSearch(a, q) && matchesType(a, selectedType));
    filtered = sortByYear(filtered, sortMode);

    render(filtered);
  }

  async function load() {
    errorEl?.setAttribute("hidden", "");
    emptyEl?.setAttribute("hidden", "");

    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch ${DATA_URL} (${res.status})`);

      const raw = await res.json();
      if (!Array.isArray(raw)) throw new Error("articles.json must be an array");

      allArticles = raw.map((x) => {
        const publicationType = normalizeType(x["publication type"] ?? x.publicationType ?? x.type);
        const yearRaw = safeText(x.date);

        return {
          title: safeText(x.title),
          authors: safeText(x.authors),
          abstract: safeText(x.abstract ?? x.abstratc),
          publicationType,
          venue: safeText(x.venue),
          link: safeText(x.link ?? x.url), // supports either key
          yearRaw,
          year: parseYear(yearRaw),
        };
      });

      applyAndRender();

      searchEl?.addEventListener("input", applyAndRender);
      typeEl?.addEventListener("change", applyAndRender);
      sortEl?.addEventListener("change", applyAndRender);
    } catch (e) {
      console.error(e);
      clearList();
      errorEl?.removeAttribute("hidden");
    }
  }

  load();
})();
