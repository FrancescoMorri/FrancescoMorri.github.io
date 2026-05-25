(() => {
  const DATA_URL = "data/blog/index.json";
  const BLOG_ROOT = "data/blog/";

  const titleEl = document.getElementById("postTitle");
  const summaryEl = document.getElementById("postSummary");
  const dateEl = document.getElementById("postDate");
  const tagsEl = document.getElementById("postTags");
  const contentEl = document.getElementById("postContent");
  const errorEl = document.getElementById("postError");

  if (!contentEl) return;

  const safeText = (v) => (v ?? "").toString().trim();

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function parseDate(value) {
    const raw = safeText(value);
    if (!raw) return null;
    const time = Date.parse(raw);
    return Number.isFinite(time) ? new Date(time) : null;
  }

  function formatDate(raw) {
    const date = parseDate(raw);
    if (!date) return raw;
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  function resolveFrom(baseUrl, rawUrl) {
    const value = safeText(rawUrl);
    if (!value || value.startsWith("#") || value.startsWith("mailto:")) return value;
    return new URL(value, baseUrl).href;
  }

  function protectDisplayMath(markdown) {
    const codeBlocks = [];
    const placeholder = (match) => {
      const token = `@@BLOG_CODE_BLOCK_${codeBlocks.length}@@`;
      codeBlocks.push(match);
      return token;
    };

    const withoutCode = markdown.replace(/(^|\n)(```|~~~)[\s\S]*?\n\2(?=\n|$)/g, placeholder);
    const withDisplayMath = withoutCode.replace(
      /(^|\n)[ \t]*\$\$[ \t]*\n([\s\S]*?)\n[ \t]*\$\$[ \t]*(?=\n|$)/g,
      (_match, lead, body) => `${lead}<div class="math-display">\n\\[\n${body.trim()}\n\\]\n</div>`
    );

    return withDisplayMath.replace(/@@BLOG_CODE_BLOCK_(\d+)@@/g, (_match, index) => codeBlocks[Number(index)]);
  }

  function renderMarkdown(markdown) {
    const preparedMarkdown = protectDisplayMath(markdown);

    if (window.marked?.parse) {
      window.marked.setOptions({ gfm: true, breaks: false });
      return window.marked.parse(preparedMarkdown);
    }

    return `<pre>${escapeHtml(preparedMarkdown)}</pre>`;
  }

  function addHeadingIds(root) {
    const used = new Set();
    root.querySelectorAll("h2, h3, h4").forEach((heading) => {
      if (heading.id) return;
      const base = heading.textContent
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "section";
      let id = base;
      let n = 2;
      while (used.has(id) || document.getElementById(id)) {
        id = `${base}-${n}`;
        n += 1;
      }
      used.add(id);
      heading.id = id;
    });
  }

  function replacePdfImages(root) {
    root.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!/\.pdf(?:[?#].*)?$/i.test(src)) return;

      const frame = document.createElement("iframe");
      frame.className = "blog-pdf";
      frame.src = src;
      frame.title = img.alt || "Embedded PDF figure";
      frame.loading = "lazy";
      img.replaceWith(frame);
    });
  }

  function prepareRenderedContent(root, markdownUrl) {
    root.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      img.src = resolveFrom(markdownUrl, src);
      img.loading = "lazy";
      if (!img.alt) img.alt = "";
    });

    root.querySelectorAll("a[href]").forEach((anchor) => {
      const rawHref = anchor.getAttribute("href");
      const resolved = resolveFrom(markdownUrl, rawHref);
      anchor.href = resolved;

      if (/^https?:\/\//i.test(resolved) && new URL(resolved).origin !== location.origin) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
    });

    replacePdfImages(root);
    addHeadingIds(root);
  }

  async function typesetMath() {
    try {
      if (window.MathJax?.startup?.promise) {
        await window.MathJax.startup.promise;
      }
      if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise([contentEl]);
      }
    } catch (err) {
      console.error("MathJax typesetting failed:", err);
    }
  }

  function showError(message) {
    contentEl.innerHTML = "";
    if (errorEl) {
      errorEl.textContent = message || "Could not load this post.";
      errorEl.removeAttribute("hidden");
    }
  }

  async function load() {
    errorEl?.setAttribute("hidden", "");

    const slug = safeText(new URLSearchParams(location.search).get("post"));
    if (!slug) {
      showError("No blog post was selected.");
      return;
    }

    try {
      const indexRes = await fetch(DATA_URL, { cache: "no-store" });
      if (!indexRes.ok) throw new Error(`Failed to fetch ${DATA_URL} (${indexRes.status})`);

      const index = await indexRes.json();
      if (!Array.isArray(index)) throw new Error("data/blog/index.json must be an array");

      const post = index.find((item) => safeText(item.slug) === slug && !item.draft);
      if (!post) {
        showError("This blog post does not exist or is not published.");
        return;
      }

      const file = safeText(post.file);
      if (!file) throw new Error("Post is missing a file path");

      const markdownUrl = new URL(file, new URL(BLOG_ROOT, location.href)).href;
      const postRes = await fetch(markdownUrl, { cache: "no-store" });
      if (!postRes.ok) throw new Error(`Failed to fetch ${markdownUrl} (${postRes.status})`);

      const markdown = await postRes.text();
      const unsafeHtml = renderMarkdown(markdown);
      contentEl.innerHTML = window.DOMPurify
        ? window.DOMPurify.sanitize(unsafeHtml, {
            ADD_TAGS: ["iframe"],
            ADD_ATTR: ["loading", "target"],
          })
        : unsafeHtml;

      if (titleEl) titleEl.textContent = safeText(post.title) || "Untitled";
      if (summaryEl) {
        summaryEl.textContent = safeText(post.summary);
        summaryEl.hidden = !summaryEl.textContent;
      }
      if (dateEl) {
        const dateRaw = safeText(post.date);
        dateEl.textContent = formatDate(dateRaw);
        if (dateRaw) dateEl.dateTime = dateRaw;
      }
      if (tagsEl) {
        const tags = Array.isArray(post.tags) ? post.tags.map(safeText).filter(Boolean) : [];
        tagsEl.textContent = tags.join(", ");
        tagsEl.hidden = !tags.length;
      }

      document.title = `${safeText(post.title) || "Blog Post"} - Blog`;
      prepareRenderedContent(contentEl, markdownUrl);
      await typesetMath();
    } catch (err) {
      console.error(err);
      showError("Could not load this post.");
    }
  }

  load();
})();
