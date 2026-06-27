# 🪴 Guia de Escrita — Codex Gigas

Padrão único de redação para **todas as notas** do jardim, escritas por humanos
ou por IAs. O objetivo é manter o nível: notas **atômicas**, **completas** e
**altamente referenciáveis**.

> Esqueleto pronto para copiar: [`templates/nota.md`](templates/nota.md).
> Aplicação assistida: skill [`escrever-nota`](.claude/skills/escrever-nota/SKILL.md).

---

## 🎯 Os três princípios

| Princípio         | Significa                                                                                            | Teste rápido                                          |
| :---------------- | :--------------------------------------------------------------------------------------------------- | :---------------------------------------------------- |
| **Atômica**       | Uma ideia central por nota. Se o título precisa de "e", provavelmente são duas notas.                | Consigo resumir a nota em uma frase?                  |
| **Completa**      | Auto-contida: dá pra entender sem abrir outra aba. Conceito → como funciona → quando usar → exemplo. | Um colega entende sem perguntar nada?                 |
| **Referenciável** | Conecta-se ao resto do jardim por `[[wikilinks]]` densos e bidirecionais.                            | A nota tem entrada (contexto) e saída (relacionadas)? |

---

## 📐 Anatomia da nota (nível aprofundado)

A ordem abaixo é o padrão. Seções marcadas _(opcional)_ entram conforme o tema.

### 1. Front matter (obrigatório)

```markdown
---
title: "Título Claro e Específico"
layout: base.njk
category: Frontend
tags: [react, performance, interview]
---
```

- **`title`** — entre aspas quando tiver `:`, `(` ou acento no início. Específico,
  não genérico ("Code-Splitting em React (reduzir bundle inicial)" > "React").
- **`layout`** — sempre `base.njk`.
- **`category`** — **exatamente uma** do vocabulário controlado (ver abaixo). Define
  o agrupamento na sidebar via `CATEGORY_ORDER` em [`.eleventy.js`](.eleventy.js).
- **`tags`** — 3 a 6 tags em `kebab-case`, reaproveitando as existentes (ver
  vocabulário). Tag nova só quando nenhuma serve.

### 2. Contexto / lead (obrigatório)

1–2 frases que situam a nota e **já linkam** o pai ou o MOC de onde ela nasce.

```markdown
Trilha #2 do [[study-plan-gaps|plano de estudos]]. Técnicas específicas de
otimização de performance em React.
```

### 3. Corpo em seções `##` (obrigatório)

