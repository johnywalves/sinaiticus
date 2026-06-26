---
title: "Frontend Testing Practices"
layout: base.njk
category: Frontend
tags: [testing, react, study-plan, interview]
---

Trilha #3 do [[study-plan-gaps|plano de estudos]]. Estratégia e práticas de
teste no frontend.

## Estratégia (a "testing trophy")
- **Static** (TypeScript, ESLint) → **Unit** → **Integration** (o maior retorno)
  → **E2E**.
- Priorize testes de **integração** que exercitam componentes como o usuário usa.
- Métrica não é cobertura por si só — é **confiança**.

## React Testing Library (filosofia)
- Teste **comportamento**, não implementação. Evite checar estado interno ou se
  "função X foi chamada".
- **Prioridade de queries:** `getByRole` > `getByLabelText` > `getByText` >
  (último caso) `getByTestId`.
- `getBy*` (existe), `queryBy*` (pode não existir), `findBy*` (assíncrono).
- **`user-event`** em vez de `fireEvent` — simula interação real.

## Assíncrono e mocks
- **MSW (Mock Service Worker)** para interceptar rede no nível de request —
  ver caso prático em [[testing-react-data-fetching]].
- `findBy*` / `waitFor` para esperar UI assíncrona; evite `waitFor` com asserções
  múltiplas.
- Cuidado com **snapshot tests** grandes (frágeis, viram ruído).

## Ferramentas
- **Vitest** (rápido, ESM-first) ou **Jest**.
- **Playwright** / **Cypress** para E2E e component testing.
- **Testing Library** + **jest-axe** para acessibilidade.
- CI: rodar testes + cobertura como gate — ver [[azure-devops-cicd-pipeline]].

## Boas práticas
- Arrange–Act–Assert; um conceito por teste.
- Testes determinísticos (sem depender de relógio/rede real — fake timers, MSW).
- Test data builders / factories para reduzir boilerplate.

## Perguntas de entrevista (treinar)
- Por que evitar testar detalhes de implementação?
- Como testar um componente que faz fetch (loading/success/error)?
- `getBy` vs `queryBy` vs `findBy`?
- Onde colocar a fronteira entre unit, integração e E2E?

---
Relacionadas: [[testing-react-data-fetching]] · [[study-plan-gaps|plano de estudos]].
