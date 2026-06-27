---
title: "Comunicação entre Micro-frontends"
layout: base.njk
category: Frontend
tags: [micro-frontends, frontend, architecture, interview]
---

Nota de [[nix-interview-prep|preparação para a N-iX]] — arquitetura de micro-frontends.

Numa arquitetura de micro-frontends, cada MFE é uma aplicação com deploy
independente. Eles precisam se comunicar sem acoplamento forte. Há dois padrões
principais.

## 1. Event Bus (Pub-Sub)

- **Como funciona:** os MFEs publicam e assinam eventos via um event bus global
  (ex.: `window.dispatchEvent` + `addEventListener`, ou uma lib como `mitt` ou
  `EventEmitter`).
- **Quando usar:** comunicação desacoplada, estilo broadcast — ex.: "usuário
  logou", "carrinho atualizado", "tema mudou".
- **Prós:** desacoplado, fácil adicionar novos listeners sem mexer nos emissores.
- **Contras:** mais difícil de depurar (fire and forget), sem type safety por padrão.

```ts
// MFE A – publica um evento
window.dispatchEvent(new CustomEvent("user:logout"));

// MFE B – escuta o evento
window.addEventListener("user:logout", () => {
  // limpar sessão, redirecionar, etc.
});
```

## 2. Estado compartilhado (Global Store)

- **Como funciona:** os MFEs compartilham um estado centralizado (ex.: Redux,
  Zustand, ou um objeto observável simples) que vive no container/shell.
- **Quando usar:** dados que vários MFEs precisam ler/escrever de forma
  consistente — ex.: perfil do usuário, carrinho, feature flags.
- **Prós:** previsível, type-safe, mais fácil de depurar (DevTools), fonte única
  de verdade.
- **Contras:** acopla os MFEs ao contrato do store; mudanças no shape do estado
  afetam todos os consumidores.

```ts
// Store compartilhado (definido no container)
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// MFE A – define o usuário
useStore.getState().setUser(loggedInUser);

// MFE B – lê o usuário
const user = useStore((state) => state.user);
```

## Minha abordagem (mundo real)

Na **Seguralta**, combinamos os dois padrões:

- Store Redux compartilhado para dados de toda a aplicação (sessão do usuário,
  feature flags, config de tenant).
- Event bus para interações de UI ("abrir modal", "atualizar dashboard",
  "toast de notificação") — não precisavam persistir no estado e não queríamos
  poluir o store.

## Considerações-chave

- **Versionamento:** se o contrato do estado compartilhado muda, todos os MFEs
  precisam atualizar — ver [[shared-component-library-versioning|versionamento da lib compartilhada]].
- **Lazy Loading:** evite importar o store inteiro em cada MFE — use slices
  seletivos. Relacionado: [[react-code-splitting|code-splitting]].
- **Testes:** ambos os padrões são testáveis; o event bus exige espionar eventos,
  o estado compartilhado é fácil de mockar.

---

Voltar ao índice: [[nix-interview-prep|N-iX — Preparação para Entrevista]].
