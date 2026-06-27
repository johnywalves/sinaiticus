---
title: "useMediaQuery (reagir a breakpoints e prefers-color-scheme)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

Da coleção [[custom-hooks|Custom Hooks]]. Lê uma media query via `matchMedia` e re-renderiza
quando ela muda — para decidir layout no JS ou reagir ao tema do sistema.

```ts
import { useEffect, useState } from "react";

const useMediaQuery = (query: string): boolean => {
  // Guarda contra SSR: window não existe no servidor.
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange(); // sincroniza no mount (query pode ter mudado).
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;
```

⚠️ Prefira media queries em **CSS** para estilo puro; use este hook quando a decisão
muda a **lógica/JSX** (renderizar componentes diferentes, por exemplo).

Exemplo — combina com o tema dark/light do [[html-starter-template|template HTML]]:

```tsx
const isDark = useMediaQuery("(prefers-color-scheme: dark)");
const isWide = useMediaQuery("(min-width: 768px)");

return isWide ? <Sidebar /> : <Drawer />;
```

---

Relacionadas: [[custom-hooks|Custom Hooks]] · [[use-local-storage]] ·
[[html-starter-template|template HTML]].
