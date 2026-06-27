---
title: "React Performance Optimization"
layout: base.njk
category: Frontend
tags: [react, performance, study-plan, interview]
---

Track #2 of the [[study-plan-gaps|study plan]]. React-specific performance
optimization techniques.

## Re-render model (the foundation)

- A component re-renders when: **state changes**, **props change (by
  reference)**, or the **parent re-renders**.
- Re-render ≠ DOM re-paint. The cost is in large trees/lists.
- Referential identity matters: new objects/arrays/functions on every render
  break memoization of children.

## Memoization tools (and when NOT to use them)

- **`React.memo`** — skips a child's re-render if its (shallow) props didn't change.
- **`useMemo`** — memoizes expensive values / references passed to memoized children.
- **`useCallback`** — memoizes functions passed as props.
- ⚠️ Don't memoize everything: it has cost and complexity. Measure first. The
  **React Compiler** (React 19) automates much of this.

## Lists and rendering

- **Stable `key`** (never the index in mutable lists).
- **Virtualization** for long lists: `react-window`, `react-virtuoso`,
  TanStack Virtual.
- **Code-splitting / lazy** to defer JS — see [[react-code-splitting]].

## Concurrency (React 18+)

- **`useTransition`** — marks updates as non-urgent (keeps the UI responsive).
- **`useDeferredValue`** — defers an expensive derived value (e.g. a list filter).
- **`Suspense`** — declarative loading states and SSR streaming.

## Context and state

- Split contexts by change frequency; memoize the `value`.
- Selectors (`use-context-selector`, Zustand/Redux with selectors) to subscribe
  to only the needed slice.

## Measurement (always before optimizing)

- **React DevTools Profiler** — flamegraph, "why did this render".
- `<Profiler>` API, `performance.mark`, Web Vitals (LCP, INP, CLS).
- Lighthouse and bundle analyzer for the loading side.

## Interview questions (practice)

- What causes a re-render? How do you diagnose excessive re-renders?
- `useMemo` vs `useCallback` vs `memo`?
- How would you optimize a list of 10k items?
- What are `useTransition`/`useDeferredValue` for?

---

Related: [[advanced-react]] · [[react-code-splitting]] ·
[[study-plan-gaps|study plan]].
