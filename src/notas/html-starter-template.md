---
title: "Modelo Inicial de Página HTML (meta tags, OG, manifest, sitemap)"
layout: base.njk
category: Frontend
tags: [html, seo, frontend, web]
---

Modelo para copiar e começar uma página HTML já com `<head>` completo — meta tags de
[[seo-on-page|SEO]], [[open-graph-protocol|Open Graph]], Twitter Cards e um reset de
CSS. Cheatsheet de referência: cansei de ter de lembrar tudo isso toda vez. :)

## O modelo base

Cole e substitua os marcadores (ver a [tabela abaixo](#valores-a-substituir)).

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

## Valores a substituir

| Marcador             | O que é                | Recomendação                                        |
| :------------------- | :--------------------- | :-------------------------------------------------- |
| `Page Title`         | Título da página       | Máx. **60** caracteres; ideal **> 50**.             |
| `Page Name`          | Nome do site           | Máx. **65** caracteres.                             |
| `Page Description`   | Descrição da página    | Máx. **160** caracteres; ideal **> 100**.           |
| `url.page`           | URL permanente         | Endereço canônico do conteúdo.                      |
| `/path/to/thumbnail` | Imagem de compartilhar | URL absoluta HTTPS, **1200×628px**, máx. **300KB**. |

- ⚠️ Em `og:type`, informe o tipo real: `website`, `article`, `book`, `profile` ou um
  dos tipos do [OGP Type](https://ogp.me/#types).
- ⚠️ Defina as cores no `:root` e **repita a cor do tema** em `<meta name="theme-color">`
  — as duas não se sincronizam sozinhas.
- O **canonical** (`<link rel="canonical">`) evita conteúdo duplicado quando a mesma
  página é acessível por mais de uma URL — aponte sempre para a versão preferida.
- Dispense o `<meta http-equiv="X-UA-Compatible">`: só servia ao IE11, já
  descontinuado. Prefira `<script type="module">` ao antigo `type="text/javascript"`.
- **Dois `theme-color` com `media`** deixam a barra do navegador acompanhar o tema
  claro/escuro do sistema (`prefers-color-scheme`).
- **`hreflang`** declara as versões por idioma mais a `x-default`; cada página deve
  listar todas as suas variantes, inclusive ela mesma. Ver [[i18n-web|i18n na web]].

## Meta tags adicionais

Entram conforme o conteúdo pede.

```html
<!-- Autoria (comum em artigos) -->
<meta name="author" content="Author Name" />
<meta name="twitter:creator" content="Author Twitter" />

<!-- Palavras-chave, separadas por vírgula: css, html, javascript -->
<meta name="keywords" content="List of the keywords" />
<meta name="news_keywords" content="List of the keywords" />

<!-- Favicon e ícone para iOS (troque o type para outra extensão) -->
<link rel="icon" href="/path/to/icon.png" type="image/png" />
<link rel="apple-touch-icon" href="/path/to/apple-touch-icon.png" />
```

## Referenciar arquivos externos

```html
<link rel="stylesheet" href="/path/to/styles.css" />
<script src="/path/to/scripts.js"></script>
<link rel="manifest" href="manifest.json" />
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
```

Ao puxar **fontes externas** (ex.: Google Fonts), adicione `preconnect` para abrir a
conexão cedo e cortar o atraso de renderização. O reset acima usa a _font stack_ do
sistema, então por padrão isso é desnecessário:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## Manifesto (`manifest.json`)

Apresenta o app para o navegador (instalação PWA, ícones, cores de tema).

```json
{
  "$schema": "https://json.schemastore.org/web-manifest-combined.json",
  "name": "Johny W. Alves | Web Developer",
  "short_name": "Johny W. Alves",
  "description": "Desenvolvedor Web, estudante de ciência de dados e quadrinista amador.",
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

Lista os caminhos disponíveis para os crawlers.

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

## Dados estruturados (JSON-LD)

Ajuda o Google a entender o conteúdo e habilita _rich results_ (cards, breadcrumbs,
estrelas). Coloque um `<script type="application/ld+json">` no `<head>`; o `@type` varia
com o conteúdo (`WebSite`, `Article`, `Product`…) — ver [schema.org](https://schema.org/).

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://url.page",
  "name": "Page Name",
  "description": "Page Description"
}
```

## Referências e ferramentas

- [OGP — Open Graph Protocol](https://ogp.me/) — especificação das tags `og:`.
- [Rich Results Test](https://search.google.com/test/rich-results) — valida o JSON-LD.
- [Web Manifest (MDN)](https://developer.mozilla.org/docs/Web/Manifest) — campos do PWA.
- **Validador de Sitemap** do Google Search Console — confere indexação.
