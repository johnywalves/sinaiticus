---
title: "Advanced React & TypeScript Patterns"
layout: base.njk
category: Frontend
tags: [react, typescript, patterns, study-plan, interview]
---

Trilha #1 do [[study-plan-gaps|plano de estudos]]. Domínio de padrões de
composição em React e de tipagem avançada em TypeScript.

## React — padrões de composição
- **Custom hooks** — extrair lógica com estado/efeitos; regras dos hooks;
  retornar tuplas vs objetos; hooks compostos.
- **Compound components** — `<Select><Select.Option/></Select>` via `Context`
  para compartilhar estado implícito entre filhos.
- **Controlled vs uncontrolled** — quando expor `value`/`onChange` vs
  `defaultValue`; padrão híbrido com `useControllableState`.
- **Render props / children as function** — inversão de controle de renderização.
- **`forwardRef` + `useImperativeHandle`** — expor API imperativa controlada.
- **Context performance** — dividir contextos, memoizar `value`, selector
  pattern (ou `use-context-selector`) para evitar re-render de toda a árvore.
- **Polymorphic components** — prop `as` com tipos corretos.

```tsx
// Compound component com Context
const TabsCtx = createContext<{ active: string; set: (id: string) => void } | null>(null);

function Tabs({ defaultId, children }: { defaultId: string; children: ReactNode }) {
  const [active, set] = useState(defaultId);
  const value = useMemo(() => ({ active, set }), [active]);
  return <TabsCtx.Provider value={value}>{children}</TabsCtx.Provider>;
}
function Tab({ id, children }: { id: string; children: ReactNode }) {
  const ctx = useContext(TabsCtx)!;
  return <button aria-selected={ctx.active === id} onClick={() => ctx.set(id)}>{children}</button>;
}
Tabs.Tab = Tab;
```

## TypeScript — tipagem avançada
- **Generics em componentes** — `function List<T>(props: { items: T[]; render: (t: T) => ReactNode })`.
- **Discriminated unions** para props mutuamente exclusivas (ex.: `variant`).
- **Utility types** — `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`,
  `Parameters`, `Awaited`.
- **`as const`** e literais; `satisfies` para validar sem alargar o tipo.
- **Conditional & mapped types**, `infer`, template literal types.
- **Tipar hooks** — sobrecargas de `useState`, tipar reducers com unions de ações.
- **Component polimórfico tipado** com `ElementType` e `ComponentPropsWithoutRef`.

```ts
type ButtonProps =
  | { variant: "link"; href: string }
  | { variant: "button"; onClick: () => void };
// o TS força href OU onClick conforme variant (discriminated union)
```

## Perguntas de entrevista (treinar)
- Como evitar re-renders desnecessários causados por Context?
- Diferença entre `useMemo`, `useCallback` e `memo` — quando cada um?
- Como tiparia um componente genérico de tabela/lista reutilizável?
- O que é inversão de controle e como render props ajudam?

---
Relacionadas: [[react-performance]] · [[study-plan-gaps|plano de estudos]].
