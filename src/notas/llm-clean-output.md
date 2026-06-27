---
title: "Chat com LLM — Saída Markdown Limpa"
layout: base.njk
category: Snippets
tags: [llm, prompts, markdown]
---

Por padrão, alguns assistentes inserem **referências numéricas** (como `[1]`,
`[2]`) no corpo do texto para citar fontes. Em arquivos Markdown isso polui a
leitura — a "mecânica" da página deve ser invisível para não tirar o leitor do
fluxo. Dá para anular esse comportamento por arquivo com instruções explícitas.

## Prompts para texto limpo

```text
Gere o conteúdo do Markdown sem incluir as referências numéricas entre colchetes.
```

```text
Mantenha o texto do arquivo limpo, sem citações de fonte no corpo do documento.
```

## Proteger blocos de código aninhados

Ao pedir um arquivo Markdown que contém blocos de código, peça para **envolver o
Markdown inteiro em quatro crases** — assim os blocos internos (três crases) não
quebram a renderização:

```text
Envolva todo o Markdown em quatro crases para proteger os blocos de código internos.
```

⚠️ A instrução de "sem referências" vale só para o **conteúdo do arquivo**; numa
resposta de chat normal, as citações continuam úteis para precisão e transparência.
