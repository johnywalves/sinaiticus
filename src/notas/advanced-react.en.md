---
title: "Advanced React"
layout: base.njk
category: Frontend
tags: [react, typescript, patterns, study-plan, interview]
---

Track #1 of the [[study-plan-gaps|study plan]]. Mastery of React composition
patterns and advanced TypeScript typing.

## React — composition patterns

- **Custom hooks** — extract stateful/effectful logic; rules of hooks; returning
  tuples vs objects; composed hooks.
- **[[compound-components|Compound components]]** — `<Select><Select.Option/></Select>`
  via `Context` to share implicit state between children.
- **Controlled vs uncontrolled** — when to expose `value`/`onChange` vs
  `defaultValue`; hybrid pattern with `useControllableState`.
- **Render props / children as function** — inversion of rendering control.
- **`forwardRef` + `useImperativeHandle`** — expose a controlled imperative API.
- **Context performance** — split contexts, memoize `value`, selector pattern
  (or `use-context-selector`) to avoid re-rendering the whole tree.
- **Polymorphic components** — `as` prop with correct types.

```tsx
// Compound component with Context
const TabsCtx = createContext<{ active: string; set: (id: string) => void } | null>(
  null,
);

function Tabs({ defaultId, children }: { defaultId: string; children: ReactNode }) {
  const [active, set] = useState(defaultId);
  const value = useMemo(() => ({ active, set }), [active]);
  return <TabsCtx.Provider value={value}>{children}</TabsCtx.Provider>;
}
function Tab({ id, children }: { id: string; children: ReactNode }) {
  const ctx = useContext(TabsCtx)!;
  return (
    <button aria-selected={ctx.active === id} onClick={() => ctx.set(id)}>
      {children}
    </button>
  );
}
Tabs.Tab = Tab;
```

## Interview questions (practice)

- How do you avoid unnecessary re-renders caused by Context?
- Difference between `useMemo`, `useCallback` and `memo` — when each?

---

Related: [[react-performance]] · [[study-plan-gaps|study plan]].
