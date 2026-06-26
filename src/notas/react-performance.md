---
title: "React Performance Optimization"
layout: base.njk
category: Frontend
tags: [react, performance, study-plan, interview]
---

Trilha #2 do [[study-plan-gaps|plano de estudos]]. Técnicas específicas de
otimização de performance em React.

## Modelo de re-render (a base)
- Um componente re-renderiza quando: **state muda**, **props mudam (por
  referência)**, ou o **pai re-renderiza**.
- Re-render ≠ re-paint do DOM. O custo está em árvores grandes/listas.
- Identidade referencial importa: objetos/arrays/funções novas a cada render
  quebram memoização dos filhos.

## Ferramentas de memoização (e quando NÃO usar)
- **`React.memo`** — evita re-render de um filho se as props (shallow) não mudaram.
- **`useMemo`** — memoiza valores caros / referências passadas a filhos memoizados.
- **`useCallback`** — memoiza funções passadas como props.
- ⚠️ Não memoize tudo: tem custo e complexidade. Meça antes. O **React Compiler**
  (React 19) automatiza boa parte disso.

## Listas e renderização
- **`key` estável** (nunca índice em listas mutáveis).
- **Virtualização** para listas longas: `react-window`, `react-virtuoso`,
  TanStack Virtual.
- **Code-splitting / lazy** para adiar JS — ver [[react-code-splitting]].

## Concorrência (React 18+)
- **`useTransition`** — marca updates como não-urgentes (mantém UI responsiva).
- **`useDeferredValue`** — adia valor derivado caro (ex.: filtro de lista).
- **`Suspense`** — estados de carregamento declarativos e streaming SSR.

## Context e estado
- Dividir contextos por frequência de mudança; memoizar `value`.
- Selectors (`use-context-selector`, Zustand/Redux com selectors) para assinar
  só a fatia necessária.

## Medição (sempre antes de otimizar)
- **React DevTools Profiler** — flamegraph, "why did this render".
- `<Profiler>` API, `performance.mark`, Web Vitals (LCP, INP, CLS).
- Lighthouse e bundle analyzer para o lado de carregamento.

## Perguntas de entrevista (treinar)
- O que causa um re-render? Como diagnosticar re-renders excessivos?
- `useMemo` vs `useCallback` vs `memo`?
- Como otimizar uma lista de 10k itens?
- Para que serve `useTransition`/`useDeferredValue`?

---
Relacionadas: [[advanced-react-patterns]] · [[react-code-splitting]] ·
[[study-plan-gaps|plano de estudos]].
