---
title: "useThrottle (limitar a frequência de atualização de um valor)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

Da coleção [[custom-hooks|Custom Hooks]]. Retorna uma cópia do valor que muda **no máximo
uma vez a cada `delay` ms**, mesmo que a fonte mude o tempo todo — par natural do
[[use-debounce]].

```ts
import { useEffect, useRef, useState } from "react";

const useThrottle = <T>(value: T, delay = 500): T => {
  const [throttled, setThrottled] = useState<T>(value);
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const remaining = delay - (Date.now() - lastRun.current);

    if (remaining <= 0) {
      lastRun.current = Date.now();
      setThrottled(value); // já passou o intervalo: atualiza na hora.
      return;
    }

    const id = setTimeout(() => {
      lastRun.current = Date.now();
      setThrottled(value); // garante o último valor (trailing edge).
    }, remaining);
    return () => clearTimeout(id);
  }, [value, delay]);

  return throttled;
};

export default useThrottle;
```

**Debounce × throttle:** o [[use-debounce]] espera a fonte **parar** por `delay` ms (bom
para busca enquanto digita); o throttle libera a uma cadência **regular** durante o
movimento contínuo (bom para `scroll`, `resize`, mousemove).

Exemplo — posição de scroll atualizada no máximo a cada 200 ms:

```tsx
const [pos, setPos] = useState(0);
useListener("scroll", () => setPos(window.scrollY), 0);
const throttledPos = useThrottle(pos, 200);
```

---

Relacionadas: [[custom-hooks|Custom Hooks]] · [[use-debounce]] · [[use-listener]].
