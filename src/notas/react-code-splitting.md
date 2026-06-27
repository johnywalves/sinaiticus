---
title: "Code-Splitting em React (reduzir o bundle inicial)"
layout: base.njk
category: Frontend
tags: [react, performance, frontend, interview]
---

Complemento prático de [[react-performance|React performance]]: adiar JavaScript
é uma das maiores alavancas sobre o carregamento inicial.

**Resumo:** combino splitting por rota, por componente e de vendor, somado a
lazy loading e estratégias de preload.

## Implementação

- **Splitting por rota:** cada rota é um import dinâmico com `React.lazy` +
  `Suspense`. Carrega só o JavaScript necessário para a página atual.
- **Splitting por componente:** componentes pesados (gráficos, editores rich
  text, modais) são carregados sob demanda — ao ficarem visíveis ou na interação.
- **Vendor splitting:** Webpack/Turbopack separa bibliotecas de terceiros em
  chunks próprios. Os críticos (React, React DOM) num único chunk de vendor; os
  grandes (D3, Moment) subdivididos para não inchar o bundle principal.
- **Preloading:** `<link rel="preload">` e `webpackPrefetch` para carregar o
  chunk da próxima rota provável sem bloquear a main thread.
- **Análise de bundle:** rodar `webpack-bundle-analyzer` com frequência para
  identificar dependências grandes e trocá-las por alternativas mais leves
  (`date-fns` vs `moment`).

## Exemplo real (Seguralta)

Reduzimos o bundle principal de **2,1 MB para 780 KB** (≈63% de redução) com:

1. Lazy-load dos gráficos e tabelas pesados do dashboard.
2. Movendo libs grandes para chunks separados.
3. Prefetch da página de configurações (alto tráfego).

**Trade-offs:** mais chunks aumentam o número de requisições (mitigado por HTTP/2
e cache agressivo). Defina `webpackChunkName` para manter nomes previsíveis.

---

Relacionadas: [[react-performance]] · [[microfrontend-communication|micro-frontends]] ·
[[nix-interview-prep|índice]].
