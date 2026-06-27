---
title: "useInterval (executar uma função em intervalos)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

Da coleção [[custom-hooks|Custom Hooks]]. Versão declarativa do `setInterval`: você passa
a função e o `delay`, e o hook cuida de recriar e limpar o timer a cada mudança.

```ts
import { useEffect, useRef } from "react";

const useInterval = (callback: () => void, delay?: number) => {
  const savedCallback = useRef(callback);

  // Mantém o callback atual sem reiniciar o intervalo (ver Custom Hooks).
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay == null) return; // delay nulo/undefined pausa o intervalo.
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;
```

⚠️ Ajustes em relação ao rascunho: `clearInterval` (o rascunho limpava com `clearTimeout`)
e dependência `[delay]`, então mudar o `delay` reinicia o intervalo e `null` o pausa.

Exemplo — contador de segundos:

```tsx
const [secs, setSecs] = useState(0);
useInterval(() => setSecs((s) => s + 1), 1000);
```

---

Relacionadas: [[custom-hooks|Custom Hooks]] · [[use-listener]].
