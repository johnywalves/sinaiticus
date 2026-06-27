---
title: "useInterval (run a function on an interval)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

From the [[custom-hooks|Custom Hooks]] collection. A declarative take on `setInterval`:
you pass the function and the `delay`, and the hook recreates and clears the timer on change.

```ts
import { useEffect, useRef } from "react";

const useInterval = (callback: () => void, delay?: number) => {
  const savedCallback = useRef(callback);

  // Keeps the current callback without restarting the interval (see Custom Hooks).
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay == null) return; // a null/undefined delay pauses the interval.
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;
```

⚠️ Changes from the draft: `clearInterval` (the draft cleared with `clearTimeout`) and a
`[delay]` dependency, so changing `delay` restarts the interval and `null` pauses it.

Example — a seconds counter:

```tsx
const [secs, setSecs] = useState(0);
useInterval(() => setSecs((s) => s + 1), 1000);
```

---

Related: [[custom-hooks|Custom Hooks]] · [[use-listener]].
