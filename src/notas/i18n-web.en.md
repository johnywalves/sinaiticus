---
title: "i18n on the web (hreflang, URL strategy, locale)"
layout: base.njk
category: Frontend
tags: [i18n, seo, web, frontend]
---

How to serve the same site in several languages without confusing users or search
engines. Closes the gap flagged in the [[html-starter-template|HTML starter template]]
and in [[seo-on-page|on-page SEO]]: each language is a URL, linked to the others via
`hreflang`.

## URL strategy: one per language

Each version needs its **own, indexable** address (never switch language only on the
client via JS — the crawler won't see it).

| Pattern   | Example            | Trade-off                                 |
| :-------- | :----------------- | :---------------------------------------- |
| Subpath   | `site.com/en/page` | Simple, inherits domain authority. ✅     |
| Subdomain | `en.site.com/page` | Separates infra; authority more diluted.  |
| ccTLD     | `site.de/seite`    | Strong geo signal; expensive to maintain. |

> This garden uses a **subpath**: PT at the root (`/notas/...`), EN at `/en/notas/...`.

## `hreflang`: linking the versions

In the `<head>` of **every** page, declare all variants — itself included — plus
`x-default` (fallback for uncovered languages):

```html
<link rel="alternate" hreflang="pt-br" href="https://site.com/page" />
<link rel="alternate" hreflang="en" href="https://site.com/en/page" />
<link rel="alternate" hreflang="x-default" href="https://site.com/page" />
```

- ⚠️ **Bidirectional:** if A points to B, B must point back to A. Google ignores
  one-sided links.
- ⚠️ Use the right code: language (`en`) or language-region (`pt-br`, `en-gb`) per
  [BCP 47](https://www.rfc-editor.org/rfc/rfc5646) — don't use the underscore `pt_BR`
  here (that format belongs to `og:locale`, not `hreflang`).

## The HTML `lang` attribute

Independent of SEO, mark the content language for screen readers, hyphenation, and
machine translation:

```html
<html lang="en">
  <!-- snippet in another language -->
  <blockquote lang="pt-br">Ser ou não ser</blockquote>
</html>
```

## Locale-aware formatting

Translating text is only half of it — numbers, dates, and currency change by region.
Use the native `Intl` API instead of formatting by hand:

```ts
const price = 1234.5;
new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
// "R$ 1.234,50"
new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
// "$1,234.50"
```

## Checklist

- [ ] Each language has its own, indexable URL (not switched via JS).
- [ ] `hreflang` on every page, bidirectional, with `x-default`.
- [ ] Correct `<html lang>` on each version.
- [ ] `og:locale` matching the page language (see [[open-graph-protocol|Open Graph]]).
- [ ] Dates/numbers/currency via `Intl`, not hardcoded.

---

Related: [[seo-on-page|on-page SEO]] · [[open-graph-protocol|Open Graph]] ·
[[html-starter-template|HTML starter template]].
