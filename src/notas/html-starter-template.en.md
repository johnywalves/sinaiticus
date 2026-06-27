---
title: "HTML Page Starter Template (meta tags, OG, manifest, sitemap)"
layout: base.njk
category: Frontend
tags: [html, seo, frontend, web]
---

A template to copy and start an HTML page with a complete `<head>` — [[seo-on-page|SEO]]
meta tags, [[open-graph-protocol|Open Graph]], Twitter Cards and a CSS reset. A reference
cheatsheet: I got tired of having to remember all of this every single time. :)

## The base template

Paste it and replace the placeholders (see the [table below](#values-to-replace)).

```html
<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="theme-color" content="#e0138c" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#282c35" media="(prefers-color-scheme: dark)" />
    <meta name="color-scheme" content="dark light" />

    <title>Page Title</title>
    <meta name="description" content="Page Description" />
    <link rel="canonical" href="https://url.page" />
    <link rel="alternate" hreflang="pt-br" href="https://url.page" />
    <link rel="alternate" hreflang="en" href="https://url.page/en" />
    <link rel="alternate" hreflang="x-default" href="https://url.page" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Page Name" />
    <meta property="og:url" content="https://url.page" />
    <meta property="og:title" content="Page Title" />
    <meta property="og:description" content="Page Description" />
    <meta property="og:image" content="/path/to/thumbnail" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="628" />
    <meta property="og:image:alt" content="Page Description" />
    <meta property="og:locale" content="pt_BR" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://url.page" />
    <meta name="twitter:title" content="Page Title" />
    <meta name="twitter:description" content="Page Description" />
    <meta name="twitter:image" content="/path/to/thumbnail" />

    <style>
      /* Reset CSS */
      *,
      *:before,
      *:after {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
      }

      html {
        --14px: 0.875rem;
        --16px: 1rem;
        --18px: 1.125rem;
        --21px: 1.3125rem;
        --24px: 1.5rem;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
          Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      }

      ol,
      ul {
        list-style: none;
      }

      a,
      a:hover,
      a:visited {
        text-decoration: none;
        color: inherit;
      }

      /* Content CSS */
      :root {
        --color-background: #282c35;
        --color-text: #e0138c;
      }

      body {
        background: var(--color-background);
        color: var(--color-text);
      }
    </style>
  </head>

  <body></body>

  <script type="module"></script>
</html>
```

## Values to replace

| Placeholder          | What it is       | Recommendation                                     |
| :------------------- | :--------------- | :------------------------------------------------- |
| `Page Title`         | Page title       | Max **60** chars; ideally **> 50**.                |
| `Page Name`          | Site name        | Max **65** chars.                                  |
| `Page Description`   | Page description | Max **160** chars; ideally **> 100**.              |
| `url.page`           | Permanent URL    | Canonical address of the content.                  |
| `/path/to/thumbnail` | Share image      | Absolute HTTPS URL, **1200×628px**, max **300KB**. |

- ⚠️ In `og:type`, set the real type: `website`, `article`, `book`, `profile`, or one of
  the [OGP Type](https://ogp.me/#types) values.
- ⚠️ Define your colors in `:root` and **repeat the theme color** in
  `<meta name="theme-color">` — the two don't sync on their own.
- The **canonical** (`<link rel="canonical">`) prevents duplicate content when the same
  page is reachable from more than one URL — always point to the preferred version.
- Drop `<meta http-equiv="X-UA-Compatible">`: it only served IE11, now discontinued.
  Prefer `<script type="module">` over the old `type="text/javascript"`.
- **Two `theme-color` tags with `media`** let the browser bar follow the system's
  light/dark theme (`prefers-color-scheme`).
- **`hreflang`** declares the per-language versions plus `x-default`; each page should
  list all of its variants, itself included. See [[i18n-web|i18n on the web]].

## Additional meta tags

Add them as the content calls for it.

```html
<!-- Authorship (common in articles) -->
<meta name="author" content="Author Name" />
<meta name="twitter:creator" content="Author Twitter" />

<!-- Keywords, comma-separated: css, html, javascript -->
<meta name="keywords" content="List of the keywords" />
<meta name="news_keywords" content="List of the keywords" />

<!-- Favicon and iOS icon (swap the type for another extension) -->
<link rel="icon" href="/path/to/icon.png" type="image/png" />
<link rel="apple-touch-icon" href="/path/to/apple-touch-icon.png" />
```

## Referencing external files

```html
<link rel="stylesheet" href="/path/to/styles.css" />
<script src="/path/to/scripts.js"></script>
<link rel="manifest" href="manifest.json" />
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
```

When pulling **external fonts** (e.g. Google Fonts), add `preconnect` to open the
connection early and cut render delay. The reset above uses the system _font stack_, so
by default this isn't needed:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## Manifest (`manifest.json`)

Presents the app to the browser (PWA install, icons, theme colors).

```json
{
  "$schema": "https://json.schemastore.org/web-manifest-combined.json",
  "name": "Johny W. Alves | Web Developer",
  "short_name": "Johny W. Alves",
  "description": "Web developer, data science student, and amateur comic artist.",
  "display": "fullscreen",
  "background_color": "#0e4266",
  "theme_color": "#e0138c",
  "start_url": "/",
  "icons": [
    { "src": "/img/icon-192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "/img/icon-512.png", "type": "image/png", "sizes": "512x512" }
  ]
}
```

## Sitemap (`sitemap.xml`)

Lists the available paths for crawlers.

```xml
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>https://url.page</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

## Structured data (JSON-LD)

Helps Google understand the content and enables _rich results_ (cards, breadcrumbs,
stars). Add a `<script type="application/ld+json">` in the `<head>`; the `@type` varies
with the content (`WebSite`, `Article`, `Product`…) — see [schema.org](https://schema.org/).

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://url.page",
  "name": "Page Name",
  "description": "Page Description"
}
```

## References and tools

- [OGP — Open Graph Protocol](https://ogp.me/) — spec for the `og:` tags.
- [Rich Results Test](https://search.google.com/test/rich-results) — validates the JSON-LD.
- [Web Manifest (MDN)](https://developer.mozilla.org/docs/Web/Manifest) — PWA fields.
- **Google Search Console sitemap validator** — checks indexing.
