---
title: "Comunicação entre Micro-frontends"
layout: base.njk
category: Frontend
tags: [micro-frontends, frontend, architecture, interview]
---

In a micro-frontend architecture, each MFE is an independently deployable
application. They need to communicate without tight coupling. There are two
primary patterns.

## 1. Event Bus (Pub-Sub)
- **How it works:** MFEs publish and subscribe to events via a global event bus
  (e.g., using `window.dispatchEvent` + `addEventListener`, or a library like
  `mitt` or `EventEmitter`).
- **When to use:** For loosely coupled, broadcast-style communication — e.g.,
  "user logged in", "cart updated", "theme changed".
- **Pros:** Decoupled, easy to add new listeners without modifying senders.
- **Cons:** Harder to debug (events fire and forget), no type safety by default.

```ts
// MFE A – publishes an event
window.dispatchEvent(new CustomEvent('user:logout'));

// MFE B – listens for the event
window.addEventListener('user:logout', () => {
  // clear session, redirect, etc.
});
```

## 2. Shared State (Global Store)
- **How it works:** MFEs share a single, centralized state (e.g., Redux,
  Zustand, or a simple observable object) that lives in the container/shell app.
- **When to use:** For data that multiple MFEs need to read/write consistently —
  e.g., user profile, shopping cart, feature flags.
- **Pros:** Predictable, type-safe, easier to debug (DevTools), single source of
  truth.
- **Cons:** Couples MFEs to the store contract; changes to state shape affect all
  consumers.

```ts
// Shared store (defined in the container)
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// MFE A – sets the user
useStore.getState().setUser(loggedInUser);

// MFE B – reads the user
const user = useStore((state) => state.user);
```

## My Approach (Real-World)
In **Seguralta**, we combined both patterns:
- Shared Redux store for application-wide data (user session, feature flags,
  tenant config).
- Event bus for UI-level interactions ("open modal", "refresh dashboard",
  "toast notification") — they didn't need to persist in state and we didn't
  want to pollute the store.

## Key Considerations
- **Versioning:** If the shared state contract changes, all MFEs need to update —
  ver [[shared-component-library-versioning|versionamento da lib compartilhada]].
- **Lazy Loading:** Avoid importing the entire store into every MFE — use
  selective slices. Relacionado: [[react-code-splitting|code-splitting]].
- **Testing:** Both patterns are testable; event bus requires spying on events,
  shared state can be mocked easily.

---
Voltar ao índice: [[nix-interview-prep|N-iX — Preparação para Entrevista]].