- Quebre por subtema com `##`, subdivida com `###`.
- **Código sempre tipado e executável** em bloco com linguagem (` ```typescript `).
  Prefira exemplos mínimos que rodam a pseudocódigo.
- Comente o código no idioma da nota (PT-BR) explicando o "porquê", não o óbvio.
- Bullets densos > parágrafos longos. Negrito no termo-chave de cada bullet.
- Marque trade-offs e armadilhas com `⚠️`.

### 4. Tabela de referência rápida _(opcional)_

Para comparar opções, mapear pergunta→conceito ou resumir um checklist.

### 5. Checklist / Perguntas de entrevista _(opcional, recomendado em notas-trilha)_

Reforça memória ativa. Pode ser tabela `Pergunta | Conceito` ou lista de perguntas.

### 6. Desafio prático _(opcional)_

Um exercício curto que força aplicar tudo da nota.

### 7. Referências e ferramentas _(opcional, recomendado)_

Libs, specs e links externos relevantes — em lista, com 1 linha de "para quê serve".

### 8. Rodapé "Relacionadas" (obrigatório)

Fecha a nota costurando-a ao jardim. **Sempre** ao menos 1 wikilink de saída.

```markdown
---

Relacionadas: [[advanced-react]] · [[react-code-splitting]] ·
[[study-plan-gaps|plano de estudos]].
```

---

## 🔗 Wikilinks e referenciabilidade

- Sintaxe: `[[slug]]` ou `[[slug|texto exibido]]`. O alvo é o **nome do arquivo**
  sem `.md` (vira slug); `[[Python Decorators]]` e `[[python-decorators]]` resolvem
  para o mesmo destino.
- **Densidade-alvo:** ao menos 2–3 links de saída por nota. Backlinks são calculados
  no build — quanto mais você linka, mais conectado o grafo fica para todos.
- Linke **na primeira menção** de um conceito que tem (ou deveria ter) nota própria.
- Se você cita algo que merece nota e ainda não existe, **crie o wikilink mesmo
  assim** — ele marca a lacuna (link quebrado intencional = backlog de notas).

---

## 🌐 Bilíngue (PT-BR + EN)

O jardim é bilíngue, com seletor de idioma no topo direito. Cada nota é um par de
arquivos que compartilham o **mesmo slug conceitual**:

| Idioma          | Arquivo                  | URL                 |
| :-------------- | :----------------------- | :------------------ |
| PT-BR (default) | `src/notas/<slug>.md`    | `/notas/<slug>/`    |
| Inglês          | `src/notas/<slug>.en.md` | `/en/notas/<slug>/` |

- **Notas novas nascem nas duas línguas.** Escreva o par `<slug>.md` + `<slug>.en.md`.
  Mesmo `category`/`tags`; só o texto muda. Termos técnicos ficam em inglês nos dois.
- **Wikilinks são idioma-neutros:** escreva `[[slug]]` normalmente. Numa página EN
  eles resolvem para `/en/notas/...` **se houver contraparte EN**; senão caem no PT
  (fallback por link). Os backlinks vivem em grafos paralelos por idioma.
- **Seletor de idioma:** aponta para a contraparte; se ela não existe ainda, cai na
  **home do outro idioma** (sem 404). Por isso, ao traduzir, mantenha o slug idêntico.
- A versão default (PT) fica na raiz; nunca quebre essas URLs ao renomear.

---

## 🗂️ Vocabulário controlado

### Categorias (escolha exatamente uma)

`Plano de Estudos` · `Frontend` · `Backend` · `DevOps` · `Snippets` · `Outros`

> A ordem na sidebar é fixada em `CATEGORY_ORDER`. Categoria fora da lista cai em
> "Outros" e ordena alfabeticamente — evite criar novas sem necessidade.

### Tags consolidadas (reuse antes de inventar)

`interview` · `study-plan` · `moc` · `react` · `frontend` · `backend` ·
`performance` · `nodejs` · `typescript` · `testing` · `patterns` · `carreira` ·
`python` · `architecture` · `ci-cd` · `devops`

> `moc` = _Map of Content_ (nota-índice que organiza outras). `study-plan` para
> notas-trilha. `interview` para conteúdo de preparação.

---

## ⚖️ Exceções ao padrão

Nem toda nota segue a anatomia aprofundada. Dois tipos têm regras próprias:

- **Snippets** (`category: Snippets`) — folhas curtas e diretas (um comando, um
  conceito de 5 linhas). Podem ter **menos de 3 tags**, **dispensam o rodapé
  "Relacionadas"** e não precisam de lead com link. Ainda assim, linke quando há
  conexão natural (ex.: [[closures]] ↔ [[python-decorators]]).
- **MOCs** (_Map of Content_, `tags: [moc]`) — notas-índice cujo **corpo inteiro
  já é uma lista de wikilinks**. Dispensam o rodapé "Relacionadas" (seria
  redundante); o lead descreve o escopo do índice.

Fora esses dois casos, vale a anatomia completa e o checklist abaixo.

---

## ✅ Checklist antes de salvar

- [ ] Título específico e front matter completo (category válida, 3–6 tags reusadas).
- [ ] Uma ideia central — atômica.
- [ ] Lead com contexto e link para o pai/MOC.
- [ ] Auto-contida: conceito → como funciona → quando usar → exemplo.
- [ ] Código tipado, executável, com linguagem no bloco.
- [ ] ≥ 2 wikilinks de saída + rodapé "Relacionadas".
- [ ] Trade-offs/armadilhas sinalizados.
- [ ] `npm run format` aplicado.

---

## 🎨 Tom e estilo

- **Idioma:** PT-BR no texto; termos técnicos em inglês quando é o uso real
  ("re-render", "bundle"), com a tradução entre parênteses na primeira vez.
- **Voz:** direta e técnica. Explique o _porquê_ e o _quando_, não só o _o quê_.
- **Emojis:** opcionais como âncora visual em headers de seção (`## 🧱 ...`). Use com
  parcimônia e consistência dentro da nota — ou em todos os `##`, ou em nenhum.
- **Densidade:** prefira escanabilidade — headers, bullets, tabelas, negrito no
  termo-chave. O leitor deve achar a resposta em segundos.
