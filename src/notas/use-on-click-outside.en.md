---
title: "useOnClickOutside (detect a click outside an element)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

From the [[custom-hooks|Custom Hooks]] collection. Fires a callback when the user
clicks/taps **outside** a referenced element — the standard way to close dropdowns,
modals, and popovers.

```ts
import { useEffect, RefObject } from "react";

const useOnClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      // Ignore if the target is inside the element (or is the element itself).
      if (!el || el.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;
```

⚠️ Use `mousedown`/`touchstart` (not `click`): they close the menu **before** a `click`
on an outside button fires, avoiding conflicts. If you pass an inline `handler`, wrap it
in `useCallback` so the effect doesn't re-attach on every render.

Example — close a menu when clicking outside:

```tsx
const ref = useRef<HTMLDivElement>(null);
const [open, setOpen] = useState(true);
useOnClickOutside(ref, () => setOpen(false));

return open ? <div ref={ref}>Menu open</div> : null;
```

---

Related: [[custom-hooks|Custom Hooks]] · [[use-listener]].
