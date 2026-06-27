---
title: "useDebounce (delay a reactive value)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

From the [[custom-hooks|Custom Hooks]] collection. Returns a copy of the value that only
updates after it stops changing for `delay` ms — ideal to avoid reacting to every keystroke.

```ts
import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay = 500): T => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // cancels if the value changes before the deadline.
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
```

⚠️ Changes from the draft: the original used `useRef` without importing it; here the timer
lives in a local variable of the effect, dropping the ref entirely.

Example — search only when the user pauses typing:

```tsx
const [query, setQuery] = useState("");
const debounced = useDebounce(query, 400);

useEffect(() => {
  if (debounced) fetchResults(debounced);
}, [debounced]);
```

---

Related: [[custom-hooks|Custom Hooks]] · [[use-listener]] ·
[[react-performance|React performance]].
