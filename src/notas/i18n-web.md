---
title: "i18n na web (hreflang, estratégia de URL, locale)"
layout: base.njk
category: Frontend
tags: [i18n, seo, web, frontend]
---

Como servir o mesmo site em vários idiomas sem confundir usuário nem buscador. Fecha a
lacuna apontada no [[html-starter-template|modelo inicial de HTML]] e no
[[seo-on-page|SEO on-page]]: cada idioma é uma URL, ligada às outras por `hreflang`.

## Estratégia de URL: uma por idioma

Cada versão precisa de um endereço **próprio e indexável** (nunca troque o idioma só no
cliente, via JS — o crawler não vê).

| Padrão     | Exemplo              | Trade-off                                |
| :--------- | :------------------- | :--------------------------------------- |
| Subpasta   | `site.com/en/pagina` | Simples, herda autoridade do domínio. ✅ |
| Subdomínio | `en.site.com/pagina` | Separa infra; autoridade mais diluída.   |
| ccTLD      | `site.de/seite`      | Sinal geográfico forte; caro de manter.  |

> Este jardim usa **subpasta**: PT na raiz (`/notas/...`), EN em `/en/notas/...`.

## `hreflang`: ligar as versões

No `<head>` de **cada** página, declare todas as variantes — inclusive ela mesma — e a
`x-default` (fallback para idiomas não cobertos):

```html
<link rel="alternate" hreflang="pt-br" href="https://site.com/pagina" />
<link rel="alternate" hreflang="en" href="https://site.com/en/page" />
<link rel="alternate" hreflang="x-default" href="https://site.com/pagina" />
```

- ⚠️ **Bidirecional:** se A aponta para B, B precisa apontar de volta para A. Links
  unilaterais o Google ignora.
- ⚠️ Use o código certo: idioma (`en`) ou idioma-região (`pt-br`, `en-gb`) em
  [BCP 47](https://www.rfc-editor.org/rfc/rfc5646) — não invente `pt_BR` com underscore
  aqui (esse formato é do `og:locale`, não do `hreflang`).

## O atributo `lang` no HTML

Independente de SEO, marque o idioma do conteúdo para leitores de tela, hifenização e
tradução automática:

```html
<html lang="pt-br">
  <!-- trecho em outro idioma -->
  <blockquote lang="en">To be or not to be</blockquote>
</html>
```

## Formatação sensível ao locale

Traduzir texto é só metade — números, datas e moeda mudam por região. Use a API
nativa `Intl` em vez de formatar na mão:

```ts
const preco = 1234.5;
new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(preco);
// "R$ 1.234,50"
new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(preco);
// "$1,234.50"
```

## Checklist

- [ ] Cada idioma tem URL própria e indexável (não troca via JS).
- [ ] `hreflang` em todas as páginas, bidirecional, com `x-default`.
- [ ] `<html lang>` correto em cada versão.
- [ ] `og:locale` coerente com o idioma da página (ver [[open-graph-protocol|Open Graph]]).
- [ ] Datas/números/moeda via `Intl`, não hardcoded.

---

Relacionadas: [[seo-on-page|SEO on-page]] · [[open-graph-protocol|Open Graph]] ·
[[html-starter-template|modelo inicial de HTML]].
