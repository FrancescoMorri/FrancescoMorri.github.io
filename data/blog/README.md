# Blog Content

Blog posts live in `data/blog/posts/` as Markdown files. Images and plots live in `data/blog/graphics/`.

Add published posts to `data/blog/index.json`:

```json
[
  {
    "title": "Learning Notes",
    "slug": "learning-notes",
    "date": "2026-05-24",
    "summary": "Short description shown on the blog page.",
    "tags": ["math", "marl"],
    "file": "posts/learning-notes.md"
  }
]
```

Use math in Markdown with `$inline math$` or `$$display math$$`.

Reference graphics from a post with relative paths:

```md
![Plot description](../graphics/my-plot.png)

[Open PDF figure](../graphics/my-figure.pdf)
```
