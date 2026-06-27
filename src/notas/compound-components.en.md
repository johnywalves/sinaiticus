---
title: "Compound Components"
layout: base.njk
category: Frontend
tags: [react, patterns, frontend, interview]
---

A React composition pattern expanded from [[advanced-react]]. A **compound
component** exposes a parent and subcomponents that share **implicit** state via
`Context`, instead of taking dozens of props.

## The problem it solves

A "monolithic" API with many props (`<Select options labelKey valueKey
renderOption ... />`) is rigid and hard to extend. The compound component flips
that: the parent owns the state, the children wire into it.

```tsx
<Tabs defaultId="a">
  <Tabs.Tab id="a">First</Tabs.Tab>
  <Tabs.Tab id="b">Second</Tabs.Tab>
</Tabs>
```

## How it works

1. The parent creates a `Context` and holds the shared state (memoizing `value`).
2. Subcomponents read that `Context` via an internal hook.
3. Children are attached as static properties of the parent (`Tabs.Tab = Tab`).

```tsx
const TabsCtx = createContext<{ active: string; set: (id: string) => void } | null>(
  null,
);

function useTabs() {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("Tabs.Tab must be used inside <Tabs>");
  return ctx;
}

function Tabs({ defaultId, children }: { defaultId: string; children: ReactNode }) {
  const [active, set] = useState(defaultId);
  const value = useMemo(() => ({ active, set }), [active]); // stable identity
  return <TabsCtx.Provider value={value}>{children}</TabsCtx.Provider>;
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { active, set } = useTabs();
  return (
    <button aria-selected={active === id} onClick={() => set(id)}>
      {children}
    </button>
  );
}
Tabs.Tab = Tab;
```

## When to use (and when not)

- ✅ Great for components with **coordinated parts**: `Select`, `Tabs`,
  `Accordion`, `Menu`, composed forms.
- ⚠️ The internal hook should **throw** when used outside the parent — fail early
  and clearly.
- ⚠️ To pass data deep without a fixed hierarchy, a plain `Context` may be enough;
  not everything needs subcomponents.

## Interview questions (practice)

- Why memoize the `Context` `value` in the parent?
- How do you type `Tabs.Tab` while keeping consumer autocomplete?
- Compound components vs render props — when each?

---

Related: [[advanced-react]] · [[react-performance|performance and Context]].
