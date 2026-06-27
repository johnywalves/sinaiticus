---
name: escrever-nota
description: Cria ou revisa notas do jardim digital Codex Gigas seguindo o padrão de escrita (atômica, completa, referenciável). Use ao adicionar uma nota em src/notas/, ao revisar o nível/estilo de uma nota existente, ou quando o usuário pedir para escrever/padronizar conteúdo deste Zettelkasten.
---

# Escrever nota — padrão Codex Gigas

Você está num jardim digital (Eleventy + wikilinks + backlinks). Toda nota deve ser
**atômica** (uma ideia), **completa** (auto-contida) e **referenciável** (linkada).
A fonte da verdade é [`GUIA-DE-ESCRITA.md`](../../../GUIA-DE-ESCRITA.md); este arquivo
é o procedimento operacional.

## Quando usar

- Criar uma nota nova em `src/notas/<slug>.md`.
- Revisar/elevar o nível de uma nota existente.
- Padronizar front matter, wikilinks ou estrutura.

## Procedimento

1. **Levante o contexto antes de escrever.** Leia `GUIA-DE-ESCRITA.md` e 1–2 notas
   da mesma `category` para casar o tom. Liste `src/notas/` para descobrir alvos de
   wikilink existentes (não invente slugs — confira o nome do arquivo).

2. **Defina o escopo atômico.** Uma ideia central. Se o título pede "e", divida em
   duas notas e linke uma na outra.

3. **Front matter** (vocabulário controlado):
   - `title`: específico, entre aspas se tiver `:` `(` ou acento inicial.
   - `layout: base.njk` sempre.
   - `category`: exatamente uma de `Plano de Estudos | Frontend | Backend | DevOps | Snippets | Outros`.
   - `tags`: 3–6 em kebab-case, **reusando** as tags consolidadas do guia antes de criar nova.

4. **Estrutura (nível aprofundado):** lead com contexto + link ao pai/MOC → seções
   `##`/`###` com código tipado e executável → tabela/checklist/desafio quando o tema
   pedir → referências → **rodapé "Relacionadas" com ≥ 2 wikilinks de saída**.
   Use [`templates/nota.md`](../../../templates/nota.md) como esqueleto.

5. **Referenciabilidade:** linke na primeira menção de cada conceito que tem (ou
   deveria ter) nota própria. Wikilink para nota inexistente é aceitável — marca uma
   lacuna no backlog. Mire ≥ 2–3 links de saída.

6. **Bilíngue (PT-BR + EN).** O jardim tem seletor de idioma. Toda nota nova nasce em
   par: `src/notas/<slug>.md` (PT) **e** `src/notas/<slug>.en.md` (EN), mesmo slug,
   mesma `category`/`tags`. Wikilinks são idioma-neutros (`[[slug]]`); numa página EN
   resolvem para `/en/notas/...` quando há contraparte, senão caem no PT. Ao traduzir
   uma nota existente, mantenha o slug idêntico para o seletor casar. Detalhes na seção
   "Bilíngue" do guia.

7. **Feche pela qualidade.** Rode o checklist do guia. Depois `npm run format`.
   Não edite `src/_data/backlinks.json` nem `src/searchIndex.json` — são gerados.

## Anti-padrões a evitar

- Nota-balaio com vários assuntos (quebra atomicidade).
- Parágrafos longos onde bullets/tabela seriam mais escaneáveis.
- Código sem linguagem no bloco, ou pseudocódigo quando um exemplo real cabe.
- Nota sem nenhum wikilink de saída (fica órfã no grafo).
- Inventar `category`/slug; criar tag nova com uma existente servindo.

## Saída esperada

Um `.md` em `src/notas/` válido contra o checklist do guia, formatado, com lead
contextualizado e rodapé de relacionadas conectando-o ao restante do jardim.
