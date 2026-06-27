---
title: "useListener (listen to window events with debounce)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

From the [[custom-hooks|Custom Hooks]] collection. Watches a `window` event and fires the
callback after a small delay, avoiding excessive updates (e.g. `scroll`, `resize`).

```ts
import { useEffect, useRef } from "react";

const useListener = (type: keyof WindowEventMap, callback: () => void, delay = 0) => {
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedCallback = useRef(callback);

  // Keeps the current callback without re-attaching the listener (see Custom Hooks).
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => savedCallback.current(), delay);
    };

    window.addEventListener(type, handler);
    return () => window.removeEventListener(type, handler);
  }, [type, delay]);
};

export default useListener;
```

⚠️ Changes from the draft: `delay = 0` by default (without it, omitting `delay` left
`delay >= 0` false and the listener was never registered) and the portable type
`ReturnType<typeof setTimeout>` instead of `NodeJS.Timeout`.

Example — react to scroll at most every 200 ms:

```tsx
const onScroll = () => console.log(window.scrollY);
useListener("scroll", onScroll, 200);
```

---

Related: [[custom-hooks|Custom Hooks]] · [[use-debounce]].
