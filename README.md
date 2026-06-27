# 🪴 Codex Gigas

Um **jardim digital** (digital garden / Zettelkasten) feito de arquivos
Markdown interligados, gerado como site estático e hospedado no GitHub Pages.

- **Eleventy (11ty)** gera o site a partir dos `.md` em `src/notas/`.
- Um **plugin markdown-it** converte `[[wikilinks]]` em links HTML internos.
- **Backlinks** (links bidirecionais) são calculados em tempo de build e
  exibidos no rodapé de cada nota.
- **Lunr.js** consome um JSON de índice e oferece **busca full-text offline**
  no lado do cliente.

## Estrutura

```
├── src/
│   ├── index.md              # página inicial (lista as notas)
│   ├── search.md             # página de busca (Lunr.js)
│   ├── notas/                # suas notas .md
│   ├── assets/style.css      # estilos
│   └── _includes/base.njk    # template base
├── lib/wikilinks.js          # utilitários de [[wikilink]] (compartilhado)
├── build-index.js            # gera backlinks.json e searchIndex.json
├── .eleventy.js              # config do 11ty + plugin de wikilinks
└── .github/workflows/deploy.yml
```

> `src/_data/backlinks.json` e `src/searchIndex.json` são **gerados** pelo
> `build-index.js` e ficam fora do versionamento (`.gitignore`).

## Uso

```sh
npm install        # instala dependências
npm run dev        # gera índices + servidor local com live reload
npm run build      # build de produção em _site/
npm run format     # prettier
```

Abra <http://localhost:8080> após o `npm run dev`.

## Escrevendo notas

Crie um `.md` em `src/notas/` com front matter:

```markdown
---
title: Minha Nota
layout: base.njk
tags: [exemplo]
---

Texto com um [[outra-nota]] ou [[outra-nota|texto exibido]].
```

O wikilink aponta para o **nome do arquivo** (sem `.md`) convertido em slug.
Ex.: `[[Python Decorators]]` e `[[python-decorators]]` resolvem para
`/notas/python-decorators/`.

Para manter o **nível e o padrão** das notas (front matter, estrutura,
referenciabilidade), siga o [Guia de Escrita](GUIA-DE-ESCRITA.md). Há um
esqueleto pronto em [`templates/nota.md`](templates/nota.md) e a skill
[`escrever-nota`](.claude/skills/escrever-nota/SKILL.md) aplica/revisa o padrão
automaticamente.

## Deploy no GitHub Pages

1. Em **Settings → Pages**, defina **Source: GitHub Actions**.
2. Faça push para `main`. O workflow `deploy.yml` roda `build-index.js`,
   builda o Eleventy com o `pathPrefix` correto (via `EleventyHtmlBasePlugin`)
   e publica `_site/`.

Para um **domínio customizado** ou **user/org page** (servidos na raiz `/`),
nada precisa mudar — o `base_path` será `/` automaticamente.
