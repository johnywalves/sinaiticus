---
title: "useLocalStorage (estado persistido no localStorage)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

Da coleção [[custom-hooks|Custom Hooks]]. Funciona como `useState`, mas espelha o valor
no `localStorage` — sobrevive a recarregar a página (tema, preferências, rascunhos).

```ts
import { useState } from "react";

const useLocalStorage = <T>(key: string, initial: T) => {
  // Lazy init: lê o storage só uma vez, no mount.
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initial;
    } catch {
      return initial; // SSR ou storage indisponível.
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    setStored((prev) => {
      const next = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Quota cheia ou modo privado: mantém só em memória.
      }
      return next;
    });
  };

  return [stored, setValue] as const;
};

export default useLocalStorage;
```

⚠️ O `try/catch` cobre **SSR** (Next.js: `window` não existe no servidor) e modo privado.
Aceita um updater funcional (`setValue(v => ...)`), igual ao `useState`.

Exemplo — alternar tema e lembrar a escolha:

```tsx
const [theme, setTheme] = useLocalStorage("theme", "light");
const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
```

---

Relacionadas: [[custom-hooks|Custom Hooks]] · [[use-media-query]].
