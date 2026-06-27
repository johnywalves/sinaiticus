---
title: "Open Graph Protocol (social link preview)"
layout: base.njk
category: Frontend
tags: [seo, html, frontend, web]
---

`og:` meta tags that control how a link looks when shared (WhatsApp, LinkedIn, Slack,
Discord). Without them, the network invents a poor preview. Practical use in the
[[html-starter-template|HTML starter template]]; part of [[seo-on-page|on-page SEO]].

## The four required tags

The protocol ([ogp.me](https://ogp.me/)) defines four tags as the minimum for a valid
card:

```html
<meta property="og:title" content="Content title" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://site.com/thumb.jpg" />
<meta property="og:url" content="https://site.com/page" />
```

- ⚠️ It's `property=`, **not** `name=` (unlike the classic SEO meta tags).
- ⚠️ `og:image` and `og:url` must be **absolute HTTPS URLs** — a relative path won't
  resolve when the social network fetches the preview.

## Recommended (improve the card)

```html
<meta property="og:description" content="Summary up to ~160 characters." />
<meta property="og:site_name" content="Site Name" />
<meta property="og:locale" content="en_US" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="628" />
<meta property="og:image:alt" content="Image description" />
```

- **Image:** ideally **1200×628px** (~1.91:1 ratio), up to ~300KB, HTTPS. Declaring
  `width`/`height` stops the card from flickering while the network measures the image.

## Types (`og:type`)

| Value     | When to use                          |
| :-------- | :----------------------------------- |
| `website` | Generic pages (home, landing).       |
| `article` | Posts and news (accepts `article:`). |
| `book`    | Books.                               |
| `profile` | A person's profile.                  |

> Prefixed types (`article:published_time`, `og:video`) unlock extra fields — full list
> at [OGP Types](https://ogp.me/#types).

## Twitter Cards: the complement

X/Twitter reads its own `twitter:` tags but **falls back to Open Graph** when they're
missing. The minimum is to declare the card format:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Content title" />
<meta name="twitter:image" content="https://site.com/thumb.jpg" />
```

- ⚠️ Here it's `name=` again (not `property=`).

## How to validate

- **Sharing Debugger** (Facebook) — forces a recache and shows how the card will render.
- **Post Inspector** (LinkedIn) — the LinkedIn equivalent.
- ⚠️ Networks **cache** the preview; after changing a tag, run the debugger to bust the
  old cache.

---

Related: [[seo-on-page|on-page SEO]] · [[html-starter-template|HTML starter template]].
