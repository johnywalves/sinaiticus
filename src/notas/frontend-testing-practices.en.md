---
title: "Frontend Testing Practices"
layout: base.njk
category: Frontend
tags: [testing, react, study-plan, interview]
---

Track #3 of the [[study-plan-gaps|study plan]]. Strategy and practices for
frontend testing.

## Strategy (the "testing trophy")

- **Static** (TypeScript, ESLint) → **Unit** → **Integration** (the best return)
  → **E2E**.
- Prioritize **integration** tests that exercise components the way users do.
- The metric isn't coverage by itself — it's **confidence**.

## React Testing Library (philosophy)

- Test **behavior**, not implementation. Avoid checking internal state or whether
  "function X was called".
- **Query priority:** `getByRole` > `getByLabelText` > `getByText` >
  (last resort) `getByTestId`.
- `getBy*` (exists), `queryBy*` (may not exist), `findBy*` (async).
- **`user-event`** instead of `fireEvent` — simulates real interaction.

## Async and mocks

- **MSW (Mock Service Worker)** to intercept the network at the request level —
  see a practical case in [[testing-react-data-fetching]].
- `findBy*` / `waitFor` to await async UI; avoid `waitFor` with multiple
  assertions.
- Beware of large **snapshot tests** (brittle, turn into noise).

## Tools

- **Vitest** (fast, ESM-first) or **Jest**.
- **Playwright** / **Cypress** for E2E and component testing.
- **Testing Library** + **jest-axe** for accessibility.
- CI: run tests + coverage as a gate — see [[azure-devops-cicd-pipeline]].

## Best practices

- Arrange–Act–Assert; one concept per test.
- Deterministic tests (no reliance on real clock/network — fake timers, MSW).
- Test data builders / factories to reduce boilerplate.

## Interview questions (practice)

- Why avoid testing implementation details?
- How do you test a component that fetches (loading/success/error)?
- `getBy` vs `queryBy` vs `findBy`?
- Where do you draw the line between unit, integration and E2E?

---

Related: [[testing-react-data-fetching]] · [[study-plan-gaps|study plan]].
