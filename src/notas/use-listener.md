---
title: "useListener (ouvir eventos da window com debounce)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

Da coleção [[custom-hooks|Custom Hooks]]. Observa um evento da `window` e dispara o
callback com um pequeno atraso, evitando atualizações em excesso (ex.: `scroll`, `resize`).

```ts
import { useEffect, useRef } from "react";

const useListener = (type: keyof WindowEventMap, callback: () => void, delay = 0) => {
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedCallback = useRef(callback);

  // Mantém o callback atual sem reanexar o listener (ver Custom Hooks).
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

⚠️ Ajustes em relação ao rascunho: `delay = 0` por padrão (sem isso, omitir o `delay`
deixava `delay >= 0` falso e o listener nunca era registrado) e o tipo portável
`ReturnType<typeof setTimeout>` no lugar de `NodeJS.Timeout`.

Exemplo — reagir ao scroll no máximo a cada 200 ms:

```tsx
const onScroll = () => console.log(window.scrollY);
useListener("scroll", onScroll, 200);
```

---

Relacionadas: [[custom-hooks|Custom Hooks]] · [[use-debounce]].
