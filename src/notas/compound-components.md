---
title: "Compound Components"
layout: base.njk
category: Frontend
tags: [react, patterns, frontend, interview]
---

Padrão de composição em React detalhado a partir de [[advanced-react]]. Um
**compound component** expõe um componente-pai e subcomponentes que compartilham
estado **implícito** via `Context`, em vez de receberem dezenas de props.

## O problema que resolve

Uma API "monolítica" com muitas props (`<Select options labelKey valueKey
renderOption ... />`) é rígida e difícil de estender. O compound component
inverte isso: o pai detém o estado, os filhos se conectam a ele.

```tsx
<Tabs defaultId="a">
  <Tabs.Tab id="a">Primeira</Tabs.Tab>
  <Tabs.Tab id="b">Segunda</Tabs.Tab>
</Tabs>
```

## Como funciona

1. O pai cria um `Context` e guarda o estado compartilhado (memoizando o `value`).
2. Os subcomponentes leem esse `Context` via hook interno.
3. Os filhos são anexados como propriedades estáticas do pai (`Tabs.Tab = Tab`).

```tsx
const TabsCtx = createContext<{ active: string; set: (id: string) => void } | null>(
  null,
);

function useTabs() {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("Tabs.Tab deve estar dentro de <Tabs>");
  return ctx;
}

function Tabs({ defaultId, children }: { defaultId: string; children: ReactNode }) {
  const [active, set] = useState(defaultId);
  const value = useMemo(() => ({ active, set }), [active]); // identidade estável
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

## Quando usar (e quando não)

- ✅ Boa escolha para componentes com **partes coordenadas**: `Select`, `Tabs`,
  `Accordion`, `Menu`, formulários compostos.
- ⚠️ O hook interno deve **lançar** se usado fora do pai — falha cedo e clara.
- ⚠️ Para passar dados a fundo sem hierarquia fixa, um simples `Context` pode
  bastar; nem tudo precisa de subcomponentes.

## Perguntas de entrevista (treinar)

- Por que memoizar o `value` do `Context` no pai?
- Como tipar `Tabs.Tab` mantendo o autocomplete do consumidor?
- Compound components vs render props — quando cada um?

---

Relacionadas: [[advanced-react]] · [[react-performance|performance e Context]].
