---
title: "useThrottle (cap how often a value updates)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

From the [[custom-hooks|Custom Hooks]] collection. Returns a copy of the value that changes
**at most once every `delay` ms**, even if the source changes constantly — the natural
pair of [[use-debounce]].

```ts
import { useEffect, useRef, useState } from "react";

const useThrottle = <T>(value: T, delay = 500): T => {
  const [throttled, setThrottled] = useState<T>(value);
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const remaining = delay - (Date.now() - lastRun.current);

    if (remaining <= 0) {
      lastRun.current = Date.now();
      setThrottled(value); // interval already elapsed: update now.
      return;
    }

    const id = setTimeout(() => {
      lastRun.current = Date.now();
      setThrottled(value); // guarantees the latest value (trailing edge).
    }, remaining);
    return () => clearTimeout(id);
  }, [value, delay]);

  return throttled;
};

export default useThrottle;
```

**Debounce vs throttle:** [[use-debounce]] waits for the source to **stop** for `delay` ms
(good for search-as-you-type); throttle releases at a **steady** cadence during continuous
movement (good for `scroll`, `resize`, mousemove).

Example — scroll position updated at most every 200 ms:

```tsx
const [pos, setPos] = useState(0);
useListener("scroll", () => setPos(window.scrollY), 0);
const throttledPos = useThrottle(pos, 200);
```

---

Related: [[custom-hooks|Custom Hooks]] · [[use-debounce]] · [[use-listener]].
