---
title: "useLocalStorage (state persisted in localStorage)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

From the [[custom-hooks|Custom Hooks]] collection. Works like `useState`, but mirrors the
value to `localStorage` — it survives a page reload (theme, preferences, drafts).

```ts
import { useState } from "react";

const useLocalStorage = <T>(key: string, initial: T) => {
  // Lazy init: reads the storage only once, on mount.
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initial;
    } catch {
      return initial; // SSR or storage unavailable.
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    setStored((prev) => {
      const next = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Quota full or private mode: keep it in memory only.
      }
      return next;
    });
  };

  return [stored, setValue] as const;
};

export default useLocalStorage;
```

⚠️ The `try/catch` covers **SSR** (Next.js: `window` doesn't exist on the server) and
private mode. It accepts a functional updater (`setValue(v => ...)`), just like `useState`.

Example — toggle a theme and remember the choice:

```tsx
const [theme, setTheme] = useLocalStorage("theme", "light");
const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
```

---

Related: [[custom-hooks|Custom Hooks]] · [[use-media-query]].
