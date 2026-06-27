---
title: "SEO on-page (title, description, canonical, dados estruturados)"
layout: base.njk
category: Frontend
tags: [seo, html, frontend, web]
---

Os sinais de SEO que você controla **dentro** da própria página — diferente do off-page
(backlinks). É o que o [[html-starter-template|modelo inicial de HTML]] já deixa pronto;
o [[open-graph-protocol|Open Graph]] cuida da parte de compartilhamento social.

## Os essenciais do `<head>`

```html
<title>Título único, ≤ 60 caracteres</title>
<meta name="description" content="Resumo persuasivo, ≤ 160 caracteres." />
<link rel="canonical" href="https://site.com/pagina" />
<meta name="robots" content="index, follow" />
```

- **`title`** — o fator on-page mais visível (vira o link azul no Google). Único por
  página, com a palavra-chave no começo.
- **`description`** — não é fator de ranqueamento direto, mas o texto do snippet afeta o
  **CTR**. Escreva como um anúncio.
- **`canonical`** — aponta para a URL preferida quando o mesmo conteúdo existe em vários
  endereços (com/sem `www`, parâmetros de tracking). Evita conteúdo duplicado.
- **`robots`** — `noindex` tira a página do índice; `nofollow` não segue os links.

## Estrutura semântica

O HTML semântico ajuda o crawler a entender a hierarquia:

- **Um único `<h1>`** por página, descrevendo o tema principal.
- `<h2>`/`<h3>` em ordem lógica, sem pular níveis só por estética.
- `alt` descritivo em toda `<img>` — acessibilidade **e** SEO de imagens.
- URLs curtas e legíveis (`/blog/seo-on-page`, não `/p?id=42`).

## Dados estruturados (JSON-LD)

Marca o conteúdo em vocabulário [schema.org](https://schema.org/) e habilita _rich
results_ (estrelas, breadcrumbs, FAQ). Vai num `<script>` no `<head>`:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Título do artigo",
    "datePublished": "2026-06-27",
    "author": { "@type": "Person", "name": "Nome" }
  }
</script>
```

## Sites multilíngues: `hreflang`

Cada idioma é uma URL, ligadas por `hreflang` para o Google servir a versão certa —
ver [[i18n-web|i18n na web]]. Sempre inclua a tag `x-default`.

## Checklist rápido

- [ ] `title` único ≤ 60 e `description` ≤ 160.
- [ ] `canonical` apontando para a URL preferida.
- [ ] Um `<h1>` e hierarquia de headings coerente.
- [ ] `alt` em todas as imagens.
- [ ] JSON-LD para o tipo de conteúdo.
- [ ] `sitemap.xml` e `robots.txt` publicados.

---

Relacionadas: [[open-graph-protocol|Open Graph]] ·
[[html-starter-template|modelo inicial de HTML]].
