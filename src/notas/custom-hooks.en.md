---
title: "Custom Hooks in React (extract reusable stateful logic)"
layout: base.njk
category: Frontend
tags: [react, hooks, frontend, patterns]
---

A technique to reuse **stateful logic** across components without repeating code. Part of
[[advanced-react|advanced React]]: the built-in hooks aren't the limit — you write your own.

## What it is

- A function whose name **starts with `use`** and that calls other hooks inside.
- It extracts logic (state, effect, context) for reuse. Unlike a component, it **returns
  no JSX** — it returns data and/or functions.
- ⚠️ It doesn't share state: each component using the hook gets its **own** isolated
  state instance.

## The rules of hooks (they apply to yours too)

- Only call hooks at the **top level** of a component/hook — never inside `if`, a loop,
  or a callback.
- Only call them inside **React components** or **other hooks**.
- ⚠️ `eslint-plugin-react-hooks` enforces these rules and the dependency array.

## The "callback in a ref" pattern (used across this collection)

The hooks below keep the callback in a `useRef` and update it in a separate effect. Why?
So the effect that registers the listener/timer runs **once** (stable deps) without
capturing a **stale** version of the callback.

```ts
const savedCallback = useRef(callback);

// Always keeps the latest reference, without re-attaching the listener.
useEffect(() => {
  savedCallback.current = callback;
}, [callback]);

// Inside, call savedCallback.current() instead of callback.
```

Without it, either the effect recreates the listener every render, or it fires the old closure.

## When to build a custom hook

- The same state/effect logic shows up in **2+ components**.
- A component grew and its **non-visual** logic can move into a named hook.
- ⚠️ Don't make a hook just to group code: if it uses no state/effect/context, it's a
  plain **pure function**.

## The collection

- [[use-listener]] — listen to `window` events with debounce.
- [[use-interval]] — run a function on an interval, declaratively.
- [[use-debounce]] — delay a reactive value (e.g. search-as-you-type).
- [[use-throttle]] — cap how often a value updates.
- [[use-on-click-outside]] — detect a click outside an element.
- [[use-local-storage]] — state persisted in `localStorage`.
- [[use-media-query]] — react to breakpoints and `prefers-color-scheme`.

---

Related: [[advanced-react|advanced React]] · [[react-performance|React performance]].
