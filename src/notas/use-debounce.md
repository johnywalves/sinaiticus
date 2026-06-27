---
title: "useDebounce (atrasar um valor reativo)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

Da coleção [[custom-hooks|Custom Hooks]]. Retorna uma cópia do valor que só atualiza
depois que ele para de mudar por `delay` ms — ideal para não reagir a cada tecla num input.

```ts
import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay = 500): T => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // cancela se o valor mudar antes do prazo.
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
```

⚠️ Ajustes em relação ao rascunho: o original usava `useRef` sem importá-lo; aqui o timer
vive numa variável local do efeito, dispensando a ref.

Exemplo — buscar só quando o usuário pausa a digitação:

```tsx
const [query, setQuery] = useState("");
const debounced = useDebounce(query, 400);

useEffect(() => {
  if (debounced) fetchResults(debounced);
}, [debounced]);
```

---

Relacionadas: [[custom-hooks|Custom Hooks]] · [[use-listener]] ·
[[react-performance|performance em React]].
