---
title: "useMediaQuery (react to breakpoints and prefers-color-scheme)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

From the [[custom-hooks|Custom Hooks]] collection. Reads a media query via `matchMedia` and
re-renders when it changes — to decide layout in JS or react to the system theme.

```ts
import { useEffect, useState } from "react";

const useMediaQuery = (query: string): boolean => {
  // Guard against SSR: window doesn't exist on the server.
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange(); // sync on mount (the query may have changed).
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;
```

⚠️ Prefer CSS media queries for pure styling; use this hook when the decision changes the
**logic/JSX** (rendering different components, for example).

Example — pairs with the dark/light theme from the [[html-starter-template|HTML template]]:

```tsx
const isDark = useMediaQuery("(prefers-color-scheme: dark)");
const isWide = useMediaQuery("(min-width: 768px)");

return isWide ? <Sidebar /> : <Drawer />;
```

---

Related: [[custom-hooks|Custom Hooks]] · [[use-local-storage]] ·
[[html-starter-template|HTML template]].
