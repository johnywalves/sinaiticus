---
title: Closures
layout: base.njk
category: Snippets
tags: [python, conceitos]
---

Uma **closure** acontece quando uma função interna captura variáveis do
escopo onde foi definida, mesmo depois que esse escopo terminou de executar.

```python
def multiplicador(fator):
    def multiplica(n):
        return n * fator   # 'fator' é capturado pela closure
    return multiplica

dobro = multiplicador(2)
dobro(10)  # -> 20
```

São a base de mecanismos como [[python-decorators|decorators]].
