---
title: "Code-Splitting em React (reduzir bundle inicial)"
layout: base.njk
category: Frontend
tags: [react, performance, frontend, interview]
---

**Summary:** I use a combination of route-based, component-based, and vendor
chunk splitting, combined with lazy loading and preloading strategies.

## Implementation
- **Route-based splitting:** Each route is a dynamic import using `React.lazy` +
  `Suspense`. This loads only the JavaScript needed for the current page.
- **Component-based splitting:** Heavy components (charts, rich text editors,
  modals) are lazy-loaded when they become visible or on user interaction.
- **Vendor splitting:** Webpack/Turbopack splits third-party libraries into
  separate chunks. Critical ones (React, React DOM) in a single vendor chunk;
  large ones (D3, Moment) split further to avoid bloating the main bundle.
- **Preloading:** `<link rel="preload">` and `webpackPrefetch` to load chunks for
  the next likely route without blocking the main thread.
- **Bundle analysis:** Run `webpack-bundle-analyzer` regularly to identify large
  dependencies and replace them with lighter alternatives (`date-fns` vs
  `moment`).

## Real-world example (Seguralta)
We reduced the main bundle from **2.1 MB to 780 KB** (≈63% reduction) by:
1. Lazy-loading the dashboard's heavy charts and tables.
2. Moving large libs to separate chunks.
3. Prefetching the settings page (high-traffic).

**Trade-offs:** More chunks increase network requests (mitigated by HTTP/2 and
aggressive caching). Set `webpackChunkName` to keep naming predictable.

---
Relacionadas: [[microfrontend-communication|micro-frontends]] ·
[[nix-interview-prep|índice]].
