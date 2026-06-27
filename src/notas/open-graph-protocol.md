---
title: "Open Graph Protocol (preview de link em redes sociais)"
layout: base.njk
category: Frontend
tags: [seo, html, frontend, web]
---

Meta tags `og:` que controlam como um link aparece quando compartilhado (WhatsApp,
LinkedIn, Slack, Discord). Sem elas, a rede inventa um preview ruim. Aplicação prática
no [[html-starter-template|modelo inicial de HTML]]; parte do [[seo-on-page|SEO on-page]].

## As quatro obrigatórias

O protocolo ([ogp.me](https://ogp.me/)) define quatro tags como o mínimo para um card
válido:

```html
<meta property="og:title" content="Título do conteúdo" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://site.com/thumb.jpg" />
<meta property="og:url" content="https://site.com/pagina" />
```

- ⚠️ É `property=`, **não** `name=` (diferente das meta tags clássicas de SEO).
- ⚠️ `og:image` e `og:url` devem ser **URLs absolutas com HTTPS** — caminho relativo
  não resolve quando a rede social busca o preview.

## Recomendadas (melhoram o card)

```html
<meta property="og:description" content="Resumo de até ~160 caracteres." />
<meta property="og:site_name" content="Nome do Site" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="628" />
<meta property="og:image:alt" content="Descrição da imagem" />
```

- **Imagem:** ideal **1200×628px** (proporção ~1.91:1), até ~300KB, HTTPS. Informar
  `width`/`height` evita que o card pisque enquanto a rede mede a imagem.

## Tipos (`og:type`)

| Valor     | Quando usar                           |
| :-------- | :------------------------------------ |
| `website` | Páginas genéricas (home, landing).    |
| `article` | Posts e notícias (aceita `article:`). |
| `book`    | Livros.                               |
| `profile` | Perfil de pessoa.                     |

> Tipos com prefixo (`article:published_time`, `og:video`) destravam campos extras —
> lista completa em [OGP Types](https://ogp.me/#types).

## Twitter Cards: o complemento

O X/Twitter lê suas próprias tags `twitter:`, mas **cai no Open Graph** quando elas
faltam. O mínimo é declarar o formato do card:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Título do conteúdo" />
<meta name="twitter:image" content="https://site.com/thumb.jpg" />
```

- ⚠️ Aqui volta a ser `name=` (não `property=`).

## Como validar

- **Sharing Debugger** (Facebook) — força recache e mostra como o card será renderizado.
- **Post Inspector** (LinkedIn) — equivalente para o LinkedIn.
- ⚠️ As redes **cacheiam** o preview; depois de mudar uma tag, rode o debugger para
  invalidar o cache antigo.

---

Relacionadas: [[seo-on-page|SEO on-page]] · [[html-starter-template|modelo inicial de HTML]].
