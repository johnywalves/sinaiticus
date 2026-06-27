---
title: "useOnClickOutside (detectar clique fora de um elemento)"
layout: base.njk
category: Snippets
tags: [react, hooks]
---

Da coleção [[custom-hooks|Custom Hooks]]. Dispara um callback quando o usuário clica/toca
**fora** de um elemento referenciado — o jeito padrão de fechar dropdowns, modais e popovers.

```ts
import { useEffect, RefObject } from "react";

const useOnClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      // Ignora se o alvo está dentro do elemento (ou é ele mesmo).
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

⚠️ Use `mousedown`/`touchstart` (não `click`): fecham o menu **antes** do `click` em um
botão externo disparar, evitando conflitos. Se passar um `handler` inline, envolva-o em
`useCallback` para o efeito não reanexar a cada render.

Exemplo — fechar um menu ao clicar fora:

```tsx
const ref = useRef<HTMLDivElement>(null);
const [open, setOpen] = useState(true);
useOnClickOutside(ref, () => setOpen(false));

return open ? <div ref={ref}>Menu aberto</div> : null;
```

---

Relacionadas: [[custom-hooks|Custom Hooks]] · [[use-listener]].
