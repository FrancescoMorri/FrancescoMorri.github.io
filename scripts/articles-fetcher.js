// ===== File: /js/articles.js =====
// Expects a JSON file in /data/articles.json
// Each entry: { title, authors, date, "publication type", abstract }
// Notes:
// - "publication type" contains a space, so we read it via bracket notation.
// - date should be parseable by Date (recommended: YYYY-MM-DD).

(() => {
  const DATA_URL = "data/articles.json"; // adjust if your path differs

  const listEl = document.getElementById("articlesList");
  const emptyEl = document.getElementById("articlesEmpty");
  const errorEl = document.getElementById("articlesError");

  const searchEl = document.getElementById("articlesSearch");
  const typeEl = document.getElementById("articlesType");
  const sortEl = document.getElementById("articlesSort");

  const tpl = document.getElementById("articleCardTemplate");

  if (!listEl || !tpl) return;

  let allArticles = [];

  function normalizeType(t) {
    const v = String(t || "").trim().toLowerCase();
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
        return type.toUpperCase();
    }
  }

  // function normalizeHref(raw) {
  //     const s = (raw ?? "").toString().trim();
  //     if (!s) return "";

  //     // Already absolute
  //     if (/^https?:\/\//i.test(s)) return s;

  //     // Protocol-relative
  //     if (/^\/\//.test(s)) return `https:${s}`;

  //     // Common case: "www.example.com/..."
  //     if (/^www\./i.test(s)) return `https://${s}`;

  //     // Otherwise treat as relative (keeps support for local PDFs if you ever mix them)
  //     return new URL(s, window.location.href).href;
  //   }

  function safeText(v) {
    return (v ?? "").toString().trim();
  }

  function parseYear(y) {
    const year = parseInt(y, 10);
    return Number.isFinite(year) ? year : null;
  }

  function matchesSearch(a, q) {
    if (!q) return true;
    const hay = [
      a.title,
      a.authors,
      a.abstract,
      a.publicationType,
      a.dateRaw
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function matchesType(a, selected) {
    if (!selected || selected === "all") return true;
    return a.publicationType === selected;
  }

  // function sortByDate(items, mode) {
  //   const dir = mode === "oldest" ? 1 : -1;
  //   return [...items].sort((x, y) => {
  //     const dx = x.dateObj ? x.dateObj.getTime() : -Infinity;
  //     const dy = y.dateObj ? y.dateObj.getTime() : -Infinity;
  //     // If one date is invalid, push it to bottom
  //     if (!x.dateObj && y.dateObj) return 1;
  //     if (x.dateObj && !y.dateObj) return -1;
  //     if (!x.dateObj && !y.dateObj) return 0;
  //     return (dx - dy) * dir;
  //   });
  // }
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
      const timeEl = node.querySelector(".article-card__date");
      const abstractEl = node.querySelector(".article-card__abstract");
      const venueEl = node.querySelector(".article-card__venue");

      if (!titleLinkEl) {
          console.error("Title link element not found in template");
        } else {
          titleLinkEl.textContent = a.title || "Untitled";
        
          const raw = (a.link ?? "").toString().trim();
          if (raw) {
            titleLinkEl.href = raw.startsWith("http")
              ? raw
              : `https://${raw}`;
          } else {
            titleLinkEl.removeAttribute("href");
          }
        }
      if (badgeEl) {
        badgeEl.textContent = typeLabel(a.publicationType);
        badgeEl.dataset.type = a.publicationType;
      }
      if (authorsEl) authorsEl.textContent = a.authors || "";
      if (timeEl) {
        timeEl.textContent = a.dateDisplay || "";
        if (a.dateObj) timeEl.dateTime = a.dateObj.toISOString().slice(0, 10);
      }
      if (abstractEl) abstractEl.textContent = a.abstract || "";
      if (venueEl) {
        if (a.venue) {
          venueEl.textContent = a.venue;
          venueEl.style.display = "";
        } else {
          venueEl.textContent = "";
          venueEl.style.display = "none";
        }
      }
      if (timeEl) {
        if (a.year) {
          timeEl.textContent = a.year;
          timeEl.removeAttribute("datetime");
        } else {
          timeEl.textContent = "";
        }
      }

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
        const yearRaw = (x.date ?? "").toString().trim();
        const year = parseYear(yearRaw);

        return {
          title: safeText(x.title),
          authors: safeText(x.authors),
          abstract: safeText(x.abstract ?? x.abstratc),
          publicationType,
          venue: (x.venue ?? "").toString().trim(),
          yearRaw,
          year
        };

      });

      applyAndRender();

      // Hook up controls
      if (searchEl) searchEl.addEventListener("input", applyAndRender);
      if (typeEl) typeEl.addEventListener("change", applyAndRender);
      if (sortEl) sortEl.addEventListener("change", applyAndRender);
    } catch (e) {
      console.error(e);
      clearList();
      errorEl?.removeAttribute("hidden");
    }
  }

  load();
})();
