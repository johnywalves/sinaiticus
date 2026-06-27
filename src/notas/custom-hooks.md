---
title: "Custom Hooks em React (extrair lógica com estado reutilizável)"
layout: base.njk
category: Frontend
tags: [react, hooks, frontend, patterns]
---

Técnica para reusar **lógica com estado** entre componentes sem repetir código. Parte do
[[advanced-react|React avançado]]: hooks nativos não são o limite — você cria os seus.

## O que é

- Uma função cujo nome **começa com `use`** e que chama outros hooks por dentro.
- Extrai lógica (estado, efeito, contexto) para reusar. Diferente de um componente, **não
  retorna JSX** — retorna dados e/ou funções.
- ⚠️ Não compartilha estado: cada componente que usa o hook tem sua **própria** instância
  isolada de estado.

## As regras dos hooks (valem para os seus também)

- Só chame hooks no **topo** do componente/hook — nunca dentro de `if`, loop ou callback.
- Só chame dentro de **componentes React** ou de **outros hooks**.
- ⚠️ O `eslint-plugin-react-hooks` cobre essas regras e o array de dependências.

## O padrão "callback em ref" (usado nesta coleção)

Os hooks abaixo guardam o callback num `useRef` e o atualizam num efeito separado. Por
quê? Para o efeito que registra o listener/timer rodar **uma única vez** (dependências
estáveis) sem capturar uma versão **velha** (stale) do callback.

```ts
const savedCallback = useRef(callback);

// Mantém sempre a referência mais recente, sem reanexar o listener.
useEffect(() => {
  savedCallback.current = callback;
}, [callback]);

// Lá dentro, chame savedCallback.current() em vez de callback.
```

Sem isso, ou o efeito recria o listener a cada render, ou ele dispara a closure antiga.

## Quando criar um custom hook

- A mesma lógica de estado/efeito aparece em **2+ componentes**.
- Um componente cresceu e dá para mover a lógica **não-visual** para um hook nomeado.
- ⚠️ Não crie hook só para agrupar código: se não usa estado/efeito/contexto, é uma
  **função pura** comum.

## A coleção

- [[use-listener]] — ouvir eventos da `window` com debounce.
- [[use-interval]] — rodar uma função em intervalos, de forma declarativa.
- [[use-debounce]] — atrasar um valor reativo (ex.: busca enquanto digita).
- [[use-throttle]] — limitar a frequência de atualização de um valor.
- [[use-on-click-outside]] — detectar clique fora de um elemento.
- [[use-local-storage]] — estado persistido no `localStorage`.
- [[use-media-query]] — reagir a breakpoints e `prefers-color-scheme`.

---

Relacionadas: [[advanced-react|React avançado]] · [[react-performance|performance em React]].
