---
title: "On-page SEO (title, description, canonical, structured data)"
layout: base.njk
category: Frontend
tags: [seo, html, frontend, web]
---

The SEO signals you control **inside** the page itself — as opposed to off-page
(backlinks). It's what the [[html-starter-template|HTML starter template]] already wires
up; [[open-graph-protocol|Open Graph]] handles the social-sharing side.

## The `<head>` essentials

```html
<title>Unique title, ≤ 60 characters</title>
<meta name="description" content="Persuasive summary, ≤ 160 characters." />
<link rel="canonical" href="https://site.com/page" />
<meta name="robots" content="index, follow" />
```

- **`title`** — the most visible on-page factor (it becomes the blue link on Google).
  Unique per page, with the keyword near the start.
- **`description`** — not a direct ranking factor, but the snippet text drives **CTR**.
  Write it like an ad.
- **`canonical`** — points to the preferred URL when the same content lives at several
  addresses (with/without `www`, tracking params). Prevents duplicate content.
- **`robots`** — `noindex` removes the page from the index; `nofollow` skips its links.

## Semantic structure

Semantic HTML helps the crawler understand the hierarchy:

- **A single `<h1>`** per page describing the main topic.
- `<h2>`/`<h3>` in logical order, without skipping levels for looks.
- Descriptive `alt` on every `<img>` — accessibility **and** image SEO.
- Short, readable URLs (`/blog/on-page-seo`, not `/p?id=42`).

## Structured data (JSON-LD)

Marks up the content in [schema.org](https://schema.org/) vocabulary and enables _rich
results_ (stars, breadcrumbs, FAQ). It goes in a `<script>` in the `<head>`:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Article title",
    "datePublished": "2026-06-27",
    "author": { "@type": "Person", "name": "Name" }
  }
</script>
```

## Multilingual sites: `hreflang`

Each language is a URL, linked via `hreflang` so Google serves the right version — see
[[i18n-web|i18n on the web]]. Always include the `x-default` tag.

## Quick checklist

- [ ] Unique `title` ≤ 60 and `description` ≤ 160.
- [ ] `canonical` pointing to the preferred URL.
- [ ] One `<h1>` and a coherent heading hierarchy.
- [ ] `alt` on every image.
- [ ] JSON-LD for the content type.
- [ ] `sitemap.xml` and `robots.txt` published.

---

Related: [[open-graph-protocol|Open Graph]] ·
[[html-starter-template|HTML starter template]].
